#!/usr/bin/env -S bff test

import { assertEquals, assertStringIncludes } from "@std/assert";
import { makeDeckBuilder } from "../builders.ts";

Deno.test("renderCards - named cards with lead text should render content inside XML tags", () => {
  const deck = makeDeckBuilder("test-deck")
    .card("Main Criteria", (c) =>
      c.lead("Evaluate based on water cooler moments")
        .spec("High impact stories")
        .spec("Surprising news"));

  const rendered = deck.render({ model: "test-model" });
  const systemContent = rendered.messages[0].content as string;

  console.log("=== RENDERED SYSTEM MESSAGE ===");
  console.log(systemContent);
  console.log("=== END SYSTEM MESSAGE ===");

  // Should include the lead text inside the XML tags
  assertStringIncludes(systemContent, "<Main Criteria>");
  assertStringIncludes(systemContent, "Evaluate based on water cooler moments");
  assertStringIncludes(systemContent, "High impact stories");
  assertStringIncludes(systemContent, "Surprising news");
  assertStringIncludes(systemContent, "</Main Criteria>");

  // Verify the content is actually inside the tags, not outside
  const mainCriteriaStart = systemContent.indexOf("<Main Criteria>");
  const mainCriteriaEnd = systemContent.indexOf("</Main Criteria>");
  const contentBetweenTags = systemContent.substring(
    mainCriteriaStart,
    mainCriteriaEnd,
  );

  assertStringIncludes(
    contentBetweenTags,
    "Evaluate based on water cooler moments",
  );
});

Deno.test("renderCards - nested cards with mixed content types", () => {
  const deck = makeDeckBuilder("grader-deck")
    .card("Story Value Categories", (c) =>
      c.lead("Categories for evaluating sports news:")
        .spec("**High Relevance (+2 to +3):**")
        .spec("- Shocking trades involving All-Stars")
        .spec("- Transcendent stars doing unprecedented things")
        .lead("Additional context for medium relevance")
        .spec("**Medium Relevance (-1 to +1):**")
        .spec("- Routine star returns"));

  const rendered = deck.render({ model: "test-model" });
  const systemContent = rendered.messages[0].content as string;

  console.log("=== STORY VALUE CATEGORIES RENDER ===");
  console.log(systemContent);
  console.log("=== END RENDER ===");

  // Check that all content is inside the XML tags
  assertStringIncludes(systemContent, "<Story Value Categories>");
  assertStringIncludes(
    systemContent,
    "Categories for evaluating sports news:",
  );
  assertStringIncludes(systemContent, "**High Relevance (+2 to +3):**");
  assertStringIncludes(systemContent, "- Shocking trades involving All-Stars");
  assertStringIncludes(
    systemContent,
    "Additional context for medium relevance",
  );
  assertStringIncludes(systemContent, "</Story Value Categories>");
});

Deno.test("renderCards - deeply nested card structure", () => {
  const deck = makeDeckBuilder("complex-deck")
    .card("Evaluation Criteria", (c) =>
      c.card("Primary Factors", (sc) =>
        sc.lead("Most important factors")
          .spec("Impact on casual fans")
          .spec("Water cooler potential"))
        .card("Secondary Factors", (sc) =>
          sc.spec("Franchise popularity")
            .spec("Timing of the news")));

  const rendered = deck.render({ model: "test-model" });
  const systemContent = rendered.messages[0].content as string;

  console.log("=== DEEPLY NESTED RENDER ===");
  console.log(systemContent);
  console.log("=== END RENDER ===");

  // Check nested structure
  assertStringIncludes(systemContent, "<Evaluation Criteria>");
  assertStringIncludes(systemContent, "<Primary Factors>");
  assertStringIncludes(systemContent, "Most important factors");
  assertStringIncludes(systemContent, "Impact on casual fans");
  assertStringIncludes(systemContent, "</Primary Factors>");
  assertStringIncludes(systemContent, "<Secondary Factors>");
  assertStringIncludes(systemContent, "Franchise popularity");
  assertStringIncludes(systemContent, "</Secondary Factors>");
  assertStringIncludes(systemContent, "</Evaluation Criteria>");
});

