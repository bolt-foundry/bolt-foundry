import {
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
    t.string("words");
    t.string("filename");
  },
});

export const BfGraphQLTranscriptsQuery = extendType({
  type: "BfOrganization",
  definition(t) {
    t.connectionField("transcripts", {
      type: "BfTranscript",
      resolve: (_, args, { bfCurrentViewer }) => {
        logger.debug("Fetching all transcripts");
        const transcripts = BfTranscript.queryConnectionForGraphQL(
          bfCurrentViewer,
          { bfOid: bfCurrentViewer.bfOid },
          {},
          args,
        );
        logger.debug("Fetched all transcripts successfully");
        return transcripts;
      },
    });
  },
});

export const BfGraphQLTranscriptCreateMutation = mutationField(
  "createTranscript",
  {
    type: BfGraphQLTranscriptType,
    args: {
      words: nonNull(stringArg()),
      filename: nonNull(stringArg()),
    },
    resolve: async (_, { words, filename }, { bfCurrentViewer }) => {
      logger.debug("createTranscript");
      const newTranscript = await BfTranscript.create(bfCurrentViewer, {
        words,
        filename,
      });
      logger.debug("Created new transcript successfully");
      return newTranscript.toGraphql();
    },
  },
);

export const BfGraphQLTranscriptUpdateMutation = mutationField(
  "updateTranscript",
  {
    type: BfGraphQLTranscriptType,
    args: {
      id: nonNull(stringArg()),
      words: stringArg(),
      filename: stringArg(),
    },
    resolve: async (_, args, { bfCurrentViewer }) => {
      logger.debug("updateTranscript", args);
      const transcriptToUpdate = await BfTranscript.find(
        bfCurrentViewer,
        args.id,
      );
      if (!transcriptToUpdate) {
        throw new Error("Transcript not found");
      }
      const updatedProperties = Object.entries(args)
        .reduce((acc, [key, value]) => {
          if (value !== undefined && key !== "id") {
            // Exclude 'id' from properties to update
            acc[key] = value;
          }
          return acc;
        }, {} as Partial<{ words: string; filename: string }>);
      transcriptToUpdate.props = updatedProperties;
      transcriptToUpdate.save();
      logger.debug("Updated transcript successfully");
      return transcriptToUpdate.toGraphql();
    },
  },
);

export const BfGraphQLTranscriptDeleteMutation = mutationField(
  "deleteTranscript",
  {
    type: BfGraphQLTranscriptType,
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (_, { id }, { bfCurrentViewer }) => {
      const transcript = await BfTranscript.find(bfCurrentViewer, id);
      if (!transcript) {
        throw new Error("Transcript not found");
      }
      logger.debug("deleteTranscript", { id });
      await transcript.delete();
      logger.debug("Deleted transcript successfully");
      return transcript.toGraphql();
    },
  },
);
