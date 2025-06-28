// routes/recordRoutes.js
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const Record = require("../models/Record");

router.get("/records", authenticate, async (req, res) => {
  try {
    const role = req.user.role;
    const records = await Record.find({ sharedWith: role }); // ✅ role-based filtering
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
