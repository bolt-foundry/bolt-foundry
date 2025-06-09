import { remark } from "npm:remark";
import remarkParse from "npm:remark-parse";
import type { Root, Heading, List, ListItem, Text, Paragraph } from "npm:@types/mdast";
import type { DeckBuilder, CardBuilder } from "../builders.ts";
import { makeDeckBuilder, makeCardBuilder } from "../builders.ts";

/**
 * Parse a markdown string and convert it to a DeckBuilder
 * 
 * Conversion rules:
 * - H1 header becomes the deck name
 * - H2 headers become parent cards
 * - H3+ headers become nested cards
 * - Bullet points become specs
 * 
 * @param markdown - The markdown content to parse
 * @returns A DeckBuilder instance
 */
export async function parseMarkdownToDeck(markdown: string): Promise<DeckBuilder> {
  // Parse markdown to AST
  const processor = remark().use(remarkParse);
  const ast = processor.parse(markdown) as Root;
  
  // Extract deck name from H1 (if exists)
  let deckName = "deck"; // default name
  const h1Index = ast.children.findIndex(
    (node) => node.type === "heading" && node.depth === 1
  );
  
  if (h1Index !== -1) {
    const h1 = ast.children[h1Index] as Heading;
    deckName = extractText(h1);
  }
  
  // Start building the deck
  let deck = makeDeckBuilder(deckName);
  
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
        while (i + 1 < ast.children.length && 
               !(ast.children[i + 1].type === "heading")) {
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
    }
  }
  
  // Don't forget to add the last H2 card
  if (currentH2Builder && currentH2Name) {
    deck = deck.card(currentH2Name, () => currentH2Builder!);
  }
  
  return deck;
}

/**
 * Extract text content from a heading node
 */
function extractText(node: Heading): string {
  const textNodes = node.children.filter((child) => child.type === "text") as Text[];
  return textNodes.map((t) => t.value).join("");
}

/**
 * Extract specs (bullet points) from a list node
 */
function extractSpecsFromList(list: List): string[] {
  const specs: string[] = [];
  
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
      const textNodes = child.children.filter((c) => c.type === "text") as Text[];
      return textNodes.map((t) => t.value).join("");
    }
  }
  return "";
}

/**
 * Collect specs (bullet points) until the next header
 */
function collectSpecsUntilNextHeader(children: Root["children"], startIndex: number): string[] {
  const specs: string[] = [];
  
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
  }
  
  return specs;
}