import { BfNode, type InferProps } from "@bfmono/apps/bfDb/classes/BfNode.ts";

/**
 * BfGrader - Individual evaluation criteria within decks
 *
 * BfGrader represents a single grading criterion that can be used to evaluate
 * AI responses. Simplified to just contain the grader text/prompt.
 */
export class BfGrader extends BfNode<InferProps<typeof BfGrader>> {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .string("graderText")
  );

  static override bfNodeSpec = this.defineBfNode((node) =>
    node
      .string("graderText")
  );
}
