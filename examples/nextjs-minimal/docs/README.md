# NextJS Minimal Example Documentation

## What are we building?

We're creating the simplest possible NextJS example that demonstrates the Bolt
Foundry SDK. This is a single-page chat application stripped down to its
absolute essentials. Think of it as the "Hello World" of Bolt Foundry - just
enough code to understand how structured prompts work, without any distractions.

The example takes our existing NextJS sample and removes everything except the
regular chat functionality. No streaming, no multiple pages, no fancy UI - just
a text input, a send button, and a conversation display that shows how to use
persona cards with the Bolt Foundry SDK.

## Why do we need to build it?

Our current NextJS example is comprehensive but overwhelming for newcomers.
Developers looking at Bolt Foundry for the first time need to understand the
core concept quickly without wading through authentication, routing, multiple
chat implementations, and various UI patterns.

Based on the product plan's v0.1 focus on "Interactive Documentation &
Examples," we need self-contained examples that work as starter projects. This
minimal example serves as:

- A 5-minute introduction to Bolt Foundry concepts
- A copy-paste starting point for new projects
- A clear demonstration of the value proposition
- An answer to "show me the simplest thing that works"

## Status

| Task                          | Status   | Description                              |
| ----------------------------- | -------- | ---------------------------------------- |
| Planning & Documentation      | Complete | Created proper folder structure and docs |
| Review existing example       | Active   | Analyzing what to keep/remove            |
| Create minimal implementation | Pending  | Build the stripped-down version          |
| Test and validate             | Pending  | Ensure it runs cleanly                   |
| Add inline documentation      | Pending  | Clear comments explaining each part      |

## Future work

| Task                       | Description                            |
| -------------------------- | -------------------------------------- |
| Error handling example     | Add minimal but helpful error states   |
| Persona card customization | Show how to modify the default persona |
| Deployment guide           | Simple instructions for Vercel/Netlify |
| Video walkthrough          | 5-minute explanation of the code       |

## Measurement

| Metric                | Purpose              | Description                         |
| --------------------- | -------------------- | ----------------------------------- |
| Time to first message | Validate simplicity  | How long from clone to working chat |
| Lines of code         | Ensure minimalism    | Total LOC including comments        |
| Dependency count      | Track complexity     | Number of npm packages required     |
| Setup steps           | Developer experience | Steps from clone to running app     |
