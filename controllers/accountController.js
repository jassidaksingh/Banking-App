const Account = require('../models/account');
const Transaction = require('../models/transaction');

class AccountController {
    // Create a new account
    static createAccount(req, res) {
        const { account_holder_name } = req.body;

        // Input validation
        if (!account_holder_name || account_holder_name.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Account holder name is required'
            });
        }

        Account.createAccount(account_holder_name.trim(), (err, account) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error creating account',
                    error: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: 'Account created successfully',
                data: account
            });
        });
    }

    // Deposit money
    static depositMoney(req, res) {
        const { accountNumber } = req.params;
        const { amount, description } = req.body;

        // Input validation
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be greater than 0'
            });
        }

        Account.getAccountByNumber(accountNumber, (err, account) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error retrieving account',
                    error: err.message
                });
            }

            if (!account) {
                return res.status(404).json({
                    success: false,
                    message: 'Account not found'
                });
            }

            const newBalance = parseFloat(account.balance) + parseFloat(amount);

            // Update account balance
            Account.updateBalance(accountNumber, newBalance, (err, updatedAccount) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Error updating account balance',
                        error: err.message
                    });
                }

                // Create transaction record
                Transaction.createTransaction(
                    accountNumber,
                    'deposit',
                    parseFloat(amount),
                    newBalance,
                    description || `Deposit of $${amount}`,
                    (err, transaction) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: 'Error creating transaction record',
                                error: err.message
                            });
                        }

                        res.json({
                            success: true,
                            message: 'Deposit successful',
                            data: {
                                account: updatedAccount,
                                transaction: transaction
                            }
                        });
                    }
                );
            });
        });
    }

    // Withdraw money
    static withdrawMoney(req, res) {
        const { accountNumber } = req.params;
        const { amount, description } = req.body;

        // Input validation
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be greater than 0'
            });
        }

        Account.getAccountByNumber(accountNumber, (err, account) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error retrieving account',
                    error: err.message
                });
            }

            if (!account) {
                return res.status(404).json({
                    success: false,
                    message: 'Account not found'
                });
            }

            const withdrawAmount = parseFloat(amount);
            const currentBalance = parseFloat(account.balance);

            // Check if sufficient balance
            if (currentBalance < withdrawAmount) {
                return res.status(400).json({
                    success: false,
                    message: 'Insufficient balance'
                });
            }

            const newBalance = currentBalance - withdrawAmount;

            // Update account balance
            Account.updateBalance(accountNumber, newBalance, (err, updatedAccount) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Error updating account balance',
                        error: err.message
                    });
                }

                // Create transaction record
                Transaction.createTransaction(
                    accountNumber,
                    'withdrawal',
                    withdrawAmount,
                    newBalance,
                    description || `Withdrawal of $${amount}`,
                    (err, transaction) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: 'Error creating transaction record',
                                error: err.message
                            });
                        }

                        res.json({
                            success: true,
                            message: 'Withdrawal successful',
                            data: {
                                account: updatedAccount,
                                transaction: transaction
                            }
                        });
                    }
                );
            });
        });
    }

    // Get account details
    static getAccountDetails(req, res) {
        const { accountNumber } = req.params;

        Account.getAccountByNumber(accountNumber, (err, account) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error retrieving account',
                    error: err.message
                });
            }

            if (!account) {
                return res.status(404).json({
                    success: false,
                    message: 'Account not found'
                });
            }

            res.json({
                success: true,
                data: account
            });
        });
    }

    // Get transaction history
    static getTransactionHistory(req, res) {
        const { accountNumber } = req.params;

        Account.getAccountByNumber(accountNumber, (err, account) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error retrieving account',
                    error: err.message
                });
            }

            if (!account) {
                return res.status(404).json({
                    success: false,
                    message: 'Account not found'
                });
            }

            Transaction.getTransactionsByAccountNumber(accountNumber, (err, transactions) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Error retrieving transactions',
                        error: err.message
                    });
                }

                res.json({
                    success: true,
                    data: {
                        account_number: account.account_number,
                        account_holder_name: account.account_holder_name,
                        transactions: transactions
                    }
                });
            });
        });
    }
}

module.exports = AccountController;
