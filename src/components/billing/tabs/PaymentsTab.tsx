// ── Payments Tab ──────────────────────────────────────────────────
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  IndianRupee,
  Clock,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Plus,
  BarChart2,
  Percent,
  XCircle,
  Download,
} from "lucide-react";
import {
  payments as seedPayments,
  invoices,
  customers,
  getCustomer,
  getInvoice,
  fmtINR,
  fmtDate,
  invoiceGrandTotal,
  paymentModeLabels,
  type PaymentTxn,
  type PaymentTxnStatus,
  type PaymentMode,
} from "@/lib/billing-data";
import {
  SectionCard,
  StatTile,
  SearchInput,
  Select,
  Pagination,
  EmptyState,
  BillingStatusPill,
  PaymentModeBadge,
  ModalShell,
  PrimaryButton,
} from "@/components/billing/shared";

const PAGE_SIZE = 8;

// ── Sub-tab type ───────────────────────────────────────────────────
type SubTab = "all" | "pending" | "received" | "refunded" | "timeline";

// ── All 9 payment modes ────────────────────────────────────────────
const ALL_MODES: PaymentMode[] = [
  "cash", "upi", "card", "bank-transfer", "neft", "rtgs", "credit", "wallet", "cheque",
];

// ── Status helpers (shared between Table + Timeline) ──────────────
function statusIcon(status: PaymentTxnStatus) {
  if (status === "received") return <CheckCircle2 className="h-4 w-4" />;
  if (status === "refunded") return <RefreshCcw className="h-4 w-4" />;
  if (status === "cancelled") return <XCircle className="h-4 w-4" />;
  return <AlertCircle className="h-4 w-4" />;
}

function statusBg(status: PaymentTxnStatus) {
  if (status === "received") return "bg-emerald-50 text-emerald-600";
  if (status === "refunded") return "bg-cyan-50 text-cyan-600";
  if (status === "cancelled") return "bg-slate-100 text-slate-500";
  return "bg-amber-50 text-amber-600";
}

