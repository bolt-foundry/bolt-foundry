import { register } from "infra/bff/mod.ts";
import startSpinner from "lib/terminalSpinner.ts";
import { parseArgs } from "infra/bff/deps.ts";
import { AssemblyAI } from "infra/bff/deps.ts";
import { IBfCurrentViewerInternalAdminOmni } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfMediaTranscript } from "packages/bfDb/models/BfMediaTranscript.ts";

import { getLogger } from "deps.ts";
import { BfMedia } from "packages/bfDb/models/BfMedia.ts";
import { BfAnyid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
const logger = getLogger(import.meta);

async function transcribe(args: Array<string>) {
  // deno-lint-ignore no-console
  console.log("running transcribe");
  const stopSpinner = startSpinner();
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

  const ASSEMBLY_AI_KEY = Deno.env.get("ASSEMBLY_AI_KEY");

  const assemblyai = new AssemblyAI({
    apiKey: ASSEMBLY_AI_KEY,
  });
  if (!assemblyai) {
    logger.error("Failed to create AssemblyAI instance");
    return 1;
  }

  // send audio to assembly ai for transcribing
  const response = await assemblyai.transcripts.transcribe({
    audio_url: inputAudio,
    speaker_labels: true,
  }, {});

  const currentViewer = IBfCurrentViewerInternalAdminOmni.__DANGEROUS__create(
    import.meta,
    "bf_internal_org",
  );

  // create transcript
  logger.info("Creating Transcript");
  const transcript = await BfMediaTranscript.create(currentViewer, {
    words: JSON.stringify(response.words),
    filename: inputAudio,
  });
  logger.info("Transcript created", transcript.metadata.bfGid);

  // create media
  logger.info("Creating Media or connecting to existing Media");
  let media;
  if (flags.mediaId) {
    media = await BfMedia.findX(currentViewer, flags.mediaId as BfAnyid);
    logger.info("Media found");
  } else {
    media = await BfMedia.create(currentViewer, {
      filename: "Transcript only",
    });
    logger.info("Media created", media.metadata.bfGid);
  }

  // create edge
  logger.info("Connecting Media to Transcript");
  const edge = await BfEdge.create(currentViewer, {}, {
    // @ts-expect-error idk why the metadata types are messed up for bf edges.
    bfTClassName: "BfMediaTranscript",
    bfTid: transcript.metadata.bfGid,
    bfSClassName: "BfMedia",
    bfSid: media.metadata.bfGid,
  });
  logger.info("Edge created", edge.metadata.bfGid);

  stopSpinner();
  return 0;
}

register(
  "transcribe",
  "Transcribes audio/video and saves to db",
  transcribe,
);
