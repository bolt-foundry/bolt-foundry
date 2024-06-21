import { Maybe, React } from "aws/client/deps.ts";
import { captureEvent } from "aws/events/mod.ts";
import Icon from "aws/client/ui_components/Icon.tsx";
import useIntersectionObserver from "aws/client/hooks/useIntersectionObserver.tsx";
import { useAppEnvironment } from "aws/client/contexts/AppEnvironmentContext.tsx";
import throttle from "aws/client/lib/throttle.ts";
import { createBfLogger } from "aws/logs/mod.ts";
const logError = createBfLogger(import.meta, "error");

const { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } =
  React;

let currentlyPlayingVideo: React.RefObject<HTMLVideoElement> | null = null;

type VideoPlayerProps = {
  controls?: "overlay" | "below"; // default: overlay
  endTime?: number;
  lastWordStartTime?: number;
  onPlayingStateChange?: (playing: boolean) => void;
  onTimeUpdate?: (time: number) => void;
  playerLocation?: string;
  playingLastWordCb?: () => void;
  showBackground?: boolean;
  showScrubber?: boolean;
  src: Maybe<string>;
  startTime?: number;
  xstyle?: React.CSSProperties;
};

export interface VideoPlayerHandles {
  gotoTime: (time: number) => void;
  increasePlaybackRate: () => void;
  pause: () => void;
  play: () => void;
  playAroundWord: (start: number, end: number) => void;
  playbackRate: number;
  playThrough: () => void;
  reversePlayback: () => void;
}

const styles: Record<string, React.CSSProperties> = {
  controls: {
    width: "100%",
    background: "var(--videoControlsBackground)",
    display: "flex",
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    borderRadius: 16,
    boxSizing: "border-box",
  },
  controlsOverlay: {
    position: "absolute",
    bottom: 4,
    width: "calc(100% - 8px)",
    left: 4,
  },
  control: {
    width: 24,
    minWidth: 24, // force width to be 24px
    height: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--videoControl)",
    borderRadius: "50%",
    cursor: "pointer",
  },
  rewind: {
    width: 14,
    minWidth: 14, // force width to be 14px
    height: 14,
  },
  videoContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  video: {
    backgroundColor: "var(--secondaryButton)",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: "rotate(0.00001deg)",
  },
  blank: {
    backgroundColor: "#000",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
};

