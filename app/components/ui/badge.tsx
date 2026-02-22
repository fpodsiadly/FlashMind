import { cn } from "@/app/utils/cn";

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full border border-indigo-200/30 bg-indigo-400/10 px-2.5 py-1 text-xs font-semibold text-indigo-100",
                className,
            )}
        >
            {children}
        </span>
    );
}
