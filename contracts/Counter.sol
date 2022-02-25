pragma solidity ^0.8.7;
// SPDX-License-Identifier: MIT

import "@opengsn/contracts/src/BaseRelayRecipient.sol";

contract Counter is BaseRelayRecipient {
    uint256 public counter;
    address public lastCaller;
    event Increment(address indexed by, uint256 to);

    constructor(address _forwarder) {
        _setTrustedForwarder(_forwarder);
    }

    function increment() public {
        counter++;
        lastCaller = _msgSender();
        emit Increment(_msgSender(), counter);
    }

    function versionRecipient() external pure override returns (string memory) {
        return "2.2.5";
    }
}
