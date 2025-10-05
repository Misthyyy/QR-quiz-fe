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

  // Thêm 2 state mới để quản lý check-in logic
  const [checkedIn, setCheckedIn] = useState(false);
  const [preCorrect, setPreCorrect] = useState(0);

  useEffect(() => {
    (async () => {
      const existed = await api.result(deviceId);
      if (existed) {
        setResult(existed);
        setStage("result");
      } else setStage("welcome");
    })();
  }, [deviceId]);

  async function start({ checkedIn, preCorrect }) {
    setCheckedIn(checkedIn);
    setPreCorrect(preCorrect);

    const s = await api.start(deviceId);
    if (s.alreadyPlayed) {
      setResult(s.result);
      setStage("result");
      return;
    }

    setEndTime(s.endTime);
    const q = await api.questions(deviceId);
    let quizData = q.quiz;

    // ✅ Nếu đã check-in → chỉ chơi câu thứ 3 (giả sử tổng 3 câu)
    // và coi như đã đúng 2 câu đầu tiên
    if (checkedIn) {
      quizData = quizData.slice(2, 3);
    }

    setQuiz(quizData);
    setStage("quiz");
  }

  async function finish(score) {
    const totalScore = checkedIn ? preCorrect + score : score;

    let reward = "NO_GIFT";
    if (checkedIn) {
      reward = score === 1 ? "GIFT_LARGE" : "GIFT_SMALL";
    }

    const r = await api.finish(deviceId, totalScore, reward);

    setResult(r);
    localStorage.setItem("played", "true");
    setStage("result");
  }

  function acknowledge() {
    window.location.replace(window.location.href);
  }

  if (stage === "welcome") return <Welcome onStart={start} />;
  if (stage === "quiz")
    return <Quiz quiz={quiz} endTimeISO={endTime} onFinish={finish} />;
  if (stage === "result")
    return (
      <Result
        score={result?.score || 0}
        reward={result?.reward || "NO_GIFT"}
        onAcknowledge={acknowledge}
      />
    );

  return null;
}
