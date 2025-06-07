import type { Card, CardBuilder } from "./builders.ts";
import { card } from "./builders.ts";

/**
 * A deck is a named collection of cards
 */
export type Deck = {
  name: string;
  cards: Array<Card>;
};

/**
 * Builder for creating decks with fluent API
 */
export type DeckBuilderLegacy = {
  /** The name of this deck */
  readonly name: string;

  /** Add cards using the card builder */
  card(
    name: string,
    builder: (c: CardBuilder) => CardBuilder,
  ): DeckBuilderLegacy;

  /** Build the final deck */
  build(): Deck;
};

/**
 * Factory function to create a DeckBuilder
 */
export function makeDeckBuilderLegacy(
  name: string,
  deckCards: Array<Card> = [],
): DeckBuilderLegacy {
  return {
    name,

    card(cardName: string, builder: (c: CardBuilder) => CardBuilder) {
      const newCard = card(cardName, builder);
      return makeDeckBuilderLegacy(name, [...deckCards, newCard]);
    },

    build() {
      return {
        name,
        cards: deckCards,
      };
    },
  };
}

/**
 * Function to create a deck
 */
export function createDeck(
  name: string,
  builder: (b: DeckBuilderLegacy) => DeckBuilderLegacy,
): Deck {
  return builder(makeDeckBuilderLegacy(name)).build();
}

/**
 * Function to create an assistant deck
 */
export function createAssistantDeck(
  name: string,
  builder: (b: DeckBuilderLegacy) => DeckBuilderLegacy,
): Deck {
  return createDeck(name, builder);
}
