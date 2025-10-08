import { useEffect, useMemo, useState } from "react";
import Welcome from "./components/Welcome";
import Quiz from "./components/Quiz";
import Result from "./components/Result";
import { api } from "./api";
import "./styles.css";
import "./cosmic-theme.css";

function getOrCreateDeviceId() {
  let id = localStorage.getItem("deviceId");
  if (!id) {
    id = self.crypto?.randomUUID?.() || String(Math.random()).slice(2);
    localStorage.setItem("deviceId", id);
  }
  return id;
}

export default function App() {
  const [stage, setStage] = useState("init");
  const [quiz, setQuiz] = useState([]);
  const [endTime, setEndTime] = useState(null);
  const [result, setResult] = useState(null);
  const deviceId = useMemo(() => getOrCreateDeviceId(), []);
  const [loading, setLoading] = useState(false);

  // Quản lý check-in logic
  const [checkedIn, setCheckedIn] = useState(false);
  const [preCorrect, setPreCorrect] = useState(0);
  const [checkinLink, setCheckinLink] = useState("");

  useEffect(() => {
    (async () => {
      const existed = await api.result(deviceId);
      if (existed) {
        setResult(existed);
        setStage("result");
      } else setStage("welcome");
    })();
  }, [deviceId]);

  async function start({ checkedIn, preCorrect, link }) {
    setLoading(true);
    setCheckedIn(checkedIn);
    setPreCorrect(preCorrect);
    setCheckinLink(link || "");

    const s = await api.start(deviceId, link);

    if (s.alreadyPlayed) {
      setResult(s.result);
      setStage("result");
      return;
    }

    // ✅ Donor xác thực thành công => bỏ qua quiz, cho 3 điểm
    if (preCorrect === 3) {
      const totalScore = 3;
      const r = await api.finish(deviceId, totalScore, "GIFT_LARGE", link);
      setResult({ score: totalScore, reward: "GIFT_LARGE" });
      setStage("result");
      setLoading(false);
      return;
    }

    setEndTime(s.endTime);
    const q = await api.questions(deviceId);
    let quizData = q.quiz;

    // ✅ Nếu đã check-in -> chỉ 1 câu hỏi
    if (checkedIn) {
      quizData = quizData.slice(-1);
    }

    setQuiz(quizData);
    setStage("quiz");
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="main-wrapper">
        <div className="loading-screen">
          <p
            style={{ fontFamily: "'Goldman', sans-serif", fontSize: "1.5rem" }}
          >
            Đang tải, đợi xí nghen...
          </p>
        </div>
      </div>
    );
  }
  async function finish(score) {
    let totalScore;

    if (checkedIn) {
      // ✅ Chỉ 1 câu: đúng => 3, sai => 2
      totalScore = score === 1 ? 3 : 2;
    } else {
      // ✅ Trường hợp chưa check-in: tổng số câu đúng
      totalScore = score;
    }

    const r = await api.finish(deviceId, totalScore, "NO_GIFT", checkinLink);

    setResult({ score: totalScore });
    localStorage.setItem("played", "true");
    setStage("result");
  }

  function acknowledge() {
    window.location.replace(window.location.href);
  }

  if (stage === "welcome")
    return (
      <div className="main-wrapper">
        <Welcome onStart={start} deviceId={deviceId} />
      </div>
    );

  if (stage === "quiz")
    return (
      <div className="main-wrapper">
        <Quiz
          quiz={quiz}
          endTimeISO={endTime}
          onFinish={finish}
          preCorrect={checkedIn ? preCorrect : 0}
        />
      </div>
    );

  if (stage === "result")
    return (
      <div className="main-wrapper">
        <Result
          score={result?.score || 0}
          reward={result?.reward || "NO_GIFT"}
          deviceId={deviceId}
          onAcknowledge={acknowledge}
        />
      </div>
    );

  return null;
}