const VideoPlayer = forwardRef<VideoPlayerHandles, VideoPlayerProps>(({
  controls = "overlay",
  endTime = Infinity,
  lastWordStartTime,
  onPlayingStateChange,
  onTimeUpdate,
  playerLocation,
  playingLastWordCb,
  showBackground = true,
  showScrubber = false,
  src,
  startTime = 0,
  xstyle,
}: VideoPlayerProps, ref) => {
  const { currentViewer: { id: personId } } = useAppEnvironment();
  const [ignoringEdits, setIgnoringEdits] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const [wordBoundaries, setWordBoundaries] = React.useState<
    [number | null, number | null]
  >([0, 0]);
  const [hoverControl, setHoverControl] = React.useState<number | null>(null);
  const [progress, setProgress] = React.useState(0);
  const scrubberRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isVisible, domRef } = useIntersectionObserver();
  const reversePlaybackInterval = useRef<number | null>(null);

  useEffect(() => {
    // Cleanup reverse playback on unmount
    return () => {
      if (reversePlaybackInterval.current) {
        clearInterval(reversePlaybackInterval.current);
        reversePlaybackInterval.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !wordBoundaries[0] || !wordBoundaries[1]) return;

    const [start, end] = wordBoundaries;
    const padding = 1; // time in seconds to pad the start and end times
    video.currentTime = Math.max(startTime, Math.min(endTime, start - padding));
    video.play();

    const handleTimeUpdate = () => {
      if (video.currentTime >= Math.min(endTime, end + padding)) {
        video.pause();
        setWordBoundaries([null, null]);
      }
    };
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [wordBoundaries]);

  useEffect(() => {
    if (!src) {
      captureEvent("video", "no_src", { playerLocation }, personId);
    }
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (playing) {
      if (currentlyPlayingVideo?.current) {
        const otherPlayingVideoRef = currentlyPlayingVideo.current;
        if (otherPlayingVideoRef) {
          otherPlayingVideoRef.pause();
        }
      }
      currentlyPlayingVideo = videoRef;
      const playPromise = video?.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (onPlayingStateChange) onPlayingStateChange(true);
          })
          .catch((error) => {
            logError(error);
          });
      }
      captureEvent("video", "played", { playerLocation }, personId);
    } else {
      video?.pause();
      if (onPlayingStateChange) onPlayingStateChange(false);
    }
  }, [playing]);

  // if startTime changes, set the video's current time to the new start time
  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    video.currentTime = startTime;
  }, [startTime]);

  useEffect(() => {
    const video = videoRef.current;
    const scrubber = scrubberRef.current;

    if (!video || !scrubber) {
      return;
    }

    // Define the event listener callbacks
    const handleLoadedMetadata = () => {
      video.currentTime = startTime;
      if (playing) video.play();
      scrubber.min = startTime.toString();
      scrubber.max = endTime.toString();
    };

    const handleTimeUpdate = () => {
      // if playing last word, fire the callback
      if (playingLastWordCb && lastWordStartTime) {
        if (video.currentTime >= lastWordStartTime) {
          playingLastWordCb();
        }
      }
      if (
        !ignoringEdits &&
        (video.currentTime < startTime || video.currentTime >= endTime)
      ) {
        if (
          video.currentTime - startTime < 0.1 &&
          video.currentTime - startTime > 0
        ) {
          // If the video is less than 0.1 seconds from the start time, don't pause it
          // This prevents double-clicks from pausing the video
          return;
        }
        // If the video is outside the start and end times, set it back to the start time and pause it
        video.currentTime = startTime;
        video.pause();
      }
      setProgress(video.currentTime);
      onTimeUpdate?.(video.currentTime);
    };

    const handlePause = () => {
      setPlaying(false);
    };

    // Set the start time and scrubber values when the video is loaded
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    // Check if the video has reached the end time and set scrubber value
    video.addEventListener("timeupdate", handleTimeUpdate);

    // Check if the video has been paused
    video.addEventListener("pause", handlePause);

    // Clean up event listeners when unmounting
    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("pause", handlePause);
    };
  }, [
    startTime,
    endTime,
    playing,
    ignoringEdits,
    lastWordStartTime,
    videoRef.current,
  ]);

  function handlePlay() {
    // if current time is out of bounds, go to the start
    const video = videoRef.current;
    if (
      video && (video.currentTime >= endTime || video.currentTime < startTime)
    ) {
      gotoStart();
    }
    setPlaying(true);
    setIgnoringEdits(false);
  }

  function maybeClearInterval() {
    // Clear any existing reverse playback intervals
    if (reversePlaybackInterval.current) {
      clearInterval(reversePlaybackInterval.current);
    }
  }

  useImperativeHandle(ref, () => ({
    gotoTime(time: number) {
      // TODO: clicking on a word outside of play area doesn't work
      // until you play with space bar... the effect above with
      // handleTimeUpdate resets the time to the start time
      const video = videoRef.current;
      if (video) {
        video.currentTime = time;
      }
    },
    increasePlaybackRate() {
      maybeClearInterval();
      const video = videoRef.current;
      if (video) {
        if (video.playbackRate >= 4) {
          video.playbackRate = video.defaultPlaybackRate;
          return;
        }
        video.playbackRate *= 2;
      }
    },
    pause() {
      // Clear any existing reverse playback intervals
      if (reversePlaybackInterval.current) {
        clearInterval(reversePlaybackInterval.current);
      }
      setPlaying(false);
    },
    play() {
      maybeClearInterval();
      const video = videoRef.current;
      if (video) {
        video.playbackRate = 1;
      }
      handlePlay();
    },
    playAroundWord(start: number, end: number) {
      maybeClearInterval();
      const video = videoRef.current;
      if (video) {
        video.playbackRate = 1;
      }
      setWordBoundaries([start, end]);
    },
    get playbackRate() {
      const video = videoRef.current;
      if (video) {
        return video.playbackRate;
      }
      return 1;
    },
    set playbackRate(rate: number) {
      const video = videoRef.current;
      if (video) {
        video.playbackRate = rate;
      }
    },
    playThrough() {
      maybeClearInterval();
      const video = videoRef.current;
      if (video) {
        video.playbackRate = 1;
      }
      setPlaying(true);
      setIgnoringEdits(true);
    },
    reversePlayback() {
      const video = videoRef.current;
      if (video) {
        // Set the interval for how far to jump back in seconds
        const interval = 0.033; // 30fps

        maybeClearInterval();

        // Check if the video is currently playing forward and pause if so
        if (!video.paused) {
          video.pause();
        }

        // Create an interval that jumps back in the video to simulate reverse playback
        reversePlaybackInterval.current = setInterval(() => {
          // Calculate the new time
          let newTime = video.currentTime - interval;

          // If we have reached the beginning of the video, stop the reverse playback
          if (newTime <= 0 && reversePlaybackInterval.current) {
            clearInterval(reversePlaybackInterval.current);
            newTime = 0;
          }

          // Set the current time of the video to the new time
          video.currentTime = newTime;
        }, interval * 1000); // Convert to milliseconds
      }
    },
  }));

  if (!src) {
    return (
      <div style={{ ...styles.video, ...styles.blank, ...xstyle }}>
        <div>No video</div>
      </div>
    );
  }

  const throttleUpdateProgress = useCallback(
    throttle((video: HTMLVideoElement, newProgress: number) => {
      video.currentTime = newProgress;
      // setProgress(newProgress);
    }, 200),
    [],
  );

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    const newValue = parseFloat(e.currentTarget.value);
    setProgress(newValue);
    throttleUpdateProgress(video, newValue);
  };

  const handleScrubMove = (e: React.MouseEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video || e.buttons !== 1) {
      return;
    }
    const newValue = parseFloat(e.currentTarget.value);
    setProgress(newValue);
    throttleUpdateProgress(video, newValue);
  };

  const gotoStart = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    video.currentTime = startTime;
  };

  return (
    <div style={styles.videoContainer} ref={domRef}>
      <video
        key={src}
        ref={videoRef}
        controls={false}
        style={{ ...styles.video, ...xstyle }}
        playsInline={true}
        preload="metadata"
      >
        {isVisible && <source src={src} />}
        Your browser does not support the video tag.
      </video>
      <div
        style={{
          ...styles.controls,
          ...(controls === "overlay" && styles.controlsOverlay),
          ...(!showBackground && { background: "transparent" }),
        }}
      >
        <div
          style={{
            ...styles.control,
            ...styles.rewind,
            ...(hoverControl === 0 &&
              { background: "var(--videoControlHover)" }),
          }}
          onClick={gotoStart}
          onMouseEnter={() => setHoverControl(0)}
          onMouseLeave={() => setHoverControl(null)}
          data-bf-testid="video-rewind"
        >
          <Icon name="rewind" color="white" size={8} />
        </div>
        {!playing
          ? (
            <div
              style={{
                ...styles.control,
                ...(hoverControl === 1 &&
                  { background: "var(--videoControlHover)" }),
              }}
              onClick={handlePlay}
              onMouseEnter={() => setHoverControl(1)}
              onMouseLeave={() => setHoverControl(null)}
              data-bf-testid="video-play"
            >
              <Icon name="play" color="white" size={12} />
            </div>
          )
          : (
            <div
              style={{
                ...styles.control,
                ...(hoverControl === 1 &&
                  { background: "var(--videoControlHover)" }),
              }}
              onClick={() => setPlaying(false)}
              onMouseEnter={() => setHoverControl(1)}
              onMouseLeave={() => setHoverControl(null)}
              data-bf-testid="video-pause"
            >
              <Icon name="pause" color="white" size={12} />
            </div>
          )}
        <input
          style={{ display: showScrubber ? "block" : "none" }}
          className="scrubber"
          ref={scrubberRef}
          type="range"
          min={startTime}
          max={endTime}
          step={0.1}
          value={progress}
          onChange={handleScrub}
          onMouseMove={handleScrubMove}
        />
      </div>
    </div>
  );
});

export default VideoPlayer;
