import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, PackageMinus, List, Clock } from "lucide-react";
import {
  stockMovements,
  products,
  getProduct,
  type StockMovement,
} from "@/lib/inventory-data";
import {
  SectionCard,
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

const REASONS = ["Sale", "Damage", "Return to Supplier", "Internal Use", "Other"];

export function StockOutTab() {
  const [movements, setMovements] = useState<StockMovement[]>(
    stockMovements.filter((m) => m.type === "out")
  );
  const [viewMode, setViewMode] = useState<"list" | "timeline">("list");
  const [createOpen, setCreateOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<StockMovement | null>(null);

  // Form state
  const [formRef, setFormRef] = useState(`SO-2026-0${String(movements.length + 504).padStart(3, "0")}`);
  const [formProduct, setFormProduct] = useState(products[0].id);
  const [formQty, setFormQty] = useState("1");
  const [formReason, setFormReason] = useState(REASONS[0]);
  const [formInvoiceRef, setFormInvoiceRef] = useState("");
  const [formNotes, setFormNotes] = useState("");

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const newMovement: StockMovement = {
      id: `sm_out_${Date.now()}`,
      type: "out",
      referenceNumber: formRef,
      productId: formProduct,
      quantity: parseFloat(formQty) || 1,
      reason: formReason,
      invoiceRef: formInvoiceRef || undefined,
      warehouse: "Main Warehouse",
      notes: formNotes,
      date: TODAY,
      time: TODAY_TIME,
    };
    setMovements((prev) => [newMovement, ...prev]);
    setCreateOpen(false);
    const nextNum = movements.length + 505;
    setFormRef(`SO-2026-0${String(nextNum).padStart(3, "0")}`);
    setFormProduct(products[0].id);
    setFormQty("1");
    setFormReason(REASONS[0]);
    setFormInvoiceRef("");
    setFormNotes("");
  }

  return (
    <>
      <SectionCard
        title="Stock Out — Issue Stock"
        subtitle={`${movements.length} stock-out records`}
        action={
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl border border-slate-200 bg-white p-0.5">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === "list" ? "bg-slate-100 text-slate-800" : "text-slate-500 hover:text-slate-700"}`}
              >
                <List className="h-3.5 w-3.5" /> List
              </button>
              <button
                onClick={() => setViewMode("timeline")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === "timeline" ? "bg-slate-100 text-slate-800" : "text-slate-500 hover:text-slate-700"}`}
              >
                <Clock className="h-3.5 w-3.5" /> Timeline
              </button>
            </div>
            <PrimaryButton icon={Plus} onClick={() => setCreateOpen(true)}>
              Issue Stock
            </PrimaryButton>
          </div>
        }
        noPadding
      >
        {movements.length === 0 ? (
          <EmptyState icon={PackageMinus} title="No stock-out records" subtitle="Issue stock to see records here." />
        ) : viewMode === "list" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {["Reference", "Product", "Quantity", "Reason", "Invoice Ref", "Warehouse", "Date & Time", "Notes"].map((h) => (
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
                      onClick={() => setDetailItem(m)}
                      className="cursor-pointer border-b border-slate-50 hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-red-600">{m.referenceNumber}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{product?.name ?? m.productId}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                          -{m.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{m.reason ?? "—"}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{m.invoiceRef ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-600">{m.warehouse}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{fmtDate(m.date)} · {m.time}</td>
                      <td className="px-4 py-3 text-slate-500 max-w-[160px] truncate">{m.notes || "—"}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Timeline View */
          <div className="p-6 space-y-0">
            {movements.map((m, i) => {
              const product = getProduct(m.productId);
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                  className="flex gap-4"
                >
                  <div className="flex flex-col items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100">
                      <PackageMinus className="h-4 w-4 text-red-600" />
                    </div>
                    {i < movements.length - 1 && <div className="w-0.5 flex-1 bg-slate-100 my-1" />}
                  </div>
                  <div className="pb-4 flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate">{product?.name ?? m.productId}</p>
                        <p className="text-xs text-slate-500">{m.referenceNumber} · {m.reason ?? "—"}</p>
                        {m.invoiceRef && <p className="text-xs text-slate-400 font-mono mt-0.5">{m.invoiceRef}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-600">
                          -{m.quantity} units
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">{fmtDate(m.date)} · {m.time}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Issue Stock</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 pt-2">
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
            <div className="grid grid-cols-2 gap-3">
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
                <select
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400"
                >
                  {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Invoice Reference (optional)</label>
              <input
                type="text"
                value={formInvoiceRef}
                onChange={(e) => setFormInvoiceRef(e.target.value)}
                className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400"
                placeholder="e.g. INV-2026-0050"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Notes</label>
              <textarea
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
                placeholder="Optional notes..."
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <button type="button" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
              </DialogClose>
              <PrimaryButton type="submit">Issue Stock</PrimaryButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!detailItem} onOpenChange={(o) => !o && setDetailItem(null)}>
        <DialogContent className="max-w-md">
          {detailItem && (() => {
            const product = getProduct(detailItem.productId);
            return (
              <>
                <DialogHeader>
                  <DialogTitle>Stock Issue Detail</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 pt-2">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Reference</span>
                      <span className="font-mono font-semibold text-red-600">{detailItem.referenceNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Product</span>
                      <span className="font-semibold text-slate-800">{product?.name ?? detailItem.productId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Quantity</span>
                      <span className="font-bold text-red-600">-{detailItem.quantity} units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Reason</span>
                      <span className="text-slate-700">{detailItem.reason ?? "—"}</span>
                    </div>
                    {detailItem.invoiceRef && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Invoice Ref</span>
                        <span className="font-mono text-slate-700">{detailItem.invoiceRef}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500">Warehouse</span>
                      <span className="text-slate-700">{detailItem.warehouse}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Date & Time</span>
                      <span className="text-slate-600">{fmtDate(detailItem.date)} · {detailItem.time}</span>
                    </div>
                  </div>
                  {detailItem.notes && (
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <p className="text-xs font-semibold text-slate-500 mb-1">Notes</p>
                      <p className="text-sm text-slate-700">{detailItem.notes}</p>
                    </div>
                  )}
                  <div className="flex justify-end">
                    <DialogClose asChild>
                      <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Close</button>
                    </DialogClose>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </>
  );
}
