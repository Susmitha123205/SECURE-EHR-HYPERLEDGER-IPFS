// utils/ipfsUpload.js
const path = require('path');

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const walletPath = path.join(__dirname, '../../app/wallets/patient-wallet');

require('dotenv').config();

async function uploadToIPFS(filePath) {
  const data = new FormData();
  data.append('file', fs.createReadStream(filePath));

  try {
    const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, {
      maxBodyLength: Infinity,
      headers: {
        'Authorization': `Bearer ${process.env.PINATA_JWT}`,
        ...data.getHeaders()
      }
    });

    return res.data;
  } catch (error) {
    console.error("❌ IPFS upload error:", error.message);
    throw error;
  }
}

module.exports = uploadToIPFS;
