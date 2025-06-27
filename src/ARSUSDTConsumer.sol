// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/functions/v1_3_0/FunctionsClient.sol";

contract ARSUSDTConsumer is FunctionsClient {
    uint256 public latestAnswer;
    bytes32 public lastRequestId;

    constructor(address router) FunctionsClient(router) {}

    function sendRequest(
        bytes memory requestCBOR,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        bytes32 donId
    ) external returns (bytes32) {
        bytes32 requestId = _sendRequest(
            requestCBOR,
            subscriptionId,
            callbackGasLimit,
            donId
        );
        lastRequestId = requestId;
        return requestId;
    }

    function _fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (err.length == 0 && response.length > 0) {
            latestAnswer = abi.decode(response, (uint256));
            lastRequestId = requestId;
        }
    }
}
