const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");

// 👉 Static records per role (use real DB if needed)
router.get("/records", authenticate, async (req, res) => {
  const role = req.user.role;

  let records = [];

  if (role === "doctor") {
    records = [
      { filename: "Doctor_prescription.pdf", cid: "QmVzF4M2NRb1zH14bA3gUefsgBbHj6ueg1pCwBtgZSDrA2" }
    ];
  } else if (role === "lab") {
    records = [
      { filename: "Lab_test_report.pdf", cid: "QmYSfy9N7R2XvSKdXvY4rpkATNEhJAVoqVYMhFqfcuhfjS" }
    ];
  } else if (role === "pharmacy") {
    records = [
      { filename: "Pharmacy_dispensation_note.pdf", cid: "QmbZSHfFUynNpRa3B8SSwSPQw3CVDADj9EW35hpV8CArkn" }
    ];
  } else if (role === "insurance") {
    records = [
      { filename: "Insurance_claim_summary.pdf", cid: "QmUJuFvsU1atp4qMycLtuNqs7k4wP4eyXA1ci4WMi25BLo" }
    ];
  } else {
    return res.status(403).json({ message: "Unauthorized role" });
  }

  res.json(records); // ✅ always send JSON
});

// ✅ DELETE mock for UI (no DB deletion, just simulate)
router.delete("/records", authenticate, async (req, res) => {
  const role = req.user.role;
  res.json({ message: `${role} records deleted successfully` });
});

module.exports = router;
