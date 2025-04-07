# PackageBuild: Version 0.1 Implementation Plan

## Version Goals

This initial version (0.1) establishes the foundation for the PackageBuild tool,
focusing on reliably converting Deno modules to npm-compatible packages. Our
primary goal is to create a streamlined build process that requires minimal
configuration while producing high-quality package output.

## Components and Implementation Details

### 1. JSONC Parser Integration

The central component is properly parsing deno.jsonc files with comment support.

```typescript
import { parse } from "@std/jsonc";

async function loadDenoJsonc(
  packageDir: string,
): Promise<DenoJsoncConfig | null> {
  const denoJsoncPath = join(packageDir, "deno.jsonc");

  try {
    const content = await Deno.readTextFile(denoJsoncPath);
    return parse(content) as DenoJsoncConfig;
  } catch (error) {
    logger.info(
      `No deno.jsonc found for ${packageDir} or error parsing: ${error.message}`,
    );
    return null;
  }
}
```

#### Implementation Details

- **JSONC Parsing**: Use @std/jsonc to properly handle comments in config files
- **Error Resilience**: Gracefully handle missing files and parsing errors
- **Type Safety**: Add proper typing for configuration objects
- **Validation**: Implement validation for required configuration fields

### 2. Dependency Management

Transform Deno-style imports to npm-compatible dependencies with consistent
versioning.

#### Implementation Details

- **Import Format Detection**: Identify JSR, npm, and file imports
- **Import Transformation**: Convert paths and formats to npm standards
- **Version Management**: Handle semantic versioning with proper ranges
- **Dependency Validation**: Ensure all required dependencies are included

### 3. Build Process

Create a streamlined build process with consistent output structure.

#### Implementation Details

- **Output Directory Structure**: Create standardized dist/ directories
- **TypeScript Transpilation**: Use esbuild for high-performance transpilation
- **Metadata Generation**: Create package.json, README, and other required files
- **Clean/Build Mode**: Support rebuilding with directory cleaning

### 4. Package Configuration

Generate proper package.json with all required fields.

#### Implementation Details

- **Basic Metadata**: Handle name, version, description fields
- **Entry Points**: Configure main, module, and types fields correctly
- **Scripts Section**: Add helpful npm scripts for common operations
- **Repository Information**: Include correct repository metadata

## Integration Pattern

Developers will use PackageBuild either through the BFF CLI or directly:

```bash
# Using BFF
bff build packages

# Direct execution
deno run -A infra/packageBuild/packageBuild.ts
```

## Testing Strategy for v0.1

### Unit Tests

- **Test JSONC parsing**: Verify handling of comments and complex files
- **Test dependency mapping**: Ensure proper transformation of import formats
- **Test output structure**: Validate consistent directory and file structure

### Integration Tests

- **Test in example project**: Verify built packages work in Next.js app
- **Test different import formats**: Validate handling of various dependency
  types

## Technical Challenges and Solutions

### Challenge: Handling JSR Package Format

**Solution**: Implement standardized mapping from JSR package paths to
npm-compatible formats.

### Challenge: Type Definitions

**Solution**: Ensure TypeScript declaration files are properly generated and
included.

### Challenge: Version Management

**Solution**: Implement consistent approach to version ranges and compatibility.

## Version 0.1 Deliverables

1. **Core Functionality**:
   - Reliable JSONC parsing
   - Dependency transformation
   - Package.json generation
   - Build process implementation

2. **Documentation**:
   - Usage guide
   - Configuration options
   - Troubleshooting information

3. **Example Implementation**:
   - Sample package building demonstration

## Future Considerations (for v0.2+)

- Support for different module formats (ESM, CJS)
- Enhanced source map generation
- Documentation generation
- Test coverage reporting
- Automated publishing workflow

## Success Criteria for v0.1

Version 0.1 will be considered successful when:

1. Packages can be built from deno.jsonc with proper transformation
2. Dependencies are correctly mapped to npm formats
3. TypeScript declarations are properly included
4. Built packages can be successfully imported in a Next.js application

This implementation plan provides the roadmap for building Version 0.1 of
PackageBuild, establishing the foundation for more advanced features in
subsequent versions.
