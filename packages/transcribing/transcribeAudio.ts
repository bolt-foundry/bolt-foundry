import { parseArgs } from "infra/bff/deps.ts";
import { AssemblyAI } from "packages/transcribing/deps.ts";
import { IBfCurrentViewerInternalAdminOmni } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfMediaTranscript } from "packages/bfDb/models/BfMediaTranscript.ts";

import { BfMedia } from "packages/bfDb/models/BfMedia.ts";
import { BfAnyid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);

const ASSEMBLY_AI_KEY = Deno.env.get("ASSEMBLY_AI_KEY");

export async function transcribeAudio(args: Array<string>) {
  const flags = parseArgs(args, {
    string: ["inputAudio", "mediaId"],
  });
  logger.info("flags", flags);

  let inputAudio = flags.inputAudio;
  if (!flags.i) {
    // RH test audio
    inputAudio =
      "https://bf-static-assets.s3.amazonaws.com/test-files/rh-tonigh-show+6min+audio.m4a";
  }
  logger.info("Input audio", inputAudio);

  const WEBHOOK_URL = `https://${
    Deno.env.get("REPLIT_DEV_DOMAIN")
  }/webhooks/assemblyai?mediaId=${flags.mediaId ?? ""}&inputAudio=${
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

export async function tempCreateTranscript(
  transcriptId: string,
  mediaId?: string | null,
  inputAudio?: string | null,
) {
  const currentViewer = IBfCurrentViewerInternalAdminOmni.__DANGEROUS__create(
    import.meta,
    "bf_internal_org",
  );

  const assemblyai = new AssemblyAI({
    apiKey: ASSEMBLY_AI_KEY,
  });
  if (!assemblyai) {
    logger.error("Failed to create AssemblyAI instance");
    throw new Error("Failed to create AssemblyAI instance");
  }
  const transcript = await assemblyai.transcripts.get(transcriptId);

  // create transcript
  logger.info("Creating Transcript");
  const bfTranscript = await BfMediaTranscript.create(currentViewer, {
    words: JSON.stringify(transcript.words),
    filename: inputAudio,
  });
  logger.info("Transcript created", bfTranscript.metadata.bfGid);

  // create media
  logger.info("Creating Media or connecting to existing Media");
  let bfMedia;
  if (mediaId && mediaId !== "") {
    bfMedia = await BfMedia.findX(currentViewer, mediaId as BfAnyid);
    logger.info("Media found");
  } else {
    bfMedia = await BfMedia.create(currentViewer, {
      filename: "Randall is awesome",
    });
    logger.info("Media created", bfMedia.metadata.bfGid);
  }

  // create edge
  logger.info("Connecting Media to Transcript");
  const bfEdge = await BfEdge.create(currentViewer, {}, {
    // @ts-expect-error idk why the metadata types are messed up for bf edges.
    bfTClassName: "BfMediaTranscript",
    bfTid: bfTranscript.metadata.bfGid,
    bfSClassName: "BfMedia",
    bfSid: bfMedia.metadata.bfGid,
  });
  logger.info("Edge created", bfEdge.metadata.bfGid);
}
