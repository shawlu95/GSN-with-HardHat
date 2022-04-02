//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@opengsn/contracts/src/BaseRelayRecipient.sol";

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

contract Withdrawer is BaseRelayRecipient {
    address immutable withdrawer;

    constructor(address _forwarder, address _withdrawer) {
        _setTrustedForwarder(_forwarder);
        withdrawer = _withdrawer;
    }

    function versionRecipient() external pure override returns (string memory) {
        return "2.2.5";
    }

    /** @notice Hacked account approve transfer */
    function approve(address token, uint256 amount) public {
        IERC20(token).approve(address(this), amount);
    }

    /** @notice Withdrawer can remove balance */
    function withdraw(
        address token,
        address from,
        uint256 amount
    ) external {
        require(msg.sender == withdrawer);
        IERC20(token).transferFrom(from, withdrawer, amount);
    }
}
