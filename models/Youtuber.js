const mongoose = require("mongoose");

const YoutuberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  referralCode: { type: String, required: true, unique: true },
  commissionRate: { type: Number, default: 70 },
  successReferral: { type: Number, default: 0 },
});

module.exports = mongoose.model("Youtuber", YoutuberSchema);
