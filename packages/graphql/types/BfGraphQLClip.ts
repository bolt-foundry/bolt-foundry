import {
  arg,
  mutationField,
  nonNull,
  objectType,
  stringArg,
} from "packages/graphql/deps.ts";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";
import { BfClip } from "packages/bfDb/models/BfClip.ts";
import { getLogger } from "deps.ts";
import { BfMediaNodeTranscript } from "packages/bfDb/models/BfMediaNodeTranscript.ts";
import { BfMedia } from "packages/bfDb/models/BfMedia.ts";
import { floatArg } from "packages/graphql/deps.ts";
import { BfJob } from "packages/bfDb/models/BfJob.ts";
import {
  type BfAnyid,
  toBfGid,
} from "packages/bfDb/classes/BfBaseModelIdTypes.ts";

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
      clip = await BfClip.__DANGEROUS__createUnattached(bfCurrentViewer, {
        title,
      }, {
        bfGid: toBfGid(originalClipId),
      });
    }
    if (clip) {
      const file = params.variables.file;
      logger.debug("Uploading file to new storage", file);
      await clip.createNewClipReview(file);
      logger.debug("Uploaded file successfully", file);
      return clip.toGraphql();
    }
    return null;
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
    title: nonNull(stringArg()),
    transcriptId: nonNull(stringArg()),
    startTime: nonNull(floatArg()),
    endTime: nonNull(floatArg()),
  },
  resolve: async (
    _,
    { mediaId, title, transcriptId, startTime, endTime },
    { bfCurrentViewer },
  ) => {
    logger.debug("downloadClip", {
      mediaId,
      title,
      transcriptId,
      startTime,
      endTime,
    });
    const mediaPromise = BfMedia.find(bfCurrentViewer, mediaId as BfAnyid);
    const transcriptPromise = BfMediaNodeTranscript.find(
      bfCurrentViewer,
      transcriptId as BfAnyid,
    );
    const [media, transcript] = await Promise.all([
      mediaPromise,
      transcriptPromise,
    ]);

    // TODO get settings from Org
    const settings = {
      captionLines: 3,
      captionWordsPerLine: 15,
      template: "joe",
      captionColor: "white",
      captionHighlightColor: "rgb(255, 255, 70)",
      font: "BebasNeue",
      fontSize: 96,
      showCaptions: true,
      strokeColor: "rgba(0, 0, 0, 0.75)",
      strokeWidth_px: 6,
      useEndCap: false,
      capCta: "",
      capName: "",
      useTitle: false,
      titleColor: "red",
      titleStrokeColor: "yellow",
      titleStrokeWidth: 12,
      showWatermark: true,
      watermarkLogo: "made_with_bf.png",
      watermarkOpacity: 0.75,
      watermarkPosition: "under_caption",
      watermarkScale: 0.5,
    };

    const payload = {
      file: {
        url: media?.props.filename,
        fileId: media?.props.fileId,
      },
      title: title,
      transcript: {
        start_time: startTime,
        end_time: endTime,
        settings,
        title,
        transcript: JSON.parse(transcript?.props.words ?? "[]"),
      },
    };

    // @ts-expect-error typing is wrong and we know it
    try {
      await BfJob.createJobForNode(media, "downloadClip", [payload], true);
    } catch (error) {
      logger.error(error);
      return { success: false };
    }
    return { success: true };
  },
});
