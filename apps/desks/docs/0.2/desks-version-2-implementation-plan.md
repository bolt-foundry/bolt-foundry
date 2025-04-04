### 4. Isograph Schema Extensions (Challenging)

**File**: `apps/graphql/types/graphqlDesks.ts`

**Purpose**: Extend GraphQL schema with Desks-specific types and queries

**Technical Specifications**:

- Define GraphQL types for Desk, DeskParticipant, and DeskSettings
- Create queries for fetching desk data and participant information
- Define mutations for updating participant settings
- Integrate with existing GraphQL schema

**Schema Extensions**:

```graphql
type Desk {
  id: ID!
  name: String!
  participants: [DeskParticipant!]!
  createdAt: DateTime!
}

type DeskParticipant {
  id: ID!
  person: BfPerson!
  videoEnabled: Boolean!
  audioEnabled: Boolean!
  status: ParticipantStatus!
  joinedAt: DateTime!
}

enum ParticipantStatus {
  AVAILABLE
  BUSY
  AWAY
  DO_NOT_DISTURB
}
```
