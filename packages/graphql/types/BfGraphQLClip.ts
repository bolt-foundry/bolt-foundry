import {
  arg,
  booleanArg,
  connectionFromArray,
  extendType,
  mutationField,
  nonNull,
  objectType,
  stringArg,
} from "packages/graphql/deps.ts";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";
import { BfClip } from "packages/bfDb/models/BfClip.ts";
import { getLogger } from "deps.ts";
import { BfMediaTranscript } from "packages/bfDb/models/BfMediaTranscript.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
import { BfMedia } from "packages/bfDb/models/BfMedia.ts";
import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { floatArg } from "infra/graphql/deps.ts";

const logger = getLogger(import.meta);

export const BfGraphQLClipType = objectType({
  name: "BfClip",
  definition: (t) => {
    t.implements(BfNodeGraphQLType);
    t.string("title");
  },
});

export const BfGraphQLClipCreateMutation = mutationField("upsertClip", {
  type: BfGraphQLClipType,
  args: {
    originalClipId: nonNull(stringArg()),
    title: stringArg(),
    file: nonNull(arg({ type: "File" })),
  },
  resolve: async (
    _,
    { originalClipId, title },
    { bfCurrentViewer, params },
  ) => {
    logger.debug("upsertClip", { originalClipId, title });
    let clip = await BfClip.find(bfCurrentViewer, originalClipId);
    if (!clip) {
      logger.debug("Couldn't find clip, creating");
      clip = await BfClip.create(bfCurrentViewer, {
        title,
      }, {
        bfGid: originalClipId,
      });
    }
    if (clip) {
      const file = params.variables.file;
      logger.debug("Uploading file to new storage", file);
      await clip.createNewClipReview(file);
      logger.debug("Uploaded file successfully", file);
      return clip.toGraphql();
    }
  },
});

const downloadMutationPayload = objectType({
  name: "DownloadMutationPayload",
  definition(t) {
    t.nonNull.boolean("success");
  },
});

export const BfGraphQLClipDownloadMutation = mutationField("downloadClip", {
  type: downloadMutationPayload,
  args: {
    mediaId: nonNull(stringArg()),
    transcriptId: nonNull(stringArg()),
    startTime: nonNull(floatArg()),
    endTime: nonNull(floatArg()),
  },
  resolve: async (
    _,
    { mediaId, transcriptId, startTime, endTime },
    { bfCurrentViewer },
  ) => {
    logger.debug("downloadClip", { mediaId, transcriptId, startTime, endTime });
    const transcript = await BfMediaTranscript.find(
      bfCurrentViewer,
      transcriptId,
    );

    // This doesn't work... it returns the first media, not from the edge
    // logger.debug("Transcript", transcript);
    // if (!transcript) {
    //   logger.error("Couldn't find transcript", transcriptId);
    //   return null;
    // }
    // const sourceEdges = await BfEdge.querySources(
    //   bfCurrentViewer,
    //   BfMedia as unknown as typeof BfNode,
    //   transcript.bfGid,
    // );

    // if (sourceEdges.length === 0) {
    //   throw new Error("No source edges found");
    // }
    // const MediaBfGid = sourceEdges[0].metadata.bfGid;
    // if (!MediaBfGid) {
    //   throw new Error("No bfSid found in source edge metadata");
    // }
    // const media = await BfMedia.find(bfCurrentViewer, MediaBfGid);

    const dataToReturn = {
      file: {
        url: transcript?.props.filename,
      },
      transcript: {
        start_time: startTime,
        end_time: endTime,
        transcript: transcript?.props.words,
      },
    };
    logger.debug(dataToReturn);

    return { success: true };
  },
});
