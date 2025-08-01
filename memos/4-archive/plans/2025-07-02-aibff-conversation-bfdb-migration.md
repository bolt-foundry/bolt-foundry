# Implementation Plan: Migrate AibffConversation to Proper BfDb Nodes

**Date:** 2025-07-02\
**Type:** Implementation Plan\
**Status:** Planning

## Overview

Convert the current file-based `AibffConversation` system to use proper BfDb
nodes with structured data storage, maintaining backward compatibility through
export functionality.

**Significance:** This will be the first "real" BfDb nodes for the BfDb system,
establishing patterns for future node implementations without
organization/user/CurrentViewer complexity.

## Current State Analysis

### Existing Implementation

- **Location:** `apps/bfDb/nodeTypes/aibff/AibffConversation.ts`
- **Storage:** File-based in `/tmp/conversations/` as markdown with TOML
  frontmatter
- **Structure:** Standalone class, not integrated with BfDb ecosystem
- **Limitations:**
  - No BfDb integration (doesn't extend BfNode)
  - No GraphQL exposure
  - Limited querying capabilities
  - No relations to other entities
  - Ad-hoc file storage instead of unified storage layer

### Target Architecture

- **BfAiConversation:** Main conversation node
- **BfAiMessage:** Individual message nodes with relations
- **Storage:** Structured data in BfDb storage system
- **GraphQL:** Future integration for API access

## Technical Specifications

### Node Definitions

#### BfAiConversation (BfDb Only - No GraphQL Initially)

```typescript
export class BfAiConversation
  extends BfNode<InferProps<typeof BfAiConversation>> {
  // Skip GraphQL spec initially - focus on BfDb functionality
  static override gqlSpec = undefined;

  static override bfNodeSpec = this.defineBfNode((node) =>
    node
      .string("title")
      .many("messages", () =>
        import("./BfAiMessage.ts").then((m) => m.BfAiMessage))
  );
}
```

#### BfAiMessage (BfDb Only - No GraphQL Initially)

```typescript
export class BfAiMessage extends BfNode<InferProps<typeof BfAiMessage>> {
  // Skip GraphQL spec initially - focus on BfDb functionality
  static override gqlSpec = undefined;

  static override bfNodeSpec = this.defineBfNode((node) =>
    node
      .string("role") // user, assistant, system
      .string("content") // message content
      .string("timestamp") // ISO timestamp
      .one("conversation", () =>
        import("./BfAiConversation.ts").then((m) => m.BfAiConversation))
  );
}
```

## Implementation Phases

### Phase 1: BfAiConversation Node (BfDb Only)

**Goal:** Create conversation node with BfDb functionality, no GraphQL

**Tasks:**

1. Create `BfAiConversation` node extending BfNode
2. Add `title` field with `bfNodeSpec` only (no `gqlSpec`)
3. Add temporary `messages` field as JSON for simplicity
4. Add to BfDb node registry (`apps/bfDb/models/__generated__/nodeTypesList.ts`)
5. Test basic CRUD operations through BfDb storage layer
6. Verify storage, caching, and metadata work correctly

**Acceptance Criteria:**

- Can create, read, update, delete conversations via BfDb
- BfDb storage integration working (not GraphQL)
- Standard metadata (bfGid, timestamps) handled properly
- No GraphQL exposure yet
- Happy path tests covering basic CRUD operations

### Phase 2: BfAiMessage Node and Relations (BfDb Only)

**Goal:** Add message nodes with relations, still BfDb only

**Tasks:**

1. Create `BfAiMessage` node with `bfNodeSpec` only (no `gqlSpec`)
2. Add `role`, `content`, `timestamp` fields
3. Add edge relationship: `BfAiConversation` → `BfAiMessage`
4. Remove temporary JSON messages field from `BfAiConversation`
5. Update registry to include both nodes
6. Test conversation + message creation and querying via BfDb

**Acceptance Criteria:**

- Messages stored as separate BfDb nodes
- Proper relations between conversations and messages work in BfDb
- Can query messages independently through BfDb
- Maintains referential integrity
- Still no GraphQL exposure
- Happy path tests covering basic relations and message operations

### Phase 3: GraphQL Integration (Future)

**Goal:** Add GraphQL exposure after BfDb is stable

**Tasks:**

1. Audit current GraphQL setup and relay connections configuration
2. Verify existing nodes work properly with relay connections
3. Add `gqlSpec` to both `BfAiConversation` and `BfAiMessage`
4. Test GraphQL queries and mutations
5. Ensure GraphQL relations work properly with relay patterns
6. Add to GraphQL schema generation
7. Write happy path GraphQL tests for basic queries and relations

**Acceptance Criteria:**

- Relay connections properly configured and understood
- Conversations and messages queryable via GraphQL
- Relations work in GraphQL context with proper relay patterns
- Schema properly generated
- Maintains BfDb functionality
- Happy path GraphQL tests verify nodes exist and relations work

## File Structure

```
apps/bfDb/nodeTypes/
├── BfAiConversation.ts     # New conversation node
├── BfAiMessage.ts          # New message node
└── aibff/
    └── AibffConversation.ts # Keep existing (deprecated)
```

## Migration Strategy

**No Migration Required:** Starting fresh, existing file-based conversations can
remain in place for reference.

**Future Integration:** Once stable, update aibff to use new BfDb nodes instead
of file-based system.

## Key Design Decisions

1. **First Real Application BfDb Nodes:** Establish patterns for
   application-specific nodes beyond content/infrastructure
2. **Learn from Existing:** Use patterns from BlogPost, PublishedDocument,
   GithubRepoStats as examples
3. **Separate Message Nodes:** Enables individual message querying and future
   relations
4. **BfDb First, GraphQL Later:** Establish solid BfDb functionality before
   adding GraphQL complexity
5. **No Export Initially:** Keep scope focused on core BfDb functionality
6. **Bf Prefix:** Follow BfDb naming conventions (BfAiConversation vs
   AibffConversation)

## Success Criteria

- [ ] BfAiConversation and BfAiMessage nodes created and registered
- [ ] Full CRUD operations working through BfDb
- [ ] Relations between conversations and messages functional
- [ ] Performance comparable to current file-based system
- [ ] Clean patterns established for future BfDb node development
- [ ] Ready for future aibff integration

## Future Considerations

- Add CurrentViewer integration for multi-tenancy
- Relate conversations to BfPerson/BfOrganization
- Add conversation metadata (tags, categories, etc.)
- Implement search/indexing for conversation content
- Add export functionality (gzip downloads, markdown format)
- Add bulk operations for conversation management
