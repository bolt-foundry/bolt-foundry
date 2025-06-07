#!/bin/bash

# Test the blogPosts connection with various arguments

echo "=== Testing blogPosts connection ==="
echo

echo "1. Basic query with first 2 posts (default DESC order):"
curl -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query TestConnection { blogPosts(first: 2) { pageInfo { hasNextPage hasPreviousPage startCursor endCursor } edges { cursor node { id content } } nodes { id } } }"
  }' | jq .

echo
echo "2. Query with sortDirection ASC:"
curl -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query TestAscending { blogPosts(first: 3, sortDirection: \"ASC\") { edges { node { id } } } }"
  }' | jq .

echo
echo "3. Query with filterByYear for 2024:"
curl -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query TestFilter { blogPosts(filterByYear: \"2024\", first: 10) { edges { node { id } } pageInfo { hasNextPage } } }"
  }' | jq .

echo
echo "4. Query with last 2 posts:"
curl -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query TestLast { blogPosts(last: 2) { edges { node { id } } pageInfo { hasNextPage hasPreviousPage } } }"
  }' | jq .

echo
echo "5. Test cursor pagination - get first post and its cursor:"
CURSOR=$(curl -s -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetCursor { blogPosts(first: 1) { edges { cursor node { id } } } }"
  }' | jq -r '.data.blogPosts.edges[0].cursor')

echo "Got cursor: $CURSOR"
echo "Now fetching posts after this cursor:"
curl -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"query TestAfterCursor(\$after: String) { blogPosts(first: 2, after: \\\"\$after\\\") { edges { node { id } } pageInfo { hasPreviousPage } } }\",
    \"variables\": { \"after\": \"$CURSOR\" }
  }" | jq .

echo
echo "6. Schema introspection for blogPosts field:"
curl -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query IntrospectField { __type(name: \"Query\") { fields { name args { name type { name } } } } }"
  }' | jq '.data.__type.fields[] | select(.name == "blogPosts")'