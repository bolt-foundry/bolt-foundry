import React, { useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/index.ts";
import { useRouter } from "../../contexts/RouterContext.tsx";

export function LoginPage() {
  const { navigate } = useRouter();
  const [loginState, setLoginState] = useState<"idle" | "loading" | "success">("idle");

  const handleGoogleLogin = async () => {
    setLoginState("loading");

    try {
      // For now, just simulate a successful login
      // In a real implementation, this would integrate with Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLoginState("success");
      
      // Navigate to home page after successful login
      setTimeout(() => {
        navigate("/");
      }, 1500);
      
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      <h1>Sign in to Bolt Foundry</h1>
      
      <BfDsButton
        variant="primary"
        onClick={handleGoogleLogin}
        disabled={loginState === "loading"}
      >
        {loginState === "loading" ? "Signing in..." : loginState === "success" ? "Success!" : "Continue with Google"}
      </BfDsButton>
    </div>
  );
}