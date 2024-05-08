import { React, ReactRelay } from "deps.ts";
import { Link } from "packages/client/components/Link.tsx";
import { Button } from "packages/bfDs/Button.tsx";
import { Input } from "packages/bfDs/Input.tsx";
import { MarketingFrame } from "packages/client/components/MarketingFrame.tsx";
import { Password } from "packages/bfDs/Password.tsx";

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
    marginBottom: 12,
  },
  text: {
    marginBottom: 22,
  },
};

// const forgotPasswordMutation = await graphql`
//   mutation ResetPasswordPageForgotPasswordMutation($email: String!) {
//     forgotPassword(email: $email)
//   }
// `;

// const confirmForgotPasswordMutation = await graphql`
//   mutation ResetPasswordPageConfirmForgotPasswordMutation($email: String!, $verificationCode: String!, $newPassword: String!) {
//     confirmForgotPassword(email: $email, verificationCode: $verificationCode, newPassword: $newPassword) {
//       id
//     }
//   }
// `;

export const PasswordResetForm = () => {
  const [email, setEmail] = React.useState("");
  const [verificationCode, setVerificationCode] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [codeError, setCodeError] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [codeSent, setCodeSent] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  // const [commitForgotPassword, isForgotPasswordInFlight] = useMutation(
  //   forgotPasswordMutation,
  // );
  // const [commitConfirmForgotPassword, isConfirmForgotPasswordInFlight] =
  //   useMutation(confirmForgotPasswordMutation);
  const isForgotPasswordInFlight = false;
  const isConfirmForgotPasswordInFlight = false;

  const handleForgotPassword = (event: React.FormEvent) => {
    event.preventDefault();
    if (isForgotPasswordInFlight) return;
    setCodeSent(false);

    console.log("forgotPassword");
    // commitForgotPassword({
    //   variables: { email },
    //   onCompleted: (_response, errors) => {
    //     if (errors) {
    //       const errorMessage = errors
    //         .map((e: { message: string }) => e.message)
    //         .join(", ");
    //       const message = errorMessage.replace("GraphQL Error: ", "");
    //       setCodeError(message);
    //     } else {
    //       setCodeSent(true);
    //     }
    //   },
    //   onError: (error) => {
    //     const message = error.message.replace("GraphQL Error: ", "");
    //     setCodeError(message);
    //   },
    // });
  };

  const handleConfirmForgotPassword = (event: React.FormEvent) => {
    event.preventDefault();
    if (isConfirmForgotPasswordInFlight) return;

    console.log("confirmForgotPassword");
    // commitConfirmForgotPassword({
    //   variables: { email, verificationCode, newPassword },
    //   onCompleted: (_response, errors) => {
    //     if (errors) {
    //       const errorMessage = errors
    //         .map((e: { message: string }) => e.message)
    //         .join(", ");
    //       const message = errorMessage.replace("GraphQL Error: ", "");
    //       setError(message);
    //     } else {
    //       setSuccess(true);
    //     }
    //   },
    //   onError: (error) => {
    //     const message = error.message.replace("GraphQL Error: ", "");
    //     setError(message);
    //   },
    // });
  };

  if (success) {
    return (
      <div>
        Password reset successfully! Please <Link to="/login">log in</Link>.
      </div>
    );
  }

  return (
    <>
      <div style={styles.text}>
        Please enter your email address to reset your password.
      </div>
      <form onSubmit={handleForgotPassword}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          placeholder="your@email.com"
          required
        />
        {codeError && <div style={styles.error}>{codeError}</div>}
        {codeSent
          ? (
            <div style={styles.submitButton}>
              <Button
                kind="outline"
                text="Resend code"
                type="submit"
                xstyle={{ marginInlineEnd: 12 }}
              />
            </div>
          )
          : (
            <div style={styles.submitButton}>
              <Button
                showSpinner={isForgotPasswordInFlight}
                type="submit"
                text="Reset password"
                xstyle={{ marginInlineEnd: 12 }}
              />
              Already have a code?{" "}
              <a href="#" onClick={() => setCodeSent(true)}>Enter it here</a>.
            </div>
          )}
      </form>
      {codeSent && (
        <>
          <div style={styles.text}>
            Enter the verification code that was sent to your email, along with
            your new password.
          </div>
          <form onSubmit={handleConfirmForgotPassword}>
            <Input
              meta="Click 'Resend code' above if you didn't receive it."
              label="Verification code"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.currentTarget.value)}
              placeholder="* * * * * *"
              required
            />
            <Password
              label="New password"
              value={newPassword}
              onChange={(value: string) => setNewPassword(value)}
              placeholder="Your new password"
            />
            {error && <div style={styles.error}>{error}</div>}
            <div style={styles.submitButton}>
              <Button
                showSpinner={isConfirmForgotPasswordInFlight}
                type="submit"
                text="Submit new password"
                xstyle={{ marginInlineEnd: 12 }}
              />
              Remember your password? <Link to="/login">Log in</Link>
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default function ResetPasswordPage() {
  return (
    <MarketingFrame header="Reset your password">
      <div style={styles.container}>
        <div style={styles.content}>
          <PasswordResetForm />
        </div>
      </div>
    </MarketingFrame>
  );
}
