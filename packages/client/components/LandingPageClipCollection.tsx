import { React } from "packages/logger/logger.ts";
import { BfDsIcon } from "packages/bfDs/BfDsIcon.tsx";
import { useEffect, useRef, useState } from "react";

const testimonialVideos: string[] = [
  "https://bf-static-assets.s3.amazonaws.com/marketing/Working_with_rodger_testimonial.mp4",
  "https://bf-static-assets.s3.amazonaws.com/marketing/Why_GRIP6_wallet_verified_testimonial.mp4",
  "https://bf-static-assets.s3.amazonaws.com/marketing/deadpool_leaked_footage_3mb.mp4",
];

export function LandingPageClipCollection() {
  const [playingVideoRefIndex, setPlayingVideoRefIndex] = React.useState(0);
  const videoRefs = useRef(
    testimonialVideos.map(() => React.createRef<HTMLVideoElement>()),
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = React.useState(true);

  useEffect(() => {
    // Add event listeners to the current video
    if (playingVideoRefIndex === -1) return;
    const videoRef = videoRefs.current[playingVideoRefIndex];
    if (videoRef.current) {
      videoRef.current.play();
      const playHandler = () => {
        if (containerRef.current && videoRef.current) {
          const containerPadding = 40;
          const videoRect = videoRef.current.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();
          const scrollLeft = videoRect.left - containerRect.left +
            containerRef.current.scrollLeft - containerRect.width / 2 +
            videoRect.width / 2;
          containerRef.current.scrollTo({
            left: scrollLeft,
            behavior: "smooth",
          });
        }
      };
      const endedHandler = () => {
        let next = playingVideoRefIndex + 1;
        if (next >= testimonialVideos.length) {
          next = 0;
        }
        if (videoRef?.current) {
          videoRef.current.currentTime = 0;
        }
        setPlayingVideoRefIndex(next);
      };
      videoRef.current.addEventListener("play", playHandler);
      videoRef.current.addEventListener("ended", endedHandler);
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener("play", playHandler);
          videoRef.current.removeEventListener("ended", endedHandler);
        }
      };
    }
  }, [playingVideoRefIndex]);

  const handlePlay = (index: number) => {
    if (playingVideoRefIndex === index) {
      return setPlayingVideoRefIndex(-1);
    }
    setPlayingVideoRefIndex(index);
  };

  return (
    <div className="landing-page-clips-container" ref={containerRef}>
      {testimonialVideos.map((video, index) => {
        return (
          <div
            className="landing-page-clips"
            id={`video${index + 1}`}
            key={index}
          >
            <HscrollVideo
              src={video}
              videoRef={videoRefs.current[index]}
              shouldPlay={index === playingVideoRefIndex}
              handlePlay={() => handlePlay(index)}
              handleMute={() => setMuted(!muted)}
              muted={muted}
            />
          </div>
        );
      })}
    </div>
  );
}

type VideoProps = {
  handleMute: () => void;
  handlePlay: () => void;
  muted: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  shouldPlay: boolean;
  src: string;
};

function HscrollVideo(
  { handleMute, handlePlay, videoRef, shouldPlay, muted, src }: VideoProps,
) {
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (shouldPlay) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [shouldPlay]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
  }, [muted]);
  return (
    <div
      className="hscroll-video"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <video
        playsInline
        preload="metadata"
        ref={videoRef}
        src={src}
      >
        Your browser does not support the video tag.
      </video>
      <div
        className="hscroll-video-controls"
        style={{ opacity: hovering ? 1 : 0 }}
      >
        <div className="hscroll-video-controls-play" onClick={handlePlay}>
          {shouldPlay
            ? <BfDsIcon name="pause" color="white" size={24} />
            : <BfDsIcon name="play" color="white" size={24} />}
        </div>

        <div className="hscroll-video-controls-mute" onClick={handleMute}>
          {muted
            ? <BfDsIcon name="muted" color="white" />
            : <BfDsIcon name="unmuted" color="white" />}
        </div>
      </div>
    </div>
  );
}
