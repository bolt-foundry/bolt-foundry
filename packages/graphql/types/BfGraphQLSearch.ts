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
    const allMedia = await BfMedia.query(
      bfCurrentViewer,
      { bfOid: bfCurrentViewer.organizationBfGid },
    );
    const documents = allMedia.map((media) => {
      // get the transcript
      const transcriptEdge = BfEdge.queryTargetsConnectionForGraphQL(
        bfCurrentViewer,
        BfMediaTranscript as unknown as typeof BfNode,
        media.metadata.bfGid,
        {},
        {},
      );
      console.log(transcriptEdge);

      // const { filename, words } = doc.props as BfMediaTranscriptProps;
      // const { bfGid: id } = doc.metadata;
      // return { id, filename, words };
    });
    return {
      success: true,
      message: "Success",
    };
    // try {
    //   const message = await callAPI(
    //     input,
    //     documents,
    //     suggestedModel,
    //   );
    //   return {
    //     success: true,
    //     message,
    //   };
    // } catch (error) {
    //   return {
    //     success: false,
    //     message: `Form submission failed. ${error}`,
    //   };
    // }
  },
});
