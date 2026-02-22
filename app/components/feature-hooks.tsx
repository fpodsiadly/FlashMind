"use client";

import { Card, CardContent, CardHeader } from "@/app/components/ui/card";

const upcoming = [
    "Multiplayer 1v1 WebSocket mode",
    "Daily 10-question challenge",
    "Category knowledge heatmap",
];

export function FeatureHooks() {
    return (
        <Card>
            <CardHeader>
                <h3 className="text-lg font-semibold">Upcoming Hooks</h3>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2 text-sm text-indigo-100">
                    {upcoming.map((item) => (
                        <li key={item} className="rounded-lg border border-indigo-300/20 bg-white/5 p-2">
                            {item}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
