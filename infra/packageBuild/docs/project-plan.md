# PackageBuild: Project Plan

## Problem Statement

Bolt Foundry needs a reliable, consistent way to package its Deno modules as
npm-compatible packages. Currently, the process is manual and error-prone,
leading to inconsistent package structures and dependency issues. Developers
need a streamlined build process that requires minimal configuration.

## User Goals

- Build npm-compatible packages from Deno modules with minimal configuration
- Ensure consistent package structure across all Bolt Foundry packages
- Support proper dependency resolution for both JSR and npm dependencies
- Generate proper TypeScript declarations for improved developer experience

## Current State vs. Desired State

**Current State**:

- Manual package building process with inconsistent results
- Dependency management requires hand-editing of package.json
- JSR and npm dependencies are handled inconsistently
- Type declarations may be missing or incomplete

**Desired State**:

- Automated build process with consistent, reliable output
- Intelligent dependency resolution from deno.jsonc to package.json
- Proper handling of all dependency types (JSR, npm, file)
- Complete type declarations for all packages

## User Personas

1. **Package Maintainer**
   - Needs to build and publish packages consistently
   - Wants minimal configuration overhead
   - Requires reliable versioning and dependency handling

2. **Package Consumer**
   - Needs reliable, well-structured packages
   - Wants proper TypeScript declarations for editor support
   - Requires consistent dependency resolution

## User Journeys

### Package Maintenance Journey

1. Developer writes Deno module with deno.jsonc configuration
2. They run the package build command
3. System validates package configuration
4. System builds the package with proper structure
5. Developer can test the package locally or publish it

### Package Consumer Journey

1. Developer installs Bolt Foundry package via npm
2. They import the package into their application
3. TypeScript provides proper type checking and autocomplete
4. Dependencies are correctly resolved without conflicts
5. Package functions as expected in their application

## Version Roadmap

### Version 0.1: Core Functionality

- Parse deno.jsonc files with proper comment handling
- Transform dependencies to npm-compatible format
- Generate consistent package.json structure
- Support basic build process for JS/TS modules

### Version 0.2: Advanced Features

- Generate comprehensive TypeScript declarations
- Support different module formats (ESM, CJS)
- Add source map generation for debugging
- Implement comprehensive validation rules

### Version 0.3: Integration & Workflow

- Add CI/CD integration
- Support automated publishing
- Implement versioning strategy
- Add package documentation generation

## Success Metrics

- **Build Success Rate**: Percentage of packages built without errors
- **Integration Success**: Successful use in example applications
- **Type Completeness**: Coverage of TypeScript declarations
- **Build Performance**: Time required to build packages

Remember: Failure counts as done. This plan prioritizes building a simple but
effective solution that can be improved through rapid iteration based on
real-world usage.
