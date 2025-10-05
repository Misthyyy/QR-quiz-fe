import React from "react";

// ✅ Bảo đảm font Goldman được load
const goldmanFont = document.createElement("link");
goldmanFont.href =
  "https://fonts.googleapis.com/css2?family=Goldman:wght@400;700&display=swap";
goldmanFont.rel = "stylesheet";
document.head.appendChild(goldmanFont);

export default function AnswerOption({ text, state, onClick, disabled }) {
  // style cơ bản
  const baseStyle = {
    fontFamily: "'Goldman', sans-serif",
    fontWeight: 700,
    fontSize: "1.1rem",
    color: "#FFD700",
    background: "rgba(255, 255, 255, 0.05)",
    border: "2px solid rgba(255, 215, 0, 0.6)",
    borderRadius: "10px",
    padding: "12px 20px",
    margin: "8px 0",
    width: "100%",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 0 8px rgba(255, 215, 0, 0.4)",
    textShadow: "0 0 8px rgba(255, 215, 0, 0.8)",
  };

  // đổi màu theo trạng thái
  const stateStyles = {
    correct: {
      background: "linear-gradient(90deg, #22d3ee, #10b981)",
      color: "#fff",
      border: "2px solid #10b981",
      boxShadow: "0 0 12px #10b981",
    },
    wrong: {
      background: "linear-gradient(90deg, #f43f5e, #ec4899)",
      color: "#fff",
      border: "2px solid #f43f5e",
      boxShadow: "0 0 12px #f43f5e",
    },
    selected: {
      background: "linear-gradient(90deg, #facc15, #f59e0b)",
      color: "#000",
      boxShadow: "0 0 12px rgba(255, 215, 0, 0.9)",
    },
  };

  const appliedStyle = {
    ...baseStyle,
    ...(state ? stateStyles[state] : {}),
  };

  return (
    <button
      className={`answer ${state || ""}`}
      disabled={disabled}
      onClick={onClick}
      style={appliedStyle}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.transform = "scale(1.03)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {text}
    </button>
  );
}
