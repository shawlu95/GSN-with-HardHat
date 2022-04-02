
const hre = require("hardhat");
const { parseEther } = require("ethers/lib/utils");
const address = require('./address');
const provider = waffle.provider;

const fund = async () => {
  const chainId = hre.network.config.chainId;
  const [admin] = await ethers.getSigners();

  const relayHubAddress = address.getRelayHub(chainId);
  const payMasterAddress = address.getPayMaster(chainId);

  const RelayHub = await hre.ethers.getContractFactory("RelayHub");
  const relayHub = await RelayHub.attach(relayHubAddress);

  const tx = await relayHub.depositFor(payMasterAddress, { value: parseEther("0.1") });
  await tx.wait();

  console.log('PayMaster balance:', await relayHub.balanceOf(payMasterAddress));
  console.log('Admin wallet balance', await provider.getBalance(admin.address));
};

async function main() {
  await hre.run('compile');

  await fund();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