// ── Payment Table ──────────────────────────────────────────────────
function PaymentTable({
  rows,
  page,
  totalPages,
  onPageChange,
  emptyTitle,
  emptySubtitle,
}: {
  rows: PaymentTxn[];
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  emptyTitle: string;
  emptySubtitle?: string;
}) {
  const paginated = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (rows.length === 0) {
    return <EmptyState icon={CreditCard} title={emptyTitle} subtitle={emptySubtitle} />;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                Payment #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                Invoice
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                Customer
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                Mode
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                Date / Time
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((pay, i) => {
              const inv = getInvoice(pay.invoiceId);
              const cust = getCustomer(pay.customerId);
              return (
                <motion.tr
                  key={pay.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.25 }}
                  className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-6 py-3 text-sm font-mono font-medium text-foreground whitespace-nowrap">
                    {pay.paymentNumber}
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-600 whitespace-nowrap">
                    {inv?.invoiceNumber ?? pay.invoiceId}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-foreground whitespace-nowrap">
                      {cust?.name ?? pay.customerId}
                    </p>
                    {cust?.city && <p className="text-xs text-muted-foreground">{cust.city}</p>}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-foreground whitespace-nowrap">
                    {fmtINR(pay.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <PaymentModeBadge mode={pay.mode as PaymentMode} />
                  </td>
                  <td className="px-4 py-3">
                    <BillingStatusPill status={pay.status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="text-sm text-foreground">{fmtDate(pay.date)}</p>
                    <p className="text-xs text-muted-foreground">{pay.time}</p>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={onPageChange} />
    </>
  );
}

// ── Transaction Timeline ───────────────────────────────────────────
function TransactionTimeline({ payments }: { payments: PaymentTxn[] }) {
  const sorted = [...payments].sort((a, b) => {
    const da = new Date(`${a.date}T00:00:00`).getTime();
    const db = new Date(`${b.date}T00:00:00`).getTime();
    return db !== da ? db - da : a.time > b.time ? -1 : 1;
  });

  if (sorted.length === 0) {
    return <EmptyState icon={Clock} title="No transactions yet" />;
  }

  return (
    <div className="space-y-0">
      {sorted.map((pay, i) => {
        const inv = getInvoice(pay.invoiceId);
        const cust = getCustomer(pay.customerId);
        const isLast = i === sorted.length - 1;
        return (
          <motion.div
            key={pay.id}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.28 }}
            className="flex items-start gap-4"
          >
            {/* Timeline spine */}
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${statusBg(pay.status)}`}
              >
                {statusIcon(pay.status)}
              </div>
              {!isLast && (
                <div className="mt-1 w-px flex-1 bg-slate-200" style={{ minHeight: 24 }} />
              )}
            </div>

            {/* Content */}
            <div className={`flex-1 min-w-0 pb-5 ${isLast ? "" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {pay.paymentNumber}
                    {pay.notes && (
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        · {pay.notes}
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {inv?.invoiceNumber ?? pay.invoiceId} · {cust?.name ?? pay.customerId}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-foreground">{fmtINR(pay.amount)}</p>
                  <p className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {fmtDate(pay.date)} {pay.time}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <BillingStatusPill status={pay.status} />
                <PaymentModeBadge mode={pay.mode as PaymentMode} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Record Payment Modal ───────────────────────────────────────────
function RecordPaymentModal({
  open,
  onClose,
  onRecord,
}: {
  open: boolean;
  onClose: () => void;
  onRecord: (pay: PaymentTxn) => void;
}) {
  const [customerId, setCustomerId] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<PaymentMode>("cash");
  const [date, setDate] = useState("2026-07-13");
  const [ref, setRef] = useState("");
  const [notes, setNotes] = useState("");

  const customerInvoices = useMemo(
    () => (customerId ? invoices.filter((i) => i.customerId === customerId) : []),
    [customerId]
  );

  function handleSubmit() {
    if (!customerId || !invoiceId || !amount) return;
    const num = Math.floor(1100 + Math.random() * 900);
    const pay: PaymentTxn = {
      id: `pay-${Date.now()}`,
      paymentNumber: `PMT-2026-${num}`,
      invoiceId,
      customerId,
      amount: parseFloat(amount),
      mode,
      status: "received",
      date,
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      notes,
      transactionRef: ref || undefined,
    };
    onRecord(pay);
    // reset
    setCustomerId("");
    setInvoiceId("");
    setAmount("");
    setMode("cash");
    setDate("2026-07-13");
    setRef("");
    setNotes("");
    onClose();
  }

  const labelCls = "block text-xs font-semibold text-slate-600 mb-1";
  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-electric)] focus:border-transparent transition";

  return (
    <ModalShell open={open} onClose={onClose} title="Record Payment">
      <div className="space-y-4">
        {/* Customer */}
        <div>
          <label className={labelCls}>Customer *</label>
          <select
            className={inputCls}
            value={customerId}
            onChange={(e) => {
              setCustomerId(e.target.value);
              setInvoiceId("");
            }}
          >
            <option value="">Select customer…</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Invoice */}
        <div>
          <label className={labelCls}>Invoice *</label>
          <select
            className={inputCls}
            value={invoiceId}
            onChange={(e) => {
              setInvoiceId(e.target.value);
              const inv = invoices.find((i) => i.id === e.target.value);
              if (inv) setAmount(String(invoiceGrandTotal(inv)));
            }}
            disabled={!customerId}
          >
            <option value="">
              {customerId ? "Select invoice…" : "Select a customer first"}
            </option>
            {customerInvoices.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.invoiceNumber} — {fmtINR(invoiceGrandTotal(inv))}
              </option>
            ))}
          </select>
        </div>

        {/* Amount + Mode row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Amount (₹) *</label>
            <input
              type="number"
              className={inputCls}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              min={0}
            />
          </div>
          <div>
            <label className={labelCls}>Payment Mode *</label>
            <select
              className={inputCls}
              value={mode}
              onChange={(e) => setMode(e.target.value as PaymentMode)}
            >
              {ALL_MODES.map((m) => (
                <option key={m} value={m}>
                  {paymentModeLabels[m]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date + Ref row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Payment Date *</label>
            <input
              type="date"
              className={inputCls}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Transaction Reference</label>
            <input
              type="text"
              className={inputCls}
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className={labelCls}>Notes</label>
          <textarea
            className={`${inputCls} resize-none`}
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes…"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!customerId || !invoiceId || !amount}
            className="inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-brand)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm disabled:hover:translate-y-0"
          >
            Record Payment
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

// ── CSV Export helper ──────────────────────────────────────────────
function exportCSV(rows: PaymentTxn[], filename = "payments.csv") {
  const headers = ["Payment #", "Invoice", "Customer", "Amount", "Mode", "Status", "Date", "Time", "Ref", "Notes"];
  const lines = [
    headers.join(","),
    ...rows.map((p) => {
      const inv = getInvoice(p.invoiceId);
      const cust = getCustomer(p.customerId);
      return [
        p.paymentNumber,
        inv?.invoiceNumber ?? p.invoiceId,
        `"${cust?.name ?? p.customerId}"`,
        p.amount,
        paymentModeLabels[p.mode] ?? p.mode,
        p.status,
        p.date,
        p.time,
        p.transactionRef ?? "",
        `"${p.notes}"`,
      ].join(",");
    }),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportExcel(rows: PaymentTxn[]) {
  // Export as TSV with .xls extension (opens in Excel)
  const headers = ["Payment #", "Invoice", "Customer", "Amount", "Mode", "Status", "Date", "Time", "Ref", "Notes"];
  const lines = [
    headers.join("\t"),
    ...rows.map((p) => {
      const inv = getInvoice(p.invoiceId);
      const cust = getCustomer(p.customerId);
      return [
        p.paymentNumber,
        inv?.invoiceNumber ?? p.invoiceId,
        cust?.name ?? p.customerId,
        p.amount,
        paymentModeLabels[p.mode] ?? p.mode,
        p.status,
        p.date,
        p.time,
        p.transactionRef ?? "",
        p.notes,
      ].join("\t");
    }),
  ];
  const blob = new Blob([lines.join("\n")], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "payments.xls";
  a.click();
  URL.revokeObjectURL(url);
}

// ── Payment Method Analytics Card ─────────────────────────────────
function PaymentMethodBreakdown({ payments }: { payments: PaymentTxn[] }) {
  const breakdown = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {};
    for (const p of payments) {
      if (!map[p.mode]) map[p.mode] = { count: 0, total: 0 };
      map[p.mode].count += 1;
      map[p.mode].total += p.amount;
    }
    return Object.entries(map)
      .map(([mode, data]) => ({ mode: mode as PaymentMode, ...data }))
      .sort((a, b) => b.total - a.total);
  }, [payments]);

  const maxTotal = breakdown.reduce((m, b) => Math.max(m, b.total), 0);

  if (breakdown.length === 0) return null;

  return (
    <SectionCard>
      <div className="mb-4 flex items-center gap-2">
        <BarChart2 className="h-4 w-4 text-violet-500" />
        <h3 className="text-sm font-semibold text-foreground">Payment Method Breakdown</h3>
        <span className="ml-auto text-xs text-muted-foreground">{payments.length} transactions</span>
      </div>
      <div className="space-y-3">
        {breakdown.map((b) => {
          const pct = maxTotal > 0 ? (b.total / maxTotal) * 100 : 0;
          return (
            <div key={b.mode} className="flex items-center gap-3">
              <div className="w-28 shrink-0">
                <PaymentModeBadge mode={b.mode} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{b.count} txn{b.count !== 1 ? "s" : ""}</span>
                  <span className="text-xs font-semibold text-foreground">{fmtINR(b.total)}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-[image:var(--gradient-brand)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

// ── Main Component ─────────────────────────────────────────────────
export function PaymentsTab() {
  const [payments, setPayments] = useState<PaymentTxn[]>(seedPayments);
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState("all");
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("all");
  const [page, setPage] = useState(1);
  const [showRecordModal, setShowRecordModal] = useState(false);

  // Stats
  const receivedPayments = payments.filter((p) => p.status === "received");
  const totalReceived = receivedPayments.reduce((s, p) => s + p.amount, 0);
  const receivedCount = receivedPayments.length;
  const totalPending = payments
    .filter((p) => p.status === "pending")
    .reduce((s, p) => s + p.amount, 0);
  const totalRefunded = payments
    .filter((p) => p.status === "refunded")
    .reduce((s, p) => s + p.amount, 0);
  const totalCount = payments.length;

  // Enhanced stats
  const avgPayment = receivedCount > 0 ? totalReceived / receivedCount : 0;
  const collectionDenominator = totalReceived + totalPending;
  const collectionPct =
    collectionDenominator > 0
      ? ((totalReceived / collectionDenominator) * 100).toFixed(0)
      : "0";

  // Filtered for main table
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return payments.filter((p) => {
      const inv = getInvoice(p.invoiceId);
      const cust = getCustomer(p.customerId);
      const matchSearch =
        p.paymentNumber.toLowerCase().includes(q) ||
        (inv?.invoiceNumber ?? "").toLowerCase().includes(q) ||
        (cust?.name ?? "").toLowerCase().includes(q) ||
        p.notes.toLowerCase().includes(q);
      const matchMode = modeFilter === "all" || p.mode === modeFilter;
      return matchSearch && matchMode;
    });
  }, [payments, search, modeFilter]);

  // Sub-tab filtered sets
  const byStatus = (status: PaymentTxnStatus) => filtered.filter((p) => p.status === status);
  const pendingRows = byStatus("pending");
  const receivedRows = byStatus("received");
  const refundedRows = byStatus("refunded");

  const allTotalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pendingTotalPages = Math.max(1, Math.ceil(pendingRows.length / PAGE_SIZE));
  const receivedTotalPages = Math.max(1, Math.ceil(receivedRows.length / PAGE_SIZE));
  const refundedTotalPages = Math.max(1, Math.ceil(refundedRows.length / PAGE_SIZE));

  const subTabs: { id: SubTab; label: string; count?: number }[] = [
    { id: "all", label: "Payment History", count: payments.length },
    { id: "pending", label: "Pending", count: pendingRows.length },
    { id: "received", label: "Received", count: receivedRows.length },
    { id: "refunded", label: "Refunds", count: refundedRows.length },
    { id: "timeline", label: "Transaction Timeline" },
  ];

  // Active rows for export
  const exportRows =
    activeSubTab === "pending"
      ? pendingRows
      : activeSubTab === "received"
        ? receivedRows
        : activeSubTab === "refunded"
          ? refundedRows
          : filtered;

  function handleRecord(pay: PaymentTxn) {
    setPayments((prev) => [pay, ...prev]);
  }

  return (
    <div className="space-y-6">
      {/* Stat Strip — 6 tiles */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatTile
          label="Total Received"
          value={fmtINR(totalReceived)}
          icon={CheckCircle2}
          bg="bg-emerald-50"
          iconColor="text-emerald-600"
          index={0}
        />
        <StatTile
          label="Pending"
          value={fmtINR(totalPending)}
          icon={Clock}
          bg="bg-amber-50"
          iconColor="text-amber-600"
          index={1}
        />
        <StatTile
          label="Refunded"
          value={fmtINR(totalRefunded)}
          icon={RefreshCcw}
          bg="bg-cyan-50"
          iconColor="text-cyan-600"
          index={2}
        />
        <StatTile
          label="Transactions"
          value={String(totalCount)}
          icon={IndianRupee}
          bg="bg-blue-50"
          iconColor="text-blue-600"
          index={3}
        />
        <StatTile
          label="Avg Payment"
          value={fmtINR(avgPayment)}
          icon={BarChart2}
          bg="bg-purple-50"
          iconColor="text-purple-600"
          index={4}
        />
        <StatTile
          label="Collection %"
          value={`${collectionPct}%`}
          icon={Percent}
          bg="bg-sky-50"
          iconColor="text-sky-600"
          index={5}
        />
      </div>

      {/* Main Card */}
      <SectionCard noPadding>
        {/* Sub-tab header */}
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 px-6 py-3">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id);
                setPage(1);
              }}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeSubTab === tab.id
                  ? "bg-[image:var(--gradient-brand)] text-white shadow-sm"
                  : "text-muted-foreground hover:bg-slate-100 hover:text-foreground"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${activeSubTab === tab.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}

          {/* Record Payment button */}
          <div className="ml-auto flex items-center gap-2">
            <PrimaryButton onClick={() => setShowRecordModal(true)} icon={Plus}>
              Record Payment
            </PrimaryButton>
          </div>
        </div>

        {/* Toolbar: search + filter + export — only for table views */}
        {activeSubTab !== "timeline" && (
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-6 py-3">
            <SearchInput
              value={search}
              onChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              placeholder="Search payments…"
              className="w-48"
            />
            <Select
              value={modeFilter}
              onChange={(v) => {
                setModeFilter(v);
                setPage(1);
              }}
              options={[
                { value: "all", label: "All Modes" },
                { value: "cash", label: "Cash" },
                { value: "upi", label: "UPI" },
                { value: "card", label: "Card" },
                { value: "bank-transfer", label: "Bank Transfer" },
                { value: "neft", label: "NEFT" },
                { value: "rtgs", label: "RTGS" },
                { value: "cheque", label: "Cheque" },
                { value: "credit", label: "Credit" },
                { value: "wallet", label: "Wallet" },
              ]}
            />
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => exportCSV(exportRows)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                Export CSV
              </button>
              <button
                onClick={() => exportExcel(exportRows)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                Export Excel
              </button>
            </div>
          </div>
        )}

        {/* Sub-tab content */}
        {activeSubTab === "all" && (
          <PaymentTable
            rows={filtered}
            page={page}
            totalPages={allTotalPages}
            onPageChange={setPage}
            emptyTitle="No payments found"
            emptySubtitle="Try adjusting your search or mode filter."
          />
        )}

        {activeSubTab === "pending" && (
          <PaymentTable
            rows={pendingRows}
            page={page}
            totalPages={pendingTotalPages}
            onPageChange={setPage}
            emptyTitle="No pending payments"
            emptySubtitle="All payments have been settled."
          />
        )}

        {activeSubTab === "received" && (
          <PaymentTable
            rows={receivedRows}
            page={page}
            totalPages={receivedTotalPages}
            onPageChange={setPage}
            emptyTitle="No received payments"
          />
        )}

        {activeSubTab === "refunded" && (
          <PaymentTable
            rows={refundedRows}
            page={page}
            totalPages={refundedTotalPages}
            onPageChange={setPage}
            emptyTitle="No refunds found"
            emptySubtitle="No refunded transactions recorded yet."
          />
        )}

        {activeSubTab === "timeline" && (
          <div className="p-6">
            <p className="mb-6 text-xs text-muted-foreground">
              All transactions sorted by date · most recent first
            </p>
            <TransactionTimeline payments={payments} />
          </div>
        )}
      </SectionCard>

      {/* Payment Method Breakdown */}
      <PaymentMethodBreakdown payments={payments} />

      {/* Record Payment Modal */}
      <RecordPaymentModal
        open={showRecordModal}
        onClose={() => setShowRecordModal(false)}
        onRecord={handleRecord}
      />
    </div>
  );
}
