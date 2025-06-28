'use strict';

const { Contract } = require('fabric-contract-api');

class MyContract extends Contract {
  async initLedger(ctx) {
    const data = [
      { id: 'patient1', value: 'Record1' },
      { id: 'patient2', value: 'Record2' },
    ];
    for (const record of data) {
      await ctx.stub.putState(record.id, Buffer.from(record.value));
    }
    return 'Ledger initialized';
  }

  async getRecord(ctx, id) {
    const value = await ctx.stub.getState(id);
    if (!value || value.length === 0) {
      throw new Error(`The record ${id} does not exist`);
    }
    return value.toString();
  }

  async putRecord(ctx, id, value) {
    await ctx.stub.putState(id, Buffer.from(value));
    return `Record ${id} updated`;
  }
}

module.exports = MyContract;
