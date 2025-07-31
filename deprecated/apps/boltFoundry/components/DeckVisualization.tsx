import { useEffect, useState } from "react";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import type {
  Card,
  DeckData,
  Sample,
  Spec,
} from "@bfmono/apps/boltFoundry/lib/deckTypes.ts";

const logger = getLogger(import.meta);

// Helper function to parse specs with samples from content
function parseSpecsWithSamples(content: string): Array<Spec> {
  const specs: Array<Spec> = [];

  // First, find all sample arrays in the content
  const allSamplesMatches = content.matchAll(/samples:\s*(\[[\s\S]*?\])/g);
  const foundSamples = new Map<number, Array<Sample>>();

  for (const match of allSamplesMatches) {
    try {
      // Clean up the JSON string to handle trailing commas
      const cleanedJson = match[1]
        .replace(/,\s*}/g, "}") // Remove trailing commas before }
        .replace(/,\s*]/g, "]"); // Remove trailing commas before ]

      const parsedSamples = JSON.parse(cleanedJson);

      const validSamples = parsedSamples.filter((sample: Sample) =>
        sample && typeof sample === "object" &&
        sample.id && sample.userMessage && sample.assistantResponse &&
        typeof sample.score === "number" && sample.description
      );

      if (validSamples.length > 0 && match.index !== undefined) {
        foundSamples.set(match.index, validSamples);
      }
    } catch (error) {
      logger.debug("Error parsing samples array:", error);
    }
  }

  // Find all specs and associate them with samples
  const allSpecMatches = Array.from(content.matchAll(/\.spec\(\s*"([^"]+)"/g));

  for (const specMatch of allSpecMatches) {
    const specText = specMatch[1];
    const specIndex = specMatch.index || 0;

    // Find the closest samples array that comes after this spec
    let closestSamples: Array<Sample> = [];
    let minDistance = Infinity;

    for (const [samplesIndex, samples] of foundSamples) {
      if (samplesIndex > specIndex) {
        const distance = samplesIndex - specIndex;
        if (distance < minDistance) {
          minDistance = distance;
          closestSamples = samples;
        }
      }
    }

    specs.push({
      text: specText,
      samples: closestSamples.length > 0 ? closestSamples : undefined,
    });
  }

  return specs;
}

// Helper to find matching parenthesis
function findMatchingParen(content: string, startIndex: number): number {
  let depth = 1;
  let inString = false;
  let escaped = false;

  for (let i = startIndex + 1; i < content.length; i++) {
    const char = content[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === '"' && !escaped) {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === "(") {
        depth++;
      } else if (char === ")") {
        depth--;
        if (depth === 0) {
          return i;
        }
      }
    }
  }

  return content.length - 1;
}

