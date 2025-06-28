// backend/app/contract.js

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

async function getContract(userName, orgName) {
  // This should connect to gateway, get contract instance and return it
  // You can customize it based on your setup

  const ccpPath = path.resolve(__dirname, `../config/connection-profile-${orgName}.json`);
  const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

  const walletPath = path.join(process.cwd(), `app/wallets/${orgName}-wallet`);
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: userName,
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork('healthcare-channel');
  const contract = network.getContract('hospitalcc');

  return contract;
}

module.exports = { getContract };
