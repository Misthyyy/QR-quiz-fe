import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import ProgressBar from "./ProgressBar";
import AnswerOption from "./AnswerOption";
import "../cosmic-theme.css";

export default function Quiz({ quiz, onFinish, preCorrect = 0 }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [states, setStates] = useState([]);
  const [lock, setLock] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30s mỗi câu
  const finished = useRef(false);

  const parsedQuiz = quiz.map((q) => {
    const last = q.options[q.options.length - 1];
    if (/^[A-D]$/i.test(last)) {
      const correct = last.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
      return { ...q, options: q.options.slice(0, -1), correct };
    }
    return q;
  });

  // Khởi tạo states cho câu đầu
  useEffect(() => {
    setStates(Array(parsedQuiz[0]?.options.length || 3).fill(""));
  }, []);

  // Timer 30s mỗi câu
  useEffect(() => {
    if (lock) return;
    setTimeLeft(30); // reset khi câu mới
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleNextQuestion(false); // hết thời gian
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [idx, lock]);

  const handleNextQuestion = (answeredCorrectly = false, answerIdx = null) => {
    if (lock) return;
    setLock(true);

    // hiện đáp án đúng
    const correct = parsedQuiz[idx].correct;
    setStates((s) =>
      s.map((_, i) =>
        i === correct
          ? "correct"
          : answerIdx === i
          ? answeredCorrectly
            ? "correct"
            : "wrong"
          : ""
      )
    );

    if (answeredCorrectly) {
      setScore((s) => s + 1);
      confetti({ particleCount: 80, spread: 65, origin: { y: 0.6 } });
    }

    setTimeout(() => {
      if (idx + 1 < parsedQuiz.length) {
        setIdx(idx + 1);
        setStates(Array(parsedQuiz[idx + 1].options.length).fill(""));
        setLock(false);
      } else {
        handleFinish(answeredCorrectly ? score + 1 : score);
      }
    }, 500); // delay giữa các câu 0.5s
  };

  const handleAnswer = (i) => {
    if (lock) return;
    const correct = parsedQuiz[idx].correct;
    handleNextQuestion(i === correct, i);
  };

  const handleFinish = (finalScore = score) => {
    if (finished.current) return;
    finished.current = true;
    onFinish(finalScore);
  };

  if (idx >= parsedQuiz.length) return null;
  const q = parsedQuiz[idx];

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

      <div className="cosmic-card center glass">
        {/* Timer */}
        <div style={{ fontFamily: "Goldman", fontSize: "1.25rem" }}>
          ⏱️ {timeLeft}s
        </div>

        {/* Progress */}
        <ProgressBar
          passed={preCorrect + score}
          total={preCorrect + quiz.length}
        />

        <h2 style={{ fontFamily: "Goldman", margin: "12px 0" }}>
          Câu {idx + 1}/{parsedQuiz.length}
        </h2>

        <p
          style={{ opacity: 0.85, fontFamily: "Goldman", marginBottom: "16px" }}
        >
          {q.q}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {q.options.map((t, i) => (
            <AnswerOption
              key={i}
              text={t}
              state={states[i]}
              disabled={lock}
              onClick={() => handleAnswer(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
