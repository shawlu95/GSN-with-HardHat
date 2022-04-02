const hre = require("hardhat");
const address = require('./address');

async function main() {
  const [user] = await ethers.getSigners();
  const chainId = hre.network.config.chainId;
  const forwarder = address.getForwarder(chainId);
  const Withdrawer = await hre.ethers.getContractFactory("Withdrawer");
  const counter = await Withdrawer.deploy(forwarder, user.address);

  await counter.deployed();
  console.log("Counter deployed to:", counter.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
