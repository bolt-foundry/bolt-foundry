#!/bin/bash

echo "=== Full Pagination Demo with 16 Blog Posts ==="
echo

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Total posts available:${NC}"
TOTAL=$(curl -s -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ blogPosts { edges { node { id } } } }"}' | jq '.data.blogPosts.edges | length')
echo "Found $TOTAL posts (default limit: 10)"

echo -e "\n${BLUE}Paginating through all posts (3 per page):${NC}"

# Page 1
echo -e "\n${GREEN}Page 1 (first 3):${NC}"
PAGE1=$(curl -s -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ blogPosts(first: 3) { edges { cursor node { id } } pageInfo { hasNextPage endCursor } } }"
  }')
echo "$PAGE1" | jq '.data.blogPosts.edges[].node.id'
CURSOR1=$(echo "$PAGE1" | jq -r '.data.blogPosts.pageInfo.endCursor')
HAS_NEXT1=$(echo "$PAGE1" | jq -r '.data.blogPosts.pageInfo.hasNextPage')
echo "Has next page: $HAS_NEXT1"

# Page 2
echo -e "\n${GREEN}Page 2 (next 3 after cursor):${NC}"
PAGE2=$(curl -s -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"{ blogPosts(first: 3, after: \\\"$CURSOR1\\\") { edges { cursor node { id } } pageInfo { hasNextPage hasPreviousPage endCursor } } }\"
  }")
echo "$PAGE2" | jq '.data.blogPosts.edges[].node.id'
CURSOR2=$(echo "$PAGE2" | jq -r '.data.blogPosts.pageInfo.endCursor')
HAS_NEXT2=$(echo "$PAGE2" | jq -r '.data.blogPosts.pageInfo.hasNextPage')
HAS_PREV2=$(echo "$PAGE2" | jq -r '.data.blogPosts.pageInfo.hasPreviousPage')
echo "Has next page: $HAS_NEXT2, Has previous page: $HAS_PREV2"

# Page 3
echo -e "\n${GREEN}Page 3 (next 3 after cursor):${NC}"
PAGE3=$(curl -s -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"{ blogPosts(first: 3, after: \\\"$CURSOR2\\\") { edges { node { id } } pageInfo { hasNextPage hasPreviousPage endCursor } } }\"
  }")
echo "$PAGE3" | jq '.data.blogPosts.edges[].node.id'
CURSOR3=$(echo "$PAGE3" | jq -r '.data.blogPosts.pageInfo.endCursor')

# Continue until no more pages
echo -e "\n${GREEN}Continuing to page through remaining posts...${NC}"
CURRENT_CURSOR=$CURSOR3
PAGE_NUM=4
while true; do
  RESPONSE=$(curl -s -X POST http://localhost:9999/graphql \
    -H "Content-Type: application/json" \
    -d "{
      \"query\": \"{ blogPosts(first: 3, after: \\\"$CURRENT_CURSOR\\\") { edges { node { id } } pageInfo { hasNextPage endCursor } } }\"
    }")
  
  POSTS=$(echo "$RESPONSE" | jq -r '.data.blogPosts.edges[].node.id')
  if [ -z "$POSTS" ]; then
    echo "No more posts!"
    break
  fi
  
  echo -e "\n${GREEN}Page $PAGE_NUM:${NC}"
  echo "$POSTS"
  
  HAS_NEXT=$(echo "$RESPONSE" | jq -r '.data.blogPosts.pageInfo.hasNextPage')
  if [ "$HAS_NEXT" = "false" ]; then
    echo "Reached the end!"
    break
  fi
  
  CURRENT_CURSOR=$(echo "$RESPONSE" | jq -r '.data.blogPosts.pageInfo.endCursor')
  ((PAGE_NUM++))
done

echo -e "\n${BLUE}Filtering tests:${NC}"

echo -e "\n${GREEN}2024 posts (showing max 5):${NC}"
curl -s -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ blogPosts(filterByYear: \"2024\", first: 5) { edges { node { id } } pageInfo { hasNextPage } } }"
  }' | jq '.data.blogPosts | {posts: [.edges[].node.id], hasMore: .pageInfo.hasNextPage}'

echo -e "\n${GREEN}2023 posts (all):${NC}"
curl -s -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ blogPosts(filterByYear: \"2023\") { edges { node { id } } } }"
  }' | jq '.data.blogPosts.edges[].node.id'

echo -e "\n${BLUE}Backward pagination demo:${NC}"
echo -e "\n${GREEN}Last 3 posts:${NC}"
LAST_PAGE=$(curl -s -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ blogPosts(last: 3) { edges { node { id } } pageInfo { hasPreviousPage startCursor } } }"
  }')
echo "$LAST_PAGE" | jq '.data.blogPosts.edges[].node.id'
START_CURSOR=$(echo "$LAST_PAGE" | jq -r '.data.blogPosts.pageInfo.startCursor')

echo -e "\n${GREEN}3 posts before the last group:${NC}"
curl -s -X POST http://localhost:9999/graphql \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"{ blogPosts(last: 3, before: \\\"$START_CURSOR\\\") { edges { node { id } } } }\"
  }" | jq '.data.blogPosts.edges[].node.id'