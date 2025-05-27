import { createCard } from "../cardBuilder.ts";
import { getLogger } from "@bolt-foundry/logger";

const logger = getLogger(import.meta);

// Example matching the requested API:
// Original spec API: specs("persona", (p) => p.specs("needs", (n) => n.spec("water", {samples: (s) => s.sample("positive", 3).sample("negative", -3)})))

// With the card API:
const personaCard = createCard("persona", (card) =>
  card.specs("persona", (p) =>
    p.specs("needs", (n) =>
      n.spec("water", {
        samples: (s) => s.sample("positive", 3).sample("negative", -3),
      })))
);

// The card wraps the specs with metadata and provides a structured way to:
// 1. Define the card type (persona, behavior, tool)
// 2. Add versioning and compatibility info
// 3. Tag and categorize cards
// 4. Group related specs together

logger.info(JSON.stringify(personaCard, null, 2));
