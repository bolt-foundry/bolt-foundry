import { register } from "infra/bff/mod.ts";
import startSpinner from "lib/terminalSpinner.ts";
import { transcribeAudio } from "packages/transcribing/transcribeAudio.ts";
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);

async function transcribe(args: Array<string>) {
  logger.info("running transcribe");
  const stopSpinner = startSpinner();
  
  await transcribeAudio(args);
  
  stopSpinner();
  return 0;
}

register(
  "transcribe",
  "Transcribes audio/video and saves to db",
  transcribe,
);
