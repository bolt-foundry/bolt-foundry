# BFT AI Integration Enhancement Plan

_Created: 2025-07-13_

## Overview

This plan focuses on enhancing the BFT (Bolt Foundry Tool) infrastructure to
better support AI agent integration, building on the recently implemented agent
command system and the ongoing BFF-to-BFT migration.

## Current Infrastructure State

### ✅ Completed Components

- **Core BFT framework** (`infra/bft/bft.ts`) with export-based task discovery
- **AI safety validation** (`tasks/safety.bft.ts`) with `aiSafe` property
  support
- **Agent command generation** (`tasks/agentify.bft.ts`) creating
  `.agents/commands/bft/`
- **Deck execution system** for `.bft.deck.md` files with TOML context injection
- **CLI UI package** for proper stdout/stderr separation

### 🔄 Missing Components

- **`ai.bft.ts` command** - Referenced in documentation but not implemented
- **Enhanced safety validation** - Currently basic boolean/function checks
- **Workflow orchestration** - No command sequence management
- **Context management** - Limited parameter discovery and validation

## Implementation Phases

### Phase 1: Implement Missing `ai.bft.ts` Command

**Goal**: Provide the missing `bft ai` command that's referenced in AGENTS.md.

**Current Gap**: The system references `bft ai` for listing AI-safe commands,
but this command doesn't exist.

**Implementation**:

```typescript
// infra/bft/tasks/ai.bft.ts
import { TaskDefinition, taskMap } from "../bft.ts";

export const bftDefinition: TaskDefinition = {
  description: "List and execute AI-safe BFT commands",
  aiSafe: true,
  fn: async (args: Array<string>): Promise<number> => {
    if (args.length === 0) {
      // List all AI-safe commands
      return listAiSafeCommands();
    } else {
      // Execute AI-safe command with validation
      const [command, ...commandArgs] = args;
      return executeAiSafeCommand(command, commandArgs);
    }
  },
};

async function listAiSafeCommands(): Promise<number> {
  const aiSafeCommands = Array.from(taskMap.entries())
    .filter(([name, def]) => isAiSafe(def, []))
    .map(([name, def]) => ({ name, description: def.description }))
    .sort((a, b) => a.name.localeCompare(b.name));

  console.log("AI-Safe BFT Commands:\n");
  for (const { name, description } of aiSafeCommands) {
    console.log(`  bft ${name.padEnd(15)} - ${description}`);
  }

  console.log(`\nTotal: ${aiSafeCommands.length} AI-safe commands available`);
  console.log("\nUsage: bft ai <command> [args...] - Execute AI-safe command");
  return 0;
}

async function executeAiSafeCommand(
  command: string,
  args: Array<string>,
): Promise<number> {
  const taskDef = taskMap.get(command);
  if (!taskDef) {
    console.error(`Unknown command: ${command}`);
    return 1;
  }

  if (!isAiSafe(taskDef, args)) {
    console.error(`Command '${command}' is not AI-safe with these arguments`);
    console.log(
      "Use 'bft unsafe ${command}' to run anyway (requires user approval)",
    );
    return 1;
  }

  return await taskDef.fn(args);
}

function isAiSafe(taskDef: TaskDefinition, args: Array<string>): boolean {
  if (typeof taskDef.aiSafe === "boolean") {
    return taskDef.aiSafe;
  }
  if (typeof taskDef.aiSafe === "function") {
    return taskDef.aiSafe(args);
  }
  // Default to unsafe if not specified
  return false;
}
```

**Integration Points**:

- Leverage existing `taskMap` from `bft.ts`
- Use established `aiSafe` property validation
- Maintain consistency with current CLI patterns

### Phase 2: Enhanced Safety Validation System

**Goal**: Implement more sophisticated safety validation beyond simple boolean
flags.

**Current Limitation**: Safety validation is static - either
`aiSafe: true/false` or a simple function check.

**Enhanced Safety Framework**:

```typescript
// infra/bft/safety/SafetyConstraints.ts
export interface SafetyConstraints {
  // File system access controls
  allowedFiles?: Array<string | RegExp>;
  forbiddenFiles?: Array<string | RegExp>;
  allowedDirectories?: Array<string>;

  // Network and external access
  networkAccess?: boolean;
  allowedHosts?: Array<string>;

  // Environment and system access
  environmentVariables?: Array<string>;
  maxExecutionTime?: number;

  // Command-specific constraints
  maxConcurrency?: number;
  requiresConfirmation?: boolean;
}

// infra/bft/safety/SafetyValidator.ts
export class SafetyValidator {
  static validateFileAccess(
    filePath: string,
    constraints: SafetyConstraints,
  ): ValidationResult {
    // Check against allowed/forbidden file patterns
    // Validate directory access permissions
    // Return detailed validation result
  }

  static validateNetworkAccess(
    host: string,
    constraints: SafetyConstraints,
  ): ValidationResult {
    // Validate against allowed hosts
    // Check network access permissions
    // Return validation result with reasoning
  }

  static validateEnvironmentAccess(
    varName: string,
    constraints: SafetyConstraints,
  ): ValidationResult {
    // Check environment variable access
    // Validate against approved variables
    // Return detailed result
  }
}
```

