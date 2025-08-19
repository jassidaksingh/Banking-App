const { db } = require('../database');

class User {
    // Create a new user
    static create(username, password, callback) {
        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.run(query, [username, password], callback);
    }

    // Find user by login credentials
    static findByCredentials(username, password, callback) {
        const query = 'SELECT id, username FROM users WHERE username = ? AND password = ?';
        db.get(query, [username, password], callback);
    }
}

module.exports = User;