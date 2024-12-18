const crypto = require('crypto');
const Youtuber = require('../models/Youtuber');


const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '12345678901234567890123456789012'; // 32 characters for AES-256
const IV_LENGTH = 16; // AES block size

console.log('Key Length:', Buffer.from(ENCRYPTION_KEY).length);
console.log('Key:', ENCRYPTION_KEY);


// Function to encrypt a value
function encrypt(text) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Function to decrypt a value
function decrypt(text) {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

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
        url: `https://elixzor-ebook.com/?${existingByEmail.referralCode}`
      });
    }

    const encryptedReferralCode = encrypt(referralCode);

    // Check if referral code already exists
    const existingByReferralCode = await Youtuber.findOne({ encryptedReferralCode });
    if (existingByReferralCode) {
      return res.status(400).json({ message: 'This referral code already exists. Please use a different referral code.' });
    }

    // Create a new YouTuber
    const newYouTuber = new Youtuber({
      name,
      email,
      referralCode : encryptedReferralCode,
      commissionRate: commissionRate || 70, // Default to 10% if not provided
    });

    await newYouTuber.save();

    console.log('Youtuber Created Successfully :', newYouTuber )

    res.status(201).json({
      message: 'YouTuber added successfully',
      youTuber: newYouTuber,
      url: `https://elixzor-ebook.com/?referrer=${encryptedReferralCode}`
    });
  } catch (error) {
    // Handle other errors
    console.log('Failed to add Youtube :', error)
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
