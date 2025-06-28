// routes/Patient/Patient.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const Record = require("../../models/PatientRecord"); // Your Mongoose model
const { verifyToken, authorizeRoles } = require("../../middleware/auth");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // temporary storage

// Upload PDF report
router.post(
  "/upload",
  verifyToken,
  authorizeRoles("patient"),
  upload.single("file"),
  async (req, res) => {
    try {
      const file = req.file;
      if (!file) return res.status(400).json({ success: false, message: "No file uploaded" });

      // Save record in DB - only filename, owner and role
      const record = new Record({
        filename: file.originalname,
        owner: req.user._id.toString(),
        role: "patient",
      });

      await record.save();

      res.status(200).json({
        success: true,
        message: "Report uploaded successfully",
      });
    } catch (err) {
      console.error("Upload Error:", err);
      res.status(500).json({ success: false, message: "Upload failed" });
    } finally {
      // Remove uploaded file from server folder
      if (req.file?.path) fs.unlink(req.file.path, () => {});
    }
  }
);

// Get all patient reports for logged-in patient
router.get("/records", verifyToken, authorizeRoles("patient"), async (req, res) => {
  try {
    // Find records where owner is logged-in patient
    const records = await Record.find({ owner: req.user._id.toString() }).select("filename");
    res.json({
      success: true,
      records,
    });
  } catch (err) {
    console.error("Fetch records error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch records" });
  }
});

module.exports = router;
