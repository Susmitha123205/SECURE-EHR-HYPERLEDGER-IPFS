const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const Record = require("../models/Record");
const { verifyToken, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

const upload = multer({ dest: "uploads/" }); // ✅ files go here

router.post(
  "/upload",
  verifyToken,
  authorizeRoles("patient"), // ✅ Only patients can upload
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const filePath = req.file.path; // ✅ Actual saved file (random name)
      const fileStream = fs.createReadStream(filePath);
      const formData = new FormData();

      formData.append("file", fileStream, {
        filepath: req.file.originalname, // ✅ Shows original filename on IPFS
      });

      const pinataRes = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: `Bearer ${process.env.PINATA_JWT}`,
          },
        }
      );

      fs.unlinkSync(filePath); // ✅ Delete local copy after upload

      const filename = req.file.originalname;
      const cid = pinataRes.data.IpfsHash;
      const email = req.user.email;

      const newRecord = new Record({
        filename,
        cid,
        uploader: email,
        sharedWith: ["doctor", "lab", "pharmacy", "insurance"], // ✅ Share only with doctor now
      });

      await newRecord.save();

      return res.json({
        success: true,
        message: "Report uploaded and pinned to IPFS",
        cid,
      });
    } catch (err) {
      console.error("❌ Upload Error:", err);
      return res.status(500).json({ message: "Upload failed" });
    }
  }
);

module.exports = router;
