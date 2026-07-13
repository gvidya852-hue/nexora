// ── LowStockTab ───────────────────────────────────────────────────
import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ShoppingCart, Package, DollarSign } from "lucide-react";
import {
  products,
  getCategory,
  getSupplier,
  getStockStatus,
  reorderQty,
  fmtINR,
} from "@/lib/inventory-data";
import type { Product } from "@/lib/inventory-data";
import {
  SectionCard,
  StatusPill,
  Select,
} from "@/components/inventory/shared";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

type Priority = "all" | "critical" | "low";

const alertProducts = products.filter((p) => {
  const s = getStockStatus(p);
  return s === "out-of-stock" || s === "low-stock";
});

const criticalProducts = alertProducts.filter(
  (p) => getStockStatus(p) === "out-of-stock"
);
const lowProducts = alertProducts.filter(
  (p) => getStockStatus(p) === "low-stock"
);

const estimatedReorderCost = alertProducts.reduce(
  (sum, p) => sum + reorderQty(p) * p.purchasePrice,
  0
);

function CreatePODialog({
  product,
  open,
  onClose,
  onConfirm,
}: {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!product) return null;
  const qty = reorderQty(product);
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Purchase Order Draft</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
            <p className="font-semibold text-foreground">{product.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">SKU: {product.sku}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-muted-foreground">Current Stock</p>
                <p className="font-semibold text-foreground">{product.currentStock}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Recommended Qty</p>
                <p className="font-semibold text-foreground">{qty}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Unit Price</p>
                <p className="font-semibold text-foreground">{fmtINR(product.purchasePrice)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Estimated Cost</p>
                <p className="font-semibold text-foreground">{fmtINR(qty * product.purchasePrice)}</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            A draft purchase order will be created for the recommended reorder quantity.
            You can edit it in the Purchase Orders tab before submitting.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-slate-50">
              Cancel
            </button>
          </DialogClose>
          <button
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-brand)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <ShoppingCart className="h-4 w-4" />
            Create Draft PO
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function LowStockRow({
  product,
  index,
  onCreatePO,
}: {
  product: Product;
  index: number;
  onCreatePO: (p: Product) => void;
}) {
  const status = getStockStatus(product);
  const isCritical = status === "out-of-stock";
  const category = getCategory(product.categoryId);
  const supplier = getSupplier(product.supplierId);
  const qty = reorderQty(product);

  return (
    <motion.tr
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className={`group relative border-b border-slate-100 transition-colors last:border-0 ${
        isCritical ? "bg-red-50/30 hover:bg-red-50/60" : "bg-amber-50/20 hover:bg-amber-50/40"
      }`}
    >
      {/* Left accent bar */}
      <td className="w-1 p-0">
        <div
          className={`h-full w-1 rounded-r-full ${
            isCritical ? "bg-red-500" : "bg-amber-400"
          }`}
          style={{ minHeight: "48px" }}
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{product.emoji}</span>
          <div>
            <p className="text-sm font-semibold text-foreground leading-tight">{product.name}</p>
            <p className="text-xs text-muted-foreground">{product.sku}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-foreground">
        {category?.name ?? "—"}
      </td>
      <td className="px-4 py-3">
        <span
          className={`text-sm font-bold ${
            isCritical ? "text-red-600" : "text-amber-700"
          }`}
        >
          {product.currentStock}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-foreground">{product.minStock}</td>
      <td className="px-4 py-3">
        <StatusPill
          status={isCritical ? "critical" : "low-stock"}
          label={isCritical ? "Critical" : "Low Stock"}
        />
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-foreground">{qty}</td>
      <td className="px-4 py-3 text-sm text-foreground">
        {supplier?.name ?? "—"}
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() => onCreatePO(product)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-slate-50 hover:border-slate-300"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          Create PO
        </button>
      </td>
    </motion.tr>
  );
}

export function LowStockTab({
  onCreatePO,
}: {
  onCreatePO?: (productId: string) => void;
} = {}) {
  const [priority, setPriority] = useState<Priority>("all");
  const [dialogProduct, setDialogProduct] = useState<Product | null>(null);
  const [poConfirmed, setPoConfirmed] = useState<string[]>([]);

  const visible =
    priority === "critical"
      ? criticalProducts
      : priority === "low"
      ? lowProducts
      : alertProducts;

  function handleCreatePO(p: Product) {
    setDialogProduct(p);
  }

  function handleConfirmPO() {
    if (dialogProduct) {
      setPoConfirmed((prev) => [...prev, dialogProduct.id]);
      onCreatePO?.(dialogProduct.id);
    }
    setDialogProduct(null);
  }

  return (
    <SectionCard
      title="Low Stock Alerts"
      subtitle={`${alertProducts.length} items need attention`}
      action={
        <Select
          value={priority}
          onChange={(v) => setPriority(v as Priority)}
          options={[
            { value: "all", label: "All Priorities" },
            { value: "critical", label: "Critical Only" },
            { value: "low", label: "Low Stock Only" },
          ]}
          className="w-40"
        />
      }
    >
      {/* Stat chips */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
            <Package className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{alertProducts.length}</p>
            <p className="text-xs text-muted-foreground">Total Low Stock Items</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-red-700">{criticalProducts.length}</p>
            <p className="text-xs text-red-600">Critical (Out of Stock)</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
            <DollarSign className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{fmtINR(estimatedReorderCost)}</p>
            <p className="text-xs text-muted-foreground">Estimated Reorder Cost</p>
          </div>
        </div>
      </div>

      {/* Warning banner for critical items */}
      {criticalProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
        >
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
          <p className="text-sm font-semibold text-red-700">
            ⚠ {criticalProducts.length} product{criticalProducts.length > 1 ? "s are" : " is"} completely out of stock and need immediate reordering.
          </p>
        </motion.div>
      )}

      {/* PO confirmed banner */}
      {poConfirmed.length > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <ShoppingCart className="h-4 w-4 shrink-0 text-emerald-600" />
          <p className="text-sm font-semibold text-emerald-700">
            {poConfirmed.length} draft purchase order{poConfirmed.length > 1 ? "s" : ""} created this session.
          </p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-left">
              <th className="w-1 p-0" />
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Product</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Category</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Current Stock</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Min Stock</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Priority</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Reorder Qty</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Supplier</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-sm text-muted-foreground">
                  No items match the selected filter.
                </td>
              </tr>
            ) : (
              visible.map((p, i) => (
                <LowStockRow
                  key={p.id}
                  product={p}
                  index={i}
                  onCreatePO={handleCreatePO}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <CreatePODialog
        product={dialogProduct}
        open={!!dialogProduct}
        onClose={() => setDialogProduct(null)}
        onConfirm={handleConfirmPO}
      />
    </SectionCard>
  );
}
