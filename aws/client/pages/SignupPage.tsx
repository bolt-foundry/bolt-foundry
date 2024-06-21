import { graphql, React, ReactRelay } from "aws/client/deps.ts";
import MarketingFrame from "aws/client/components/MarketingFrame.tsx";
import { textStyles } from "aws/client/ui_components/ui_const.tsx";
import Input from "aws/client/ui_components/Input.tsx";
import Button from "aws/client/ui_components/Button.tsx";
import { Link } from "aws/client/components/Link.tsx";
import { useAppEnvironment } from "aws/client/contexts/AppEnvironmentContext.tsx";
import {
  Plan,
  PlanObject,
  plans,
  PlanType,
} from "aws/client/pages/PricingPage.tsx";
import Spinner from "aws/client/components/Spinner.tsx";
import { useRouter } from "aws/client/contexts/RouterContext.tsx";
import Tooltip from "aws/client/ui_components/Tooltip.tsx";
import { captureEvent } from "aws/events/mod.ts";
import Password from "aws/client/ui_components/Password.tsx";
import { useFeatureFlag } from "aws/client/hooks/featureFlagHooks.tsx";
import ContactUs from "aws/client/components/ContactUs.tsx";

const { useEffect } = React;
const { useMutation } = ReactRelay;

const styles: Record<string, React.CSSProperties> = {
  bullets: {
    flex: "auto",
  },
  bullet: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    fontSize: 18,
    marginBottom: 8,
  },
  container: {
    flex: "auto",
    padding: "0 10%",
  },
  content: {
    width: "100%",
  },
  error: {
    background: "var(--backgroundAlert)",
    padding: 12,
    borderRadius: 8,
    border: "1px solid var(--alert)",
    color: "var(--textOnDark)",
  },
  form: {
    flex: 2,
  },
  meta: {
    color: "var(--textSecondary)",
    marginBottom: 12,
  },
  plan: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "var(--pageBackground)",
    padding: 30,
    borderRadius: 8,
  },
  planButton: {
    display: "flex",
    justifyContent: "flex-end",
  },
  planTitle: {
    ...textStyles.h2,
  },
  submitButton: {
    alignItems: "center",
    display: "flex",
    gap: 12,
    marginTop: 22,
  },
};

const signupMutation = await graphql`
  mutation SignupPageMutation($name: String!, $email: String!, $password: String!, $intendedSubscriptionTier: String!) {
    signup(name: $name, email: $email, password: $password, intendedSubscriptionTier: $intendedSubscriptionTier) {
      id
      name
    }
  }
`;

function RenderSignupPage() {
  const { routeParams } = useRouter();
  const { plan } = routeParams;
  const [state, setState] = React.useState({
    name: "",
    email: "",
    password: "",
    isValid: false,
  });

  const [selectedPlan, setSelectedPlan] = React.useState<PlanObject | null>(
    // @ts-expect-error #techdebt
    plans.free,
  );
  const [error, setError] = React.useState<string | null>(null);
  const [commit, isInFlight] = useMutation(signupMutation);

  useEffect(() => {
    if (plan && plan in plans) {
      setSelectedPlan(plans[plan as PlanType]);
    }
  }, [plan]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isInFlight) return;
    setError(null);

    const variables = {
      name: state.name,
      email: state.email,
      password: state.password,
      intendedSubscriptionTier: selectedPlan?.name ?? "free",
    };
    if (state.isValid) {
      captureEvent("signupPage", "password meets requirements", {
        plan: selectedPlan?.name,
      });
    }

    commit({
      variables,
      onCompleted: (_response, errors) => {
        if (errors) {
          const errorMessage = errors.map((e: { message: string }) => e.message)
            .join(", ");
          setError(errorMessage);
        } else {
          window.location.assign("/verify"); // TODO fix navigate() in RouterContext
        }
      },
      onError: (error) => {
        // remove "GraphQL Error: " from the beginning of the error message if it exists
        error.message = error.message.replace("GraphQL Error: ", "");
        setError(error.message);
      },
    });
  };

  return (
    <MarketingFrame header="Let's get clippin'" showFooter={true}>
      <div style={styles.container}>
        <div className="row-column" style={styles.content}>
          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.meta}>
              {/* TODO links to TOS and PP */}
              By signing up you agree to our <a href="#">Terms of Service</a>
              {" "}
              and <a href="#">Privacy Policy</a>
            </div>
            <Input
              label="Name"
              value={state.name}
              onChange={(e) =>
                setState({ ...state, name: e.currentTarget.value })}
              placeholder="Your name"
              required={true}
            />
            <Input
              label="Email"
              type="email"
              value={state.email}
              onChange={(e) =>
                setState({ ...state, email: e.currentTarget.value })}
              placeholder="Your email"
              required={true}
            />
            <Password
              value={state.password}
              onChange={(value: string) =>
                setState({ ...state, password: value })}
              setIsValid={(isValid: boolean) => setState({ ...state, isValid })}
            />
            {error && <div style={styles.error}>{error}</div>}
            <div className="row-column" style={styles.submitButton}>
              <div style={{ minWidth: 70 }}>
                <Button
                  showSpinner={isInFlight}
                  type="submit"
                  text="Sign up"
                />
              </div>
              <div>
                Already have an account? <Link to="/login">Log in</Link>
              </div>
            </div>
          </form>
          {selectedPlan != null && (
            <div style={styles.plan}>
              <Plan plan={selectedPlan} />

              <div style={styles.planButton}>
                <Button
                  text="Choose another plan"
                  kind="overlay"
                  href="/pricing"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </MarketingFrame>
  );
}

function RenderInterestForm() {
  return (
    <MarketingFrame header="Join waitlist" showFooter>
      <div style={styles.container}>
        <div style={styles.content}>
          <div>
            <p>
              Are you interested in learing more? Fill out the form and we'll
              add you to our waitlist. We will reach out to you when we are
              ready for you to start clipping.
            </p>
          </div>
          <div style={{ flex: 1 }}>
            <ContactUs showHeader={false} />
          </div>
        </div>
      </div>
    </MarketingFrame>
  );
}

export default function SignupPage() {
  const enableSignup = useFeatureFlag("enable_signup");
  return enableSignup ? <RenderSignupPage /> : <RenderInterestForm />;
}
