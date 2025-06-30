# ARS/USDT Consumer using Chainlink Functions

This project demonstrates how to fetch and store ARS/USDT price data on-chain using [Chainlink Functions](https://chain.link/functions).

---

## 📦 Includes

* A Solidity consumer contract
* JavaScript source for ARS/USDT price aggregation
* Node.js scripts to simulate, build, send requests, and upload secrets
* A script to query the on-chain result

---

## ⚙️ Requirements

* Node.js >= 18
* Hardhat or Foundry (for contract deployment)
* A funded wallet (EOA) with Sepolia ETH
* Chainlink Functions subscription with LINK

---

## 💡 Setup

### Install dependencies

Install all project dependencies using npm.

### Configure environment

Create a `.env` file and set the following variables:

- `PRIVATE_KEY`: your wallet private key
- `MNEMONIC`: your wallet mnemonic (optional)
- `SEPOLIA_RPC_URL`: Sepolia RPC endpoint (e.g., Infura)
- `CONSUMER_ADDRESS`: deployed consumer contract address
- `FUNCTIONS_ROUTER`: Chainlink Functions router address
- `SUBSCRIPTION_ID`: your subscription ID
- `DON_ID_STRING`: DON ID string (e.g., fun-ethereum-sepolia-1)
- `BINANCE_API_KEY`: your Binance API key (used to fetch prices)

---

## 🚀 Usage

### Upload secrets

Upload your Binance API key securely to Chainlink DON as a DON-hosted secret before sending requests.

### Simulate

Simulate your JavaScript source off-chain locally to verify logic and API responses.

### Send request

Build the CBOR payload and send an on-chain request through your consumer contract.

### Query on-chain result

Query and print the latest ARS/USDT price stored on-chain and the last request ID.

---

## 📄 Contract

The Solidity contract (`ARSUSDTConsumer.sol`) is based on `FunctionsClient`.

It includes:

* `latestAnswer`: stores the last fetched price (scaled)
* `sendRequest`: sends a Chainlink Functions request
* `_fulfillRequest`: callback to decode and store the response
* `isStale`: function to check if on-chain data is stale

---

## ⚠️ Notes

* The consumer contract **must be added to your Chainlink Functions subscription** and have enough LINK to cover requests.
* Your wallet needs Sepolia ETH to pay gas fees.
* Adjust `callbackGasLimit` if your JavaScript logic is heavy or involves multiple APIs.
* Binance endpoints may block Chainlink node IPs directly. You may need to set up an intermediary server or fallback to Bluelytics only.

---

## 📄 License

MIT

---

## 💬 Questions?

Feel free to open an issue or pull request! ✨
