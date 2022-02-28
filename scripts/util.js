const isLocal = (chainId) => {
  return [
    1337, 31337
  ].includes(chainId);
};

module.exports = {
  isLocal
}