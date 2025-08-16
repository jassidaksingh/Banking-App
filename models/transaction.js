const { db } = require('../database');

class Transaction {
    // Create a new transaction
    static createTransaction(accountNumber, type, amount, balanceAfter, description, callback) {
        const query = `
            INSERT INTO transactions (account_number, type, amount, balance_after, description)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        db.run(query, [accountNumber, type, amount, balanceAfter, description], function(err) {
            if (err) {
                return callback(err, null);
            }
            
            // Return the created transaction
            Transaction.getTransactionById(this.lastID, callback);
        });
    }

    // Get transaction by ID
    static getTransactionById(transactionId, callback) {
        const query = 'SELECT * FROM transactions WHERE id = ?';
        
        db.get(query, [transactionId], (err, row) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, row);
        });
    }


}

module.exports = Transaction;
