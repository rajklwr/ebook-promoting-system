const Youtuber = require('../models/Youtuber');


exports.addYouTuber = async (req, res) => {

  // console.log('test test');
    const { name, email, referralCode, commissionRate } = req.body;
  
    // Validate input
    if (!name || !email || !referralCode) {
      return res.status(400).json({ message: 'Name, email, and referral code are required.' });
    }
  
    try {
      const newYouTuber = new Youtuber({
        name,
        email,
        referralCode,
        commissionRate: commissionRate || 10, // Default to 10% if not provided
      });
  
      await newYouTuber.save();
  
      res.status(201).json({
        message: 'YouTuber added successfully',
        youTuber: newYouTuber,
      });
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ message: 'Referral code or email already exists.' });
      } else {
        res.status(500).json({ message: 'Server error', error: error.message });
      }
    }
  };