// node latestData.js sepolia
// node latestData.js arb_sepolia

import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

const consumerAbi = [
  "function latestData() view returns (uint256,uint256,uint256)",
  "function lastRequestId() view returns (bytes32)"
];

async function main() {
  // Leer red desde argumentos
  const network = process.argv[2];

  if (!network) {
    throw new Error("❌ Debes pasar la red como argumento. Ej: node script.js sepolia");
  }

  // Convertir a mayúsculas
  const NETWORK_UPPER = network.toUpperCase();

  // Construir nombre de variable para RPC y address
  const RPC_VAR_NAME = `${NETWORK_UPPER}_RPC_URL`;
  const ADDRESS_VAR_NAME = `${NETWORK_UPPER}_CONSUMER_ADDRESS`;

  const RPC_URL = process.env[RPC_VAR_NAME];
  const CONSUMER_ADDRESS = process.env[ADDRESS_VAR_NAME];

  if (!RPC_URL || !CONSUMER_ADDRESS) {
    throw new Error(`🚫 Falta ${RPC_VAR_NAME} o ${ADDRESS_VAR_NAME} en .env`);
  }

  console.log(`🔗 Usando RPC: ${RPC_URL}`);
  console.log(`🏠 Contrato consumer: ${CONSUMER_ADDRESS}`);

  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
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
