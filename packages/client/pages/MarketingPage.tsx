import { React } from "deps.ts";
import { fonts } from "packages/bfDs/const.tsx";
import { useIntersectionObserver } from "packages/client/hooks/useIntersectionObserver.ts";
import { Button } from "packages/bfDs/Button.tsx";
import { MarketingFrame } from "packages/client/components/MarketingFrame.tsx";
import {MarketingHero} from "packages/client/components/MarketingHero.tsx";
import {useFeatureFlag} from "packages/client/hooks/featureFlagHooks.ts";
import MarketingTestimonial from "packages/client/components/MarketingTestimonial.tsx";
import {MarketingIGHscroll} from "packages/client/components/MarketingIGHscroll.tsx";
import {MarketingCallToAction} from "packages/client/components/MarketingCallToAction.tsx";

const {useState} = React;

const styles: Record<string, React.CSSProperties> = {
  // content: {
  //   display: "flex",
  //   alignItems: "center",
  //   flexDirection: "column",
  //   justifyContent: "center",
  //   gap: "2.5vw",
  //   flex: 1,
  //   minHeight: "75vh",
  // },
  // bodyText: {
  //   fontSize: "max(16px, 1.6vw)",
  //   textAlign: "center",
  //   fontWeight: 600,
  //   color: "var(--textMarketing)",
  // },
  // disclaimerText: {
  //   fontSize: "12px",
  //   textAlign: "center",
  //   fontWeight: 200,
  //   color: "var(--textMarketing)",
  //   marginTop: "1vw",
  // },
  // signUpContainer: {
  //   display: "flex",
  //   margin: "5% 0",
  //   flexWrap: "wrap",
  //   flexDirection: "row",
  //   gap: 10,
  // },
  
  // demoSection: {
  //   display: "flex",
  //   flexDirection: "column",
  //   gap: "10vh",
  // },
  // demoPage: {
  //   flex: 1,
  //   display: "flex",
  //   alignItems: "center",
  // },
  // demoContent: {
  //   flex: 1,
  //   display: "flex",
  //   flexDirection: "column",
  //   alignItems: "center",
  // },
  // demoHeader: {
  //   fontSize: "max(24px, 2.4vw)",
  //   fontWeight: 500,
  //   color: "var(--textMarketing)",
  //   marginLeft: "5%",
  //   alignSelf: "self-start",
  // },
  // demoText: {
  //   fontSize: "max(20px, 1.5vw)",
  //   margin: "5%",
  //   textAlign: "start",
  //   color: "var(--textMarketing)",
  // },
  // demoContainer: {
  //   flex: 1,
  //   margin: "0 auto",
  //   position: "relative",
  // },
  // video: {},
  // controls: {
  //   position: "absolute",
  //   bottom: 0,
  //   padding: "0.5vw",
  //   display: "flex",
  //   flexDirection: "row",
  //   gap: "0.5vw",
  // },
  // input: {
  //   padding: "7px 10px",
  //   fontSize: "1.1em",
  //   borderRadius: 6,
  // },
  // mainSection: {
  //   flex: 1,
  //   gap: "2.5vw",
  // },
  // mainButtons: {
  //   display: "flex",
  //   gap: "1vw",
  //   alignItems: "center",
  // },
  
  // useCaseSection: {
  //   display: "flex",
  //   flex: 1,
  //   flexDirection: "column",
  //   gap: "2.5vw",
  //   margin: "5%",
  //   padding: "0 5%",
  //   alignItems: "center",
  // },
  // useCaseSectionTitle: {
  //   fontSize: "max(24px, 2.2vw)",
  //   fontWeight: 600,
  //   color: "var(--textMarketing)",
  //   marginBottom: "1vh",
  // },
  // useCases: {
  //   display: "flex",
  //   justifyContent: "center",
  //   alignItems: "stretch",
  //   gap: "2.5vw",
  //   padding: "0 5%",
  // },
  // useCase: {
  //   flex: 1,
  //   display: "flex",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   gap: "5vh",
  //   borderRadius: "15px",
  //   padding: "5vh",
  //   flexDirection: "column",
  // },
  // useCaseTitle: {
  //   fontSize: "max(24px, 2.2vw)",
  //   fontWeight: 600,
  //   color: "white",
  //   marginBottom: "1vh",
  //   textAlign: "center",
  // },
  // useCaseText: {
  //   fontSize: "max(14px, 1.4vw)",
  //   fontWeight: 400,
  //   color: "white",
  // },
  // liveDemoSection: {
  //   display: "flex",
  //   flex: 1,
  //   flexDirection: "column",
  //   gap: "2.5vw",
  //   padding: "5%",
  //   background: "var(--secondaryColor)",
  //   scrollMarginTop: "10vh",
  // },
  // liveDemoTitle: {
  //   fontSize: "max(24px, 2.2vw)",
  //   fontWeight: 600,
  //   color: "white",
  //   marginBottom: "1vh",
  //   textAlign: "center",
  // },
  // communitySection: {
  //   display: "flex",
  //   flex: 1,
  //   flexDirection: "column",
  //   gap: "2.5vw",
  //   margin: "10% 5%",
  //   padding: "0 5%",
  // },
  // communityTitle: {
  //   fontSize: "max(24px, 2.2vw)",
  //   fontWeight: 600,
  //   color: "var(--textMarketing)",
  //   marginBottom: "1vh",
  //   textAlign: "center",
  // },
  // communityText: {
  //   fontSize: "max(14px, 1.4vw)",
  //   fontWeight: 400,
  //   color: "var(--textMarketing)",
  // },
  // communityLinks: {
  //   display: "flex",
  //   flexDirection: "row",
  //   justifyContent: "center",
  //   alignItems: "stretch",
  //   gap: "2.5vw",
  //   padding: "0 5%",
  // },
  // grid: {
  //   gap: "1vw",
  //   padding: "0 15%",
  //   margin: "5% 0",
  //   color: "white",
  // },
  // gridItem: {
  //   borderRadius: 15,
  //   textAlign: "center",
  //   padding: "5% 3%",
  // },
  
  // scrollButton: {
  //   position: "absolute",
  //   bottom: "5vh",
  //   width: "100%",
  //   display: "flex",
  //   justifyContent: "center",
  //   transform: "translateY(6vh)",
  //   opacity: 0,
  //   transition: "500ms all ease",
  //   cursor: "pointer",
  // },
  // scrollButtonVisible: {
  //   opacity: 1,
  //   transform: "translateY(0)",
  // },
  // faqSection: {
  //   scrollMarginTop: "10vh",
  //   display: "flex",
  //   flexDirection: "column",
  //   margin: "10% 10% 2%",
  //   padding: "0 5%",
  // },
  // faqSectionTitle: {
  //   fontSize: "max(24px, 2.2vw)",
  //   fontWeight: 600,
  //   color: "var(--textMarketing)",
  //   marginBottom: "1vh",
  //   textAlign: "center",
  // },
  // faqChunq: {
  //   color: "var(--textMarketing)",
  //   display: "flex",
  //   flexDirection: "column",
  //   padding: "2vh 0",
  //   borderBottom: `1px solid ${"var(--secondaryColor)"}`,
  // },
  // faqQuestion: {
  //   fontSize: "max(16px, 1.6vw)",
  //   fontWeight: 600,
  //   textAlign: "start",
  //   cursor: "pointer",
  // },
  // faqAnswer: {
  //   fontSize: "max(14px, 1.4vw)",
  //   fontWeight: 400,
  //   padding: "10px 0",
  // },
};

