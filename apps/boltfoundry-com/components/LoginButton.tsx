import { iso } from "@iso-bfc";
import { BfDsButton } from "@bfmono/apps/bfDs/index.ts";
import { useState } from "react";

export const LoginButton = iso(`
  field Query.LoginButton @component {
    __typename
  }
`)(function LoginButton({ data }) {
  const [loginState, setLoginState] = useState<"idle" | "loading" | "success">("idle");

  const handleGoogleLogin = async () => {
    setLoginState("loading");

    try {
      // For now, just simulate getting a Google token
      // In a real implementation, this would use the Google Identity Services API
      const mockIdToken = "mock-id-token-123";
      
      // Call the loginWithGoogle mutation via GraphQL
      const response = await fetch("/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation LoginWithGoogle($idToken: String!) {
              loginWithGoogle(idToken: $idToken) {
                __typename
                personBfGid
                orgBfOid
              }
            }
          `,
          variables: { idToken: mockIdToken }
        }),
      });

      const result = await response.json();
      
      setLoginState("success");
      console.log("Login successful:", result);
      
      // Reload the page to refresh the current viewer
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error("Login failed:", error);
      setLoginState("idle");
    }
  };

  // Always show login button
  return (
    <div>
      <BfDsButton
        variant="primary"
        onClick={handleGoogleLogin}
        disabled={loginState === "loading"}
      >
        {loginState === "loading" ? "Signing in..." : loginState === "success" ? "Success!" : "Continue with Google"}
      </BfDsButton>
    </div>
  );
});