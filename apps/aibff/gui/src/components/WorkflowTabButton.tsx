import { useState } from "react";

interface WorkflowTabButtonProps {
  _id: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function WorkflowTabButton({
  _id,
  label,
  isActive,
  onClick,
}: WorkflowTabButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        flex: 1,
        padding: "0.75rem 0.5rem",
        backgroundColor: isActive
          ? "#2a2b2c"
          : (isHovered ? "#232425" : "transparent"),
        color: isActive || isHovered ? "#fafaff" : "#b8b8c0",
        border: "none",
        borderBottom: isActive ? "2px solid #4a9eff" : "2px solid transparent",
        cursor: "pointer",
        fontSize: "0.75rem",
        fontWeight: 500,
        transition: "all 0.2s ease",
        textAlign: "center",
      }}
    >
      {label}
    </button>
  );
}
