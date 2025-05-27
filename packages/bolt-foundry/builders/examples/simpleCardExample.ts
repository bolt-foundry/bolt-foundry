import { createAssistantCard } from "../cardBuilder.ts";
import { getLogger } from "@bolt-foundry/logger";

const logger = getLogger(import.meta);

// Simple card creation API - only specs, no metadata:
const card = createAssistantCard(
  "water-needs",
  (b) =>
    b.specs("persona", (p) =>
      p.specs("needs", (n) =>
        n.spec("water", {
          samples: (s) =>
            s.sample("Clean, fresh drinking water", 3)
              .sample("Contaminated or polluted water", -3),
        }))),
);

logger.info("Water needs card:", JSON.stringify(card, null, 2));

// Another example with code review samples:
const codeReviewCard = createAssistantCard(
  "code-reviewer",
  (b) =>
    b.specs("capabilities", (c) =>
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
      .specs("focus-areas", (f) =>
        f.spec("readability")
          .spec("maintainability")
          .spec("performance")),
);

logger.info("Code review card:", JSON.stringify(codeReviewCard, null, 2));
