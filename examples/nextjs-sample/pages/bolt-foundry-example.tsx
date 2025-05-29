import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link";

// Example component demonstrating the use of bolt-foundry
// Note: Bolt Foundry is currently only available server-side
export default function BoltFoundryExample() {
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState("Ready to test API connection");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const testConnection = async () => {
    if (!message) {
      setStatus("Please enter a message");
      return;
    }

    try {
      setStatus("Sending message...");
      
      // Call our API route that uses Bolt Foundry server-side
      const res = await fetch("/api/regular-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "user", content: message }
          ],
          apiKey: apiKey, // Note: Passing API keys from client is insecure
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        // Handle API errors with better messaging
        if (data.error === "OpenAI API key not configured") {
          setStatus("⚠️ OpenAI API key required");
          setResponse("");
          // Show helpful error UI instead of generic error
          const errorMessage = document.getElementById('error-message');
          if (errorMessage) {
            errorMessage.style.display = 'block';
          }
          return;
        }
        throw new Error(data.error || `API error: ${res.status}`);
      }

      setResponse(data.content || "No response received");
      setStatus("Message sent successfully!");
      // Hide error message on success
      const errorMessage = document.getElementById('error-message');
      if (errorMessage) {
        errorMessage.style.display = 'none';
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <header
        className={styles.header}
        style={{
          width: "100%",
          padding: "1rem",
          borderBottom: "1px solid #eaeaea",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link 
          href="/"
          style={{
            fontWeight: "bold",
            fontSize: "1.2rem",
            color: "#0070f3",
            textDecoration: "none",
            marginRight: "1rem",
          }}
        >
          Home
        </Link>
      </header>
      <main className={styles.main}>
        <h1 className={styles.title}>Bolt Foundry Example</h1>

        <div
          className={styles.grid}
          style={{ flexDirection: "column", alignItems: "center" }}
        >
          <div
            className={styles.card}
            style={{ width: "100%", maxWidth: "500px" }}
          >
            <h2>Test Bolt Foundry API</h2>
            <p>This demonstrates using Bolt Foundry server-side with OpenAI.</p>

            <div
              style={{
                marginTop: "16px",
                marginBottom: "16px",
                padding: "12px",
                backgroundColor: "#fff3cd",
                borderRadius: "4px",
                border: "1px solid #ffeaa7",
                color: "#856404",
              }}
            >
              <strong>⚠️ Security Warning:</strong> Never pass API keys from the client in production!
              This is for demonstration purposes only. In a real application, store API keys securely
              on the server.
            </div>

            <div
              id="error-message"
              style={{
                display: "none",
                marginBottom: "16px",
                padding: "16px",
                backgroundColor: "#fee",
                borderRadius: "4px",
                border: "1px solid #fcc",
              }}
            >
              <h3 style={{ margin: "0 0 8px 0", color: "#c00" }}>
                🔑 OpenAI API Key Required
              </h3>
              <p style={{ margin: "0 0 12px 0", color: "#666" }}>
                To use this demo, you need an OpenAI API key. You can:
              </p>
              <ol style={{ margin: "0 0 12px 0", paddingLeft: "20px", color: "#666" }}>
                <li>Enter your API key in the field below, or</li>
                <li>Set the OPENAI_API_KEY environment variable on the server</li>
              </ol>
              <p style={{ margin: "0", color: "#666" }}>
                Don&apos;t have an API key?{" "}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#0070f3" }}
                >
                  Get one from OpenAI →
                </a>
              </p>
            </div>

            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="OpenAI API Key (optional - uses env var if empty)"
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "16px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message..."
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "16px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                minHeight: "100px",
                resize: "vertical",
              }}
            />

            <button
              onClick={testConnection}
              style={{
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Send Message
            </button>

            <div
              style={{
                marginTop: "16px",
                padding: "12px",
                backgroundColor: "#f0f0f0",
                borderRadius: "4px",
              }}
            >
              Status: {status}
            </div>

            {response && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "12px",
                  backgroundColor: "#e8f4fd",
                  borderRadius: "4px",
                  border: "1px solid #bee5ff",
                }}
              >
                <strong>Response:</strong>
                <p style={{ marginTop: "8px" }}>{response}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
