"use client";

import { useMemo } from "react";

export function useDailyChallengeHook() {
  return useMemo(
    () => ({
      enabled: false,
      questionCount: 10,
    }),
    [],
  );
}
