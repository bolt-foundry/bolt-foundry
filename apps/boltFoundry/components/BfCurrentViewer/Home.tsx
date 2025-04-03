import { useEffect, useRef, useState } from "react";
import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { BfLogo } from "apps/bfDs/static/BfLogo.tsx";
import { useRouter } from "apps/boltFoundry/contexts/RouterContext.tsx";
import { BfDsButton } from "apps/bfDs/components/BfDsButton.tsx";
import { Plinko } from "apps/boltFoundry/pages/Plinko.tsx";
import { classnames } from "lib/classnames.ts";
import { getLogger } from "packages/logger/logger.ts";
import { BfDsForm } from "apps/bfDs/components/BfDsForm/BfDsForm.tsx";
import { BfDsFormTextInput } from "apps/bfDs/components/BfDsForm/BfDsFormTextInput.tsx";
import { BfDsFormSubmitButton } from "apps/bfDs/components/BfDsForm/BfDsFormSubmitButton.tsx";
import { useBfDs } from "apps/bfDs/hooks/useBfDs.tsx";
import type { ModalHandles } from "apps/bfDs/components/BfDsModal.tsx";
import { useMutation } from "apps/boltFoundry/hooks/isographPrototypes/useMutation.tsx";
import joinWaitlistMutation from "apps/boltFoundry/__generated__/__isograph/Mutation/JoinWaitlist/entrypoint.ts";

const logger = getLogger(import.meta);

type WaitlistFormData = {
  name: string;
  email: string;
  company: string;
};

export const Home = iso(`
  field BfCurrentViewer.Home @component {
    __typename
    asBfCurrentViewerLoggedOut {
      __typename
    }
  }
`)(function Home({ data }) {
  const { commit } = useMutation(joinWaitlistMutation);
  const { showModal } = useBfDs();
  const modalRef = useRef<ModalHandles>(null);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [playPlinko, setPlayPlinko] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { navigate } = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const loggedOut = data?.asBfCurrentViewerLoggedOut;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldPlay || !playPlinko) {
      video.currentTime = 0;
      setShowButtons(false);
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
  }, [shouldPlay, playPlinko]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime < 35) {
        setShowButtons(false);
      }
      if (video.currentTime >= 35) {
        setShowButtons(true);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [showButtons]);

  function submitWaitlistForm(value: WaitlistFormData) {
    setSubmitting(true);
    commit({ name: value.name, email: value.email, company: value.company }, {
      onError: () => {
        logger.error("Error joining waitlist");
        return showModal(
          <div>
            <h3>Oops!</h3>
            There was an error... email{" "}
            <a href="mailto:dan@boltfoundry.com">Dan</a> and we'll get in touch.
          </div>,
        );
      },
      onComplete: ({ joinWaitlist }) => {
        if (!joinWaitlist.success) {
          logger.error(joinWaitlist.message);
          return showModal(
            <div>
              <h3>Oops!</h3>
              There was an error... email{" "}
              <a href="mailto:dan@boltfoundry.com">Dan</a>{" "}
              and we'll get in touch.
            </div>,
          );
        }
        modalRef.current?.closeModal();
      },
    });
  }

  const initialFormData = {
    name: "",
    email: "",
    company: "",
  };

  const joinWaitlist = () => {
    showModal(
      <div>
        <h3>Join the waitlist</h3>
        <div style={{ marginBottom: 12 }}>We're happy to have you here.</div>
        <BfDsForm
          initialData={initialFormData}
          onSubmit={submitWaitlistForm}
          xstyle={{
            display: "flex",
            gap: 8,
            flexDirection: "column",
          }}
        >
          <BfDsFormTextInput id="name" title="What is your name?" />
          <BfDsFormTextInput id="email" title="What is your email?" />
          <BfDsFormTextInput
            id="company"
            title="Where do you work?"
          />
          <BfDsFormSubmitButton text="Submit" showSpinner={submitting} />
        </BfDsForm>
      </div>,
      modalRef,
    );
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

        <div className="appCta row-column">
          <div className="text">
            Model fine tuning that improves quality and cuts costs.
          </div>
          <BfDsButton text="Join the waitlist" onClick={joinWaitlist} />
        </div>
        {playPlinko ? <Plinko /> : (
          <div className="flex1">
            <div className="videoPlayer">
              <video
                autoPlay
                muted
                playsInline
                webkit-playsinline="true"
                preload="auto"
                x-webkit-airplay="allow"
                ref={videoRef}
                onLoadedMetadata={(e) => {
                  const video = e.target as HTMLVideoElement;
                  video.play().catch((error) => {
                    logger.error("Error playing video:", error);
                  });
                }}
                onClick={() => {
                  const video = videoRef.current;
                  if (!video) return;
                  if (video.paused) {
                    video.play();
                  }
                }}
              >
                <source
                  src="/static/assets/videos/plinko-mobile_720.mp4"
                  type="video/mp4"
                  media="(orientation: portrait) and (max-width: 400px)"
                />
                <source
                  src="/static/assets/videos/plinko-mobile_HD.mp4"
                  type="video/mp4"
                  media="(orientation: portrait) and (max-width: 800px)"
                />
                <source
                  src="/static/assets/videos/plinko_720.mp4"
                  type="video/mp4"
                  media="(orientation: landscape) and (max-width: 800px)"
                />
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
        )}
        <div className="appFooter mobile-hide">
          <BfDsButton
            kind="outline"
            text={playPlinko ? "Watch the video" : "Play the game"}
            onClick={() => setPlayPlinko(!playPlinko)}
          />
        </div>
        <div className="appFooter mobile-show">
          Play the game in your desktop browser.
        </div>
      </div>
    </>
  );
});
