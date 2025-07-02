// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/functions/v1_3_0/FunctionsClient.sol";

contract ARSUSDTOracle is FunctionsClient {
    error ARSUSDTOracle__StaleData();

    /// @notice Latest ARS/USDT answer (scaled, e.g., 1e8)
    uint256 public latestAnswer;

    /// @notice ID of the last request sent
    bytes32 public lastRequestId;

    /// @notice Timestamp when the last request was sent
    uint256 public lastRequestTimestamp;

    /// @notice Timestamp when the last request was fulfilled
    uint256 public lastFulfillTimestamp;

    /// @param router Address of the Chainlink Functions router
    constructor(address router) FunctionsClient(router) {}

    /**
     * @notice Sends a new Chainlink Functions request
     * @param requestCBOR The CBOR-encoded request payload
     * @param subscriptionId Chainlink Functions subscription ID
     * @param callbackGasLimit Gas limit for the fulfill callback
     * @param donId DON ID string (as bytes32)
     * @return requestId The ID of the sent request
     */
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
        lastRequestTimestamp = block.timestamp; // Store request time
        return requestId;
    }

    /**
     * @notice Chainlink Functions fulfillment callback
     * @param requestId The ID of the request being fulfilled
     * @param response The raw response bytes
     * @param err Error data (if any)
     */
    function _fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (err.length == 0 && response.length > 0) {
            latestAnswer = abi.decode(response, (uint256));
            lastRequestId = requestId;
            lastFulfillTimestamp = block.timestamp; // Store fulfillment time
        }
    }

    /**
     * @notice Returns the latest ARS/USDT price if data is considered fresh.
     * @dev Reverts if the oracle data is stale according to provided freshness parameters.
     * @param maxAge Maximum allowable age of data (in seconds) since last fulfillment.
     * @param maxDelay Maximum allowable delay (in seconds) between request and fulfillment.
     * @return answer The latest ARS/USDT price answer (scaled, e.g., 1e8).
     */
    function latestValidData(
        uint256 maxAge,
        uint256 maxDelay
    ) external view returns (uint256 answer) {
        if (isStale(maxAge, maxDelay)) revert ARSUSDTOracle__StaleData();
        return latestAnswer;
    }

    /**
     * @notice Returns the latest price data along with timestamps, similar to latestRoundData
     * @return answer Latest ARS/USDT answer
     * @return requestTimestamp Timestamp when the request was sent
     * @return fulfillTimestamp Timestamp when the request was fulfilled
     */
    function latestData()
        external
        view
        returns (
            uint256 answer,
            uint256 requestTimestamp,
            uint256 fulfillTimestamp
        )
    {
        return (latestAnswer, lastRequestTimestamp, lastFulfillTimestamp);
    }

    /**
     * @notice Check if the latestAnswer data is stale
     * @param maxAge Maximum age allowed since last fulfillment (seconds)
     * @param maxDelay Maximum delay allowed between request and fulfillment (seconds)
     * @return isDataStale True if data is stale or delayed
     */
    function isStale(
        uint256 maxAge,
        uint256 maxDelay
    ) public view returns (bool isDataStale) {
        if (block.timestamp - lastFulfillTimestamp > maxAge) {
            return true; // Data is too old now
        }
        if (lastFulfillTimestamp - lastRequestTimestamp > maxDelay) {
            return true; // Fulfillment took too long
        }
        return false;
    }
}
