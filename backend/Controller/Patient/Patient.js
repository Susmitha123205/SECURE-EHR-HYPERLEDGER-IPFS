// backend/Controller/Patient/Patient.js
const fs = require('fs');
const path = require('path');
const { create } = require('ipfs-http-client');
const PatientRecord = require('../../models/PatientRecord');
const walletPath = path.join(__dirname, '../../app/wallets/patient-wallet');

// IPFS client
const ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' });

exports.getAllRecords = async (req, res) => {
  try {
    const records = await PatientRecord.find();
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve records', error: err.message });
  }
};

exports.uploadRecord = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const filePath = path.join(__dirname, '../../../uploads/', req.file.filename);
    const fileBuffer = fs.readFileSync(filePath);

    // Upload to IPFS
    const result = await ipfs.add(fileBuffer);

    // Save record to MongoDB
    const newRecord = new PatientRecord({
      originalname: req.file.originalname,
      ipfsHash: result.path,
      uploadedAt: new Date() //ensure 'uploadedAt' is present 
    });
    await newRecord.save();

    res.json({
      success: true,
      message: 'File uploaded to IPFS and saved in MongoDB',
      data: {
        originalname: req.file.originalname,
        ipfsHash: result.path,
        uploadedAt: newRecord.uploadedAt
      }
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: 'Upload failed', error: err.message });
  }
};
