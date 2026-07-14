import { useEffect, useRef, useState } from "react";
import { X, Upload } from "lucide-react";
import {
  type DeviceRow,
  type DeviceStatus,
  deviceTypes,
  deviceBrandsFlat,
} from "@/lib/mock-data";

type FormState = Omit<DeviceRow, "id"> & { id?: string };

const emptyForm: FormState = {
  name: "",
  type: deviceTypes[0],
  model: "",
  brand: deviceBrandsFlat[0],
  sn: "",
  dept: "",
  owner: "",
  status: "运行中",
  installDate: "",
  warrantyPeriod: "3年",
  maintenanceDate: "",
};

const fieldCls =
  "h-9 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20";
const labelCls = "mb-1 block text-xs font-medium text-muted-foreground";

export function DeviceFormModal({
  open,
  initial,
  onClose,
  onSubmit,
}: {
  open: boolean;
  initial: DeviceRow | null;
  onClose: () => void;
  onSubmit: (row: DeviceRow) => void;
}) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...initial } : emptyForm);
      setErrors({});
    }
  }, [open, initial]);

  if (!open) return null;

  const set = (k: keyof FormState, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "请填写设备名称";
    if (!form.model.trim()) e.model = "请填写型号";
    if (!form.sn.trim()) e.sn = "请填写序列号";
    if (!form.dept.trim()) e.dept = "请填写使用科室";
    if (!form.owner.trim()) e.owner = "请填写责任人";
    if (!form.installDate) e.installDate = "请选择安装日期";
    if (!form.maintenanceDate) e.maintenanceDate = "请选择维护日期";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      id: form.id ?? `DEV-${Date.now().toString().slice(-6).padStart(4, "0")}`,
      name: form.name,
      type: form.type,
      model: form.model,
      brand: form.brand,
      sn: form.sn,
      dept: form.dept,
      owner: form.owner,
      status: form.status as DeviceStatus,
      installDate: form.installDate,
      warrantyPeriod: form.warrantyPeriod,
      maintenanceDate: form.maintenanceDate,
      qrImage: form.qrImage,
    });
  };

  const onFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("qrImage", reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-base font-semibold text-foreground">
            {initial ? "编辑设备" : "新增设备"}
          </h3>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          <div>
            <label className={labelCls}>设备名称 *</label>
            <input className={fieldCls} value={form.name} onChange={(e) => set("name", e.target.value)} />
            {errors.name && <p className="mt-1 text-xs text-[var(--theme-red)]">{errors.name}</p>}
          </div>
          <div>
            <label className={labelCls}>设备类型 *</label>
            <select className={fieldCls} value={form.type} onChange={(e) => set("type", e.target.value)}>
              {deviceTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>型号 *</label>
            <input className={fieldCls} value={form.model} onChange={(e) => set("model", e.target.value)} />
            {errors.model && <p className="mt-1 text-xs text-[var(--theme-red)]">{errors.model}</p>}
          </div>
          <div>
            <label className={labelCls}>供应商（品牌）*</label>
            <select className={fieldCls} value={form.brand} onChange={(e) => set("brand", e.target.value)}>
              {deviceBrandsFlat.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>序列号 *</label>
            <input className={fieldCls} value={form.sn} onChange={(e) => set("sn", e.target.value)} />
            {errors.sn && <p className="mt-1 text-xs text-[var(--theme-red)]">{errors.sn}</p>}
          </div>
          <div>
            <label className={labelCls}>状态 *</label>
            <select className={fieldCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
              {(["运行中", "空闲", "告警", "离线"] as DeviceStatus[]).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>使用科室 *</label>
            <input className={fieldCls} value={form.dept} onChange={(e) => set("dept", e.target.value)} />
            {errors.dept && <p className="mt-1 text-xs text-[var(--theme-red)]">{errors.dept}</p>}
          </div>
          <div>
            <label className={labelCls}>责任人 *</label>
            <input className={fieldCls} value={form.owner} onChange={(e) => set("owner", e.target.value)} />
            {errors.owner && <p className="mt-1 text-xs text-[var(--theme-red)]">{errors.owner}</p>}
          </div>
          <div>
            <label className={labelCls}>安装日期 *</label>
            <input type="date" className={fieldCls} value={form.installDate} onChange={(e) => set("installDate", e.target.value)} />
            {errors.installDate && <p className="mt-1 text-xs text-[var(--theme-red)]">{errors.installDate}</p>}
          </div>
          <div>
            <label className={labelCls}>保修期 *</label>
            <select className={fieldCls} value={form.warrantyPeriod} onChange={(e) => set("warrantyPeriod", e.target.value)}>
              {["1年", "2年", "3年", "5年"].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>维护日期 *</label>
            <input type="date" className={fieldCls} value={form.maintenanceDate} onChange={(e) => set("maintenanceDate", e.target.value)} />
            {errors.maintenanceDate && <p className="mt-1 text-xs text-[var(--theme-red)]">{errors.maintenanceDate}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>二维码 / 条码图片（选填，上传后仅作为设备记录保存）</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-foreground transition-colors hover:bg-muted"
              >
                <Upload className="h-4 w-4" /> 上传图片
              </button>
              {form.qrImage ? (
                <img src={form.qrImage} alt="二维码" className="h-12 w-12 rounded-md border border-border object-contain" />
              ) : (
                <span className="text-xs text-muted-foreground">未上传</span>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-border px-5 py-4">
          <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted">
            取消
          </button>
          <button onClick={handleSubmit} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90">
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
