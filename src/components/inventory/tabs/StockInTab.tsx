import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, PackageOpen, List, Clock } from "lucide-react";
import {
  stockMovements,
  suppliers,
  products,
  getSupplier,
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

export function StockInTab() {
  const [movements, setMovements] = useState<StockMovement[]>(
    stockMovements.filter((m) => m.type === "in")
  );
  const [viewMode, setViewMode] = useState<"list" | "timeline">("list");
  const [createOpen, setCreateOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<StockMovement | null>(null);

  // Form state
  const [formRef, setFormRef] = useState(`GRN-2026-0${String(movements.length + 205).padStart(3, "0")}`);
  const [formSupplier, setFormSupplier] = useState(suppliers[0].id);
  const [formProduct, setFormProduct] = useState(products[0].id);
  const [formQty, setFormQty] = useState("1");
  const [formWarehouse, setFormWarehouse] = useState("Main Warehouse");
  const [formNotes, setFormNotes] = useState("");

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const newMovement: StockMovement = {
      id: `sm_in_${Date.now()}`,
      type: "in",
      referenceNumber: formRef,
      productId: formProduct,
      quantity: parseFloat(formQty) || 1,
      supplierId: formSupplier,
      warehouse: formWarehouse || "Main Warehouse",
      notes: formNotes,
      date: TODAY,
      time: TODAY_TIME,
    };
    setMovements((prev) => [newMovement, ...prev]);
    setCreateOpen(false);
    const nextNum = movements.length + 206;
    setFormRef(`GRN-2026-0${String(nextNum).padStart(3, "0")}`);
    setFormSupplier(suppliers[0].id);
    setFormProduct(products[0].id);
    setFormQty("1");
    setFormWarehouse("Main Warehouse");
    setFormNotes("");
  }

  return (
    <>
      <SectionCard
        title="Stock In — Receive Inventory"
        subtitle={`${movements.length} stock-in records`}
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
              Receive Stock
            </PrimaryButton>
          </div>
        }
        noPadding
      >
        {movements.length === 0 ? (
          <EmptyState icon={PackageOpen} title="No stock-in records" subtitle="Receive stock to see records here." />
        ) : viewMode === "list" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {["Reference", "Product", "Supplier", "Quantity", "Warehouse", "Date & Time", "Notes", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {movements.map((m, i) => {
                  const product = getProduct(m.productId);
                  const supplier = m.supplierId ? getSupplier(m.supplierId) : undefined;
                  return (
                    <motion.tr
                      key={m.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                      className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-emerald-700">{m.referenceNumber}</td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-800">{product?.name ?? m.productId}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{supplier?.name ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                          +{m.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{m.warehouse}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{fmtDate(m.date)} · {m.time}</td>
                      <td className="px-4 py-3 text-slate-500 max-w-[180px] truncate">{m.notes || "—"}</td>
                      <td className="px-4 py-3">
                        <SecondaryButton onClick={() => setDetailItem(m)}>View</SecondaryButton>
                      </td>
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
              const supplier = m.supplierId ? getSupplier(m.supplierId) : undefined;
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                  className="flex gap-4"
                >
                  <div className="flex flex-col items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
                      <PackageOpen className="h-4 w-4 text-emerald-600" />
                    </div>
                    {i < movements.length - 1 && <div className="w-0.5 flex-1 bg-slate-100 my-1" />}
                  </div>
                  <div className="pb-4 flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate">{product?.name ?? m.productId}</p>
                        <p className="text-xs text-slate-500">{m.referenceNumber} · {supplier?.name ?? "Direct"}</p>
                        {m.notes && <p className="text-xs text-slate-400 mt-0.5 truncate">{m.notes}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                          +{m.quantity} units
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
            <DialogTitle>Receive Stock</DialogTitle>
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
              <label className="mb-1 block text-xs font-semibold text-slate-600">Supplier</label>
              <select
                value={formSupplier}
                onChange={(e) => setFormSupplier(e.target.value)}
                className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400"
              >
                {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
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
                <label className="mb-1 block text-xs font-semibold text-slate-600">Warehouse</label>
                <input
                  type="text"
                  value={formWarehouse}
                  onChange={(e) => setFormWarehouse(e.target.value)}
                  className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400"
                />
              </div>
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
              <PrimaryButton type="submit">Receive Stock</PrimaryButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!detailItem} onOpenChange={(o) => !o && setDetailItem(null)}>
        <DialogContent className="max-w-md">
          {detailItem && (() => {
            const product = getProduct(detailItem.productId);
            const supplier = detailItem.supplierId ? getSupplier(detailItem.supplierId) : undefined;
            return (
              <>
                <DialogHeader>
                  <DialogTitle>Stock Receipt Detail</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 pt-2">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Reference</span>
                      <span className="font-mono font-semibold text-emerald-700">{detailItem.referenceNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Product</span>
                      <span className="font-semibold text-slate-800">{product?.name ?? detailItem.productId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Supplier</span>
                      <span className="text-slate-700">{supplier?.name ?? "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Quantity</span>
                      <span className="font-bold text-emerald-700">+{detailItem.quantity} units</span>
                    </div>
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
