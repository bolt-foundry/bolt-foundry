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
      logger.debug("Couldn't find clip, creating")
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
      logger.debug("Uploaded file successfully", file)
      return clip.toGraphql();
    }
  },
});

