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
  secretsLocation: Location.DONHosted,
  secrets: {
    slotId: 0,             // Slot you chose (0)
    version: 1751305699    // Your new version
  },
  args: [],
  bytesArgs: [],
  expectedReturnType: ReturnType.uint256,
  callbackGasLimit: 300_000, 
  dataVersion: 1
};
