// ── Invoices Tab ──────────────────────────────────────────────────
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Plus,
  Eye,
  Pencil,
  Copy,
  Trash2,
  Download,
  Printer,
  IndianRupee,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import {
  invoices as seedInvoices,
  getCustomer,
  fmtINR,
  fmtDate,
  invoiceGrandTotal,
  computeDocumentTotals,
  type Invoice,
  type InvoiceStatus,
  type PaymentStatus,
} from "@/lib/billing-data";
import {
  SectionCard,
  StatTile,
  SearchInput,
  Select,
  Pagination,
  PrimaryButton,
  SecondaryButton,
  EmptyState,
  BillingStatusPill,
  Checkbox,
} from "@/components/billing/shared";
import { InvoiceBuilder } from "@/components/billing/tabs/InvoiceBuilder";
import { InvoiceDetailView } from "@/components/billing/tabs/InvoiceDetailView";

// ── Constants ─────────────────────────────────────────────────────
const PAGE_SIZE = 10;

// ── Helpers ───────────────────────────────────────────────────────
function nextInvoiceNumberLocal(invs: Invoice[]): string {
  const nums = invs.map((i) => parseInt(i.invoiceNumber.split("-").pop() ?? "0", 10));
  const next = Math.max(0, ...nums) + 1;
  return `INV-2026-${String(next).padStart(4, "0")}`;
}

