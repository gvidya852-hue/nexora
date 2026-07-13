import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, CheckCircle2, XCircle, SlidersHorizontal } from "lucide-react";
import {
  stockMovements,
  products,
  getProduct,
  type StockMovement,
  type AdjustmentType,
  type ApprovalStatus,
} from "@/lib/inventory-data";
import {
  SectionCard,
  StatusPill,
  PrimaryButton,
  SecondaryButton,
  EmptyState,
  fmtDate,
} from "@/components/inventory/shared";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const TODAY = "2026-07-13";
const TODAY_TIME = "10:00 AM";

export function StockAdjustmentsTab() {
  const [movements, setMovements] = useState<StockMovement[]>(
    stockMovements.filter((m) => m.type === "adjustment")
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>("increase");

  // Form state
  const [formRef, setFormRef] = useState(`ADJ-2026-00${String(movements.length + 34).padStart(2, "0")}`);
  const [formProduct, setFormProduct] = useState(products[0].id);
  const [formQty, setFormQty] = useState("1");
  const [formReason, setFormReason] = useState("");

  function openCreate(type: AdjustmentType) {
    setAdjustmentType(type);
    setCreateOpen(true);
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const newMovement: StockMovement = {
      id: `sm_adj_${Date.now()}`,
      type: "adjustment",
      referenceNumber: formRef,
      productId: formProduct,
      quantity: parseFloat(formQty) || 1,
      adjustmentType,
      approvalStatus: "pending",
      reason: formReason,
      warehouse: "Main Warehouse",
      notes: formReason,
      date: TODAY,
      time: TODAY_TIME,
    };
    setMovements((prev) => [newMovement, ...prev]);
    setCreateOpen(false);
    const nextNum = movements.length + 35;
    setFormRef(`ADJ-2026-00${String(nextNum).padStart(2, "0")}`);
    setFormProduct(products[0].id);
    setFormQty("1");
    setFormReason("");
  }

  function updateApproval(id: string, status: ApprovalStatus) {
    setMovements((prev) =>
      prev.map((m) => (m.id === id ? { ...m, approvalStatus: status } : m))
    );
  }

  const totalIncreases = movements
    .filter((m) => m.adjustmentType === "increase")
    .reduce((s, m) => s + m.quantity, 0);

  const totalDecreases = movements
    .filter((m) => m.adjustmentType === "decrease")
    .reduce((s, m) => s + m.quantity, 0);

  return (
    <>
      <SectionCard
        title="Stock Adjustments"
        subtitle={`${movements.length} adjustments`}
        action={
          <div className="flex items-center gap-2">
            <PrimaryButton icon={Plus} onClick={() => openCreate("increase")}>
              Increase Stock
            </PrimaryButton>
            <button
              onClick={() => openCreate("decrease")}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Decrease Stock
            </button>
          </div>
        }
        noPadding
      >
        {/* Adjustment History Summary */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-3">
          <p className="mr-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">This Period:</p>
          <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-700">+{totalIncreases} units increased</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5">
            <XCircle className="h-3.5 w-3.5 text-red-500" />
            <span className="text-xs font-bold text-red-600">-{totalDecreases} units decreased</span>
          </div>
        </div>

        {movements.length === 0 ? (
          <EmptyState icon={SlidersHorizontal} title="No adjustments" subtitle="Create a stock adjustment to get started." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {["Reference", "Product", "Type", "Quantity", "Reason", "Approval", "Date", "Notes", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {movements.map((m, i) => {
                  const product = getProduct(m.productId);
                  return (
                    <motion.tr
                      key={m.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                      className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-violet-700">{m.referenceNumber}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{product?.name ?? m.productId}</td>
                      <td className="px-4 py-3">
                        {m.adjustmentType && <StatusPill status={m.adjustmentType} />}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${m.adjustmentType === "increase" ? "text-emerald-700" : "text-red-600"}`}>
                          {m.adjustmentType === "increase" ? "+" : "-"}{m.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-[140px] truncate">{m.reason ?? "—"}</td>
                      <td className="px-4 py-3">
                        {m.approvalStatus && <StatusPill status={m.approvalStatus} />}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{fmtDate(m.date)}</td>
                      <td className="px-4 py-3 text-slate-500 max-w-[140px] truncate">{m.notes || "—"}</td>
                      <td className="px-4 py-3">
                        {m.approvalStatus === "pending" ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateApproval(m.id, "approved")}
                              className="flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                            >
                              <CheckCircle2 className="h-3 w-3" /> Approve
                            </button>
                            <button
                              onClick={() => updateApproval(m.id, "rejected")}
                              className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
                            >
                              <XCircle className="h-3 w-3" /> Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* Create Adjustment Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {adjustmentType === "increase" ? "Increase Stock" : "Decrease Stock"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold"
              style={{
                borderColor: adjustmentType === "increase" ? "#a7f3d0" : "#fecaca",
                backgroundColor: adjustmentType === "increase" ? "#f0fdf4" : "#fff1f2",
                color: adjustmentType === "increase" ? "#065f46" : "#991b1b",
              }}
            >
              {adjustmentType === "increase" ? "📈 Stock Increase Adjustment" : "📉 Stock Decrease Adjustment"}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Reference Number</label>
              <input
                type="text"
                value={formRef}
                onChange={(e) => setFormRef(e.target.value)}
                className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Product *</label>
              <select
                value={formProduct}
                onChange={(e) => setFormProduct(e.target.value)}
                className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400"
                required
              >
                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Quantity *</label>
              <input
                type="number"
                min="1"
                value={formQty}
                onChange={(e) => setFormQty(e.target.value)}
                className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Reason</label>
              <textarea
                value={formReason}
                onChange={(e) => setFormReason(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
                placeholder="Reason for adjustment..."
                required
              />
            </div>
            <p className="text-xs text-slate-400">This adjustment will be created with <span className="font-semibold text-amber-600">Pending</span> approval status.</p>
            <DialogFooter>
              <DialogClose asChild>
                <button type="button" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
              </DialogClose>
              <PrimaryButton type="submit">
                Submit Adjustment
              </PrimaryButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
