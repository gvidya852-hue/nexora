// ── Billing Overview Tab ──────────────────────────────────────────
import { motion } from "framer-motion";
import {
  IndianRupee,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Receipt,
  FilePlus,
  FileSignature,
  CreditCard,
  LayoutTemplate,
  Zap,
  TrendingUp,
  BarChart2,
  Users,
  Calendar,
  Activity,
  Percent,
  Clock4,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  invoices,
  invoiceGrandTotal,
  computeDocumentTotals,
  getCustomer,
  fmtINR,
  activityEvents,
  payments,
  customers,
} from "@/lib/billing-data";
import { SectionCard, StatTile, BillingStatusPill, fmtDate } from "@/components/billing/shared";

// ── Derived Stats ─────────────────────────────────────────────────

// Today's Sales: sum of grand totals for invoices on the most recent createdDate
const allDates = [...new Set(invoices.map((i) => i.createdDate))].sort();
const mostRecentDate = allDates[allDates.length - 1] ?? "";
const todayInvoices = invoices.filter((i) => i.createdDate === mostRecentDate);
const todaySales = todayInvoices.reduce((sum, inv) => sum + invoiceGrandTotal(inv), 0);

// Invoices Created
const invoicesCreated = invoices.length;

// Pending Payments
const pendingInvoices = invoices.filter(
  (i) => i.paymentStatus === "pending" || i.paymentStatus === "partial",
);
const pendingCount = pendingInvoices.length;
const pendingAmount = pendingInvoices.reduce(
  (sum, inv) => sum + (invoiceGrandTotal(inv) - inv.amountPaid),
  0,
);

// Overdue Invoices
const overdueInvoices = invoices.filter((i) => i.status === "overdue");
const overdueCount = overdueInvoices.length;
const overdueAmount = overdueInvoices.reduce(
  (sum, inv) => sum + (invoiceGrandTotal(inv) - inv.amountPaid),
  0,
);

// Collected Amount
const collectedAmount = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);

// GST Payable
const gstPayable = invoices.reduce((sum, inv) => {
  const totals = computeDocumentTotals(inv.items, inv.isInterState);
  return sum + totals.cgst + totals.sgst + totals.igst;
}, 0);

// ── Enterprise Derived Stats ──────────────────────────────────────

// Invoice Collection Rate
const paidCount = invoices.filter((i) => i.status === "paid").length;
const totalInvoices = invoices.length;
const collectionRate = totalInvoices > 0 ? ((paidCount / totalInvoices) * 100).toFixed(1) : "0.0";

// Average Invoice Value
const totalAmount = invoices.reduce((sum, inv) => sum + invoiceGrandTotal(inv), 0);
const avgInvoiceValue = totalInvoices > 0 ? totalAmount / totalInvoices : 0;

// ── Bar Chart Data: invoice amounts for last 7 distinct created dates ──
const last7Dates = allDates.slice(-7);
const barChartData = last7Dates.map((date) => {
  const dayInvoices = invoices.filter((i) => i.createdDate === date);
  const total = dayInvoices.reduce((s, inv) => s + invoiceGrandTotal(inv), 0);
  const label = new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
  return { date: label, Amount: total };
});

// ── Pie Chart: Invoice Status Distribution ─────────────────────────
const statusCounts: Record<string, number> = {};
invoices.forEach((inv) => {
  statusCounts[inv.status] = (statusCounts[inv.status] ?? 0) + 1;
});
const statusColors: Record<string, string> = {
  draft: "#94a3b8",
  sent: "#3b82f6",
  paid: "#10b981",
  partial: "#f59e0b",
  overdue: "#ef4444",
  cancelled: "#cbd5e1",
};
const pieData = Object.entries(statusCounts).map(([status, count]) => ({
  name: status.charAt(0).toUpperCase() + status.slice(1),
  value: count,
  color: statusColors[status] ?? "#94a3b8",
}));

