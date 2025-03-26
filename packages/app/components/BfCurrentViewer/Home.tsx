import { useEffect, useRef, useState } from "react";
import { iso } from "packages/app/__generated__/__isograph/iso.ts";
import { BfLogo } from "packages/bfDs/static/BfLogo.tsx";
import { useRouter } from "packages/app/contexts/RouterContext.tsx";
import { BfDsButton } from "packages/bfDs/components/BfDsButton.tsx";
import { classnames } from "lib/classnames.ts";
import { getLogger } from "packages/logger.ts";

const logger = getLogger(import.meta);

export const Home = iso(`
  field BfCurrentViewer.Home @component {
    __typename
    asBfCurrentViewerLoggedOut {
      __typename
    }
  }
`)(function Home({ data }) {
  const [shouldPlay, setShouldPlay] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const { navigate } = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const loggedOut = data?.asBfCurrentViewerLoggedOut;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldPlay) {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setShouldPlay(false);
          })
          .catch((error) => {
            logger.error("Error playing video: ", error);
          });
      }
    }
  }, [shouldPlay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime < 35 && showButtons) {
        setShowButtons(false);
      }
      if (video.currentTime >= 35 && !showButtons) {
        setShowButtons(true);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [showButtons]);

  const joinWaitlist = () => {
    logger.info("Join waitlist");
  };

  const videoContainerClasses = classnames([
    "videoPlayerButtonsContainer",
    {
      active: showButtons,
    },
  ]);

  return (
    <>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
      />
      <div className="appPage">
        <div className="appHeader">
          <div className="flex1">
            <div className="appHeaderLogo">
              <BfLogo boltColor="blpack" foundryColor="black" />
            </div>
          </div>
          {loggedOut && (
            <BfDsButton
              kind="outline"
              text="Login"
              onClick={() => navigate("/login")}
            />
          )}
        </div>

        <div className="appCta">
          <div className="text">
            Model fine tuning that improves quality and cuts costs.
          </div>
          <BfDsButton text="Join the waitlist" onClick={joinWaitlist} />
        </div>

        <div className="videoPlayer">
          <video autoPlay muted ref={videoRef}>
            <source
              src="/static/assets/videos/plinko_4k.mp4"
              type="video/mp4"
              media="(min-width: 2000px)"
            />
            <source
              src="/static/assets/videos/plinko_hd.mp4"
              type="video/mp4"
              media="(min-width: 1000px)"
            />
            <source
              src="/static/assets/videos/plinko_720.mp4"
              type="video/mp4"
            />
          </video>
          <div className={videoContainerClasses}>
            <div className="videoPlayerButtons">
              <BfDsButton
                iconLeft="back"
                kind="outline"
                text="Replay"
                onClick={() => setShouldPlay(true)}
              />
              <BfDsButton text="Join the waitlist" onClick={joinWaitlist} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
