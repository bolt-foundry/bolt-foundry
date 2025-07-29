# Unified BFT Commit with Demo Videos

**Date**: July 21, 2025\
**Author**: Claude Code\
**Status**: Planning

## Overview

Consolidate existing Sapling commit workflows (`bft sl commit` and `bft commit`
AI deck) into a unified `bft commit` command that integrates smart validation,
AI-powered message generation, and automatic demo video creation from E2E tests.

## Problem Statement

The Bolt Foundry commit workflow is currently fragmented across multiple
commands:

- **`bft sl commit`**: Handles smart validation, file staging, and PR submission
- **`bft commit` (AI deck)**: Provides AI-powered commit message generation
- **E2E test artifacts**: Valuable screenshots and videos are generated during
  testing but lost after execution

Additionally, while E2E tests produce valuable demo videos (stored in
`/tmp/screenshots/` and `/tmp/videos/`) that demonstrate application
functionality, these artifacts are not preserved or integrated into the code
review process.

A unified approach would provide:

1. **Single command workflow**: Consolidate all commit-related functionality
2. **Enhanced code review**: Preserve and share demo videos showing the impact
   of changes
3. **Intelligent automation**: LLM-driven selection of relevant demo tests based
   on changed files
4. **Cloud persistence**: Store demo videos in Hetzner Object Storage for
   long-term access

## Goals

### Primary Goals

- **Consolidate existing Sapling workflows**: Replace `bft sl commit` and
  existing `bft commit` (AI deck) with unified command
- **Enhance commit workflow**: Integrate smart validation, AI-powered message
  generation, and demo video creation
- **Demo video integration**: Automatically run relevant E2E tests with
  `[demo:*]` tags based on changed files
- **Cloud storage**: Upload generated videos/screenshots to Hetzner Object
  Storage
- **Enhanced commit messages**: Embed media URLs and maintain existing commit
  message conventions
- **Streamlined developer experience**: Single command for the complete commit
  workflow
- **Maintain safety**: Preserve existing AI safety and approval mechanisms

### Future Goals (Out of Scope for MVP)

- Before/after video comparisons
- Smart caching of previously generated videos
- Integration with PR descriptions

## Technical Design

### Architecture Overview

```
Code Changes → Smart Validation → AI Message Generation → Demo Test Selection → E2E Execution → Media Upload → Enhanced Commit Creation
```

### Consolidation of Existing Commands

The new `bft commit` will replace and integrate:

- **`bft sl commit`**: Smart validation pipeline, file staging, PR submission
- **`bft commit` (AI deck)**: AI-powered commit message generation
- **New demo functionality**: E2E test execution and media upload

### Component Breakdown

#### 1. BFT Commit Command (`/infra/bft/tasks/commit.bft.ts`)

**Command Interface:**

```bash
# Basic usage (inherits from existing bft sl commit)
bft commit [message] [files...]         # Enhanced commit with smart validation + demos
bft commit --skip-demos [message]       # Skip demo video generation
bft commit --skip-validation [message]  # Skip validation pipeline
bft commit --skip-submit [message]      # Don't submit PR automatically

# Demo-specific options
bft commit --filter="auth,checkout"     # Override demo filter selection  
bft commit --dry-run [message]          # Show validation + demos without executing

# AI message generation (inherits from existing bft commit deck)
bft commit                              # Generate commit message via AI
```

**Core Responsibilities:**

- **Legacy integration**: Preserve all functionality from `bft sl commit` and
  `bft commit` (AI deck)
- **Smart validation**: Run format, lint, test, build checks based on changed
  files
- **File staging**: Execute `sl addremove` to discover new/removed files
- **AI message generation**: Generate structured commit messages following Bolt
  Foundry conventions
- **Demo test selection**: Use LLM to select relevant `[demo:*]` tests based on
  changes
- **E2E execution**: Run selected demo tests and collect generated media
- **Media upload**: Upload videos/screenshots to Hetzner Object Storage
- **Enhanced commit creation**: Create commit with validation results, AI
  message, and media URLs
- **PR integration**: Maintain existing PR submission workflow

#### 2. Demo Test Selection Logic

**LLM-Based Mapping Strategy:**

