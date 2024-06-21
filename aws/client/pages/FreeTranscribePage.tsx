import { React } from "aws/client/deps.ts";
import { fonts } from "aws/client/ui_components/ui_const.tsx";
import Button from "aws/client/ui_components/Button.tsx";
import Input from "aws/client/ui_components/Input.tsx";
import Spinner from "aws/client/components/Spinner.tsx";
import MarketingFrame from "aws/client/components/MarketingFrame.tsx";
const { useCallback, useEffect, useRef, useState } = React;
import { captureEvent } from "aws/events/mod.ts";
import useIntersectionObserver from "aws/client/hooks/useIntersectionObserver.tsx";
import ContactUs from "aws/client/components/ContactUs.tsx";
import {
  useFeatureFlag,
  useFeatureVariant,
} from "aws/client/hooks/featureFlagHooks.tsx";
import Icon from "aws/client/ui_components/Icon.tsx";

const styles: Record<string, React.CSSProperties> = {
  content: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    gap: "2.5vw",
    flex: 1,
    minHeight: "75vh",
  },
  titleText: {
    textAlign: "center",
    fontFamily: fonts.marketingFontFamily,
    fontWeight: 700,
  },
  bodyText: {
    fontSize: "max(16px, 1.6vw)",
    textAlign: "center",
    fontWeight: 600,
    color: "var(--textMarketing)",
  },
  disclaimerText: {
    fontSize: "18px",
    textAlign: "center",
    fontWeight: 300,
    color: "var(--textMarketing)",
  },
  signUpContainer: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    gap: 10,
  },
  blueWord: {
    background: "var(--marketingGradient)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  demoPage: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "5%",
  },
  demoContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  demoHeader: {
    fontSize: "max(24px, 2.4vw)",
    fontWeight: 500,
    color: "var(--textMarketing)",
    textAlign: "center",
  },
  demoText: {
    fontSize: "max(20px, 1.5vw)",
    margin: "5%",
    textAlign: "center",
    color: "var(--textMarketing)",
  },
  demoContainer: {
    flex: 1,
    margin: "0 auto",
    position: "relative",
  },
  video: {},
  controls: {
    position: "absolute",
    bottom: 0,
    padding: "0.5vw",
    display: "flex",
    flexDirection: "row",
    gap: "0.5vw",
  },
  input: {
    padding: "7px 15px",
    fontSize: "1.1em",
    borderRadius: 6,
    width: "100%",
  },
  mainSection: {
    flex: 1,
    gap: "2.5vw",
  },
  ctaSection: {
    alignItems: "center",
    background: "var(--verticalOpositeMarketingGradient)",
    color: "white",
    display: "flex",
    height: "15vh",
    justifyContent: "space-around",
  },
};

type Props = {
  src: string;
  showMute?: boolean;
  poster?: string;
};

function MarketingVideo(
  { src, showMute = true, poster }: Props,
): React.ReactElement {
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showControls, setShowControls] = useState(false);
  const { isVisible, domRef: videoContainerRef } = useIntersectionObserver(0.5);

  const handleShowControls = useCallback(() => {
    setShowControls(true);
  }, []);

  const handleHideControls = useCallback(() => {
    setTimeout(() => {
      setShowControls(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (isVisible) {
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  }, [isVisible]);

  useEffect(() => {
    const videoContainer = videoContainerRef.current;
    if (videoContainer) {
      videoContainer.addEventListener("mouseenter", handleShowControls);
      videoContainer.addEventListener("mouseleave", handleHideControls);
      return () => {
        videoContainer.removeEventListener("mouseenter", handleShowControls);
        videoContainer.removeEventListener("mouseleave", handleHideControls);
      };
    }
  }, [videoContainerRef, handleShowControls, handleHideControls]);

  useEffect(() => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [playing]);

  return (
    <div
      className="marketing-demo-container"
      style={styles.demoContainer}
      ref={videoContainerRef}
    >
      <video
        poster={poster}
        className="marketing-demo-video"
        ref={videoRef}
        style={styles.video}
        loop
        autoPlay
        playsInline
        muted={muted}
        src={src}
      />
      {(showControls || !playing) && (
        <div style={styles.controls}>
          <Button
            iconLeft={playing ? "pause" : "play"}
            onClick={() => setPlaying(!playing)}
            kind="overlayDark"
            role="Play/Pause"
          />
          {showMute && (
            <Button
              iconLeft={muted ? "muted" : "unmuted"}
              onClick={() => setMuted(!muted)}
              kind="overlayDark"
              role="Mute/Unmute"
            />
          )}
        </div>
      )}
    </div>
  );
}

function FreeTranscribePage(): React.ReactElement {
  const [currentModal, setCurrentModal] = useState<React.ReactNode | null>(
    null,
  );
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const enableNewSections = useFeatureFlag("landing_page_expansion");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const submitEmail = async () => {
    try {
      const response = await fetch("/email-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });
      if (response.ok) {
        // Handle successful submission, e.g., show a success message
        captureEvent("person", "submitted email");
        setEmail("");
        setSubmitting(false);
        setSubmitted(true);
      } else {
        // Handle submission error, e.g., show an error message
        captureEvent("person", "failed to submit email");
      }
    } catch (error) {
      // Handle network or other errors
      // deno-lint-ignore no-console
      console.error("Error:", error);
      captureEvent("person", "couldn't submit email", { error: error });
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitEmail();
    setSubmitting(true);
  };

  return (
    <MarketingFrame
      showLoginLink={true}
      showFooter={true}
      modal={currentModal}
      closeModal={() => setCurrentModal(null)}
    >
      <div style={styles.mainSection}>
        <div style={styles.content}>
          <div
            className="marketing-title"
            style={{ ...styles.titleText, padding: "0 11%" }}
          >
            Transcribe your videos
            <br />
            <span style={styles.blueWord}>completely free.</span>
          </div>
          <div
            className="marketing-body"
            style={{ ...styles.bodyText, marginBottom: "2%" }}
          >
            Get the most out of your videos.
            <br />
            Join the waitlist to get early access.
          </div>
          <div style={styles.signUpContainer}>
            <Input
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              style={{ ...styles.input, width: "100%" }}
            />
            <Button
              onClick={handleSubmit}
              text="Join the waitlist"
              type="submit"
              size="large"
              role="Join the waitlist"
              disabled={submitting || submitted}
            />
          </div>
          {submitted && (
            <div style={styles.disclaimerText}>
              Thanks for joining the list! We'll be in touch soon.
            </div>
          )}
        </div>
        <div style={styles.demoPage}>
          <div className="demo-content" style={styles.demoContent}>
            <div className="demo-head" style={styles.demoHeader}>
              Video to text in seconds
            </div>
            <div className="demo-text" style={styles.demoText}>
              The application is endless and the tool is free!
            </div>
          </div>
          <MarketingVideo
            showMute={false}
            src="https://bf-static-assets.s3.amazonaws.com/videos/anim-transcribe.mp4"
          />
        </div>
      </div>
    </MarketingFrame>
  );
}

export default FreeTranscribePage;
