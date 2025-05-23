# Backlog Items

1. Build out more data types for graphql / bfdb builders
2. Move mutations from a second argument to the first argument of the gql
   builder ✅
   - This has been implemented in the new builder pattern
3. Remove relations from graphql entirely

## GraphQL Builder Next Steps

### GraphQLNode Implementation (Current Priority for v0.2)

- Create GraphQLNode class that extends GraphQLObjectBase
- Define common "Node" GraphQL interface that requires id and __typename fields
- Update loadGqlTypes.ts to automatically register the Node interface
- Modify gqlSpecToNexus.ts to automatically detect GraphQLNode types
- Refactor BfNode to extend GraphQLNode
- Implement resolveType function for proper interface resolution
- Add tests to verify implementation works correctly

### Migration Implementation (Deferred to v0.3)

- Complete the implementation of gqlSpecToNexus.ts for additional features
- Complete the migration of remaining nodes to the new builder pattern
- Remove legacy builders completely
- Implement validation against bfNodeSpec.relations
- Add additional tests for Nexus type generation

### Relay Connection Implementation (Deprioritized for v1)

The initial version of the GraphQL builder is focusing on core scalar fields,
objects, and mutations. Relay-style connections have been deprioritized for v1.

Tasks for future implementation:

- Implement connection field builder with proper Relay-style pagination
- Add support for additionalArgs in connections
- Integrate with Nexus/GraphQL Yoga for connections
- Add connection validation against bfNodeSpec.relations
- Write tests for connection fields and pagination
