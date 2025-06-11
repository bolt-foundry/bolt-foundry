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
 * Creates a grader deck builder that appends evaluation context after user content.
 *
 * This ensures that grader-specific cards and context are added at the END
 * of the user's deck content, maintaining proper ordering for prompt construction.
 *
 * @param name - The name of the grader deck
 * @returns A DeckBuilder that appends grader content on render
 */
export function makeGraderDeckBuilder(name: string): DeckBuilder {
  // Start with an empty deck to accumulate user content
  let userDeck = makeDeckBuilder(name);

  // Create grader-specific cards that will be appended
  const graderCards = (c: CardBuilder) =>
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

  // Create grader-specific context that will be appended
  const graderContext = (c: ContextBuilder) =>
    c
      .string("userMessage", "What was the user's original message?")
      .string("assistantResponse", "What was the assistant's response?")
      .string("outputFormat", "What format would you like for the output?");

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
      // Combine user cards and grader cards
      const userCards = userDeck.getCards();
      const graderBuilder = graderCards(makeCardBuilder());
      const graderCardsList = graderBuilder.getCards();
      return [...userCards, ...graderCardsList];
    },

    getContext() {
      // Combine user context and grader context
      const userContext = userDeck.getContext();
      const graderBuilder = makeDeckBuilder("temp").context(graderContext);
      const graderContextVars = graderBuilder.getContext();
      return [...userContext, ...graderContextVars];
    },

    render(options: RenderOptions = {}) {
      // Build a new deck by combining user content and grader content
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
            const nestedCards = card.value as Array<Card>;
            for (const subCard of nestedCards) {
              if (typeof subCard.value === "string") {
                builder = builder.spec(subCard.value);
              }
            }
            return builder;
          });
        }
      }

      // Add grader-specific cards
      finalDeck = finalDeck.card("grader evaluation", graderCards);

      // Add grader context
      finalDeck = finalDeck.context(graderContext);

      // Render the combined deck
      return finalDeck.render(options);
    },
  };
}
