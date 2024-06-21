import { React } from "aws/client/deps.ts";
import { fonts } from "aws/client/ui_components/ui_const.tsx";
import Button from "aws/client/ui_components/Button.tsx";
import MarketingFrame from "aws/client/components/MarketingFrame.tsx";
const { useCallback, useEffect, useRef, useState } = React;
import { captureEvent } from "aws/events/mod.ts";
import useIntersectionObserver from "aws/client/hooks/useIntersectionObserver.tsx";
import ContactUs from "aws/client/components/ContactUs.tsx";
import {
  useFeatureFlag,
  useFeatureVariant,
} from "aws/client/hooks/featureFlagHooks.tsx";
import { Pricing } from "aws/client/pages/PricingPage.tsx";
import MarketingHowDoesItWork from "aws/client/components/marketing/MarketingHowDoesItWork.tsx";
import { useAppEnvironment } from "aws/client/contexts/AppEnvironmentContext.tsx";
import MarketingTestimonial from "aws/client/components/marketing/MarketingTestimonial.tsx";
import MarketingWhyPostClips from "aws/client/components/marketing/MarketingWhyPostClips.tsx";

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
    fontSize: "12px",
    textAlign: "center",
    fontWeight: 200,
    color: "var(--textMarketing)",
    marginTop: "1vw",
  },
  signUpContainer: {
    display: "flex",
    margin: "5% 0",
    flexWrap: "wrap",
    flexDirection: "row",
    gap: 10,
  },
  blueWord: {
    background: "var(--marketingGradient)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  demoSection: {
    display: "flex",
    flexDirection: "column",
    gap: "10vh",
  },
  demoPage: {
    flex: 1,
    display: "flex",
    alignItems: "center",
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
    marginLeft: "5%",
    alignSelf: "self-start",
  },
  demoText: {
    fontSize: "max(20px, 1.5vw)",
    margin: "5%",
    textAlign: "start",
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
    padding: "7px 10px",
    fontSize: "1.1em",
    borderRadius: 6,
  },
  mainSection: {
    flex: 1,
    gap: "2.5vw",
  },
  mainButtons: {
    display: "flex",
    gap: "1vw",
    alignItems: "center",
  },
  ctaSection: {
    alignItems: "center",
    background: "var(--verticalOpositeMarketingGradient)",
    color: "white",
    display: "flex",
    height: "15vh",
    justifyContent: "space-around",
  },
  ctaSectionLoud: {
    background: "var(--fourtharyColor)",
    color: "white",
    margin: "10% 0",
  },
  CtaTitle: {
    fontSize: "max(24px, 2.2vw)",
    fontWeight: 600,
    marginBottom: "1vh",
    textAlign: "center",
  },
  useCaseSection: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: "2.5vw",
    margin: "5%",
    padding: "0 5%",
    alignItems: "center",
  },
  useCaseSectionTitle: {
    fontSize: "max(24px, 2.2vw)",
    fontWeight: 600,
    color: "var(--textMarketing)",
    marginBottom: "1vh",
  },
  useCases: {
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    gap: "2.5vw",
    padding: "0 5%",
  },
  useCase: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "5vh",
    borderRadius: "15px",
    padding: "5vh",
    flexDirection: "column",
  },
  useCaseTitle: {
    fontSize: "max(24px, 2.2vw)",
    fontWeight: 600,
    color: "white",
    marginBottom: "1vh",
    textAlign: "center",
  },
  useCaseText: {
    fontSize: "max(14px, 1.4vw)",
    fontWeight: 400,
    color: "white",
  },
  liveDemoSection: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: "2.5vw",
    padding: "5%",
    background: "var(--secondaryColor)",
    scrollMarginTop: "10vh",
  },
  liveDemoTitle: {
    fontSize: "max(24px, 2.2vw)",
    fontWeight: 600,
    color: "white",
    marginBottom: "1vh",
    textAlign: "center",
  },
  communitySection: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: "2.5vw",
    margin: "10% 5%",
    padding: "0 5%",
  },
  communityTitle: {
    fontSize: "max(24px, 2.2vw)",
    fontWeight: 600,
    color: "var(--textMarketing)",
    marginBottom: "1vh",
    textAlign: "center",
  },
  communityText: {
    fontSize: "max(14px, 1.4vw)",
    fontWeight: 400,
    color: "var(--textMarketing)",
  },
  communityLinks: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    gap: "2.5vw",
    padding: "0 5%",
  },
  grid: {
    gap: "1vw",
    padding: "0 15%",
    margin: "5% 0",
    color: "white",
  },
  gridItem: {
    borderRadius: 15,
    textAlign: "center",
    padding: "5% 3%",
  },
  marketingThird: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "30vh",
    padding: "10% 7%",
    justifyContent: "center",
  },
  scrollButton: {
    position: "absolute",
    bottom: "5vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    transform: "translateY(6vh)",
    opacity: 0,
    transition: "500ms all ease",
    cursor: "pointer",
  },
  scrollButtonVisible: {
    opacity: 1,
    transform: "translateY(0)",
  },
  faqSection: {
    scrollMarginTop: "10vh",
    display: "flex",
    flexDirection: "column",
    margin: "10% 10% 2%",
    padding: "0 5%",
  },
  faqSectionTitle: {
    fontSize: "max(24px, 2.2vw)",
    fontWeight: 600,
    color: "var(--textMarketing)",
    marginBottom: "1vh",
    textAlign: "center",
  },
  faqChunq: {
    color: "var(--textMarketing)",
    display: "flex",
    flexDirection: "column",
    padding: "2vh 0",
    borderBottom: `1px solid ${"var(--secondaryColor)"}`,
  },
  faqQuestion: {
    fontSize: "max(16px, 1.6vw)",
    fontWeight: 600,
    textAlign: "start",
    cursor: "pointer",
  },
  faqAnswer: {
    fontSize: "max(14px, 1.4vw)",
    fontWeight: 400,
    padding: "10px 0",
  },
};

