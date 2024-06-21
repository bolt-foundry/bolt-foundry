import { graphql, React, ReactRelay } from "aws/client/deps.ts";
import Spinner from "aws/client/components/Spinner.tsx";
const { useMutation } = ReactRelay;

const styles: Record<string, React.CSSProperties> = {
  inline: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  error: {
    color: "var(--alert)",
  },
};

const resendConfirmationMutation = await graphql`
  mutation ResendConfirmationLinkMutation($email: String!) {
    resendConfirmationCode(email: $email)
  }
`;

type Props = {
  email: string;
  setError?: (error: string | null) => void;
};

export default function ResendConfirmationLink({ email }: Props) {
  const [resendConfirmation, isResending] = useMutation(
    resendConfirmationMutation,
  );
  const [error, setError] = React.useState<string | null>(null);

  const resendConfirmationCode = (event: React.MouseEvent) => {
    event.preventDefault();
    setError(null);
    if (!email) {
      setError("Email is required");
      return;
    }
    if (isResending) return;

    resendConfirmation({
      variables: { email },
      onCompleted: (_response, errors) => {
        if (errors) {
          const errorMessage = errors
            .map((e: { message: string }) => e.message)
            .join(", ");
          const message = errorMessage.replace("GraphQL Error: ", "");
          setError(message);
        } else {
          setError(null);
        }
      },
      onError: (error) => {
        const message = error.message.replace("GraphQL Error: ", "");
        setError(message);
      },
    });
  };
  return (
    <div style={styles.inline}>
      <a href="#" onClick={resendConfirmationCode}>Resend code</a>
      {isResending && <Spinner size={14} />}
      {error && (
        <div>
          - <span style={styles.error}>{error}</span>
        </div>
      )}
    </div>
  );
}