// ── Recent Invoices (latest 8) ─────────────────────────────────────
const recentInvoices = [...invoices]
  .sort(
    (a, b) =>
      new Date(b.createdDate + "T00:00:00").getTime() -
      new Date(a.createdDate + "T00:00:00").getTime(),
  )
  .slice(0, 8);

// ── Monthly Revenue Mock Data ──────────────────────────────────────
const monthlyRevenueData = [
  { month: "Jan", Revenue: 380000 },
  { month: "Feb", Revenue: 420000 },
  { month: "Mar", Revenue: 510000 },
  { month: "Apr", Revenue: 465000 },
  { month: "May", Revenue: 580000 },
  { month: "Jun", Revenue: 620000 },
  { month: "Jul", Revenue: 710000 },
];

// ── Top 5 Customers by Outstanding Balance ─────────────────────────
const topCustomers = [...customers]
  .filter((c) => c.outstandingBalance > 0)
  .sort((a, b) => b.outstandingBalance - a.outstandingBalance)
  .slice(0, 5);
const maxOutstanding = topCustomers[0]?.outstandingBalance ?? 1;

// ── Payment Distribution by Mode ───────────────────────────────────
const paymentModeMap: Record<string, number> = {};
payments.forEach((p) => {
  paymentModeMap[p.mode] = (paymentModeMap[p.mode] ?? 0) + p.amount;
});
const paymentModeColors: Record<string, string> = {
  cash: "#10b981",
  upi: "#3b82f6",
  card: "#8b5cf6",
  "bank-transfer": "#f59e0b",
  neft: "#06b6d4",
  rtgs: "#f97316",
  credit: "#ef4444",
  wallet: "#ec4899",
  cheque: "#64748b",
};
const paymentDistData = Object.entries(paymentModeMap).map(([mode, amount]) => ({
  name: mode === "bank-transfer" ? "Bank Transfer" : mode.charAt(0).toUpperCase() + mode.slice(1),
  value: amount,
  color: paymentModeColors[mode] ?? "#94a3b8",
}));

// ── Upcoming Payments (sent/partial, sorted by dueDate) ───────────
const upcomingPayments = [...invoices]
  .filter((i) => i.status === "sent" || i.status === "partial")
  .sort(
    (a, b) =>
      new Date(a.dueDate + "T00:00:00").getTime() - new Date(b.dueDate + "T00:00:00").getTime(),
  )
  .slice(0, 5);

// ── Activity Events (last 8) ───────────────────────────────────────
const recentActivity = [...activityEvents]
  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  .slice(0, 8);

// ── Business Insights ─────────────────────────────────────────────
const REFERENCE_DATE = "2026-07-13";
const referenceMs = new Date(REFERENCE_DATE + "T00:00:00").getTime();
const dueThisWeekCount = invoices.filter((i) => {
  const due = new Date(i.dueDate + "T00:00:00").getTime();
  const diff = due - referenceMs;
  return diff >= 0 && diff <= 7 * 24 * 60 * 60 * 1000;
}).length;

// ── Custom Tooltip ─────────────────────────────────────────────────
function ChartTip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
      <p className="mb-1.5 text-xs font-semibold text-slate-500">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-bold text-foreground">
          {fmtINR(p.value)}{" "}
          <span className="text-xs font-normal text-muted-foreground">{p.name}</span>
        </p>
      ))}
    </div>
  );
}

function PieTip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number }[];
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
      <p className="text-xs font-semibold text-foreground">{p.name}</p>
      <p className="mt-0.5 text-sm font-bold text-foreground">{p.value} invoices</p>
    </div>
  );
}

function PaymentPieTip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number }[];
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
      <p className="text-xs font-semibold text-foreground">{p.name}</p>
      <p className="mt-0.5 text-sm font-bold text-foreground">{fmtINR(p.value)}</p>
    </div>
  );
}

