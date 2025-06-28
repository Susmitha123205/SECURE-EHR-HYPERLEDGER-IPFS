// backend/routes/Insurance/Insurance.js
const express = require("express");
const Record = require("../../models/Record");
const { verifyToken, authorizeRoles } = require("../../middleware/auth");

const router = express.Router();

router.get("/records", verifyToken, authorizeRoles("insurance"), async (req, res) => {
  try {
    const records = await Record.find({ sharedWith: "insurance" });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Insurance fetch failed" });
  }
});

module.exports = router;
