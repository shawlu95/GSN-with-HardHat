Gsn = require('@opengsn/provider');
const { expect } = require("chai");
const { ethers } = require("hardhat");
const Web3 = require('web3');
const address = require('../scripts/address');
const util = require('../scripts/util');
const Counter = require('../artifacts/contracts/Counter.sol/Counter.json');

describe("Integration Test", function () {
  let counter;
  let admin;
  let user;
  let web3;
  let chainId;

  before(async function () {
    // Only run integration test if --network is NOT local
    if (util.isLocal(hre.network.config.chainId)) {
      this.skip();
    }

    web3 = new Web3(process.env.INFURA_URL);
    chainId = await web3.eth.net.getId()

    const counterAddress = address.getCounter(chainId);
    const paymasterAddress = address.getPayMaster(chainId);

    [admin] = await ethers.getSigners();

    const config = {
      paymasterAddress,
      loggerConfiguration: {
        logLevel: 'error'
      }
    }

    provider = Gsn.RelayProvider.newProvider({
      provider: web3.currentProvider, config
    })
    await provider.init();
    web3.setProvider(provider);

    //create a new gasless account:
    user = provider.newAccount();
    counter = new web3.eth.Contract(Counter.abi, counterAddress, {
      from: user.address,
      gasPrice: 0
    });

    // We use hard-hat run time (not web3) to access paymaster and 
    // whitelist users later. This operation cost admin gas.
    const WhitelistPaymaster = await hre.ethers.getContractFactory("WhitelistPaymaster");
    paymaster = await WhitelistPaymaster.attach(paymasterAddress);
  });

  it('Increment count from whitelisted user', async function () {
    //create a new gasless account:
    const user = provider.newAccount();
    const tx = await paymaster.connect(admin).whitelistSender(user.address);
    await tx.wait();

    const oldCount = await counter.methods.counter().call();

    // increment count using gasless user
    await counter.methods.increment().send({
      from: user.address,
      gasPrice: 0,
      gas: 210000
    });

    // check that counter has been incremented
    const newCount = await counter.methods.counter().call();
    expect(parseInt(newCount)).to.equal(parseInt(oldCount) + 1);

    // check lastCaller
    expect(await counter.methods.lastCaller().call()).to.equal(user.address);
  });

  it('Increment count from unauthorized user', async function () {
    const oldCount = await counter.methods.counter().call();
    const lastCaller = await counter.methods.lastCaller().call();

    // Create a new gasless account. Do not whitelist
    const user = provider.newAccount();
    try {
      await counter.methods.increment().send({
        from: user.address,
        gasPrice: 0,
        gas: 210000
      });

      throw Error('Failed to block user!')
    } catch (err) {
      // check that counter is NOT incremented
      const newCount = await counter.methods.counter().call();
      expect(parseInt(newCount))
        .to.equal(parseInt(oldCount));

      // check lastCaller is NOT changed
      expect(await counter.methods.lastCaller().call())
        .to.equal(lastCaller);
    }
  });
});
