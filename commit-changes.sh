#!/bin/bash

# Add all fastpitch files
git add decks/fastpitch/grader.deck.md
git add decks/fastpitch/sources.deck.toml  
git add decks/fastpitch/sports-news-samples.jsonl
git add decks/fastpitch/syntheticSamples.deck.toml

# Add moved file
git add decks/graders/example-tone-grader.deck.md

# Remove deleted files
git rm decks/example-tone-grader.deck.md
git rm decks/graders/sports-news-grader.deck.md
git rm decks/graders/sports-news-grader.deck.toml
git rm decks/graders/sports-news-samples.jsonl

# Add modified file
git add apps/aibff/eval.ts

echo "All changes staged successfully"