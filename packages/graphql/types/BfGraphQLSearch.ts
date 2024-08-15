import {
  mutationField,
  nonNull,
  objectType,
  stringArg,
} from "packages/graphql/deps.ts";
import { GraphQLContext } from "packages/graphql/graphql.ts";
import {
  BfMediaTranscript,
  BfMediaTranscriptProps,
} from "packages/bfDb/models/BfMediaTranscript.ts";

import { callAPI } from "packages/lib/langchain.ts";
import { BfMedia } from "packages/bfDb/models/BfMedia.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";

const searchMutationPayload = objectType({
  name: "SearchMutationPayload",
  definition(t) {
    t.nonNull.boolean("success");
    t.string("message");
  },
});

export const searchMutation = mutationField("searchMutation", {
  type: searchMutationPayload,
  args: {
    input: nonNull(stringArg()),
    suggestedModel: stringArg(),
  },
  resolve: async (
    _root,
    { input, suggestedModel },
    { bfCurrentViewer }: GraphQLContext,
  ) => {
    const allMedia = await BfMedia.findMediaByViewer(bfCurrentViewer);
    const transcripts = await Promise.all(
      allMedia.map(async (media) => {
        const mediaId = media.metadata.bfGid;
        // get the transcript
        const transcriptsOnMedia = await BfEdge.queryTargets(
          bfCurrentViewer,
          BfMediaTranscript as typeof BfNode,
          media.metadata.bfGid,
        );
        const transcript = transcriptsOnMedia[0]; // assuming there's only one transcript
        const transcriptId = transcript?.metadata.bfGid;

        const { filename, words } = (transcript?.props ??
          { filename: "no file", words: "[]" }) as BfMediaTranscriptProps;
        return { mediaId, transcriptId, filename, words };
      }),
    );

    try {
      const message = await callAPI(
        input,
        transcripts,
        suggestedModel,
      );
      return {
        success: true,
        message,
      };
    } catch (error) {
      return {
        success: false,
        message: `Form submission failed. ${error}`,
      };
    }
  },
});
