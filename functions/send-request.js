import dotenv from "dotenv";
import { ethers } from "ethers";
import pkg from "@chainlink/functions-toolkit";
const { buildRequestCBOR } = pkg;
import { getConfigForNetwork } from "./send-request-config.js";

dotenv.config();

const consumerAbi = [
  "function sendRequest(bytes requestCBOR, uint64 subscriptionId, uint32 callbackGasLimit, bytes32 donId) external returns (bytes32)"
];

async function main() {
  // Leer red desde argumentos
  const network = process.argv[2];
  if (!network) {
    throw new Error("❌ Debes pasar la red como argumento. Ej: node send-request.js sepolia");
  }

  const NETWORK_UPPER = network.toUpperCase();

  // Construir nombres de variables
  const RPC_VAR_NAME = `${NETWORK_UPPER}_RPC_URL`;
  const ADDRESS_VAR_NAME = `${NETWORK_UPPER}_CONSUMER_ADDRESS`;
  const DON_ID_VAR_NAME = `${NETWORK_UPPER}_DON_ID_STRING`;
  const SUBSCRIPTION_VAR_NAME = `${NETWORK_UPPER}_SUBSCRIPTION_ID`;

  const RPC_URL = process.env[RPC_VAR_NAME];
  const CONSUMER_ADDRESS = process.env[ADDRESS_VAR_NAME];
  const DON_ID_STRING = process.env[DON_ID_VAR_NAME];
  const SUBSCRIPTION_ID = process.env[SUBSCRIPTION_VAR_NAME];
  const PRIVATE_KEY = process.env.PRIVATE_KEY;

  if (!PRIVATE_KEY || !RPC_URL || !DON_ID_STRING || !SUBSCRIPTION_ID || !CONSUMER_ADDRESS) {
    throw new Error(`🚫 Falta alguna variable: ${RPC_VAR_NAME}, ${ADDRESS_VAR_NAME}, ${DON_ID_VAR_NAME}, ${SUBSCRIPTION_VAR_NAME}, o PRIVATE_KEY`);
  }

  console.log(`🔗 Usando RPC: ${RPC_URL}`);
  console.log(`🏠 Consumer: ${CONSUMER_ADDRESS}`);
  console.log(`🆔 DON ID: ${DON_ID_STRING}`);
  console.log(`💳 Subscription ID: ${SUBSCRIPTION_ID}`);

  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const consumer = new ethers.Contract(CONSUMER_ADDRESS, consumerAbi, wallet);

  // Obtener config dinámico
  const config = getConfigForNetwork(network);

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

  console.log("🚀 Enviando request desde el consumer contract...");

  const tx = await consumer.sendRequest(
    requestCBOR,
    BigInt(SUBSCRIPTION_ID),
    config.callbackGasLimit,
    DON_ID
  );

  console.log(`📡 Tx enviada: ${tx.hash}`);
  const receipt = await tx.wait();
  console.log(`✅ Confirmada en block ${receipt.blockNumber}`);
}

main().catch((err) => {
  console.error("❌ Unhandled error:", err);
});

// node send-request.js sepolia
// node send-request.js arb_sepolia
