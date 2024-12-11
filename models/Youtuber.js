const mongoose = require('mongoose');

const YoutuberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  referralCode: { type: String, required: true, unique: true },
  commissionRate: { type: Number, default: 10 } // % commission
});

module.exports = mongoose.model('Youtuber', YoutuberSchema);
