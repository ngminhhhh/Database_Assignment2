const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'E-Commerce API Server',
    status: 'running',
    timestamp: new Date()
  });
});

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    error: err.message
  });
});

// Import connectDB
const { connectDB } = require('./config/db');

// Start server function
async function startServer() {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ SQL Server Connected Successfully!');
    
    // Start Express server
    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
    
    // Handle server errors
    server.on('error', (err) => {
      console.error('Server error:', err.message);
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
        process.exit(1);
      }
    }); 
    
    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('\nSIGTERM received, closing server...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
    
    process.on('SIGINT', () => {
      console.log('\nSIGINT received (Ctrl+C), closing server...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
    
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
} 

// Start the server
startServer();