function parseCards(content: string, depth: number = 0): Array<Card> {
  const cards: Array<Card> = [];

  if (depth > 5) {
    logger.debug("Maximum nesting depth reached");
    return cards;
  }

  let currentIndex = 0;

  while (currentIndex < content.length) {
    // Find next .card( declaration
    const cardMatch = content.slice(currentIndex).match(/\.card\(\s*"([^"]+)"/);
    if (!cardMatch || cardMatch.index === undefined) {
      break;
    }

    const cardName = cardMatch[1];
    const cardStartIndex = currentIndex + cardMatch.index;

    // Find the complete card structure by finding the matching closing parenthesis
    // Start from the opening parenthesis of .card(
    const cardOpenParen = cardStartIndex + cardMatch[0].indexOf("(");
    const cardCloseParen = findMatchingParen(content, cardOpenParen);

    // Extract the full card text
    const fullCardText = content.slice(cardStartIndex, cardCloseParen + 1);

    // Find the arrow function and extract content after it
    const arrowMatch = fullCardText.match(
      /\.card\(\s*"[^"]+"\s*,\s*\([^)]*\)\s*=>\s*/,
    );
    if (!arrowMatch) {
      currentIndex = cardStartIndex + 1;
      continue;
    }

    const contentStart = arrowMatch[0].length;
    const cardContent = fullCardText.slice(contentStart, -1); // Remove the last closing paren

    // Split content into specs and nested cards
    const nestedCardIndex = cardContent.search(/\.card\(/);
    let specsContent = cardContent;
    let nestedCardsContent = "";

    if (nestedCardIndex !== -1) {
      specsContent = cardContent.slice(0, nestedCardIndex);
      nestedCardsContent = cardContent.slice(nestedCardIndex);
    }

    // Extract specs - updated to handle array format
    const specs = parseSpecsWithSamples(specsContent);

    // Parse nested cards
    let nestedCards: Array<Card> = [];
    if (nestedCardsContent) {
      nestedCards = parseCards(nestedCardsContent, depth + 1);
    }

    cards.push({
      name: cardName,
      specs,
      cards: nestedCards.length > 0 ? nestedCards : undefined,
    });

    currentIndex = cardCloseParen + 1;
  }

  return cards;
}

// Parser function to extract deck data from the string
function parseDeckString(deckString: string): DeckData | null {
  try {
    // Extract deck name - generic pattern to match any function call with a string parameter
    let deckName = "Untitled Deck";

    // Match any function name followed by opening parenthesis and quoted string
    const genericDeckMatch = deckString.match(/\w+\(\s*"([^"]+)"/);

    if (genericDeckMatch) {
      deckName = genericDeckMatch[1];
    } else {
      logger.debug("No deck name found, using default");
    }

    // Extract deck-level specs (specs that appear before any .card() calls)
    const firstCardIndex = deckString.search(/\.card\s*\(/);

    const deckLevelContent = firstCardIndex !== -1
      ? deckString.slice(0, firstCardIndex)
      : deckString;

    const deckSpecs = parseSpecsWithSamples(deckLevelContent);

    // Extract cards using parser
    const cardsContent = firstCardIndex !== -1
      ? deckString.slice(firstCardIndex)
      : "";

    const cards = parseCards(cardsContent, 0);

    const result = { name: deckName, specs: deckSpecs, cards };
    return result;
  } catch (error) {
    logger.error("Error parsing deck string:", error);
    return null;
  }
}

// Recursive component to render cards and nested cards
function CardRenderer({ card, depth = 0 }: { card: Card; depth?: number }) {
  const indentClass = depth > 0 ? `nested-card depth-${depth}` : "";

  return (
    <div className={`card ${indentClass}`}>
      <h2 className="card-title">
        {card.name} <span className="card-subtitle">CARD</span>
      </h2>

      <div className="card-content">
        {card.specs.map((spec, specIndex) => {
          return (
            <div key={specIndex} className="spec-item">
              <div className="spec-label">SPEC</div>
              <div>"{spec.text}"</div>
              {spec.samples && (
                <div className="samples">
                  <div className="samples-label">SAMPLES</div>
                  {spec.samples.map((sample, sampleIndex) => {
                    return (
                      <div
                        key={sampleIndex}
                        className={`sample-item ${
                          sample.score > 0 ? "positive" : "negative"
                        }`}
                      >
                        <div className="sample-header">
                          <span className="sample-label">SAMPLE</span>
                          <span className="sample-score">{sample.score}</span>
                        </div>
                        <div className="sample-content">
                          <div className="sample-description">
                            "{sample.description}"
                          </div>
                          <div className="sample-exchange">
                            <div className="user-message">
                              <strong>User:</strong> {sample.userMessage}
                            </div>
                            <div className="assistant-response">
                              <strong>Assistant:</strong>{" "}
                              {sample.assistantResponse}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Render nested cards */}
        {card.cards && (
          <div className="nested-cards-container">
            {card.cards.map((nestedCard, cardIndex) => (
              <CardRenderer
                key={cardIndex}
                card={nestedCard}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface DeckVisualizationProps {
  deckString: string;
}

export function DeckVisualization({ deckString }: DeckVisualizationProps) {
  const [deckData, setDeckData] = useState<DeckData | null>(null);

  useEffect(() => {
    const parsedDeck = parseDeckString(deckString);
    setDeckData(parsedDeck);
  }, [deckString]);

  if (!deckData) {
    logger.debug("No deck data, showing invalid format message");
    return <div>Invalid deck format</div>;
  }

  return (
    <div className="deck-container">
      <h1 className="deck-title">
        {deckData.name} <span className="deck-subtitle">DECK</span>
      </h1>

      {/* Deck-level specs */}
      {deckData.specs.length > 0 && (
        <div className="deck-specs">
          {deckData.specs.map((spec, specIndex) => (
            <div key={specIndex} className="spec-item">
              <div className="spec-label">SPEC</div>
              <div>"{spec.text}"</div>
              {spec.samples && (
                <div className="samples">
                  <div className="samples-label">SAMPLES</div>
                  {spec.samples.map((sample, sampleIndex) => (
                    <div
                      key={sampleIndex}
                      className={`sample-item ${
                        sample.score > 0 ? "positive" : "negative"
                      }`}
                    >
                      <div className="sample-header">
                        <span className="sample-label">SAMPLE</span>
                        <span className="sample-score">{sample.score}</span>
                      </div>
                      <div className="sample-content">
                        <div className="sample-description">
                          "{sample.description}"
                        </div>
                        <div className="sample-exchange">
                          <div className="user-message">
                            <strong>User:</strong> {sample.userMessage}
                          </div>
                          <div className="assistant-response">
                            <strong>Assistant:</strong>{" "}
                            {sample.assistantResponse}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="cards-container">
        {deckData.cards.map((card, cardIndex) => (
          <CardRenderer key={cardIndex} card={card} />
        ))}
      </div>
    </div>
  );
}