function buildCSV(rows: Invoice[]): string {
  const headers = [
    "Invoice Number",
    "Customer",
    "GSTIN",
    "Status",
    "Payment Status",
    "Amount",
    "Tax",
    "Created Date",
    "Due Date",
    "Amount Paid",
    "Balance",
  ];
  const escape = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = [
    headers.join(","),
    ...rows.map((inv) => {
      const cust = getCustomer(inv.customerId);
      const totals = computeDocumentTotals(inv.items, inv.isInterState);
      const tax = inv.isInterState ? totals.igst : totals.cgst + totals.sgst;
      const balance = totals.grandTotal - inv.amountPaid;
      return [
        inv.invoiceNumber,
        cust?.name ?? inv.customerId,
        cust?.gstin ?? "—",
        inv.status,
        inv.paymentStatus,
        totals.grandTotal,
        tax,
        inv.createdDate,
        inv.dueDate,
        inv.amountPaid,
        balance,
      ]
        .map(escape)
        .join(",");
    }),
  ];
  return lines.join("\n");
}

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── InvoicesTab ───────────────────────────────────────────────────
export function InvoicesTab() {
  // ── State ──────────────────────────────────────────────────────
  type ViewState = "list" | "create" | "edit" | "view";
  const [view, setView] = useState<ViewState>("list");
  const [localInvoices, setLocalInvoices] = useState<Invoice[]>(() =>
    seedInvoices.map((i) => ({ ...i })),
  );
  const [activeInvoice, setActiveInvoice] = useState<Invoice | undefined>(undefined);

  // Filters / sort / pagination
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [sortKey, setSortKey] = useState("date-desc");
  const [page, setPage] = useState(1);

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // ── Derived stats ──────────────────────────────────────────────
  const totalCount = localInvoices.length;
  const paidCount = localInvoices.filter((i) => i.status === "paid").length;
  const pendingCount = localInvoices.filter(
    (i) => i.status === "sent" || i.status === "draft" || i.status === "partial",
  ).length;
  const overdueCount = localInvoices.filter((i) => i.status === "overdue").length;
  const totalAmount = localInvoices.reduce((s, i) => s + invoiceGrandTotal(i), 0);
  const paidAmount = localInvoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + invoiceGrandTotal(i), 0);
  const pendingAmount = localInvoices
    .filter((i) => i.status === "sent" || i.status === "draft" || i.status === "partial")
    .reduce((s, i) => s + invoiceGrandTotal(i), 0);
  const overdueAmount = localInvoices
    .filter((i) => i.status === "overdue")
    .reduce((s, i) => s + invoiceGrandTotal(i), 0);

  // ── Filtered / sorted / paginated ─────────────────────────────
  const filtered = useMemo(() => {
    let rows = localInvoices;
    const q = search.toLowerCase();
    if (q) {
      rows = rows.filter((inv) => {
        const cust = getCustomer(inv.customerId);
        return (
          inv.invoiceNumber.toLowerCase().includes(q) ||
          (cust?.name ?? "").toLowerCase().includes(q) ||
          (cust?.gstin ?? "").toLowerCase().includes(q)
        );
      });
    }
    if (filterStatus !== "all") {
      rows = rows.filter((inv) => inv.status === filterStatus);
    }
    if (filterPayment !== "all") {
      rows = rows.filter((inv) => inv.paymentStatus === filterPayment);
    }
    rows = [...rows].sort((a, b) => {
      if (sortKey === "date-desc")
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      if (sortKey === "date-asc")
        return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
      if (sortKey === "amount-desc") return invoiceGrandTotal(b) - invoiceGrandTotal(a);
      if (sortKey === "amount-asc") return invoiceGrandTotal(a) - invoiceGrandTotal(b);
      return 0;
    });
    return rows;
  }, [localInvoices, search, filterStatus, filterPayment, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleSearch(v: string) {
    setSearch(v);
    setPage(1);
  }
  function handleStatusFilter(v: string) {
    setFilterStatus(v);
    setPage(1);
  }
  function handlePaymentFilter(v: string) {
    setFilterPayment(v);
    setPage(1);
  }

  // ── Selection ──────────────────────────────────────────────────
  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function toggleAll() {
    if (pageRows.every((r) => selectedIds.has(r.id))) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pageRows.forEach((r) => next.delete(r.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pageRows.forEach((r) => next.add(r.id));
        return next;
      });
    }
  }
  const allPageSelected = pageRows.length > 0 && pageRows.every((r) => selectedIds.has(r.id));
  const someSelected = selectedIds.size > 0;

  // ── CRUD actions ───────────────────────────────────────────────
  function handleDuplicate(inv: Invoice) {
    const newInv: Invoice = {
      ...inv,
      id: "inv-" + Date.now(),
      invoiceNumber: nextInvoiceNumberLocal([...localInvoices]),
      status: "draft",
      paymentStatus: "pending",
      amountPaid: 0,
      createdDate: "2026-07-13",
    };
    setLocalInvoices((prev) => [newInv, ...prev]);
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this invoice? This action cannot be undone.")) return;
    setLocalInvoices((prev) => prev.filter((i) => i.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function handleBulkDelete() {
    if (!confirm(`Delete ${selectedIds.size} selected invoice(s)? This cannot be undone.`)) return;
    setLocalInvoices((prev) => prev.filter((i) => !selectedIds.has(i.id)));
    setSelectedIds(new Set());
  }

  function handleExportCSV() {
    const selected =
      selectedIds.size > 0 ? filtered.filter((i) => selectedIds.has(i.id)) : filtered;
    downloadFile(buildCSV(selected), "invoices-export.csv", "text/csv;charset=utf-8;");
  }

  function handleExportExcel() {
    const selected =
      selectedIds.size > 0 ? filtered.filter((i) => selectedIds.has(i.id)) : filtered;
    downloadFile(buildCSV(selected), "invoices-export.xls", "application/vnd.ms-excel");
  }

  function handleBulkPrint() {
    window.print();
  }

  // ── Builder save ───────────────────────────────────────────────
  function handleBuilderSave(inv: Invoice) {
    if (view === "create") {
      setLocalInvoices((prev) => [inv, ...prev]);
    } else {
      setLocalInvoices((prev) => prev.map((i) => (i.id === inv.id ? inv : i)));
    }
    setView("list");
    setActiveInvoice(undefined);
  }

  // ── View switching ─────────────────────────────────────────────
  function openCreate() {
    setActiveInvoice(undefined);
    setView("create");
  }

  function openEdit(inv: Invoice) {
    setActiveInvoice(inv);
    setView("edit");
  }

  function openView(inv: Invoice) {
    setActiveInvoice(inv);
    setView("view");
  }

  function backToList() {
    setView("list");
    setActiveInvoice(undefined);
  }

  // ── Render: create / edit ──────────────────────────────────────
  if (view === "create" || view === "edit") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={backToList}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-slate-50"
          >
            ← Back to Invoices
          </button>
          <h2 className="text-sm font-semibold text-foreground">
            {view === "create" ? "New Invoice" : `Edit ${activeInvoice?.invoiceNumber ?? ""}`}
          </h2>
        </div>
        <InvoiceBuilder
          mode={view}
          invoice={activeInvoice}
          onSave={handleBuilderSave}
          onCancel={backToList}
        />
      </div>
    );
  }

  // ── Render: view ───────────────────────────────────────────────
  if (view === "view" && activeInvoice) {
    return (
      <InvoiceDetailView
        invoice={activeInvoice}
        onEdit={() => openEdit(activeInvoice)}
        onBack={backToList}
      />
    );
  }

  // ── Render: list ───────────────────────────────────────────────
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "draft", label: "Draft" },
    { value: "sent", label: "Sent" },
    { value: "paid", label: "Paid" },
    { value: "partial", label: "Partial" },
    { value: "overdue", label: "Overdue" },
    { value: "cancelled", label: "Cancelled" },
  ];
  const paymentOptions = [
    { value: "all", label: "All Payment" },
    { value: "paid", label: "Paid" },
    { value: "pending", label: "Pending" },
    { value: "partial", label: "Partial" },
    { value: "overdue", label: "Overdue" },
  ];
  const sortOptions = [
    { value: "date-desc", label: "Newest First" },
    { value: "date-asc", label: "Oldest First" },
    { value: "amount-desc", label: "Amount High–Low" },
    { value: "amount-asc", label: "Amount Low–High" },
  ];

  return (
    <div className="space-y-5">
      {/* ── Stat strip ── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile
          label="Total Invoices"
          value={String(totalCount)}
          sub={fmtINR(totalAmount)}
          icon={FileText}
          bg="bg-slate-100"
          iconColor="text-slate-600"
          index={0}
        />
        <StatTile
          label="Paid"
          value={String(paidCount)}
          sub={fmtINR(paidAmount)}
          icon={CheckCircle2}
          bg="bg-emerald-100"
          iconColor="text-emerald-600"
          index={1}
        />
        <StatTile
          label="Pending"
          value={String(pendingCount)}
          sub={fmtINR(pendingAmount)}
          icon={Clock}
          bg="bg-amber-100"
          iconColor="text-amber-600"
          index={2}
        />
        <StatTile
          label="Overdue"
          value={String(overdueCount)}
          sub={fmtINR(overdueAmount)}
          icon={AlertTriangle}
          bg="bg-red-100"
          iconColor="text-red-600"
          index={3}
        />
      </div>

      {/* ── Table card ── */}
      <SectionCard
        title="Invoices"
        subtitle={`${localInvoices.length} invoices`}
        action={
          <PrimaryButton icon={Plus} onClick={openCreate}>
            New Invoice
          </PrimaryButton>
        }
        noPadding
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-6 py-3">
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder="Search invoice or customer..."
            className="w-56"
          />
          <Select
            value={filterStatus}
            onChange={handleStatusFilter}
            options={statusOptions}
            className="w-36"
          />
          <Select
            value={filterPayment}
            onChange={handlePaymentFilter}
            options={paymentOptions}
            className="w-36"
          />
          <Select value={sortKey} onChange={setSortKey} options={sortOptions} className="w-40" />
          <div className="ml-auto flex items-center gap-2">
            <SecondaryButton icon={Download} onClick={handleExportCSV}>
              Export CSV
            </SecondaryButton>
            <SecondaryButton icon={Download} onClick={handleExportExcel}>
              Export Excel
            </SecondaryButton>
          </div>
        </div>

        {/* Bulk action bar */}
        {someSelected && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 border-b border-amber-100 bg-amber-50 px-6 py-2"
          >
            <span className="text-xs font-semibold text-amber-700">
              {selectedIds.size} selected
            </span>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50 transition-colors"
            >
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50 transition-colors"
            >
              <Download className="h-3.5 w-3.5" /> Export Excel
            </button>
            <button
              onClick={handleBulkPrint}
              className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" /> Print
            </button>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear
            </button>
          </motion.div>
        )}

        {/* Table */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No invoices found"
            subtitle="Try adjusting your filters or create a new invoice."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    <th className="w-10 pl-6 py-3">
                      <Checkbox checked={allPageSelected} onChange={toggleAll} />
                    </th>
                    {[
                      "Invoice No.",
                      "Customer",
                      "GSTIN",
                      "Status",
                      "Amount",
                      "Tax",
                      "Created",
                      "Due Date",
                      "Payment",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((inv, i) => {
                    const cust = getCustomer(inv.customerId);
                    const totals = computeDocumentTotals(inv.items, inv.isInterState);
                    const tax = inv.isInterState ? totals.igst : totals.cgst + totals.sgst;
                    const isSelected = selectedIds.has(inv.id);

                    return (
                      <motion.tr
                        key={inv.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.03 }}
                        className={`group cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50/70 ${isSelected ? "bg-blue-50/50" : ""}`}
                        onClick={(e) => {
                          const target = e.target as HTMLElement;
                          if (target.closest("[data-no-row-click]")) return;
                          openView(inv);
                        }}
                      >
                        <td className="pl-6 py-3" data-no-row-click>
                          <Checkbox checked={isSelected} onChange={() => toggleSelect(inv.id)} />
                        </td>
                        <td className="px-3 py-3">
                          <span className="font-mono text-xs font-semibold text-blue-700">
                            {inv.invoiceNumber}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {cust?.name ?? inv.customerId}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {cust?.contactPerson ?? ""}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-xs font-mono text-slate-500">
                          {cust?.gstin ?? "—"}
                        </td>
                        <td className="px-3 py-3">
                          <BillingStatusPill status={inv.status} />
                        </td>
                        <td className="px-3 py-3 text-right font-semibold text-slate-800 whitespace-nowrap">
                          {fmtINR(totals.grandTotal)}
                        </td>
                        <td className="px-3 py-3 text-right text-xs text-slate-600 whitespace-nowrap">
                          {fmtINR(tax)}
                        </td>
                        <td className="px-3 py-3 text-xs text-slate-600 whitespace-nowrap">
                          {fmtDate(inv.createdDate)}
                        </td>
                        <td className="px-3 py-3 text-xs text-slate-600 whitespace-nowrap">
                          {fmtDate(inv.dueDate)}
                        </td>
                        <td className="px-3 py-3">
                          <BillingStatusPill status={inv.paymentStatus} />
                        </td>
                        <td className="px-3 py-3" data-no-row-click>
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openView(inv)}
                              title="View"
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => openEdit(inv)}
                              title="Edit"
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDuplicate(inv)}
                              title="Duplicate"
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(inv.id)}
                              title="Delete"
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
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
