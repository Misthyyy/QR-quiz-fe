const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export const api = {
  start: (deviceId, link = null) =>
    fetch(`${API}/api/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId, link }), // ✅ gửi link thay vì checkedIn
    }).then((r) => r.json()),

  questions: (deviceId) =>
    fetch(`${API}/api/questions?deviceId=${encodeURIComponent(deviceId)}`).then(
      (r) => r.json()
    ),

  finish: (deviceId, score, link = null) =>
    fetch(`${API}/api/finish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId, score, link }), // ✅ gửi link cùng finish
    }).then((r) => r.json()),

  result: (deviceId) =>
    fetch(`${API}/api/result/${encodeURIComponent(deviceId)}`).then((r) =>
      r.json()
    ),

  donors: () => fetch(`${API}/api/donors`).then((r) => r.json()),

  saveCheckinLink: async (deviceId, link) => {
    console.log("Sending checkin:", { deviceId, link });
    const r = await fetch(`${API}/api/checkin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId, link }),
    });
    return await r.json();
  },
};
