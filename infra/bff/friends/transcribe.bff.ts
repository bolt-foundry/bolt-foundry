import { register } from "infra/bff/mod.ts";
import startSpinner from "lib/terminalSpinner.ts";
import { transcribeAudio } from "packages/transcribing/transcribeAudio.ts";
import { getLogger } from "deps.ts";
import { parseArgs } from "@std/cli";
import { IBfCurrentViewerInternalAdminOmni } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { AssemblyAI } from "assemblyai";
import { BfMediaTranscript } from "packages/bfDb/models/BfMediaTranscript.ts";

import { BfMedia } from "packages/bfDb/models/BfMedia.ts";
import { BfAnyid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfError } from "lib/BfError.ts";

const logger = getLogger(import.meta);

async function transcribe(args: Array<string>) {
  const ASSEMBLY_AI_KEY = Deno.env.get("ASSEMBLY_AI_KEY");
  if (!ASSEMBLY_AI_KEY) throw new BfError("No ASSEMBLY_AI_KEY defined");
  logger.info("running transcribe");
  const stopSpinner = startSpinner();
  const flags = parseArgs(args, {
    string: ["inputAudio", "mediaId"],
  });
  logger.info("flags", flags);
  let inputAudio = flags.inputAudio;
  if (!flags.inputAudio) {
    // RH test audio
    inputAudio =
      "https://bf-static-assets.s3.amazonaws.com/test-files/rh-tonigh-show+6min+audio.m4a";
  }
  logger.info("Input audio", inputAudio);

  await transcribeAudio(flags.mediaId ?? "", inputAudio);

  stopSpinner();
  return 0;
}

export async function createTranscript(
  transcriptId: string,
  mediaId?: string | null,
  inputAudio?: string | null,
) {
  const currentViewer = IBfCurrentViewerInternalAdminOmni.__DANGEROUS__create(
    import.meta,
    "bf_internal_org",
  );

  const ASSEMBLY_AI_KEY = Deno.env.get("ASSEMBLY_AI_KEY");
  if (!ASSEMBLY_AI_KEY) throw new BfError("No ASSEMBLY_AI_KEY defined");
  const assemblyai = new AssemblyAI({
    apiKey: ASSEMBLY_AI_KEY,
  });
  if (!assemblyai) {
    throw new BfError("Failed to create AssemblyAI instance");
  }
  const transcript = await assemblyai.transcripts.get(transcriptId);

  // create or find media
  logger.info("Creating Media or connecting to existing Media");
  let bfMedia;
  if (mediaId && mediaId !== "") {
    bfMedia = await BfMedia.find(currentViewer, mediaId as BfAnyid);
    logger.info("Media found");
  } else {
    bfMedia = await BfMedia.__DANGEROUS__createUnattached(currentViewer, {
      filename: "New media",
    });
    logger.info("Media created", bfMedia.metadata.bfGid);
  }

  if (!(bfMedia instanceof BfMedia)) {
    throw new BfError("bfMedia is not an instance of BfMedia");
  }

  // create transcript
  logger.info("Creating Transcript");
  const bfTranscript = await bfMedia.createTargetNode(
    BfMediaTranscript,
    {
      words: JSON.stringify(transcript.words),
      filename: inputAudio,
    },
    {},
  );
  logger.info("Transcript created", bfTranscript.metadata.bfGid);
}

register(
  "transcribe",
  "Transcribes audio/video and saves to db",
  transcribe,
);
