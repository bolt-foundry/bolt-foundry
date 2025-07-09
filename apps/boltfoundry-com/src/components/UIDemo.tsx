import { useState } from "react";

// Simple button fallback
function SimpleButton({ children, onClick, variant = "primary" }: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}) {
  const buttonStyle = {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "0.25rem",
    cursor: "pointer",
    backgroundColor: variant === "primary" ? "#3b82f6" : "#6b7280",
    color: "white",
    fontSize: "0.875rem",
    fontWeight: "500",
  };
  
  return (
    <button style={buttonStyle} onClick={onClick}>
      {children}
    </button>
  );
}

export function UIDemo() {
  const [count, setCount] = useState(0);

  // Use simple fallback buttons for now to avoid import issues
  const BfDsButton = SimpleButton;

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>BfDs UI Demo</h1>
      <p>This is a simple demo of the BfDs design system components.</p>
      
      <div style={{ marginTop: "2rem" }}>
        <h2>Button Component</h2>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <BfDsButton variant="primary">
            Primary Button
          </BfDsButton>
          <BfDsButton variant="secondary">
            Secondary Button
          </BfDsButton>
        </div>
        
        <div style={{ marginTop: "1rem" }}>
          <p>Counter: {count}</p>
          <BfDsButton
            onClick={() => setCount(count + 1)}
            variant="primary"
          >
            Increment
          </BfDsButton>
        </div>
      </div>
    </div>
  );
}