import { remark } from "remark";
import remarkParse from "remark-parse";
import type {
  Heading,
  Image,
  List,
  ListItem,
  Paragraph,
  Root,
  Text,
} from "mdast";
import type { Card, CardBuilder, DeckBuilder } from "../builders.ts";
import { makeCardBuilder, makeDeckBuilder } from "../builders.ts";
import { parse as parseToml } from "@std/toml";
import { dirname, resolve } from "@std/path";

export interface TomlContext {
  type: "string" | "number" | "boolean";
  question: string;
  description?: string;
  example?: unknown;
  default?: unknown;
}

export interface TomlSample {
  userMessage: string;
  assistantResponse: string;
  score?: number;
  description?: string;
  [key: string]: unknown;
}

interface TomlFile {
  contexts?: Record<string, TomlContext>;
  samples?: Record<string, TomlSample>;
}

export interface ParsedDeck {
  deck: DeckBuilder;
  samples: Record<string, TomlSample>;
}

/**
 * Parse a markdown string and convert it to a DeckBuilder
 *
 * Conversion rules:
 * - H1 header becomes the deck name
 * - H2 headers become parent cards
 * - H3+ headers become nested cards
 * - Bullet points become specs
 * - Image syntax ![description](file.toml) embeds TOML contexts/samples
 *
 * @param markdown - The markdown content to parse
 * @param basePath - The base path for resolving relative TOML references
 * @returns A ParsedDeck containing the DeckBuilder and any embedded samples
 */
