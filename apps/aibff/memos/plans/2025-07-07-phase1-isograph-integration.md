# Phase 1: BfDb Builders + Isograph Integration Technical Plan

**Date**: 2025-07-07\
**Status**: Planning\
**Goal**: Replace direct file operations with BfDb builders and proper
GraphQL/Isograph integration

## Current State Analysis

### Existing Isograph Infrastructure ✅

**Working Components**:

- Isograph configuration properly set up (`isograph.config.json`)
- TypeScript integration functional with generated types
- Two demo components successfully using Isograph
- Basic GraphQL schema defined (`schema.graphql`)
- GraphQL server endpoint at `/graphql` in `guiServer.ts`

**Current Schema**:

```graphql
type Query {
  hello: String!
  conversation(id: ID!): Conversation
  conversations: [Conversation!]!
}

type Mutation {
  createConversation: Conversation!
  sendMessage(conversationId: ID!, content: String!): Message!
}

type Conversation {
  id: ID!
  createdAt: String!
  messages: [Message!]!
}

type Message {
  id: ID!
  content: String!
  role: MessageRole!
  createdAt: String!
}
```

### Critical Gaps ❌

**File-Based Storage Issues**: Current `AibffConversation` class uses direct
file operations instead of structured data storage

**No BfDb Integration**: Missing proper data models using BfDb builders pattern

**Save Functionality Disconnect**: Current save uses direct HTTP:

```typescript
// Current implementation in guiServer.ts
{
  pattern: new URLPattern({ pathname: "/api/conversations/:conversationId/save" }),
  handler: async (request: Request) => {
    // Direct file operations, bypasses GraphQL completely
  }
}
```

**Tool Calls Outside GraphQL**: Tool execution in `ChatWithIsograph.tsx` uses
direct methods

**Missing Data Architecture**: No structured relationships between
conversations, messages, and workflow files

## Phase 1 Implementation Plan

### Step 1: Create BfDb Node Types

**1.1 Define Core Data Models**

Create BfDb node types in `apps/aibff/src/data/`:

```typescript
// apps/aibff/src/data/BfAiConversation.ts
import { BfNode, InferProps } from "@bfmono/apps/bfDb/BfNode.ts";

export class BfAiConversation
  extends BfNode<InferProps<typeof BfAiConversation>> {
  static override bfNodeSpec = this.defineBfNode((node) =>
    node
      .string("title")
      .string("status") // active, archived, completed
      .string("workflowType") // grader, classifier, etc.
      .string("inputSamplesJsonl")
      .string("graderDeckMd")
      .string("actorDeckMd")
      .string("groundTruthToml")
      .string("notes")
  );

  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .nonNull.id("id")
      .nonNull.string("title")
      .string("status")
      .string("workflowType")
      .string("inputSamplesJsonl")
      .string("graderDeckMd")
      .string("actorDeckMd")
      .string("groundTruthToml")
      .string("notes")
      .nonNull.isoDate("createdAt", {
        resolve: (root) => root.metadata.createdAt,
      })
      .nonNull.isoDate("updatedAt", {
        resolve: (root) => root.metadata.lastUpdated,
      })
      .connection("messages", () => BfAiMessage, {
        resolve: async (root, args, ctx) => {
          const messages = await BfAiMessage.query(
            ctx.currentViewer,
            { conversationId: root.id },
            {},
            [],
            undefined,
            { totalLimit: args.first || 50 },
          );
          return BfAiMessage.connection(messages, args);
        },
      })
      .connection("savedResults", () => BfAiSavedResult, {
        resolve: async (root, args, ctx) => {
          const results = await BfAiSavedResult.query(
            ctx.currentViewer,
            { conversationId: root.id },
            {},
            [],
          );
          return BfAiSavedResult.connection(results, args);
        },
      })
  );
}

// apps/aibff/src/data/BfAiMessage.ts
export class BfAiMessage extends BfNode<InferProps<typeof BfAiMessage>> {
  static override bfNodeSpec = this.defineBfNode((node) =>
    node
      .string("role") // user, assistant, system
      .string("content")
      .string("conversationId")
      .number("sequence") // ordering within conversation
  );

  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .nonNull.id("id")
      .nonNull.string("role")
      .nonNull.string("content")
      .nonNull.int("sequence")
      .nonNull.isoDate("createdAt", {
        resolve: (root) => root.metadata.createdAt,
      })
      .object("conversation", () => BfAiConversation, {
        resolve: async (root, _args, ctx) => {
          return await BfAiConversation.findX(
            ctx.currentViewer,
            root.props.conversationId,
          );
        },
      })
  );
}

// apps/aibff/src/data/BfAiSavedResult.ts
export class BfAiSavedResult
  extends BfNode<InferProps<typeof BfAiSavedResult>> {
  static override bfNodeSpec = this.defineBfNode((node) =>
    node
      .string("conversationId")
      .json("completionData") // OpenAI completion response
  );

  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .nonNull.id("id")
      .nonNull.json("completionData")
      .nonNull.isoDate("createdAt", {
        resolve: (root) => root.metadata.createdAt,
      })
      .object("conversation", () => BfAiConversation, {
        resolve: async (root, _args, ctx) => {
          return await BfAiConversation.findX(
            ctx.currentViewer,
            root.props.conversationId,
          );
        },
      })
  );
}
```

