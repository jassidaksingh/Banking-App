const express = require('express');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
const { initializeDatabase } = require('./database');
const accountRoutes = require('./routes/accountsRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Initialize database
initializeDatabase();

// Session middleware (simple in-memory sessions)
app.use(session({
    secret: 'banking-app-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Middleware
app.use(express.json());

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Banking App API',
        docs: 'http://localhost:3000/api-docs',
        endpoints: {
            'POST /api/auth/register': 'Register a new user',
            'POST /api/auth/login': 'Login user',
            'POST /api/auth/logout': 'Logout user',
            'POST /api/accounts/create': 'Create a new account',
            'POST /api/accounts/deposit/:accountNumber': 'Deposit money',
            'POST /api/accounts/withdraw/:accountNumber': 'Withdraw money',
            'GET /api/accounts/:accountNumber': 'Get account details',
            'GET /api/accounts/transactions/:accountNumber': 'Get transaction history'
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