export async function parseMarkdownToDeck(
  markdown: string,
  basePath?: string,
): Promise<ParsedDeck> {
  // Parse markdown to AST
  const processor = remark().use(remarkParse);
  const ast = processor.parse(markdown) as Root;

  // Extract deck name from H1 (if exists)
  let deckName = "deck"; // default name
  const h1Index = ast.children.findIndex(
    (node) => node.type === "heading" && node.depth === 1,
  );

  if (h1Index !== -1) {
    const h1 = ast.children[h1Index] as Heading;
    deckName = extractText(h1);
  }

  // Start building the deck
  let deck = makeDeckBuilder(deckName);

  // Collect all TOML contexts and markdown cards from image embeds
  const allContexts: Record<string, TomlContext> = {};
  const allSamples: Record<string, TomlSample> = {};
  const embeddedCards: Array<Card> = [];

  // First pass: collect all embeds (TOML and markdown)
  for (const node of ast.children) {
    if (node.type === "paragraph") {
      // Check for image nodes in paragraphs
      for (const child of (node as Paragraph).children) {
        if (child.type === "image") {
          // Try TOML embed first
          const tomlData = await processTomlEmbed(child as Image, basePath);
          if (tomlData) {
            if (tomlData.contexts) {
              Object.assign(allContexts, tomlData.contexts);
            }
            if (tomlData.samples) {
              Object.assign(allSamples, tomlData.samples);
            }
          } else {
            // Try markdown embed
            const mdCards = await processMarkdownEmbed(
              child as Image,
              basePath,
            );
            if (mdCards) {
              embeddedCards.push(...mdCards);
            }
          }
        }
      }
    }
  }

  // Add context variables to the deck
  if (Object.keys(allContexts).length > 0) {
    deck = deck.context((c) => {
      let builder = c;
      for (const [name, context] of Object.entries(allContexts)) {
        switch (context.type) {
          case "string":
            builder = builder.string(name, context.question);
            break;
          case "number":
            builder = builder.number(name, context.question);
            break;
          case "boolean":
            builder = builder.boolean(name, context.question);
            break;
          default:
            builder = builder.string(name, context.question); // default to string
        }
      }
      return builder;
    });
  }

  // Add embedded cards to the deck
  for (const embeddedCard of embeddedCards) {
    if (embeddedCard.name) {
      deck = deck.card(embeddedCard.name, (c) => {
        // Add the embedded card's content
        if (typeof embeddedCard.value === "string") {
          return c.spec(embeddedCard.value);
        } else if (Array.isArray(embeddedCard.value)) {
          return addCardsToBuilder(c, embeddedCard.value);
        }
        return c;
      });
    }
  }

  // Process H2 headers as parent cards
  let currentH2Index = -1;
  let currentH2Builder: CardBuilder | null = null;
  let currentH2Name = "";

  for (let i = 0; i < ast.children.length; i++) {
    const node = ast.children[i];

    // Skip H1 headers
    if (node.type === "heading" && node.depth === 1) {
      continue;
    }

    // Handle H2 headers - start a new parent card
    if (node.type === "heading" && node.depth === 2) {
      // Save previous H2 card if exists
      if (currentH2Builder && currentH2Name) {
        deck = deck.card(currentH2Name, () => currentH2Builder!);
      }

      // Start new H2 card
      currentH2Index = i;
      currentH2Name = extractText(node);
      currentH2Builder = makeCardBuilder();
      continue;
    }

    // Handle content under H2
    if (currentH2Builder && currentH2Index !== -1) {
      // Handle H3+ headers as nested cards
      if (node.type === "heading" && node.depth >= 3) {
        const nestedCardName = extractText(node);
        const nestedSpecs = collectSpecsUntilNextHeader(ast.children, i + 1);

        if (nestedSpecs.length > 0) {
          currentH2Builder = currentH2Builder.card(nestedCardName, (c) => {
            let builder = c;
            for (const spec of nestedSpecs) {
              builder = builder.spec(spec);
            }
            return builder;
          });
        } else {
          // Empty nested card
          currentH2Builder = currentH2Builder.card(nestedCardName, (c) => c);
        }

        // Skip the content we just processed
        while (
          i + 1 < ast.children.length &&
          !(ast.children[i + 1].type === "heading")
        ) {
          i++;
        }
        continue;
      }

      // Handle bullet lists as specs
      if (node.type === "list" && !node.ordered) {
        const specs = extractSpecsFromList(node);
        for (const spec of specs) {
          currentH2Builder = currentH2Builder.spec(spec);
        }
      }

      // Handle paragraph nodes that might contain embeds
      if (node.type === "paragraph") {
        for (const child of (node as Paragraph).children) {
          if (child.type === "image") {
            // Try markdown embed
            const mdCards = await processMarkdownEmbed(
              child as Image,
              basePath,
            );
            if (mdCards) {
              // Add embedded cards to current builder
              for (const embeddedCard of mdCards) {
                if (embeddedCard.name) {
                  currentH2Builder = currentH2Builder.card(
                    embeddedCard.name,
                    (c) => {
                      if (typeof embeddedCard.value === "string") {
                        return c.spec(embeddedCard.value);
                      } else if (Array.isArray(embeddedCard.value)) {
                        return addCardsToBuilder(c, embeddedCard.value);
                      }
                      return c;
                    },
                  );
                }
              }
            }
          }
        }
      }
    }
  }

  // Don't forget to add the last H2 card
  if (currentH2Builder && currentH2Name) {
    deck = deck.card(currentH2Name, () => currentH2Builder!);
  }

  return { deck, samples: allSamples };
}

/**
 * Extract text content from a heading node
 */
function extractText(node: Heading): string {
  const textNodes = node.children.filter((child) =>
    child.type === "text"
  ) as Array<Text>;
  return textNodes.map((t) => t.value).join("");
}

/**
 * Extract specs (bullet points) from a list node
 */
function extractSpecsFromList(list: List): Array<string> {
  const specs: Array<string> = [];

  for (const item of list.children) {
    if (item.type === "listItem") {
      const text = extractTextFromListItem(item);
      if (text) {
        specs.push(text);
      }
    }
  }

  return specs;
}

/**
 * Extract text from a list item
 */
function extractTextFromListItem(item: ListItem): string {
  // Find the first paragraph or text node
  for (const child of item.children) {
    if (child.type === "paragraph") {
      const textNodes = child.children.filter((c) =>
        c.type === "text"
      ) as Array<Text>;
      return textNodes.map((t) => t.value).join("");
    }
  }
  return "";
}

/**
 * Collect specs (bullet points) until the next header
 */
function collectSpecsUntilNextHeader(
  children: Root["children"],
  startIndex: number,
): Array<string> {
  const specs: Array<string> = [];

  for (let i = startIndex; i < children.length; i++) {
    const node = children[i];

    // Stop at next header
    if (node.type === "heading") {
      break;
    }

    // Collect specs from unordered lists
    if (node.type === "list" && !node.ordered) {
      specs.push(...extractSpecsFromList(node));
    }

    // Note: Embedded cards in nested sections are not currently handled
    // This would require refactoring to return both specs and embedded cards
  }

  return specs;
}

