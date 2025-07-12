# E2E Test Video Recording Implementation Plan

## Overview

Implement video recording capabilities for E2E tests using Puppeteer's Chrome
DevTools Protocol screencast API. Videos will be locally managed with selective
sharing via gist uploads to provide visual documentation of test execution for
development and debugging.

## Goals

1. **Debug flaky tests** - Capture full test execution to identify intermittent
   failures
2. **Visual documentation** - Provide stakeholders with visual proof of feature
   functionality
3. **Test execution records** - Create an audit trail of test runs for important
   changes
4. **Local workflow enhancement** - AI assistant manages local video artifacts
   and provides gist upload tooling for selective sharing

## Technical Architecture

### 1. Video Recording Module (`infra/testing/video-recording/`)

```typescript
// recorder.ts
export interface VideoRecorder {
  startRecording(): Promise<void>;
  stopRecording(): Promise<string>; // Returns path to video file
  captureFrame(data: Buffer): void;
}

// screencast-recorder.ts
export class ScreencastRecorder implements VideoRecorder {
  private frames: Buffer[] = [];
  private cdpSession: CDPSession;

  async startRecording(): Promise<void> {
    // Enable Page domain and start screencast
    await this.cdpSession.send("Page.enable");
    await this.cdpSession.send("Page.startScreencast", {
      format: "png",
      quality: 80,
      maxWidth: 1920,
      maxHeight: 1080,
      everyNthFrame: 1,
    });
  }

  async stopRecording(): Promise<string> {
    // Stop screencast and save frames
    await this.cdpSession.send("Page.stopScreencast");
    // Initially: Save frames as image sequence
    // Future: Convert to AV1 using ffmpeg
    return await this.saveFrames();
  }
}
```

### 2. E2ETestContext Extension

Update `infra/testing/e2e/setup.ts`:

```typescript
export interface E2ETestContext {
  browser: Browser;
  page: Page;
  baseUrl: string;
  takeScreenshot: (name: string) => Promise<string>;
  // New video recording methods - returns stop function for better API design
  startVideoRecording: (name: string) => Promise<() => Promise<string | null>>;
}
```

**API Design Decision**: `startVideoRecording` returns a stop function for
better coupling and type safety, preventing orphaned recordings.

### 3. Video File Management

```typescript
// video-utils.ts
export async function saveVideo(
  frames: Buffer[],
  name: string,
): Promise<string> {
  // 1. Create video directory structure
  // 2. Convert frames to video format
  // 3. Apply compression settings
  // 4. Save to local storage
  // 5. Return local file path
}
```

### 4. Enhanced Mouse Movement for Video Recording

```typescript
// smooth-mouse.ts
export async function smoothMoveTo(
  page: Page,
  targetX: number,
  targetY: number,
  duration = 1000,
): Promise<void> {
  const currentPos = await page.evaluate(() => ({
    x: window.mouseX || 0,
    y: window.mouseY || 0,
  }));

  const steps = 20;
  const stepDelay = duration / steps;

  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    // Easing function (ease-out)
    const eased = 1 - Math.pow(1 - progress, 3);

    const x = currentPos.x + (targetX - currentPos.x) * eased;
    const y = currentPos.y + (targetY - currentPos.y) * eased;

    await page.mouse.move(x, y);
    await new Promise((resolve) => setTimeout(resolve, stepDelay));
  }
}

export async function smoothClick(page: Page, selector: string): Promise<void> {
  const element = await page.$(selector);
  const box = await element.boundingBox();
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;

  await smoothMoveTo(page, centerX, centerY);
  await page.mouse.click(centerX, centerY);
}

export async function smoothHover(page: Page, selector: string): Promise<void> {
  const element = await page.$(selector);
  const box = await element.boundingBox();
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;

  await smoothMoveTo(page, centerX, centerY);
}
```

### 5. Test Recording Workflow

```typescript
// Example test with video recording and smooth mouse movement
Deno.test("Home page with video", async () => {
  const context = await setupE2ETest({ recordVideo: true });

  try {
    const stopRecording = await context.startVideoRecording("home-page-test");

    // Run test steps with smooth mouse movement
    await navigateTo(context, "/");
    await smoothClick(context.page, ".login-button");
    await smoothClick(context.page, "#username");
    // ... test assertions ...

    const videoPath = await stopRecording();
    // Video saved to tmp/videos/[timestamp]_home-page-test.mp4
  } finally {
    await teardownE2ETest(context);
  }
});
```

## Implementation Phases

### Phase 1: Basic Recording

- [ ] Create `infra/testing/video-recording/` directory structure
- [ ] Implement ScreencastRecorder using Chrome DevTools Protocol
- [ ] Create smooth mouse movement utilities (`smooth-mouse.ts`)
- [ ] Extend E2ETestContext with recording methods
- [ ] Save frames as image sequence initially
- [ ] Update one test as proof of concept with smooth mouse movement

### Phase 2: Video Conversion

- [ ] Add ffmpeg integration for frame-to-video conversion
- [ ] Support multiple output formats (WebM for immediate use, AV1 for final)
- [ ] Implement video compression settings
- [ ] Add progress logging for long recordings

