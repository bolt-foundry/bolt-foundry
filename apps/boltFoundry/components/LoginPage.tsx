import * as React from "react";
import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { BfDsForm } from "apps/bfDs/components/BfDsForm/BfDsForm.tsx";
import { BfDsFormTextInput } from "apps/bfDs/components/BfDsForm/BfDsFormTextInput.tsx";
import { BfDsFormSubmitButton } from "apps/bfDs/components/BfDsForm/BfDsFormSubmitButton.tsx";
import { useRouter } from "apps/boltFoundry/contexts/RouterContext.tsx";
import { useMutation } from "apps/boltFoundry/hooks/isographPrototypes/useMutation.tsx";
import loginMutation from "apps/boltFoundry/__generated__/__isograph/Mutation/LoginWithEmailDevCurrentViewer/entrypoint.ts";
import { getLogger } from "packages/logger/logger.ts";

const _logger = getLogger(import.meta);

type FormData = { email: string };

/* -------------------------------------------------------------------------- */
/* 1️⃣  LoginPage component                                                    */
/* -------------------------------------------------------------------------- */
export const LoginPage = iso(`
  field Query.LoginPage @component {
    __typename
  }
`)(function LoginPage() {
  const { navigate } = useRouter();
  const { commit, responseElement } = useMutation(loginMutation);

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const initialData: FormData = { email: "" };

  function handleSubmit({ email }: FormData) {
    setSubmitting(true);
    setError(null);
    commit(
      { email },
      {
        onComplete: ({ loginWithEmailDevCurrentViewer }) => {
          const typename = loginWithEmailDevCurrentViewer?.currentViewer
            ?.__typename;
          if (typename === "CurrentViewerLoggedIn") {
            navigate("/");
          } else {
            setError("Unexpected response – viewer not logged in");
          }
          setSubmitting(false);
        },
        onError: () => {
          setError("Something went wrong – please try again.");
          setSubmitting(false);
        },
      },
    );
  }

  return (
    <div className="appPage centerAll row-column mediumGap" style={{ flex: 1 }}>
      <h1>Sign in</h1>
      <BfDsForm
        initialData={initialData}
        onSubmit={handleSubmit}
        xstyle={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: 320,
        }}
      >
        <BfDsFormTextInput
          id="email"
          title="Email"
          type="email"
          placeholder="you@example.com"
          required
        />
        <BfDsFormSubmitButton
          disabled={submitting}
          showSpinner={submitting}
          text={submitting ? "Signing in…" : "Continue"}
        />
        {error && <div className="colorAlert">{error}</div>}
      </BfDsForm>
      {responseElement /* renders Isograph fragment while mutation is in flight */}
    </div>
  );
});
