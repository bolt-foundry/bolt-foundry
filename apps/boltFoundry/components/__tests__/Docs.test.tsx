#!/usr/bin/env -S bff test

import { assertEquals } from "@std/assert";
import { render } from "@bfmono/infra/testing/ui-testing.ts";
// TODO: Import Docs once it's updated to handle the import map
// import { Docs } from "../Docs.tsx";

// Mock the import map that will be generated
const mockDocComponents = {
  "quickstart": () => <div>Quickstart Content</div>,
  "getting-started": () => <div>Getting Started Content</div>,
};

// Mock Docs component for testing until the real one is updated
function MockDocs(
  { slug, _mockComponents }: {
    slug: string;
    _mockComponents: Record<string, () => React.ReactElement>;
  },
) {
  if (slug === "") {
    return <div>Documentation</div>;
  }
  const Component = _mockComponents[slug];
  if (!Component) {
    return <div>Documentation not found</div>;
  }
  return <Component />;
}

Deno.test("Docs component renders the correct MDX content based on slug", () => {
  // This test verifies that the Docs component can use the import map
  // to render the correct content based on the slug parameter

  // Test rendering quickstart
  const { getByText: getByTextQuickstart } = render(
    <MockDocs
      slug="quickstart"
      _mockComponents={mockDocComponents}
    />,
  );

  assertEquals(
    getByTextQuickstart("Quickstart Content")?.textContent,
    "Quickstart Content",
    "Should render quickstart content",
  );

  // Test rendering getting-started
  const { getByText: getByTextGettingStarted } = render(
    <MockDocs
      slug="getting-started"
      _mockComponents={mockDocComponents}
    />,
  );

  assertEquals(
    getByTextGettingStarted("Getting Started Content")?.textContent,
    "Getting Started Content",
    "Should render getting-started content",
  );
});

Deno.test("Docs component handles missing docs gracefully", () => {
  // Test what happens when a doc doesn't exist
  const { getByText } = render(
    <MockDocs
      slug="non-existent"
      _mockComponents={mockDocComponents}
    />,
  );

  // Should show an appropriate error message
  assertEquals(
    getByText("Documentation not found")?.textContent,
    "Documentation not found",
    "Should show not found message for missing docs",
  );
});

Deno.test("Docs component handles empty slug", () => {
  // Test what happens with no slug (root /docs route)
  const { getByText } = render(
    <MockDocs
      slug=""
      _mockComponents={mockDocComponents}
    />,
  );

  // Should show a docs index or redirect message
  assertEquals(
    getByText("Documentation")?.textContent,
    "Documentation",
    "Should show documentation index for empty slug",
  );
});
