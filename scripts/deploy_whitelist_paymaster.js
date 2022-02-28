const hre = require("hardhat");
const address = require('./address');

async function main() {
  const chainId = hre.network.config.chainId;
  const forwarder = address.getForwarder(chainId);
  const relayHubAddress = address.getRelayHub(chainId);

  const WhitelistPaymaster = await hre.ethers.getContractFactory("WhitelistPaymaster");
  const whitelistPaymaster = await WhitelistPaymaster.deploy();
  console.log("Paymaster deployed to:", whitelistPaymaster.address);

  await whitelistPaymaster.setTrustedForwarder(forwarder);
  console.log("Set trusted forwarder:", await whitelistPaymaster.trustedForwarder());

  await whitelistPaymaster.setRelayHub(relayHubAddress);
  console.log("Set relay hub:", await whitelistPaymaster.getHubAddr());
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });