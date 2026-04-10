const express = require('express');
const { accessChat, fetchChats, allMessages, sendMessage } = require('../controllers/chatController'); // New import
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.route('/').post(protect, accessChat);
router.route('/').get(protect, fetchChats); // New route
router.route('/:chatId').get(protect, allMessages);
router.route('/message').post(protect, sendMessage);

module.exports = router;