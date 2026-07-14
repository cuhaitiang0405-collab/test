import { useEffect, useState } from "react";
import { Search, RefreshCw, Sun, Moon, Bell, ChevronRight } from "lucide-react";
import { fmtClock } from "@/lib/format";
import { cn } from "@/lib/utils";

interface TopbarProps {
  title: string;
  subtitle: string;
  refreshing: boolean;
  onRefresh: () => void;
  dark: boolean;
  onToggleDark: () => void;
  lastUpdated: Date;
}

export function Topbar({
  title,
  subtitle,
  refreshing,
  onRefresh,
  dark,
  onToggleDark,
  lastUpdated,
}: TopbarProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-card/80 px-6 backdrop-blur">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span>中台</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground/70">{subtitle}</span>
        </div>
        <h1 className="truncate text-base font-semibold text-foreground">{title}</h1>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="搜索设备 / 科室 / 指标"
            className="h-9 w-56 rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="hidden items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground lg:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--theme-green)]" />
          更新于 {lastUpdated.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </div>

        <button
          onClick={onRefresh}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition hover:text-foreground",
            refreshing && "animate-spin-once"
          )}
          title="刷新数据"
        >
          <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
        </button>

        <button
          onClick={onToggleDark}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition hover:text-foreground"
          title="切换主题"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--theme-red)]" />
        </button>

        <div className="hidden items-center rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground xl:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--theme-blue)]" />
          <span className="ml-2 tabular-nums">{fmtClock(now)}</span>
        </div>

        <div className="hidden items-center gap-2 border-l border-border pl-3 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full medical-gradient text-sm font-semibold text-white">
            医
          </div>
          <div className="hidden leading-tight xl:block">
            <div className="text-xs font-medium text-foreground">设备科主任</div>
            <div className="text-[11px] text-muted-foreground">信息中心</div>
          </div>
        </div>
      </div>
    </header>
  );
}
