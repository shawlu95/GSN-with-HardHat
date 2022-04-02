const hre = require("hardhat");
const Web3 = require('web3');
const address = require('./address');
const { RelayProvider } = require('@opengsn/provider');
const { parseEther } = require("ethers/lib/utils");

async function main() {
  const chainId = hre.network.config.chainId;
  const [admin, hacked] = await ethers.getSigners();

  const hackedAddress = hacked.address;
  const hackedKey = process.env.HACKED_KEY;
  const paymasterAddress = address.getPayMaster(chainId);
  const withdrawerAddress = address.getWithdrawer(chainId);
  console.log(paymasterAddress, withdrawerAddress)

  const config = {
    paymasterAddress,
    loggerConfiguration: {
      logLevel: 'error'
    }
  };

  const web3 = new Web3(process.env.INFURA_URL, paymasterAddress);
  const provider = RelayProvider.newProvider({
    provider: web3.currentProvider, config
  });

  await provider.init();
  web3.setProvider(provider);
  provider.addAccount(hackedKey);

  const artifact = require("../artifacts/contracts/Withdrawer.sol/Withdrawer.json");
  const withdrawer = new web3.eth.Contract(artifact.abi, withdrawerAddress);

  const token = '0x18dd62E2d471A6702938dea6c046874184F5E6c8';
  const balance = parseEther('10');

  await withdrawer.methods.approve(token, balance).send(
    { gasLimit: 210000, gasPrice: 8000000000, from: hackedAddress }
  );
}

main();