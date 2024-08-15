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
import { BfJob } from "packages/bfDb/models/BfJob.ts";
import { BfAnyid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";

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
    const mediaPromise = BfMedia.find(bfCurrentViewer, mediaId as BfAnyid);
    const transcriptPromise = BfMediaTranscript.find(
      bfCurrentViewer,
      transcriptId as BfAnyid,
    );
    const [media, transcript] = await Promise.all([
      mediaPromise,
      transcriptPromise,
    ]);

    // TODO symlink file to a folder
    // create "transcript" to the same folder with the same name.
    // bfgid.mp4
    // bfgid.json
    const payload = {
      file: {
        url: media?.props.filename,
      },
      transcript: {
        start_time: startTime,
        end_time: endTime,
        transcript: transcript?.props.words,
      },
    };

    // @ts-expect-error typing is wrong and we know it
    await BfJob.createJobForNode(media, "example", [payload], true);

    return { success: true };
  },
});
