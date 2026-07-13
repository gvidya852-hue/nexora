import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, ShoppingCart } from "lucide-react";
import {
  purchaseOrders,
  suppliers,
  products,
  getSupplier,
  getProduct,
  fmtINR,
  type PurchaseOrder,
  type PurchaseOrderItem,
  type POStatus,
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

function poTotal(items: PurchaseOrderItem[]) {
  return items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
}

const STATUS_FILTERS: { label: string; value: POStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Received", value: "received" },
  { label: "Cancelled", value: "cancelled" },
];

export function PurchaseOrdersTab() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([...purchaseOrders]);
  const [activeFilter, setActiveFilter] = useState<POStatus | "all">("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [detailOrder, setDetailOrder] = useState<PurchaseOrder | null>(null);

  // Create form state
  const [formSupplier, setFormSupplier] = useState(suppliers[0].id);
  const [formExpected, setFormExpected] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [lineItems, setLineItems] = useState<{ productId: string; quantity: string; unitPrice: string }[]>([
    { productId: products[0].id, quantity: "1", unitPrice: String(products[0].purchasePrice) },
  ]);

  const filtered = activeFilter === "all" ? orders : orders.filter((o) => o.status === activeFilter);

  function countFor(s: POStatus | "all") {
    return s === "all" ? orders.length : orders.filter((o) => o.status === s).length;
  }

  function addLineItem() {
    setLineItems((prev) => [...prev, { productId: products[0].id, quantity: "1", unitPrice: String(products[0].purchasePrice) }]);
  }

  function removeLineItem(idx: number) {
    setLineItems((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateLineItem(idx: number, field: "productId" | "quantity" | "unitPrice", val: string) {
    setLineItems((prev) =>
      prev.map((row, i) => {
        if (i !== idx) return row;
        const updated = { ...row, [field]: val };
        if (field === "productId") {
          const p = getProduct(val);
          if (p) updated.unitPrice = String(p.purchasePrice);
        }
        return updated;
      })
    );
  }

  function runningTotal() {
    return lineItems.reduce((s, row) => {
      const q = parseFloat(row.quantity) || 0;
      const u = parseFloat(row.unitPrice) || 0;
      return s + q * u;
    }, 0);
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const id = `po${Date.now()}`;
    const poNumber = `PO-2026-${String(orders.length + 47).padStart(4, "0")}`;
    const newOrder: PurchaseOrder = {
      id,
      poNumber,
      supplierId: formSupplier,
      status: "pending",
      createdDate: TODAY,
      expectedDate: formExpected || TODAY,
      items: lineItems.map((row) => ({
        productId: row.productId,
        quantity: parseFloat(row.quantity) || 1,
        unitPrice: parseFloat(row.unitPrice) || 0,
      })),
      notes: formNotes,
    };
    setOrders((prev) => [newOrder, ...prev]);
    setCreateOpen(false);
    setFormSupplier(suppliers[0].id);
    setFormExpected("");
    setFormNotes("");
    setLineItems([{ productId: products[0].id, quantity: "1", unitPrice: String(products[0].purchasePrice) }]);
  }

  function transitionStatus(id: string, next: POStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: next } : o)));
    setDetailOrder((prev) => (prev && prev.id === id ? { ...prev, status: next } : prev));
  }

  return (
    <>
      <SectionCard
        title="Purchase Orders"
        subtitle={`${orders.length} purchase orders`}
        action={
          <PrimaryButton icon={Plus} onClick={() => setCreateOpen(true)}>
            Create Purchase Order
          </PrimaryButton>
        }
        noPadding
      >
        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 border-b border-slate-100 px-6 py-3">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                activeFilter === f.value
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${activeFilter === f.value ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                {countFor(f.value)}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <EmptyState icon={ShoppingCart} title="No purchase orders" subtitle="Create your first purchase order to get started." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {["PO Number", "Supplier", "Status", "Created Date", "Expected Date", "Items", "Total Value", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => {
                  const supplier = getSupplier(order.supplierId);
                  const total = poTotal(order.items);
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                      onClick={() => setDetailOrder(order)}
                      className="cursor-pointer border-b border-slate-50 hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-700">{order.poNumber}</td>
                      <td className="px-4 py-3 text-slate-700">{supplier?.name ?? "—"}</td>
                      <td className="px-4 py-3"><StatusPill status={order.status} /></td>
                      <td className="px-4 py-3 text-slate-600">{fmtDate(order.createdDate)}</td>
                      <td className="px-4 py-3 text-slate-600">{fmtDate(order.expectedDate)}</td>
                      <td className="px-4 py-3 text-slate-700">{order.items.length}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{fmtINR(total)}</td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <SecondaryButton onClick={() => setDetailOrder(order)}>
                          View
                        </SecondaryButton>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Supplier *</label>
                <select
                  value={formSupplier}
                  onChange={(e) => setFormSupplier(e.target.value)}
                  className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400"
                  required
                >
                  {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Expected Delivery Date</label>
                <input
                  type="date"
                  value={formExpected}
                  onChange={(e) => setFormExpected(e.target.value)}
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
                placeholder="Order notes..."
              />
            </div>

            {/* Line Items */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-600">Line Items</label>
                <button type="button" onClick={addLineItem} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50">
                  <Plus className="h-3 w-3" /> Add Item
                </button>
              </div>
              <div className="space-y-2">
                {lineItems.map((row, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2">
                    <select
                      value={row.productId}
                      onChange={(e) => updateLineItem(idx, "productId", e.target.value)}
                      className="flex-1 h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs outline-none"
                    >
                      {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={row.quantity}
                      onChange={(e) => updateLineItem(idx, "quantity", e.target.value)}
                      className="w-20 h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs outline-none"
                      placeholder="Qty"
                    />
                    <input
                      type="number"
                      min="0"
                      value={row.unitPrice}
                      onChange={(e) => updateLineItem(idx, "unitPrice", e.target.value)}
                      className="w-28 h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs outline-none"
                      placeholder="Unit Price"
                    />
                    <span className="w-24 text-right text-xs font-semibold text-slate-700">
                      {fmtINR((parseFloat(row.quantity) || 0) * (parseFloat(row.unitPrice) || 0))}
                    </span>
                    {lineItems.length > 1 && (
                      <button type="button" onClick={() => removeLineItem(idx)} className="rounded-lg p-1 text-red-400 hover:bg-red-50">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-end">
                <span className="text-sm font-bold text-slate-800">Total: {fmtINR(runningTotal())}</span>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <button type="button" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
              </DialogClose>
              <PrimaryButton type="submit">Create Order</PrimaryButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!detailOrder} onOpenChange={(o) => !o && setDetailOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {detailOrder && (() => {
            const supplier = getSupplier(detailOrder.supplierId);
            const total = poTotal(detailOrder.items);
            return (
              <>
                <DialogHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <DialogTitle className="font-mono text-blue-700">{detailOrder.poNumber}</DialogTitle>
                      <div className="mt-1 flex items-center gap-2">
                        <StatusPill status={detailOrder.status} />
                      </div>
                    </div>
                  </div>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm">
                    <div>
                      <p className="text-xs text-slate-500">Created Date</p>
                      <p className="font-semibold text-slate-800">{fmtDate(detailOrder.createdDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Expected Delivery</p>
                      <p className="font-semibold text-slate-800">{fmtDate(detailOrder.expectedDate)}</p>
                    </div>
                  </div>

                  {/* Supplier Info */}
                  {supplier && (
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <p className="mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Supplier</p>
                      <p className="font-semibold text-slate-800">{supplier.name}</p>
                      <p className="text-xs text-slate-500">{supplier.contactPerson} · {supplier.phone}</p>
                      <p className="text-xs text-slate-500">{supplier.email} · {supplier.city}</p>
                      <p className="mt-1 text-xs text-slate-400">GST: {supplier.gstNumber}</p>
                    </div>
                  )}

                  {/* Line Items Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                          <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Product</th>
                          <th className="px-4 py-2 text-right text-xs font-semibold text-slate-500">Qty</th>
                          <th className="px-4 py-2 text-right text-xs font-semibold text-slate-500">Unit Price</th>
                          <th className="px-4 py-2 text-right text-xs font-semibold text-slate-500">Line Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailOrder.items.map((item, i) => {
                          const product = getProduct(item.productId);
                          return (
                            <tr key={i} className="border-b border-slate-50">
                              <td className="px-4 py-2 text-slate-700">{product?.name ?? item.productId}</td>
                              <td className="px-4 py-2 text-right text-slate-600">{item.quantity}</td>
                              <td className="px-4 py-2 text-right text-slate-600">{fmtINR(item.unitPrice)}</td>
                              <td className="px-4 py-2 text-right font-semibold text-slate-800">{fmtINR(item.quantity * item.unitPrice)}</td>
                            </tr>
                          );
                        })}
                        <tr className="bg-slate-50">
                          <td colSpan={3} className="px-4 py-2 text-right text-sm font-bold text-slate-700">Grand Total</td>
                          <td className="px-4 py-2 text-right text-sm font-bold text-slate-900">{fmtINR(total)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Notes */}
                  {detailOrder.notes && (
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Notes</p>
                      <p className="text-sm text-slate-700">{detailOrder.notes}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {detailOrder.status === "pending" && (
                      <button
                        onClick={() => transitionStatus(detailOrder.id, "approved")}
                        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                      >
                        Approve Order
                      </button>
                    )}
                    {detailOrder.status === "approved" && (
                      <button
                        onClick={() => transitionStatus(detailOrder.id, "received")}
                        className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
                      >
                        Mark Received
                      </button>
                    )}
                    {(detailOrder.status === "pending" || detailOrder.status === "approved") && (
                      <button
                        onClick={() => transitionStatus(detailOrder.id, "cancelled")}
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
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
