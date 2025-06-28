const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

async function storeHashOnFabric(patientId, cid) {
  const ccpPath = path.resolve(__dirname, '../config/connection-profile-patient.json');
  const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

  const walletPath = path.join(process.cwd(), 'wallets/patient-wallet');
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: 'user1',
    discovery: { enabled: true, asLocalhost: true }
  });

  const network = await gateway.getNetwork('mychannel');
  const contract = network.getContract('healthcare'); // Your chaincode name

  await contract.submitTransaction('UploadRecord', patientId, cid);

  await gateway.disconnect();
}

module.exports = { storeHashOnFabric };
