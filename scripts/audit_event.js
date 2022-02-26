const hre = require("hardhat");
const address = require('./address');
const Counter = require('../artifacts/contracts/Counter.sol/Counter.json');

async function main() {
  const [admin] = await ethers.getSigners();
  const chainId = hre.network.config.chainId;
  const counterAddress = address.getCounter(chainId);
  const counter = new web3.eth.Contract(Counter.abi, counterAddress, {
    from: admin.address,
    gasPrice: 0
  });

  // see documentation: https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html#getpastevents
  var events = await counter.getPastEvents("Increment", {
    fromBlock: 0, toBlock: 'latest'
  });
  for (let i = 0; i < events.length; i++) {
    let event = events[i];
    console.log(event.returnValues.by, event.returnValues.to);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit();
  });
