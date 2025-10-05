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
    <div className="container">
      <div className="card center">
        <img className="reward-img" src={img} alt="reward" />
        <h2>Kết quả của bạn: {score}/3</h2>
        <p>Phần quà: {String(reward || "NO_GIFT").replace("_", " ")}</p>
      </div>
    </div>
  );
}
