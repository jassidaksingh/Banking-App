const AccountController = require('../controllers/accountController');
const Account = require('../models/account');
const Transaction = require('../models/transaction');

// Mock the models
jest.mock('../models/account');
jest.mock('../models/transaction');

describe('Controller Functions', () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
        
        req = { body: {}, params: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    // Test AccountController.createAccount
    test('AccountController.createAccount should validate required name', () => {
        req.body = {};

        AccountController.createAccount(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Account holder name is required'
        });
    });

    test('AccountController.createAccount should reject empty name', () => {
        req.body = { account_holder_name: '   ' };

        AccountController.createAccount(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Account holder name is required'
        });
    });

    // Test AccountController.depositMoney
    test('AccountController.depositMoney should validate positive amount', () => {
        req.params = { accountNumber: 'ACC12345678' };
        req.body = { amount: -100 };

        AccountController.depositMoney(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Amount must be greater than 0'
        });
    });

    test('AccountController.depositMoney should require amount', () => {
        req.params = { accountNumber: 'ACC12345678' };
        req.body = {};

        AccountController.depositMoney(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Amount must be greater than 0'
        });
    });

    // Test AccountController.withdrawMoney
    test('AccountController.withdrawMoney should validate positive amount', () => {
        req.params = { accountNumber: 'ACC12345678' };
        req.body = { amount: 0 };

        AccountController.withdrawMoney(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Amount must be greater than 0'
        });
    });
});
