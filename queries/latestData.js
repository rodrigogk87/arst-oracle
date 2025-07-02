import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

const consumerAbi = [
  "function latestData() view returns (uint256,uint256,uint256)",
  "function lastRequestId() view returns (bytes32)"
];

async function main() {
  const { SEPOLIA_RPC_URL, CONSUMER_ADDRESS } = process.env;

  if (!SEPOLIA_RPC_URL || !CONSUMER_ADDRESS) {
    throw new Error("🚫 Missing SEPOLIA_RPC_URL or CONSUMER_ADDRESS in .env");
  }

  const provider = new ethers.providers.JsonRpcProvider(SEPOLIA_RPC_URL);
  const oracle = new ethers.Contract(CONSUMER_ADDRESS, consumerAbi, provider);

  const data = await oracle.latestData();
  const lastRequestId = await oracle.lastRequestId();


  console.log("✅ Latest Answer:", data[0].toString());
  console.log("✅ Latest requestTimestamp:", data[1].toString());
  console.log("✅ Latest fulfillTimestamp:", data[2].toString());
  console.log("🆔 Last Request ID:", lastRequestId);
}

main().catch((err) => {
  console.error("❌ Unhandled error:", err);
});
