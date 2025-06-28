// backend/Controller/recordsController.js

const getAllRecordsForRole = async (role) => {
  // In a real-world app, you'd fetch records from MongoDB or Hyperledger chaincode.
  // For now, return mock records based on the role.

  const mockRecords = [
    {
      fileName: "blood-test-report.pdf",
      hash: "QmXyz123abc",
      date: "2025-06-20",
      uploadedBy: "patient1@example.com",
      ipfsUrl: "https://ipfs.io/ipfs/QmXyz123abc"
    },
    {
      fileName: "xray-image.png",
      hash: "QmAbc456def",
      date: "2025-06-18",
      uploadedBy: "patient1@example.com",
      ipfsUrl: "https://ipfs.io/ipfs/QmAbc456def"
    }
  ];

  // Filter based on role (optional — all roles get same dummy data for now)
  return mockRecords;
};

module.exports = { getAllRecordsForRole };