**1.2 Set up BfDb GraphQL Server**

Replace manual GraphQL schema with BfDb auto-generated schema:

```typescript
// apps/aibff/commands/graphql-schema.ts
import { createYoga } from "graphql-yoga";
import { buildSchema } from "@bfmono/apps/bfDb/graphql/schemaConfig.ts";
import { BfAiConversation } from "../src/data/BfAiConversation.ts";
import { BfAiMessage } from "../src/data/BfAiMessage.ts";
import { BfAiSavedResult } from "../src/data/BfAiSavedResult.ts";

export const createGraphQLServer = (isDev: boolean) => {
  const schema = buildSchema({
    nodeTypes: [
      BfAiConversation,
      BfAiMessage,
      BfAiSavedResult,
    ],
    enableIntrospection: isDev,
  });

  return createYoga({
    schema,
    graphiql: isDev,
    landingPage: false,
    maskedErrors: !isDev,
  });
};
```

**1.3 Test BfDb Integration**

Create test queries using BfDb patterns:

```tsx
export const ConversationQuery = iso(`
  field Query.ConversationQuery @component {
    bfAiConversation(id: $conversationId) {
      id
      title
      status
      createdAt
      updatedAt
      messages {
        edges {
          node {
            id
            role
            content
            sequence
            createdAt
          }
        }
      }
      savedResults {
        edges {
          node {
            id
            completionData
            createdAt
          }
        }
      }
    }
  }
`)(function ConversationComponent({ data }) {
  const conversation = data.bfAiConversation;
  return (
    <div>
      <h3>{conversation.title}</h3>
      <p>Status: {conversation.status}</p>
      {/* Render messages and saved results */}
    </div>
  );
});
```

### Step 2: Add BfDb Mutations

**2.1 Add Mutation Methods to Node Types**

BfDb automatically generates GraphQL schema from node definitions. Add mutations
to each node type:

