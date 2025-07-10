# Isograph Integration Implementation Plan

**Date:** 2025-07-09\
**Project:** boltfoundry-com\
**Goal:** Add Isograph integration as reference implementation for monorepo
standardization

## Context

The Bolt Foundry monorepo currently has inconsistent routing patterns across
apps:

- `boltfoundry-com`: Simple custom routing with exact path matching
- `aibff GUI`: Custom hash-based routing with URLPattern API
- `boltFoundry`: Already uses Isograph successfully

We want to standardize on Isograph routing across the monorepo, starting with
boltfoundry-com as the reference implementation.

## Current State

**boltfoundry-com** has:

- Vite + Deno build setup
- React 19 with TypeScript
- Simple custom router with 2 routes (`/` and `/ui`)
- Server-side rendering support
- No GraphQL or Isograph integration

## Implementation Approach

### Phase 1: Minimal Isograph Setup

Start with the smallest possible integration to prove the concept works.

#### Step 1: GraphQL Server Setup

- Add GraphQL server using Yoga and Nexus
- Create basic "Hello World" schema
- Integrate with existing Deno server

#### Step 2: Basic Isograph Configuration

- Add minimal Isograph configuration
- Set up build process integration (with or without Babel)
- Generate first Isograph component

#### Step 3: Component Integration

- Create simple Isograph component alongside existing routing
- Verify data fetching works
- Ensure build and dev processes work correctly

### Phase 2: Routing Migration (Future)

Once basic integration is proven:

- Replace custom routing with Isograph routing
- Migrate existing routes to Isograph patterns
- Document patterns for other apps

## Technical Requirements

### Dependencies

- `graphql-yoga` - GraphQL server
- `nexus` - Schema building
- `@isograph/react` - Isograph React integration
- Additional Isograph tooling as needed

### Build Integration

- Integrate Isograph compiler with existing Vite setup
- Determine if Babel is required or if alternative approach works
- Update `bft` commands to support Isograph workflow

### Configuration Files

- `isograph.config.json` - Isograph configuration
- GraphQL schema definition
- Updated build configuration

## Success Criteria

### Phase 1 Complete When:

- [ ] Basic GraphQL server responds to queries
- [ ] Isograph generates TypeScript components
- [ ] At least one Isograph component renders in the app
- [ ] Build and dev processes work without errors
- [ ] Documentation exists for replicating setup

### Long-term Success:

- Other apps can use boltfoundry-com as reference for Isograph integration
- Consistent routing patterns across monorepo
- Improved developer experience through standardization

## Risks and Considerations

### Technical Risks

- Babel integration complexity with existing Vite setup
- Potential conflicts with current build tooling
- SSR compatibility with Isograph

### Mitigation Strategies

- Start with minimal setup to isolate issues
- Document each step for troubleshooting
- Keep existing routing functional during migration

## Next Steps

1. Set up basic GraphQL server with Yoga/Nexus
2. Configure minimal Isograph setup
3. Create first working Isograph component
4. Document the working configuration
5. Plan Phase 2 routing migration

## References

- [Isograph Vite Demo](https://github.com/isographlabs/isograph/tree/main/demos/vite-demo)
- Existing boltFoundry app Isograph patterns
- Current boltfoundry-com routing implementation
