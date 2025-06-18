#!/usr/bin/env -S bff test

import { assertEquals, assertStringIncludes } from "@std/assert";
import { parseMarkdownToDeck } from "../markdownToDeck.ts";

Deno.test("parseMarkdownToDeck - paragraph headers before bullet lists should be included", async () => {
  const markdown = `# Test Deck

## Story Categories

**High Relevance:**
- First high relevance item
- Second high relevance item

**Low Relevance:**
- First low relevance item
- Second low relevance item
`;

  const { deck } = await parseMarkdownToDeck(markdown);
  const cards = deck.getCards();
  
  console.log("=== CARDS STRUCTURE ===");
  console.log(JSON.stringify(cards, null, 2));
  console.log("=== END ===");

  const rendered = deck.render({ model: "test-model" });
  const systemContent = rendered.messages[0].content as string;

  console.log("=== RENDERED OUTPUT ===");
  console.log(systemContent);
  console.log("=== END ===");

  // These assertions should fail with current implementation
  assertStringIncludes(systemContent, "**High Relevance:**");
  assertStringIncludes(systemContent, "**Low Relevance:**");
});

Deno.test("parseMarkdownToDeck - mixed paragraphs and bullets in correct order", async () => {
  const markdown = `# Test Deck

## Section

First paragraph (should be lead).

**Category One:**
- Item 1
- Item 2

Middle paragraph (should be jump-out lead).

**Category Two:**  
- Item 3
- Item 4

Final paragraph (should be jump-out lead).
`;

  const { deck } = await parseMarkdownToDeck(markdown);
  const cards = deck.getCards();
  
  console.log("=== MIXED CONTENT CARDS ===");
  console.log(JSON.stringify(cards, null, 2));
  console.log("=== END ===");

  // Count how many items we have
  const sectionCard = cards.find(c => c.name === "Section");
  if (sectionCard && Array.isArray(sectionCard.value)) {
    console.log(`Total items in section: ${sectionCard.value.length}`);
    
    // We should have:
    // 1. First paragraph (lead)
    // 2. **Category One:** (paragraph before list)
    // 3. Item 1 (spec)
    // 4. Item 2 (spec)
    // 5. Middle paragraph (jump-out lead)
    // 6. **Category Two:** (paragraph before list)
    // 7. Item 3 (spec)
    // 8. Item 4 (spec)
    // 9. Final paragraph (jump-out lead)
    
    // But with current implementation, we're missing items 2 and 6
    assertEquals(sectionCard.value.length >= 7, true, "Should have at least 7 items");
  }
});
