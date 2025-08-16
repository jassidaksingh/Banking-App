const express = require('express');
const { initializeDatabase } = require('./database');
const accountRoutes = require('./routes/accountsRoutes');

const app = express();

// Initialize database
initializeDatabase();

// Middleware
app.use(express.json());

// Routes
app.use('/api/accounts', accountRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Banking App API',
        version: '1.0.0',
        endpoints: {
            'POST /api/accounts/create': 'Create a new account',
            'POST /api/accounts/deposit/:accountNumber': 'Deposit money',
            'POST /api/accounts/withdraw/:accountNumber': 'Withdraw money'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

// Handle 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

module.exports = app;
