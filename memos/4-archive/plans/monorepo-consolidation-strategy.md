# Implementation Memo: Monorepo Consolidation

**Date**: 2025-01-17\
**Status**: Implementation Plan\
**Priority**: High\
**Objective**: Consolidate monorepo around `boltfoundry-com` and `aibff`
priority apps

## Problem Statement

The Bolt Foundry monorepo has grown organically to include 11 apps and 7
packages with significant duplication, circular dependencies, and deprecated
functionality. This complexity hinders development velocity and maintenance. We
need to consolidate around two priority applications while maintaining essential
functionality.

## Current State Analysis

### Apps Directory (11 apps, ~51,000 lines)

**Priority Apps (Keep & Enhance):**

- `aibff` (10,597 lines) - AI evaluation CLI tool - **PRIMARY FOCUS**
- `boltfoundry-com` (2,223 lines) - Marketing website - **SECONDARY FOCUS**
- `bfDb` (17,412 lines) - Core database layer - **ESSENTIAL INFRASTRUCTURE**
- `bfDs` (10,119 lines) - Design system - **SUPPORTING**

**Candidates for Removal/Consolidation:**

- `boltFoundry` (11,996 lines) - **DEPRECATED** - Main web app being replaced by
  boltfoundry-com
- `web` (641 lines) - **DELETE** - Web framework wrapper
- `cfDs` (8,325 lines) - **DELETE** - Duplicate design system
- `collector` (1,486 lines) - **DELETE** - Analytics collection
- `contacts` (7,234 lines) - **ARCHIVE** - Experimental CRM
- `denomcp` (842 lines) - **DELETE** - MCP server
- `internalbf` (225 lines) - **INTEGRATE** - Internal tools platform (move to
  boltfoundry-com)

### Packages Directory (7 packages, ~4,500 lines)

**Essential Packages (Keep):**

- `logger` (247 lines) - Core logging infrastructure
- `get-configuration-var` (77 lines) - Configuration management
- `bolt-foundry` (210 lines) - Core client library
- `team-status-analyzer` (2,242 lines) - GitHub analytics
- `team-status-generator` (1,218 lines) - Status reporting

**Consolidation Candidates:**

- `cli-ui` (88 lines) - **INLINE** - Only used by aibff
- `packages/aibff` (2 files) - **REMOVE** - Redundant NPM distribution

## Implementation Plan

### Phase 1: Critical Cleanup

#### 1.1 Remove Deprecated boltFoundry App

**Risk**: High (many dependencies)

**Implementation Steps:**

1. **Migrate essential functionality to boltfoundry-com**
   - Move critical routes and components
   - Ensure marketing site has all needed features
   - Test functionality migration

2. **Move shared components to bfDs design system**
   - Audit boltFoundry components for reusability
   - Extract shared UI components to bfDs
   - Update component imports across apps

3. **Extract router utilities to shared package**
   - Create `packages/router-utils` or add to existing package
   - Move routing logic out of boltFoundry
   - Update imports in dependent apps

4. **Remove @iso import mappings from deno.jsonc**
   - Remove Isograph-specific import aliases
   - Update all files using @iso imports
   - Test build process

5. **Update build pipeline to remove boltFoundry references**
   - Remove boltFoundry from iso.bft.ts
   - Update routesBuild.ts and appBuild.ts
   - Remove boltFoundry compilation steps

**Critical Blockers:**

- `apps/web` completely depends on boltFoundry routing
- `apps/cfDs` imports boltFoundry components (circular dependency)
- `packages/get-configuration-var` imports boltFoundry config keys
- Build system tightly coupled to boltFoundry Isograph integration

#### 1.2 Delete Web App Framework

**Risk**: Medium

**Implementation Steps:**

1. **Extract Handler type to lib/types.ts**
   - Move Handler type definition to shared location
   - Update all imports to use new location
   - Ensure type compatibility

