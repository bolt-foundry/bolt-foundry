import { AssemblyAI } from "packages/transcribing/deps.ts";

import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);

const ASSEMBLY_AI_KEY = Deno.env.get("ASSEMBLY_AI_KEY");

export async function transcribeAudio(mediaId: string, inputAudio?: string) {
  const WEBHOOK_URL = `https://${
    Deno.env.get("REPLIT_DEV_DOMAIN")
  }/webhooks/assemblyai?mediaId=${mediaId ?? ""}&inputAudio=${
    inputAudio ?? ""
  }`;

  const assemblyai = new AssemblyAI({
    apiKey: ASSEMBLY_AI_KEY,
  });
  if (!assemblyai) {
    logger.error("Failed to create AssemblyAI instance");
    return 1;
  }

  // send audio to assembly ai for transcribing
  await assemblyai.transcripts.submit({
    audio_url: inputAudio,
    speaker_labels: true,
    webhook_url: WEBHOOK_URL,
  });
}
