#!/usr/bin/env -S bff test

import { type assertEquals, assertStringIncludes } from "@std/assert";
import { parseMarkdownToDeck } from "../markdownToDeck.ts";

Deno.test("parseMarkdownToDeck - grader deck with H2 sections containing paragraph content", async () => {
  const markdown = `# Sports News Grader

You are a sports news relevancy grader.

## Main Criteria

Evaluate story selection based on the "Will casual fans say 'Did you hear about...' or just shrug?" principle.

## Story Value Categories

**High Relevance (+2 to +3):**
- Shocking trades involving All-Stars
- Transcendent stars doing unprecedented things

**Medium Relevance (-1 to +1):**
- Routine star returns
- Good players on average teams
`;

  const { deck } = await parseMarkdownToDeck(markdown);
  const rendered = deck.render({ model: "test-model" });
  const systemContent = rendered.messages[0].content as string;

  console.log("=== PARSED MARKDOWN RENDER ===");
  console.log(systemContent);
  console.log("=== END RENDER ===");

  // Check that Main Criteria has content
  assertStringIncludes(systemContent, "<Main Criteria>");
  assertStringIncludes(systemContent, "</Main Criteria>");
  
  const mainCriteriaMatch = systemContent.match(
    /<Main Criteria>([\s\S]*?)<\/Main Criteria>/,
  );
  
  console.log("=== MAIN CRITERIA CONTENT ===");
  console.log(mainCriteriaMatch?.[1] || "NO CONTENT FOUND");
  console.log("=== END ===");

  // This should fail if the content is empty
  if (mainCriteriaMatch && mainCriteriaMatch[1]) {
    assertStringIncludes(mainCriteriaMatch[1], "Will casual fans say");
  }
});

Deno.test("parseMarkdownToDeck - mixed paragraph and list content under H2", async () => {
  const markdown = `# Test Deck

## Section One

This is a paragraph under Section One.

- First bullet point
- Second bullet point

Another paragraph after the list.

## Section Two

Just a paragraph here.
`;

  const { deck } = await parseMarkdownToDeck(markdown);
  const rendered = deck.render({ model: "test-model" });
  const systemContent = rendered.messages[0].content as string;

  console.log("=== MIXED CONTENT RENDER ===");
  console.log(systemContent);
  console.log("=== END RENDER ===");

  // Extract cards to inspect structure
  const cards = deck.getCards();
  console.log("=== DECK CARDS ===");
  console.log(JSON.stringify(cards, null, 2));
  console.log("=== END CARDS ===");
});

Deno.test("parseMarkdownToDeck - actual sports grader structure", async () => {
  const markdown = `# Sports News Relevancy Grader

You are a sports news relevancy grader. You evaluate AI systems that select the 5 most relevant sports news stories from a CSV feed for casual sports fans who care about "water cooler" moments.

## Main Criteria

Evaluate story selection based on the "Will casual fans say 'Did you hear about...' or just shrug?" principle.

## Story Value Categories

**High Relevance (+2 to +3):**
- Shocking trades involving All-Stars (e.g., Devers to Giants)
- Transcendent stars doing unprecedented things (e.g., Ohtani pitching)
- Active championship games with major implications
- Marquee franchise stars returning (if unique/surprising)
- Superstar drama that results in actual news

**Medium Relevance (-1 to +1):**
- Routine star returns on premier franchises
- Superstar speculation without outcomes
- Championship games without drama
- Good players on average teams
- Minor trades or signings

**Low Relevance (-3 to -2):**
- Individual achievements in niche sports (golf majors)
- Small market team news without stars
- Technical records requiring explanation
- Backup player signings
- Minor league callups (unless top prospect on marquee team)
- Practice squad moves
- International soccer friendlies

## Key Evaluation Factors

Apply these modifiers when assessing selections:
- **Surprise Factor**: Unexpected/unique (1.5x) vs Routine/predictable (0.8x)
- **News Value**: Something happened (1.3x) vs Nothing happened (0.7x)
- **Timing**: Active NOW (1.3x) vs Past/Future (0.9x)
- **Franchise**: Yankees/Lakers/Cowboys (1.5x), Small market (0.7x)

## Scoring Guidelines

- Score 3: Perfect selection - all 5 stories are highly relevant water cooler moments, properly ordered
- Score 2: Excellent selection with minor flaws in ordering or one borderline story
- Score 1: Good selection but suboptimal ordering or includes 1-2 questionable choices
- Score -1: Poor selection - includes obvious misses like niche sports in championship slots
- Score -2: Very poor - only 2-3 relevant stories, terrible ordering
- Score -3: Completely misses the mark - dominated by irrelevant niche stories

### Evaluation Priorities

1. **Penalize most heavily for**: Including irrelevant stories or missing obvious water cooler moments
2. **Secondary consideration**: Overall story selection quality
3. **Tertiary consideration**: Proper inverted pyramid ordering (most shocking first)
`;

  const { deck } = await parseMarkdownToDeck(markdown);
  const rendered = deck.render({ model: "test-model" });
  const systemContent = rendered.messages[0].content as string;

  console.log("=== FULL SPORTS GRADER RENDER ===");
  console.log(systemContent);
  console.log("=== END RENDER ===");

  // Check each section has content
  const sections = [
    "Main Criteria",
    "Story Value Categories", 
    "Key Evaluation Factors",
    "Scoring Guidelines"
  ];

  for (const section of sections) {
    const sectionMatch = systemContent.match(
      new RegExp(`<${section}>([\\s\\S]*?)<\/${section}>`)
    );
    
    console.log(`=== ${section.toUpperCase()} CONTENT ===`);
    console.log(sectionMatch?.[1] || "NO CONTENT FOUND");
    console.log("=== END ===");
    
    if (sectionMatch && sectionMatch[1].trim() === "") {
      throw new Error(`${section} has no content!`);
    }
  }
});