2. **Identify web app dependencies**
   - Audit what functionality apps/collector depends on
   - Ensure boltfoundry-com can serve independently
   - Verify no critical routing depends on web framework

3. **Update apps/collector to use extracted Handler type**
   - Change import to use lib/types.ts
   - Test collector functionality without web app
   - Ensure collector can operate independently

4. **Remove web compilation from build pipeline**
   - Remove web.tsx compilation from build.bft.ts
   - Update serve commands to not expect web build
   - Remove web-specific build artifacts

5. **Update development tooling**
   - Update devTools.bff.ts references
   - Remove web-specific development commands
   - Update E2E test setup to not use web app

6. **Delete web app directory**
   - Remove apps/web directory completely
   - Update import maps in deno.jsonc
   - Remove web app references from documentation

### Phase 2: Package Consolidation

#### 2.1 Inline cli-ui Package

**Risk**: Low

**Implementation Steps:**

1. **Move cli-ui files into apps/aibff/lib/**
   - Copy cli-ui source files to aibff
   - Maintain file structure within aibff

2. **Update imports in aibff to use local files**
   - Change package imports to relative imports
   - Test CLI functionality

3. **Remove packages/cli-ui directory**
   - Delete package directory
   - Update import maps in deno.jsonc

#### 2.2 Remove Redundant NPM Package

**Risk**: Low

**Implementation Steps:**

1. **Remove packages/aibff/ directory**
   - Delete NPM distribution package
   - Confirm no active usage

2. **Update documentation to reference apps/aibff only**
   - Update README files
   - Update installation instructions

#### 2.3 Consolidate Team Status Packages

**Risk**: Medium

**Implementation Steps:**

1. **Merge team-status-analyzer and team-status-generator into single package**
   - Combine into packages/team-status
   - Maintain existing API compatibility
   - Update imports across codebase

2. **Fix anti-pattern where team-status imports from apps/aibff**
   - Extract renderDeck to shared location
   - Remove package → app dependency
   - Ensure proper separation of concerns

### Phase 3: Design System Cleanup

#### 3.1 Delete cfDs Design System

**Risk**: High (UI components)

**Implementation Steps:**

1. **Audit cfDs usage across codebase**
   - Identify all apps importing from cfDs
   - Determine critical components that need alternatives
   - Plan replacement strategy with bfDs equivalents

2. **Replace cfDs components with bfDs equivalents**
   - Update component imports to use bfDs
   - Implement missing components in bfDs if needed
   - Test UI functionality across affected apps

3. **Remove all cfDs imports**
   - Replace cfDs imports throughout codebase
   - Test UI functionality across apps
   - Fix any styling issues

4. **Delete cfDs directory**
   - Remove cfDs app directory completely
   - Update import maps in deno.jsonc
   - Update build configuration
   - Remove cfDs references from documentation

### Phase 4: Architecture Cleanup

#### 4.1 Delete Experimental Apps

**Risk**: Low

**Implementation Steps:**

1. **Delete collector app**
   - Remove apps/collector directory
   - Remove collector references from build system
   - Update any apps that might import from collector
   - Remove collector from import maps

2. **Delete denomcp app**
   - Remove apps/denomcp directory
   - Remove denomcp references from build system
   - Update documentation
   - Remove denomcp from import maps

3. **Archive contacts app (experimental CRM)**
   - Move to archive directory
   - Update documentation
   - Remove from build process

4. **Integrate internalbf into boltfoundry-com**
   - Move internal tools functionality to boltfoundry-com
   - Use boltfoundry-com infrastructure for Discord bot and tools
   - Remove apps/internalbf directory after integration
   - Update any references to internalbf

#### 4.2 Optimize for Priority Apps

**Risk**: Medium

**Implementation Steps:**

1. **Ensure boltfoundry-com has all needed dependencies**
   - Verify all required packages are included
   - Test full functionality
   - Optimize build process

2. **Optimize aibff build and development experience**
   - Streamline CLI build process
   - Improve development workflow
   - Test all CLI commands

3. **Streamline bfDb to support both priority apps efficiently**
   - Remove unused database models
   - Optimize GraphQL schema
   - Test database connectivity

4. **Update workspace configuration**
   - Update deno.jsonc workspace settings
   - Remove unused import mappings
   - Optimize build configuration

## Expected Outcomes

### Quantitative Benefits

- **Codebase reduction**: ~25,000 lines (49% reduction)
- **App count reduction**: 11 → 6 apps
- **Package count reduction**: 7 → 5 packages
- **Build time improvement**: Estimated 30-40% faster builds
- **Test suite reduction**: Fewer integration points to test

### Qualitative Benefits

- **Simplified mental model**: Two clear priority apps vs. 11 unclear apps
- **Reduced maintenance burden**: Fewer packages to maintain and update
- **Clearer architecture**: Explicit dependencies, no circular imports
- **Better developer experience**: Faster builds, clearer structure
- **Easier onboarding**: New developers can focus on 2 priority apps

## Risk Assessment

### High Risk Areas

- **boltFoundry removal**: Many dependencies, complex routing
- **Design system consolidation**: UI components affect user experience
- **Build system changes**: Could break deployment pipeline

### Mitigation Strategies

- **Incremental approach**: Make changes in small, testable steps
- **Comprehensive testing**: Test each change thoroughly before proceeding
- **Backup branches**: Maintain ability to rollback changes
- **Documentation**: Update all documentation as changes are made

## Implementation Approach

**Recommended Strategy**: Incremental implementation with comprehensive testing
at each step

**Phase Sequencing**:

1. Critical cleanup (boltFoundry, web app removal)
2. Package consolidation (cli-ui, team-status)
3. Design system cleanup (delete cfDs)
4. Architecture cleanup and optimization

**Key Principles**:

- Make changes in small, testable increments
- Maintain functionality of priority apps throughout
- Test thoroughly before proceeding to next step
- Document changes for future reference

## Success Metrics

- [ ] Build time reduced by 30%+
- [ ] Codebase reduced by 20,000+ lines
- [ ] App count reduced to 6 or fewer
- [ ] No circular dependencies between apps/packages
- [ ] Both priority apps (boltfoundry-com, aibff) fully functional
- [ ] All tests passing after consolidation
- [ ] Documentation updated to reflect new structure

## Decision Points

### Required Decisions Before Implementation:

1. **Confirm app priorities**: Validate that `boltfoundry-com` and `aibff` are
   the definitive priority apps
2. **Experimental app cleanup**: Confirm deletion of `collector` and `denomcp`
   apps, and integration of `internalbf` into boltfoundry-com
3. **Team-status package**: Confirm consolidation approach for
   team-status-analyzer and team-status-generator
4. **Design system strategy**: Approve cfDs deletion approach and bfDs
   alternatives

### Success Criteria:

- [ ] Both priority apps (`boltfoundry-com`, `aibff`) fully functional
- [ ] Codebase reduced by 20,000+ lines
- [ ] App count reduced to 6 or fewer
- [ ] No circular dependencies between apps/packages
- [ ] Build time improvement measurable
- [ ] All tests passing after consolidation
- [ ] Documentation updated to reflect new structure

## Next Steps

1. **Approve implementation plan**: Review and approve this consolidation
   strategy
2. **Begin Phase 1**: Start with critical cleanup of deprecated boltFoundry app
3. **Establish testing protocol**: Define comprehensive testing approach for
   each phase
4. **Create backup strategy**: Establish branch strategy for rollback capability
5. **Update team communication**: Notify team of consolidation timeline and
   impact

## Conclusion

This implementation plan provides a structured approach to consolidating the
Bolt Foundry monorepo around the two priority applications. The strategy
eliminates significant duplication and circular dependencies while maintaining
essential functionality. Success depends on incremental execution with
comprehensive testing at each phase.
