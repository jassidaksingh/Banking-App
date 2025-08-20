const Account = require('../models/account');
const Transaction = require('../models/transaction');

class AccountController {
    // Create a new account
    static createAccount(req, res) {
        const { account_holder_name } = req.body;

        if (!account_holder_name || account_holder_name.trim() === '') {
            return res.status(400).json({ success: false, message: 'Account holder name is required' });
        }

        Account.createAccount(account_holder_name.trim(), (err, account) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error creating account' });
            }
            res.status(201).json({ success: true, message: 'Account created successfully', account });
        });
    }

    // Deposit money
    static depositMoney(req, res) {
        const { accountNumber } = req.params;
        const { amount, description } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Amount must be greater than 0' });
        }

        Account.getAccountByNumber(accountNumber, (err, account) => {
            if (err || !account) {
                return res.status(404).json({ success: false, message: 'Account not found' });
            }

            const newBalance = parseFloat(account.balance) + parseFloat(amount);

            Account.updateBalance(accountNumber, newBalance, (err, updatedAccount) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Error updating balance' });
                }

                Transaction.createTransaction(
                    accountNumber, 'deposit', parseFloat(amount), newBalance,
                    description || `Deposit of $${amount}`,
                    (err, transaction) => {
                        if (err) {
                            return res.status(500).json({ success: false, message: 'Error recording transaction' });
                        }
                        res.json({ success: true, message: 'Deposit successful', account: updatedAccount, transaction });
                    }
                );
            });
        });
    }

    // Withdraw money
    static withdrawMoney(req, res) {
        const { accountNumber } = req.params;
        const { amount, description } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Amount must be greater than 0' });
        }

        Account.getAccountByNumber(accountNumber, (err, account) => {
            if (err || !account) {
                return res.status(404).json({ success: false, message: 'Account not found' });
            }

            const withdrawAmount = parseFloat(amount);
            const currentBalance = parseFloat(account.balance);

            if (currentBalance < withdrawAmount) {
                return res.status(400).json({ success: false, message: 'Insufficient balance' });
            }

            const newBalance = currentBalance - withdrawAmount;

            Account.updateBalance(accountNumber, newBalance, (err, updatedAccount) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Error updating balance' });
                }

                Transaction.createTransaction(
                    accountNumber, 'withdrawal', withdrawAmount, newBalance,
                    description || `Withdrawal of $${amount}`,
                    (err, transaction) => {
                        if (err) {
                            return res.status(500).json({ success: false, message: 'Error recording transaction' });
                        }
                        res.json({ success: true, message: 'Withdrawal successful', account: updatedAccount, transaction });
                    }
                );
            });
        });
    }

    // Get account details
    static getAccountDetails(req, res) {
        const { accountNumber } = req.params;

        Account.getAccountByNumber(accountNumber, (err, account) => {
            if (err || !account) {
                return res.status(404).json({ success: false, message: 'Account not found' });
            }
            res.json({ success: true, message: 'Account retrieved successfully', account });
        });
    }

    // Get transaction history
    static getTransactionHistory(req, res) {
        const { accountNumber } = req.params;

        Account.getAccountByNumber(accountNumber, (err, account) => {
            if (err || !account) {
                return res.status(404).json({ success: false, message: 'Account not found' });
            }

            Transaction.getTransactionsByAccountNumber(accountNumber, (err, transactions) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Error retrieving transactions' });
                }
                res.json({ 
                    success: true,
                    message: 'Transaction history retrieved successfully',
                    account_number: account.account_number,
                    account_holder_name: account.account_holder_name,
                    transactions 
                });
            });
        });
    }
}

module.exports = AccountController;