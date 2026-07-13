// ── Quotations Tab ─────────────────────────────────────────────────
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, X, FileText, Copy, Pencil, Trash2, ArrowRight, FileQuestion } from "lucide-react";
import {
  SectionCard,
  SearchInput,
  Select,
  Pagination,
  PrimaryButton,
  SecondaryButton,
  EmptyState,
  BillingStatusPill,
} from "@/components/billing/shared";
import {
  quotations as seedQuotations,
  customers,
  getCustomer,
  getInvoiceProduct,
  fmtINR,
  fmtDate,
  computeLineItem,
  computeDocumentTotals,
  quotationTotal,
  nextInvoiceNumber,
  nextQuoteNumber,
  type Quotation,
  type QuotationStatus,
  type InvoiceItem,
} from "@/lib/billing-data";
import { products } from "@/lib/inventory-data";

const PAGE_SIZE = 8;
const TODAY = "2026-07-13";

// ── Helpers ────────────────────────────────────────────────────────

function genId() {
  return "qt" + Math.random().toString(36).slice(2, 9);
}

type LineItemDraft = {
  productId: string;
  quantity: string;
  unitPrice: string;
  discountPercent: string;
  gstPercent: string;
};

const EMPTY_LINE: LineItemDraft = {
  productId: products[0]?.id ?? "",
  quantity: "1",
  unitPrice: String(products[0]?.sellingPrice ?? 0),
  discountPercent: "0",
  gstPercent: String(products[0]?.taxPercent ?? 18),
};

function lineToItem(l: LineItemDraft): InvoiceItem {
  return {
    productId: l.productId,
    quantity: parseFloat(l.quantity) || 1,
    unitPrice: parseFloat(l.unitPrice) || 0,
    discountPercent: parseFloat(l.discountPercent) || 0,
    gstPercent: parseFloat(l.gstPercent) || 0,
  };
}

// ── Internal: Items Table sub-component ───────────────────────────

