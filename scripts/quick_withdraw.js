// instruction: save your private key in .env
// ADMIN_KEY=xxxxx which will send ether to hacked account
// HACKED_KEY=xxxx which doesn't have any gas

const hre = require("hardhat");

async function main() {
  const [admin, hacked] = await ethers.getSigners();
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
