import { BfNode, type InferProps } from "@bfmono/apps/bfDb/classes/BfNode.ts";

/**
 * BfDeck represents a deck of cards/prompts used for RLHF evaluation.
 *
 * A deck contains:
 * - name: Human-readable name for the deck
 * - systemPrompt: The evaluation criteria and instructions for graders (MVP: simple string, should be structured data matching aibff's deck system)
 * - description: Detailed description of what this deck is used for
 *
 * Decks are scoped to organizations and can be associated with:
 * - BfGrader: The evaluators that use this deck
 * - BfSample: The samples/examples that are evaluated using this deck
 */
export class BfDeck extends BfNode<InferProps<typeof BfDeck>> {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .string("name")
      .string("systemPrompt")
      .string("description")
  );

  /**
   * BfNode database specification for BfDeck.
   * Defines the fields stored in the database.
   */
  static override bfNodeSpec = this.defineBfNode((node) =>
    node
      .string("name")
      .string("systemPrompt")
      .string("description")
  );
}
