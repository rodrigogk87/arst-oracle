# ARS/USDT Consumer using Chainlink Functions

This project demonstrates how to fetch and store ARS/USDT price data on-chain using [Chainlink Functions](https://chain.link/functions).

---

## 📦 Includes

* A Solidity consumer contract
* Node.js scripts to simulate, build, and send requests
* A script to read on-chain results

---

## ⚙️ Requirements

* Node.js >= 18
* Hardhat or Foundry (for contract deployment)
* A funded wallet (EOA) with Sepolia ETH
* Chainlink Functions subscription with LINK

---

## 💡 Setup

### Install dependencies

```bash
npm install
```

### Configure environment

Create a `.env` file:

```env
PRIVATE_KEY=your_private_key
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_project_id
CONSUMER_ADDRESS=your_deployed_consumer_contract
SUBSCRIPTION_ID=your_subscription_id
DON_ID_STRING=your_don_id (e.g., fun-ethereum-sepolia-1)
```

---

## 🚀 Usage

### Simulate & send request

```bash
node functions/request-arsusdt.js
```

This script will:

* Simulate your JavaScript source off-chain
* Build the CBOR payload
* Send a request via the consumer contract

### Query on-chain result

```bash
node queries/latestAnswer.js
```

This prints:

* ✅ Latest ARS/USDT price stored on-chain
* 🆔 Last request ID

---

## 📄 Contract

The Solidity contract (`ARSUSDTConsumer.sol`) is based on `FunctionsClient`.

It includes:

* `latestAnswer`: stores the last fetched price
* `sendRequest`: sends the Chainlink Functions request
* `_fulfillRequest`: callback function to decode and store the response

---

## ⚠️ Notes

* The consumer contract **must be added to your Chainlink Functions subscription** and have enough LINK.
* Your EOA needs ETH to pay gas fees.
* Adjust `callbackGasLimit` if your JavaScript source requires more computation.

---

## 📄 License

MIT

---

## 💬 Questions?

Feel free to open an issue or pull request! ✨
