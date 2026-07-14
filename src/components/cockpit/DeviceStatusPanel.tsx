import type { StatusSlice } from "@/lib/mock-data";
import { fmtInt } from "@/lib/format";

export function DeviceStatusPanel({ slices }: { slices: StatusSlice[] }) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  return (
    <div className="flex h-full flex-col justify-center gap-4">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
        {slices.map((s) => (
          <div
            key={s.key}
            className="h-full transition-all duration-500"
            style={{ width: `${(s.value / total) * 100}%`, background: s.color }}
            title={`${s.name} ${s.value}`}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {slices.map((s) => (
          <div key={s.key} className="flex items-center gap-2.5 rounded-lg border border-border/70 bg-muted/30 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-foreground">{fmtInt(s.value)}</div>
              <div className="text-[11px] text-muted-foreground">{s.name}</div>
            </div>
            <div className="ml-auto text-[11px] font-medium text-muted-foreground">
              {((s.value / total) * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
