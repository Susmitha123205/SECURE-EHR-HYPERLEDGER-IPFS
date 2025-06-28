// models/PatientRecord.js
const mongoose = require("mongoose");

const patientRecordSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  owner: { type: String, required: true }, // patient user ID
  role: { type: String, required: true },  // "patient"
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PatientRecord", patientRecordSchema);
