/// <reference types="@types/google.accounts" />

import { useEffect, useRef, useState } from "react";
import { getConfigurationVariable } from "@bolt-foundry/get-configuration-var";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export function LoginWithGoogleButton() {
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
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleCredentialResponse = async (response: { credential: string }) => {
    setIsLoading(true);
    setError(null);
    logger.info("Google credential received", {
      hasCredential: !!response.credential,
    });

    try {
      // Send credential to backend for verification and session creation
      const loginResponse = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken: response.credential }),
      });

      if (!loginResponse.ok) {
        throw new Error(`Login failed: ${loginResponse.status}`);
      }

      const result = await loginResponse.json();
      logger.info("Login successful", result);

      // Redirect to dashboard or reload page
      globalThis.location.href = "/";
    } catch (err) {
      setIsLoading(false);
      setError("Failed to sign in with Google. Please try again.");
      logger.error("Google sign-in error:", err);
    }
  };

  // Show spinner while loading
  if (isLoading) {
    return <div>Signing in...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Show Google Sign-In button
  return (
    <div>
      <div ref={googleButtonRef}></div>
    </div>
  );
}
