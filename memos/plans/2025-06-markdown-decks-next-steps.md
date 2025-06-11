# Markdown Decks Implementation - Next Steps

## Completed Features ✅

1. **TOML Context Support**
   - Basic TOML parsing for contexts and samples
   - Support for default values and type definitions
   - Command-line context variable input (key=value, JSON, @file.toml)

2. **Card Embedding**
   - Full deck embedding: `![Description](./other-deck.md)`
   - Specific card embedding: `![Description](./deck.md#card-id)`
   - Top-level and section-level embedding support

3. **Self-Contained Graders**
   - Graders can embed their own test samples via TOML
   - Eval system works without separate input files

## Next Steps 🚀

### High Priority

1. **Nested Section Embeds**
   - Support embeds within H3+ sections
   - Refactor `collectSpecsUntilNextHeader` to handle both specs and embeds

2. **Circular Reference Detection**
   - Add tracking of loaded files during parsing
   - Throw clear error on circular dependencies

3. **Footnote Support**
   - Implement `[^ref]` syntax for attaching references
   - Support footnotes resolving to embeds: `[^ref]: ![desc](file.toml#id)`

4. **Lead/Flow Control**
   - Implement paragraph text as "lead" data type
   - Support flow control directives in plain text

### Medium Priority

5. **Card Fragment Syntax Enhancement**
   - Support relative card references within same file: `#.sibling-card`
   - Implement wildcard patterns: `./deck.md#*.setup`

6. **TOML Sample Integration**
   - Use embedded samples for spec examples/calibration
   - Support sample references in specs:
     `spec("Do X", { samples: fromToml("good-example") })`

7. **Performance Optimization**
   - Cache parsed decks to avoid re-parsing on multiple embeds
   - Lazy loading for large deck hierarchies

### Low Priority

8. **Documentation**
   - Complete markdown deck format guide
   - Migration guide from TypeScript to markdown
   - Best practices for deck organization

9. **Tooling**
   - VS Code extension for deck authoring
   - Deck validation CLI command
   - Deck visualization tool

10. **Advanced Features**
    - Conditional card inclusion based on context
    - Template variables in specs: `{{contextVar}}`
    - Card inheritance/extension syntax

## Technical Debt

- Remove debug console.log statements from markdownToDeck.ts
- Add comprehensive error messages for all failure modes
- Improve type safety for Card and Sample types
- Add integration tests for complex deck hierarchies

## Breaking Changes to Consider

- Standardize on either `[context]` or `[contexts]` in TOML (currently supports
  both)
- Decide on canonical ID format (kebab-case vs camelCase)
- Consider deprecating TypeScript deck format
