# Broken Links Report

## Summary

Found **25 broken markdown links** across the project. The root README.md file
has **4 broken links** that need to be fixed.

## Broken Links in README.md

The root README.md has the following broken links:

1. **Line 29**: `[Company vision](docs/guides/company-vision.md)`
   - **Actual location**: `./docs/guides/company-vision.md` (symlink to
     `./memos/guides/company-vision.md`)
   - **Fix**: Change to `./docs/guides/company-vision.md`

2. **Line 31**: `[Product plan](404.md)`
   - **Actual location**: `./memos/plans/2025-06-product-plan.md`
   - **Fix**: Change to `./memos/plans/2025-06-product-plan.md`

3. **Line 32**:
   `[Inference philosophy](docs/guides/improving-inference-philosophy.md)`
   - **Actual location**: `./docs/guides/improving-inference-philosophy.md`
     (symlink to `./memos/guides/improving-inference-philosophy.md`)
   - **Fix**: Change to `./docs/guides/improving-inference-philosophy.md`

4. **Line 34**: `[Team story](memos/guides/team-story.md)`
   - **Actual location**: `./memos/guides/team-story.md`
   - **Fix**: Change to `./memos/guides/team-story.md`

## Other Broken Links in the Project

### apps/bfDb/

- `apps/bfDb/builders/graphql/README.md`: Links to non-existent
  `/apps/bfDb/docs/` files
- `apps/bfDb/memos/guides/STATUS.md`: Links to non-existent implementation plans
  in `/apps/bfDb/docs/`

### decks/cards/

- `decks/cards/coding.card.md`: Links to `./testing.card.md` (doesn't exist in
  same directory)
- `decks/cards/implementation-planning.card.md`: Links to `./testing.card.md`
  (doesn't exist in same directory)

### docs/guides/

- `docs/guides/quickstart.md`: Links to `/docs/getting-started.mdx` (should be
  `.md` not `.mdx`)

### examples/

- `examples/README.md`: Links to `../docs/product-plan.md` (wrong location)
- `examples/nextjs-sample/README.md`: Links to `/docs/deck-system.md` (should be
  `/docs/guides/deck-system.md`)

### memos/guides/

- `memos/guides/business-vision.md`: Links to `./company-vision.md` (file exists
  in same directory)
- `memos/guides/docs-overview.md`: Links to non-existent behavior card
- `memos/guides/evals-overview.md`: Links to non-existent
  `/docs/case-studies.md`
- `memos/guides/STATUS.md`: Multiple broken links to docs and other resources

### packages/bff-eval/

- `packages/bff-eval/README.md`: Links to non-existent `/docs/case-studies.md`

## Recommendations

1. **Fix README.md immediately** - Update all 4 broken links to point to the
   correct locations
2. **Consider consolidating documentation** - Many files link to `/docs/`
   expecting content that's actually in `/memos/` or `/docs/guides/`
3. **No MDX files** - The project instructions specify to use plain Markdown
   only, so the link to `.mdx` should be corrected
4. **Create missing files** - Some linked files like `testing.card.md` and
   `case-studies.md` don't exist anywhere in the project
