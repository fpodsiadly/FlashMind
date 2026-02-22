"use client";

import { useMemo } from "react";

export function useMultiplayerHook() {
  return useMemo(
    () => ({
      enabled: false,
      status: "not-configured" as const,
    }),
    [],
  );
}
