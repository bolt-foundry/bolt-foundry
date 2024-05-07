import { React } from "deps.ts";
import Icon from "packages/bfDs/Icon.tsx";
import { Button } from "packages/bfDs/Button.tsx";

const { useEffect, useState, useRef } = React;

type VideoType = {
  account: string;
  igHash: string;
  caption?: string;
  likes?: number;
  comments?: number;
};

// Video instructions:
// • Use PullTube to download the video from the url
// • Rename video to `{account}-{igHash}.mp4`
// • Download ig account image
// • Rename image to `{account}.jpg`
// • Upload video and image to S3 - bf-static-assets > ig
// • Populate caption, like, and comments
const igVideos: Array<VideoType> = [
  {
    account: "blueridgecomedy",
    igHash: "C5ntRoFMKih",
    caption:
      "Hich on birth control w/ @ShockleyComedy #comedy #funny #standupcomedy",
    likes: 35,
    comments: 0,
  },
  {
    account: "ronervin", // sunflowerarcadelounge
    igHash: "C4_IvG8Ay12",
    caption: "And that's that #standup #comedy #nyc #dating #fitness",
    likes: 94,
    comments: 13,
  },
  {
    account: "thejoematarese",
    igHash: "C4sRTz7Cey1",
    caption: "Italian Pronunciation #funny #italian #comedy #standup",
    likes: 57,
    comments: 2,
  },
  {
    account: "comiccure",
    igHash: "C4fZVYZhvf3",
    caption: '"Home"made cookies w/ @callowaycomedy #comedy #funny #standup',
    likes: 23,
    comments: 7,
  },
  {
    account: "brickyscomedyclub",
    igHash: "C51KgciOVJ0",
    caption:
      "Comedian of the Day: Nick Osman! Follow more of his content here on Insta at @nickosmanisntfunny",
    likes: 52,
    comments: 3,
  },
  {
    account: "brickyscomedyclub",
    igHash: "C55_j5Euovw",
    caption:
      "Comedian of the Day: Mark Perkins! Follow more of his content here on Insta at @markperkinscomedy",
    likes: 77,
    comments: 0,
  },
  {
    account: "dougiedangerous",
    igHash: "C50XqIti53u",
    caption: "Extreme Sports #comedy #funny #lol #sports #parasailing",
    likes: 44,
    comments: 2,
  },
  {
    account: "dougiedangerous",
    igHash: "C58F-ZQLEf0",
    caption: "Wealth and Women #comedy #funny #standup #lol #nyc #amazon",
    likes: 45,
    comments: 0,
  },
  {
    account: "boltfoundry",
    igHash: "C5IBgT5uOQI",
    caption:
      "It just doesn’t work!! #comedy #comedyclub @wiseguyscomedy @creepymustache",
    likes: 241,
    comments: 0,
  },
];

export function MarketingIGHscroll() {
  const [playingVideoRefIndex, setPlayingVideoRefIndex] = React.useState(0);
  const videoRefs = useRef(
    igVideos.map(() => React.createRef<HTMLVideoElement>()),
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
            containerRef.current.scrollLeft - containerPadding;
          containerRef.current.scrollTo({
            left: scrollLeft,
            behavior: "smooth",
          });
        }
      };
      const endedHandler = () => {
        let next = playingVideoRefIndex + 1;
        if (next >= igVideos.length) {
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
    <div className="cta-section marketing-hscroll" ref={containerRef}>
      <div className="hscroll-content">
        {igVideos.map((video, index) => {
          return (
            <HscrollVideo
              video={video}
              videoRef={videoRefs.current[index]}
              shouldPlay={index === playingVideoRefIndex}
              handlePlay={() => handlePlay(index)}
              handleMute={() => setMuted(!muted)}
              muted={muted}
              key={index}
            />
          );
        })}
      </div>
    </div>
  );
}

type VideoProps = {
  handleMute: () => void;
  handlePlay: () => void;
  muted: boolean;
  video: VideoType;
  videoRef: React.RefObject<HTMLVideoElement>;
  shouldPlay: boolean;
};

function HscrollVideo(
  { handleMute, handlePlay, video, videoRef, shouldPlay, muted }: VideoProps,
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

  const handleOpenVideo = () => {
    window.open(`https://instagram.com/p/${video.igHash}`, "_blank");
  };

  return (
    <div
      className="hscroll-video"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <video
        preload="metadata"
        ref={videoRef}
        src={`https://bf-static-assets.s3.amazonaws.com/ig/${video.account}_${video.igHash}.mp4`}
      >
        Your browser does not support the video tag.
      </video>
      <div className="hscroll-video-gradient" />
      <div
        className="hscroll-video-overlay"
        style={{ opacity: hovering ? 0.3 : 1 }}
      >
        <div className="hscroll-reels">Reels</div>
        <div className="hscroll-ig">
          <Icon name="brand-instagram" color="white" />
        </div>
        <div className="hscroll-camera"></div>
        <div className="hscroll-post">
          <div className="hscroll-post-author">
            <div
              className="hscroll-post-picture"
              style={{
                background:
                  `url('https://bf-static-assets.s3.amazonaws.com/ig/${video.account}.jpg') center/cover no-repeat`,
              }}
            />
            <div className="hscroll-post-username">
              @{video.account}
            </div>
          </div>
          <div className="hscroll-post-text">
            {video.caption ?? ""}
          </div>
        </div>
        <div className="hscroll-chrome">
          <div className="hscroll-chrome-likes">
            {video.likes ?? 0}
          </div>
          <div className="hscroll-chrome-comments">
            {video.comments ?? 0}
          </div>
          <div className="hscroll-chrome-share" />
          <div className="hscroll-chrome-kebab" />
        </div>
      </div>
      <div
        className="hscroll-video-controls"
        style={{ opacity: hovering ? 1 : 0 }}
      >
        <div className="hscroll-video-controls-play" onClick={handlePlay}>
          {shouldPlay
            ? <Icon name="pause" color="white" size={24} />
            : <Icon name="play" color="white" size={24} />}
        </div>

        <div className="hscroll-video-controls-mute" onClick={handleMute}>
          {muted
            ? <Icon name="muted" color="white" />
            : <Icon name="unmuted" color="white" />}
        </div>
        <div className="hscroll-video-controls-open">
          <Button
            kind="outline"
            onClick={() => handleOpenVideo()}
            size="small"
            text="Open"
          />
        </div>
      </div>
    </div>
  );
}
