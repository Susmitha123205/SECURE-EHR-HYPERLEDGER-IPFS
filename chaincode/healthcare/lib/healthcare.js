'use strict';

const { Contract } = require('fabric-contract-api');

class HealthcareContract extends Contract {
  async InitLedger(ctx) {
    console.info('Ledger initialized');
  }

  async UploadRecord(ctx, patientId, cid) {
    await ctx.stub.putState(patientId, Buffer.from(cid));
    return `Record with CID ${cid} for Patient ${patientId} saved to ledger`;
  }

  async GetRecord(ctx, patientId) {
    const data = await ctx.stub.getState(patientId);
    if (!data || data.length === 0) {
      throw new Error(`No record found for patient ID: ${patientId}`);
    }
    return data.toString();
  }
}

module.exports = HealthcareContract;