type Props = {
  src: string;
  showMute?: boolean;
  poster: string;
  name: string;
};

export function Marketing(): React.ReactElement {
  // if a user scrolls to the testimonials section, log it
  const { isVisible, domRef: testimonialsSectionRef } =
    useIntersectionObserver();

  const enableSignup = useFeatureFlag("enable_signup");
  const enableGoogleLogin = useFeatureFlag("enable_google_login");
  
  const [currentModal, setCurrentModal] = useState<React.ReactNode | null>(
    null,
  );
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
        setEmail("");
        setSubmitting(false);
        setSubmitted(true);
      } else {
        // something
      }
    } catch (error) {
      // Handle network or other errors
      // deno-lint-ignore no-console
      console.error("Error:", error);
      // captureEvent("person", "couldn't submit email", { error: error });
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitEmail();
    setSubmitting(true);
  };

  return (
    <MarketingFrame
      showLoginLink={enableGoogleLogin}
      showFooter={true}
      modal={currentModal}
      closeModal={() => setCurrentModal(null)}
    >
      <div className="header-section" style={styles.mainSection}>
        <MarketingHero />
        <MarketingIGHscroll />
        <MarketingTestimonial />
        {/* <MarketingCallToAction /> */}
      </div>
    </MarketingFrame>
  );
}
