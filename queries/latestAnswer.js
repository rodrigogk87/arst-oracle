import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

const consumerAbi = [
  "function latestAnswer() view returns (uint256)",
  "function lastRequestId() view returns (bytes32)"
];

async function main() {
  const { ETH_RPC_URL, CONSUMER_ADDRESS } = process.env;

  if (!ETH_RPC_URL || !CONSUMER_ADDRESS) {
    throw new Error("🚫 Missing ETH_RPC_URL or CONSUMER_ADDRESS in .env");
  }

  const provider = new ethers.providers.JsonRpcProvider(ETH_RPC_URL);
  const consumer = new ethers.Contract(CONSUMER_ADDRESS, consumerAbi, provider);

  const latestAnswer = await consumer.latestAnswer();
  const lastRequestId = await consumer.lastRequestId();

  console.log("✅ Latest Answer:", latestAnswer.toString());
  console.log("🆔 Last Request ID:", lastRequestId);
}

main().catch((err) => {
  console.error("❌ Unhandled error:", err);
});
