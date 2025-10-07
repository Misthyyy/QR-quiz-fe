import "../cosmic-theme.css";

const gifts = {
  GIFT_LARGE:
    "https://heydaybozeman.com/cdn/shop/files/10-gift-wrapping-367153.png?v=1750196994",
  GIFT_MEDIUM:
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600",
  GIFT_SMALL:
    "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600",
  NO_GIFT:
    "https://www.shutterstock.com/shutterstock/photos/1516329536/display_1500/stock-photo-photo-of-young-african-woman-hand-with-no-text-1516329536.jpg",
};

export default function Result({ score, reward, onAcknowledge }) {
  const img = gifts[reward] || gifts.NO_GIFT;

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

      <h2 style={{ fontFamily: "Goldman", margin: "8px 2px" }}>
        Kết quả của bạn
      </h2>

      <img
        src={img}
        alt="reward"
        style={{
          width: "80%",
          maxWidth: "600px",
          height: "auto",
          borderRadius: "16px",
          boxShadow: "0 0 20px rgba(255,255,255,0.3)",
          marginBottom: "16px",
        }}
      />
    </div>
  );
}
