import { React } from "aws/client/deps.ts";
import Button from "aws/client/ui_components/Button.tsx";
import ContactUs from "aws/client/components/ContactUs.tsx";
import MarketingFrame from "aws/client/components/MarketingFrame.tsx";
import Icon from "aws/client/ui_components/Icon.tsx";

const useState = React.useState;

interface PlanProps {
  plan: PlanObject;
}

export type PlanObject = {
  name: string;
  title: string;
  price: string;
  features: string[];
};
export type PlanType = keyof typeof plans;

const styles: Record<string, React.CSSProperties> = {
  pricingSection: {
    scrollMarginTop: "10vh",
    background: "var(--fourtharyColor)",
    display: "flex",
    flexDirection: "column",
    padding: "3vw 0",
  },
  mainTitle: {
    fontFamily: "Ubuntu",
    fontSize: "max(24px, 5vw)",
    textAlign: "center",
    marginTop: 0,
  },
  mainBody: {
    fontSize: "max(16px, 3vw)",
    textAlign: "center",
  },
  content: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
    textAlign: "center",
    padding: "20px 60px",
    gap: 20,
    flex: 1,
    margin: "5% 0",
    background: "var(--fourtharyColor)",
    height: "50vh",
  },
  bullet: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  featureName: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  pricingContainer: {
    flex: 1,
    border: "2px solid var(--background)",
    borderRadius: 15,
    display: "flex",
    flexDirection: "column",
    padding: 14,
    alignItems: "stretch",
    boxSizing: "border-box",
    background: "var(--background)",
  },
  pricingContent: {
    flex: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  pricingTitle: {
    fontWeight: 700,
    fontSize: "max(18px, 3vw)",
  },
  price: {
    color: "var(--secondaryColor)",
    borderRadius: 12,
    padding: "0 2%",
    margin: "0 12px 20px",
    fontSize: "max(12px, 1.8vw)",
  },
  pricingBody: {
    textAlign: "left",
    margin: "0 5%",
    alignSelf: "start",
    fontSize: "max(14px, 1.6vw)",
  },
  tag: {
    color: "var(--secondaryColor)",
    background: "var(--transparentSecondary)",
    fontSize: "max(10px, 0.8vw)",
    textTransform: "uppercase",
    fontWeight: 600,
    display: "inline-block",
    marginBottom: 6,
    padding: 3,
    borderRadius: 6,
  },
};

function WelcomeModal() {
  return (
    <>
      <h1 style={styles.mainTitle}>
        Welcome to Bolt Foundry
      </h1>
      <h3 style={styles.mainBody}>
        We're so glad you got an invite link to be one of our first users! We're
        still in beta, so please let us know if you have any feedback!
        <br />
        Choose a plan to get started.
      </h3>
    </>
  );
}

export function Plan({ plan }: PlanProps) {
  return (
    <div style={styles.pricingContent}>
      <div style={styles.pricingTitle}>{plan.title}</div>
      <div style={styles.price}>{plan.price}</div>
      <div style={styles.pricingBody}>
        {plan.features.map((feature) => {
          const isComingSoon = feature.startsWith("[Coming Soon]");
          const featureName = feature.replace("[Coming Soon]", "");
          return (
            <div key={feature} style={styles.bullet}>
              <div style={{ minWidth: 16 }}>
                <Icon
                  name="checkCircle"
                  color={"var(--secondaryColor)"}
                // size={24}
                />
              </div>
              <div style={styles.featureName}>
                {featureName}
                {isComingSoon && (
                  <div style={styles.tag}>
                    Coming Soon
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const plans = {
  starter: {
    name: "Starter",
    title: "Starter",
    price: "$399/mo",
    features: [
      "Up to 12 hours of video uploaded",
      "30+ clips",
      "Captions and custom font",
      "Full-service clipping and editing",
    ],
  },
  standard: {
    name: "Standard",
    title: "Standard",
    price: "$599/mo",
    features: [
      "Up to 20 hours of video uploaded",
      "30+ clips",
      "Captions and custom font",
      "Custom logo",
      "[Coming Soon]Backend interface for clip approval and sharing",
      "Managed posting to all social media platforms",
    ],
  },
  custom: {
    name: "Custom",
    title: "Custom",
    price: "Contact us for pricing",
    features: [
      "Need more or less than Standard or Starter?",
      "We can consult on paid promotion and content marketing.",
      "We can even work with you on-site to set up your space for video production.",
      "Contact us to get a custom plan.",
    ],
  },
};

type PricingProps = {
  setCurrentModal: (modal: React.ReactNode | null) => void;
};

function PricingGuts({ setCurrentModal }: PricingProps) {
  const ContactUsButton = () => {
    return (
      <Button
        kind="secondary"
        text="Contact us"
        type="submit"
        onClick={() => setCurrentModal(<ContactUs />)}
        testId="button-contact-us-pro-pricing"
      />
    );
  };

  return (
    <div className="pricing-scroll" style={styles.pricingSection}>
      <div
        style={{
          ...styles.pricingTitle,
          textAlign: "center",
          color: "white",
        }}
      >
        Plans and pricing
      </div>
      <div className="row-column" style={styles.content}>
        <div
          className="marketing-pricing-container"
          style={styles.pricingContainer}
        >
          <Plan plan={plans.starter} />
          <div>
            <ContactUsButton />
          </div>
        </div>
        <div
          className="marketing-pricing-container"
          style={styles.pricingContainer}
        >
          <Plan plan={plans.standard} />
          <div>
            <ContactUsButton />
          </div>
        </div>
        <div
          className="marketing-pricing-container"
          style={styles.pricingContainer}
        >
          <Plan plan={plans.custom} />
          <div>
            <ContactUsButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const [currentModal, setCurrentModal] = useState<React.ReactNode | null>(
    null,
  );

  return (
    <MarketingFrame
      showFooter={true}
      modal={currentModal}
      closeModal={() => setCurrentModal(null)}
    >
      <PricingGuts setCurrentModal={setCurrentModal} />
    </MarketingFrame>
  );
}

export function Pricing(
  { setCurrentModal }: {
    setCurrentModal: (modal: React.ReactNode | null) => void;
  },
) {
  return (
    <div className="pricing-scroll" style={styles.pricingSection}>
      <PricingGuts setCurrentModal={setCurrentModal} />
    </div>
  );
}
