const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Email unique होना चाहिए
    },
    password: {
      type: String,
      required: true,
    },
    // Optional fields
    pic: {
      type: String,
      default:
        'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
  },
  {
    timestamps: true, // Auto-create 'createdAt' and 'updatedAt' fields
  }
);

// Mongoose Pre-save Hook
// This will run before the document is saved to the database
userSchema.pre('save', async function (next) {
  // Check if the password is being modified
  if (!this.isModified('password')) {
    next();
  }

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;