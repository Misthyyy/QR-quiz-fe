import React from "react";

// ✅ Bảo đảm font Goldman được load
const goldmanFont = document.createElement("link");
goldmanFont.href =
  "https://fonts.googleapis.com/css2?family=Goldman:wght@400;700&display=swap";
goldmanFont.rel = "stylesheet";
document.head.appendChild(goldmanFont);

export default function ProgressBar({ passed }) {
  const dotBaseStyle = {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    margin: "0 8px",
    background: "rgba(255, 215, 0, 0.3)",
    boxShadow: "0 0 6px rgba(255, 215, 0, 0.4)",
    transition: "all 0.3s ease",
  };

  const dotDoneStyle = {
    background: "linear-gradient(90deg, #facc15, #f59e0b)",
    boxShadow: "0 0 12px rgba(255, 215, 0, 0.9)",
    transform: "scale(1.2)",
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "16px",
    fontFamily: "'Goldman', sans-serif",
  };

  return (
    <div style={containerStyle}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{ ...dotBaseStyle, ...(i < passed ? dotDoneStyle : {}) }}
        ></div>
      ))}
    </div>
  );
}
