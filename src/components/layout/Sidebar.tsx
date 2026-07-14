import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  Radio,
  Database,
  Share2,
  Users,
  ShieldCheck,
  ServerCog,
  HeartPulse,
  PanelLeftClose,
  PanelLeft,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}
interface NavGroup {
  title: string;
  items: NavItem[];
}

const groups: NavGroup[] = [
  {
    title: "数据驾驶舱",
    items: [{ to: "/cockpit", label: "领导驾驶舱", icon: LayoutDashboard }],
  },
  {
    title: "业务域",
    items: [
      { to: "/devices", label: "设备全生命周期", icon: Boxes },
      { to: "/ingest", label: "数据采集监控", icon: Radio },
      { to: "/govern", label: "数据治理", icon: Database },
      { to: "/exchange", label: "共享交换", icon: Share2 },
      { to: "/master", label: "主数据管理", icon: Users },
      { to: "/quality", label: "数据质控", icon: ShieldCheck },
    ],
  },
  {
    title: "平台",
    items: [{ to: "/platform", label: "平台服务", icon: ServerCog }],
  },
];

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const { pathname } = useLocation();

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300",
        collapsed ? "w-[4.5rem]" : "w-64"
      )}
    >
      {/* 品牌 */}
      <div className="flex h-16 items-center gap-3 px-4">
        <div className="medical-gradient flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-md">
          <HeartPulse className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-sidebar-foreground">
              智慧医疗设备中台
            </div>
            <div className="truncate text-[11px] text-muted-foreground">AIOT · 大数据</div>
          </div>
        )}
      </div>

      {/* 导航 */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {groups.map((g) => (
          <div key={g.title}>
            {!collapsed && (
              <div className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {g.title}
              </div>
            )}
            <div className="space-y-1">
              {g.items.map((it) => {
                const active = pathname === it.to;
                const Icon = it.icon;
                return (
                  <NavLink
                    key={it.to}
                    to={it.to}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-sidebar-accent font-medium text-sidebar-primary"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-primary" />
                    )}
                    <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-sidebar-primary" : "")} />
                    {!collapsed && <span className="truncate">{it.label}</span>}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* 底部状态 */}
      <div className="border-t border-sidebar-border p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg bg-sidebar-accent/50 px-3 py-2.5",
            collapsed && "justify-center px-0"
          )}
        >
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--theme-green)] opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--theme-green)]" />
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-xs font-medium text-sidebar-foreground">系统运行正常</div>
              <div className="truncate text-[11px] text-muted-foreground">SLA 99.98%</div>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-sidebar-accent/60"
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          {!collapsed && "收起菜单"}
        </button>
      </div>
    </aside>
  );
}
