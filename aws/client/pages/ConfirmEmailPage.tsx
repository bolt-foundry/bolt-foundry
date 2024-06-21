import { graphql, React, ReactRelay } from "aws/client/deps.ts";

import Button from "aws/client/ui_components/Button.tsx";
import Input from "aws/client/ui_components/Input.tsx";
import { Link } from "aws/client/components/Link.tsx";
import MarketingFrame from "aws/client/components/MarketingFrame.tsx";

import { useAppEnvironment } from "aws/client/contexts/AppEnvironmentContext.tsx";
import { useRouter } from "aws/client/contexts/RouterContext.tsx";
import { captureEvent } from "aws/events/mod.ts";
import ResendConfirmationLink from "aws/client/components/ResendConfirmationLink.tsx";

const { useEffect } = React;
const { useMutation } = ReactRelay;

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: "auto",
    padding: "0 10%",
  },
  content: {
    width: "60vw",
    maxWidth: "100%",
  },
  error: {
    background: "var(--backgroundAlert)",
    padding: 12,
    borderRadius: 8,
    border: "1px solid var(--alert)",
    color: "var(--textOnDark)",
  },
  submitButton: {
    marginTop: 22,
  },
  text: {
    marginBottom: 22,
  },
};

const confirmEmailMutation = await graphql`
  mutation ConfirmEmailPageMutation($email: String!, $password: String!, $confirmationCode: String!) {
    confirmEmail(email: $email, password: $password, confirmationCode: $confirmationCode) {
      id
      name
    }
  }
`;

const ConfirmEmailForm = () => {
  const { queryParams, navigate } = useRouter();
  const [confirmationCode, setConfirmationCode] = React.useState(
    queryParams?.confirmationCode || "",
  );
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [commit, isInFlight] = useMutation(confirmEmailMutation);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isInFlight) return;

    commit({
      variables: { email, password, confirmationCode },
      onCompleted: (_response, errors) => {
        if (errors) {
          const errorMessage = errors
            .map((e: { message: string }) => e.message)
            .join(", ");
          const message = errorMessage.replace("GraphQL Error: ", "");
          setError(message);
        } else {
          setSuccess(true);
          setTimeout(() => {
            globalThis.location.href = "/stripe-portal";
          }, 1000);
        }
      },
      onError: (error) => {
        const message = error.message.replace("GraphQL Error: ", "");
        setError(message);
      },
    });
  };

  if (success) {
    return <div>Email confirmed successfully!</div>;
  }

  return (
    <>
      <div style={styles.text}>
        Thanks for signing up! Look for a confirmation email from us with your
        verification code.
      </div>
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          placeholder="your@email.com"
          required
        />
        <Input
          label="Confirmation code"
          type="text"
          meta={<ResendConfirmationLink email={email} />}
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.currentTarget.value)}
          placeholder="* * * * * *"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          placeholder="Your password"
          required
        />
        {error && <div style={styles.error}>{error}</div>}
        <div style={styles.submitButton}>
          <Button
            showSpinner={isInFlight}
            type="submit"
            text="Log in"
            xstyle={{ marginInlineEnd: 12 }}
          />
          Need an account? <Link to="/signup">Sign up</Link>
        </div>
      </form>
    </>
  );
};

export default function ConfirmEmailPage() {
  const { currentViewer: { id: personId } } = useAppEnvironment();

  useEffect(() => {
    captureEvent("confirmEmailPage", "loaded", {}, personId);
  }, []);

  return (
    <MarketingFrame header="Confirm your email address">
      <div style={styles.container}>
        <div style={styles.content}>
          <ConfirmEmailForm />
        </div>
      </div>
    </MarketingFrame>
  );
}
