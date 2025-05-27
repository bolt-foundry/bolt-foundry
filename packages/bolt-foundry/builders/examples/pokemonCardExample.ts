import { createCard } from "../cardBuilder.ts";
import { getLogger } from "@bolt-foundry/logger";

const logger = getLogger(import.meta);

// Pokemon Trainer card example
const ashKetchum = createCard(
  "ash-ketchum",
  (b) =>
    b.specs("trainer-traits", (t) =>
      t.spec("determination", {
        samples: (s) =>
          s.sample("Never gives up even when facing legendary Pokemon", 3)
            .sample("Keeps trying after losing multiple gym battles", 2)
            .sample(
              "Gets discouraged and considers quitting after one loss",
              -3,
            )
            .sample("Gives up on catching a Pokemon after first attempt", -2),
      })
        .spec("bond-with-pokemon", {
          samples: (s) =>
            s.sample("Jumps off a cliff to save Pikachu", 3)
              .sample("Shares his food with wild Pokemon", 2)
              .sample("Releases Pokemon to ensure their happiness", 3)
              .sample("Forces Pokemon to battle when they're exhausted", -3)
              .sample("Abandons Pokemon at Pokemon Center", -3)
              .sample("Trades Pokemon without considering their feelings", -2),
        }))
      .specs("battle-strategy", (b) =>
        b.spec("adaptability", {
          samples: (s) =>
            s.sample("Uses environment creatively like sprinklers vs Onix", 3)
              .sample("Combines moves in unexpected ways", 2)
              .sample("Relies only on type advantages", -1)
              .sample("Uses same move repeatedly despite it not working", -3),
        })
          .spec("team-building", {
            samples: (s) =>
              s.sample("Befriends and catches diverse Pokemon types", 2)
                .sample("Trains Pokemon to evolve through friendship", 3)
                .sample("Only catches Pokemon that look strong", -2)
                .sample("Ignores Pokemon that seem weak", -3),
          })),
);

logger.info("Ash Ketchum Trainer Card:", JSON.stringify(ashKetchum, null, 2));

// Another trainer with different philosophy
const garyOak = createCard(
  "gary-oak",
  (b) =>
    b.specs("trainer-traits", (t) =>
      t.spec("competitiveness", {
        samples: (s) =>
          s.sample("Studies type matchups and stats meticulously", 3)
            .sample("Maintains detailed records of battle performance", 2)
            .sample("Dismisses opponents without analyzing their strengths", -2)
            .sample("Underestimates 'weaker' trainers", -3),
      })
        .spec("training-methods", {
          samples: (s) =>
            s.sample(
              "Uses scientific approach to maximize Pokemon potential",
              3,
            )
              .sample("Provides specialized training equipment", 2)
              .sample("Focuses only on winning, ignoring Pokemon wellbeing", -3)
              .sample("Overtains Pokemon to exhaustion", -3),
        }))
      .specs("research-focus", (r) =>
        r.spec("pokemon-ecology", {
          samples: (s) =>
            s.sample("Documents Pokemon behavior in natural habitats", 3)
              .sample("Studies breeding patterns and evolution triggers", 3)
              .sample("Disrupts Pokemon habitats for research", -3)
              .sample(
                "Captures Pokemon without studying impact on ecosystem",
                -2,
              ),
        })),
);

logger.info("Gary Oak Trainer Card:", JSON.stringify(garyOak, null, 2));

// Team Rocket member showing negative examples
const jessie = createCard(
  "jessie-team-rocket",
  (b) =>
    b.specs("capture-methods", (c) =>
      c.spec("pokemon-theft", {
        samples: (s) =>
          s.sample("Uses elaborate disguises and clever schemes", 1) // Slightly positive for creativity
            .sample("Builds mechanical contraptions to catch Pokemon", 1)
            .sample("Steals Pokemon from their trainers", -3)
            .sample("Uses nets and cages on wild Pokemon", -3)
            .sample("Separates baby Pokemon from parents", -3),
      }))
      .specs("motivations", (m) =>
        m.spec("glory-seeking", {
          samples: (s) =>
            s.sample("Wants to impress Giovanni with rare Pokemon", -1)
              .sample("Dreams of promotion within Team Rocket", -1)
              .sample("Values Pokemon only for their monetary worth", -3)
              .sample("Sees Pokemon as tools for personal gain", -3),
        })),
);

logger.info(
  "Jessie (Team Rocket) Trainer Card:",
  JSON.stringify(jessie, null, 2),
);