/**
 * Load and parse a TOML file
 */
async function loadTomlFile(filePath: string): Promise<TomlFile> {
  try {
    const content = await Deno.readTextFile(filePath);
    return parseToml(content) as TomlFile;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load TOML file ${filePath}: ${message}`);
  }
}

/**
 * Process markdown file embeds and extract cards
 * Returns embedded cards or null if not a markdown embed
 */
async function processMarkdownEmbed(
  node: Image,
  basePath?: string,
): Promise<Array<Card> | null> {
  if (!node.url || !node.url.endsWith(".md")) {
    return null;
  }

  // Split URL and fragment
  const [urlPath, fragment] = node.url.split("#");

  const filePath = basePath ? resolve(basePath, urlPath) : urlPath;

  try {
    // Read and parse the markdown file
    const markdownContent = await Deno.readTextFile(filePath);
    const { deck: embeddedDeck } = await parseMarkdownToDeck(
      markdownContent,
      dirname(filePath),
    );
    const allCards = embeddedDeck.getCards();
    if (fragment) {
      // Find specific card by ID
      const card = findCardById(allCards, fragment);
      return card ? [card] : null;
    }

    // Return all cards
    return allCards;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load markdown file ${filePath}: ${message}`);
  }
}

/**
 * Add cards to a card builder
 */
function addCardsToBuilder(
  builder: CardBuilder,
  cards: Array<Card>,
): CardBuilder {
  let result = builder;

  for (const card of cards) {
    if (typeof card.value === "string") {
      // It's a spec
      result = result.spec(card.value);
    } else if (Array.isArray(card.value) && card.name) {
      // It's a nested card
      result = result.card(
        card.name,
        (c) => addCardsToBuilder(c, card.value as Array<Card>),
      );
    }
  }

  return result;
}

/**
 * Find a card by its ID (name) using hierarchical dot notation
 */
function findCardById(cards: Array<Card>, id: string): Card | null {
  const parts = id.split(".");
  let currentCards = cards;
  let foundCard: Card | null = null;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].toLowerCase();
    const card = currentCards.find((c) => {
      // Convert card name to ID format (lowercase, hyphens)
      const cardId = c.name?.toLowerCase().replace(/\s+/g, "-").replace(
        /[^a-z0-9-]/g,
        "",
      );
      return cardId === part;
    });

    if (!card) {
      return null;
    }

    if (i === parts.length - 1) {
      // This is the target card
      foundCard = card;
    } else if (Array.isArray(card.value)) {
      // Continue searching in nested cards
      currentCards = card.value;
    } else {
      // Can't navigate further
      return null;
    }
  }

  return foundCard;
}

/**
 * Process image nodes that represent TOML embeds
 * Returns the embedded contexts/samples or null if not a TOML embed
 */
async function processTomlEmbed(
  node: Image,
  basePath?: string,
): Promise<
  {
    contexts?: Record<string, TomlContext>;
    samples?: Record<string, TomlSample>;
  } | null
> {
  if (!node.url) {
    return null;
  }

  // Split URL and fragment
  const [urlPath, fragment] = node.url.split("#");

  // Check if it's a TOML file
  if (!urlPath.endsWith(".toml")) {
    return null;
  }

  const filePath = basePath ? resolve(basePath, urlPath) : urlPath;
  const tomlData = await loadTomlFile(filePath);

  // If there's a fragment identifier, only return that specific item
  if (fragment) {
    const result: {
      contexts?: Record<string, TomlContext>;
      samples?: Record<string, TomlSample>;
    } = {};

    // Check if it's a context
    if (tomlData.contexts && tomlData.contexts[fragment]) {
      result.contexts = { [fragment]: tomlData.contexts[fragment] };
    }

    // Check if it's a sample
    if (tomlData.samples && tomlData.samples[fragment]) {
      result.samples = { [fragment]: tomlData.samples[fragment] };
    }

    return result;
  }

  // No fragment, return all contexts and samples
  return {
    contexts: tomlData.contexts,
    samples: tomlData.samples,
  };
}
