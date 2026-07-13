import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
  Trash2,
  RotateCcw,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ListChecks,
} from "lucide-react";
import {
  stockMovements,
  products,
  getProduct,
  type StockMovement,
  type AdjustmentType,
  type AdjustmentReason,
  type ApprovalStatus,
  ADJUSTMENT_REASONS,
} from "@/lib/inventory-data";
import {
  SectionCard,
  StatusPill,
  PrimaryButton,
  EmptyState,
  StatTile,
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

// Reason badge color map
const reasonColors: Record<string, string> = {
  damaged: "bg-red-50 text-red-700 border-red-200",
  expired: "bg-orange-50 text-orange-700 border-orange-200",
  lost: "bg-red-50 text-red-700 border-red-200",
  "quality-rejection": "bg-red-50 text-red-700 border-red-200",
  returned: "bg-blue-50 text-blue-700 border-blue-200",
  found: "bg-blue-50 text-blue-700 border-blue-200",
  "cycle-count": "bg-slate-100 text-slate-700 border-slate-200",
  manual: "bg-slate-100 text-slate-700 border-slate-200",
};

// Row tint map
function rowTint(m: StockMovement): string {
  const r = m.adjustmentReason;
  if (r === "damaged" || r === "expired" || r === "lost" || r === "quality-rejection")
    return "bg-red-50/30";
  if (r === "found" || r === "returned") return "bg-blue-50/30";
  return "";
}

function getReasonLabel(value: AdjustmentReason | undefined): string {
  if (!value) return "—";
  return ADJUSTMENT_REASONS.find((r) => r.value === value)?.label ?? value;
}

// Quick-action button configs
const QUICK_ACTIONS = [
  {
    label: "Damaged Goods",
    reason: "damaged" as AdjustmentReason,
    adjustmentType: "decrease" as AdjustmentType,
    icon: Trash2,
    colorClass:
      "border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
  },
  {
    label: "Customer Return",
    reason: "returned" as AdjustmentReason,
    adjustmentType: "decrease" as AdjustmentType,
    icon: RotateCcw,
    colorClass:
      "border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100",
  },
  {
    label: "Expired / Obsolete",
    reason: "expired" as AdjustmentReason,
    adjustmentType: "decrease" as AdjustmentType,
    icon: Clock,
    colorClass:
      "border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100",
  },
  {
    label: "Manual Adjustment",
    reason: "manual" as AdjustmentReason,
    adjustmentType: "increase" as AdjustmentType,
    icon: SlidersHorizontal,
    colorClass:
      "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100",
  },
];

export function StockAdjustmentsTab() {
  const [movements, setMovements] = useState<StockMovement[]>(
    stockMovements.filter((m) => m.type === "adjustment")
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>("increase");

  // Filter state
  const [filterType, setFilterType] = useState<"all" | AdjustmentType>("all");
  const [filterReason, setFilterReason] = useState<"all" | AdjustmentReason>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | ApprovalStatus>("all");

  // Form state
  const [formRef, setFormRef] = useState(
    `ADJ-2026-00${String(movements.length + 34).padStart(2, "0")}`
  );
  const [formProduct, setFormProduct] = useState(products[0].id);
  const [formQty, setFormQty] = useState("1");
  const [formReason, setFormReason] = useState("");
  const [formAdjReason, setFormAdjReason] = useState<AdjustmentReason>("manual");
  const [formPerformedBy, setFormPerformedBy] = useState("Warehouse Staff");

  function openCreate(type: AdjustmentType, preReason?: AdjustmentReason) {
    setAdjustmentType(type);
    setFormAdjReason(preReason ?? "manual");
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
      adjustmentReason: formAdjReason,
      approvalStatus: "pending",
      reason: formReason,
      warehouse: "Main Warehouse",
      notes: formReason,
      date: TODAY,
      time: TODAY_TIME,
      performedBy: formPerformedBy || "Warehouse Staff",
    };
    setMovements((prev) => [newMovement, ...prev]);
    setCreateOpen(false);
    const nextNum = movements.length + 35;
    setFormRef(`ADJ-2026-00${String(nextNum).padStart(2, "0")}`);
    setFormProduct(products[0].id);
    setFormQty("1");
    setFormReason("");
    setFormAdjReason("manual");
    setFormPerformedBy("Warehouse Staff");
  }

  function updateApproval(id: string, status: ApprovalStatus) {
    setMovements((prev) =>
      prev.map((m) => (m.id === id ? { ...m, approvalStatus: status } : m))
    );
  }

  // Stats
  const totalAdjustments = movements.length;
  const pendingCount = movements.filter((m) => m.approvalStatus === "pending").length;
  const totalIncreases = movements
    .filter((m) => m.adjustmentType === "increase")
    .reduce((s, m) => s + m.quantity, 0);
  const totalDecreases = movements
    .filter((m) => m.adjustmentType === "decrease")
    .reduce((s, m) => s + m.quantity, 0);

  // Filtered movements
  const filtered = useMemo(() => {
    return movements.filter((m) => {
      if (filterType !== "all" && m.adjustmentType !== filterType) return false;
      if (filterReason !== "all" && m.adjustmentReason !== filterReason) return false;
      if (filterStatus !== "all" && m.approvalStatus !== filterStatus) return false;
      return true;
    });
  }, [movements, filterType, filterReason, filterStatus]);

  return (
    <>
      {/* Summary Stats */}
      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile
          label="Total Adjustments"
          value={String(totalAdjustments)}
          icon={ListChecks}
          bg="bg-violet-50"
          iconColor="text-violet-600"
          index={0}
        />
        <StatTile
          label="Pending Approval"
          value={String(pendingCount)}
          icon={AlertTriangle}
          bg="bg-amber-50"
          iconColor="text-amber-600"
          index={1}
        />
        <StatTile
          label="Total Losses (Decrease)"
          value={`-${totalDecreases} units`}
          icon={TrendingDown}
          bg="bg-red-50"
          iconColor="text-red-600"
          index={2}
        />
        <StatTile
          label="Total Gains (Increase)"
          value={`+${totalIncreases} units`}
          icon={TrendingUp}
          bg="bg-emerald-50"
          iconColor="text-emerald-600"
          index={3}
        />
      </div>

      {/* Approval Required Banner */}
      {pendingCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3"
        >
          <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-600" />
          <p className="text-sm font-semibold text-amber-800">
            Approval Required —{" "}
            <span className="font-bold">{pendingCount}</span>{" "}
            {pendingCount === 1 ? "adjustment is" : "adjustments are"} awaiting approval.
          </p>
        </motion.div>
      )}

      {/* Quick Action Buttons */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {QUICK_ACTIONS.map((qa) => {
          const Icon = qa.icon;
          return (
            <button
              key={qa.reason}
              onClick={() => openCreate(qa.adjustmentType, qa.reason)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${qa.colorClass}`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span>{qa.label}</span>
            </button>
          );
        })}
      </div>

      <SectionCard
        title="Stock Adjustments"
        subtitle={`${filtered.length} of ${movements.length} adjustments`}
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
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-6 py-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mr-1">
            Filter:
          </span>

          {/* Type filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as "all" | AdjustmentType)}
            className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 outline-none focus:border-blue-400"
          >
            <option value="all">All Types</option>
            <option value="increase">Increase</option>
            <option value="decrease">Decrease</option>
          </select>

          {/* Reason filter */}
          <select
            value={filterReason}
            onChange={(e) => setFilterReason(e.target.value as "all" | AdjustmentReason)}
            className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 outline-none focus:border-blue-400"
          >
            <option value="all">All Reasons</option>
            {ADJUSTMENT_REASONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "all" | ApprovalStatus)}
            className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 outline-none focus:border-blue-400"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Period summary pills */}
          <div className="ml-auto flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700">+{totalIncreases} increased</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5">
              <XCircle className="h-3.5 w-3.5 text-red-500" />
              <span className="text-xs font-bold text-red-600">-{totalDecreases} decreased</span>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={SlidersHorizontal}
            title="No adjustments found"
            subtitle="Try changing your filters or create a new stock adjustment."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {[
                    "Reference",
                    "Product",
                    "Type",
                    "Qty",
                    "Reason",
                    "Performed By",
                    "Approval",
                    "Date",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => {
                  const product = getProduct(m.productId);
                  const tint = rowTint(m);
                  const reasonLabel = getReasonLabel(m.adjustmentReason);
                  const reasonCls =
                    m.adjustmentReason
                      ? reasonColors[m.adjustmentReason] ?? "bg-slate-100 text-slate-600 border-slate-200"
                      : "bg-slate-100 text-slate-600 border-slate-200";

                  return (
                    <motion.tr
                      key={m.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                      className={`border-b border-slate-50 hover:bg-slate-50/70 transition-colors ${tint}`}
                    >
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-violet-700">
                        {m.referenceNumber}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {product?.name ?? m.productId}
                      </td>
                      <td className="px-4 py-3">
                        {m.adjustmentType && <StatusPill status={m.adjustmentType} />}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-semibold ${
                            m.adjustmentType === "increase"
                              ? "text-emerald-700"
                              : "text-red-600"
                          }`}
                        >
                          {m.adjustmentType === "increase" ? "+" : "-"}
                          {m.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {m.adjustmentReason ? (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${reasonCls}`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                            {reasonLabel}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">
                            {m.reason ?? "—"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {m.performedBy ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        {m.approvalStatus && (
                          <StatusPill status={m.approvalStatus} />
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {fmtDate(m.date)}
                      </td>
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
            <div
              className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold"
              style={{
                borderColor:
                  adjustmentType === "increase" ? "#a7f3d0" : "#fecaca",
                backgroundColor:
                  adjustmentType === "increase" ? "#f0fdf4" : "#fff1f2",
                color:
                  adjustmentType === "increase" ? "#065f46" : "#991b1b",
              }}
            >
              {adjustmentType === "increase"
                ? "📈 Stock Increase Adjustment"
                : "📉 Stock Decrease Adjustment"}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Reference Number
              </label>
              <input
                type="text"
                value={formRef}
                onChange={(e) => setFormRef(e.target.value)}
                className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Product *
              </label>
              <select
                value={formProduct}
                onChange={(e) => setFormProduct(e.target.value)}
                className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400"
                required
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Quantity *
              </label>
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
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Adjustment Reason *
              </label>
              <select
                value={formAdjReason}
                onChange={(e) =>
                  setFormAdjReason(e.target.value as AdjustmentReason)
                }
                className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400"
                required
              >
                {ADJUSTMENT_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Performed By
              </label>
              <input
                type="text"
                value={formPerformedBy}
                onChange={(e) => setFormPerformedBy(e.target.value)}
                className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400"
                placeholder="Warehouse Staff"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Notes / Reason
              </label>
              <textarea
                value={formReason}
                onChange={(e) => setFormReason(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
                placeholder="Additional notes for this adjustment..."
                required
              />
            </div>

            <p className="text-xs text-slate-400">
              This adjustment will be created with{" "}
              <span className="font-semibold text-amber-600">Pending</span>{" "}
              approval status.
            </p>

            <DialogFooter>
              <DialogClose asChild>
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </DialogClose>
              <PrimaryButton type="submit">Submit Adjustment</PrimaryButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
