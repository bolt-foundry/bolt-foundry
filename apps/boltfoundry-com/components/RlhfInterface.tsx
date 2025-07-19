import { iso } from "@iso-bfc";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export const RlhfInterface = iso(`
  field Query.RlhfInterface @component {
    __typename
  }
`)(function RlhfInterface({ data }) {
  logger.debug("RLHF Interface data:", data);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Navigation Sidebar - Initially visible */}
      <div
        style={{
          width: "250px",
          backgroundColor: "#f5f5f5",
          borderRight: "1px solid #ddd",
          padding: "16px",
        }}
      >
        <h3>RLHF Navigation</h3>
        <nav>
          <div style={{ marginBottom: "8px" }}>
            <a
              href="#decks"
              style={{
                display: "block",
                padding: "8px",
                textDecoration: "none",
              }}
            >
              📚 Decks
            </a>
          </div>
          <div style={{ marginBottom: "8px" }}>
            <a
              href="#inbox"
              style={{
                display: "block",
                padding: "8px",
                textDecoration: "none",
              }}
            >
              📥 Sample Inbox
            </a>
          </div>
          <div style={{ marginBottom: "8px" }}>
            <a
              href="#disagreements"
              style={{
                display: "block",
                padding: "8px",
                textDecoration: "none",
              }}
            >
              ⚠️ Disagreements
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Conversation View */}
        <div
          style={{
            flex: 1,
            padding: "16px",
            overflowY: "auto",
            backgroundColor: "#fff",
          }}
        >
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h1>RLHF Chat Interface</h1>
            <p>
              Welcome to the Reinforcement Learning from Human Feedback
              interface.
            </p>

            {/* Sample Chat Message */}
            <div
              style={{
                marginBottom: "16px",
                padding: "12px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
              }}
            >
              <strong>AI Assistant:</strong>{" "}
              I can help you review samples, analyze disagreements, and manage
              your RLHF decks. What would you like to do?
            </div>

            {/* Sample Cards Area */}
            <div style={{ marginTop: "24px" }}>
              <h3>Recent Activity</h3>
              <div style={{ display: "grid", gap: "12px" }}>
                {/* Sample Deck Card */}
                <div
                  style={{
                    padding: "16px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: "#fff",
                  }}
                >
                  <h4 style={{ margin: "0 0 8px 0" }}>Customer Service Deck</h4>
                  <p style={{ margin: "0 0 8px 0", color: "#666" }}>
                    3 graders • 12 samples • Last updated 2 hours ago
                  </p>
                  <div style={{ fontSize: "14px", color: "#888" }}>
                    Click to view details →
                  </div>
                </div>

                {/* Sample Review Card */}
                <div
                  style={{
                    padding: "16px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: "#fff",
                  }}
                >
                  <h4 style={{ margin: "0 0 8px 0" }}>⚠️ Needs Review</h4>
                  <p style={{ margin: "0 0 8px 0", color: "#666" }}>
                    AI Score: +2 • Human feedback needed
                  </p>
                  <div style={{ fontSize: "14px", color: "#888" }}>
                    Click to provide feedback →
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid #ddd",
            backgroundColor: "#f9f9f9",
          }}
        >
          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              display: "flex",
              gap: "8px",
            }}
          >
            <input
              type="text"
              placeholder="Ask about your RLHF data or request specific actions..."
              style={{
                flex: 1,
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
            <button
              type="button"
              style={{
                padding: "12px 24px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
