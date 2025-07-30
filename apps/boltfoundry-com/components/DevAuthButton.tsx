import { useState } from "react";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export function DevAuthButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDevLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      logger.info("Attempting development authentication");

      // Use the mock token that the backend recognizes in E2E mode
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken: "mock.jwt.token.for.testing" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Login failed: ${response.status}`);
      }

      const result = await response.json();
      logger.info("Dev login successful", result);

      // Redirect to home page
      globalThis.location.href = result.redirectTo || "/";
    } catch (err) {
      setIsLoading(false);
      setError(err instanceof Error ? err.message : "Failed to sign in");
      logger.error("Dev sign-in error:", err);
    }
  };

  if (isLoading) {
    return <div>Signing in...</div>;
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDevLogin}
        style={{
          padding: "12px 24px",
          border: "2px solid #4285f4",
          borderRadius: "4px",
          backgroundColor: "#4285f4",
          color: "white",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "500",
          fontFamily: "system-ui, -apple-system, sans-serif",
          minWidth: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "#357abd";
          e.currentTarget.style.borderColor = "#357abd";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "#4285f4";
          e.currentTarget.style.borderColor = "#4285f4";
        }}
      >
        🔧 Dev Mode Sign In
      </button>
      {error && (
        <div
          style={{
            marginTop: "10px",
            color: "#d32f2f",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}
      <p
        style={{
          marginTop: "10px",
          fontSize: "12px",
          color: "#666",
        }}
      >
        Note: This only works when server is started with BF_E2E_MODE=true
      </p>
    </div>
  );
}
