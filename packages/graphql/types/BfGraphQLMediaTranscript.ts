import {
  extendType,
  mutationField,
  nonNull,
  objectType,
  stringArg,
} from "packages/graphql/deps.ts";
import { BfNodeGraphQLType } from "packages/graphql/types/BfGraphQLNode.ts";
import { BfMediaTranscript } from "packages/bfDb/models/BfMediaTranscript.ts";
import { getLogger } from "deps.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";

const logger = getLogger(import.meta);

export const BfGraphQLMediaTranscriptType = objectType({
  name: "BfMediaTranscript",
  description: "A transcript of a clip.",
  definition: (t) => {
    t.implements(BfNodeGraphQLType);
    t.string("words");
    t.string("filename");
  },
});

export const BfGraphQLMediaTranscriptsQuery = extendType({
  type: "BfMedia",
  definition(t) {
    t.connectionField("transcripts", {
      type: "BfMediaTranscript",
      resolve: (parent, args, { bfCurrentViewer }) => {
        logger.debug("Fetching all transcripts");
        const transcripts = BfEdge.queryTargetsConnectionForGraphQL(
          bfCurrentViewer,
          BfMediaTranscript,
          parent.id,
          {},
          args,
        );
        logger.debug("Fetched all transcripts successfully");
        return transcripts;
      },
    });
  },
});

export const BfGraphQLMediaTranscriptCreateMutation = mutationField(
  "createTranscript",
  {
    type: BfGraphQLMediaTranscriptType,
    args: {
      words: nonNull(stringArg()),
      filename: nonNull(stringArg()),
    },
    resolve: async (_, { words, filename }, { bfCurrentViewer }) => {
      logger.debug("createTranscript");
      const newTranscript = await BfMediaTranscript.create(bfCurrentViewer, {
        words,
        filename,
      });
      logger.debug("Created new transcript successfully");
      return newTranscript.toGraphql();
    },
  },
);

export const BfGraphQLMediaTranscriptUpdateMutation = mutationField(
  "updateTranscript",
  {
    type: BfGraphQLMediaTranscriptType,
    args: {
      id: nonNull(stringArg()),
      words: stringArg(),
      filename: stringArg(),
    },
    resolve: async (_, args, { bfCurrentViewer }) => {
      logger.debug("updateTranscript", args);
      const transcriptToUpdate = await BfMediaTranscript.find(
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

export const BfGraphQLMediaTranscriptDeleteMutation = mutationField(
  "deleteTranscript",
  {
    type: BfGraphQLMediaTranscriptType,
    args: {
      id: nonNull(stringArg()),
    },
    resolve: async (_, { id }, { bfCurrentViewer }) => {
      const transcript = await BfMediaTranscript.find(bfCurrentViewer, id);
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
