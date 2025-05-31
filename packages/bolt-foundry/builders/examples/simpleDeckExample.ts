import { createAssistantDeck } from "../deckBuilder.ts";
import { getLogger } from "@bolt-foundry/logger";

const logger = getLogger(import.meta);

// Simple deck creation API - only cards and specs, no metadata:
const deck = createAssistantDeck(
  "water-needs",
  (b) =>
    b.card("persona", (c) =>
      c.card("needs", (n) =>
        n.spec("water", {
          samples: (s) =>
            s.sample("Clean, fresh drinking water", 3)
              .sample("Contaminated or polluted water", -3),
        }))),
);

logger.info("Water needs deck:", JSON.stringify(deck, null, 2));

// Another example with code review samples:
const codeReviewDeck = createAssistantDeck(
  "code-reviewer",
  (b) =>
    b.card("capabilities", (c) =>
      c.spec("code review", {
        samples: (s) =>
          s.sample("Uses descriptive variable names like 'userAuthToken'", 3)
            .sample(
              "Uses single letter variables like 'x' for important data",
              -2,
            )
            .sample("Hardcodes magic numbers without explanation", -3)
            .sample(
              "Extracts constants with clear names like 'MAX_RETRY_ATTEMPTS'",
              2,
            ),
      }))
      .card("focus-areas", (f) =>
        f.spec("readability")
          .spec("maintainability")
          .spec("performance")),
);

logger.info("Code review deck:", JSON.stringify(codeReviewDeck, null, 2));
