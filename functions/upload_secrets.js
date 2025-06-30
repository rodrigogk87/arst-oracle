import dotenv from "dotenv";
import { SecretsManager } from "@chainlink/functions-toolkit";
import { ethers } from "ethers";

dotenv.config();

const uploadSecrets = async () => {
  const routerAddress = "0xb83E47C2bC239B3bf370bc41e1459A34b41238D0";
  const donId = "fun-ethereum-sepolia-1";
  const gatewayUrls = [
    "https://01.functions-gateway.testnet.chain.link/",
    "https://02.functions-gateway.testnet.chain.link/",
  ];

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) throw new Error("private key not provided");

  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  if (!rpcUrl) throw new Error("rpcUrl not provided");

  const secrets = { binanceKey: process.env.BINANCE_API_KEY };

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey);
  const signer = wallet.connect(provider);

  const secretsManager = new SecretsManager({
    signer: signer,
    functionsRouterAddress: routerAddress,
    donId: donId,
  });
  await secretsManager.initialize();

  const encryptedSecretsObj = await secretsManager.encryptSecrets(secrets);
  const slotIdNumber = 0;
  const expirationTimeMinutes = 3600 ; // ~1 day

  console.log(`Uploading encrypted secret to gateways...`);

  const uploadResult = await secretsManager.uploadEncryptedSecretsToDON({
    encryptedSecretsHexstring: encryptedSecretsObj.encryptedSecrets,
    gatewayUrls: gatewayUrls,
    slotId: slotIdNumber,
    minutesUntilExpiration: expirationTimeMinutes,
  });

  if (!uploadResult.success) {
    throw new Error(`Encrypted secrets not uploaded to ${gatewayUrls}`);
  }

  console.log(`✅ Secrets uploaded! Gateways response: `, uploadResult);

  const donHostedSecretsVersion = parseInt(uploadResult.version);
  console.log(`✅ Secrets version: ${donHostedSecretsVersion}`);
};

uploadSecrets().catch((e) => {
  console.error(e);
  process.exit(1);
});
