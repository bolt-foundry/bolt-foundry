import { AssemblyAI } from "assemblyai";

import { BfError } from "lib/BfError.ts";

export async function transcribeAudio(mediaId: string, inputAudio?: string) {
  const ASSEMBLY_AI_KEY = Deno.env.get("ASSEMBLY_AI_KEY");
  if (!ASSEMBLY_AI_KEY) throw new BfError("No ASSEMBLY_AI_KEY defined");
  const WEBHOOK_URL = `https://${
    Deno.env.get("REPLIT_DEV_DOMAIN")
  }/webhooks/assemblyai?mediaId=${mediaId ?? ""}&inputAudio=${
    inputAudio ?? ""
  }`;

  const assemblyai = new AssemblyAI({
    apiKey: ASSEMBLY_AI_KEY,
  });
  if (!assemblyai) {
    throw new BfError("Failed to create AssemblyAI instance");
  }

  // send audio to assembly ai for transcribing
  await assemblyai.transcripts.submit({
    audio_url: inputAudio,
    speaker_labels: true,
    webhook_url: WEBHOOK_URL,
  });

  return 0;
}
