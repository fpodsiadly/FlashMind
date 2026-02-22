import { cn } from "@/app/utils/cn";

export function Progress({ value, className }: { value: number; className?: string }) {
    return (
        <div className={cn("h-2.5 w-full overflow-hidden rounded-full bg-white/10", className)}>
            <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-500 transition-all duration-300"
                style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
            />
        </div>
    );
}
