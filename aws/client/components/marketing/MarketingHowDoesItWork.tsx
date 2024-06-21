import { React } from "aws/client/deps.ts";
import useIntersectionObserver from "aws/client/hooks/useIntersectionObserver.tsx";
import Button from "aws/client/ui_components/Button.tsx";
import classnames from "aws/client/lib/classnames.ts";
const { useEffect, useRef, useState } = React;

export default function MarketingHowDoesItWork() {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const video3Ref = useRef<HTMLVideoElement>(null);
  const [currentVideo, setCurrentVideo] = useState<number | null>(null);
  const [replay, setReplay] = useState(0); // Used to force a replay

  const { isVisible, domRef } = useIntersectionObserver(0.85);

  useEffect(() => {
    const playSequentially = async () => {
      if (isVisible) {
        if (video1Ref.current) {
          await video1Ref.current.play();
          setCurrentVideo(1);
        }
        if (video2Ref.current) {
          video1Ref.current?.addEventListener(
            "ended",
            () => {
              video2Ref.current?.play();
              setCurrentVideo(2);
            },
            { once: true },
          );
        }
        if (video3Ref.current) {
          video2Ref.current?.addEventListener(
            "ended",
            () => {
              video3Ref.current?.play();
              setCurrentVideo(3);
            },
            { once: true },
          );
          video3Ref.current.addEventListener(
            "ended",
            () => {
              setCurrentVideo(4);
            },
            { once: true },
          );
        }
      } else {
        // Pause all videos when not visible
        video1Ref.current?.pause();
        video2Ref.current?.pause();
        video3Ref.current?.pause();

        // Reset the videos to the beginning
        video1Ref.current && (video1Ref.current.currentTime = 0);
        video2Ref.current && (video2Ref.current.currentTime = 0);
        video3Ref.current && (video3Ref.current.currentTime = 0);
        setCurrentVideo(null);
      }
    };

    playSequentially();
  }, [isVisible, replay]);

  const step1 = classnames(["step", { active: currentVideo === 1 }]);
  const step2 = classnames(["step", { active: currentVideo === 2 }]);
  const step3 = classnames(["step", { active: currentVideo === 3 }]);
  const stepReplay = classnames(["step", "replay", {
    active: currentVideo === 4,
  }]);

  return (
    <div ref={domRef} className="marketingSteps">
      <h2 className="sectionHeader">How does it work?</h2>
      <div className="row">
        <div className={step1}>
          <h3>1. Upload</h3>
          <video
            controls={false}
            muted={true}
            playsInline={true}
            ref={video1Ref}
            src="https://bf-static-assets.s3.amazonaws.com/videos/anim-v3-step1-upload.mp4"
            className="video"
          />
          <p>
            When you send us your videos, our editors find the best short-form
            content and adapt it for your social platforms.
          </p>
        </div>
        <div className={step2}>
          <h3>2. Review</h3>
          <video
            controls={false}
            muted={true}
            playsInline={true}
            ref={video2Ref}
            src="https://bf-static-assets.s3.amazonaws.com/videos/anim-v3-step2-review.mp4"
            className="video"
          />
          <p>
            We send you the best clips to make sure you love them as much as we
            do.
          </p>
        </div>
        <div className={step3}>
          <h3>3. Done</h3>
          <video
            controls={false}
            muted={true}
            playsInline={true}
            ref={video3Ref}
            src="https://bf-static-assets.s3.amazonaws.com/videos/anim-v3-step3-done.mp4"
            className="video"
          />
          <p>
            We post the clips you choose on a regular schedule so you never have
            to think about it.
          </p>
        </div>
        <div className={stepReplay}>
          <Button
            iconLeft="back"
            kind="secondary"
            onClick={() => setReplay(replay + 1)}
            size="xlarge"
          />
          <div className="replayText" onClick={() => setReplay(replay + 1)}>
            Replay
          </div>
        </div>
      </div>
    </div>
  );
}