// ── Quick Actions ──────────────────────────────────────────────────
const quickActions = [
  {
    label: "New Invoice",
    icon: FilePlus,
    color: "bg-blue-600 hover:bg-blue-700",
    desc: "Create a new tax invoice",
    tabId: "invoices",
  },
  {
    label: "New Quotation",
    icon: FileSignature,
    color: "bg-violet-600 hover:bg-violet-700",
    desc: "Send a quote to a customer",
    tabId: "quotations",
  },
  {
    label: "Record Payment",
    icon: CreditCard,
    color: "bg-emerald-600 hover:bg-emerald-700",
    desc: "Log an incoming payment",
    tabId: "payments",
  },
  {
    label: "Manage Templates",
    icon: LayoutTemplate,
    color: "bg-[image:var(--gradient-brand)]",
    desc: "Customise invoice design",
    tabId: "templates",
  },
];

// ── Activity icon helper ───────────────────────────────────────────
function activityIcon(type: string) {
  switch (type) {
    case "invoice-paid":
      return { icon: CheckCircle2, bg: "bg-emerald-50", color: "text-emerald-600" };
    case "payment-received":
      return { icon: IndianRupee, bg: "bg-blue-50", color: "text-blue-600" };
    case "invoice-created":
      return { icon: FilePlus, bg: "bg-indigo-50", color: "text-indigo-600" };
    case "invoice-edited":
      return { icon: FileSignature, bg: "bg-amber-50", color: "text-amber-600" };
    case "invoice-printed":
      return { icon: Receipt, bg: "bg-slate-100", color: "text-slate-600" };
    case "draft-saved":
      return { icon: FileText, bg: "bg-slate-100", color: "text-slate-600" };
    case "quotation-sent":
      return { icon: ArrowUpRight, bg: "bg-violet-50", color: "text-violet-600" };
    case "credit-note-issued":
      return { icon: AlertTriangle, bg: "bg-red-50", color: "text-red-600" };
    default:
      return { icon: Activity, bg: "bg-slate-100", color: "text-slate-600" };
  }
}

function fmtTimestamp(ts: string) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

