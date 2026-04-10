const express = require('express');
const { registerUser, loginUser, getUserProfile, updateProfile } = require('../controllers/userController'); // New import: getUserProfile
const { protect } = require('../middleware/authMiddleware'); // New import: protect middleware
const { getAllUsers } = require('../controllers/userController'); // New import: getAllUsers
const router = express.Router();

// Public Routes
router.route('/').post(registerUser);
router.post('/login', loginUser);

// Private Route (protected by middleware)
router.route('/profile').get(protect, getUserProfile); // New protected route
router.route('/').get(protect, getAllUsers);
router.route('/profile').put(protect, updateProfile); // New protected route

module.exports = router;