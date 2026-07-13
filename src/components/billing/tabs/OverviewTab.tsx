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
} from "recharts";
import {
  invoices,
  invoiceGrandTotal,
  computeDocumentTotals,
  getCustomer,
  fmtINR,
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
  ];

  return (
    <div className="space-y-6">
      {/* Stat Tiles */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
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
    </div>
  );
}
