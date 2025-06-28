const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  ipfsHash: String,
  ipfsUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Record", recordSchema);
