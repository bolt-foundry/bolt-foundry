# BFT Codebot Container Implementation

**Date**: 2025-07-23  
**Author**: AI Assistant  
**Status**: Draft  

## Overview

Implementation of `bft codebot` command that creates isolated containers for running Claude Code instances in parallel without file conflicts.

## Problem Statement

Multiple Claude Code instances running on the same machine can conflict when modifying the same files, leading to confusion or broken code. We need isolated environments where each Claude Code session operates on its own copy of the codebase.

## Solution Architecture

### Core Concept
- `bft codebot` spins up a container with a fresh copy of the current codebase
- Each container runs its own Claude Code instance in isolation  
- Uses sapling within the container to commit and push changes to GitHub
- Automatic cleanup with optional `--keep` flag for debugging

### Technology Choice: macOS 26 Container Command

**Decision**: Use Apple's new native container command for initial prototype

**Rationale**:
- Better resource efficiency and native macOS integration
- Enhanced security with VM-level isolation per container
- Prototype can validate concept before broader deployment
- Author can be guinea pig on macOS 26 beta before stable release

**Tradeoffs**:
- ✅ Native integration, better performance
- ✅ Enhanced security model
- ❌ Limited to macOS 26+ (beta only)
- ❌ Less proven ecosystem than Docker

## Implementation Plan

### Phase 1: Basic Container Setup
1. **Container Image Creation**
   - Base image with Deno, sapling, and Claude Code CLI
   - Include necessary development tools and dependencies
   - Optimize for fast startup and minimal resource usage

2. **Codebase Copying Strategy** 
   - Copy current working directory state into container
   - Preserve file permissions and directory structure
   - Handle .gitignore/.saplingignore patterns appropriately

3. **BFT Integration**
   - Add `bft codebot` command to existing BFT task system
   - Integrate with current `.bft.ts` and task deck infrastructure
   - Follow existing BFT patterns and conventions

### Phase 2: Claude Code Integration
1. **Container Orchestration**
   - Launch container with copied codebase
   - Start Claude Code CLI within container environment
   - Pass through terminal I/O for interactive session

2. **Volume Management**
   - Mount necessary directories for sapling authentication
   - Handle SSH keys and git/sapling credentials securely
   - Ensure proper file ownership and permissions

### Phase 3: Version Control Integration
1. **Sapling Setup**
   - Initialize sapling workspace within container
   - Configure remote repositories and authentication
   - Handle branch creation and management

2. **Change Management**
   - Enable Claude Code to commit changes within container
   - Support pushing changes to GitHub via sapling
   - Maintain commit attribution and metadata

### Phase 4: Cleanup and Management
1. **Lifecycle Management**
   - Automatic container cleanup on completion (default)
   - `--keep` flag to preserve containers for debugging
   - Resource monitoring and cleanup policies

2. **Error Handling**
   - Graceful handling of container failures
   - Proper cleanup on interruption or errors
   - Logging and debugging capabilities

## Command Interface

### Basic Usage
```bash
bft codebot
```
- Creates isolated container with current codebase
- Launches Claude Code CLI interactively
- Automatically cleans up container on exit

### Advanced Options
```bash
bft codebot --keep          # Preserve container after completion
bft codebot --help          # Show usage information
```

### Future Considerations
```bash
bft codebot --name <name>   # Named containers for reference
bft codebot --from <ref>    # Start from specific commit/branch
bft codebot --docker        # Fallback to Docker if available
```

## Technical Requirements

### Prerequisites
- macOS 26 "Tahoe" beta or later
- Apple's container command installed and configured
- Sapling SCM configured for the repository
- Claude Code CLI available in PATH

### Dependencies
- Existing BFT task runner infrastructure
- Container base image with required development tools
- Proper authentication setup for GitHub/sapling integration

### Performance Considerations
- Fast container startup (target <10 seconds)
- Minimal resource overhead per container
- I/O optimization for codebase copying

## Security Considerations

- **Credential Management**: Secure handling of Git/Sapling credentials within containers
- **File Permissions**: Proper permission mapping between host and container
- **Network Access**: Controlled network access for GitHub integration
- **Resource Limits**: Prevent resource exhaustion from multiple containers

## Testing Strategy

### Unit Tests
- Container creation and teardown
- Codebase copying functionality
- BFT integration points

### Integration Tests  
- End-to-end workflow validation
- Sapling integration testing
- Multiple container scenarios

### Manual Testing
- Real-world usage scenarios
- Performance and resource monitoring
- Error condition handling

## Rollout Plan

### Phase 1: Author-Only Prototype (Current)
- Build and test on macOS 26 beta
- Validate core functionality and user experience
- Iterate on implementation based on usage

### Phase 2: Stable Release Preparation
- Wait for macOS 26 stable release
- Add Docker fallback for broader compatibility
- Documentation and onboarding materials

### Phase 3: Team Rollout
- Deploy to team members with updated macOS
- Collect feedback and usage patterns
- Optimize based on real-world usage

## Success Metrics

- **Functionality**: Successful isolation of Claude Code instances
- **Performance**: Container startup time <10 seconds
- **Reliability**: <1% failure rate in container operations
- **Usability**: Intuitive command interface requiring minimal configuration

## Open Questions

1. **Codebase State**: Should containers start from current working directory state or clean checkout?
   - **Decision Needed**: Determine default behavior and potential flag options

2. **Container Networking**: How should multiple containers communicate if needed?
   - **Future Consideration**: May not be needed for initial implementation

3. **Resource Limits**: What limits should be placed on container resource usage?
   - **Implementation Detail**: Monitor and adjust based on usage patterns

## Files to Modify/Create

### New Files
- `infra/bft/tasks/codebot.ts` - Main implementation
- `infra/bft/tasks/codebot.bft.deck.md` - Task documentation
- Container configuration files (Dockerfile equivalent for Apple containers)

### Modified Files
- Update BFT help system to include codebot command
- Integration with existing task loading infrastructure

## Timeline

- **Week 1**: Basic container setup and codebase copying
- **Week 2**: Claude Code integration and interactive session
- **Week 3**: Sapling integration and change management  
- **Week 4**: Cleanup, testing, and documentation

**Target Completion**: 4 weeks for initial working prototypec