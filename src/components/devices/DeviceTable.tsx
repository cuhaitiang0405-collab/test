import { type DeviceRow, type DeviceStatus, warrantyExpiry, isExpired } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusStyle: Record<DeviceStatus, string> = {
  运行中: "bg-[var(--theme-green)]/10 text-[var(--theme-green)]",
  空闲: "bg-[var(--theme-blue)]/10 text-[var(--theme-blue)]",
  告警: "bg-[var(--theme-red)]/10 text-[var(--theme-red)]",
  离线: "bg-muted text-muted-foreground",
};

export function DeviceTable({
  devices,
  selected,
  onToggle,
  onToggleAll,
  onEdit,
  onDelete,
}: {
  devices: DeviceRow[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  onEdit: (row: DeviceRow) => void;
  onDelete: (row: DeviceRow) => void;
}) {
  const allChecked = devices.length > 0 && devices.every((d) => selected.has(d.id));
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1180px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
            <th className="w-10 px-3 py-2.5">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={onToggleAll}
                className="h-4 w-4 cursor-pointer accent-primary"
                aria-label="全选"
              />
            </th>
            <th className="px-3 py-2.5">设备名称</th>
            <th className="px-3 py-2.5">类型</th>
            <th className="px-3 py-2.5">型号</th>
            <th className="px-3 py-2.5">序列号</th>
            <th className="px-3 py-2.5">科室</th>
            <th className="px-3 py-2.5">责任人</th>
            <th className="px-3 py-2.5">品牌</th>
            <th className="px-3 py-2.5">状态</th>
            <th className="px-3 py-2.5">安装日期</th>
            <th className="px-3 py-2.5">保修期</th>
            <th className="px-3 py-2.5">保修到期</th>
            <th className="px-3 py-2.5">维护日期</th>
            <th className="px-3 py-2.5 text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((d) => {
            const expired = isExpired(d);
            return (
              <tr key={d.id} className="border-b border-border/60 transition-colors hover:bg-muted/40">
                <td className="px-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={selected.has(d.id)}
                    onChange={() => onToggle(d.id)}
                    className="h-4 w-4 cursor-pointer accent-primary"
                    aria-label={`选择 ${d.name}`}
                  />
                </td>
                <td className="px-3 py-2.5 font-medium text-foreground">{d.name}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{d.type}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{d.model}</td>
                <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">{d.sn}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{d.dept}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{d.owner}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{d.brand}</td>
                <td className="px-3 py-2.5">
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", statusStyle[d.status])}>
                    {d.status}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-muted-foreground">{d.installDate}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{d.warrantyPeriod}</td>
                <td className="px-3 py-2.5">
                  <span className={cn("text-muted-foreground", expired && "font-medium text-[var(--theme-gold)]")}>
                    {warrantyExpiry(d)}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-muted-foreground">{d.maintenanceDate}</td>
                <td className="px-3 py-2.5">
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => onEdit(d)}
                      className="rounded-md border border-border px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-muted"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => onDelete(d)}
                      className="rounded-md border border-[var(--theme-red)]/30 px-2.5 py-1 text-xs text-[var(--theme-red)] transition-colors hover:bg-[var(--theme-red)]/10"
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {devices.length === 0 && (
            <tr>
              <td colSpan={14} className="px-3 py-10 text-center text-sm text-muted-foreground">
                没有符合条件的设备
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
