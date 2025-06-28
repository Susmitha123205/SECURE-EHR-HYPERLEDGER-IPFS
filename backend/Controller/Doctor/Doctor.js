const User = require('../../models/User');
const Record = require('../../models/PatientRecord');
const constants = require('../../config/constants.json');
const log4js = require('log4js');
const logger = log4js.getLogger('Doctor');
const helper = require('../../app/helper');
const invoke = require('../../app/invoke');
const query = require('../../app/query');
const jwt = require('jsonwebtoken');

logger.level = 'debug';

function getErrorMessage(field) {
  return {
    success: false,
    message: `${field} field is missing or invalid in the request`,
  };
}

// ✅ Add new prescription (only if doctor has access to the patient)
exports.prescription = async (req, res) => {
  try {
    const { patientId, args } = req.body;
    const doctorId = req.session.uid;

    if (!patientId || !args || !doctorId) {
      return res.status(400).json(getErrorMessage("Required"));
    }

    const user = await User.findOne({ userId: doctorId });
    if (!user || !user.access.includes(patientId)) {
      return res.status(403).json({
        success: false,
        message: `Doctor does not have rights to prescribe for this patient`,
      });
    }

    const username = user.userName;
    const orgName = user.orgName;

    let recordId;
    while (true) {
      const tempId = Math.floor(10000 + Math.random() * 90000);
      const existing = await Record.findOne({ recordId: tempId });
      if (!existing) {
        recordId = tempId;
        break;
      }
    }

    const txArgs = [
      recordId.toString(),
      patientId,
      doctorId,
      ...args,
      new Date().toISOString(),
    ];

    const response = await invoke.invokeTransaction(
      "healthcare-channel",        // ✅ your actual channel name
      "hospitalcc",                // ✅ your actual chaincode name
      "createPrescriptionRecord",
      txArgs,
      username,
      orgName,
      {}
    );

    const newRecord = await Record.create({
      doctorId,
      patientId,
      RecordId: recordId,
    });

    logger.info("Ledger response:", response);
    return res.status(200).json({
      success: true,
      message: "Prescription record added successfully",
      records: newRecord,
    });
  } catch (error) {
    logger.error("Prescription error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Get prescription records for doctor-patient combo
exports.getPrescription = async (req, res) => {
  try {
    const { patientId } = req.query;
    const doctorId = req.session.uid;

    if (!patientId || !doctorId) {
      return res.status(400).json(getErrorMessage("Missing patientId or session"));
    }

    const patient = await User.findOne({ userId: patientId });
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    const username = patient.userName;
    const records = await Record.find({ doctorId, patientId });

    const recordsData = [];

    for (const rec of records) {
      const result = await query.query(
        "healthcare-channel",
        "hospitalcc",
        [rec.RecordId.toString()],
        "getPrescriptionRecord",
        username,
        "patient"
      );

      result.medicines = JSON.parse(JSON.parse(result.medicines));
      result.labTests = JSON.parse(JSON.parse(result.labTests));
      recordsData.push(result);
    }

    return res.status(200).json({ success: true, recordsData });
  } catch (error) {
    logger.error("GetPrescription error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
