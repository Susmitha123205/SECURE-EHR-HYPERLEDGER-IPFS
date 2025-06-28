// backend/routes/Doctor/Doctor.js
const express = require("express");
const Record = require("../../models/Record");
const { verifyToken, authorizeRoles } = require("../../middleware/auth");

const router = express.Router();

router.get("/records", verifyToken, authorizeRoles("doctor"), async (req, res) => {
  try {
    const records = await Record.find({ sharedWith: "doctor" });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Doctor fetch failed" });
  }
});

module.exports = router;
