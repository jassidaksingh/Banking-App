const Account = require('../models/account');
const Transaction = require('../models/transaction');

// Mock the database
jest.mock('../database', () => ({
    db: {
        run: jest.fn(),
        get: jest.fn()
    }
}));

const { db } = require('../database');

describe('Model Functions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test Account.createAccount
    test('Account.createAccount should create account with valid name', (done) => {
        const mockAccount = {
            account_number: 'ACC12345678',
            account_holder_name: 'John Doe',
            balance: 0
        };

        // Mock successful database insert
        db.run.mockImplementation((query, params, callback) => {
            callback(null);
        });

        // Mock getting the created account
        db.get.mockImplementation((query, params, callback) => {
            callback(null, mockAccount);
        });

        Account.createAccount('John Doe', (err, account) => {
            expect(err).toBeNull();
            expect(account.account_holder_name).toBe('John Doe');
            expect(account.balance).toBe(0);
            done();
        });
    });

    // Test Account.updateBalance
    test('Account.updateBalance should update balance correctly', (done) => {
        const updatedAccount = {
            account_number: 'ACC12345678',
            balance: 500
        };

        db.run.mockImplementation((query, params, callback) => {
            callback(null);
        });

        db.get.mockImplementation((query, params, callback) => {
            callback(null, updatedAccount);
        });

        Account.updateBalance('ACC12345678', 500, (err, account) => {
            expect(err).toBeNull();
            expect(account.balance).toBe(500);
            done();
        });
    });

    // Test Transaction.createTransaction
    test('Transaction.createTransaction should create transaction record', (done) => {
        const mockTransaction = {
            id: 1,
            account_number: 'ACC12345678',
            type: 'deposit',
            amount: 500,
            balance_after: 500
        };

        db.run.mockImplementation((query, params, callback) => {
            callback.call({ lastID: 1 }, null);
        });

        db.get.mockImplementation((query, params, callback) => {
            callback(null, mockTransaction);
        });

        Transaction.createTransaction('ACC12345678', 'deposit', 500, 500, 'Test deposit', (err, transaction) => {
            expect(err).toBeNull();
            expect(transaction.type).toBe('deposit');
            expect(transaction.amount).toBe(500);
            done();
        });
    });
});
