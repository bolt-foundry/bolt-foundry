// Google Identity Services types
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (element: HTMLElement, config: {
            type?: string;
            theme?: string;
            size?: string;
            text?: string;
            shape?: string;
            logo_alignment?: string;
          }) => void;
        };
      };
    };
  }
}

import { iso } from "@iso-bfc";
import { useEffect, useRef, useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { useMutation } from "@bfmono/apps/boltfoundry-com/hooks/useMutation.tsx";
import LoginWithGoogleMutation from "@bfmono/apps/boltfoundry-com/__generated__/__isograph/Mutation/LoginWithGoogle/entrypoint.ts";

const logger = getLogger(import.meta);

export const GoogleSignInButton = iso(`
  field CurrentViewer.GoogleSignInButton @component {
    asCurrentViewerLoggedIn { __typename }
    asCurrentViewerLoggedOut { __typename }
  }
`)(function GoogleSignInButton({ data }) {
  const { commit, responseElement } = useMutation(LoginWithGoogleMutation);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    const client_id = getConfigurationVariable("GOOGLE_OAUTH_CLIENT_ID");
    if (!client_id) {
      logger.error("GOOGLE_OAUTH_CLIENT_ID is not set");
      setError(
        "Google OAuth is not configured. Please check server configuration.",
      );
      return;
    }

    // Initialize Google Identity Services when script loads
    script.onload = () => {
      if (globalThis.google && googleButtonRef.current) {
        globalThis.google.accounts.id.initialize({
          client_id,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Display the Sign In With Google button
        globalThis.google.accounts.id.renderButton(googleButtonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "left",
        });
      }
    };

    return () => {
      // Clean up script
      try {
        document.body.removeChild(script);
      } catch (_e) {
        // Script might already be removed
      }
    };
  }, []);

  const handleCredentialResponse = (response: { credential: string }) => {
    setIsLoading(true);
    setError(null);
    logger.info("Google OAuth credential received", {
      hasCredential: !!response.credential,
    });

    // Call the loginWithGoogle mutation
    commit(
      { idToken: response.credential },
      {
        onComplete: () => {
          setIsLoading(false);
          logger.info("✅ Login successful");
          // The mutation component will handle the page reload
        },
        onError: () => {
          setIsLoading(false);
          setError("Failed to sign in with Google. Please try again.");
          logger.error("Google sign-in error");
        },
      },
    );
  };

  // Show error if Google OAuth is misconfigured
  if (error) {
    return (
      <div data-testid="google-signin-error">
        <p style={{ color: "red" }}>⚠️ {error}</p>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <BfDsButton
        data-testid="google-signin-loading"
        variant="outline"
        disabled
        spinner
      >
        Signing in...
      </BfDsButton>
    );
  }

  // If already logged in, show different state
  if (data.asCurrentViewerLoggedIn) {
    return (
      <BfDsButton
        data-testid="google-signout-button"
        variant="secondary"
      >
        Sign Out
      </BfDsButton>
    );
  }

  // Show Google OAuth button container
  return (
    <div data-testid="google-signin-container">
      <div ref={googleButtonRef} data-testid="google-signin-button" />
      <p style={{ fontSize: "0.8rem", color: "#888", marginTop: "0.5rem" }}>
        Real Google OAuth button will render here
      </p>
      {responseElement}
    </div>
  );
});
