import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const routeMeta: Record<string, { title: string; subtitle: string }> = {
  "/cockpit": { title: "领导驾驶舱", subtitle: "数据驾驶舱" },
  "/devices": { title: "设备全生命周期管理", subtitle: "业务域" },
  "/ingest": { title: "数据采集监控", subtitle: "业务域" },
  "/govern": { title: "数据治理", subtitle: "业务域" },
  "/exchange": { title: "数据共享交换", subtitle: "业务域" },
  "/master": { title: "主数据管理", subtitle: "业务域" },
  "/quality": { title: "数据质控", subtitle: "业务域" },
  "/platform": { title: "平台服务", subtitle: "平台" },
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { pathname } = useLocation();

  const meta = routeMeta[pathname] ?? { title: "领导驾驶舱", subtitle: "数据驾驶舱" };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const handleRefresh = () => {
    setRefreshing(true);
    setLastUpdated(new Date());
    window.setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title={meta.title}
          subtitle={meta.subtitle}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          dark={dark}
          onToggleDark={() => setDark((d) => !d)}
          lastUpdated={lastUpdated}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
