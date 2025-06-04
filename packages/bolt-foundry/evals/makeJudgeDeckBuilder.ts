import {
  type Card,
  type CardBuilder,
  type ContextBuilder,
  type DeckBuilder,
  makeCardBuilder,
  makeDeckBuilder,
  type RenderOptions,
  type SpecOptions,
} from "../builders/builders.ts";

/**
 * Creates a judge deck builder that appends evaluation context after user content.
 *
 * This ensures that judge-specific cards and context are added at the END
 * of the user's deck content, maintaining proper ordering for prompt construction.
 *
 * @param name - The name of the judge deck
 * @returns A DeckBuilder that appends judge content on render
 */
export function makeJudgeDeckBuilder(name: string): DeckBuilder {
  // Start with an empty deck to accumulate user content
  let userDeck = makeDeckBuilder(name);

  // Create judge-specific cards that will be appended
  const judgeCards = (c: CardBuilder) =>
    c
      .card("evaluation task", (c) =>
        c.spec(
          "Evaluate the following AI assistant response based on the provided criteria",
        ))
      .card("output format", (c) =>
        c.spec(
          "Return your evaluation as a JSON object with the following structure:",
        )
          .spec("- score: number between -3 and 3")
          .spec("- notes: string explaining the evaluation")
          .spec("Return ONLY the JSON object, no other text"));

  // Create judge-specific context that will be appended
  const judgeContext = (c: ContextBuilder) =>
    c
      .string("userMessage", "What was the user's original message?")
      .string("assistantResponse", "What was the assistant's response?")
      .string("expected", "What was the expected response? (optional)");

  // Return a deck builder that intercepts methods
  return {
    name,

    spec(value: string, options?: SpecOptions) {
      userDeck = options ? userDeck.spec(value, options) : userDeck.spec(value);
      return this;
    },

    card(cardName: string, builder: (c: CardBuilder) => CardBuilder) {
      userDeck = userDeck.card(cardName, builder);
      return this;
    },

    context(builder: (c: ContextBuilder) => ContextBuilder) {
      userDeck = userDeck.context(builder);
      return this;
    },

    getCards() {
      // Combine user cards and judge cards
      const userCards = userDeck.getCards();
      const judgeBuilder = judgeCards(makeCardBuilder());
      const judgeCardsList = judgeBuilder.getCards();
      return [...userCards, ...judgeCardsList];
    },

    getContext() {
      // Combine user context and judge context
      const userContext = userDeck.getContext();
      const judgeBuilder = makeDeckBuilder("temp").context(judgeContext);
      const judgeContextVars = judgeBuilder.getContext();
      return [...userContext, ...judgeContextVars];
    },

    render(options: RenderOptions = {}) {
      // Build a new deck by combining user content and judge content
      // Since DeckBuilder is immutable, we need to rebuild it

      let finalDeck = makeDeckBuilder(name);

      // Add all user specs/cards first
      const userCards = userDeck.getCards();
      for (const card of userCards) {
        if (typeof card.value === "string") {
          finalDeck = finalDeck.spec(card.value);
        } else if (Array.isArray(card.value) && card.name) {
          // Recreate nested cards
          finalDeck = finalDeck.card(card.name, (c) => {
            let builder = c;
            const nestedCards = card.value as Card[];
            for (const subCard of nestedCards) {
              if (typeof subCard.value === "string") {
                builder = builder.spec(subCard.value);
              }
            }
            return builder;
          });
        }
      }

      // Add judge-specific cards
      finalDeck = finalDeck.card("judge evaluation", judgeCards);

      // Add judge context
      finalDeck = finalDeck.context(judgeContext);

      // Render the combined deck
      return finalDeck.render(options);
    },
  };
}
