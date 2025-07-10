#!/bin/bash

echo "=== Testing blogPosts Relay Connection ==="
echo

# Test 1: Basic connection with pageInfo
echo "1. Basic connection query with first 2 posts:"
curl -s -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ blogPosts(first: 2) { pageInfo { hasNextPage hasPreviousPage } edges { cursor node { id } } } }"
  }' | jq .

echo -e "\n2. Custom arg - sortDirection ASC:"
curl -s -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ blogPosts(first: 3, sortDirection: \"ASC\") { edges { node { id } } } }"
  }' | jq .

echo -e "\n3. Custom arg - filterByYear:"
curl -s -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ blogPosts(filterByYear: \"2025\", first: 10) { edges { node { id } } } }"
  }' | jq .

echo -e "\n4. Cursor-based pagination:"
# Get the first post's cursor
RESPONSE=$(curl -s -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ blogPosts(first: 1) { edges { cursor node { id } } } }"}')

CURSOR=$(echo $RESPONSE | jq -r '.data.blogPosts.edges[0].cursor')
echo "First post cursor: $CURSOR"

# Use the cursor to get next posts
echo "Fetching posts after cursor:"
curl -s -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"query GetAfterCursor { blogPosts(first: 2, after: \\\"$CURSOR\\\") { edges { node { id } } pageInfo { hasPreviousPage } } }\"
  }" | jq .