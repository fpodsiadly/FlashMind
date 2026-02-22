"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRounds } from "@/app/services/client-api";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";

export function HistoryPanel() {
  const { data } = useQuery({ queryKey: ["history"], queryFn: fetchRounds });

  return (
    <Card className="h-full">
      <CardHeader>
        <h2 className="text-lg font-semibold">History</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {(data ?? []).map((round) => (
            <div key={round.id} className="rounded-lg border border-indigo-300/20 bg-white/5 p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="uppercase text-indigo-200">{round.language}</span>
                <span>{new Date(round.createdAt).toLocaleString()}</span>
              </div>
              <div className="mt-1 text-base font-semibold">Score: {round.score}</div>
              <div className="text-indigo-100">
                {round.correctCount} correct / {round.incorrectCount} wrong
              </div>
            </div>
          ))}
          {data?.length === 0 && <p className="text-sm text-indigo-200/70">No rounds yet.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
