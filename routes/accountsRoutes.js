const express = require('express');
const router = express.Router();
const AccountController = require('../controllers/accountController');

// Account routes
router.post('/create', AccountController.createAccount);
router.post('/deposit/:accountNumber', AccountController.depositMoney);
router.post('/withdraw/:accountNumber', AccountController.withdrawMoney);
router.get('/:accountNumber', AccountController.getAccountDetails);
router.get('/transactions/:accountNumber', AccountController.getTransactionHistory);

module.exports = router;