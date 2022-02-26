Gsn = require('@opengsn/provider');
const { expect } = require("chai");
const { ethers } = require("hardhat");
const Web3 = require('web3');
const address = require('../scripts/address');
const Counter = require('../artifacts/contracts/Counter.sol/Counter.json');

describe("Test Counter", function () {
  let counter;
  let paymaster;
  let admin;

  before(async function () {
    const web3 = new Web3(process.env.INFURA_URL);
    const chainId = await web3.eth.net.getId()

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

    // This reference uses relay provider. Users can send gasless transaction
    counter = new web3.eth.Contract(Counter.abi, counterAddress);

    // We use hard-hat run time (not web3) to access paymaster and 
    // whitelist users later. This operation cost admin gas.
    const WhitelistPaymaster = await hre.ethers.getContractFactory("WhitelistPaymaster");
    paymaster = await WhitelistPaymaster.attach(paymasterAddress);

  });

  it('Increment count from whitelisted gasless user', async function () {
    const oldCount = await counter.methods.counter().call();

    //create a new gasless account:
    const user = provider.newAccount();
    console.log('Whitelist sender', user.address);
    const tx = await paymaster.connect(admin).whitelistSender(user.address);
    await tx.wait();

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