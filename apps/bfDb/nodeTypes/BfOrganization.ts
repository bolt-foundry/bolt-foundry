import { BfNode, type InferProps } from "@bfmono/apps/bfDb/classes/BfNode.ts";
import { BfDeck } from "@bfmono/apps/bfDb/nodeTypes/rlhf/BfDeck.ts";

export class BfOrganization extends BfNode<InferProps<typeof BfOrganization>> {
    node
      .string("name")
      .string("domain")
  );
  static override bfNodeSpec = this.defineBfNode((node) =>
    node
      .string("name")
      .string("domain")
  );

  /**
   * Lifecycle hook: Auto-create demo RLHF content for new organizations
   */
  protected override async afterCreate(): Promise<void> {
    await this.addDemoDeck();
  }

  /**
   * Create demo RLHF deck for this organization
   */
  async addDemoDeck(): Promise<void> {
    const deckPath = new URL(
      import.meta.resolve("./rlhf/demo-decks/customer-support-demo.deck.md"),
    ).pathname;
    const deckProps = await BfDeck.readPropsFromFile(deckPath);
  }
}
