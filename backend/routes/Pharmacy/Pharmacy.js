// backend/routes/Pharmacy/Pharmacy.js
const express = require("express");
const Record = require("../../models/Record");
const { verifyToken, authorizeRoles } = require("../../middleware/auth");

const router = express.Router();

router.get("/records", verifyToken, authorizeRoles("pharmacy"), async (req, res) => {
  try {
    const records = await Record.find({ sharedWith: "pharmacy" });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Pharmacy fetch failed" });
  }
});

module.exports = router;
