# Markdown Deck Parser - Next Steps

## Context
We're building an MVP markdown deck parser that will:
- Parse markdown files and convert them to DeckBuilder objects
- Be used by bff-eval when passed a .md file (e.g., `bff-eval --grader file.md`)
- Support basic structure first (headers → cards, bullets → specs)

## Completed
1. ✅ Created test file: `packages/bolt-foundry/builders/markdown/__tests__/markdownToDeck.test.ts`
2. ✅ Created stub implementation: `packages/bolt-foundry/builders/markdown/markdownToDeck.ts`
3. ✅ Added npm:remark dependency via `deno add npm:remark`

## Next Steps

### 1. Implement the markdown parser (TDD approach)
- [ ] Add remark-parse dependency: `deno add npm:remark-parse`
- [ ] Implement `parseMarkdownToDeck` function to make tests pass
- [ ] Focus on basic features for MVP:
  - H1 → deck name
  - H2 → parent cards
  - H3+ → nested cards
  - Bullet points → specs

### 2. Test and iterate
- [ ] Run tests: `bff test packages/bolt-foundry/builders/markdown/__tests__/markdownToDeck.test.ts`
- [ ] Fix any failing tests
- [ ] Add edge case tests as needed

### 3. Integrate with bff-eval
- [ ] Update `packages/bff-eval/src/run-eval.ts` to detect .md files
- [ ] Add logic to use parseMarkdownToDeck when grader is a .md file
- [ ] Test with a real markdown deck file

### 4. Future enhancements (after MVP)
- [ ] Add support for leads (paragraph text between headers)
- [ ] Add support for embeds: `![description](file.toml)`
- [ ] Add support for footnotes with samples: `[^ref]`
- [ ] Add support for context variables from TOML files

## Current Test Coverage
The test file includes tests for:
- Basic deck with name from H1
- Cards from H2 headers
- Nested cards from H3 headers
- Specs from bullet points
- Multiple cards and specs
- Empty deck handling
- Missing H1 header handling
- Mixed content parsing

## Implementation Notes
- Using remark for AST parsing
- Following the existing builder pattern in bolt-foundry
- Maintaining immutability as per existing patterns
- Following TDD practices from testing.card.md