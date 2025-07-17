import { BfNode, type InferProps } from "@bfmono/apps/bfDb/classes/BfNode.ts";
import { BfDeck } from "./BfDeck.ts";
import type { BfGid } from "@bfmono/lib/types.ts";
import { BfErrorNotImplemented } from "@bfmono/lib/BfError.ts";

/**
 * Collection method for BfSample - how the sample was collected
 */
export type BfSampleCollectionMethod = "manual" | "telemetry";

/**
 * Completion data that combines the OpenAI ChatCompletion response with the original request parameters
 * This interface is designed to be JSON-serializable for database storage
 */
export interface BfSampleCompletionData {
  // OpenAI ChatCompletion fields
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };

  // Original request parameters
  messages: Array<{
    role: string;
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string | Array<string>;
  stream?: boolean;
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
      .typedMutation("submitSample", {
        args: (a) =>
          a
            .nonNull.string("deckId")
            .nonNull.string("completionData")
            .string("collectionMethod"),
        returns: "BfSample",
        resolve: async (_src, args, ctx) => {
          const cv = ctx.getCurrentViewer();
          const deck = await BfDeck.findX(cv, args.deckId as BfGid);
          const sample = await deck.createTargetNode(BfSample, {
            completionData: JSON.parse(args.completionData),
            collectionMethod: (args.collectionMethod ||
              "manual") as BfSampleCollectionMethod,
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
  );

  /**
   * Called after sample creation - triggers grading by parent deck
   */
  override async afterCreate(): Promise<void> {
    // Find parent deck and ask it to grade this sample
    const parentDeck = await this.getParentDeck();
    if (parentDeck) {
      await parentDeck.gradeSample(this);
    }
  }

  /**
   * Get the parent deck for this sample
   */
  private async getParentDeck(): Promise<BfDeck | null> {
    // For now, just return null - proper parent lookup not implemented
    return null;
  }

  /**
   * Automatically evaluate this sample against all graders in its deck
   * Creates BfGraderResult entries for each grader
   */
  async evaluateWithAI(): Promise<void> {
    throw new BfErrorNotImplemented("Auto-evaluation not implemented yet");
  }
}
