const { expect } = require("chai");
const { ethers } = require("hardhat");
const util = require('../scripts/util');

describe("Unit Test", function () {
  before(async function () {
    // Only run unit test if --network is local
    if (!util.isLocal(hre.network.config.chainId)) {
      this.skip();
    }

    const [user] = await ethers.getSigners();
    const forwarderAddress = ethers.Wallet.createRandom().address; // dummy address

    const PayMaster = await ethers.getContractFactory('WhitelistPaymaster');
    const pm = await PayMaster.deploy();

    const Withdrawer = await ethers.getContractFactory('Withdrawer');
    const w = await Withdrawer.deploy(forwarderAddress, user.address);
  });
});
