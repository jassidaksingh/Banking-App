const { db } = require('../database');

class Account {
    // Create a new account
    static createAccount(accountHolderName, callback) {
        const accountNumber = 'ACC' + Date.now().toString().slice(-7);
        
        const query = `
            INSERT INTO accounts (account_number, account_holder_name, balance)
            VALUES (?, ?, 0.0)
        `;
        
        db.run(query, [accountNumber, accountHolderName], function(err) {
            if (err) {
                return callback(err, null);
            }
            
            // Return the created account details
            Account.getAccountByNumber(accountNumber, callback);
        });
    }

    // Get account by account number
    static getAccountByNumber(accountNumber, callback) {
        const query = 'SELECT * FROM accounts WHERE account_number = ?';
        
        db.get(query, [accountNumber], (err, row) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, row);
        });
    }

    // Update account balance
    static updateBalance(accountNumber, newBalance, callback) {
        const query = 'UPDATE accounts SET balance = ? WHERE account_number = ?';
        
        db.run(query, [newBalance, accountNumber], function(err) {
            if (err) {
                return callback(err, null);
            }
            
            Account.getAccountByNumber(accountNumber, callback);
        });
    }
}

module.exports = Account;
