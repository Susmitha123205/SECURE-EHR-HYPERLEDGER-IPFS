const fs = require('fs');
const path = require('path');

const recordsFile = path.join(__dirname, 'ipfs-records.json');

function saveIpfsRecord(filename, ipfsHash, ipfsUrl) {
  let records = [];

  // Read existing records if available
  if (fs.existsSync(recordsFile)) {
    const data = fs.readFileSync(recordsFile);
    try {
      records = JSON.parse(data);
    } catch (err) {
      console.error('Error parsing IPFS records JSON:', err);
    }
  }

  // Append new record
  records.push({ filename, ipfsHash, ipfsUrl });

  // Write updated list
  fs.writeFileSync(recordsFile, JSON.stringify(records, null, 2));
}
