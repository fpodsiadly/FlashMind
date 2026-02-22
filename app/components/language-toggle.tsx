"use client";

import { Language } from "@/app/utils/types";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/utils/cn";

export function LanguageToggle({
    value,
    onChange,
}: {
    value: Language;
    onChange: (lang: Language) => void;
}) {
    return (
        <div className="inline-flex rounded-xl border border-indigo-300/30 bg-white/5 p-1">
            {(["en", "pl"] as const).map((lang) => (
                <Button
                    key={lang}
                    size="default"
                    variant="outline"
                    className={cn("h-9 rounded-lg px-4 uppercase", value === lang && "bg-indigo-400/20 text-white")}
                    onClick={() => onChange(lang)}
                >
                    {lang}
                </Button>
            ))}
        </div>
    );
}
