const getCounter = (networkId) => {
  return {
    4: '0x566B67A276f1a5E8148970e2141ad08F6078B0a3'
  }[networkId];
};

const getPayMaster = (networkId) => {
  return {
    4: '0x8Edb738326d9cb48d8971be32d4E724C0A11d1f4'
  }[networkId];
};

const getRelayHub = (networkId) => {
  return {
    1: '0x9e59Ea5333cD4f402dAc320a04fafA023fe3810D',
    4: '0x6650d69225CA31049DB7Bd210aE4671c0B1ca132'
  }[networkId];
};

const getForwarder = (networkId) => {
  return {
    1: '0xAa3E82b4c4093b4bA13Cb5714382C99ADBf750cA',
    4: '0x83A54884bE4657706785D7309cf46B58FE5f6e8a'
  }[networkId];
};

module.exports = {
  getCounter,
  getPayMaster,
  getRelayHub,
  getForwarder
}