#! /usr/bin/env -S bff test
import { assertEquals } from "@std/assert";
import { DocumentStructureBuilder } from "../DocumentStructureBuilder.ts";
import { join } from "@std/path";

async function setupTestDocs(dir: string) {
  // Create structured documentation
  await Deno.mkdir(join(dir, "docs", "guides", "01-getting-started"), {
    recursive: true,
  });
  await Deno.mkdir(join(dir, "docs", "guides", "02-development"), {
    recursive: true,
  });
  await Deno.mkdir(join(dir, "docs", "guides", "reference"), {
    recursive: true,
  });

  // Root level docs
  await Deno.writeTextFile(
    join(dir, "docs", "guides", "README.md"),
    "# Documentation Overview",
  );

  // Getting started section with config
  const gettingStartedConfig = `
[section]
title = "Getting Started"
description = "Begin your journey"

[[documents]]
slug = "README"
title = "Overview"

[[documents]]
slug = "installation"
title = "Installation Guide"

[[documents]]
slug = "quickstart"
title = "Quick Start"
`;
  await Deno.writeTextFile(
    join(dir, "docs", "guides", "01-getting-started", "config.toml"),
    gettingStartedConfig,
  );

  await Deno.writeTextFile(
    join(dir, "docs", "guides", "01-getting-started", "README.md"),
    "# Getting Started Overview",
  );
  await Deno.writeTextFile(
    join(dir, "docs", "guides", "01-getting-started", "quickstart.md"),
    "# Quick Start",
  );
  await Deno.writeTextFile(
    join(dir, "docs", "guides", "01-getting-started", "installation.md"),
    "# Installation",
  );
  await Deno.writeTextFile(
    join(dir, "docs", "guides", "01-getting-started", "advanced.md"),
    "# Advanced Setup",
  );

  // Development section without config
  await Deno.writeTextFile(
    join(dir, "docs", "guides", "02-development", "README.md"),
    "# Development Guide",
  );
  await Deno.writeTextFile(
    join(dir, "docs", "guides", "02-development", "testing.md"),
    "# Testing",
  );
  await Deno.writeTextFile(
    join(dir, "docs", "guides", "02-development", "coding-standards.md"),
    "# Coding Standards",
  );

  // Reference section with hidden files
  const referenceConfig = `
[section]
title = "API Reference"

[settings]
hidden = ["deprecated.md"]
`;
  await Deno.writeTextFile(
    join(dir, "docs", "guides", "reference", "config.toml"),
    referenceConfig,
  );

  await Deno.writeTextFile(
    join(dir, "docs", "guides", "reference", "api.md"),
    "# API Reference",
  );
  await Deno.writeTextFile(
    join(dir, "docs", "guides", "reference", "deprecated.md"),
    "# Deprecated APIs",
  );
}

Deno.test("DocumentStructureBuilder - builds hierarchical structure", async () => {
  const tempDir = await Deno.makeTempDir();

  try {
    await setupTestDocs(tempDir);

    const builder = new DocumentStructureBuilder(
      join(tempDir, "docs", "guides"),
    );
    const structure = await builder.build();

    // Root section
    assertEquals(structure.slug, "root");
    assertEquals(structure.title, "Root");
    assertEquals(structure.documents.length, 1);
    assertEquals(structure.documents[0].slug, "README");
    assertEquals(structure.documents[0].title, "Overview");

    // Should have 3 subsections
    assertEquals(structure.subsections.length, 3);

    // First subsection - with order prefix and config
    const gettingStarted = structure.subsections[0];
    assertEquals(gettingStarted.slug, "getting-started");
    assertEquals(gettingStarted.title, "Getting Started");
    assertEquals(gettingStarted.description, "Begin your journey");
    assertEquals(gettingStarted.order, 1);

    // Documents should follow config order
    assertEquals(gettingStarted.documents.length, 4);
    assertEquals(gettingStarted.documents[0].slug, "README");
    assertEquals(gettingStarted.documents[0].title, "Overview");
    assertEquals(gettingStarted.documents[1].slug, "installation");
    assertEquals(gettingStarted.documents[1].title, "Installation Guide");
    assertEquals(gettingStarted.documents[2].slug, "quickstart");
    assertEquals(gettingStarted.documents[2].title, "Quick Start");
    assertEquals(gettingStarted.documents[3].slug, "advanced");
    assertEquals(gettingStarted.documents[3].title, "Advanced");

    // Second subsection - with order prefix, no config
    const development = structure.subsections[1];
    assertEquals(development.slug, "development");
    assertEquals(development.title, "Development");
    assertEquals(development.order, 2);

    // Documents should have README first, then alphabetical
    assertEquals(development.documents.length, 3);
    assertEquals(development.documents[0].slug, "README");
    assertEquals(development.documents[0].title, "Overview");
    assertEquals(development.documents[1].slug, "coding-standards");
    assertEquals(development.documents[2].slug, "testing");

    // Third subsection - no prefix, with config and hidden files
    const reference = structure.subsections[2];
    assertEquals(reference.slug, "reference");
    assertEquals(reference.title, "API Reference");
    assertEquals(reference.order, 2); // Gets order 2 as it's the third directory

    // Should not include hidden file
    assertEquals(reference.documents.length, 1);
    assertEquals(reference.documents[0].slug, "api");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("DocumentStructureBuilder - handles empty directories", async () => {
  const tempDir = await Deno.makeTempDir();

  try {
    await Deno.mkdir(join(tempDir, "docs", "guides"), { recursive: true });

    const builder = new DocumentStructureBuilder(
      join(tempDir, "docs", "guides"),
    );
    const structure = await builder.build();

    assertEquals(structure.slug, "root");
    assertEquals(structure.documents.length, 0);
    assertEquals(structure.subsections.length, 0);
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("DocumentStructureBuilder - handles missing directory", async () => {
  const tempDir = await Deno.makeTempDir();

  try {
    const builder = new DocumentStructureBuilder(
      join(tempDir, "does-not-exist"),
    );
    const structure = await builder.build();

    assertEquals(structure.slug, "root");
    assertEquals(structure.documents.length, 0);
    assertEquals(structure.subsections.length, 0);
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});
