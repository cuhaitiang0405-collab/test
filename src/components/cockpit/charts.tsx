import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  ComposedChart,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { TrendPoint, ForecastPoint } from "@/lib/mock-data";

// 统一调色（使用具体色值，确保 SVG 渲染可靠）
export const C = {
  blue: "oklch(0.55 0.16 248)",
  cyan: "oklch(0.62 0.14 205)",
  teal: "oklch(0.64 0.13 168)",
  amber: "oklch(0.78 0.16 80)",
  purple: "oklch(0.6 0.18 305)",
  green: "oklch(0.6 0.14 162)",
  red: "oklch(0.6 0.2 25)",
  muted: "oklch(0.6 0.02 248)",
};

function TipBox({
  active,
  payload,
  label,
  suffix = "",
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-xl">
      {label && <div className="mb-1 font-medium text-foreground">{label}</div>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.stroke || p.fill }} />
          <span>{p.name}</span>
          <span className="ml-auto font-medium text-foreground">
            {typeof p.value === "number" ? p.value.toLocaleString("zh-CN") : p.value}
            {suffix}
          </span>
        </div>
      ))}
    </div>
  );
}

const renderTip = (suffix = "") => (props: any) => (
  <TipBox active={props.active} payload={props.payload} label={props.label} suffix={suffix} />
);

const axisProps = {
  tick: { fontSize: 11, fill: "oklch(0.55 0.02 248)" },
  tickLine: false,
  axisLine: false,
};

/* ---------- 运行趋势 ---------- */
export function RunningTrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <defs>
            <linearGradient id="g-run" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.blue} stopOpacity={0.3} />
              <stop offset="100%" stopColor={C.blue} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="g-on" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.cyan} stopOpacity={0.22} />
              <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="g-use" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.teal} stopOpacity={0.18} />
              <stop offset="100%" stopColor={C.teal} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 248)" vertical={false} />
          <XAxis dataKey="label" {...axisProps} />
          <YAxis domain={[80, 100]} {...axisProps} tickFormatter={(v) => `${v}%`} />
          <Tooltip content={renderTip("%")} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          <Area type="monotone" name="运行率" dataKey="运行率" stroke={C.blue} strokeWidth={2.4} fill="url(#g-run)" />
          <Area type="monotone" name="开机率" dataKey="开机率" stroke={C.cyan} strokeWidth={2} fill="url(#g-on)" />
          <Area type="monotone" name="利用率" dataKey="利用率" stroke={C.teal} strokeWidth={2} fill="url(#g-use)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ---------- 设备类型分布（环形） ---------- */
export function DeviceTypePie({ data }: { data: { name: string; value: number }[] }) {
  const colors = [C.blue, C.cyan, C.teal, C.amber, C.purple, C.green, C.muted, C.red];
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="flex h-[260px] w-full items-center gap-4">
      <div className="relative h-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="92%"
              paddingAngle={2}
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={renderTip()} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-xl font-semibold text-foreground">{total.toLocaleString("zh-CN")}</div>
          <div className="text-[11px] text-muted-foreground">设备台数</div>
        </div>
      </div>
      <div className="grid w-32 shrink-0 grid-cols-1 gap-1.5">
        {data.slice(0, 6).map((d, i) => (
          <div key={d.name} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: colors[i % colors.length] }} />
            <span className="text-muted-foreground">{d.name}</span>
            <span className="ml-auto font-medium text-foreground">{((d.value / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 科室工作量 TOP ---------- */
export function DeptWorkloadChart({ data }: { data: { dept: string; value: number }[] }) {
  const sorted = [...data].sort((a, b) => a.value - b.value);
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sorted} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 248)" horizontal={false} />
          <XAxis type="number" {...axisProps} />
          <YAxis type="category" dataKey="dept" {...axisProps} width={84} />
          <Tooltip content={renderTip()} cursor={{ fill: "oklch(0.55 0.13 248 / 0.06)" }} />
          <Bar dataKey="value" name="工作量" radius={[0, 6, 6, 0]} barSize={14}>
            {sorted.map((_, i) => (
              <Cell key={i} fill={i === sorted.length - 1 ? C.blue : C.cyan} fillOpacity={i === sorted.length - 1 ? 1 : 0.55} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ---------- 大型设备检查量 ---------- */
export function LargeDeviceVolumeChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <defs>
            <linearGradient id="g-bar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.teal} stopOpacity={1} />
              <stop offset="100%" stopColor={C.blue} stopOpacity={0.7} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 248)" vertical={false} />
          <XAxis dataKey="name" {...axisProps} />
          <YAxis {...axisProps} />
          <Tooltip content={renderTip()} cursor={{ fill: "oklch(0.55 0.13 248 / 0.06)" }} />
          <Bar dataKey="value" name="检查量" fill="url(#g-bar)" radius={[6, 6, 0, 0]} barSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ---------- AI 趋势预测 ---------- */
export function AiForecastChart({ data }: { data: ForecastPoint[] }) {
  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 248)" vertical={false} />
          <XAxis dataKey="period" {...axisProps} />
          <YAxis domain={[80, 105]} {...axisProps} />
          <Tooltip content={renderTip("%")} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          {/* 置信区间：先画上界，再用背景色覆盖下界，露出区间带 */}
          <Area dataKey="区间上" name="预测区间" stroke="none" fill={C.purple} fillOpacity={0.18} isAnimationActive={false} />
          <Area dataKey="区间下" name="预测区间下" stroke="none" fill="var(--card)" fillOpacity={1} isAnimationActive={false} />
          <Line type="monotone" name="实际" dataKey="实际" stroke={C.blue} strokeWidth={2.6} dot={false} />
          <Line type="monotone" name="预测" dataKey="预测" stroke={C.purple} strokeWidth={2.4} strokeDasharray="6 4" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
