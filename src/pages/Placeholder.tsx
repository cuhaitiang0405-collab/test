import { Construction, type LucideIcon } from "lucide-react";
import { Boxes, Radio, Database, Share2, Users, ShieldCheck, ServerCog, Truck, Activity, Wrench, ClipboardCheck } from "lucide-react";

const plans: Record<
  string,
  { icon: LucideIcon; desc: string; features: string[] }
> = {
  "/devices": {
    icon: Boxes,
    desc: "设备全生命周期管理",
    features: ["电子档案 / 二维码", "运行率 / 利用率统计", "维修工单闭环", "保养巡检计划"],
  },
  "/ingest": {
    icon: Radio,
    desc: "数据采集与接入监控",
    features: ["多协议硬件接入", "实时 / 定时采集", "采集任务监控面板", "断连自动告警"],
  },
  "/govern": {
    icon: Database,
    desc: "数据治理与存储",
    features: ["可视化清洗规则", "标准字典库映射", "ICD-10 / LOINC 编码", "敏感数据脱敏"],
  },
  "/exchange": {
    icon: Share2,
    desc: "数据共享与交换",
    features: ["数据服务总线", "REST / gRPC / SOAP", "API 网关权限", "调用链路监控"],
  },
  "/master": {
    icon: Users,
    desc: "主数据与主索引管理",
    features: ["患者主索引", "OneID 统一标识", "主数据版本控制", "实时同步各系统"],
  },
  "/quality": {
    icon: ShieldCheck,
    desc: "数据质控管理",
    features: ["表内 / 表间校验", "定时 / 实时监控", "异常告警整改", "质控报告归档"],
  },
  "/platform": {
    icon: ServerCog,
    desc: "平台服务与治理",
    features: ["可插拔组件", "SLA / 熔断降级", "服务注册发现", "调用审计"],
  },
  "/devices/procure": {
    icon: Truck,
    desc: "设备采购与入库管理",
    features: ["采购申请与审批", "到货验收登记", "入库上架建档", "资产卡片生成"],
  },
  "/devices/operation": {
    icon: Activity,
    desc: "设备运行管理",
    features: ["实时运行状态", "开机时长 / 利用率", "能耗与负载监测", "异常自动告警"],
  },
  "/devices/repair": {
    icon: Wrench,
    desc: "维修管理",
    features: ["多渠道报修", "工单派发与跟踪", "维修记录归档", "备件消耗统计"],
  },
  "/devices/maintenance": {
    icon: ClipboardCheck,
    desc: "保养与巡检管理",
    features: ["保养计划编排", "巡检任务下发", "到期自动提醒", "执行结果归档"],
  },
};

export function Placeholder({ path }: { path: string }) {
  const plan = plans[path] ?? { icon: Construction, desc: "模块建设中", features: [] };
  const Icon = plan.icon;
  return (
    <div className="grid-backdrop flex min-h-full items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-foreground">{plan.desc}</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          该模块将在后续迭代中填充。当前已开放「领导驾驶舱」作为首期核心演示。
        </p>
        {plan.features.length > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {plan.features.map((f) => (
              <span
                key={f}
                className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground"
              >
                {f}
              </span>
            ))}
          </div>
        )}
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600">
          <Construction className="h-3.5 w-3.5" />
          规划中
        </div>
      </div>
    </div>
  );
}
