# NextJS Minimal Example Implementation Plan

## Overview

This minimal NextJS example demonstrates the core Bolt Foundry SDK features with the absolute minimum setup required. It strips the existing NextJS example down to just the regular chat functionality, providing a clear starting point for developers to build their own applications. The focus is on clarity and simplicity while maintaining TypeScript support and proper build processes.

## Goals

| Goal | Description | Success Criteria |
| --- | --- | --- |
| Minimal Setup | Create the simplest possible NextJS + Bolt Foundry example | Single chat page, <10 files total, clear file structure |
| TypeScript Support | Maintain full TypeScript support for better DX | All code type-checked, no any types |
| Core SDK Demo | Demonstrate essential Bolt Foundry SDK features | Working chat with persona cards |
| Quick Start | Enable developers to understand and modify quickly | Can be understood in <5 minutes |
| Easy Deployment | Simple to run locally and deploy | Single npm install & npm run dev |

## Anti-Goals

| Anti-Goal | Reason |
| --- | --- |
| Multiple UI Examples | Keep focus on one clear implementation |
| Streaming Chat | Adds complexity without core value |
| Advanced Features | This is for learning basics, not production |
| Custom Styling | Use minimal CSS to avoid distraction |
| Multiple Pages | Single-page keeps it simple |

## Technical Approach

The minimal example will be a stripped-down version of the existing NextJS example, keeping only the regular-chat functionality. We'll maintain the same project structure but remove all non-essential files and dependencies. The architecture remains simple: a React frontend component that sends messages to a NextJS API route, which uses the Bolt Foundry SDK to process messages with OpenAI.

Key simplifications:
- Single page application with just the chat interface
- Minimal dependencies (no linting, no Tailwind, no extras)
- Clear inline comments explaining each part
- Simple README with setup instructions

## Components

| Status | Component | Purpose |
| --- | --- | --- |
| [ ] | `/pages/index.tsx` | Single page with chat UI |
| [ ] | `/pages/api/chat.ts` | API endpoint using Bolt Foundry SDK |
| [ ] | `/pages/_app.tsx` | Minimal NextJS app wrapper |
| [ ] | `/styles/globals.css` | Basic styling for chat interface |
| [ ] | `/package.json` | Minimal dependencies |
| [ ] | `/tsconfig.json` | TypeScript configuration |
| [ ] | `/README.md` | Clear setup and usage instructions |
| [ ] | `/.env.example` | Environment variable template |

## Technical Decisions

| Decision | Reasoning | Alternatives Considered |
| --- | --- | --- |
| Keep NextJS | Familiar to many developers, good TypeScript support | Plain Node.js, Vite |
| Single page app | Reduces complexity, focuses on core functionality | Multi-page with routing |
| Inline styles where possible | Fewer files to understand | Separate CSS modules |
| Regular chat only | Simpler to understand than streaming | Include both chat types |
| Minimal package.json | Faster install, less to understand | Include dev tools |

## Next Steps

| Question | How to Explore |
| --- | --- |
| Should we include example persona cards? | Check if SDK has defaults or if we need to provide |
| How minimal can package.json be? | Test removing dev dependencies one by one |
| Best way to handle environment variables? | Document clearly in README |
| Should example include error handling? | Add minimal try-catch with user-friendly messages |