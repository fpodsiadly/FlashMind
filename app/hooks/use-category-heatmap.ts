"use client";

import { useMemo } from "react";

export function useCategoryHeatmapHook() {
  return useMemo(
    () => ({
      enabled: false,
      categories: [] as Array<{ category: string; score: number }>,
    }),
    [],
  );
}
