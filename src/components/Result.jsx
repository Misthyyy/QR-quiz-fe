import "../cosmic-theme.css";

const gifts = {
  GIFT_LARGE:
    "https://images.unsplash.com/photo-1604014237800-1c9102c1d3fd?q=80&w=600",
  GIFT_MEDIUM:
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600",
  GIFT_SMALL:
    "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600",
  NO_GIFT:
    "https://images.unsplash.com/photo-1520975922203-bff9a0952c34?q=80&w=600",
};

export default function Result({ score, reward, onAcknowledge }) {
  const img = gifts[reward] || gifts.NO_GIFT;

  return (
    <div>
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

      <div className="cosmic-card center glass" style={{ textAlign: "center" }}>
        <img
          src={img}
          alt="reward"
          className="reward-img"
          style={{
            width: "220px",
            height: "220px",
            borderRadius: "16px",
            boxShadow: "0 0 20px ",
            marginBottom: "16px",
          }}
        />

        <h2 style={{ fontFamily: "Goldman", margin: "8px 0" }}>
          Kết quả của bạn: {score}/3
        </h2>

        <p
          style={{ fontFamily: "Goldman", opacity: 0.85, marginBottom: "2px" }}
        >
          Phần quà: {String(reward || "NO_GIFT").replace("_", " ")}
        </p>
      </div>
    </div>
  );
}
