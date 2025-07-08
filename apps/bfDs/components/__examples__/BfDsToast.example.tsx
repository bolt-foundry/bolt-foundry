import type * as React from "react";
import { BfDsButton } from "../BfDsButton.tsx";
import { BfDsToastProvider, useBfDsToast } from "../BfDsToastProvider.tsx";

function ToastDemoContent() {
  const { showToast, clearAllToasts } = useBfDsToast();

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <h2>BfDsToast Examples</h2>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <BfDsButton
          variant="primary"
          onClick={() => showToast("This is an info message!")}
        >
          Info Toast
        </BfDsButton>

        <BfDsButton
          variant="secondary"
          onClick={() =>
            showToast("Operation completed successfully!", {
              variant: "success",
            })}
        >
          Success Toast
        </BfDsButton>

        <BfDsButton
          variant="outline"
          onClick={() =>
            showToast("Please check your input.", { variant: "warning" })}
        >
          Warning Toast
        </BfDsButton>

        <BfDsButton
          variant="ghost"
          onClick={() =>
            showToast("Something went wrong!", { variant: "error" })}
        >
          Error Toast
        </BfDsButton>
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <BfDsButton
          variant="primary"
          onClick={() =>
            showToast(
              "This toast will disappear in 10 seconds",
              { timeout: 10000, variant: "info" },
            )}
        >
          Long Timeout (10s)
        </BfDsButton>

        <BfDsButton
          variant="secondary"
          onClick={() =>
            showToast(
              "This toast will stay until dismissed",
              { timeout: 0, variant: "warning" },
            )}
        >
          No Auto-dismiss
        </BfDsButton>

        <BfDsButton
          variant="outline"
          onClick={() =>
            showToast(
              "Toast with details",
              {
                variant: "info",
                details: JSON.stringify(
                  {
                    timestamp: new Date().toISOString(),
                    user: "demo-user",
                    action: "example_action",
                  },
                  null,
                  2,
                ),
              },
            )}
        >
          With Details
        </BfDsButton>
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <BfDsButton
          variant="primary"
          onClick={() => {
            // Show multiple toasts in sequence
            showToast("First toast");
            setTimeout(
              () => showToast("Second toast", { variant: "success" }),
              500,
            );
            setTimeout(
              () => showToast("Third toast", { variant: "warning" }),
              1000,
            );
            setTimeout(
              () => showToast("Fourth toast", { variant: "error" }),
              1500,
            );
          }}
        >
          Multiple Toasts
        </BfDsButton>

        <BfDsButton
          variant="secondary"
          onClick={() => {
            const id = showToast("Persistent toast with custom ID", {
              timeout: 0,
              variant: "info",
              id: "persistent-toast",
            });
            console.log("Created toast with ID:", id);
          }}
        >
          Custom ID Toast
        </BfDsButton>

        <BfDsButton
          variant="outline"
          onClick={() =>
            showToast(
              "Toast with callback",
              {
                variant: "success",
                onDismiss: () => console.log("Toast was dismissed!"),
              },
            )}
        >
          With Callback
        </BfDsButton>
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <BfDsButton
          variant="ghost"
          onClick={clearAllToasts}
        >
          Clear All Toasts
        </BfDsButton>
      </div>

      <div style={{ marginTop: "32px" }}>
        <h3>Usage Instructions:</h3>
        <ul>
          <li>Toasts appear in the bottom-right corner</li>
          <li>New toasts are added to the bottom of the stack</li>
          <li>Click the × button to dismiss manually</li>
          <li>Toasts auto-dismiss after 5 seconds by default</li>
          <li>Use details prop for expandable JSON/text content</li>
          <li>Set timeout to 0 to disable auto-dismiss</li>
        </ul>
      </div>
    </div>
  );
}

export function BfDsToastExample() {
  return (
    <BfDsToastProvider>
      <ToastDemoContent />
    </BfDsToastProvider>
  );
}
