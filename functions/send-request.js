import dotenv from "dotenv";
import { ethers } from "ethers";
import pkg from "@chainlink/functions-toolkit";
const { buildRequestCBOR } = pkg;
import config from "./send-request-config.js";

dotenv.config();

const consumerAbi = [
  "function sendRequest(bytes requestCBOR, uint64 subscriptionId, uint32 callbackGasLimit, bytes32 donId) external returns (bytes32)"
];

async function main() {
  const { PRIVATE_KEY, SEPOLIA_RPC_URL, DON_ID_STRING, SUBSCRIPTION_ID, CONSUMER_ADDRESS } = process.env;

  if (!PRIVATE_KEY || !SEPOLIA_RPC_URL || !DON_ID_STRING || !SUBSCRIPTION_ID || !CONSUMER_ADDRESS) {
    throw new Error("🚫 Missing environment variables.");
  }

  const provider = new ethers.providers.JsonRpcProvider(SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const consumer = new ethers.Contract(CONSUMER_ADDRESS, consumerAbi, wallet);

  // Encode request CBOR
  const requestCBOR = buildRequestCBOR({
    codeLocation: config.codeLocation,
    codeLanguage: config.codeLanguage,
    source: config.source,
    args: config.args,
    bytesArgs: [],
    expectedReturnType: config.expectedReturnType,
  });

  const DON_ID = ethers.utils.formatBytes32String(DON_ID_STRING);

  console.log("🚀 Sending request from consumer contract...");

  const tx = await consumer.sendRequest(
    requestCBOR,
    BigInt(SUBSCRIPTION_ID),
    config.callbackGasLimit,
    DON_ID
  );

  console.log(`📡 Tx sent: ${tx.hash}`);
  const receipt = await tx.wait();
  console.log(`✅ Confirmed in block ${receipt.blockNumber}`);
}

main().catch((err) => {
  console.error("❌ Unhandled error:", err);
});