Deno.test("renderCards - full grader deck structure", () => {
  const deck = makeDeckBuilder("Sports News Grader")
    .lead(
      "You are a sports news relevancy grader evaluating story selections.",
    )
    .card("Main Criteria", (c) =>
      c.lead(
        'Evaluate based on "Will casual fans say \'Did you hear about...\' or just shrug?" principle',
      ))
    .card("Story Value Categories", (c) =>
      c.lead("**High Relevance (+2 to +3):**")
        .spec("- Shocking trades involving All-Stars")
        .spec("- Transcendent stars doing unprecedented things")
        .lead("**Medium Relevance (-1 to +1):**")
        .spec("- Routine star returns on premier franchises")
        .spec("- Good players on average teams")
        .lead("**Low Relevance (-3 to -2):**")
        .spec("- Individual achievements in niche sports")
        .spec("- Small market team news without stars"))
    .card("grader evaluation", (c) =>
      c.card("Grading process", (sc) =>
        sc.spec("1. Receive user message and assistant response")
          .spec("2. Evaluate against criteria")
          .spec("3. Return score from -3 to +3"))
        .card("Output Format", (sc) =>
          sc.spec("Return JSON with score and reason")));

  const rendered = deck.render({ model: "test-model" });
  const systemContent = rendered.messages[0].content as string;

  console.log("=== FULL GRADER DECK RENDER ===");
  console.log(systemContent);
  console.log("=== END RENDER ===");

  // Verify the lead is at the top level
  assertStringIncludes(
    systemContent,
    "You are a sports news relevancy grader evaluating story selections.",
  );

  // Verify Main Criteria section
  assertStringIncludes(systemContent, "<Main Criteria>");
  const mainCriteriaMatch = systemContent.match(
    /<Main Criteria>([\s\S]*?)<\/Main Criteria>/,
  );
  assertEquals(mainCriteriaMatch !== null, true);
  if (mainCriteriaMatch) {
    assertStringIncludes(
      mainCriteriaMatch[1],
      "Will casual fans say",
    );
  }

  // Verify Story Value Categories section has all content
  assertStringIncludes(systemContent, "<Story Value Categories>");
  const storyValueMatch = systemContent.match(
    /<Story Value Categories>([\s\S]*?)<\/Story Value Categories>/,
  );
  assertEquals(storyValueMatch !== null, true);
  if (storyValueMatch) {
    assertStringIncludes(storyValueMatch[1], "High Relevance");
    assertStringIncludes(storyValueMatch[1], "Shocking trades");
    assertStringIncludes(storyValueMatch[1], "Medium Relevance");
    assertStringIncludes(storyValueMatch[1], "Routine star returns");
    assertStringIncludes(storyValueMatch[1], "Low Relevance");
    assertStringIncludes(storyValueMatch[1], "niche sports");
  }

  // Verify grader evaluation section
  assertStringIncludes(systemContent, "<grader evaluation>");
  assertStringIncludes(systemContent, "<Grading process>");
  assertStringIncludes(systemContent, "</grader evaluation>");
});

Deno.test("DEBUG - Show what's actually in the XML tags", () => {
  const deck = makeDeckBuilder("test-deck")
    .card("Main Criteria", (c) =>
      c.spec("This is a spec"));

  const rendered = deck.render({ model: "test-model" });
  const systemContent = rendered.messages[0].content as string;

  console.log("=== SIMPLE CARD WITH SPEC ===");
  console.log(systemContent);
  console.log("=== END ===");

  // Now with just a lead
  const deckWithLead = makeDeckBuilder("test-deck")
    .card("Main Criteria", (c) =>
      c.lead("This is a lead"));

  const renderedWithLead = deckWithLead.render({ model: "test-model" });
  const systemContentWithLead = renderedWithLead.messages[0].content as string;

  console.log("=== SIMPLE CARD WITH LEAD ===");
  console.log(systemContentWithLead);
  console.log("=== END ===");
});
