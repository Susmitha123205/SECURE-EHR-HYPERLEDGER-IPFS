const { invokeTransaction } = require("./invoke");

const run = async () => {
  const channelName = "healthcare-channel";
  const chaincodeName = "hospitalcc";
  const fcn = "registerPatient";
  const args = [
    "P001",         // patient ID
    "Alice",        // name
    "22",           // age
    "F",            // gender
    "O+",           // blood group
    "9876543210",   // phone
    "Hyderabad",    // address
    "ipfs-hash"     // medical hash
  ];
  const username = "user1";
  const org_name = "patient";

  const result = await invokeTransaction(
    channelName,
    chaincodeName,
    fcn,
    args,
    username,
    org_name
  );

  console.log("🟢 Invoke result:\n", result);
};

run();
