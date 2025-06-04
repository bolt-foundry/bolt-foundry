import { BfClient } from "../../BfClient.ts";
import { getLogger } from "@bolt-foundry/logger";

const logger = getLogger(import.meta);

// Example demonstrating the new array pattern for samples
// Both array and builder patterns work side-by-side

const client = BfClient.create();

// Array pattern example - cleaner and more direct
const helpfulAssistant = client.createDeck(
  "helpful-assistant",
  (b) =>
    b.spec("Be helpful and supportive", {
      // NEW: Array pattern with direct sample objects
      samples: [
        { text: "I'm here to help you succeed!", rating: 3 },
        { text: "Let me guide you through this step by step", rating: 2 },
        { text: "I can try to help with that", rating: 1 },
        { text: "You're on your own", rating: -3 },
        { text: "I don't care about your problem", rating: -2 },
      ],
    })
      .card("communication", (c) =>
        c
          .spec("Use clear language", {
            // Array pattern with descriptions
            samples: [
              {
                text: "Let me break this down into simple steps...",
                rating: 3,
                description: "Clear explanation with structure",
              },
              {
                text: "It's complicated, just google it",
                rating: -2,
                description: "Dismissive and unhelpful",
              },
            ],
          })
          .spec("Show empathy", {
            // Builder pattern still works for backward compatibility
            samples: (s) =>
              s
                .sample("I understand this can be frustrating", 3)
                .sample("That sounds challenging, let's work through it", 2)
                .sample("Whatever, deal with it", -3),
          })),
);

logger.info("Helpful assistant deck cards:", helpfulAssistant.getCards());

// Mixed pattern example showing flexibility
const codeAssistant = client.createDeck(
  "code-assistant",
  (b) =>
    b
      .spec("Write clean code", {
        // Array pattern is great for simple lists
        samples: [
          {
            text: "const userAuthToken = await authenticate(user);",
            rating: 3,
          },
          { text: "const x = auth(u);", rating: -2 },
        ],
      })
      .spec("Handle errors gracefully", {
        // Builder pattern when you prefer the fluent interface
        samples: (s) =>
          s
            .sample(
              "try { await saveData() } catch (error) { logger.error('Failed to save:', error); }",
              3,
            )
            .sample("saveData() // hope it works", -3),
      })
      .card("best-practices", (p) =>
        p.spec("Follow conventions", {
          // Empty array means no samples (same as omitting samples)
          samples: [],
        })),
);

logger.info("Code assistant deck cards:", codeAssistant.getCards());

// Example showing the benefits of array pattern:
// 1. More readable - samples are defined inline
// 2. Better IDE support - direct type checking on array elements
// 3. Easier to maintain - no builder state to track
const supportAgent = client.createDeck(
  "support-agent",
  (b) =>
    b.card("responses", (r) =>
      r
        .spec("Acknowledge the issue", {
          samples: [
            {
              text:
                "I see you're experiencing an issue with login. That must be frustrating.",
              rating: 3,
            },
            {
              text: "Yeah, login's broken.",
              rating: -2,
            },
          ],
        })
        .spec("Provide solutions", {
          samples: [
            {
              text: "Here are three things we can try to resolve this...",
              rating: 3,
              description: "Structured problem-solving approach",
            },
            {
              text: "Have you tried turning it off and on again?",
              rating: -1,
              description: "Generic unhelpful response",
            },
          ],
        })),
);

logger.info("Support agent deck cards:", supportAgent.getCards());

// Example rendering the deck to see how it works with OpenAI
const rendered = helpfulAssistant.render({
  model: "gpt-4",
  temperature: 0.7,
  messages: [{ role: "user", content: "I'm struggling with a math problem" }],
});

logger.info("Rendered deck for OpenAI:", JSON.stringify(rendered, null, 2));