type Props = {
  src: string;
  showMute?: boolean;
  poster: string;
  name: string;
};

function MarketingVideo(
  { src, showMute = true, poster, name }: Props,
): React.ReactElement {
  const { currentViewer: { id: personId } } = useAppEnvironment();
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
      captureEvent("video", "played", { name }, personId);
    } else {
      setPlaying(false);
      const video = videoRef.current;
      let percentPlayed = null;
      let stoppedAt = null;
      if (video) {
        stoppedAt = video.currentTime;
        percentPlayed = video.currentTime / video.duration;
      }
      captureEvent(
        "video",
        "paused",
        { name, percentPlayed, stoppedAt },
        personId,
      );
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

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener("ended", () => {
        captureEvent("video", "played completely", { name }, personId);
      });
    }
  }, [videoRef]);

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
            testId={`button-${playing ? "pause" : "play"}-marketing-video`}
          />
          {showMute && (
            <Button
              iconLeft={muted ? "muted" : "unmuted"}
              onClick={() => setMuted(!muted)}
              kind="overlayDark"
              role="Mute/Unmute"
              testId={`button-${muted ? "mute" : "unmute"}-marketing-video`}
            />
          )}
        </div>
      )}
    </div>
  );
}

function Marketing(): React.ReactElement {
  // if a user scrolls to the testimonials section, log it
  const { currentViewer: { id: personId } } = useAppEnvironment();
  const { isVisible, domRef: testimonialsSectionRef } =
    useIntersectionObserver();

  const enableSignup = useFeatureFlag("enable_signup");

  useEffect(() => {
    if (isVisible) {
      captureEvent("marketing", "scrolled to testimonials", {}, personId);
    }
  }, [isVisible]);

  const features = [
    {
      title: "Free transcription",
      description:
        "Transcribe any video! It's free and you can do whatever you want with it.",
      icon: "transcript",
    },
    {
      title: "Text-based editing",
      description:
        "An intuitive editing tool that will save you hours of trimming video.",
      icon: "pencil",
    },
    {
      title: "Automatic clipping",
      description:
        "Save time and even get new ideas for sharing your content with minimal effort.",
      icon: "clipping",
    },
    {
      title: "Captioning",
      description:
        "Make your videos stand out with Bolt Foundry's stunning captions.",
      icon: "subtitleSolid",
    },
    {
      title: "Auto-framing",
      description:
        "**Coming Soon** Frame your subject right where you want them. Every time.",
      icon: "autoframe",
    },
    {
      title: "Speedy encoding",
      description: "Upload your video and get back clips insanely fast.",
      icon: "computer",
    },
  ];
  const [currentModal, setCurrentModal] = useState<React.ReactNode | null>(
    null,
  );

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const enableNewSections = useFeatureFlag("landing_page_expansion");
  const [forceScroll, setForceScroll] = useState(false);

  function scrollToElement(
    className: string,
    behavior: ScrollBehavior = "smooth",
  ) {
    const element = document.querySelector(className);
    if (element) {
      element.scrollIntoView({ behavior, block: "start" });
      setForceScroll(true);
    } else {
      // deno-lint-ignore no-console
      console.log(`Element with class ${className} not found`);
    }
  }
  // this is the logic to post emails to a google sheet
  const API_ENDPOINT = "https://sheetdb.io/api/v1/twuvz4b12ocxo";

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

  const payload = useFeatureVariant("marketing_page_headline");

  // @ts-ignore - payload is not typed properly
  const lines = payload.text;
  // @ts-ignore - TODO fix these types
  const elements = lines.map(({ style, text }, index: number) => {
    return <div key={index} style={styles[style]}>{text}</div>;
  });

  const faqs = [
    {
      question: "What type of content can I clip?",
      answer: [
        "Bolt Foundry works best with videos that have audible dialogue. Even if there's music, or other background noise, we've found that as long as you can hear someone talking perceptibly, we can transcribe and create clips.",
        "We anticipate future versions of our software will use machine vision to generate clips, but right now we're focused on making clips for text heavy content. For example, standup comedy, podcasts, webinars, speeches, etc.",
      ],
    },
    {
      question: "How does it work?",
      answer:
        "We extract the audio from your video files, transcribe it, then use software to find stories and complete ideas from the transcript. We don't look at the video, we only use the audio to generate a transcript.",
    },
    {
      question: "Does my browser work?",
      answer:
        "We've found that Chrome supports most of the browser features we use. We are currently working on supporting more browsers.",
    },
    {
      question: "How secure is my content?",
      answer:
        "Video content on Bolt Foundry is encoded locally on your device, which means the video is never stored on our servers. We only use the audio to generate a transcript, which we use to identify clips. So anyway, it's quite secure.",
    },
    {
      question: "Do you own my content?",
      answer:
        "No, you own your content. We don't own your content. We don't use your content to train a model. We don't sell your data. Your content is yours. ",
    },
    {
      question: "How is this different from Opus, Munch, Vidyo, etc?",
      answer:
        "You can use Bolt Foundry to get clips faster than any other platform. Our pricing is simple and straightforward. We don't limit the number of videos you can upload per month. We let you transcribe your videos for free. It's more secure. We also like cats and hot wings. ",
    },
  ];

  const [activeIndices, setActiveIndices] = useState<Array<number>>([]);

  const handleToggle = (index: number) => {
    if (activeIndices.includes(index)) {
      setActiveIndices(activeIndices.filter((i) => i !== index));
    } else {
      setActiveIndices([...activeIndices, index]);
    }
  };
  return (
    <MarketingFrame
      showLoginLink={true}
      showFooter={true}
      modal={currentModal}
      closeModal={() => setCurrentModal(null)}
      setForceScroll={setForceScroll}
    >
      <div className="header-section" style={styles.mainSection}>
        <div style={styles.content}>
          <div
            className="marketing-title"
            style={{ ...styles.titleText, padding: "0 11%" }}
          >
            {elements}
          </div>
          <div
            className="marketing-body"
            style={{ ...styles.bodyText, marginBottom: "2%" }}
          >
            Bolt Foundry is the easiest way to manage your club’s social
            presence.
            <br />
            Just send us your shows, and we’ll do the rest.
          </div>
          <div className="row-column" style={styles.mainButtons}>
            <Button
              link="/signup"
              text={enableSignup ? "Start getting clips" : "Join the waitlist"}
              type="submit"
              size="xlarge"
              role="Sign up for free!"
              testId="button-signup-marketing-hero"
            />
          </div>
          {/* not true */}
          {
            /* <div style={{ ...styles.disclaimerText, marginTop: "-2vw" }}>
            No credit card required.
          </div> */
          }
        </div>
        <MarketingWhyPostClips />
        <MarketingHowDoesItWork />
        {enableNewSections && (
          <div style={{ ...styles.ctaSection, ...styles.ctaSectionLoud }}>
            <div
              className="cta_title"
              style={styles.CtaTitle}
            >
              Not tech-savvy? No problem. We make it easy!
            </div>
            <Button
              kind="outline"
              link="/signup"
              text={enableSignup ? "Try it" : "Join the waitlist"}
              type="submit"
              size="xlarge"
              role="Sign up for free!"
              testId="button-signup-marketing-cta-1"
            />
          </div>
        )}
        <div ref={testimonialsSectionRef}>
          <MarketingTestimonial />
        </div>
        {
          /* {enableNewSections && (
          <div className="use-case-section" style={styles.useCaseSection}>
            <div
              className="use-case-section-title"
              style={styles.useCaseSectionTitle}
            >
              Bolt Foundry is perfect for...
            </div>
            <div className="row-column" style={styles.useCases}>
              <div
                className="use-case"
                style={{
                  ...styles.useCase,
                  background:
                    `url("https://bf-static-assets.s3.amazonaws.com/pictures/use-case-comedian.png") top left/cover no-repeat, linear-gradient(180deg, ${"var(--tertiaryColor)"}, ${"var(--fourtharyColor)"})`,
                }}
              >
                <div className="use-case-title" style={styles.useCaseTitle}>
                  Comedians
                </div>
                <div className="use-case-text" style={styles.useCaseText}>
                  Turn your best bits into your best clips. Just upload a set,
                  pick your clips, download, and share. Need captions? We've got
                  that, too.
                </div>
              </div>
              <div
                className="use-case"
                style={{
                  ...styles.useCase,
                  background:
                    `url("https://bf-static-assets.s3.amazonaws.com/pictures/use-case-podcaster.png") top left/cover no-repeat, linear-gradient(180deg, ${"var(--tertiaryColor)"}, ${"var(--fourtharyColor)"})`,
                }}
              >
                <div className="use-case-title" style={styles.useCaseTitle}>
                  Podcasters
                </div>
                <div className="use-case-text" style={styles.useCaseText}>
                  Stop scrubbing through hours of footage. With Bolt Foundry you
                  can automatically find the highlights from your podcast in
                  seconds.
                </div>
              </div>
              <div
                className="use-case"
                style={{
                  ...styles.useCase,
                  background:
                    `url("https://bf-static-assets.s3.amazonaws.com/pictures/use-case-musician.png") top left/cover no-repeat, linear-gradient(180deg, ${"var(--tertiaryColor)"}, ${"var(--fourtharyColor)"})`,
                }}
              >
                <div className="use-case-title" style={styles.useCaseTitle}>
                  Creators
                </div>
                <div className="use-case-text" style={styles.useCaseText}>
                  Automatically find clips to share across social and with
                  minimal effort. Bolt Foundry is an all-in-one solution.
                </div>
              </div>
            </div>
            <Button
              onClick={() => {
                scrollToElement(".pricing-scroll");
              }}
              text="Pricing"
              type="submit"
              size="xlarge"
              role="Pricing"
              testId="button-pricing-marketing-use-cases"
            />
          </div>
        )} */
        }

        {
          /* {enableNewSections && (
          <div className="live-demo-section" style={styles.liveDemoSection}>
            <div className="live-demo-title" style={styles.liveDemoTitle}>
              Want to see Bolt Foundry in action?
            </div>
            <MarketingVideo
              showMute={true}
              src="https://bf-static-assets.s3.amazonaws.com/videos/bf_marketing_demo.mov"
              poster="https://bf-static-assets.s3.amazonaws.com/pictures/poster-upload.jpg"
              name="marketing-demo"
            />
          </div>
        )} */
        }
        {enableNewSections && (
          <div className="community-section" style={styles.communitySection}>
            <div className="marketing-title" style={styles.titleText}>
              Join the community
            </div>
            <div className="community-text" style={styles.bodyText}>
              Join our community on Discord, Instagram, TikTok, and more. <br />
              We're always looking for feedback!
            </div>
            <div className="community-links" style={styles.communityLinks}>
              <Button
                iconLeft="brand-tiktok"
                kind="gradientOverlay"
                href="https://www.tiktok.com/@bolt.foundry"
                hrefTarget="_blank"
                size="large"
                tooltip="Follow us on TikTok!"
                role="TikTok social media link"
                testId="button-tiktok-marketing-community"
              />
              <Button
                iconLeft="brand-instagram"
                kind="gradientOverlay"
                href="https://www.instagram.com/boltfoundry/"
                hrefTarget="_blank"
                size="large"
                tooltip="Follow us on Instagram!"
                role="Instagram social media link"
                testId="button-instagram-marketing-community"
              />
              <Button
                iconLeft="brand-threads"
                kind="gradientOverlay"
                href="https://www.threads.net/@boltfoundry"
                hrefTarget="_blank"
                size="large"
                tooltip="Follow us on Threads!"
                role="Threads social media link"
                testId="button-threads-marketing-community"
              />
              <Button
                iconLeft="brand-discord"
                kind="gradientOverlay"
                href="https://discord.gg/hzCW3Ygx7f"
                hrefTarget="_blank"
                size="large"
                tooltip="Join our Discord!"
                tooltipPosition="top"
                tooltipJustification="end"
                role="Discord social media link"
                testId="button-discord-marketing-community"
              />
            </div>
          </div>
        )}
        {
          /* {enableNewSections && (
          <div className="feature-grid" style={styles.grid}>
            {features.map((feature, index) => (
              <div
                className="feature-square"
                key={index}
                style={styles.gridItem}
              >
                <h3>
                  <span style={{ marginRight: 8 }}>
                    <Icon name={feature.icon as IconType} color="white" />
                  </span>{" "}
                  {feature.title}
                </h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        )} */
        }
        <Pricing setCurrentModal={setCurrentModal} />
        {/* needs updating */}

        {
          /* {enableNewSections && (
          <div className="faq-section" style={styles.faqSection}>
            <div style={styles.faqSectionTitle}>FAQs</div>
            {faqs.map((faq, index) => {
              let answer: React.ReactElement | Array<React.ReactElement> = (
                <p>{faq.answer}</p>
              );
              if (Array.isArray(faq.answer)) {
                answer = faq.answer.map((paragraph, index) => {
                  return <p key={index}>{paragraph}</p>;
                });
              }
              return (
                <div
                  key={index}
                  style={styles.faqChunq}
                  onClick={() => handleToggle(index)}
                >
                  <div
                    className="faq-question"
                    style={styles.faqQuestion}
                  >
                    {faq.question}

                    <div style={{ float: "right" }}>
                      {activeIndices.includes(index) ? "-" : "+"}
                    </div>
                  </div>
                  {activeIndices.includes(index) && (
                    <div
                      className="faq-answer"
                      style={styles.faqAnswer}
                    >
                      {answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )} */
        }
        {enableNewSections
          ? (
            <div
              className="marketingThird"
              style={{
                ...styles.marketingThird,
                color: "black",
              }}
            >
              <div
                className="marketing-title"
                style={{
                  ...styles.titleText,
                  marginBottom: "3%",
                }}
              >
                Reach out!
              </div>
              <div
                className="marketing-body"
                style={{
                  ...styles.bodyText,
                  marginBottom: "2%",
                }}
              >
                Contact us for a live demo or to learn more about Bolt Foundry.
                {" "}
                <br />
                You can also opt in to test new features on special beta-tier
                pricing.
              </div>
              <Button
                text="Contact us!"
                type="submit"
                size="xlarge"
                role="Contact us!"
                onClick={() => setCurrentModal(<ContactUs />)}
                testId="button-contact-us"
              />
            </div>
          )
          : (
            <div className="marketingThird" style={styles.marketingThird}>
              <div
                className="marketing-title"
                style={{ ...styles.titleText, marginBottom: "3%" }}
              >
                More Clips. Less Time.
                <br />
                <span style={styles.blueWord}>No Effort.</span>
              </div>
              <Button
                kind="accent"
                link="/signup"
                text="Sign up for free!"
                type="submit"
                size="xlarge"
                role="Sign up for free!"
                testId="button-signup-marketing-cta-2"
              />
              <div style={{ ...styles.disclaimerText, marginBottom: "2%" }}>
                Not convinced yet?{" "}
                <a
                  href="#"
                  onClick={() => setCurrentModal(<ContactUs />)}
                  aria-describedby="contact us"
                  data-bf-testid="link-contact-us"
                >
                  Contact us
                </a>{" "}
                for a demo.
              </div>
            </div>
          )}

        <div
          style={{
            ...styles.scrollButton,
            ...(forceScroll && styles.scrollButtonVisible),
          }}
        >
          <Button
            onClick={() => {
              scrollToElement(".header-section");
              setForceScroll(false);
            }}
            kind="outline"
            text="Scroll to Top"
            type="submit"
            shadow={true}
            size="xlarge"
            role="Scroll to Top"
            testId="button-scroll-to-top-marketing"
          />
        </div>
      </div>
    </MarketingFrame>
  );
}

export default Marketing;
