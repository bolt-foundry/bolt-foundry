import { useEffect, useState } from "react";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

// Types
interface Sample {
  text: string;
  score: number;
}

interface Spec {
  text: string;
  samples?: Sample[];
}

interface Card {
  name: string;
  specs: Spec[];
  cards?: Card[];
}

interface DeckData {
  name: string;
  specs: Spec[];
  cards: Card[];
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

function parseCards(content: string, depth: number = 0): Card[] {
  const cards: Card[] = [];

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

    // Extract specs
    const specMatches = specsContent.matchAll(
      /\.spec\(\s*"([^"]+)"(?:\s*,\s*\{([^}]*)\})?/g,
    );
    const specs: Spec[] = [];

    for (const specMatch of specMatches) {
      const specText = specMatch[1];
      const samplesContent = specMatch[2];

      let samples: Sample[] = [];
      if (samplesContent) {
        const sampleMatches = samplesContent.matchAll(
          /\.sample\(\s*"([^"]+)"\s*,\s*(-?\d+)\)/g,
        );
        samples = Array.from(sampleMatches).map((match) => ({
          text: match[1],
          score: parseInt(match[2]),
        }));
      }

      specs.push({
        text: specText,
        samples: samples.length > 0 ? samples : undefined,
      });
    }

    // Parse nested cards
    let nestedCards: Card[] = [];
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
    }

    // Extract deck-level specs (specs that appear before any .card() calls)
    const firstCardIndex = deckString.search(/\.card\s*\(/);
    const deckLevelContent = firstCardIndex !== -1
      ? deckString.slice(0, firstCardIndex)
      : deckString;

    const deckSpecs: Spec[] = [];
    const deckSpecMatches = deckLevelContent.matchAll(
      /\.spec\(\s*"([^"]+)"(?:\s*,\s*\{([^}]*)\})?/g,
    );

    for (const specMatch of deckSpecMatches) {
      const specText = specMatch[1];
      const samplesContent = specMatch[2];

      let samples: Sample[] = [];
      if (samplesContent) {
        const sampleMatches = samplesContent.matchAll(
          /\.sample\(\s*"([^"]+)"\s*,\s*(-?\d+)\)/g,
        );
        samples = Array.from(sampleMatches).map((match) => ({
          text: match[1],
          score: parseInt(match[2]),
        }));
      }

      deckSpecs.push({
        text: specText,
        samples: samples.length > 0 ? samples : undefined,
      });
    }

    // Extract cards using parser
    const cardsContent = firstCardIndex !== -1
      ? deckString.slice(firstCardIndex)
      : "";
    const cards = parseCards(cardsContent, 0);

    return { name: deckName, specs: deckSpecs, cards };
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
        {card.specs.map((spec, specIndex) => (
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
                    <div>"{sample.text}"</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

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
                      <div>"{sample.text}"</div>
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
