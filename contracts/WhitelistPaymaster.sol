//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
pragma experimental ABIEncoderV2;

import "@opengsn/contracts/src/BasePaymaster.sol";

// accept everything.
// this paymaster accepts any request.
//
// NOTE: Do NOT use this contract on a mainnet: it accepts anything, so anyone can "grief" it and drain its account
interface IERC20 {
    function balanceOf(address account) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

contract WhitelistPaymaster is BasePaymaster {
    mapping(address => bool) public senderWhitelist;

    function whitelistSender(address sender) public onlyOwner {
        senderWhitelist[sender] = true;
    }

    function versionPaymaster()
        external
        view
        virtual
        override
        returns (string memory)
    {
        return "";
    }

    function preRelayedCall(
        GsnTypes.RelayRequest calldata relayRequest,
        bytes calldata signature,
        bytes calldata approvalData,
        uint256 maxPossibleGas
    )
        external
        virtual
        override
        returns (bytes memory context, bool revertOnRecipientRevert)
    {
        require(senderWhitelist[relayRequest.request.from]);
        return ("", false);
    }

    function postRelayedCall(
        bytes calldata context,
        bool success,
        uint256 gasUseWithoutPost,
        GsnTypes.RelayData calldata relayData
    ) external virtual override {}
}
