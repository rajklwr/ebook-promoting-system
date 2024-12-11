const express = require('express');
const { recordPurchase } = require('../controllers/purchaseController');
const router = express.Router();

router.post('/recordPurchase', recordPurchase);

module.exports = router;
