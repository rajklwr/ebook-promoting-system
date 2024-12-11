const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
  purchaserEmail: { type: String, required: true },
  ebookName: { type: String, required: true },
  price: { type: Number, required: true },
  referrer: { type: String, required: true }, // referralCode from Youtuber
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Purchase', PurchaseSchema);
