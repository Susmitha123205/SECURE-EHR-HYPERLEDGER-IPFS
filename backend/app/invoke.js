const { getContract } = require('./contract'); // hypothetical helper

async function invokeTransaction(channelName, chaincodeName, fcn, args, username, orgName, transientData) {
  try {
    const response = await contract.submitTransaction(fcn, ...args);
    return response.toString();
  } catch (err) {
    console.error("❌ Invoke Error:", err.message);
    throw err;
  }
}

module.exports = {
  invokeTransaction
};
