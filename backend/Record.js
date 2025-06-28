const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    cid: {
      type: String,
      required: true,
    },
    uploader: {
      type: String,
      required: true, // usually the patient's email
    },
    sharedWith: {
      type: [String],
      required: true, // example: ['doctor', 'lab', 'pharmacy', 'insurance']
    },

    // Optional notes for orgs to fill
    pharmacyNote: {
      type: String,
      default: "",
    },
    labResult: {
      type: String,
      default: "",
    },
    insuranceStatus: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Record", recordSchema);
