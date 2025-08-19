const express = require('express');
const router = express.Router();
const AccountController = require('../controllers/accountController');
const { requireAuth } = require('../middleware/auth');

// Account routes
router.post('/create', requireAuth, AccountController.createAccount);
router.post('/deposit/:accountNumber', requireAuth, AccountController.depositMoney);
router.post('/withdraw/:accountNumber', requireAuth, AccountController.withdrawMoney);
router.get('/:accountNumber', requireAuth, AccountController.getAccountDetails);
router.get('/transactions/:accountNumber', requireAuth, AccountController.getTransactionHistory);

module.exports = router;