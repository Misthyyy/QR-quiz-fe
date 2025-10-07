import React, { useState } from "react";
import "../cosmic-theme.css";
import { api } from "../api";

// ✅ Thêm Google Font Goldman
const goldmanFont = document.createElement("link");
goldmanFont.href =
  "https://fonts.googleapis.com/css2?family=Goldman:wght@400;700&display=swap";
goldmanFont.rel = "stylesheet";
document.head.appendChild(goldmanFont);

export default function Welcome({ onStart, deviceId }) {
  const [checkedIn, setCheckedIn] = useState(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const fontStyle = {
    fontFamily: "'Goldman', sans-serif",
    color: "#FFD700",
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  // 🟢 Hàm kiểm tra donor
  const handleDonorCheck = async () => {
    if (!phone.trim()) {
      showToast("Vui lòng nhập số điện thoại");
      return;
    }
    setLoading(true);
    try {
      const donors = await api.donors();

      const phones = donors.map((d) =>
        typeof d === "string"
          ? d.replace(/\D/g, "")
          : d.phone.replace(/\D/g, "")
      );

      const normalized = phone.replace(/\D/g, "");
      if (phones.includes(normalized)) {
        showToast("Xác thực thành công!");
        setShowPhoneModal(false);
        onStart({ checkedIn: true, preCorrect: 3, isDonor: true });
      } else {
        showToast("Số điện thoại không khớp danh sách donor!");
      }
    } catch (err) {
      console.error(err);
      showToast("Lỗi khi kiểm tra donor!");
    } finally {
      setLoading(false);
    }
  };

  // ======= Check-in link validation =======
  const validateLink = (url) => {
    try {
      const parsed = new URL(url);
      const host = parsed.host.toLowerCase();
      return (
        host.includes("facebook.com") ||
        host.includes("tiktok.com") ||
        host.includes("threads.com")
      );
    } catch {
      return false;
    }
  };

  const handleLinkSubmit = () => {
    if (!validateLink(link)) {
      showToast("Link không hợp lệ! Chỉ Facebook, TikTok, Threads");
      return;
    }
    setShowLinkModal(false);
    setCheckedIn(true);
    onStart({ checkedIn: true, preCorrect: 2, link }); // ✅ đưa link lên cùng start
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

      {/* 🌌 Card */}
      <div
        className="cosmic-card center"
        style={{ textShadow: "0 0 10px rgba(255,215,0,0.7)" }}
      >
        <h1 className="cosmic-title" style={{ fontSize: "2rem" }}>
          Chào mừng đến với Vườn Mít
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginTop: "20px",
            alignItems: "center",
          }}
        >
          {/* 💎 DONOR */}
          <button
            className="cosmic-btn"
            style={{
              width: "100%",
              maxWidth: "400px",
              fontFamily: "'Goldman', sans-serif",
              fontWeight: "700",
              background:
                "linear-gradient(90deg, rgba(185, 148, 255, 0.8), rgba(185, 216, 246, 0.76))",
              color: "#fff",
              border: "1px solid rgba(255, 255, 255, 0.04)",
              boxShadow: "0 0 12px rgba(185, 148, 255, 0.37)",
              textShadow: "0 0 6px rgba(21, 8, 56, 0.81)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(90deg, rgba(186, 148, 255, 0.8), rgba(128, 115, 210, 0.8))";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(90deg, rgba(186, 148, 255, 0.6), rgba(157, 206, 255, 0.6))";
            }}
            onClick={() => setShowPhoneModal(true)}
          >
            TÔI LÀ DONOR
          </button>

          {/* ✅ Nút ĐÃ CHECK-IN */}
          <button
            className="cosmic-btn"
            style={{
              width: "100%",
              maxWidth: "400px",
              fontFamily: "'Goldman', sans-serif",
              fontWeight: "700",
              background:
                checkedIn === true
                  ? "linear-gradient(90deg, rgba(144, 225, 239, 0.96), rgba(67, 190, 180, 0.8))"
                  : "linear-gradient(90deg, rgba(133, 230, 247, 0.85), rgba(91, 241, 228, 0.36))",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 0 12px rgba(144, 224, 239, 0.3)",
              textShadow: "0 0 6px rgba(11, 68, 63, 0.8)",
              transition: "all 0.3s ease",
            }}
            onClick={() => setShowLinkModal(true)}
          >
            ĐÃ CHECK-IN BOOTH
          </button>

          {/* ❌ CHƯA CHECK-IN */}
          <button
            className="cosmic-btn"
            style={{
              width: "100%",
              maxWidth: "400px",
              fontFamily: "'Goldman', sans-serif",
              fontWeight: "700",
              background:
                checkedIn === false
                  ? "linear-gradient(90deg, rgba(255, 182, 193, 0.8), rgba(255, 140, 162, 0.8))"
                  : "linear-gradient(90deg, rgba(222, 56, 81, 0.72), rgba(253, 185, 206, 0.5))",
              color: "#fff",
              border: "1px solid rgba(255, 255, 255, 0.07)",
              boxShadow: "0 0 12px rgba(190, 37, 60, 0.3)",
              textShadow: "0 0 6px rgba(214, 17, 17, 0.85)",
              transition: "all 0.3s ease",
            }}
            onClick={() => onStart({ checkedIn: false, preCorrect: 0 })}
          >
            CHƯA CHECK-IN BOOTH
          </button>
        </div>

        <p style={{ marginTop: "20px", opacity: 0.7, fontSize: "1rem" }}>
          Bạn chỉ có <strong>1 lượt chơi!</strong>
        </p>
      </div>

      {/* 🌌 Modal nhập số điện thoại */}
      {showPhoneModal && (
        <div className="cosmic-modal">
          <div className="cosmic-modal-content">
            <h3>Xin số điện thoại xác minh nhe</h3>
            <input
              type="text"
              value={phone}
              onChange={(e) =>
                /^[0-9+]*$/.test(e.target.value) && setPhone(e.target.value)
              }
              placeholder="Nhập số điện thoại..."
              style={{
                marginTop: "12px",
                padding: "10px",
                borderRadius: "8px",
                width: "100%",
                border: "none",
                outline: "none",
                fontSize: "1rem",
                textAlign: "center",
                fontFamily: "'Goldman', sans-serif",
              }}
            />
            {phone && (
              <p
                style={{
                  color: /^[0-9]{9,12}$/.test(phone) ? "limegreen" : "tomato",
                }}
              >
                {/^[0-9]{9,12}$/.test(phone)
                  ? "Số điện thoại hợp lệ ✅"
                  : "Số điện thoại chưa hợp lệ ❌"}
              </p>
            )}

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "20px",
                justifyContent: "center",
              }}
            >
              <button
                className="cosmic-btn"
                disabled={!/^[0-9]{9,12}$/.test(phone) || loading}
                onClick={handleDonorCheck}
                style={{
                  fontFamily: "'Goldman', sans-serif",
                  fontWeight: 500,
                  width: "140px",
                  padding: "10px 16px",
                  color: "#fff",
                  background:
                    "linear-gradient(90deg, rgba(84, 155, 168, 0.7), rgba(32, 246, 221, 0.7))",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  boxShadow: "0 0 10px rgba(144, 224, 239, 0.3)",
                  textShadow: "0 0 6px rgba(255,255,255,0.5)",
                  cursor: /^[0-9]{9,12}$/.test(phone)
                    ? "pointer"
                    : "not-allowed",
                  opacity: /^[0-9]{9,12}$/.test(phone) ? 1 : 0.7,
                  transition: "all 0.3s ease",
                }}
              >
                {loading ? "Đang kiểm tra..." : "Xác nhận"}
              </button>
              <button
                className="cosmic-btn"
                style={{
                  fontFamily: "'Goldman', sans-serif",
                  fontWeight: 700,
                  width: "140px",
                  padding: "10px 16px",
                  color: "#fff",
                  background:
                    "linear-gradient(90deg, rgba(240, 57, 84, 0.8), rgba(255, 140, 162, 0.6))",
                  border: "1px solid rgba(226, 67, 67, 0.62)",
                  borderRadius: "12px",
                  boxShadow: "0 0 10px rgba(255, 182, 193, 0.3)",
                  textShadow: "0 0 6px rgba(255, 221, 221, 0.6)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onClick={() => setShowPhoneModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🌌 Modal check-in link */}
      {showLinkModal && (
        <div className="cosmic-modal">
          <div className="cosmic-modal-content">
            <h3>Dán link check-in post</h3>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Nhập link..."
              style={{
                marginTop: "12px",
                padding: "10px",
                borderRadius: "8px",
                width: "100%",
                border: "none",
                outline: "none",
                fontSize: "1rem",
                textAlign: "center",
                fontFamily: "'Goldman', sans-serif",
              }}
            />
            {link && (
              <p
                style={{
                  color: validateLink(link) ? "limegreen" : "tomato",
                  fontFamily: "'Goldman', sans-serif",
                }}
              >
                {validateLink(link) ? "Link hợp lệ ✅" : "Link chưa hợp lệ ❌"}
              </p>
            )}
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "20px",
                justifyContent: "center",
              }}
            >
              <button
                className="cosmic-btn"
                disabled={!validateLink(link)}
                onClick={handleLinkSubmit} // ❌ Không gọi API nữa
                style={{
                  fontFamily: "'Goldman', sans-serif",
                  fontWeight: 500,
                  width: "140px",
                  color: "#fff",
                  background:
                    "linear-gradient(90deg, rgba(84, 155, 168, 0.7), rgba(32, 246, 221, 0.7))",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  boxShadow: "0 0 10px rgba(144, 224, 239, 0.3)",
                  textShadow: "0 0 6px rgba(255,255,255,0.5)",
                  cursor: "pointer",
                }}
              >
                Xác nhận
              </button>
              <button
                className="cosmic-btn"
                style={{
                  fontFamily: "'Goldman', sans-serif",
                  fontWeight: 700,
                  width: "140px",
                  padding: "10px 16px",
                  color: "#fff",
                  background:
                    "linear-gradient(90deg, rgba(240, 57, 84, 0.8), rgba(255, 140, 162, 0.6))",
                  border: "1px solid rgba(226, 67, 67, 0.62)",
                  borderRadius: "12px",
                  boxShadow: "0 0 10px rgba(255, 182, 193, 0.3)",
                  textShadow: "0 0 6px rgba(255, 221, 221, 0.6)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onClick={() => setShowLinkModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 Toast */}
      {toast && <div className="cosmic-toast">{toast}</div>}
    </div>
  );
}
