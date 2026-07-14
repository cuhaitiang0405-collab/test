import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { fmtInt, fmtMoney, fmtPct } from "@/lib/format";
import type { Kpi } from "@/lib/mock-data";

function displayValue(k: Kpi): string {
  if (k.unit === "%") return fmtPct(k.value);
  if (k.key === "income" || k.key === "expense") return fmtMoney(k.value);
  return fmtInt(k.value);
}

export function KpiCard({ kpi, index }: { kpi: Kpi; index: number }) {
  const positive = kpi.delta >= 0;
  const isGood = kpi.good === "flat" ? true : (kpi.good === "up" ? positive : !positive);
  const spark = kpi.spark.map((v, i) => ({ i, v }));
  const gradId = `spark-${kpi.key}`;

  const Arrow = positive ? ArrowUpRight : kpi.delta === 0 ? Minus : ArrowDownRight;

  return (
    <div
      className="kpi-glow group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-transform duration-300 hover:-translate-y-0.5"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-muted-foreground">{kpi.label}</div>
          <div className="mt-1.5 text-2xl font-semibold tracking-tight text-foreground">
            {displayValue(kpi)}
            {kpi.unit && kpi.unit !== "%" && (
              <span className="ml-1 text-sm font-normal text-muted-foreground">{kpi.unit}</span>
            )}
          </div>
        </div>
        <span
          className={cn(
            "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
            isGood ? "bg-[var(--theme-green)]/10 text-[var(--theme-green)]" : "bg-[var(--theme-red)]/10 text-[var(--theme-red)]"
          )}
        >
          <Arrow className="h-3 w-3" />
          {Math.abs(kpi.delta)}%
        </span>
      </div>

      <div className="mt-3 h-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={spark} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={kpi.color} stopOpacity={0.28} />
                <stop offset="100%" stopColor={kpi.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={kpi.color}
              strokeWidth={1.8}
              fill={`url(#${gradId})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
