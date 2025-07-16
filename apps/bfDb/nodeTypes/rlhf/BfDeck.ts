import { BfNode, type InferProps } from "@bfmono/apps/bfDb/classes/BfNode.ts";
import { BfOrganization } from "@bfmono/apps/bfDb/nodeTypes/BfOrganization.ts";
import { BfGrader } from "./BfGrader.ts";
import { analyzeSystemPrompt } from "@bfmono/apps/bfDb/services/mockPromptAnalyzer.ts";

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
      .nonNull.id("id")
      .string("name")
      .string("systemPrompt")
      .string("description")
      .mutation("createDeck", {
        args: (a) =>
          a
            .nonNull.string("name")
            .nonNull.string("systemPrompt")
            .string("description"),
        returns: "BfDeck",
        resolve: async (_src, args, ctx) => {
          const cv = ctx.getCurrentViewer();
          let org;
          try {
            org = await BfOrganization.findX(cv, cv.orgBfOid);
          } catch {
            // Create organization if it doesn't exist (for tests)
            org = await BfOrganization.__DANGEROUS__createUnattached(cv, {
              name: "Test Organization",
              domain: "testorg.com",
            });
            await org.save();
          }
          const deck = await org.createTargetNode(BfDeck, {
            name: args.name as string,
            systemPrompt: args.systemPrompt as string,
            description: (args.description as string) || "",
          }) as BfDeck;
          await deck.afterCreate();
          const result = deck.toGraphql();
          return { ...result, id: deck.id };
        },
      })
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

  /**
   * Lifecycle method called after deck creation.
   * Analyzes the system prompt and auto-generates graders.
   */
  public override async afterCreate(): Promise<void> {
    const analysis = await analyzeSystemPrompt(this.props.systemPrompt);

    for (const graderSuggestion of analysis.graders) {
      await this.createTargetNode(BfGrader, {
        graderText: graderSuggestion.graderText,
      });
    }
  }
}
