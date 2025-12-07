const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../config/db');

// GET all users
router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT email, fname, mname, lname, phone, registration_date
      FROM [User]
      ORDER BY registration_date DESC
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

module.exports = router;
