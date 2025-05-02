import * as React from "react";
import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { BfDsForm } from "apps/bfDs/components/BfDsForm/BfDsForm.tsx";
import { BfDsFormTextInput } from "apps/bfDs/components/BfDsForm/BfDsFormTextInput.tsx";
import { BfDsFormSubmitButton } from "apps/bfDs/components/BfDsForm/BfDsFormSubmitButton.tsx";
import { useMutation } from "apps/boltFoundry/hooks/isographPrototypes/useMutation.tsx";
import loginMutation from "apps/boltFoundry/__generated__/__isograph/Mutation/LoginWithEmailDevCurrentViewer/entrypoint.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

type FormData = { email: string };

/* -------------------------------------------------------------------------- */
/* 1️⃣  LoginPage component                                                    */
/* -------------------------------------------------------------------------- */
export const LoginPage = iso(`
  field Query.LoginPage @component {
    currentViewer {
      __typename
      LoginWithGoogleButton
      asCurrentViewerLoggedIn {
        __typename
      }
    }
  }
`)(function LoginPage({ data }) {
  const { commit, responseElement } = useMutation(loginMutation);

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const initialData: FormData = { email: "" };

  function handleSubmit({ email }: FormData) {
    logger.debug("handleSubmit", { email });
    setSubmitting(true);
    setError(null);
    commit(
      { email },
      {
        onComplete: () => {
          setSubmitting(false);
        },
        onError: () => {
          setError("Something went wrong – please try again.");
          setSubmitting(false);
        },
      },
    );
  }
  logger.info(data);
  if (responseElement) {
    return <div>{responseElement}</div>;
  }

  if (data.currentViewer.asCurrentViewerLoggedIn?.__typename) {
    return <div>logged in as {data.currentViewer.__typename}</div>;
  }

  const LoginWithGoogleButton = data.currentViewer.LoginWithGoogleButton ??
    (() => null);

  return (
    <>
      <LoginWithGoogleButton />;

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
    </>
  );
});