```typescript
// Extend BfAiConversation with mutations
export class BfAiConversation
  extends BfNode<InferProps<typeof BfAiConversation>> {
  // ... existing bfNodeSpec and gqlSpec ...

  static override mutationsSpec = this.defineMutations((m) =>
    m
      .mutation("createBfAiConversation", (m) =>
        m
          .input("title", (arg) => arg.string())
          .input("workflowType", (arg) => arg.string().optional())
          .resolve(async (input, ctx) => {
            return await BfAiConversation.__DANGEROUS__createUnattached(
              ctx.currentViewer,
              {
                title: input.title,
                status: "active",
                workflowType: input.workflowType || "grader",
                inputSamplesJsonl: "",
                graderDeckMd: "",
                actorDeckMd: "",
                groundTruthToml: "",
                notes: "",
              },
            );
          }))
      .mutation("updateWorkflowData", (m) =>
        m
          .input("conversationId", (arg) => arg.nonNull.id())
          .input("inputSamplesJsonl", (arg) => arg.string().optional())
          .input("graderDeckMd", (arg) => arg.string().optional())
          .input("actorDeckMd", (arg) => arg.string().optional())
          .input("groundTruthToml", (arg) => arg.string().optional())
          .input("notes", (arg) => arg.string().optional())
          .resolve(async (input, ctx) => {
            const conversation = await BfAiConversation.findX(
              ctx.currentViewer,
              input.conversationId,
            );

            const updates: Record<string, unknown> = {};
            if (input.inputSamplesJsonl !== undefined) {
              updates.inputSamplesJsonl = input.inputSamplesJsonl;
            }
            if (input.graderDeckMd !== undefined) {
              updates.graderDeckMd = input.graderDeckMd;
            }
            if (input.actorDeckMd !== undefined) {
              updates.actorDeckMd = input.actorDeckMd;
            }
            if (input.groundTruthToml !== undefined) {
              updates.groundTruthToml = input.groundTruthToml;
            }
            if (input.notes !== undefined) updates.notes = input.notes;

            return await conversation.update(ctx.currentViewer, updates);
          }))
  );
}

// Extend BfAiSavedResult with mutations
export class BfAiSavedResult
  extends BfNode<InferProps<typeof BfAiSavedResult>> {
  // ... existing specs ...

  static override mutationsSpec = this.defineMutations((m) =>
    m
      .mutation("saveTestResult", (m) =>
        m
          .input("conversationId", (arg) => arg.nonNull.id())
          .input("completionData", (arg) => arg.nonNull.json())
          .resolve(async (input, ctx) => {
            return await BfAiSavedResult.__DANGEROUS__createUnattached(
              ctx.currentViewer,
              {
                conversationId: input.conversationId,
                completionData: input.completionData,
              },
            );
          }))
  );
}
```

### Step 3: Replace HTTP Save with Isograph Mutations

**3.1 Create BfDb Mutation Components**

Use Isograph with BfDb-generated mutations:

```tsx
// New file: src/components/SaveConversationMutation.tsx
export const SaveTestResultMutation = iso(`
  field Mutation.saveTestResult {
    id
    createdAt
    completionData
    conversation {
      id
      title
    }
  }
`);

export const UpdateWorkflowMutation = iso(`
  field Mutation.updateWorkflowData {
    id
    inputSamplesJsonl
    graderDeckMd
    actorDeckMd
    groundTruthToml
    notes
    updatedAt
  }
`);
```

**3.2 Update WorkflowPanel Save Button**

Replace direct fetch with BfDb Isograph mutation:

```tsx
// In WorkflowPanel.tsx
import { SaveTestResultMutation } from "./SaveConversationMutation.tsx";

function WorkflowPanel({ conversationId, completionData }) {
  const [saveResult, saveTestResult] = useMutation(SaveTestResultMutation);

  const handleSave = async () => {
    try {
      const result = await saveTestResult({
        conversationId,
        completionData,
      });

      if (result.kind === "success") {
        // Show success feedback with result.data
        console.log("Saved result:", result.data);
      }
    } catch (error) {
      // Show error feedback
      console.error("Save failed:", error);
    }
  };

  return (
    <div className="workflow-panel-save-section">
      <BfDsButton
        onClick={handleSave}
        disabled={saveResult.kind === "pending"}
        variant="primary"
      >
        {saveResult.kind === "pending" ? "Saving..." : "Save Test Result"}
      </BfDsButton>
      {saveResult.kind === "success" && (
        <BfDsCallout variant="success" size="small">
          Test result saved successfully
        </BfDsCallout>
      )}
      {saveResult.kind === "error" && (
        <BfDsCallout variant="error" size="small">
          Failed to save: {saveResult.error.message}
        </BfDsCallout>
      )}
    </div>
  );
}
```

**3.3 Update Tool Call Integration**

Move tool calls to GraphQL mutations:

