const express = require('express');
const router = express.Router();
const { sql } = require('../config/db');

// Lấy danh sách Voucher còn hạn
router.get('/', async (req, res) => {
  try {
    const result = await sql.query`
      SELECT * FROM Voucher 
      WHERE start_date <= GETDATE() 
      AND end_date >= GETDATE() 
      AND quantity > 0
    `;
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;