**Enhanced Task Definition**:

```typescript
export interface EnhancedTaskDefinition extends TaskDefinition {
  safetyConstraints?: SafetyConstraints;
  aiSafe?: boolean | ((args: Array<string>) => boolean) | SafetyConstraints;
}
```

### Phase 3: Workflow Orchestration System

**Goal**: Enable AI agents to execute multi-step workflows with proper error
handling and recovery.

**Workflow Definition System**:

```typescript
// infra/bft/workflows/WorkflowDefinition.ts
export interface WorkflowDefinition {
  name: string;
  description: string;
  steps: Array<WorkflowStep>;
  onError?: ErrorRecoveryStrategy;
  aiSafe: boolean;
}

export interface WorkflowStep {
  command: string;
  args?: Array<string>;
  description: string;
  preconditions?: Array<PreCondition>;
  onFailure?: FailureStrategy;
  timeout?: number;
}

export interface PreCondition {
  type: "file_exists" | "command_success" | "environment_var";
  value: string;
  description: string;
}

export enum FailureStrategy {
  ABORT = "abort",
  CONTINUE = "continue",
  RETRY = "retry",
  SKIP = "skip",
}
```

**Built-in Workflow Definitions**:

```typescript
// infra/bft/workflows/common-workflows.ts
export const CI_WORKFLOW: WorkflowDefinition = {
  name: "ci",
  description: "Complete CI pipeline with build, test, and validation",
  aiSafe: true,
  steps: [
    {
      command: "genGqlTypes",
      description: "Generate GraphQL types",
      preconditions: [
        {
          type: "file_exists",
          value: "apps/*/graphql/schema.gql",
          description: "GraphQL schema files exist",
        },
      ],
    },
    {
      command: "iso",
      description: "Run Isograph compiler",
      onFailure: FailureStrategy.ABORT,
    },
    {
      command: "build",
      description: "Build all applications",
      onFailure: FailureStrategy.ABORT,
    },
    {
      command: "lint",
      description: "Run linting checks",
      onFailure: FailureStrategy.CONTINUE,
    },
    {
      command: "test",
      description: "Run unit tests",
      onFailure: FailureStrategy.ABORT,
    },
    {
      command: "e2e",
      args: ["--build"],
      description: "Run end-to-end tests",
      timeout: 300000, // 5 minutes
    },
  ],
};

export const DEVELOPMENT_SETUP_WORKFLOW: WorkflowDefinition = {
  name: "dev-setup",
  description: "Set up development environment",
  aiSafe: true,
  steps: [
    {
      command: "check",
      description: "Verify TypeScript compilation",
    },
    {
      command: "genGqlTypes",
      description: "Generate required GraphQL types",
    },
    {
      command: "devTools",
      description: "Start development servers",
      timeout: 10000, // Allow startup time
    },
  ],
};
```

### Phase 4: Advanced Context Management

**Goal**: Provide sophisticated parameter discovery, validation, and injection
for AI deck files.

**Context Discovery System**:

```typescript
// infra/bft/context/ContextManager.ts
export class ContextManager {
  static discoverContextParameters(deckPath: string): Array<ContextParameter> {
    // Parse deck file for {{variable}} patterns
    // Load associated TOML context file
    // Extract parameter schemas and validation rules
    // Return comprehensive parameter definitions
  }

  static validateContext(
    context: Record<string, any>,
    parameters: Array<ContextParameter>,
  ): ValidationResult {
    // Validate all required parameters are present
    // Check parameter types and constraints
    // Return detailed validation result
  }

  static injectContext(
    deckContent: string,
    context: Record<string, any>,
  ): string {
    // Replace {{variable}} patterns with actual values
    // Handle nested object access
    // Support template functions and filters
  }
}

export interface ContextParameter {
  name: string;
  type: "string" | "boolean" | "number" | "array" | "object";
  required: boolean;
  defaultValue?: any;
  validation?: ValidationRule;
  description: string;
  assistantQuestion?: string;
  examples?: Array<any>;
}
```

**Enhanced Deck Execution**:

