import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  PieChart,
  BarChart3,
  LineChart,
  AlertTriangle,
  Gauge,
  Cpu,
} from "lucide-react";
import {
  departments,
  rangeOptions,
  getKpis,
  getSummaryStats,
  getRunningTrend,
  getDeviceTypeDist,
  getDeptWorkload,
  getLargeDeviceVolume,
  getDeviceStatus,
  getAiForecast,
  getInitialAlerts,
  makeAlert,
  type TimeRange,
  type DeptId,
  type AlertItem,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { KpiCard } from "./KpiCard";
import { SectionCard } from "./SectionCard";
import { AlertFeed } from "./AlertFeed";
import { DeviceStatusPanel } from "./DeviceStatusPanel";
import {
  RunningTrendChart,
  DeviceTypePie,
  DeptWorkloadChart,
  LargeDeviceVolumeChart,
  AiForecastChart,
} from "./charts";

export function CockpitPage() {
  const [range, setRange] = useState<TimeRange>("today");
  const [dept, setDept] = useState<DeptId>("all");
  const [live, setLive] = useState(0);
  const [alerts, setAlerts] = useState<AlertItem[]>(() => getInitialAlerts());

  const kpis = useMemo(() => getKpis(range, dept, live), [range, dept, live]);
  const summary = useMemo(() => getSummaryStats(range, dept), [range, dept]);
  const trend = useMemo(() => getRunningTrend(range, dept), [range, dept]);
  const types = useMemo(() => getDeviceTypeDist(range, dept), [range, dept]);
  const workload = useMemo(() => getDeptWorkload(range), [range]);
  const volume = useMemo(() => getLargeDeviceVolume(range, dept), [range, dept]);
  const status = useMemo(() => getDeviceStatus(range, dept), [range, dept]);
  const forecast = useMemo(() => getAiForecast(), []);

  // 实时模拟：每 6 秒推送一条新告警并轻微抖动指标
  useEffect(() => {
    const t = setInterval(() => {
      setLive((l) => l + 1);
      setAlerts((prev) => [makeAlert(live), ...prev].slice(0, 14));
    }, 6000);
    return () => clearInterval(t);
  }, [live]);

  return (
    <div className="grid-backdrop min-h-full">
      <div className="mx-auto max-w-[1600px] space-y-5 p-5 lg:p-6">
        {/* 标题 + 控制 */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">领导驾驶舱</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              全院医疗设备运行概览 · 数据驱动决策中枢
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* 时间范围 */}
            <div className="flex rounded-lg border border-border bg-card p-0.5">
              {rangeOptions.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setRange(o.id)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    range === o.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {o.name}
                </button>
              ))}
            </div>
            {/* 科室筛选 */}
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value as DeptId)}
              className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 汇总条 */}
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-card/60 p-4 sm:grid-cols-3 lg:grid-cols-5">
          {summary.map((s) => (
            <div key={s.label} className="flex flex-col">
              <span className="text-[11px] text-muted-foreground">{s.label}</span>
              <span className="mt-0.5 text-base font-semibold text-foreground">{s.value}</span>
            </div>
          ))}
        </div>

        {/* KPI 卡片 */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {kpis.map((k, i) => (
            <KpiCard key={k.key} kpi={k} index={i} />
          ))}
        </div>

        {/* 图表网格 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionCard title="全院设备运行趋势" icon={Activity}>
              <RunningTrendChart data={trend} />
            </SectionCard>
          </div>
          <SectionCard title="设备类型分布" icon={PieChart}>
            <DeviceTypePie data={types} />
          </SectionCard>

          <SectionCard title="科室工作量 TOP" icon={BarChart3}>
            <DeptWorkloadChart data={workload} />
          </SectionCard>
          <SectionCard title="大型设备检查量" icon={Cpu}>
            <LargeDeviceVolumeChart data={volume} />
          </SectionCard>
          <SectionCard title="AI 运行率预测" icon={LineChart} action={<span className="text-[11px] text-muted-foreground">未来 6 月</span>}>
            <AiForecastChart data={forecast} />
          </SectionCard>

          <SectionCard title="设备实时状态" icon={Gauge}>
            <DeviceStatusPanel slices={status} />
          </SectionCard>
          <div className="lg:col-span-2">
            <SectionCard
              title="实时告警"
              icon={AlertTriangle}
              action={
                <span className="flex items-center gap-1.5 text-[11px] text-[var(--theme-red)]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--theme-red)] opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--theme-red)]" />
                  </span>
                  实时
                </span>
              }
            >
              <div className="h-[260px]">
                <AlertFeed alerts={alerts} />
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
