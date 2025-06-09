#!/bin/bash

echo "=== Testing blogPosts Pagination with 16 posts ==="
echo

# Test 1: Get total count
echo "1. Get all posts to see total count:"
curl -s -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ blogPosts { edges { node { id } } pageInfo { hasNextPage hasPreviousPage } } }"
  }' | jq '.data.blogPosts | {totalPosts: (.edges | length), pageInfo}'

echo -e "\n2. First page (5 posts, DESC order - newest first):"
curl -s -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ blogPosts(first: 5) { edges { cursor node { id } } pageInfo { hasNextPage hasPreviousPage startCursor endCursor } } }"
  }' | jq '
    .data.blogPosts | {
      posts: [.edges[].node.id],
      hasNextPage: .pageInfo.hasNextPage,
      hasPreviousPage: .pageInfo.hasPreviousPage,
      endCursor: .pageInfo.endCursor
    }'

# Get the end cursor for next page
END_CURSOR=$(curl -s -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ blogPosts(first: 5) { pageInfo { endCursor } } }"}' | jq -r '.data.blogPosts.pageInfo.endCursor')

echo -e "\n3. Second page (5 posts after cursor):"
curl -s -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"{ blogPosts(first: 5, after: \\\"$END_CURSOR\\\") { edges { node { id } } pageInfo { hasNextPage hasPreviousPage } } }\"
  }" | jq '
    .data.blogPosts | {
      posts: [.edges[].node.id],
      hasNextPage: .pageInfo.hasNextPage,
      hasPreviousPage: .pageInfo.hasPreviousPage
    }'

echo -e "\n4. Last page (last 3 posts):"
curl -s -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ blogPosts(last: 3) { edges { node { id } } pageInfo { hasNextPage hasPreviousPage } } }"
  }' | jq '
    .data.blogPosts | {
      posts: [.edges[].node.id],
      hasNextPage: .pageInfo.hasNextPage,
      hasPreviousPage: .pageInfo.hasPreviousPage
    }'

echo -e "\n5. Filter by year 2024 with pagination:"
curl -s -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ blogPosts(filterByYear: \"2024\", first: 3) { edges { node { id } } pageInfo { hasNextPage } } }"
  }' | jq '
    .data.blogPosts | {
      posts2024: [.edges[].node.id],
      hasNextPage: .pageInfo.hasNextPage
    }'

echo -e "\n6. Sort ASC (oldest first) with pagination:"
curl -s -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ blogPosts(sortDirection: \"ASC\", first: 3) { edges { node { id } } } }"
  }' | jq '.data.blogPosts.edges[].node.id'

echo -e "\n7. Middle page using before cursor:"
# First get the last 10 posts
LAST_CURSOR=$(curl -s -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ blogPosts(last: 10) { pageInfo { startCursor } } }"}' | jq -r '.data.blogPosts.pageInfo.startCursor')

echo "Getting 3 posts before cursor $LAST_CURSOR:"
curl -s -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"{ blogPosts(last: 3, before: \\\"$LAST_CURSOR\\\") { edges { node { id } } pageInfo { hasNextPage hasPreviousPage } } }\"
  }" | jq '
    .data.blogPosts | {
      posts: [.edges[].node.id],
      hasNextPage: .pageInfo.hasNextPage,
      hasPreviousPage: .pageInfo.hasPreviousPage
    }'