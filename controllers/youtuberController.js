const Youtuber = require('../models/Youtuber');

exports.addYouTuber = async (req, res) => {
  const { name, email, referralCode, commissionRate } = req.body;

  // Validate input
  if (!name || !email || !referralCode) {
    return res.status(400).json({ message: 'Name, email, and referral code are required.' });
  }

  try {
    // Check if email already exists
    const existingByEmail = await Youtuber.findOne({ email });
    if (existingByEmail) {
      return res.status(201).json({
        message: 'This email is already added',
        youTuber: existingByEmail,
        url: `https://elixzor-ebook.com/?referrer=${existingByEmail.referralCode}`
      });
    }

    // Check if referral code already exists
    const existingByReferralCode = await Youtuber.findOne({ referralCode });
    if (existingByReferralCode) {
      return res.status(400).json({ message: 'This referral code already exists. Please use a different referral code.' });
    }

    // Create a new YouTuber
    const newYouTuber = new Youtuber({
      name,
      email,
      referralCode,
      commissionRate: commissionRate || 70, // Default to 10% if not provided
    });

    await newYouTuber.save();

    res.status(201).json({
      message: 'YouTuber added successfully',
      youTuber: newYouTuber,
      url: `https://elixzor-ebook.com/?referrer=${referralCode}`
    });
  } catch (error) {
    // Handle other errors
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
