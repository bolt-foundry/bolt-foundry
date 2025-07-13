# AI Agent Enhancement Implementation Plan

_Created: 2025-07-13_

## Overview

Based on analysis of the recently added AI agent infrastructure (in
`.agents/commands/bft/`), this plan outlines enhancements to improve the AI
agent integration system for the Bolt Foundry development workflow.

## Current State Analysis

### ✅ What's Working Well

- **27 generated AI agent commands** covering full development lifecycle
- **Automated command generation** via `agentify.bft.ts`
- **Safety-first design** with AI-safe command validation
- **Sophisticated AI decks** for complex workflows (commit, code-review,
  team-analysis)
- **Single source of truth** architecture in `.agents/commands/bft/`

### 🔄 Areas for Enhancement

- **Command documentation quality** - Many commands have minimal descriptions
- **Context parameter discovery** - Limited automatic extraction of parameters
- **Command composition guidance** - No workflow documentation
- **Dynamic safety validation** - Static safety flags, limited runtime checks

## Implementation Phases

### Phase 1: Enhanced Command Documentation (Week 1)

**Goal**: Improve the quality and usefulness of generated command descriptions.

**Tasks**:

1. **Extend `agentify.bft.ts` generation logic**:
   ```typescript
   function generateCommandForTask(
     taskName: string,
     taskDef: TaskDefinition,
   ): AgentCommand {
     const baseDescription = taskDef.description;

     // Add usage examples and common patterns
     const usageExamples = generateUsageExamples(taskName);
     const relatedCommands = findRelatedCommands(taskName);

     const content = `${baseDescription}

   ## Common Usage
   ${usageExamples}

   ## Related Commands
   ${relatedCommands}

   ## Examples
   ${generateSpecificExamples(taskName)}`;

     return { name: `bft-${taskName}`, description: baseDescription, content };
   }
   ```

2. **Create command relationship mapping**:
   - Map build pipeline dependencies (`genGqlTypes` → `iso` → `build`)
   - Identify test-related workflows (`lint` → `test` → `e2e`)
   - Document development environment setup sequences

3. **Add context-aware examples**:
   - Include specific file paths and command combinations
   - Reference monorepo structure and common patterns
   - Provide troubleshooting guidance

**Deliverables**:

- Enhanced command generation with rich documentation
- Command relationship graph
- Context-aware usage examples

### Phase 2: Workflow Integration System (Week 2)

**Goal**: Provide workflow guidance and command composition patterns.

**Tasks**:

1. **Create workflow definitions**:
   ```typescript
   interface WorkflowDefinition {
     name: string;
     description: string;
     steps: Array<WorkflowStep>;
   }

   interface WorkflowStep {
     command: string;
     description: string;
     preconditions?: Array<string>;
     errorRecovery?: Array<string>;
   }
   ```

2. **Implement common workflow patterns**:
   - **Full CI pipeline**: `bft build` → `bft test` → `bft e2e --build`
   - **Development workflow**: `bft devTools` → edit → `bft lint` → commit
   - **Release workflow**: `bft ci` → `bft compile` → deployment
   - **Debugging workflow**: `bft check` → `bft findDeadFiles` → analysis

3. **Add workflow-aware command generation**:
   - Include workflow context in command descriptions
   - Suggest next steps based on current command
   - Provide conditional logic for error scenarios

**Deliverables**:

- Workflow definition system
- Pre-defined common workflows
- Workflow-aware command documentation

### Phase 3: Advanced Context Management (Week 3)

**Goal**: Implement sophisticated parameter discovery and context injection.

**Tasks**:

1. **Enhanced context parameter detection**:
   ```typescript
   interface ContextParameter {
     name: string;
     type: "string" | "boolean" | "array" | "object";
     description: string;
     defaultValue?: any;
     validation?: (value: any) => boolean;
     assistantQuestion?: string;
   }
   ```

2. **Automatic parameter extraction**:
   - Parse deck files for `{{variable}}` patterns
   - Extract schemas from associated TOML files
   - Generate parameter documentation automatically
   - Validate parameter usage across decks

3. **Context composition system**:
   - Allow decks to reference shared context definitions
   - Implement context inheritance for deck families
   - Create context validation and type checking

**Deliverables**:

- Advanced context parameter system
- Automatic parameter extraction
- Context validation framework

### Phase 4: Dynamic Safety Validation (Week 4)

**Goal**: Implement runtime safety checking with granular controls.

**Tasks**:

