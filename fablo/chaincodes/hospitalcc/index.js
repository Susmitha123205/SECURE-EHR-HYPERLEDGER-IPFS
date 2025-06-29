'use strict';

const { Contract } = require('fabric-contract-api');

class HospitalContract extends Contract {

  async initLedger(ctx) {
    const patients = [
      {
        patientId: 'P001',
        name: 'John Doe',
        age: 30,
        bloodGroup: 'A+',
        labReports: [],
        labReportsCID: [],
        medicineHistory: [],
        insurance: { policyId: 'INS123', status: 'Active' },
      },
    ];

    for (const patient of patients) {
      await ctx.stub.putState(patient.patientId, Buffer.from(JSON.stringify(patient)));
    }
    return 'Ledger initialized';
  }

  async registerPatient(ctx, patientId, name, age, bloodGroup) {
    const exists = await this.patientExists(ctx, patientId);
    if (exists) throw new Error(`Patient ${patientId} already exists`);

    const patient = {
      patientId,
      name,
      age: parseInt(age),
      bloodGroup,
      labReports: [],
      labReportsCID: [],
      medicineHistory: [],
      insurance: { policyId: '', status: 'NotSet' },
    };

    await ctx.stub.putState(patientId, Buffer.from(JSON.stringify(patient)));
    return JSON.stringify(patient);
  }

  async getPatientDetails(ctx, patientId) {
    const buffer = await ctx.stub.getState(patientId);
    if (!buffer || buffer.length === 0) {
      throw new Error(`Patient ${patientId} not found`);
    }
    return buffer.toString();
  }

  async patientExists(ctx, patientId) {
    const buffer = await ctx.stub.getState(patientId);
    return !!(buffer && buffer.length > 0);
  }

  async addReportHash(ctx, patientId, reportHash) {
    const patientBuffer = await ctx.stub.getState(patientId);
    if (!patientBuffer || patientBuffer.length === 0) {
      throw new Error(`Patient ${patientId} does not exist`);
    }

    const patient = JSON.parse(patientBuffer.toString());
    if (!Array.isArray(patient.labReports)) {
      patient.labReports = [];
    }

    patient.labReports.push({
      timestamp: new Date().toISOString(),
      hash: reportHash,
    });

    await ctx.stub.putState(patientId, Buffer.from(JSON.stringify(patient)));
    return JSON.stringify(patient);
  }

  async addMedicine(ctx, patientId, medicineName, dosage) {
    const patientBuffer = await ctx.stub.getState(patientId);
    if (!patientBuffer || patientBuffer.length === 0) {
      throw new Error(`Patient ${patientId} not found`);
    }

    const patient = JSON.parse(patientBuffer.toString());
    if (!Array.isArray(patient.medicineHistory)) {
      patient.medicineHistory = [];
    }

    patient.medicineHistory.push({
      medicineName,
      dosage,
      prescribedAt: new Date().toISOString(),
    });

    await ctx.stub.putState(patientId, Buffer.from(JSON.stringify(patient)));
    return JSON.stringify(patient);
  }

  async updateInsurance(ctx, patientId, policyId, status) {
    const patientBuffer = await ctx.stub.getState(patientId);
    if (!patientBuffer || patientBuffer.length === 0) {
      throw new Error(`Patient ${patientId} not found`);
    }

    const patient = JSON.parse(patientBuffer.toString());
    patient.insurance = {
      policyId,
      status,
    };

    await ctx.stub.putState(patientId, Buffer.from(JSON.stringify(patient)));
    return JSON.stringify(patient);
  }

  async getAllPatients(ctx) {
    const iterator = await ctx.stub.getStateByRange('', '');
    const allResults = [];

    while (true) {
      const res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        const record = JSON.parse(res.value.value.toString('utf8'));
        allResults.push(record);
      }

      if (res.done) {
        await iterator.close();
        break;
      }
    }

    return JSON.stringify(allResults);
  }

  // ✅ Fixed with actual Fabric Tx timestamp
  async uploadReportCID(ctx, patientId, cid, date) {
    const patientAsBytes = await ctx.stub.getState(patientId);
    if (!patientAsBytes || patientAsBytes.length === 0) {
      throw new Error(`Patient ${patientId} does not exist`);
    }

    const patient = JSON.parse(patientAsBytes.toString());

    // ✅ Use Fabric-provided transaction timestamp
    const txTimestamp = ctx.stub.getTxTimestamp(); // returns { seconds, nanos }
    const timestampMillis = (txTimestamp.seconds.low * 1000) + Math.floor(txTimestamp.nanos / 1000000);
    const timestamp = new Date(timestampMillis).toISOString();

    const report = {
      cid,
      date,
      timestamp
    };

    if (!Array.isArray(patient.labReportsCID)) {
      patient.labReportsCID = [];
    }

    patient.labReportsCID.push(report);

    await ctx.stub.putState(patientId, Buffer.from(JSON.stringify(patient)));

    return JSON.stringify(patient.labReportsCID);
  }

  async getReportCID(ctx, patientId, date) {
    const patientAsBytes = await ctx.stub.getState(patientId);
    if (!patientAsBytes || patientAsBytes.length === 0) {
      throw new Error(`Patient ${patientId} does not exist`);
    }

    const patient = JSON.parse(patientAsBytes.toString());

    const report = patient.labReportsCID?.find(r => r.date === date);
    if (!report) {
      throw new Error(`No report found for ${patientId} on ${date}`);
    }

    return JSON.stringify(report);
  }

}

module.exports.contracts = [HospitalContract];
