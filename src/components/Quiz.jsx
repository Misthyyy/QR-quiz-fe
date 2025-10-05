import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import ProgressBar from "./ProgressBar";
import AnswerOption from "./AnswerOption";

export default function Quiz({ quiz, endTimeISO, onFinish }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [states, setStates] = useState(["", "", ""]);
  const [lock, setLock] = useState(false);
  const finished = useRef(false);

  // 🧩 Chuẩn hoá dữ liệu quiz: loại bỏ ký tự A/B/C/D cuối và gán correct
  const parsedQuiz = quiz.map((q) => {
    const last = q.options[q.options.length - 1];
    if (/^[A-D]$/i.test(last)) {
      const correct = last.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
      return {
        ...q,
        options: q.options.slice(0, -1), // bỏ phần tử cuối (chữ cái)
        correct,
      };
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

  // Anti-cheat: change question on tab hide
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
    console.log(
      `🧠 Question ${idx + 1}: user chose index ${i} ("${
        parsedQuiz[idx].options[i]
      }")`,
      `| Correct index: ${correct} ("${parsedQuiz[idx].options[correct]}")`
    );
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
        const finalScore = ok ? score + 1 : score; // ✅ cộng thêm nếu câu cuối đúng
        handleFinish(finalScore);
      }
    }, 3000);
  };

  const handleFinish = (finalScore = score) => {
    if (finished.current) return;
    finished.current = true;
    onFinish(finalScore); // ✅ đảm bảo truyền giá trị đúng nhất
  };

  if (idx >= parsedQuiz.length) return null;
  const q = parsedQuiz[idx];

  if (q) {
    console.log(
      `👉 Question ${idx + 1}:`,
      q.q,
      "\nOptions:",
      q.options,
      "\nCorrect index:",
      q.correct,
      "\nCorrect answer:",
      q.options[q.correct]
    );
  }

  return (
    <div className="container">
      <div className="timer">⏱️ {leftSec}s</div>
      <div className="card">
        <ProgressBar passed={score} />
        <h2>
          Câu {idx + 1}/{parsedQuiz.length}
        </h2>
        <p style={{ opacity: 0.85 }}>{q.q}</p>
        <div className="answers">
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