1. **Enhanced safety constraint system**:
   ```typescript
   interface SafetyConstraints {
     allowedFiles?: Array<string>;
     forbiddenFiles?: Array<string>;
     networkAccess?: boolean;
     environmentVariables?: Array<string>;
     maxExecutionTime?: number;
   }
   ```

2. **Runtime safety validation**:
   - File access permission checking
   - Network operation monitoring
   - Environment variable access control
   - Command execution time limits

3. **Safety policy configuration**:
   - Per-command safety policies
   - User-configurable safety levels
   - Audit logging for safety violations

**Deliverables**:

- Dynamic safety validation system
- Granular safety controls
- Safety policy configuration

## Advanced AI Workflow Implementations

### New Sophisticated AI Decks

#### 1. Code Architecture Assistant

**Purpose**: Help developers understand and navigate complex codebases.

**Structure**:

- **Discovery workflow**: Strategic questioning about codebase goals
- **Analysis types**: Dependency analysis, pattern recognition, technical debt
- **Output formats**: Architecture diagrams, improvement recommendations

#### 2. Technical Debt Prioritization Agent

**Purpose**: Systematically analyze and prioritize technical debt.

**Framework**:

- **Assessment criteria**: Severity, scope, complexity, risk, business impact
- **Analysis workflow**: Scanning, assessment, dependency mapping,
  prioritization
- **Output format**: Priority matrix with remediation plans

#### 3. Performance Investigation Assistant

**Purpose**: Systematically diagnose and resolve performance issues.

**Methodology**:

- **Investigation steps**: Problem definition, baseline establishment, profiling
- **Analysis types**: CPU profiling, memory analysis, I/O patterns
- **Tool integration**: APM systems, benchmark generation

#### 4. Security Review Orchestrator

**Purpose**: Conduct comprehensive security reviews.

**Framework**:

- **Security areas**: Authentication, authorization, data protection, input
  validation
- **Review process**: Threat modeling, code analysis, configuration review
- **Output requirements**: Vulnerability assessment, remediation recommendations

### Implementation Strategy for Advanced Decks

**Phase 1**: Create base deck templates with standard card structures **Phase
2**: Implement context management system for complex parameters **Phase 3**:
Develop output standardization for structured responses **Phase 4**: Build
feedback collection system for iterative improvement

## Success Metrics

### Phase 1-2 Metrics

- **Command usage tracking**: Monitor which commands are used most frequently
- **Documentation completeness**: Ensure all commands have comprehensive
  documentation
- **Workflow adoption**: Track usage of workflow-based command sequences

### Phase 3-4 Metrics

- **Context accuracy**: Measure successful parameter extraction and validation
- **Safety effectiveness**: Track prevented unsafe operations and false
  positives
- **User satisfaction**: Collect feedback on AI agent usefulness and accuracy

## Integration with Existing Systems

### BFT Toolchain Integration

- Leverage existing `agentify.bft.ts` command for generation
- Use established `.bft.ts` and `.bft.deck.md` patterns
- Maintain compatibility with current safety validation system

### Claude Code Integration

- Maintain symlink compatibility for `.claude/commands/bft/`
- Ensure generated commands work seamlessly with Claude Code CLI
- Support existing CLAUDE.md configuration patterns

### Development Workflow Integration

- Integrate with existing `bft ci`, `bft build`, `bft test` commands
- Support current Sapling SCM workflow via `bft sl` commands
- Maintain compatibility with development environment setup

## Dependencies and Prerequisites

### Technical Dependencies

- Existing BFT toolchain functionality
- Current AI agent command generation system
- Sapling SCM integration via `bft sl` commands

### Resource Requirements

- **Development time**: 4 weeks for core implementation
- **Testing infrastructure**: Integration with existing test suite
- **Documentation updates**: Update AGENTS.md and related documentation

## Risk Mitigation

### Backward Compatibility

- Maintain existing command interfaces
- Preserve current AI agent command functionality
- Ensure smooth migration path for users

### Safety and Security

- Extensive testing of safety validation system
- Gradual rollout of new safety features
- Clear documentation of safety boundaries

### Performance Impact

- Minimize overhead of enhanced command generation
- Optimize context parameter extraction
- Monitor impact on development workflow speed

## Next Steps

1. **Create detailed technical specifications** for each phase
2. **Set up development environment** for AI agent enhancement work
3. **Implement Phase 1 changes** starting with command documentation enhancement
4. **Establish testing framework** for validating AI agent improvements
5. **Plan integration testing** with existing BFT toolchain

This implementation plan builds on the solid foundation of the current AI agent
system while addressing identified gaps and adding sophisticated new
capabilities for enhanced developer productivity.
