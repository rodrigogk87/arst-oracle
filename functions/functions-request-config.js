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
  secretsLocation: 0, // <-- AGREGAR ESTO
  secrets: {},       // <-- aunque vacío, incluilo
  args: [],
  bytesArgs: [],
  expectedReturnType: ReturnType.uint256,
  callbackGasLimit: 300_000, 
  dataVersion: 1
};
