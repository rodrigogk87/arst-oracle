import fs from "fs";
import dotenv from "dotenv";
import {
  Location,
  ReturnType,
  CodeLanguage
} from "@chainlink/functions-toolkit";

dotenv.config();

export default {
  source: fs.readFileSync("./functions/ars_price_source.js").toString(),
  codeLocation: Location.Inline,
  codeLanguage: CodeLanguage.JavaScript,
  secretsLocation: Location.Inline,
  secrets: {
    binanceKey: process.env.BINANCE_API_KEY // You must provide it locally!
  },
  args: [],
  bytesArgs: [],
  expectedReturnType: ReturnType.uint256,
  callbackGasLimit: 300_000, 
  dataVersion: 1
};
