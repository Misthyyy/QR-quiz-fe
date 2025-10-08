import { useState, useEffect } from "react";
import { api } from "../api";
import "../cosmic-theme.css";

export default function Result({ score, reward, onAcknowledge, deviceId }) {
  const [received, setReceived] = useState(false);

  // 🟢 Khi component load, kiểm tra field receive_at từ backend
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await api.result(deviceId);
        if (res?.received_at) {
          setReceived(true);
        }
      } catch (err) {
        console.error("Lỗi khi kiểm tra trạng thái nhận quà:", err);
      }
    };
    fetchResult();
  }, [deviceId]);

  const handleReceive = async () => {
    try {
      await api.receiveGift(deviceId);
      setReceived(true);
    } catch (err) {
      console.error("Lỗi khi gửi trạng thái nhận quà:", err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "16px",
      }}
    >
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

      <h1 style={{ fontFamily: "Goldman", margin: "8px 1px" }}>
        SỐ CÂU ĐÚNG
      </h1>
      <>
        <div
          style={{
            fontSize: "20rem",
            fontFamily: "'Goldman', sans-serif",
            marginBottom: "8px",
            fontWeight: "bold",
            color: "white",
            textShadow: "0 0 8px #0ff, 0 0 16px #0066ff, 0 0 32px #001a33",
            animation: "scorePulse 0.5s infinite alternate",
          }}
        >
          {score}
        </div>

        <style>
          {`
        @keyframes scorePulse {
          from {
            text-shadow: 0 0 8px rgba(3, 85, 85, 1), 0 0 16px #0066ff, 0 0 32px #001a33;
          }
          to {
            text-shadow: 0 0 12px #09576bff, 0 0 28px #00ffff, 0 0 48px #003366;
          }
        }

        @keyframes glowPulse {
          from { text-shadow: 0 0 6px #00ff99, 0 0 12px #00ffcc, 0 0 20px #007755; }
          to { text-shadow: 0 0 10px #00ffaa, 0 0 24px #00ffff, 0 0 40px #009977; }
        }
      `}
        </style>
      </>

      /* {received ? (
        <p
          style={{
            fontFamily: "'Goldman', sans-serif",
            fontSize: "2rem",
            fontWeight: "bold",
            marginTop: "8px",
            textShadow: "0 0 6px #032b1bff, 0 0 12px #00ffcc",
          }}
        >
          ĐÃ NHẬN QUÀ
        </p>
      ) : (
        <button
          onClick={handleReceive}
          style={{
            marginTop: "20px",
            fontFamily: "'Goldman', sans-serif",
            padding: "10px 20px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.3)",
            background:
              "linear-gradient(90deg, rgba(84,155,168,0.7), rgba(32,246,221,0.7))",
            color: "#fff",
            cursor: "pointer",
            fontSize: "1.5rem",
          }}
        >
          Đã nhận
        </button>
      )} */
    </div>
  );
}
