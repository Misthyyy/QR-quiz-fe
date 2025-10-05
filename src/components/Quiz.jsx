import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import ProgressBar from "./ProgressBar";
import AnswerOption from "./AnswerOption";
import "../cosmic-theme.css"; // đảm bảo có cosmic-bg, cosmic-star, cosmic-btn, glass

export default function Quiz({ quiz, endTimeISO, onFinish }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [states, setStates] = useState(["", "", ""]);
  const [lock, setLock] = useState(false);
  const finished = useRef(false);

  const parsedQuiz = quiz.map((q) => {
    const last = q.options[q.options.length - 1];
    if (/^[A-D]$/i.test(last)) {
      const correct = last.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
      return { ...q, options: q.options.slice(0, -1), correct };
    }
    return q;
  });

  function useCountdown(endTimeISO, onExpire) {
    const [left, setLeft] = useState(0);
    const cb = useRef(onExpire);
    cb.current = onExpire;
    useEffect(() => {
      if (!endTimeISO) return;
      const end = new Date(endTimeISO).getTime();
      const tick = () => {
        const now = Date.now();
        const remain = Math.max(0, Math.ceil((end - now) / 1000));
        setLeft(remain);
        if (remain <= 0) cb.current && cb.current();
      };
      tick();
      const id = setInterval(tick, 250);
      return () => clearInterval(id);
    }, [endTimeISO]);
    return left;
  }

  const leftSec = useCountdown(endTimeISO, () => {
    if (!finished.current) handleFinish();
  });

  useEffect(() => {
    function blockBack() {
      window.history.pushState(null, "", window.location.href);
    }
    blockBack();
    const pop = () => window.history.go(1);
    window.onpopstate = pop;
    return () => {
      window.onpopstate = null;
    };
  }, []);

  useEffect(() => {
    const handler = () => {
      if (document.hidden && idx < parsedQuiz.length && !lock) {
        setLock(true);
        const correct = parsedQuiz[idx].correct;
        setStates((s) => s.map((_, i) => (i === correct ? "correct" : s[i])));
        setTimeout(() => {
          setIdx((i) => i + 1);
          setStates(Array(parsedQuiz[idx + 1]?.options.length || 3).fill(""));
          setLock(false);
        }, 500);
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [idx, parsedQuiz, lock]);

  const handleAnswer = (i) => {
    if (lock) return;
    setLock(true);
    const correct = parsedQuiz[idx].correct;
    const ok = i === correct;
    setStates((s) =>
      s.map((_, k) =>
        k === i ? (ok ? "correct" : "wrong") : k === correct ? "correct" : ""
      )
    );
    if (ok) {
      setScore((v) => v + 1);
      confetti({ particleCount: 80, spread: 65, origin: { y: 0.6 } });
    }
    setTimeout(() => {
      if (idx + 1 < parsedQuiz.length) {
        setIdx(idx + 1);
        setStates(Array(parsedQuiz[idx + 1].options.length).fill(""));
        setLock(false);
      } else {
        handleFinish(ok ? score + 1 : score);
      }
    }, 3000);
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
        <div
          className="timer"
          style={{ fontFamily: "Goldman", fontSize: "1.25rem" }}
        >
          ⏱️ {leftSec}s
        </div>

        <ProgressBar passed={score} />

        <h2 style={{ fontFamily: "Goldman", margin: "12px 0" }}>
          Câu {idx + 1}/{parsedQuiz.length}
        </h2>

        <p
          style={{
            opacity: 0.85,
            fontFamily: "Goldman",
            marginBottom: "16px",
          }}
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
