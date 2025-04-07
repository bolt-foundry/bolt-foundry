# NPM Publishing Implementation Plan - Version 0.1

## Version Summary

Establish the foundation for publishing our Deno library to npm, focusing on
creating a build pipeline that transforms Deno code into Node.js compatible
packages with full TypeScript type definitions.

## Technical Goals

- Set up a dnt-based build pipeline to transform Deno code to Node.js
- Update existing package.json files with appropriate metadata
- Implement type definition generation for TypeScript users
- Create basic test suite to verify Node.js compatibility
- Document the initial publishing process

## Components and Implementation

### 1. Build Pipeline Configuration

**Description**: Implement the core build system using dnt (Deno to Node
Transform) to convert our Deno library source code.

**Technical Approach**:

- Configure dnt to process our library source code
- Set up appropriate entry points and output directories
- Configure TypeScript compilation settings for optimal compatibility
- Preserve and update existing package.json files rather than replacing them
  entirely
- Create an npm directory within each package for the transformed output

**Implementation Steps**:

1. Create a build script that accepts a package path as input
2. Create and empty the npm output directory for each package
3. Read the existing package.json to identify the main entry point
4. Configure dnt with appropriate compilation settings
5. Skip dnt's package.json creation to handle it manually
6. Copy the original package.json to the npm directory
7. Update the npm-specific fields while preserving the original content
8. Write the updated package.json back to the npm directory

### 2. Package.json Management

**Description**: Update existing package.json files with needed metadata while
preserving existing configuration.

**Technical Approach**:

- Read and preserve existing package.json content
- Enhance with npm-specific fields if not present
- Maintain dependency information
- Update typescript configuration

**Implementation Steps**:

1. Create utility functions for reading JSON files
2. Create utility functions for writing JSON files
3. Create a function to update package.json with new fields while preserving
   existing ones
4. Handle error cases for missing or malformed files
5. Log successful file operations

### 4. Publishing Workflow

**Description**: Create a workflow for publishing the package to npm registry.

**Technical Approach**:

- Script the build and publish process
- Implement version management
- Configure npm authentication
- Preserve existing package structures and entry points

**Implementation Steps**:

1. Create a publish script that optionally updates version
2. Build the package using the build script
3. Navigate to the npm directory
4. Provide instructions for publishing to npm

## Integration Points

- **Existing Package.json Files**: Will be read and updated rather than replaced
- **Core Library**: Our Deno library code will be the source for transformation

## Future Work

- **CI/CD Pipeline**: Will need to integrate the build and publish process
- **Documentation**: Will need to update docs to include npm usage examples
