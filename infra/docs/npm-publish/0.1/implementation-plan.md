# NPM Publishing Implementation Plan - Version 0.1

**Version:** 0.1 **Date:** 2023-11-15

## Version Summary

Establish the foundation for publishing our Deno library to npm, focusing on
creating a build pipeline that transforms Deno code into Node.js compatible
packages with full TypeScript type definitions.

## Technical Goals

- Set up a dnt-based build pipeline to transform Deno code to Node.js
- Configure package.json generation with appropriate metadata
- Implement type definition generation for TypeScript users
- Create basic test suite to verify Node.js compatibility
- Document the initial publishing process

## Components and Implementation

### 1. Build Pipeline Configuration

**Description**: Implement the core build system using dnt (Deno to Node
Transform) to convert our Deno code to Node-compatible packages.

**Technical Approach**:

- Configure dnt to process our library source code
- Set up appropriate entry points and output directories
- Configure TypeScript compilation settings for optimal compatibility

**Implementation Steps**:

```typescript
// infra/npm-build/build.ts
import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

async function buildPackage() {
  await emptyDir("./npm");

  await build({
    entryPoints: ["./packages/bolt-foundry/bolt-foundry.ts"],
    outDir: "./npm",
    shims: {
      deno: true,
      undici: true,
    },
    package: {
      name: "@bolt-foundry/bolt-foundry",
      version: "0.1.0",
      description: "Bolt Foundry library for tracking OpenAI API interactions",
      license: "MIT",
      repository: {
        type: "git",
        url: "git+https://github.com/boltfoundry/bolt-foundry.git",
      },
      bugs: {
        url: "https://github.com/boltfoundry/bolt-foundry/issues",
      },
    },
    typeCheck: true,
    test: true,
  });
}

buildPackage();
```

### 2. Package.json Configuration

**Description**: Configure the package.json generation to include all necessary
metadata, dependencies, and scripts for npm users.

**Technical Approach**:

- Define appropriate package metadata (name, version, description)
- Configure package dependencies and peer dependencies
- Set up npm scripts for common operations
- Include TypeScript configuration

**Implementation Steps**:

```typescript
// Example package.json template structure
const packageJson = {
  name: "@bolt-foundry/bolt-foundry",
  version: "0.1.0",
  description: "Bolt Foundry library for tracking OpenAI API interactions",
  main: "./esm/bolt-foundry.js",
  module: "./esm/bolt-foundry.js",
  types: "./esm/bolt-foundry.d.ts",
  scripts: {
    "test": "jest",
  },
  dependencies: {
    // Core dependencies will be added by dnt
  },
  peerDependencies: {
    "openai": "^4.0.0",
  },
  devDependencies: {
    // Dev dependencies will be added by dnt
  },
  keywords: [
    "openai",
    "ai",
    "llm",
    "analytics",
  ],
  author: "Bolt Foundry",
  license: "MIT",
};
```

### 3. Test Suite Configuration

**Description**: Implement tests to verify Node.js compatibility of the
transformed code.

**Technical Approach**:

- Create Node.js specific tests using Jest
- Test integration with popular Node frameworks
- Verify type definitions work correctly
- Test with different versions of OpenAI SDK

**Implementation Steps**:

```typescript
// Example test file structure to be transformed by dnt
// packages/bolt-foundry/__tests__/node-compatibility.test.ts

import { connectToOpenAi } from "../bolt-foundry.ts";

describe("Node.js Compatibility", () => {
  it("should correctly intercept fetch calls", () => {
    const wrappedFetch = connectToOpenAi("test-api-key");
    // Test implementation
  });

  it("should add appropriate headers to OpenAI API calls", () => {
    // Test implementation
  });

  it("should not modify non-OpenAI API calls", () => {
    // Test implementation
  });
});
```

### 4. Publishing Workflow

**Description**: Create a workflow for publishing the package to npm registry.

**Technical Approach**:

- Script the build and publish process
- Implement version management
- Configure npm authentication

**Implementation Steps**:

```typescript
// infra/npm-build/publish.ts
import { build } from "./build.ts";
import { exec } from "node:child_process";

async function publishPackage() {
  // 1. Build the package
  await build();

  // 2. Navigate to npm directory
  Deno.chdir("./npm");

  // 3. Publish to npm
  // In practice, this would use the npm CLI in a more controlled way
  console.log("Ready to publish. Run the following command:");
  console.log("cd npm && npm publish --access public");
}

publishPackage();
```

## Integration Points

- **Core Library**: Our Deno library code will be the source for transformation
- **Deno Tests**: Existing Deno tests will be adapted for Node.js
- **CI/CD Pipeline**: Will need to integrate the build and publish process
- **Documentation**: Will need to update docs to include npm usage examples

## Testing Strategy

### Unit Tests

- Test the core functionality in a Node.js environment
- Verify TypeScript types are correctly generated
- Ensure all exports are properly exposed

### Integration Tests

- Test with sample Next.js application
- Verify compatibility with OpenAI SDK versions
- Validate all features work correctly when imported as npm package

### Manual Verification

- Install the package in a new project to verify installation process
- Check npm package structure and metadata
- Verify documentation links and references

## Risk Assessment

| Risk                                        | Severity | Likelihood | Mitigation                                     |
| ------------------------------------------- | -------- | ---------- | ---------------------------------------------- |
| Deno-specific APIs without Node equivalents | High     | Medium     | Identify and rewrite using cross-platform APIs |
| Type definition incompatibilities           | Medium   | Low        | Thoroughly test TypeScript integration         |
| Package size optimization                   | Medium   | Medium     | Analyze and optimize bundle size               |
| Dependency management complexities          | Medium   | High       | Clear documentation of peer dependencies       |

## Next Steps for Version 0.2

- Automated version bumping and changelog generation
- More comprehensive transformation of platform-specific code
- Optimized bundle size and tree-shaking support
- Integration with PostHog for analytics
- Support for CommonJS in addition to ESM
