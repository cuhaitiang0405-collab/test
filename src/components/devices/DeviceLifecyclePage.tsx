import { useMemo, useState } from "react";
import { Boxes, Plus, Download, Trash2, Search } from "lucide-react";
import {
  getDevices,
  deviceTypes,
  deviceBrandsFlat,
  type DeviceRow,
  type DeviceStatus,
  isExpired,
  warrantyExpiry,
} from "@/lib/mock-data";
import { SectionCard } from "@/components/cockpit/SectionCard";
import { DeviceTable } from "./DeviceTable";
import { DeviceFormModal } from "./DeviceFormModal";

const selectCls =
  "h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20";

const statusTone: Record<string, string> = {
  default: "text-foreground",
  green: "text-[var(--theme-green)]",
  red: "text-[var(--theme-red)]",
  gold: "text-[var(--theme-gold)]",
};

function exportCsv(rows: DeviceRow[]) {
  const header = [
    "设备名称", "设备类型", "型号", "供应商", "序列号", "使用科室", "责任人",
    "状态", "安装日期", "保修期", "保修到期", "维护日期", "是否过保",
  ];
  const toCsv = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = rows.map((d) =>
    [
      d.name, d.type, d.model, d.brand, d.sn, d.dept, d.owner,
      d.status, d.installDate, d.warrantyPeriod,
      warrantyExpiry(d), d.maintenanceDate, isExpired(d) ? "是" : "否",
    ].map(toCsv).join(",")
  );
  const csv = "﻿" + [header.map(toCsv).join(","), ...lines].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `设备台账_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function DeviceLifecyclePage() {
  const [dept, setDept] = useState("全部");
  const [type, setType] = useState("全部");
  const [brand, setBrand] = useState("全部");
  const [status, setStatus] = useState("全部");
  const [q, setQ] = useState("");

  const [rows, setRows] = useState<DeviceRow[]>(() => getDevices());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DeviceRow | null>(null);

  const filtered = useMemo(
    () =>
      rows.filter((d) => {
        if (dept !== "全部" && d.dept !== dept) return false;
        if (type !== "全部" && d.type !== type) return false;
        if (brand !== "全部" && d.brand !== brand) return false;
        if (status !== "全部" && d.status !== status) return false;
        if (q && !`${d.name}${d.sn}${d.owner}${d.dept}${d.brand}`.includes(q)) return false;
        return true;
      }),
    [dept, type, brand, status, q, rows]
  );

  const stats = useMemo(() => {
    const total = filtered.length;
    const running = filtered.filter((d) => d.status === "运行中").length;
    const alarm = filtered.filter((d) => d.status === "告警").length;
    const offline = filtered.filter((d) => d.status === "离线").length;
    const overdue = filtered.filter((d) => isExpired(d)).length;
    return [
      { label: "设备总数", value: `${total} 台`, tone: "default" },
      { label: "运行中", value: `${running} 台`, tone: "green" },
      { label: "告警设备", value: `${alarm} 台`, tone: "red" },
      { label: "离线设备", value: `${offline} 台`, tone: "default" },
      { label: "过保设备", value: `${overdue} 台`, tone: "gold" },
    ];
  }, [filtered]);

  const deptOptions = useMemo(
    () => ["全部", ...Array.from(new Set(rows.map((d) => d.dept)))],
    [rows]
  );

  const toggle = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const toggleAll = () =>
    setSelected(() => {
      const all = filtered.every((d) => selected.has(d.id));
      return all ? new Set() : new Set(filtered.map((d) => d.id));
    });

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (row: DeviceRow) => {
    setEditing(row);
    setModalOpen(true);
  };

  const handleSubmit = (row: DeviceRow) => {
    setRows((rs) => {
      const idx = rs.findIndex((r) => r.id === row.id);
      if (idx >= 0) {
        const next = [...rs];
        next[idx] = row;
        return next;
      }
      return [row, ...rs];
    });
    setModalOpen(false);
  };

  const deleteOne = (row: DeviceRow) => {
    if (!confirm(`确认删除设备「${row.name}」？`)) return;
    setRows((rs) => rs.filter((r) => r.id !== row.id));
    setSelected((s) => {
      const n = new Set(s);
      n.delete(row.id);
      return n;
    });
  };

  const deleteSelected = () => {
    if (selected.size === 0) return;
    if (!confirm(`确认删除选中的 ${selected.size} 台设备？`)) return;
    setRows((rs) => rs.filter((r) => !selected.has(r.id)));
    setSelected(new Set());
  };

  return (
    <div className="grid-backdrop min-h-full">
      <div className="mx-auto max-w-[1600px] space-y-5 p-5 lg:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">设备台账管理</h2>
            <p className="mt-1 text-sm text-muted-foreground">设备档案 · 多维筛选 · 新增 / 编辑 / 导出 / 批量删除</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select value={dept} onChange={(e) => setDept(e.target.value)} className={selectCls}>
              {deptOptions.map((d) => (
                <option key={d} value={d}>{d === "全部" ? "全部科室" : d}</option>
              ))}
            </select>
            <select value={type} onChange={(e) => setType(e.target.value)} className={selectCls}>
              <option value="全部">全部类型</option>
              {deviceTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select value={brand} onChange={(e) => setBrand(e.target.value)} className={selectCls}>
              <option value="全部">全部供应商</option>
              {deviceBrandsFlat.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls}>
              <option value="全部">全部状态</option>
              {(["运行中", "空闲", "告警", "离线"] as DeviceStatus[]).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="搜索名称/序列号"
                className="h-9 w-44 rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* 操作栏 */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={openAdd}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> 新增设备
          </button>
          <button
            onClick={() => exportCsv(filtered)}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-sm text-foreground transition-colors hover:bg-muted"
          >
            <Download className="h-4 w-4" /> 导出 CSV
          </button>
          <button
            onClick={deleteSelected}
            disabled={selected.size === 0}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--theme-red)]/30 px-3.5 text-sm text-[var(--theme-red)] transition-colors hover:bg-[var(--theme-red)]/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" /> 批量删除{selected.size > 0 ? `（${selected.size}）` : ""}
          </button>
          <span className="ml-auto text-xs text-muted-foreground">共 {filtered.length} 台设备</span>
        </div>

        {/* 状态栏 */}
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-card/60 p-4 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col">
              <span className="text-[11px] text-muted-foreground">{s.label}</span>
              <span className={`mt-0.5 text-base font-semibold ${statusTone[s.tone]}`}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* 设备台账列表 */}
        <SectionCard
          title={`设备台账列表（${filtered.length} 台）`}
          icon={Boxes}
          bodyClassName="p-0"
        >
          <DeviceTable
            devices={filtered}
            selected={selected}
            onToggle={toggle}
            onToggleAll={toggleAll}
            onEdit={openEdit}
            onDelete={deleteOne}
          />
        </SectionCard>
      </div>

      <DeviceFormModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
