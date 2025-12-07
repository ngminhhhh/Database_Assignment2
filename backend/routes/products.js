const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../config/db');

// GET all products với filter & sort
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sortBy = 'upload_date', order = 'DESC' } = req.query;
    
    const pool = getPool();
    const request = pool.request();
    
    let query = `
      SELECT 
        p.product_id,
        p.name,
        p.description,
        p.price,
        p.stock_quantity,
        p.upload_date,
        s.seller_id,
        s.store_name,
        s.email as seller_email
      FROM Product p
      JOIN Seller s ON p.seller_id = s.seller_id
      WHERE 1=1
    `;
    
    // Filter by price range (parameterized)
    if (minPrice) {
      query += ` AND p.price >= @minPrice`;
      request.input('minPrice', sql.Decimal(10, 2), parseFloat(minPrice));
    }
    
    if (maxPrice) {
      query += ` AND p.price <= @maxPrice`;
      request.input('maxPrice', sql.Decimal(10, 2), parseFloat(maxPrice));
    }
    
    // Filter by category (parameterized)
    if (category) {
      query += ` AND EXISTS (
        SELECT 1 FROM Product_Category pc 
        WHERE pc.product_id = p.product_id 
        AND pc.category_id = @category
      )`;
      request.input('category', sql.Int, parseInt(category));
    }
    
    // Sorting (whitelist validation)
    const validSortColumns = ['product_id', 'name', 'price', 'upload_date', 'stock_quantity'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'upload_date';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    query += ` ORDER BY p.${sortColumn} ${sortOrder}`;
    
    const result = await request.query(query);
    
    res.json({
      success: true,
      count: result.recordset.length,
      data: result.recordset
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// GET single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query(`
        SELECT 
          p.*,
          s.store_name,
          s.email as seller_email
        FROM Product p
        JOIN Seller s ON p.seller_id = s.seller_id
        WHERE p.product_id = @id
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: result.recordset[0]
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// POST create new product
router.post('/', async (req, res) => {
  try {
    const { seller_id, name, description, price, stock_quantity } = req.body;
    
    if (!seller_id || !name || !price) {
      return res.status(400).json({
        success: false,
        message: 'seller_id, name, and price are required'
      });
    }
    
    const pool = getPool();
    const result = await pool.request()
      .input('seller_id', sql.VarChar, seller_id)
      .input('name', sql.NVarChar, name)
      .input('description', sql.NVarChar, description || null)
      .input('price', sql.Decimal(10, 2), price)
      .input('stock_quantity', sql.Int, stock_quantity || 0)
      .query(`
        INSERT INTO Product (seller_id, name, description, price, stock_quantity)
        VALUES (@seller_id, @name, @description, @price, @stock_quantity);
        SELECT SCOPE_IDENTITY() AS product_id;
      `);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        product_id: result.recordset[0].product_id,
        name,
        price
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock_quantity } = req.body;
    
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .input('name', sql.NVarChar, name)
      .input('description', sql.NVarChar, description)
      .input('price', sql.Decimal(10, 2), price)
      .input('stock_quantity', sql.Int, stock_quantity)
      .query(`
        UPDATE Product
        SET 
          name = COALESCE(@name, name),
          description = COALESCE(@description, description),
          price = COALESCE(@price, price),
          stock_quantity = COALESCE(@stock_quantity, stock_quantity)
        WHERE product_id = @id
      `);
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product updated successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query('DELETE FROM Product WHERE product_id = @id');
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;