```typescript
// infra/bft/tasks/deck.bft.ts (Enhanced)
export const bftDefinition: TaskDefinition = {
  description: "Execute AI deck files with context injection and validation",
  aiSafe: true,
  fn: async (args: Array<string>): Promise<number> => {
    const [deckName, ...contextArgs] = args;

    // Discover context parameters
    const parameters = ContextManager.discoverContextParameters(deckPath);

    // Parse context from command line args
    const context = parseContextArgs(contextArgs, parameters);

    // Validate context completeness
    const validation = ContextManager.validateContext(context, parameters);
    if (!validation.isValid) {
      return handleValidationErrors(validation);
    }

    // Execute deck with validated context
    return executeDeckWithContext(deckPath, context);
  },
};
```

## Integration with Agent Command System

### Seamless Agent Integration

The enhanced BFT system will integrate seamlessly with the existing agent
command generation:

1. **Enhanced command descriptions** from workflow definitions
2. **Context parameter documentation** automatically generated
3. **Safety constraint documentation** included in agent commands
4. **Workflow suggestions** provided in command descriptions

### Agent Command Generation Enhancement

```typescript
// infra/bft/tasks/agentify.bft.ts (Enhanced)
function generateCommandForTask(
  taskName: string,
  taskDef: EnhancedTaskDefinition,
): AgentCommand {
  const baseDescription = taskDef.description;

  // Add workflow context
  const workflows = findWorkflowsUsingCommand(taskName);
  const workflowContext = workflows.length > 0
    ? `\n\n## Common Workflows\n${
      workflows.map((w) => `- ${w.name}: ${w.description}`).join("\n")
    }`
    : "";

  // Add safety information
  const safetyInfo = taskDef.safetyConstraints
    ? `\n\n## Safety Constraints\n${
      formatSafetyConstraints(taskDef.safetyConstraints)
    }`
    : "";

  // Add context parameters if deck file
  const contextInfo = isDeckTask(taskName)
    ? `\n\n## Context Parameters\n${formatContextParameters(taskName)}`
    : "";

  const content =
    `${baseDescription}${workflowContext}${safetyInfo}${contextInfo}

Execute bft ${taskName} command`;

  return {
    name: `bft-${taskName}`,
    description: baseDescription,
    content,
    aiSafe: isTaskAiSafe(taskDef),
  };
}
```

## Migration Strategy

### Phase 1: Core Infrastructure (Week 1)

1. Implement `ai.bft.ts` command
2. Set up enhanced safety validation framework
3. Create workflow definition system
4. Update existing agent command generation

### Phase 2: Workflow Implementation (Week 2)

1. Define common workflows (CI, development, deployment)
2. Implement workflow execution engine
3. Add error handling and recovery mechanisms
4. Update agent commands with workflow context

### Phase 3: Context Management (Week 3)

1. Build context discovery system
2. Implement parameter validation
3. Enhance deck execution with context injection
4. Update agent commands with parameter documentation

### Phase 4: Integration and Testing (Week 4)

1. Full integration testing with existing BFT commands
2. Agent command generation validation
3. Safety system comprehensive testing
4. Documentation updates

## Success Metrics

### Technical Metrics

- **Command coverage**: All BFT commands have proper AI safety classification
- **Workflow adoption**: Common development workflows are automated
- **Safety effectiveness**: Zero unsafe operations executed by AI agents
- **Context accuracy**: 100% parameter validation for deck files

### Developer Experience Metrics

- **Command discoverability**: Developers can easily find appropriate commands
- **Workflow efficiency**: Multi-step workflows complete without manual
  intervention
- **Error recovery**: Failed workflows provide clear next steps
- **Documentation quality**: All commands have comprehensive usage examples

## Dependencies and Constraints

### Technical Dependencies

- Existing BFT framework and task system
- Current agent command generation (`agentify.bft.ts`)
- Safety validation hooks in place
- Deck execution system for `.bft.deck.md` files

### Integration Constraints

- Must maintain backward compatibility with existing BFT commands
- Cannot break current agent command system
- Must work with existing Sapling SCM integration
- Performance impact must be minimal

## Risk Mitigation

### Backward Compatibility

- All existing BFT commands continue to work unchanged
- Agent command format remains compatible with Claude Code
- Existing deck files continue to execute properly

### Safety and Security

- Enhanced safety validation provides additional protection layers
- Workflow execution includes proper timeout and resource management
- Context parameter validation prevents injection attacks

### Performance Considerations

- Workflow orchestration adds minimal overhead
- Context discovery cached for repeated executions
- Safety validation optimized for speed

This enhancement plan builds on the solid BFT infrastructure foundation while
adding sophisticated AI integration capabilities that maintain safety and
reliability standards.
