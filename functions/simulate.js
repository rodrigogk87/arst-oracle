import dotenv from "dotenv";
import pkg from "@chainlink/functions-toolkit";
const { simulateScript, decodeResult } = pkg;
import config from "./simulate-config.js";

dotenv.config();

async function main() {
  // Simulate
  const { responseBytesHexstring, errorString, capturedTerminalOutput } = await simulateScript(config);
  console.log(`${capturedTerminalOutput}\n`);

  if (responseBytesHexstring) {
    console.log(
      `✅ Simulated result: ${decodeResult(responseBytesHexstring, config.expectedReturnType).toString()}`
    );
  }

  if (errorString) {
    throw new Error(`❌ Simulation error: ${errorString}`);
  }
}

main().catch((err) => {
  console.error("❌ Unhandled error:", err);
});
