import { AlertTriangle, AlertOctagon, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AlertItem, AlertLevel } from "@/lib/mock-data";

const levelStyle: Record<AlertLevel, { dot: string; text: string; bg: string; icon: typeof Info }> = {
  严重: { dot: "bg-[var(--theme-red)]", text: "text-[var(--theme-red)]", bg: "bg-[var(--theme-red)]/8", icon: AlertOctagon },
  警告: { dot: "bg-[var(--theme-gold)]", text: "text-[var(--theme-gold)]", bg: "bg-[var(--theme-gold)]/8", icon: AlertTriangle },
  提示: { dot: "bg-[var(--theme-blue)]", text: "text-[var(--theme-blue)]", bg: "bg-[var(--theme-blue)]/8", icon: Info },
};

function timeAgo(d: Date): string {
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return `${s}秒前`;
  if (s < 3600) return `${Math.floor(s / 60)}分钟前`;
  return `${Math.floor(s / 3600)}小时前`;
}

export function AlertFeed({ alerts }: { alerts: AlertItem[] }) {
  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto pr-1">
      {alerts.map((a) => {
        const st = levelStyle[a.level];
        const Icon = st.icon;
        return (
          <div
            key={a.id}
            className={cn(
              "flex items-start gap-3 rounded-xl border border-border/70 px-3 py-2.5 transition-colors hover:bg-muted/50",
              st.bg
            )}
          >
            <span className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", st.bg)}>
              <Icon className={cn("h-4 w-4", st.text)} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className={cn("text-xs font-semibold", st.text)}>{a.level}</span>
                <span className="truncate text-sm font-medium text-foreground">{a.device}</span>
                <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">{timeAgo(a.time)}</span>
              </div>
              <div className="mt-0.5 truncate text-xs text-muted-foreground">
                {a.dept} · {a.message}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
