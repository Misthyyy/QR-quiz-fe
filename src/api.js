const API = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
export const api = {
  start: (deviceId) => fetch(`${API}/api/start`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ deviceId }) }).then(r=>r.json()),
  questions: (deviceId) => fetch(`${API}/api/questions?deviceId=${encodeURIComponent(deviceId)}`).then(r=>r.json()),
  finish: (deviceId, score) => fetch(`${API}/api/finish`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ deviceId, score }) }).then(r=>r.json()),
  result: (deviceId) => fetch(`${API}/api/result/${encodeURIComponent(deviceId)}`).then(r=>r.json())
};
