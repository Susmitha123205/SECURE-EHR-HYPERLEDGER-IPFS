
const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
  filename: String,
  cid: String,
  uploader: String,
  sharedWith: [String],
  pharmacyNote: String,
  labResult: String,
  insuranceStatus: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Record", RecordSchema);