- Analyze changed files using Sapling (`sl status`)
- Query available demo tests using `bft e2e --filter="demo:"`
- Use LLM to intelligently select relevant demo categories
- Run E2E tests using existing `bft e2e --filter="demo:{categories}"`
  infrastructure

**LLM Selection Process:**

```typescript
// Example LLM prompt for demo test selection
const prompt = `
Changed files in this commit:
${changedFiles.join("\n")}

Available demo test categories:
${availableDemos.join(", ")}

Based on the changed files, which demo test categories are most relevant 
for showing the impact of these changes? Select up to 3 categories.
Return as JSON array: ["category1", "category2"]
`;
```

**Test Naming Convention:**

```typescript
// E2E tests tagged for demo video generation
Deno.test("[demo:auth] User login flow", async () => { ... });
Deno.test("[demo:checkout] Complete purchase flow", async () => { ... });
Deno.test("[demo:dashboard] User dashboard navigation", async () => { ... });
```

#### 3. Media Management System

**Video/Screenshot Collection:**

- Leverage existing E2E infrastructure that outputs to `/tmp/videos/` and
  `/tmp/screenshots/`
- Collect generated media files after test execution
- Associate media with test names and timestamps

**Upload to Hetzner Object Storage:**

- Configure Hetzner bucket via environment variables
- Generate unique object keys:
  `commits/{commit-hash}/{timestamp}-{test-name}.mp4`
- Return publicly accessible URLs for embedding

#### 4. Commit Message Enhancement

**URL Embedding Format:**

```
Original commit message

## Demo Videos
- **Auth Flow**: https://bucket.hetzner.com/commits/abc123/auth-login.mp4
- **Checkout Process**: https://bucket.hetzner.com/commits/abc123/checkout-complete.mp4

🤖 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>
```

### Integration Points

#### Existing Systems

- **E2E Test Infrastructure**: `/infra/testing/e2e/` - Reuse existing setup,
  recording, and filtering
- **BFT Command System**: `/infra/bft/` - Add new task following existing
  patterns
- **Sapling Integration**: Existing `sl.bft.ts` patterns for change detection
- **Video Recording**: Existing `/infra/testing/video-recording/` system

#### New Components Required

- **Hetzner Object Storage Client**: Upload and URL generation
- **LLM Demo Selector**: Intelligently select relevant demo tests based on
  changed files
- **Media Collector**: Gather and organize generated video/screenshot files
- **Commit Message Formatter**: Embed URLs in standardized format

## Implementation Plan

### Phase 1: Core Infrastructure

#### 1.1 Hetzner Object Storage Setup

- [ ] Create Terraform configuration for Hetzner Object Storage bucket
- [ ] Add environment variables for bucket configuration (`BF_HETZNER_BUCKET`,
      `BF_HETZNER_ACCESS_KEY`, etc.)
- [ ] Implement upload utility with URL generation

#### 1.2 BFT Commit Command Foundation

- [ ] Create `/infra/bft/tasks/commit.bft.ts` with basic structure
- [ ] Implement file change detection using `sl status`
- [ ] Add command-line argument parsing

#### 1.3 LLM-Based Demo Test Selection

- [ ] Implement demo test discovery using `bft e2e --filter="demo:"`
- [ ] Create LLM integration for intelligent demo category selection
- [ ] Build test selection pipeline using existing `bft e2e --filter` system

### Phase 2: E2E Integration

#### 2.1 Media Collection System

- [ ] Monitor `/tmp/videos/` and `/tmp/screenshots/` during E2E execution
- [ ] Associate generated media with specific test executions
- [ ] Implement cleanup and organization of media files

#### 2.2 Test Execution Pipeline

- [ ] Integrate with existing E2E test infrastructure
- [ ] Handle test failures and partial success scenarios
- [ ] Add logging and progress reporting during demo generation

### Phase 3: Commit Enhancement

#### 3.1 Media Upload Pipeline

- [ ] Upload collected videos/screenshots to Hetzner bucket
- [ ] Generate and validate public URLs
- [ ] Handle upload failures and retries

#### 3.2 Commit Message Integration

- [ ] Format commit messages with embedded media URLs
- [ ] Preserve existing commit message patterns and metadata
- [ ] Integration with existing git commit workflow

#### 3.3 Testing and Validation

