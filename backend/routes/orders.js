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

module.exports = router;
