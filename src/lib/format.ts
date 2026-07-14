// 通用格式化工具

export const fmtInt = (n: number) => n.toLocaleString("zh-CN");

export const fmtPct = (n: number, digits = 1) => `${n.toFixed(digits)}%`;

export const fmtMoney = (n: number) => {
  if (n >= 1e8) return `¥${(n / 1e8).toFixed(2)}亿`;
  if (n >= 1e4) return `¥${(n / 1e4).toFixed(1)}万`;
  return `¥${fmtInt(Math.round(n))}`;
};

export const fmtCompact = (n: number) => {
  if (n >= 1e4) return `${(n / 1e4).toFixed(1)}万`;
  return fmtInt(n);
};

export const fmtTime = (d: Date) =>
  d.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

export const fmtClock = (d: Date) =>
  d.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "short",
  });
