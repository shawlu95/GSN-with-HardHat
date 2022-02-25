const hre = require("hardhat");
const address = require('./address');

async function main() {
  const chainId = hre.network.config.chainId;
  const forwarder = address.getForwarder(chainId);
  const Counter = await hre.ethers.getContractFactory("Counter");
  const counter = await Counter.deploy(forwarder);

  await counter.deployed();
  console.log("Counter deployed to:", counter.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
