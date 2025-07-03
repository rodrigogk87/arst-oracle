import dotenv from "dotenv";
import { SecretsManager } from "@chainlink/functions-toolkit";
import { ethers } from "ethers";

dotenv.config();

const uploadSecrets = async () => {
  const network = process.argv[2];
  if (!network) {
    throw new Error("❌ Debes pasar la red como argumento. Ej: node uploadSecrets.js sepolia");
  }

  const NETWORK_UPPER = network.toUpperCase();

  // Variables dinámicas
  const RPC_VAR_NAME = `${NETWORK_UPPER}_RPC_URL`;
  const DON_ID_VAR_NAME = `${NETWORK_UPPER}_DON_ID_STRING`;
  const ROUTER_VAR_NAME = `${NETWORK_UPPER}_FUNCTIONS_ROUTER`;

  const rpcUrl = process.env[RPC_VAR_NAME];
  const donId = process.env[DON_ID_VAR_NAME];
  const routerAddress = process.env[ROUTER_VAR_NAME];
  const privateKey = process.env.PRIVATE_KEY;
  const binanceKey = process.env.BINANCE_API_KEY;

  if (!rpcUrl || !donId || !routerAddress || !privateKey || !binanceKey) {
    throw new Error(`🚫 Falta alguna variable: ${RPC_VAR_NAME}, ${DON_ID_VAR_NAME}, ${ROUTER_VAR_NAME}, PRIVATE_KEY o BINANCE_API_KEY en .env`);
  }

  const gatewayUrls = [
    "https://01.functions-gateway.testnet.chain.link/",
    "https://02.functions-gateway.testnet.chain.link/",
  ];

  const secrets = { binanceKey };

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey);
  const signer = wallet.connect(provider);

  const secretsManager = new SecretsManager({
    signer,
    functionsRouterAddress: routerAddress,
    donId,
  });

  await secretsManager.initialize();

  const encryptedSecretsObj = await secretsManager.encryptSecrets(secrets);

  const slotIdNumber = 0;
  const expirationTimeMinutes = 60 * 24; // 1 día

  console.log(`🔐 Subiendo secrets encriptados a gateways...`);

  const uploadResult = await secretsManager.uploadEncryptedSecretsToDON({
    encryptedSecretsHexstring: encryptedSecretsObj.encryptedSecrets,
    gatewayUrls,
    slotId: slotIdNumber,
    minutesUntilExpiration: expirationTimeMinutes,
  });

  if (!uploadResult.success) {
    throw new Error(`❌ Secrets no subidos correctamente a ${gatewayUrls}`);
  }

  console.log(`✅ Secrets subidos correctamente. Respuesta:`, uploadResult);

  const donHostedSecretsVersion = parseInt(uploadResult.version);
  console.log(`✅ Versión de secrets: ${donHostedSecretsVersion}`);
};

uploadSecrets().catch((e) => {
  console.error("❌ Error no manejado:", e);
  process.exit(1);
});


// node uploadSecrets.js sepolia
// node uploadSecrets.js arb_sepolia