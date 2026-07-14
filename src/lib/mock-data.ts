// 模拟数据层 —— 领导驾驶舱所需全部指标均由此处生成
// 数据以 (时间范围, 科室) 为输入，使用确定性伪随机，保证切换时稳定可复现

import { fmtInt } from "./format";

export type TimeRange = "today" | "week" | "month" | "year";
export type DeptId =
  | "all"
  | "影像科"
  | "急诊科"
  | "重症医学科"
  | "手术室"
  | "心血管内科"
  | "神经内科";

export interface DeptOption {
  id: DeptId;
  name: string;
}

export const departments: DeptOption[] = [
  { id: "all", name: "全院" },
  { id: "影像科", name: "影像科" },
  { id: "急诊科", name: "急诊科" },
  { id: "重症医学科", name: "重症医学科" },
  { id: "手术室", name: "手术室" },
  { id: "心血管内科", name: "心血管内科" },
  { id: "神经内科", name: "神经内科" },
];

export const rangeOptions: { id: TimeRange; name: string }[] = [
  { id: "today", name: "今日" },
  { id: "week", name: "本周" },
  { id: "month", name: "本月" },
  { id: "year", name: "本年" },
];

// ---- 确定性伪随机 ----
function hashSeed(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rngFor(key: string, salt = 0) {
  return mulberry32(hashSeed(key) + salt);
}

// 科室规模系数（用于缩放指标）
const deptScale: Record<DeptId, number> = {
  all: 1,
  影像科: 0.22,
  急诊科: 0.18,
  重症医学科: 0.12,
  手术室: 0.15,
  心血管内科: 0.16,
  神经内科: 0.14,
};

// ---- KPI ----
export interface Kpi {
  key: string;
  label: string;
  value: number;
  unit: string;
  delta: number; // 同比/环比百分比
  good: "up" | "down" | "flat";
  spark: number[];
  color: string;
}

export function getKpis(range: TimeRange, dept: DeptId, live = 0): Kpi[] {
  const r = rngFor(`${range}-${dept}-kpi`, live);
  const s = deptScale[dept];

  const jitter = (base: number, amp: number) => base + (r() - 0.5) * amp;

  const runRate = jitter(96.4 + (dept === "all" ? 0 : 0.6), 1.4) * (dept === "all" ? 1 : 1);
  const patients = Math.round(jitter(1842, 120) * s * (dept === "all" ? 1 : 1.0));
  const income = Math.round(jitter(2.34e6, 3e5) * s);
  const expense = Math.round(jitter(1.12e6, 1.6e5) * s);
  const warnings = Math.round(jitter(dept === "all" ? 23 : 5, dept === "all" ? 8 : 3));

  const spark = (n: number, base: number, amp: number) =>
    Array.from({ length: n }, () => base + (r() - 0.5) * amp);

  return [
    {
      key: "runRate",
      label: "设备运行率",
      value: +runRate.toFixed(1),
      unit: "%",
      delta: +jitter(2.3, 1.2).toFixed(1),
      good: "up",
      spark: spark(16, runRate, 2.2),
      color: "var(--theme-blue)",
    },
    {
      key: "patients",
      label: "在院患者数",
      value: patients,
      unit: "人",
      delta: +jitter(1.6, 1.0).toFixed(1),
      good: "up",
      spark: spark(16, patients, patients * 0.12),
      color: "var(--theme-teal)",
    },
    {
      key: "income",
      label: "今日医疗收入",
      value: income,
      unit: "",
      delta: +jitter(4.1, 2.0).toFixed(1),
      good: "up",
      spark: spark(16, income, income * 0.1),
      color: "var(--theme-green)",
    },
    {
      key: "expense",
      label: "今日运行支出",
      value: expense,
      unit: "",
      delta: +jitter(-1.2, 1.5).toFixed(1),
      good: "down",
      spark: spark(16, expense, expense * 0.1),
      color: "var(--theme-gold)",
    },
    {
      key: "warnings",
      label: "实时预警数",
      value: warnings,
      unit: "条",
      delta: +jitter(8.5, 4).toFixed(1),
      good: "down",
      spark: spark(16, warnings, warnings * 0.4),
      color: "var(--theme-red)",
    },
  ];
}

// ---- 顶部汇总条 ----
export interface SummaryStat {
  label: string;
  value: string;
}

export function getSummaryStats(range: TimeRange, dept: DeptId): SummaryStat[] {
  const s = deptScale[dept];
  const r = rngFor(`${range}-${dept}-summary`);
  const totalDevices = Math.round((dept === "all" ? 3842 : 3842 * s) );
  const online = Math.round(totalDevices * (0.9 + r() * 0.06));
  return [
    { label: "接入设备总数", value: `${fmtInt(totalDevices)} 台` },
    { label: "在线设备", value: `${fmtInt(online)} 台` },
    { label: "接入协议", value: "HL7 · DICOM · IHE · ASTM" },
    { label: "数据总量", value: `${(2.4 + r() * 0.8).toFixed(1)} PB` },
    { label: "今日采集任务", value: `${fmtInt(Math.round((dept === "all" ? 1286 : 1286 * s)))} 次` },
  ];
}

// ---- 运行趋势 ----
export interface TrendPoint {
  label: string;
  运行率: number;
  开机率: number;
  利用率: number;
}

export function getRunningTrend(range: TimeRange, dept: DeptId): TrendPoint[] {
  const cfg: Record<TimeRange, { n: number; step: string; fmt: (i: number) => string }> = {
    today: {
      n: 24,
      step: "h",
      fmt: (i) => `${String(i).padStart(2, "0")}:00`,
    },
    week: {
      n: 7,
      step: "d",
      fmt: (i) => ["周一", "周二", "周三", "周四", "周五", "周六", "周日"][i],
    },
    month: {
      n: 30,
      step: "d",
      fmt: (i) => `${i + 1}日`,
    },
    year: {
      n: 12,
      step: "m",
      fmt: (i) => `${i + 1}月`,
    },
  };
  const c = cfg[range];
  const r = rngFor(`${range}-${dept}-trend`);
  const base = 94 + rngFor(`${range}-${dept}-trend-base`)() * 3;
  return Array.from({ length: c.n }, (_, i) => {
    const wave = Math.sin((i / c.n) * Math.PI * 2) * 1.6;
    const noise = (r() - 0.5) * 2.4;
    const 运行率 = +(base + wave * 0.6 + noise).toFixed(1);
    const 开机率 = +(运行率 - 1.5 + (r() - 0.5) * 2).toFixed(1);
    const 利用率 = +(运行率 - 4 + (r() - 0.5) * 3).toFixed(1);
    return { label: c.fmt(i), 运行率, 开机率, 利用率 };
  });
}

// ---- 设备类型分布 ----
export function getDeviceTypeDist(range: TimeRange, dept: DeptId): { name: string; value: number }[] {
  const r = rngFor(`${range}-${dept}-types`);
  const base = [
    ["CT", 420],
    ["MRI", 180],
    ["超声", 560],
    ["DR", 310],
    ["监护仪", 980],
    ["呼吸机", 420],
    ["输液泵", 520],
    ["其他", 452],
  ];
  const s = deptScale[dept];
  return base.map(([name, v]) => ({
    name: name as string,
    value: Math.round((v as number) * s * (0.92 + r() * 0.16)),
  }));
}

// ---- 科室工作量 TOP ----
export function getDeptWorkload(range: TimeRange): { dept: string; value: number }[] {
  const r = rngFor(`${range}-workload`);
  const data = [
    ["影像科", 3120],
    ["急诊科", 2680],
    ["重症医学科", 1980],
    ["手术室", 1740],
    ["心血管内科", 1560],
    ["神经内科", 1320],
    ["呼吸内科", 1180],
    ["骨科", 980],
  ];
  return data.map(([dept, v]) => ({
    dept: dept as string,
    value: Math.round((v as number) * (0.85 + r() * 0.3)),
  }));
}

// ---- 大型设备检查量 ----
export function getLargeDeviceVolume(range: TimeRange, dept: DeptId): { name: string; value: number }[] {
  const r = rngFor(`${range}-${dept}-large`);
  const scale = range === "today" ? 1 : range === "week" ? 6.8 : range === "month" ? 29 : 350;
  const base = [
    ["CT", 860],
    ["MRI", 420],
    ["PET-CT", 180],
    ["超声", 1240],
    ["DSA", 260],
    ["DR", 720],
  ];
  return base.map(([name, v]) => ({
    name: name as string,
    value: Math.round((v as number) * scale * (0.9 + r() * 0.2)),
  }));
}

// ---- 设备状态分布 ----
export interface StatusSlice {
  key: string;
  name: string;
  value: number;
  color: string;
}
export function getDeviceStatus(range: TimeRange, dept: DeptId): StatusSlice[] {
  const r = rngFor(`${range}-${dept}-status`);
  const total = Math.round(3842 * deptScale[dept]);
  const online = Math.round(total * (0.86 + r() * 0.04));
  const idle = Math.round((total - online) * (0.6 + r() * 0.2));
  const alarm = Math.round(total * (0.012 + r() * 0.01));
  const offline = total - online - idle - alarm;
  return [
    { key: "online", name: "运行中", value: online, color: "var(--theme-green)" },
    { key: "idle", name: "空闲", value: idle, color: "var(--theme-blue)" },
    { key: "alarm", name: "告警", value: alarm, color: "var(--theme-red)" },
    { key: "offline", name: "离线", value: offline, color: "var(--muted-foreground)" },
  ];
}

// ---- AI 趋势预测（设备科驾驶舱） ----
export interface ForecastPoint {
  period: string;
  实际?: number;
  预测?: number;
  区间上?: number;
  区间下?: number;
}
export function getAiForecast(): ForecastPoint[] {
  const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
  const hist = [92, 90, 94, 93, 95, 94, 96, 95, 96, 97, 96, 97];
  const points: ForecastPoint[] = months.map((m, i) => {
    if (i <= 6) return { period: m, 实际: hist[i] };
    if (i <= 9) return { period: m, 实际: hist[i], 预测: hist[i] + (i - 6) * 0.8, 区间上: hist[i] + 2.4, 区间下: hist[i] - 1.0 };
    return { period: m, 预测: hist[6] + (i - 6) * 0.8, 区间上: hist[6] + (i - 6) * 0.8 + 2.6, 区间下: hist[6] + (i - 6) * 0.8 - 1.2 };
  });
  return points;
}

// ---- 实时告警 ----
export type AlertLevel = "严重" | "警告" | "提示";
export interface AlertItem {
  id: string;
  level: AlertLevel;
  device: string;
  dept: string;
  message: string;
  time: Date;
}

const alertTemplates: { level: AlertLevel; device: string; dept: string; message: string }[] = [
  { level: "严重", device: "CT-03", dept: "影像科", message: "球管温度异常，建议立即停机检查" },
  { level: "警告", device: "MRI-01", dept: "影像科", message: "冷头报警，液氦压力偏低" },
  { level: "警告", device: "呼吸机-12", dept: "重症医学科", message: "潮气量偏差超过阈值 8%" },
  { level: "提示", device: "监护仪-208", dept: "急诊科", message: "电池电量低于 20%，请充电" },
  { level: "严重", device: "DSA-02", dept: "手术室", message: "链路中断，采集服务不可达" },
  { level: "警告", device: "输液泵-44", dept: "神经内科", message: "阻塞报警，流速异常" },
  { level: "提示", device: "DR-07", dept: "影像科", message: "平板探测器校准到期" },
  { level: "警告", device: "超声-19", dept: "心血管内科", message: "探头接触不良，图像噪点增加" },
];

let alertSeq = 0;
export function makeAlert(live = 0): AlertItem {
  const t = alertTemplates[Math.floor((hashSeed(`a-${alertSeq}-${live}`) % alertTemplates.length))];
  alertSeq++;
  return {
    id: `AL-${Date.now()}-${alertSeq}`,
    level: t.level,
    device: t.device,
    dept: t.dept,
    message: t.message,
    time: new Date(),
  };
}

export function getInitialAlerts(): AlertItem[] {
  const now = Date.now();
  return alertTemplates
    .slice()
    .reverse()
    .map((t, i) => ({
      id: `AL-init-${i}`,
      level: t.level,
      device: t.device,
      dept: t.dept,
      message: t.message,
      time: new Date(now - i * 1000 * 60 * (2 + (i % 5))),
    }));
}

// 时间范围标签
export function rangeLabel(range: TimeRange): string {
  return rangeOptions.find((o) => o.id === range)?.name ?? "";
}
