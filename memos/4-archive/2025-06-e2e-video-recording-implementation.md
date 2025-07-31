# E2E Test Video Recording Implementation Plan

## Overview

Implement video recording capabilities for E2E tests using Puppeteer's Chrome
DevTools Protocol screencast API. Videos will be automatically uploaded to
GitHub's CDN and linked in commit messages to provide visual documentation of
test execution.

## Goals

1. **Debug flaky tests** - Capture full test execution to identify intermittent
   failures
2. **Visual documentation** - Provide stakeholders with visual proof of feature
   functionality
3. **Test execution records** - Create an audit trail of test runs for important
   changes
4. **Automated workflow** - AI assistant determines relevant tests and includes
   videos in commits

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

### Phase 3: Local Video Management

- [ ] Implement video file compression and optimization
- [ ] Add video playback utilities for local review
- [ ] Create video indexing and search capabilities

## Configuration

Environment variables:

```bash
BF_E2E_RECORD_VIDEO=true          # Enable video recording
BF_E2E_VIDEO_DIR=/tmp/videos      # Video output directory
BF_E2E_VIDEO_FORMAT=webm          # Output format (webm, mp4, av1)
BF_E2E_VIDEO_QUALITY=80           # Quality setting (0-100)
GITHUB_TOKEN=...                  # For uploading videos
```

## Example Commit Message

```
feat: Add dark mode toggle to settings page

Implemented user-requested dark mode functionality with persistent
preference storage and smooth transitions.

Test Videos:
- Settings page dark mode toggle: https://user-images.githubusercontent.com/.../video1.webm
- Theme persistence across navigation: https://user-images.githubusercontent.com/.../video2.webm
- Mobile responsive dark mode: https://user-images.githubusercontent.com/.../video3.webm

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

### GitHub Integration (Future Work)

7. **GitHub API client** - Upload videos to GitHub CDN via draft issues
8. **Video upload functionality** - Extract and validate CDN URLs
9. **Commit message integration** - Format commit messages with video links
10. **AI Assistant Integration** - Automatically run relevant tests with
    recording and include videos in commits

## Success Metrics

- Video recording adds <5% overhead to test execution time
- Videos successfully upload 99%+ of the time
- File sizes reasonable (<10MB for typical test)
- Clear video quality at 1080p resolution
- Zero impact on test reliability

## Dependencies

- Puppeteer (existing)
- Chrome DevTools Protocol (built into Puppeteer)
- ffmpeg (system dependency for video conversion)
- GitHub API (@octokit/rest or similar)
- No additional npm packages initially

## Security Considerations

- Videos should respect `BF_CI` environment detection
- Never record sensitive data (passwords, tokens)
- Ensure GitHub tokens are properly scoped
- Videos inherit repository access permissions
- Consider video retention policies

## Open Questions

1. Should we record all tests in a suite or just failed ones?
2. What's the ideal video length limit before splitting?
3. Should videos be timestamped with test step annotations?
4. How do we handle very long-running tests?
5. Should we support slow-motion recording for complex interactions?

## Next Steps

1. Review and approve this plan
2. Create video-recording directory structure
3. Implement basic screencast recorder
4. Test with a single E2E test
5. Iterate based on initial results
