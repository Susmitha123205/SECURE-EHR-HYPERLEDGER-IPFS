const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  linkedId: {
    type: String,
    required: true
  }
});

// Export the Mongoose model directly
module.exports = mongoose.model('User', userSchema);
