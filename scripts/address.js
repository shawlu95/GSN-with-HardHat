const getCounter = (networkId) => {
  return {
    4: '0x566B67A276f1a5E8148970e2141ad08F6078B0a3'
  }[networkId];
};

const getPayMaster = (networkId) => {
  return {
    4: '0xA6e10aA9B038c9Cddea24D2ae77eC3cE38a0c016'
  }[networkId];
};

const getRelayHub = (networkId) => {
  return {
    4: '0x6650d69225CA31049DB7Bd210aE4671c0B1ca132'
  }[networkId];
};

const getForwarder = (networkId) => {
  return {
    4: '0x83A54884bE4657706785D7309cf46B58FE5f6e8a'
  }[networkId];
};

module.exports = {
  getCounter,
  getPayMaster,
  getRelayHub,
  getForwarder
}