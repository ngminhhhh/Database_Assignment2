const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../config/db');

// GET all orders
router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT 
        o.*,
        c.customer_id,
        u.fname,
        u.lname,
        u.email
      FROM [Order] o
      JOIN Customer c ON o.customer_id = c.customer_id
      JOIN [User] u ON c.email = u.email
      ORDER BY o.order_date DESC
    `);
    
    res.json({
      success: true,
      count: result.recordset.length,
      data: result.recordset
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single order
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query(`
        SELECT 
          o.*,
          c.customer_id,
          u.fname,
          u.lname,
          u.email
        FROM [Order] o
        JOIN Customer c ON o.customer_id = c.customer_id
        JOIN [User] u ON c.email = u.email
        WHERE o.order_id = @id
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({ success: true, data: result.recordset[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST: Tạo đơn hàng mới (Transaction)
router.post('/create', async (req, res) => {
    const transaction = new sql.Transaction();
    try {
        const { 
            customer_id, product_id, quantity, unit_price, // Thông tin hàng
            recipient_name, recipient_address, phone,      // Thông tin giao hàng
            payment_method, voucher_code, shipment_fee     // Thanh toán
        } = req.body;

        await transaction.begin();

        // 1. Tạo Order (Trạng thái PENDING)
        const orderRequest = new sql.Request(transaction);
        const orderResult = await orderRequest.query`
            INSERT INTO [Order] (customer_id, status_, total_amount)
            VALUES (${customer_id}, 'PENDING', 0); -- Total sẽ được Trigger cập nhật hoặc tính sau
            SELECT SCOPE_IDENTITY() AS order_id;
        `;
        const orderId = orderResult.recordset[0].order_id;

        // 2. Tạo OrderDetail
        const detailRequest = new sql.Request(transaction);
        await detailRequest.query`
            INSERT INTO OrderDetail (order_id, product_id, unit_price, quantity)
            VALUES (${orderId}, ${product_id}, ${unit_price}, ${quantity})
        `;

        // 3. Tạo Shipment
        const shipRequest = new sql.Request(transaction);
        await shipRequest.query`
            INSERT INTO Shipment (order_id, company_name, shipment_fee, recipient_address, recipient_name, is_cod)
            VALUES (${orderId}, 'Giao Hang Nhanh', ${shipment_fee}, ${recipient_address}, ${recipient_name}, 
            ${payment_method === 'CASH' ? 1 : 0})
        `;

        // 4. Áp dụng Voucher (Nếu có)
        if (voucher_code) {
            const voucherRequest = new sql.Request(transaction);
            // Kiểm tra voucher hợp lệ không (giản lược)
            await voucherRequest.query`
                INSERT INTO Order_Voucher (order_id, voucher_code)
                VALUES (${orderId}, ${voucher_code})
            `;
        }

        // 5. Tạo Payment
        // Tính tạm total (Lẽ ra nên để Trigger DB tính, nhưng Payment cần số tiền ngay)
        // Lưu ý: Logic này nên đồng bộ với DB. Ở đây ta tính sơ bộ để insert Payment.
        let discount = 0;
        if(voucher_code) {
             const vRes = await new sql.Request(transaction).query`SELECT discount_value FROM Voucher WHERE code=${voucher_code}`;
             if(vRes.recordset.length > 0) discount = vRes.recordset[0].discount_value;
        }
        const finalAmount = (unit_price * quantity) + shipment_fee - discount;

        const paymentRequest = new sql.Request(transaction);
        await paymentRequest.query`
            INSERT INTO Payment (order_id, amount, method, status)
            VALUES (${orderId}, ${finalAmount > 0 ? finalAmount : 0}, ${payment_method}, 'UNPAID')
        `;

        // Commit transaction
        await transaction.commit();

        res.json({ success: true, message: 'Đặt hàng thành công', order_id: orderId });

    } catch (err) {
        if (transaction) await transaction.rollback();
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ----------------------------------------------------------------
// 1. API GỌI STORED PROCEDURE: Báo cáo doanh thu tháng
// Route: GET /api/orders/stats/monthly
// ----------------------------------------------------------------
router.get('/stats/monthly', async (req, res) => {
  try {
    // Lấy tham số từ query string (VD: ?seller_id=SEL0001&month=12&year=2025)
    const { seller_id, month, year } = req.query;

    // Validate dữ liệu đầu vào (Input Validation)
    if (!seller_id || !month || !year) {
      return res.status(400).json({ 
        success: false, 
        message: 'Thiếu thông tin: seller_id, month hoặc year là bắt buộc.' 
      });
    }

    // Kết nối và thực thi
    const request = new sql.Request();
    
    // Map tham số vào Stored Procedure (Dựa theo file function_procedure.sql)
    request.input('seller_id', sql.VarChar(8), seller_id);
    request.input('month', sql.Int, parseInt(month));
    request.input('year', sql.Int, parseInt(year));

    // Thực thi lệnh EXEC sp_GetSellerMonthlyStats
    const result = await request.execute('sp_GetSellerMonthlyStats');

    // Trả kết quả về Frontend
    res.json({
      success: true,
      data: result.recordset
    });

  } catch (err) {
    console.error("Lỗi gọi Procedure:", err.message);
    res.status(500).json({ 
      success: false, 
      error: err.message,
      detail: "Kiểm tra lại xem Stored Procedure 'sp_GetSellerMonthlyStats' đã được tạo trong DB chưa?"
    });
  }
});

// ----------------------------------------------------------------
// 2. CÁC API KHÁC (GET ALL, GET BY SELLER...) - ĐỂ DƯỚI ĐÂY
// ----------------------------------------------------------------

// Lấy danh sách đơn hàng cho Admin
router.get('/', async (req, res) => {
    // ... (Code cũ giữ nguyên)
    try {
        const result = await sql.query`SELECT * FROM [Order] ORDER BY order_date DESC`;
        res.json({ success: true, data: result.recordset });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Lấy đơn hàng theo Seller ID
router.get('/seller/:sellerId', async (req, res) => {
    // ... (Code cũ giữ nguyên)
    try {
        const { sellerId } = req.params;
        // Query lấy đơn hàng của seller...
        const result = await sql.query`SELECT * FROM OrderDetail ... WHERE seller_id = ${sellerId}`; 
        res.json({ success: true, data: result.recordset });
    } catch (err) { res.status(500).json({ error: err.message }); }
});


module.exports = router;