// ── Main Component ─────────────────────────────────────────────────
export function OverviewTab({ onNavigate }: { onNavigate?: (tabId: string) => void }) {
  const statTiles = [
    {
      label: "Today's Sales",
      value: fmtINR(todaySales),
      sub: mostRecentDate ? fmtDate(mostRecentDate) : "",
      icon: TrendingUp,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Invoices Created",
      value: String(invoicesCreated),
      sub: "All time",
      icon: FileText,
      bg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      label: "Pending Payments",
      value: String(pendingCount),
      sub: fmtINR(pendingAmount) + " outstanding",
      icon: Clock,
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      label: "Overdue Invoices",
      value: String(overdueCount),
      sub: fmtINR(overdueAmount) + " overdue",
      icon: AlertTriangle,
      bg: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      label: "Collected Amount",
      value: fmtINR(collectedAmount),
      sub: "Total received",
      icon: CheckCircle2,
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "GST Payable",
      value: fmtINR(gstPayable),
      sub: "Across all invoices",
      icon: IndianRupee,
      bg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      label: "Collection Rate",
      value: collectionRate + "%",
      sub: `${paidCount} of ${totalInvoices} paid`,
      icon: Percent,
      bg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      label: "Avg Invoice Value",
      value: fmtINR(avgInvoiceValue),
      sub: "Per invoice",
      icon: BarChart2,
      bg: "bg-sky-50",
      iconColor: "text-sky-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Tiles — 8 tiles */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8">
        {statTiles.map((tile, i) => (
          <StatTile
            key={tile.label}
            label={tile.label}
            value={tile.value}
            sub={tile.sub}
            icon={tile.icon}
            bg={tile.bg}
            iconColor={tile.iconColor}
            index={i}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Invoice Amounts Bar Chart */}
        <SectionCard
          title="Invoice Amounts"
          subtitle="Grand total per day · last 7 active dates"
          action={
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                INR
              </span>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barChartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => "₹" + (v / 1000).toFixed(0) + "k"}
              />
              <Tooltip
                cursor={{ fill: "rgba(241,245,249,0.6)", radius: 6 }}
                content={<ChartTip />}
              />
              <Bar
                dataKey="Amount"
                name="Amount"
                fill="#3b82f6"
                radius={[5, 5, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Invoice Status Pie Chart */}
        <SectionCard title="Invoice Status Distribution" subtitle="Count by current status">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<PieTip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 flex-1">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="flex-1 truncate text-xs text-foreground">{d.name}</span>
                  <span className="shrink-0 text-xs font-semibold text-foreground">
                    {d.value} invoice{d.value !== 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Recent Invoices + Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Invoices */}
        <SectionCard
          title="Recent Invoices"
          subtitle="Latest 8 invoices"
          action={
            <button
              onClick={() => onNavigate?.("invoices")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View all
            </button>
          }
        >
          <div className="space-y-3">
            {recentInvoices.map((inv, i) => {
              const customer = getCustomer(inv.customerId);
              const total = invoiceGrandTotal(inv);
              return (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                    <Receipt className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {customer?.name ?? inv.customerId}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {inv.invoiceNumber} · {fmtDate(inv.createdDate)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="text-xs font-bold text-foreground">{fmtINR(total)}</span>
                    <BillingStatusPill status={inv.status} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </SectionCard>

        {/* Quick Actions */}
        <SectionCard
          title="Quick Actions"
          subtitle="Jump to common billing tasks"
          action={<Zap className="h-4 w-4 text-[color:var(--brand-electric)]" />}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() =>
                    onNavigate ? onNavigate(action.tabId) : console.log("navigate:", action.tabId)
                  }
                  className={`group flex items-center gap-3 rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${action.color} text-white`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold leading-snug">{action.label}</p>
                    <p className="text-[10px] text-white/70">{action.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* ── ENTERPRISE ANALYTICS ─────────────────────────────────── */}

      {/* Monthly Revenue + Top Customers */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Monthly Revenue Line Chart */}
        <SectionCard
          title="Monthly Revenue"
          subtitle="Invoice totals · Jan–Jul 2026"
          action={
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              INR
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyRevenueData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => "₹" + (v / 100000).toFixed(1) + "L"}
              />
              <Tooltip content={<ChartTip />} />
              <Line
                type="monotone"
                dataKey="Revenue"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#3b82f6", strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Top Customers by Outstanding Balance */}
        <SectionCard
          title="Top Customers"
          subtitle="By outstanding balance"
          action={<Users className="h-4 w-4 text-muted-foreground" />}
        >
          <div className="space-y-4">
            {topCustomers.map((c, i) => {
              const pct = Math.round((c.outstandingBalance / maxOutstanding) * 100);
              return (
                <div key={c.id} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-foreground">{c.name}</p>
                        <p className="text-[10px] text-muted-foreground">{c.city}</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs font-bold text-foreground">
                      {fmtINR(c.outstandingBalance)}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100">
                    <div
                      className="h-1.5 rounded-full bg-blue-500 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* Business Insights + Payment Distribution */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Business Insights 2×2 grid */}
        <SectionCard
          title="Business Insights"
          subtitle="Key performance indicators"
          action={<Activity className="h-4 w-4 text-muted-foreground" />}
        >
          <div className="grid grid-cols-2 gap-3">
            {/* Collection Rate */}
            <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-violet-100">
                  <Percent className="h-3.5 w-3.5 text-violet-600" />
                </div>
                <span className="text-[11px] font-semibold text-violet-700">Collection Rate</span>
              </div>
              <p className="text-2xl font-bold text-violet-700">{collectionRate}%</p>
              <p className="mt-0.5 text-[10px] text-violet-500">{paidCount} of {totalInvoices} invoices paid</p>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-violet-600 font-medium">
                <TrendingUp className="h-3 w-3" />
                <span>Positive trend</span>
              </div>
            </div>

            {/* Avg Days to Pay */}
            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-sky-100">
                  <Clock4 className="h-3.5 w-3.5 text-sky-600" />
                </div>
                <span className="text-[11px] font-semibold text-sky-700">Avg Days to Pay</span>
              </div>
              <p className="text-2xl font-bold text-sky-700">8.4</p>
              <p className="mt-0.5 text-[10px] text-sky-500">days average turnaround</p>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-sky-600 font-medium">
                <ArrowUpRight className="h-3 w-3" />
                <span>Within credit terms</span>
              </div>
            </div>

            {/* Invoices Due This Week */}
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-100">
                  <Calendar className="h-3.5 w-3.5 text-amber-600" />
                </div>
                <span className="text-[11px] font-semibold text-amber-700">Due This Week</span>
              </div>
              <p className="text-2xl font-bold text-amber-700">{dueThisWeekCount}</p>
              <p className="mt-0.5 text-[10px] text-amber-500">invoices due within 7 days</p>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-600 font-medium">
                <Clock className="h-3 w-3" />
                <span>Action required</span>
              </div>
            </div>

            {/* GST Filing Month */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-100">
                  <IndianRupee className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <span className="text-[11px] font-semibold text-emerald-700">GST Filing</span>
              </div>
              <p className="text-2xl font-bold text-emerald-700">Jul 2026</p>
              <p className="mt-0.5 text-[10px] text-emerald-500">Current filing month</p>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                <Calendar className="h-3 w-3" />
                <span>Due 20 Aug 2026</span>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Payment Distribution Pie */}
        <SectionCard
          title="Payment Distribution"
          subtitle="Breakdown by payment mode"
        >
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={paymentDistData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {paymentDistData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<PaymentPieTip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 flex-1">
              {paymentDistData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="flex-1 truncate text-xs text-foreground">{d.name}</span>
                  <span className="shrink-0 text-xs font-semibold text-foreground">
                    {fmtINR(d.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Upcoming Payments */}
      <SectionCard
        title="Upcoming Payments"
        subtitle="Sent & partial invoices · sorted by due date"
        action={
          <button
            onClick={() => onNavigate?.("invoices")}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            View all
          </button>
        }
      >
        {upcomingPayments.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No upcoming payments.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-2 text-left font-semibold text-muted-foreground">Invoice</th>
                  <th className="pb-2 text-left font-semibold text-muted-foreground">Customer</th>
                  <th className="pb-2 text-left font-semibold text-muted-foreground">Due Date</th>
                  <th className="pb-2 text-right font-semibold text-muted-foreground">Balance Due</th>
                  <th className="pb-2 text-right font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {upcomingPayments.map((inv, i) => {
                  const customer = getCustomer(inv.customerId);
                  const balance = invoiceGrandTotal(inv) - inv.amountPaid;
                  return (
                    <motion.tr
                      key={inv.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.04 * i, duration: 0.25 }}
                      className="group"
                    >
                      <td className="py-2.5 pr-4 font-medium text-foreground">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-2.5 pr-4 text-foreground">
                        {customer?.name ?? inv.customerId}
                      </td>
                      <td className="py-2.5 pr-4 text-muted-foreground">
                        {fmtDate(inv.dueDate)}
                      </td>
                      <td className="py-2.5 pr-4 text-right font-bold text-foreground">
                        {fmtINR(balance)}
                      </td>
                      <td className="py-2.5 text-right">
                        <BillingStatusPill status={inv.status} />
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* Activity Timeline */}
      <SectionCard
        title="Activity Feed"
        subtitle="Recent billing activity"
        action={<Activity className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-slate-100" />
          <div className="space-y-4">
            {recentActivity.map((event, i) => {
              const { icon: EventIcon, bg, color } = activityIcon(event.type);
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.25 }}
                  className="flex items-start gap-3 pl-1"
                >
                  {/* Dot */}
                  <div
                    className={`relative z-10 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full ${bg}`}
                  >
                    <EventIcon className={`h-3.5 w-3.5 ${color}`} />
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground">{event.title}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{event.subtitle}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        {event.amount !== undefined && (
                          <p className="text-xs font-bold text-foreground">{fmtINR(event.amount)}</p>
                        )}
                        <p className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {fmtTimestamp(event.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
