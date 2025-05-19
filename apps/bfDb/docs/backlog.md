# Backlog Items

1. Build out more data types for graphql / bfdb builders
2. Move mutations from a second argument to the first argument of the gql
   builder ✅
   - This has been implemented in the new builder pattern
3. Remove relations from graphql entirely

## GraphQL Builder Next Steps

### Core Implementation (Current Focus)

- Complete the implementation of gqlSpecToNexus.ts
- Add field resolver implementation with proper fallback chain ✅
- Implement validation against bfNodeSpec.relations
- Add tests for Nexus type generation

### Interface Implementation (Planned for v0.2)

- Create common "Node" GraphQL interface that requires id and __typename fields
- Update gqlSpecToNexus.ts to make all GraphQLObjectBase types implement the
  Node interface
- Implement resolveType function for proper interface resolution
- Add tests to verify interface implementation works correctly

### Relay Connection Implementation (Deprioritized for v1)

The initial version of the GraphQL builder is focusing on core scalar fields,
objects, and mutations. Relay-style connections have been deprioritized for v1.

Tasks for future implementation:

- Implement connection field builder with proper Relay-style pagination
- Add support for additionalArgs in connections
- Integrate with Nexus/GraphQL Yoga for connections
- Add connection validation against bfNodeSpec.relations
- Write tests for connection fields and pagination
