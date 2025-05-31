import { createAssistantDeck } from "../deckBuilder.ts";
import { getLogger } from "@bolt-foundry/logger";

const logger = getLogger(import.meta);

// Example matching the requested API:
// Original API: card("persona", (c) => c.card("needs", (n) => n.spec("water", {samples: (s) => s.sample("positive", 3).sample("negative", -3)})))

// With the deck API:
const personaDeck = createAssistantDeck(
  "persona",
  (deck) =>
    deck.card("persona", (c) =>
      c.card("needs", (n) =>
        n.spec("water", {
          samples: (s) => s.sample("positive", 3).sample("negative", -3),
        }))),
);

// The deck wraps the cards with metadata and provides a structured way to:
// 1. Define the deck type (persona, behavior, tool)
// 2. Add versioning and compatibility info
// 3. Tag and categorize decks
// 4. Group related cards together

logger.info(JSON.stringify(personaDeck, null, 2));
