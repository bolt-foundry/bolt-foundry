import { BfNode, type InferProps } from "@bfmono/apps/bfDb/classes/BfNode.ts";
import { BfDeck } from "./BfDeck.ts";
import type { BfGid } from "@bfmono/lib/types.ts";

/**
 * Collection method for BfSample - how the sample was collected
 */
export type BfSampleCollectionMethod = "manual" | "telemetry";

/**
 * Completion data in telemetry format - captures full request/response details
 * This interface is designed to be JSON-serializable for database storage
 */
export interface BfSampleCompletionData {
  // Timing and metadata
  timestamp?: string;
  duration?: number;
  provider: string;
  providerApiVersion?: string;
  sessionId?: string;
  userId?: string;
  
  // Full request details
  request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: any; // Provider-specific request format (OpenAI, Anthropic, etc.)
  };
  
  // Full response details
  response: {
    status: number;
    headers: Record<string, string>;
    body: any; // Provider-specific response format
  };
  
  // Additional context from deck rendering
  contextVariables?: Record<string, unknown>;
  
  // Optional deck metadata
  bfMetadata?: {
    deckName: string;
    deckContent: string;
    contextVariables: Record<string, unknown>;
  };
}

/**
 * BfSample represents a collected RLHF (Reinforcement Learning from Human Feedback) sample.
 *
 * This node type stores completion data and associated metadata for training and
 * evaluation purposes. Samples can be collected manually by users or automatically
 * via telemetry systems.
 */
export class BfSample extends BfNode<InferProps<typeof BfSample>> {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .json("completionData")
      .string("collectionMethod")
      .string("name")
      .typedMutation("submitSample", {
        args: (a) =>
          a
            .nonNull.string("deckId")
            .nonNull.string("completionData")
            .string("collectionMethod")
            .string("name"),
        returns: "BfSample",
        resolve: async (_src, args, ctx) => {
          const cv = ctx.getCurrentViewer();
          const deck = await BfDeck.findX(cv, args.deckId as BfGid);
          const sample = await deck.createTargetNode(BfSample, {
            completionData: JSON.parse(args.completionData),
            collectionMethod: (args.collectionMethod ||
              "manual") as BfSampleCollectionMethod,
            name: args.name || "",
          });

          return sample.toGraphql();
        },
      })
  );

  /**
   * Database field specification for BfSample.
   * Defines the fields that are stored in the database.
   */
  static override bfNodeSpec = this.defineBfNode((node) =>
    node
      .json("completionData") // Native JSON storage
      .string("collectionMethod") // "manual" | "telemetry"
      .string("name") // Optional human-readable name for the sample
  );
}
