const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const invoke = async (ccpPath, walletPath, identity, channelName, chaincodeName, fcn, args) => {
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const gateway = new Gateway();

    try {
        await gateway.connect(ccp, {
            wallet,
            identity,
            discovery: { enabled: false, asLocalhost: true }
        });

        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        const result = await contract.submitTransaction(fcn, ...args);

        console.log(`Transaction ${fcn} has been submitted`);
        return result.toString();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        throw error;
    } finally {
        gateway.disconnect();
    }
};

module.exports = invoke;
