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
  // New video recording methods
  startVideoRecording: () => Promise<void>;
  stopVideoRecording: () => Promise<string>;
}
```

### 3. GitHub Upload Integration

```typescript
// github-video-uploader.ts
export class GitHubVideoUploader {
  async uploadVideo(videoPath: string): Promise<string> {
    // 1. Create draft issue using GitHub API
    // 2. Upload video as attachment
    // 3. Extract CDN URL from response
    // 4. Delete draft issue (optional)
    // 5. Return permanent CDN URL
  }
}
```

### 4. Test Recording Workflow

```typescript
// Example test with video recording
Deno.test("Home page with video", async () => {
  const context = await setupE2ETest({ recordVideo: true });

  try {
    await context.startVideoRecording();

    // Run test steps
    await navigateTo(context, "/");
    // ... test assertions ...

    const videoPath = await context.stopVideoRecording();
    // Video saved to tmp/videos/[timestamp]_home-page.mp4
  } finally {
    await teardownE2ETest(context);
  }
});
```

## Implementation Phases

### Phase 1: Basic Recording (Week 1)

- [ ] Create `infra/testing/video-recording/` directory structure
- [ ] Implement ScreencastRecorder using Chrome DevTools Protocol
- [ ] Extend E2ETestContext with recording methods
- [ ] Save frames as image sequence initially
- [ ] Update one test as proof of concept

### Phase 2: Video Conversion (Week 2)

- [ ] Add ffmpeg integration for frame-to-video conversion
- [ ] Support multiple output formats (WebM for immediate use, AV1 for final)
- [ ] Implement video compression settings
- [ ] Add progress logging for long recordings

### Phase 3: GitHub Integration (Week 3)

- [ ] Implement GitHub API client for draft issues
- [ ] Create video upload functionality
- [ ] Extract and validate CDN URLs
- [ ] Add retry logic for failed uploads
- [ ] Create upload CLI command for testing

### Phase 4: AI Assistant Integration (Week 4)

- [ ] Create test relevance analyzer
- [ ] Integrate with commit workflow
- [ ] Automatically run relevant tests with recording
- [ ] Format commit messages with video links
- [ ] Add configuration for video inclusion rules

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

1. **Parallel recording** - Record multiple test runs simultaneously
2. **Selective recording** - Record only on test failure or specific steps
3. **Video annotations** - Add timestamps and step descriptions
4. **Diff videos** - Show before/after for visual regression tests
5. **Performance metrics** - Overlay performance data on videos
6. **Video thumbnails** - Generate preview images for commit messages

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