function ItemsTable({
  lines,
  onChange,
}: {
  lines: LineItemDraft[];
  onChange: (lines: LineItemDraft[]) => void;
}) {
  function addLine() {
    onChange([...lines, { ...EMPTY_LINE }]);
  }

  function removeLine(idx: number) {
    if (lines.length === 1) return;
    onChange(lines.filter((_, i) => i !== idx));
  }

  function updateLine(idx: number, field: keyof LineItemDraft, val: string) {
    const next = lines.map((row, i) => {
      if (i !== idx) return row;
      const updated = { ...row, [field]: val };
      if (field === "productId") {
        const p = products.find((p) => p.id === val);
        if (p) {
          updated.unitPrice = String(p.sellingPrice);
          updated.gstPercent = String(p.taxPercent);
        }
      }
      return updated;
    });
    onChange(next);
  }

  const inputCls =
    "h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs outline-none focus:border-[color:var(--brand-electric)] focus:ring-1 focus:ring-[color:var(--brand-electric)]";

  const items = lines.map(lineToItem);
  const totals = computeDocumentTotals(items, false);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-600">Line Items</p>
        <button
          type="button"
          onClick={addLine}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Plus className="h-3 w-3" /> Add Item
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-3 py-2 text-left font-semibold text-slate-500 min-w-[180px]">
                Product
              </th>
              <th className="px-3 py-2 text-right font-semibold text-slate-500 w-16">Qty</th>
              <th className="px-3 py-2 text-right font-semibold text-slate-500 w-24">Unit Price</th>
              <th className="px-3 py-2 text-right font-semibold text-slate-500 w-16">Disc %</th>
              <th className="px-3 py-2 text-right font-semibold text-slate-500 w-16">GST %</th>
              <th className="px-3 py-2 text-right font-semibold text-slate-500 w-24">Line Total</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {lines.map((row, idx) => {
              const item = lineToItem(row);
              const { total } = computeLineItem(item);
              return (
                <tr key={idx} className="border-b border-slate-50">
                  <td className="px-3 py-2">
                    <select
                      value={row.productId}
                      onChange={(e) => updateLine(idx, "productId", e.target.value)}
                      className={`${inputCls} w-full`}
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="1"
                      value={row.quantity}
                      onChange={(e) => updateLine(idx, "quantity", e.target.value)}
                      className={`${inputCls} w-full text-right`}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      value={row.unitPrice}
                      onChange={(e) => updateLine(idx, "unitPrice", e.target.value)}
                      className={`${inputCls} w-full text-right`}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={row.discountPercent}
                      onChange={(e) => updateLine(idx, "discountPercent", e.target.value)}
                      className={`${inputCls} w-full text-right`}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={row.gstPercent}
                      onChange={(e) => updateLine(idx, "gstPercent", e.target.value)}
                      className={`${inputCls} w-full text-right`}
                    />
                  </td>
                  <td className="px-3 py-2 text-right font-semibold text-slate-800">
                    {fmtINR(total)}
                  </td>
                  <td className="px-2 py-2">
                    <button
                      type="button"
                      onClick={() => removeLine(idx)}
                      disabled={lines.length === 1}
                      className="rounded-lg p-1 text-red-400 hover:bg-red-50 disabled:opacity-30 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Running Totals */}
      <div className="mt-3 flex justify-end">
        <div className="w-56 space-y-1 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span>{fmtINR(totals.subtotal)}</span>
          </div>
          {totals.totalDiscount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Discount</span>
              <span>-{fmtINR(totals.totalDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>GST</span>
            <span>{fmtINR(totals.cgst + totals.sgst + totals.igst)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-1 font-bold text-slate-900">
            <span>Grand Total</span>
            <span className="text-blue-700">{fmtINR(totals.grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Create / Edit Form ─────────────────────────────────────────────

type QuotationFormMode = "create" | "edit";

interface QuotationFormState {
  customerId: string;
  expiryDate: string;
  notes: string;
  lines: LineItemDraft[];
}

function QuotationForm({
  mode,
  initial,
  onSave,
  onCancel,
}: {
  mode: QuotationFormMode;
  initial: QuotationFormState;
  onSave: (data: QuotationFormState) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<QuotationFormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function setField<K extends keyof QuotationFormState>(k: K, v: QuotationFormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.customerId) e.customerId = "Please select a customer.";
    if (form.lines.some((l) => !l.productId)) e.lines = "All line items must have a product.";
    return e;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSave(form);
  }

  const labelCls = "mb-1 block text-xs font-semibold text-slate-600";
  const inputCls =
    "h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition-colors focus:border-[color:var(--brand-electric)] focus:ring-1 focus:ring-[color:var(--brand-electric)] placeholder:text-slate-400";
  const selectCls =
    "h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-foreground outline-none transition-colors focus:border-[color:var(--brand-electric)] focus:ring-1 focus:ring-[color:var(--brand-electric)]";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Customer */}
        <div>
          <label className={labelCls}>Customer *</label>
          <select
            value={form.customerId}
            onChange={(e) => setField("customerId", e.target.value)}
            className={selectCls}
          >
            <option value="">Select customer…</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.customerId && (
            <p className="mt-0.5 text-[11px] text-red-500">{errors.customerId}</p>
          )}
        </div>

        {/* Expiry Date */}
        <div>
          <label className={labelCls}>Expiry Date</label>
          <input
            type="date"
            value={form.expiryDate}
            onChange={(e) => setField("expiryDate", e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      {/* Items Table */}
      <div>
        <ItemsTable lines={form.lines} onChange={(l) => setField("lines", l)} />
        {errors.lines && <p className="mt-1 text-[11px] text-red-500">{errors.lines}</p>}
      </div>

      {/* Notes */}
      <div>
        <label className={labelCls}>Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => setField("notes", e.target.value)}
          rows={2}
          placeholder="Add any notes or special instructions for the customer..."
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-[color:var(--brand-electric)] focus:ring-1 focus:ring-[color:var(--brand-electric)] placeholder:text-slate-400 resize-none"
        />
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
        <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
        <PrimaryButton type="submit">
          {mode === "create" ? "Create Quotation" : "Save Changes"}
        </PrimaryButton>
      </div>
    </form>
  );
}

// ── QuotationsTab ──────────────────────────────────────────────────

type ViewMode = "list" | "create" | "edit";

const STATUS_FILTERS: { label: string; value: QuotationStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Sent", value: "sent" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
  { label: "Expired", value: "expired" },
];

const SORT_OPTIONS = [
  { value: "date-desc", label: "Newest First" },
  { value: "date-asc", label: "Oldest First" },
  { value: "amount-desc", label: "Amount High–Low" },
  { value: "amount-asc", label: "Amount Low–High" },
  { value: "expiry-asc", label: "Expiry Soon" },
];

export function QuotationsTab() {
  const [localQuotations, setLocalQuotations] = useState<Quotation[]>(() =>
    seedQuotations.map((q) => ({ ...q })),
  );

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<QuotationStatus | "all">("all");
  const [sortKey, setSortKey] = useState("date-desc");
  const [page, setPage] = useState(1);

  // Conversion alerts
  const [convertedAlert, setConvertedAlert] = useState<string | null>(null);

  // Derived filtered+sorted list
  const filtered = useMemo(() => {
    let rows = localQuotations;
    const q = search.toLowerCase();
    if (q) {
      rows = rows.filter((qt) => {
        const customer = getCustomer(qt.customerId);
        return (
          qt.quoteNumber.toLowerCase().includes(q) ||
          customer?.name.toLowerCase().includes(q) ||
          false
        );
      });
    }
    if (statusFilter !== "all") {
      rows = rows.filter((qt) => qt.status === statusFilter);
    }
    rows = [...rows].sort((a, b) => {
      if (sortKey === "date-desc") return b.createdDate.localeCompare(a.createdDate);
      if (sortKey === "date-asc") return a.createdDate.localeCompare(b.createdDate);
      if (sortKey === "amount-desc") return quotationTotal(b) - quotationTotal(a);
      if (sortKey === "amount-asc") return quotationTotal(a) - quotationTotal(b);
      if (sortKey === "expiry-asc") return a.expiryDate.localeCompare(b.expiryDate);
      return 0;
    });
    return rows;
  }, [localQuotations, search, statusFilter, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleSearch(v: string) {
    setSearch(v);
    setPage(1);
  }
  function handleStatusFilter(v: string) {
    setStatusFilter(v as QuotationStatus | "all");
    setPage(1);
  }

  // CRUD
  function handleDelete(id: string) {
    setLocalQuotations((prev) => prev.filter((q) => q.id !== id));
  }

  function handleDuplicate(qt: Quotation) {
    const copy: Quotation = {
      ...qt,
      id: genId(),
      quoteNumber: nextQuoteNumber(),
      status: "draft",
      createdDate: TODAY,
      convertedInvoiceId: undefined,
    };
    setLocalQuotations((prev) => [copy, ...prev]);
  }

  function handleConvert(qt: Quotation) {
    const invNum = nextInvoiceNumber();
    setLocalQuotations((prev) =>
      prev.map((q) =>
        q.id === qt.id ? { ...q, status: "accepted", convertedInvoiceId: invNum } : q,
      ),
    );
    setConvertedAlert(`Quotation ${qt.quoteNumber} converted to invoice ${invNum}.`);
    setTimeout(() => setConvertedAlert(null), 5000);
  }

  function handleFormSave(data: QuotationFormState) {
    const items: InvoiceItem[] = data.lines.map(lineToItem);
    if (viewMode === "create") {
      const newQt: Quotation = {
        id: genId(),
        quoteNumber: nextQuoteNumber(),
        customerId: data.customerId,
        status: "draft",
        items,
        createdDate: TODAY,
        expiryDate: data.expiryDate || "",
        notes: data.notes,
      };
      setLocalQuotations((prev) => [newQt, ...prev]);
    } else if (viewMode === "edit" && editingId) {
      setLocalQuotations((prev) =>
        prev.map((q) =>
          q.id === editingId
            ? {
                ...q,
                customerId: data.customerId,
                items,
                expiryDate: data.expiryDate,
                notes: data.notes,
              }
            : q,
        ),
      );
    }
    setViewMode("list");
    setEditingId(null);
  }

  function openEdit(qt: Quotation) {
    setEditingId(qt.id);
    setViewMode("edit");
  }

  function openCreate() {
    setEditingId(null);
    setViewMode("create");
  }

  // Build form initial for edit
  function buildFormInitial(qt: Quotation): QuotationFormState {
    return {
      customerId: qt.customerId,
      expiryDate: qt.expiryDate,
      notes: qt.notes,
      lines: qt.items.map((item) => ({
        productId: item.productId,
        quantity: String(item.quantity),
        unitPrice: String(item.unitPrice),
        discountPercent: String(item.discountPercent),
        gstPercent: String(item.gstPercent),
      })),
    };
  }

  const defaultFormInitial: QuotationFormState = {
    customerId: "",
    expiryDate: "",
    notes: "",
    lines: [{ ...EMPTY_LINE }],
  };

  // ── Create / Edit View ───────────────────────────────────────────
  if (viewMode === "create" || viewMode === "edit") {
    const editingQt = editingId ? localQuotations.find((q) => q.id === editingId) : null;
    const formInitial = editingQt ? buildFormInitial(editingQt) : defaultFormInitial;

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <SectionCard
          title={
            viewMode === "create"
              ? "New Quotation"
              : `Edit ${editingQt?.quoteNumber ?? "Quotation"}`
          }
          subtitle={
            viewMode === "create"
              ? "Fill in the details to create a new quotation for a customer."
              : "Update the quotation details below."
          }
          action={
            <SecondaryButton
              onClick={() => {
                setViewMode("list");
                setEditingId(null);
              }}
            >
              Back to List
            </SecondaryButton>
          }
        >
          <QuotationForm
            mode={viewMode === "create" ? "create" : "edit"}
            initial={formInitial}
            onSave={handleFormSave}
            onCancel={() => {
              setViewMode("list");
              setEditingId(null);
            }}
          />
        </SectionCard>
      </motion.div>
    );
  }

  // ── List View ────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Conversion alert */}
      {convertedAlert && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-800"
        >
          <span>{convertedAlert}</span>
          <button
            onClick={() => setConvertedAlert(null)}
            className="rounded-lg p-1 hover:bg-emerald-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}

      <SectionCard
        title="Quotations"
        subtitle={`${localQuotations.length} quotations total`}
        action={
          <PrimaryButton icon={Plus} onClick={openCreate}>
            New Quotation
          </PrimaryButton>
        }
        noPadding
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-6 py-3">
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder="Search by quote number or customer…"
            className="w-60"
          />
          <Select
            value={statusFilter}
            onChange={handleStatusFilter}
            options={STATUS_FILTERS.map((f) => ({ value: f.value, label: f.label }))}
            className="w-36"
          />
          <Select value={sortKey} onChange={setSortKey} options={SORT_OPTIONS} className="w-40" />
        </div>

        {/* Status filter pills */}
        <div className="flex flex-wrap gap-2 border-b border-slate-100 px-6 py-3">
          {STATUS_FILTERS.map((f) => {
            const count =
              f.value === "all"
                ? localQuotations.length
                : localQuotations.filter((q) => q.status === f.value).length;
            return (
              <button
                key={f.value}
                onClick={() => {
                  setStatusFilter(f.value);
                  setPage(1);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  statusFilter === f.value
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {f.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${statusFilter === f.value ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={FileQuestion}
            title="No quotations found"
            subtitle="Try adjusting your filters or create a new quotation."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    {[
                      "Quote Number",
                      "Customer",
                      "Status",
                      "Amount",
                      "Created Date",
                      "Expiry Date",
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
                  {pageRows.map((qt, i) => {
                    const customer = getCustomer(qt.customerId);
                    const total = quotationTotal(qt);
                    const canConvert =
                      (qt.status === "accepted" || qt.status === "sent") && !qt.convertedInvoiceId;
                    const isExpired = qt.status === "expired";

                    return (
                      <motion.tr
                        key={qt.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.03 }}
                        className="border-b border-slate-50 transition-colors hover:bg-slate-50/70"
                      >
                        {/* Quote Number */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-blue-700">
                              {qt.quoteNumber}
                            </span>
                            {qt.convertedInvoiceId && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                                Converted
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-800">{customer?.name ?? "—"}</p>
                          <p className="text-[11px] text-slate-400">{customer?.city}</p>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <BillingStatusPill status={qt.status} />
                        </td>

                        {/* Amount */}
                        <td className="px-4 py-3 font-semibold text-slate-800">{fmtINR(total)}</td>

                        {/* Created Date */}
                        <td className="px-4 py-3 text-xs text-slate-500">
                          {fmtDate(qt.createdDate)}
                        </td>

                        {/* Expiry Date */}
                        <td className="px-4 py-3 text-xs">
                          <span
                            className={isExpired ? "font-semibold text-red-600" : "text-slate-500"}
                          >
                            {fmtDate(qt.expiryDate)}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {/* Convert to Invoice */}
                            {canConvert && (
                              <button
                                onClick={() => handleConvert(qt)}
                                className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                                title="Convert to Invoice"
                              >
                                <ArrowRight className="h-3 w-3" /> Convert
                              </button>
                            )}

                            {/* Edit */}
                            <button
                              onClick={() => openEdit(qt)}
                              className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                              title="Edit"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>

                            {/* Duplicate */}
                            <button
                              onClick={() => handleDuplicate(qt)}
                              className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                              title="Duplicate"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(qt.id)}
                              className="rounded-lg border border-red-100 p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </SectionCard>
    </div>
  );
}
