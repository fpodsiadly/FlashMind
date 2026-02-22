"use client";

import { motion } from "framer-motion";
import { Progress } from "@/app/components/ui/progress";

export function TimerBar({ remaining, progress }: { remaining: number; progress: number }) {
  return (
    <div className="space-y-2">
      <motion.div
        animate={remaining <= 10 ? { scale: [1, 1.04, 1] } : { scale: 1 }}
        transition={{ repeat: remaining <= 10 ? Infinity : 0, duration: 0.75 }}
        className="text-right text-sm font-semibold text-indigo-100"
      >
        {remaining}s
      </motion.div>
      <Progress value={progress} />
    </div>
  );
}
