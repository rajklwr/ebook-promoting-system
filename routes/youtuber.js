const express = require('express');
const {addYouTuber} = require('../controllers/youtuberController');
const router = express.Router();

router.post('/addYoutuber', addYouTuber);

module.exports = router;