- [ ] Test with various change scenarios (auth, checkout, etc.)
- [ ] Validate video generation and upload workflow
- [ ] Ensure backward compatibility with existing commit patterns

## Technical Considerations

### Performance

- **Selective Execution**: Only run tests relevant to changes to minimize video
  generation time
- **Parallel Processing**: Leverage existing E2E test parallelization where
  possible
- **Timeout Handling**: Set reasonable limits on demo generation to avoid
  blocking commits

### Error Handling

- **Graceful Degradation**: If demo generation fails, proceed with normal commit
- **Upload Failures**: Cache videos locally and retry upload in background
- **Test Failures**: Include partial results and note failures in commit message

### Security

- **Bucket Access**: Use secure credential management for Hetzner access
- **Public URLs**: Ensure generated URLs are appropriate for sharing in commits
- **Content Filtering**: Validate that videos don't contain sensitive
  information

### Development Experience

- **Dry Run Mode**: Allow developers to see what demos would be generated
  without execution
- **Override Options**: Support manual test selection when automatic detection
  isn't suitable
- **Progress Feedback**: Clear indication of demo generation progress during
  commits

## Environment Configuration

### Required Environment Variables

```bash
# Hetzner Object Storage
export BF_HETZNER_BUCKET="bolt-foundry-demos"
export BF_HETZNER_ACCESS_KEY="..."
export BF_HETZNER_SECRET_KEY="..."
export BF_HETZNER_ENDPOINT="https://fsn1.your-objectstorage.com"

# Demo Configuration
export BF_COMMIT_DEMOS_ENABLED="true"
export BF_COMMIT_DEMOS_MAX_DURATION="300"  # Max seconds for demo generation
export BF_COMMIT_DEMOS_MAX_VIDEOS="3"      # Max videos per commit
```

### Terraform Configuration

```hcl
# /infra/terraform/hetzner-storage.tf (to be created)
resource "hcloud_storage_bucket" "demo_videos" {
  name     = "bolt-foundry-demos"
  location = "fsn1"
  
  public_read = true
  
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
    max_age_seconds = 3600
  }
}
```

## Success Criteria

### MVP Success Metrics

- [ ] `bft commit` command successfully executes without breaking existing
      workflow
- [ ] Demo videos are generated for at least 3 common change scenarios (auth,
      checkout, homepage)
- [ ] Videos are successfully uploaded to Hetzner bucket with accessible URLs
- [ ] Commit messages include properly formatted video links
- [ ] Total commit time increase is less than 2 minutes for typical changes

### Quality Gates

- [ ] E2E tests with `[demo:*]` tags execute successfully in isolation
- [ ] Upload failures do not block commit completion
- [ ] Generated videos are under 30 seconds and clearly demonstrate
      functionality
- [ ] Command works reliably across different development environments
- [ ] Documentation updated with usage examples and configuration guide

## Future Enhancements

### Before/After Video Comparisons

- Extend system to checkout previous commit, run same tests, generate comparison
  videos
- Embed both "before" and "after" URLs in commit messages
- Cache previous test results to avoid redundant generation

### Smart Caching

- Hash test content and code to determine if demo videos can be reused
- Implement cache invalidation based on relevant file changes
- Store cached videos in Hetzner bucket with longer retention

### PR Integration

- Automatically include demo videos in pull request descriptions
- Generate summary videos showing all changes in a PR
- Integration with GitHub/code review systems

### Analytics and Optimization

- Track which demos are most valuable for reviews
- Optimize test selection based on historical usage patterns
- Performance monitoring and optimization of video generation pipeline

## Questions and Decisions

### Open Questions

1. **Video Retention**: How long should demo videos be stored in Hetzner bucket?
2. **Access Control**: Should video URLs be permanently public or have
   expiration?
3. **Test Organization**: Should we create dedicated demo test files or tag
   existing tests?
4. **Fallback Strategy**: What happens if Hetzner bucket is unavailable during
   commit?

### Decision Records

- **Test Selection Method**: Use `[demo:category]` naming convention in test
  descriptions (decided)
- **Storage Solution**: Hetzner Object Storage over local/git storage (decided)
- **Integration Point**: BFT task system rather than git hooks (decided)
- **Media Format**: Leverage existing MP4 video generation from E2E system
  (decided)
