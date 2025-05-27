import type { Spec, SpecBuilder } from "./builders.ts";
import { specs } from "./builders.ts";

/**
 * A card is a named collection of specs
 */
export type Card = {
  name: string;
  specs: Spec[];
};

/**
 * Builder for creating cards with fluent API
 */
export type CardBuilder = {
  /** The name of this card */
  readonly name: string;

  /** Add specs using the specs builder */
  specs(name: string, builder: (s: SpecBuilder) => SpecBuilder): CardBuilder;

  /** Build the final card */
  build(): Card;
};

/**
 * Factory function to create a CardBuilder
 */
export function makeCardBuilder(
  name: string,
  cardSpecs: Spec[] = [],
): CardBuilder {
  return {
    name,

    specs(specName: string, builder: (s: SpecBuilder) => SpecBuilder) {
      const spec = specs(specName, builder);
      return makeCardBuilder(name, [...cardSpecs, spec]);
    },

    build() {
      return {
        name,
        specs: cardSpecs,
      };
    },
  };
}

/**
 * Function to create an assistant card (without builder)
 */
export function createAssistantCard(
  name: string,
  builder: (b: CardBuilder) => CardBuilder,
): Card {
  return builder(makeCardBuilder(name)).build();
}
