import React, { useState } from "react";
import "../cosmic-theme.css";

// ✅ Thêm Google Font Goldman
const goldmanFont = document.createElement("link");
goldmanFont.href =
  "https://fonts.googleapis.com/css2?family=Goldman:wght@400;700&display=swap";
goldmanFont.rel = "stylesheet";
document.head.appendChild(goldmanFont);

export default function Welcome({ onStart }) {
  const [checkedIn, setCheckedIn] = useState(null);

  const fontStyle = {
    fontFamily: "'Goldman', sans-serif",
    color: "#FFD700", // màu vàng gold nổi bật
  };

  return (
    <div style={fontStyle}>
      {/* 🌠 Nền vũ trụ */}
      <div className="cosmic-bg">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="cosmic-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div
        className="cosmic-card center"
        style={{
          fontFamily: "'Goldman', sans-serif",
          color: "#FFD700",
          textShadow: "0 0 10px rgba(255, 215, 0, 0.7)",
        }}
      >
        <h1 className="cosmic-title" style={{ fontSize: "2.5rem" }}>
          Chào mừng đến với Quiz 🎉
        </h1>
        <p style={{ opacity: 0.85, fontSize: "1.1rem" }}>
          Vui lòng chọn trạng thái check-in của bạn để bắt đầu trò chơi.
        </p>

        <div style={{ display: "flex", gap: "16px", marginTop: "20px" }}>
          <button
            className="cosmic-btn"
            style={{
              flex: 1,
              fontFamily: "'Goldman', sans-serif",
              fontWeight: "700",
              background:
                checkedIn === true
                  ? "linear-gradient(90deg, #22d3ee, #10b981)"
                  : "",
              color: "#fff",
              textShadow: "0 0 6px rgba(255,255,255,0.6)",
            }}
            onClick={() => {
              setCheckedIn(true);
              onStart({ checkedIn: true, preCorrect: 2 });
            }}
          >
            ✅ ĐÃ CHECK-IN
          </button>

          <button
            className="cosmic-btn"
            style={{
              flex: 1,
              fontFamily: "'Goldman', sans-serif",
              fontWeight: "700",
              background:
                checkedIn === false
                  ? "linear-gradient(90deg, #f43f5e, #ec4899)"
                  : "",
              color: "#fff",
              textShadow: "0 0 6px rgba(255,255,255,0.6)",
            }}
            onClick={() => {
              setCheckedIn(false);
              onStart({ checkedIn: false, preCorrect: 0 });
            }}
          >
            ❌ CHƯA CHECK-IN
          </button>
        </div>

        <p style={{ marginTop: "20px", opacity: 0.7, fontSize: "1rem" }}>
          Bạn chỉ có <strong>1 lượt chơi!</strong>
        </p>
      </div>
    </div>
  );
}