```graphql
# Add to schema
extend type Mutation {
  executeToolCall(
    conversationId: ID!
    toolName: String!
    parameters: JSON!
  ): ToolCallResult!
}

type ToolCallResult {
  success: Boolean!
  result: String
  error: String
}
```

### Step 4: Remove HTTP API Dependencies

**4.1 Deprecate Direct Save Endpoint**

Comment out or remove HTTP save endpoint in `guiServer.ts`:

```typescript
// Remove this pattern handler:
// {
//   pattern: new URLPattern({ pathname: "/api/conversations/:conversationId/save" }),
//   handler: async (request: Request) => { ... }
// }
```

**4.2 Update All Direct API Calls**

Find and replace all `fetch("/api/...")` calls with Isograph queries/mutations.

## Implementation Phases

### Phase 1A: BfDb Foundation (3-4 days)

1. ✅ Create BfDb node types (BfAiConversation, BfAiMessage, BfAiSavedResult)
2. ✅ Set up BfDb GraphQL server with auto-generated schema
3. ✅ Test basic queries and connections work
4. ✅ Set up CurrentViewer for aibff context

### Phase 1B: Direct Migration (2-3 days)

1. ✅ Create data migration utilities from file-based to BfDb
2. ✅ Replace AibffConversation class entirely with BfAiConversation
3. ✅ Update all GUI components to use BfDb/Isograph directly
4. ✅ Remove file-based storage and HTTP endpoints

### Phase 1C: Save Integration (3-4 days)

1. ✅ Add mutation specs to BfDb node types
2. ✅ Create Isograph mutation components for save functionality
3. ✅ Replace WorkflowPanel save button with BfDb mutation
4. ✅ Add proper error handling and success feedback

### Phase 1C: Tool Integration & Testing (2-3 days)

1. ✅ Move all tool calls to BfDb mutations
2. ✅ Update ChatWithIsograph to use BfDb mutations
3. ✅ Test end-to-end workflow with database storage
4. ✅ Verify all existing functionality works with BfDb

## Success Criteria

- [ ] Save button uses BfDb Isograph mutation instead of fetch
- [ ] All conversation data stored in database via BfDb nodes
- [ ] Tool calls execute via BfDb GraphQL mutations
- [ ] No direct HTTP calls to `/api/conversations/*` endpoints
- [ ] Proper error handling with BfDb error patterns
- [ ] TypeScript type safety maintained throughout with BfDb InferProps
- [ ] Complete replacement of file-based storage with BfDb (no compatibility
      layer)
- [ ] Performance meets or exceeds file-based approach
- [ ] Relationships between conversations, messages, and saved results work
      correctly

## Risk Mitigation

**Data Loss Risk**: Create migration script to convert existing file-based
conversations to BfDb before removing file support

**Performance Risk**: Database queries may initially be slower than direct file
access - implement proper indexing and connection pooling

**Complexity Risk**: Start with simple BfDb node types, add relationships and
mutations gradually

**Breaking Changes**: Acceptable - direct replacement approach will break
existing file-based code until migration is complete

**Storage Backend Risk**: Choose appropriate BfDb storage adapter (SQLite for
dev, PostgreSQL for production)

## Files to Modify

1. `apps/aibff/src/data/` - New BfDb node type definitions
2. `commands/graphql-schema.ts` - Replace with BfDb schema generation
3. `src/components/WorkflowPanel.tsx` - Replace save button with BfDb mutation
4. `src/components/ChatWithIsograph.tsx` - Replace tool calls with BfDb
   mutations
5. `guiServer.ts` - Remove HTTP endpoints, add BfDb context
6. New Isograph mutation components using BfDb types
7. `AibffConversation.ts` - Delete entirely and replace with BfAiConversation
8. Migration script for one-time file-based to database conversion

## Next Actions

1. Start with Phase 1A: Create BfDb node types and auto-generated schema
2. Set up BfDb storage backend (SQLite for initial development)
3. Create one-time migration script to convert existing file-based conversations
   to BfDb
4. Replace AibffConversation class entirely with BfAiConversation
5. Test basic BfDb queries work, then proceed with complete replacement
