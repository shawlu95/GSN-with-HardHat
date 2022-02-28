# GSN with HardHat
Demonstrate increment the Counter usign a gasless user. This repo is meant to be used only on testnet (not local chain). All examples are using Rinkeby.

### Setup
Install dependencies.
```bash
yarn
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
npx hardhat run scripts/deploy.js --network rinkeby
```

___
### Verify Counter
Optionally verify the `Counter` contract ([example](https://rinkeby.etherscan.io/address/0x566B67A276f1a5E8148970e2141ad08F6078B0a3#code)).
```
# The forwarder's address is passed in as an argument
npx hardhat verify --network rinkeby \
  0x566B67A276f1a5E8148970e2141ad08F6078B0a3 \
  0x83A54884bE4657706785D7309cf46B58FE5f6e8a
```

___
 ### Deploy Whitelist Paymaster
 Similar to the main contract, we deploy the custom paymaster contract and verify it. The whitelist paymaster has been deployed to Rinkeby [here](https://rinkeby.etherscan.io/address/0x8Edb738326d9cb48d8971be32d4E724C0A11d1f4#code)). If you want to re-deploy your own instance, remember to update [address.js](./scripts/address.js).
 ```bash
 # deployed to 0x8Edb738326d9cb48d8971be32d4E724C0A11d1f4
 npx hardhat run scripts/deploy_whitelist_paymaster.js --network rinkeby

 npx hardhat verify --network rinkeby \
   0x8Edb738326d9cb48d8971be32d4E724C0A11d1f4
 ```

___
### Fund Paymaster
Here we use the WhitelistPaymaster. If the pay master runs out of fund, you need to deposit some ether for your paymaster, by interacting with the `RelayHub`. Make sure your `ADMIN_KEY` account has enough ether.

```bash
npx hardhat run scripts/fund.js --network rinkeby
```

___
### Test
The test simple creates a new gasless user on the fly, and use the gasless user to increment the counter.

```bash
npx hardhat test --network rinkeby
```

Results:
```bash
  Test Counter
    ✓ Increment count from gasless user (10320ms)


  1 passing (12s)
```

Check events on [etherscan](https://rinkeby.etherscan.io/address/0x566B67A276f1a5E8148970e2141ad08F6078B0a3#events).