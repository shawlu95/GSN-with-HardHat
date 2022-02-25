# GSN with HardHat
Demonstrate increment the Counter usign a gasless user. This repo is meant to be used only on testnet (not local chain). All examples are using Rinkeby.

### Setup
Install dependencies.
```bash
npm install
```

___
### Enviroment Params
Prepare the following params in `.env`:
* `ADMIN_KEY`: private key of an account with testnet ether. Use this account to deploy `Counter` and interact with `RelayHub` (deposit for `PayMaster`).
* `ETHERSCAN_TOKEN`: required if you want to deploy and verify your own `Counter`.
* `INFURA_URL`: create a free Infura account and get a testnet URL.

___
### Deploy Counter
Deploy and verify the contract. This step has been donw with Rinkeby network so you may reuse the contracts. If you choose to deploy your own contract, you need to setup the network in [hardhat.config.js](./hardhat.config.js), and then setup the deployed address in [address.js](./scripts/address.js).

```bash
npx hardhat run script/deploy.js --network rinkeby
```

___
### Verify Counter
Optionally verify the `Counter` contract ([example](https://rinkeby.etherscan.io/address/0xD9aC5f499bE700eC0b528724506107d219695f99#code)).
```
# The forwarder's address is passed in as an argument
npx hardhat verify --network rinkeby \
  0xD9aC5f499bE700eC0b528724506107d219695f99 \
  0x83A54884bE4657706785D7309cf46B58FE5f6e8a
```

___
### Fund Paymaster
This repo uses the accept-everything pay master. If the pay master runs out of fund, you need to deposit some ether for your paymaster, by interacting with the `RelayHub`.

```bash
npx hardhat run script/fund.js --network
```

___
### Test
The test simple creates a new gasless user on the fly, and use the gasless user to increment the counter.

```bash
npx hardhat test --network rinkeby
```