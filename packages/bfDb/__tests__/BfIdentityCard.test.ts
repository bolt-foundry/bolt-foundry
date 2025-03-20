
import { assertEquals } from "@std/assert";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfIdentityCard } from "packages/bfDb/classes/BfIdentityCard.ts";
import { BfSection } from "packages/bfDb/classes/BfSection.ts";

Deno.test("BfIdentityCard - Section Breakdown", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );

  const metadata = BfIdentityCard.generateMetadata(mockCv);
  const props = {
    title: "Test Identity Card",
    content: `# Section 1
This is content for section 1

# Section 2
This is content for section 2`,
  };

  const card = new BfIdentityCard(mockCv, props, metadata);
  await card.save();

  await card.breakIntoSections();
  const sections = await card.getSections();

  assertEquals(sections.length, 2);
  assertEquals(sections[0].props.title, "Section 1");
  assertEquals(sections[1].props.title, "Section 2");
});
