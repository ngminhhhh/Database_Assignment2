const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../config/db');

// API Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- TRƯỜNG HỢP ĐẶC BIỆT: sManager ---
    // Giả lập đăng nhập quản trị viên
    if (email === 'smanager@example.com') {
        // Password quy định cho sManager trên App (có thể khác password SQL)
        if (password === 'admin123') { 
            return res.json({
                success: true,
                user: {
                    email: 'smanager@example.com',
                    fname: 'System Manager',
                    role: 'ADMIN' // Đánh dấu role Admin
                }
            });
        } else {
            return res.status(401).json({ success: false, message: 'Sai mật khẩu quản trị!' });
        }
    }

    // --- TRƯỜNG HỢP USER THƯỜNG ---
    // Kiểm tra email trong database
    const pool = getPool();
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM [User] WHERE email = @email');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Email không tồn tại trong hệ thống.' });
    }

    const user = result.recordset[0];
    
    // Vì User thường trong BTL1 không có mật khẩu, ta cho phép đăng nhập luôn
    res.json({
      success: true,
      user: {
        ...user,
        role: 'CUSTOMER'
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;