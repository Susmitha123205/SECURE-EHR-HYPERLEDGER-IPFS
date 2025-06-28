const { Gateway, Wallets } = require("fabric-network");
const fs = require("fs");
const path = require("path");

async function main() {
  try {
    const ccpPath = path.resolve(__dirname, "../config/connection-profile-patient.json");
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    const walletPath = path.join(__dirname, "wallets", "patient-wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    console.log(`📂 Wallet Path: ${walletPath}`);

    const identity = await wallet.get("user1");
    if (!identity) {
      console.log('❌ Identity "user1" not found in the wallet.');
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "user1",
      discovery: { enabled: false },
    });

    const network = await gateway.getNetwork("healthcare-channel");
    const contract = network.getContract("hospitalcc");

    const patientId = "P001";
    console.log(`🔍 Calling getPatientDetails("${patientId}")...`);

    // ✅ Fixed function name with contract prefix
    const result = await contract.evaluateTransaction("HospitalContract:getPatientDetails", patientId);

    console.log(`✅ Query result:\n${result.toString()}`);

    await gateway.disconnect();
  } catch (error) {
    console.error("❌ Query failed:");
    console.error("➡️ Message:", error.message);
  }
}

main();
