import {
  arg,
  extendType,
  mutationField,
  nonNull,
  objectType,
  stringArg,
} from "packages/graphql/deps.ts";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";
import { BfTranscript } from "packages/bfDb/models/BfTranscript.ts";
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);

export const BfGraphQLTranscriptType = objectType({
  name: "BfTranscript",
  description: "A transcript of a clip.",
  definition: (t) => {
    t.implements(BfNodeGraphQLType);
    t.string("transcript");
  },
});

export const BfGraphQLTranscriptsQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('transcripts', {
      type: BfGraphQLTranscriptType,
      resolve: async (_, __, { bfCurrentViewer }) => {
        logger.debug('Fetching all transcripts');
        const transcripts = await BfTranscript.findTranscriptsByViewer(bfCurrentViewer);
        logger.debug('Fetched all transcripts successfully', transcripts);
        return transcripts.map(transcript => transcript.toGraphql());
      },
    });
  },
});

export const BfGraphQLTranscriptCreateMutation = mutationField("createTranscript", {
  type: BfGraphQLTranscriptType,
  args: {
    transcript: nonNull(stringArg()),
  },
  resolve: async (_, { transcript }, { bfCurrentViewer }) => {
    logger.debug("createTranscript", { transcript });
    const newTranscript = await BfTranscript.create(bfCurrentViewer, {
      transcript,
    });
    logger.debug("Created new transcript successfully", newTranscript);
    return newTranscript.toGraphql();
  },
});


export const BfGraphQLTranscriptDeleteMutation = mutationField("deleteTranscript", {
  type: BfGraphQLTranscriptType,
  args: {
    id: nonNull(stringArg()),
  },
  resolve: async (_, { id }, { bfCurrentViewer }) => {
    const transcript = await BfTranscript.find(bfCurrentViewer, id)
    logger.debug("deleteTranscript", { id });
    await transcript.delete();
    logger.debug("Deleted transcript successfully");
    return transcript.toGraphql();
  },
});
