import { BfNode, type InferProps } from "@bfmono/apps/bfDb/classes/BfNode.ts";
import { BfOrganization } from "@bfmono/apps/bfDb/nodeTypes/BfOrganization.ts";
import { readLocalDeck } from "@bolt-foundry/bolt-foundry";
import { BfSample } from "./BfSample.ts";
import type * as path from "@std/path";

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
export class BfDeck extends BfNode<InferProps<typeof BfDeck>> {
  static override gqlSpec = this.defineGqlNode((gql) =>
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
          const deck = await org.createTargetNode(BfDeck, {
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
  );

  /**
   * Read deck properties from a filesystem .deck.md file
   */
  static async readPropsFromFile(deckPath: string) {
    const deck = await readLocalDeck(deckPath);

    // Extract content from the rendered deck (system message content)
    const rendered = deck.render({});
    const content = rendered.messages[0]?.content || "";

    return {
      name: "Customer Support Response Evaluator",
      content,
      description: "Demo deck for evaluating customer service interactions",
      slug: "demo-customer-support",
    };
  }

  /**
   * Lifecycle hook: Create demo samples after deck creation
   */
  protected override async afterCreate(): Promise<void> {
    try {
      // Use import.meta.resolve to get the demo deck path for embedded resources
      const deckUrl = import.meta.resolve(
        "./demo-decks/customer-support-demo.deck.md",
      );
      const deckPath = new URL(deckUrl).pathname;

      // Read the demo deck and extract samples
      const deck = await readLocalDeck(deckPath);
      const samples = deck.samples;

      // Create BfSample nodes for each sample (unscored, for evaluation)
      for (const [sampleKey, sampleData] of Object.entries(samples)) {
        // Convert conversation messages to completionData format
        const completionData = {
          id: `imported-${sampleKey}`,
          object: "chat.completion",
          created: Math.floor(Date.now() / 1000),
          model: "imported",
          choices: [{
            index: 0,
            message: sampleData.messages[sampleData.messages.length - 1], // Last message (assistant response)
            finish_reason: "stop",
          }],
          messages: sampleData.messages, // Original conversation
        };

        await this.createTargetNode(BfSample, {
          name: sampleKey,
          completionData,
          collectionMethod: "import",
        });
      }

      console.log(
        `Created ${
          Object.keys(samples).length
        } demo samples for deck ${this.props.slug}`,
      );
    } catch (error) {
      console.warn(
        "Failed to create demo samples:",
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
