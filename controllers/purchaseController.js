const Purchase = require("../models/Purchase");
const Youtuber = require("../models/Youtuber");
const { sendPurchaseEmails } = require("../controllers/emailController");

exports.recordPurchase = async (req, res) => {
  try {
    const { purchaserEmail, ebookName, price, referrer } = req.body;

    // Validate referrer
    const youtuber = await Youtuber.findOne({ referralCode: referrer });
    // if (!youtuber)
    //   return res.status(400).json({ message: "Invalid referral code" });

    // Record purchase
    const purchase = new Purchase({
      purchaserEmail,
      ebookName,
      price,
      referrer,
    });
    await purchase.save();

    await Youtuber.updateOne(
      { referralCode: referrer },
      { $inc: { successReferral: 1 } }
    );

    // console.log('success referral :',youtuber?.successReferral )

    // Send emails
    sendPurchaseEmails(
      purchaserEmail,
      youtuber.email,
      youtuber?.name,
      ebookName,
      youtuber?.successReferral + 1 
    );

    res.status(201).json({ message: "Purchase recorded successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
