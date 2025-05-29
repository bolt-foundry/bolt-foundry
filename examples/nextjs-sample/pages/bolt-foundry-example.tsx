import React, { useEffect, useState } from "react";
import { createOpenAIFetch } from "@bolt-foundry/bolt-foundry";
import styles from "../styles/Home.module.css";
import Link from "next/link";

// Example component demonstrating the use of bolt-foundry
export default function BoltFoundryExample() {
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState("Waiting for API key...");

  const testConnection = async () => {
    if (!apiKey) {
      setStatus("Please enter an OpenAI API key");
      return;
    }

    try {
      setStatus("Testing connection...");

      // Create the custom fetch function from bolt-foundry
      const customFetch = createOpenAIFetch({
        openAiApiKey: apiKey,
      });

      // Simply log the function to show it's working
      setStatus("Successfully created OpenAI fetch wrapper!");

      // The customFetch function can be used to make OpenAI API calls
      // with automatic tracking and monitoring
      console.log("OpenAI fetch wrapper created:", customFetch);

      setStatus("Successfully created OpenAI fetch wrapper!");
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
        <Link href="/">
          <a
            style={{
              fontWeight: "bold",
              fontSize: "1.2rem",
              color: "#0070f3",
              textDecoration: "none",
              marginRight: "1rem",
            }}
          >
            Home
          </a>
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
            <h2>Test OpenAI Connection</h2>
            <p>Enter your OpenAI API key to test the connection:</p>

            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "16px",
                borderRadius: "4px",
                border: "1px solid #ccc",
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
              Test Connection
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
          </div>
        </div>
      </main>
    </div>
  );
}
