// utils/pinToIPFS.js
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
require("dotenv").config();

const pinFileToIPFS = async (filePath) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const data = new FormData();
  data.append("file", fs.createReadStream(filePath));

  const res = await axios.post(url, data, {
    maxBodyLength: "Infinity",
    headers: {
      Authorization: `Bearer ${process.env.PINATA_JWT}`,
      ...data.getHeaders(),
    },
  });

  return res.data.IpfsHash;
};

module.exports = pinFileToIPFS;
