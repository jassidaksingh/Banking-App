const AccountController = require('../controllers/accountController');
const Account = require('../models/account');
const Transaction = require('../models/transaction');

jest.mock('../models/account');
jest.mock('../models/transaction');

describe('Banking Tests', () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
        req = { body: {}, params: {} };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    });

    test('createAccount works', () => {
        req.body = { account_holder_name: 'John' };
        Account.createAccount.mockImplementation((name, cb) => cb(null, { account_number: 'ACC123' }));
        
        AccountController.createAccount(req, res);
        
        expect(Account.createAccount).toHaveBeenCalledWith('John', expect.any(Function));
        expect(res.status).toHaveBeenCalledWith(201);
    });

    test('depositMoney works', () => {
        req.params = { accountNumber: 'ACC123' };
        req.body = { amount: 100 };
        Account.getAccountByNumber.mockImplementation((num, cb) => cb(null, { balance: 0 }));
        Account.updateBalance.mockImplementation((num, bal, cb) => cb(null, { balance: 100 }));
        Transaction.createTransaction.mockImplementation((num, type, amt, bal, desc, cb) => cb(null, {}));

        AccountController.depositMoney(req, res);
        
        expect(Account.getAccountByNumber).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalled();
    });

    test('withdrawMoney works', () => {
        req.params = { accountNumber: 'ACC123' };
        req.body = { amount: 50 };
        Account.getAccountByNumber.mockImplementation((num, cb) => cb(null, { balance: 100 }));
        Account.updateBalance.mockImplementation((num, bal, cb) => cb(null, { balance: 50 }));
        Transaction.createTransaction.mockImplementation((num, type, amt, bal, desc, cb) => cb(null, {}));

        AccountController.withdrawMoney(req, res);
        
        expect(Account.getAccountByNumber).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalled();
    });

    test('getAccountDetails works', () => {
        req.params = { accountNumber: 'ACC123' };
        Account.getAccountByNumber.mockImplementation((num, cb) => cb(null, { account_number: 'ACC123' }));

        AccountController.getAccountDetails(req, res);
        
        expect(Account.getAccountByNumber).toHaveBeenCalledWith('ACC123', expect.any(Function));
        expect(res.json).toHaveBeenCalled();
    });

    test('getTransactionHistory works', () => {
        req.params = { accountNumber: 'ACC123' };
        Account.getAccountByNumber.mockImplementation((num, cb) => cb(null, { account_number: 'ACC123' }));
        Transaction.getTransactionsByAccountNumber.mockImplementation((num, cb) => cb(null, []));

        AccountController.getTransactionHistory(req, res);
        
        expect(Account.getAccountByNumber).toHaveBeenCalled();
        expect(Transaction.getTransactionsByAccountNumber).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalled();
    });
});