### Phase 3: Local Gist Integration

- [ ] Create gist upload utilities for selective video sharing
- [ ] Implement local video file management and cleanup
- [ ] Add commit message integration for shared videos
- [ ] Create workflow for AI assistant to suggest shareable videos

### Phase 3: Local Gist Upload Integration

- [ ] Implement local gist upload functionality for selective video sharing
- [ ] Add video file compression and optimization
- [ ] Create gist URL extraction and commit message integration
- [ ] Add video playback utilities for local review
- [ ] Create video indexing and search capabilities

## Local Artifact Management

### Video Storage Strategy

```typescript
// video-manager.ts
export interface VideoArtifact {
  path: string;
  testName: string;
  timestamp: Date;
  size: number;
  duration: number;
  uploaded?: {
    gistUrl: string;
    publicUrl: string;
    uploadedAt: Date;
  };
}

export class LocalVideoManager {
  private artifactsIndex: VideoArtifact[] = [];

  async recordTestVideo(testName: string): Promise<VideoArtifact> {
    // Record video and save to local storage
    // Update artifacts index
  }

  async uploadToGist(artifact: VideoArtifact): Promise<string> {
    // Upload video to public gist
    // Return public URL for commit messages
  }

  async cleanupOldVideos(retentionDays = 7): Promise<void> {
    // Clean up videos older than retention period
    // Keep uploaded videos longer
  }

  getSuggestedVideosForCommit(changes: string[]): VideoArtifact[] {
    // AI assistant logic to suggest relevant videos
  }
}
```

### Selective Sharing Workflow

1. **Local Recording** - All test videos saved locally for debugging
2. **Manual Upload** - Developer chooses important videos to share
3. **AI Suggestions** - Assistant recommends videos based on code changes
4. **Commit Integration** - Shared videos included in commit messages
5. **Cleanup** - Local videos cleaned up automatically after retention period

## Configuration

Environment variables:

```bash
BF_E2E_RECORD_VIDEO=true          # Enable video recording
BF_E2E_VIDEO_DIR=/tmp/videos      # Video output directory
BF_E2E_VIDEO_FORMAT=webm          # Output format (webm, mp4, av1)
BF_E2E_VIDEO_QUALITY=80           # Quality setting (0-100)
BF_GIST_UPLOAD_ENABLED=false      # Enable selective gist uploads
GITHUB_TOKEN=...                  # For gist uploads (optional)
```

## Example Commit Message

```
feat: Add dark mode toggle to settings page

Implemented user-requested dark mode functionality with persistent
preference storage and smooth transitions.

Local test videos recorded for debugging and review:
- /tmp/videos/2025-07-12_dark-mode-toggle.webm
- /tmp/videos/2025-07-12_theme-persistence.webm

Shared test demonstration:
- Settings page dark mode: https://gist.githubusercontent.com/.../video1.webm

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Future Enhancements

### Video Recording Features

1. **Parallel recording** - Record multiple test runs simultaneously
2. **Selective recording** - Record only on test failure or specific steps
3. **Video annotations** - Add timestamps and step descriptions
4. **Diff videos** - Show before/after for visual regression tests
5. **Performance metrics** - Overlay performance data on videos
6. **Video thumbnails** - Generate preview images for commit messages

### Local Development Integration

7. **Gist upload tooling** - Upload selected videos to public gists for sharing
8. **Local artifact management** - Organize and clean up video files
   automatically
9. **Selective sharing workflow** - Choose which videos to share based on
   importance
10. **AI Assistant Integration** - Help determine which test videos are worth
    uploading and include appropriate links in commits

## Success Metrics

- Video recording adds <5% overhead to test execution time
- Local video storage efficient and organized
- Gist uploads succeed 99%+ of the time when attempted
- File sizes reasonable (<10MB for typical test)
- Clear video quality at 1080p resolution
- Zero impact on test reliability
- Selective sharing reduces noise while preserving important demonstrations

## Dependencies

- Puppeteer (existing)
- Chrome DevTools Protocol (built into Puppeteer)
- ffmpeg (system dependency for video conversion)
- GitHub API (@octokit/rest or similar)
- No additional npm packages initially

## Security Considerations

- Videos stored locally by default for privacy
- Never record sensitive data (passwords, tokens)
- Gist uploads are public - only share non-sensitive demonstrations
- Ensure GitHub tokens are properly scoped for gist access only
- Local video cleanup prevents disk space issues
- Consider video retention policies for both local and uploaded content

## Open Questions

1. Should we record all tests in a suite or just failed ones?
2. What's the ideal video length limit before splitting?
3. Should videos be timestamped with test step annotations?
4. How do we handle very long-running tests?
5. Should we support slow-motion recording for complex interactions?

## Next Steps

1. Review and approve this updated local-first plan
2. Create video-recording directory structure
3. Implement basic screencast recorder with local storage
4. Test with a single E2E test
5. Add local video management utilities
6. Implement selective gist upload functionality
7. Iterate based on local development workflow needs
