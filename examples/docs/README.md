# Examples documentation

For developers building and maintaining Bolt Foundry examples.

## What we're building

Examples that work. Run one command, see results.

## Why

Examples get developers using Bolt Foundry fast. Skip the docs, see it work.
LLMs learn from code. Developers copy and build.

Problems: Next.js example lacks TypeScript. Formatting is broken. No easy way to
add examples. Takes forever to see anything work.

## Status

| Task | Status | Description |
| --- | --- | --- |
| Fix nextjs-sample | Active | Add TypeScript, fix formatting |

## Future work

| Task              | Description                 |
| ----------------- | --------------------------- |
| More providers    | Claude, Gemini examples     |
| More frameworks   | Vue, Svelte examples        |
| Advanced patterns | Streaming, function calling |
| Automated tests   | Test all examples work      |

## Metrics

| Metric                | Purpose               | How we measure                    |
| --------------------- | --------------------- | --------------------------------- |
| Time to first message | Speed to working code | Clock from clone to chat response |
| Copy rate             | Examples as starters  | GitHub clones, npm installs       |
| Support questions     | Doc quality           | Questions about basic setup       |

## Technical setup

Examples use Node.js inside our Deno monorepo:

- Deno formats everything
- TypeScript works properly
- Each example stands alone
- Minimal dependencies

## Testing approach

We follow TDD everywhere else. For examples, we keep it simple:

- Basic e2e tests in `examples/__tests__/`
- Verify examples work
- Examples stay clean without test code
- Minimal coverage only
