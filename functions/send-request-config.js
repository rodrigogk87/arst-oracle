import fs from "fs";
import dotenv from "dotenv";
import {
  Location,
  ReturnType,
  CodeLanguage
} from "@chainlink/functions-toolkit";

dotenv.config();

export function getConfigForNetwork(network) {
  const NETWORK_UPPER = network.toUpperCase();

  const SLOT_VAR_NAME = `${NETWORK_UPPER}_FUNCTIONS_CONFIG_SECRETS_SLOT`;
  const VERSION_VAR_NAME = `${NETWORK_UPPER}_FUNCTIONS_CONFIG_SECRETS_VERSION`;

  const slotId = process.env[SLOT_VAR_NAME];
  const version = process.env[VERSION_VAR_NAME];

  if (!slotId || !version) {
    throw new Error(`🚫 Falta ${SLOT_VAR_NAME} o ${VERSION_VAR_NAME} en .env`);
  }

  return {
    source: fs.readFileSync("./functions/ars_price_source.js").toString(),
    codeLocation: Location.Inline,
    codeLanguage: CodeLanguage.JavaScript,
    secretsLocation: Location.DONHosted,
    secrets: {
      slotId: parseInt(slotId),
      version: parseInt(version)
    },
    args: [],
    bytesArgs: [],
    expectedReturnType: ReturnType.uint256,
    callbackGasLimit: 300_000,
    dataVersion: 1
  };
}
