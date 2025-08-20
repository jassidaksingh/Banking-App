const User = require('../models/user');

class AuthController {
    // Register a new user
    static register(req, res) {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password required' });
        }

        User.create(username, password, (err) => {
            if (err) {
                return res.status(400).json({ success: false, message: 'Username already exists' });
            }
            res.status(201).json({ success: true, message: 'User registered successfully' });
        });
    }

    // Login user
    static login(req, res) {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password required' });
        }

        User.findByCredentials(username, password, (err, user) => {
            if (err || !user) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            req.session.userId = user.id;
            req.session.username = user.username;
            res.json({ success: true, message: 'Login successful' });
        });
    }

    // Logout user
    static logout(req, res) {
        req.session.destroy();
        res.json({ success: true, message: 'Logout successful' });
    }
}

module.exports = AuthController;