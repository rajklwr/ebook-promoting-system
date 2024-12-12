const express = require('express');
const { handlePayPalWebhook } = require('../controllers/paypalWebhookController');

const router = express.Router();

// Webhook route
router.post('/', handlePayPalWebhook);

module.exports = router;
