export default function Welcome({ onStart }) {
  return (
    <div className="container">
      <div className="card center">
        <h1>Chào mừng đến với Quiz 🎉</h1>
        <p>Vui lòng chọn trạng thái check-in của bạn để bắt đầu trò chơi.</p>

        <div style={{ display: "flex", gap: "16px", marginTop: "20px" }}>
          <button
            className="btn btn-success"
            style={{
              flex: 1,
              padding: "12px 16px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
            onClick={() => onStart({ checkedIn: true, preCorrect: 2 })}
          >
            ĐÃ CHECK-IN
          </button>

          <button
            className="btn btn-secondary"
            style={{
              flex: 1,
              padding: "12px 16px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
            onClick={() => onStart({ checkedIn: false, preCorrect: 0 })}
          >
            CHƯA CHECK-IN
          </button>
        </div>

        <p style={{ marginTop: "20px", opacity: 0.8 }}>
          Bạn chỉ có 1 lượt chơi!
        </p>
      </div>
    </div>
  );
}
