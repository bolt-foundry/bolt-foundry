# BFF (Bolt Foundry Friend) Backlog

This document tracks potential features, enhancements, and improvements for the
BFF CLI tool that are currently out of scope for immediate implementation.

## Status: 🔄 Active

Last updated: Current

## Features

### Explicit Parameter Types for BFF Commands

**Description**: Improve BFF command argument handling by implementing explicit
parameter types and validation.

**Motivation**: Currently, BFF commands receive arguments as string arrays
(args: string[]) which requires manual parsing and validation. Adding a type
system would:

- Provide better developer experience with autocomplete and type checking
- Reduce runtime errors from incorrect parameter usage
- Enable automatic help generation based on parameter types
- Standardize parameter handling across all BFF commands

**Technical Details**:

```typescript
// Current pattern
export async function merge(args: string[]): Promise<number> {
  const [prNumber, method] = args;
  // Manual validation required
}

// Proposed pattern
interface MergeParams {
  prNumber?: number;
  method?: "merge" | "squash" | "rebase";
}

export async function merge(params: MergeParams): Promise<number> {
  // Type-safe parameter access
}
```

**Implementation Considerations**:

- Design a parameter definition system that integrates with the existing
  register() function
- Support for optional/required parameters, defaults, and validation rules
- Maintain backward compatibility with existing commands
- Generate help text automatically from parameter definitions

**Priority**: Medium **Effort**: Large **Dependencies**: None

---

### Interactive Mode for Complex Commands

**Description**: Add interactive prompting for commands that require user input
when parameters are not provided.

**Motivation**: Some commands like merge, pr-comments, etc. could benefit from
guided interaction rather than requiring all parameters upfront.

**Priority**: Low **Effort**: Medium **Dependencies**: Parameter types system

---

### Command Aliases

**Description**: Support shorter aliases for commonly used commands (e.g., 'm'
for 'merge', 't' for 'test').

**Motivation**: Improve developer productivity by reducing typing for frequently
used commands.

**Priority**: Low **Effort**: Small **Dependencies**: None

---

## Technical Debt

### Consolidate Shell Command Functions

**Description**: Unify the various shell command execution patterns used across
BFF friends.

**Current State**: Different commands use different patterns for executing shell
commands:

- Some use runShellCommand
- Some use runShellCommandWithOutput
- Some handle errors differently

**Desired State**: A consistent pattern for shell command execution with
standardized error handling.

**Priority**: Medium **Effort**: Medium **Dependencies**: None

---

### Improve Error Handling and Reporting

**Description**: Standardize error handling across all BFF commands with
consistent error messages and exit codes.

**Motivation**: Currently, error handling varies between commands, making
debugging harder for users.

**Priority**: Medium **Effort**: Medium **Dependencies**: None

---

## Infrastructure

### BFF Plugin System

**Description**: Implement a plugin architecture allowing users to add custom
BFF commands without modifying core code.

**Motivation**: Enable teams to create project-specific commands while
maintaining the core BFF functionality.

**Priority**: Low **Effort**: Large **Dependencies**: Parameter types system
