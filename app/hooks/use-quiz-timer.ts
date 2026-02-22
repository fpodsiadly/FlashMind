"use client";

import { useEffect, useState } from "react";

export function useQuizTimer(duration: number, key: number, onExpire: () => void) {
  const [remaining, setRemaining] = useState(duration);

  useEffect(() => {
    setRemaining(duration);
  }, [duration, key]);

  useEffect(() => {
    if (remaining <= 0) {
      onExpire();
      return;
    }

    const timer = window.setInterval(() => {
      setRemaining((value) => value - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [remaining, onExpire]);

  return {
    remaining,
    progress: (remaining / duration) * 100,
  };
}
