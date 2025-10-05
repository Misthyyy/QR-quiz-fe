import { useEffect, useRef, useState } from 'react';

export function useCountdown(endTimeISO, onExpire) {
  const [left, setLeft] = useState(0);
  const cb = useRef(onExpire);
  cb.current = onExpire;

  useEffect(() => {
    if (!endTimeISO) return;
    const end = new Date(endTimeISO).getTime();
    function tick() {
      const now = Date.now();
      const remain = Math.max(0, Math.ceil((end - now) / 1000));
      setLeft(remain);
      if (remain <= 0) cb.current && cb.current();
    }
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [endTimeISO]);

  return left; // seconds
}
