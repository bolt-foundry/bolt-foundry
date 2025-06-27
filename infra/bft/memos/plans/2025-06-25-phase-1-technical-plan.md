# BFT Phase 1 Technical Implementation Plan

## Overview

This technical plan implements Phase 1 as described in the
[BFF to BFT Rename Implementation Plan](../../memos/plans/2025-06-25-bff-to-bft-rename.md#phase-1-create-parallel-structure-with-clean-implementation).

## Phase 1 Goals

1. Create `/infra/bft/` directory alongside `/infra/bff/`
2. Create new cleanroom implementation of core files in `/infra/bft/`
3. Create `bft` executable that can load and execute `.bff.ts` files
4. Implement `--help` command
5. Ensure backward compatibility

## Implementation Approach: Test-Driven Development

Following the TDD practices outlined in `/decks/cards/testing.card.md`, we will
write tests before implementation for each component.

### Step 1: Create Test Structure

1. Create `/infra/bft/__tests__/` directory
2. Write `bft.test.ts` for core registration functionality
3. Write `bin_bft.test.ts` for command loading and execution
4. Create integration test for end-to-end verification

### Step 2: Core Tests (`__tests__/bft.test.ts`)

```typescript
#! /usr/bin/env -S bft test

import { assertEquals, assertExists } from "@std/assert";
import { friendMap, register } from "../bft.ts";

Deno.test("bft: help friend should exist", () => {
  const helpFriend = friendMap.get("help");
  assertExists(helpFriend, "Help friend was not registered");
});

Deno.test("bft: registering a friend updates friendMap", () => {
  const testCommand = () => 0;
  register("testFriend", "A test friend", testCommand);
  const got = friendMap.get("testFriend");
  assertExists(got);
  assertEquals(got?.description, "A test friend");
});

Deno.test("bft: aiSafe flag is preserved in registration", () => {
  const testCommand = () => 0;
  register("aiTest", "AI safe command", testCommand, { aiSafe: true });
  const got = friendMap.get("aiTest");
  assertEquals(got?.aiSafe, true);
});
```

### Step 3: Binary Tests (`__tests__/bin_bft.test.ts`)

```typescript
#! /usr/bin/env -S bft test

import { assertEquals } from "@std/assert";

Deno.test("bin/bft: can load friends from bff directory", async () => {
  // Test that bft can discover and load .bff.ts files
  const proc = new Deno.Command("./bin/bft.ts", {
    args: ["--help"],
    cwd: "/infra/bft",
  });
  const { code, stdout } = await proc.output();
  assertEquals(code, 0);
  const output = new TextDecoder().decode(stdout);
  // Should show commands from /infra/bff/friends/
  assert(output.includes("build"));
  assert(output.includes("test"));
});

Deno.test("bin/bft: executes commands with arguments", async () => {
  const proc = new Deno.Command("./bin/bft.ts", {
    args: ["echo", "hello", "world"],
    cwd: "/infra/bft",
  });
  const { code } = await proc.output();
  assertEquals(code, 0);
});

Deno.test("bin/bft: returns error for unknown command", async () => {
  const proc = new Deno.Command("./bin/bft.ts", {
    args: ["unknownCommand"],
    cwd: "/infra/bft",
  });
  const { code } = await proc.output();
  assertNotEquals(code, 0);
});
```

### Step 4: Integration Test

```typescript
#! /usr/bin/env -S bft test

Deno.test("bft integration: can run actual bff command", async () => {
  // Run a real command like 'bft ai' to verify end-to-end
  const proc = new Deno.Command("bft", {
    args: ["ai", "--help"],
  });
  const { code } = await proc.output();
  assertEquals(code, 0);
});
```

### Step 5: Implementation Order (TDD)

1. **Write failing tests first**
2. **Implement minimal code to pass each test**
3. **Refactor while keeping tests green**

Implementation sequence:

1. Create `bft.ts` with minimal friendMap and register function
2. Add help command registration
3. Create `bin/bft.ts` with command loading from `/infra/bff/friends/`
4. Implement command execution
5. Add error handling
6. Create `/infra/bin/bft` executable wrapper

## Success Criteria

- [ ] All tests pass
- [ ] `bft --help` shows all available commands from BFF
- [ ] `bft <command>` executes BFF commands correctly
- [ ] Error handling for unknown commands
- [ ] Analytics tracking works (if applicable)

## Testing Commands

```bash
# Run all BFT tests
bft test infra/bft

# Run specific test file
bft test infra/bft/__tests__/bft.test.ts
```

## Implementation Details

See the main implementation plan for full details. This phase focuses
exclusively on creating a clean parallel structure that maintains 100%
compatibility with existing `.bff.ts` commands.
