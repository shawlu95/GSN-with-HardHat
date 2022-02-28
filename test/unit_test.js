const { expect } = require("chai");
const { ethers } = require("hardhat");
const util = require('../scripts/util');

describe("Unit Test", function () {
  let counter;
  let user;

  before(async function () {
    // Only run unit test if --network is local
    if (!util.isLocal(hre.network.config.chainId)) {
      this.skip();
    }

    [user] = await ethers.getSigners();
    const Counter = await ethers.getContractFactory('Counter');
    const forwarderAddress = ethers.Wallet.createRandom().address; // dummy address
    counter = await Counter.deploy(forwarderAddress);
  });

  it('Increment count', async function () {
    const oldCount = await counter.counter();

    // increment count using normal user
    await counter.connect(user).increment();

    // check that counter has been incremented
    const newCount = await counter.counter();
    expect(parseInt(newCount)).to.equal(parseInt(oldCount) + 1);

    // check lastCaller
    expect(await counter.lastCaller()).to.equal(user.address);
  });
});
