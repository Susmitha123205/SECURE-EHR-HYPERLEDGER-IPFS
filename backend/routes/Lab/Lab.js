// backend/routes/Lab/Lab.js
const express = require("express");
const Record = require("../../models/Record");
const { verifyToken, authorizeRoles } = require("../../middleware/auth");

const router = express.Router();

router.get("/records", verifyToken, authorizeRoles("lab"), async (req, res) => {
  try {
    const records = await Record.find({ sharedWith: "lab" });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Lab fetch failed" });
  }
});

module.exports = router;
