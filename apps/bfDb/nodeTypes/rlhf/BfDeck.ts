import {
  BfNode,
  type InferProps as _InferProps,
} from "@bfmono/apps/bfDb/classes/BfNode.ts";
import { BfOrganization } from "@bfmono/apps/bfDb/nodeTypes/BfOrganization.ts";
import { readLocalDeck } from "@bolt-foundry/bolt-foundry";

/**
 * BfDeck represents a deck of cards/prompts used for RLHF evaluation.
 *
 * A deck contains:
 * - name: Human-readable name for the deck
 * - content: The deck content (markdown format with evaluation criteria and instructions)
 * - description: Detailed description of what this deck is used for
 *
 * Decks are scoped to organizations and can be associated with:
 * - BfGrader: The evaluators that use this deck
 * - BfSample: The samples/examples that are evaluated using this deck
 */
export class BfDeck extends BfNode<_InferProps<typeof BfDeck>> {
  static override gqlSpec = this.defineGqlNodeWithRelations((gql) =>
    gql
      .string("name")
      .string("content")
      .string("description")
      .nonNull.string("slug")
      .typedMutation("createDeck", {
        args: (a) =>
          a
            .nonNull.string("name")
            .nonNull.string("content")
            .string("description")
            .nonNull.string("slug"),
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
          const deck = await (org as BfOrganization & {
            createDecks: (
              props: {
                name: string;
                content: string;
                description: string;
                slug: string;
              },
            ) => Promise<BfDeck>;
          }).createDecks({
            name: args.name,
            content: args.content,
            description: args.description || "",
            slug: args.slug,
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
      .string("content")
      .string("description")
      .string("slug")
      .many("samples", () => import("./BfSample.ts").then((m) => m.BfSample))
      .many("graders", () => import("./BfGrader.ts").then((m) => m.BfGrader))
  );

  /**
   * Read deck properties from a filesystem .deck.md file
   */
  static async readPropsFromFile(deckPath: string) {
    const deck = await readLocalDeck(deckPath);

    // Extract content from the rendered deck (system message content)
    const rendered = deck.render({});
    const rawContent = rendered.messages[0]?.content || "";
    const content = typeof rawContent === "string"
      ? rawContent
      : JSON.stringify(rawContent);

    return {
      name: "Customer Support Response Evaluator",
      content,
      description: "Demo deck for evaluating customer service interactions",
      slug: "demo-customer-support",
    };
  }
}
