const User = require('../models/User');
const bcrypt = require('bcryptjs'); // New import for password comparison
const generateToken = require('../utils/generateToken'); // New import for token generation

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if all fields are provided
  if (!name || !email || !password) {
    res.status(400);
    return res.json({ message: 'Please enter all the fields.' });
  }

  // Check if user with this email already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    return res.json({ message: 'User already exists.' });
  }

  // Create a new user in the database
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
    });
  } else {
    res.status(400);
    throw new Error('Failed to create the user.');
  }
};
// New: Login function
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });

  // Check if the user exists and the passwords match
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id), // Generate a token for the user
    });
  } else {
    res.status(401); // Unauthorized
    res.json({ message: 'Invalid Email or Password' });
  }
};
const getUserProfile = async (req, res) => {
  // req.user contains the user info from the 'protect' middleware
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
    });
  } else {
    res.status(404);
    res.json({ message: 'User not found' });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users.' });
  }
};
const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) { // Ensure user is found
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.pic = req.body.pic || user.pic;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      pic: updatedUser.pic,
    });
  } else {
    res.status(404);
    res.json({ message: 'User not found' });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, getAllUsers, updateProfile };
