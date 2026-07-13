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
} from "lucide-react";
import {
  payments as seedPayments,
  invoices,
  getCustomer,
  getInvoice,
  fmtINR,
  fmtDate,
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
} from "@/components/billing/shared";

const PAGE_SIZE = 8;

// ── Sub-tab type ───────────────────────────────────────────────────
type SubTab = "all" | "pending" | "received" | "refunded" | "timeline";

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

  const statusIcon = (status: PaymentTxnStatus) => {
    if (status === "received") return <CheckCircle2 className="h-4 w-4" />;
    if (status === "refunded") return <RefreshCcw className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  const statusBg = (status: PaymentTxnStatus) => {
    if (status === "received") return "bg-emerald-50 text-emerald-600";
    if (status === "refunded") return "bg-cyan-50 text-cyan-600";
    return "bg-amber-50 text-amber-600";
  };

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

// ── Main Component ─────────────────────────────────────────────────
export function PaymentsTab() {
  const [payments] = useState<PaymentTxn[]>(seedPayments);
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState("all");
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("all");
  const [page, setPage] = useState(1);

  // Stats
  const totalReceived = payments
    .filter((p) => p.status === "received")
    .reduce((s, p) => s + p.amount, 0);
  const totalPending = payments
    .filter((p) => p.status === "pending")
    .reduce((s, p) => s + p.amount, 0);
  const totalRefunded = payments
    .filter((p) => p.status === "refunded")
    .reduce((s, p) => s + p.amount, 0);
  const totalCount = payments.length;

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

  return (
    <div className="space-y-6">
      {/* Stat Strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
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

          {/* Search + filter — only for table views */}
          {activeSubTab !== "timeline" && (
            <div className="ml-auto flex items-center gap-2">
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
                  { value: "credit", label: "Credit" },
                  { value: "wallet", label: "Wallet" },
                ]}
              />
            </div>
          )}
        </div>

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
    </div>
  );
}
