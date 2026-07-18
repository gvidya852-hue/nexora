import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  IndianRupee,
  ShoppingCart,
  FileText,
  Clock,
  AlertTriangle,
  Users,
  Package,
  TrendingUp,
  Plus,
  UserPlus,
  PackagePlus,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  CheckCircle2,
  ChevronRight,
  PackageOpen,
  PackageMinus,
  SlidersHorizontal,
  XCircle,
  Layers,
} from "lucide-react";
import { useProducts } from "../../../hooks/useProductsQuery";
import {
  useInventoryMovements,
  fmtMovementDate,
  fmtMovementTime,
} from "../../../hooks/useInventoryMovementsQuery";
import { dbToProduct } from "../../../services/products";
import { getStockStatus, fmtINR } from "../../../lib/inventory-data";
import { useInvoices } from "../../../hooks/useInvoicesQuery";
import { useCustomers } from "../../../hooks/useCustomersQuery";
import { computeDocumentTotals } from "../../../lib/billing-data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useBusiness } from "../../../contexts/BusinessContext";

export const Route = createFileRoute("/_authenticated/_app/dashboard")({
  component: DashboardPage,
});

// ── Demo Data ─────────────────────────────────────────────────────

const revenueData = [
  { date: "Jul 1",  revenue: 18500, target: 20000 },
  { date: "Jul 2",  revenue: 21200, target: 20000 },
  { date: "Jul 3",  revenue: 19800, target: 20000 },
  { date: "Jul 4",  revenue: 23100, target: 22000 },
  { date: "Jul 5",  revenue: 17600, target: 20000 },
  { date: "Jul 6",  revenue: 25800, target: 22000 },
  { date: "Jul 7",  revenue: 28200, target: 25000 },
  { date: "Jul 8",  revenue: 22400, target: 22000 },
  { date: "Jul 9",  revenue: 24100, target: 22000 },
  { date: "Jul 10", revenue: 26700, target: 24000 },
  { date: "Jul 11", revenue: 29300, target: 25000 },
  { date: "Jul 12", revenue: 31100, target: 25000 },
  { date: "Jul 13", revenue: 24780, target: 25000 },
];

const salesData = [
  { day: "Mon", sales: 14, returns: 1 },
  { day: "Tue", sales: 22, returns: 2 },
  { day: "Wed", sales: 18, returns: 0 },
  { day: "Thu", sales: 29, returns: 3 },
  { day: "Fri", sales: 34, returns: 2 },
  { day: "Sat", sales: 38, returns: 1 },
  { day: "Sun", sales: 19, returns: 0 },
];

const topProducts = [
  { name: "Tata Salt 1kg",     sales: 2840, color: "#3b82f6" },
  { name: "Amul Butter 500g",  sales: 2310, color: "#8b5cf6" },
  { name: "Fortune Rice 5kg",  sales: 1980, color: "#10b981" },
  { name: "Surf Excel 1kg",    sales: 1640, color: "#f59e0b" },
  { name: "Colgate 200g",      sales: 1290, color: "#ef4444" },
];

const activityFeed = [
  { icon: "💳", color: "bg-green-50 text-green-600",  label: "Payment received",    sub: "₹12,500 from Gupta & Sons",         time: "2 min ago",   type: "success" },
  { icon: "🧾", color: "bg-blue-50 text-blue-600",    label: "Invoice created",     sub: "INV-2025-0041 for Priya Traders",   time: "18 min ago",  type: "info"    },
  { icon: "📦", color: "bg-red-50 text-red-600",      label: "Low stock alert",     sub: "Tata Salt 1kg — only 4 units left", time: "35 min ago",  type: "warning" },
  { icon: "👤", color: "bg-purple-50 text-purple-600",label: "New customer added",  sub: "Rajesh Kumar — Mumbai",             time: "1 hr ago",    type: "info"    },
  { icon: "✅", color: "bg-emerald-50 text-emerald-600",label:"Stock updated",      sub: "Amul Butter — +50 units received",  time: "2 hrs ago",   type: "success" },
  { icon: "⚠️", color: "bg-amber-50 text-amber-600",  label: "Invoice overdue",     sub: "INV-2025-0034 — ₹8,900 past due",  time: "3 hrs ago",   type: "warning" },
];

const healthMetrics = [
  { label: "Revenue Growth",    value: "+18%",    sub: "vs last month",   score: 82, color: "text-emerald-600", bar: "bg-emerald-500" },
  { label: "Inventory Health",  value: "8 alerts",sub: "low stock items",  score: 58, color: "text-amber-600",  bar: "bg-amber-500"  },
  { label: "Customer Growth",   value: "+5%",     sub: "new this month",  score: 71, color: "text-blue-600",   bar: "bg-blue-500"   },
  { label: "Payment Recovery",  value: "78%",     sub: "collected on time",score: 78, color: "text-violet-600", bar: "bg-violet-500" },
];

// statCards replaced by LiveStatCards component below

const quickActions = [
  { label: "Create Invoice",      icon: Plus,        to: "/billing",      color: "bg-blue-600 hover:bg-blue-700",   desc: "New GST invoice" },
  { label: "Add Customer",        icon: UserPlus,    to: "/crm",          color: "bg-violet-600 hover:bg-violet-700",desc: "Register customer" },
  { label: "Add Product",         icon: PackagePlus, to: "/inventory",    color: "bg-emerald-600 hover:bg-emerald-700",desc:"Add to inventory"},
  { label: "View Reports",        icon: BarChart3,   to: "/reports",      color: "bg-amber-600 hover:bg-amber-700", desc: "Business insights" },
  { label: "Open AI Assistant",   icon: Sparkles,    to: "/ai-assistant", color: "bg-[image:var(--gradient-brand)]", desc: "Ask Nexora AI" },
];

// ── Helpers ───────────────────────────────────────────────────────

function fmt(v: number) {
  return "₹" + v.toLocaleString("en-IN");
}

// ── Live stat cards ───────────────────────────────────────────────

function LiveStatCards({ businessId }: { businessId: string | null }) {
  const { data: invoices = [], isLoading: invLoading } = useInvoices(businessId);
  const { data: dbProducts = [], isLoading: prodLoading } = useProducts(businessId);
  const { data: dbCustomers = [], isLoading: custLoading } = useCustomers(businessId);

  const today = new Date().toISOString().split("T")[0];

  const todayInvoices = invoices.filter((inv) => inv.createdDate === today);
  const todayRevenue = todayInvoices.reduce((sum, inv) => {
    const t = computeDocumentTotals(inv.items, inv.isInterState);
    return sum + t.grandTotal;
  }, 0);
  const todayOrders = todayInvoices.length;

  const outstandingInvoices = invoices.filter(
    (inv) => inv.status !== "paid" && inv.status !== "cancelled"
  );
  const outstandingAmount = outstandingInvoices.reduce((sum, inv) => {
    const t = computeDocumentTotals(inv.items, inv.isInterState);
    return sum + (t.grandTotal - inv.amountPaid);
  }, 0);

  const products = dbProducts.map(dbToProduct);
  const lowStockCount = products.filter((p) => {
    const s = getStockStatus(p);
    return s === "low-stock" || s === "critical" || s === "out-of-stock";
  }).length;

  const cards = [
    {
      label: "Today's Revenue",
      value: invLoading ? "—" : fmtINR(todayRevenue),
      change: invLoading ? "…" : `${todayOrders} invoice${todayOrders !== 1 ? "s" : ""}`,
      up: todayRevenue > 0,
      sub: "created today",
      icon: IndianRupee,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
      accent: "bg-blue-500",
    },
    {
      label: "Today's Orders",
      value: invLoading ? "—" : String(todayOrders),
      change: invLoading ? "…" : todayOrders > 0 ? "Active" : "None yet",
      up: todayOrders > 0,
      sub: "invoices today",
      icon: ShoppingCart,
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      accent: "bg-emerald-500",
    },
    {
      label: "Outstanding Invoices",
      value: invLoading ? "—" : fmtINR(outstandingAmount),
      change: invLoading ? "…" : `${outstandingInvoices.length} invoices`,
      up: false,
      sub: "awaiting payment",
      icon: FileText,
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
      accent: "bg-amber-500",
    },
    {
      label: "Pending Payments",
      value: invLoading ? "—" : fmtINR(outstandingAmount),
      change: invLoading ? "…" : `${outstandingInvoices.length} pending`,
      up: false,
      sub: "to be collected",
      icon: Clock,
      bg: "bg-orange-50",
      iconColor: "text-orange-600",
      accent: "bg-orange-500",
    },
    {
      label: "Low Stock Alerts",
      value: prodLoading ? "—" : `${lowStockCount} items`,
      change: prodLoading ? "…" : lowStockCount > 0 ? "Critical" : "All good",
      up: lowStockCount === 0,
      sub: "need restocking",
      icon: AlertTriangle,
      bg: "bg-red-50",
      iconColor: "text-red-600",
      accent: "bg-red-500",
    },
    {
      label: "Total Customers",
      value: custLoading ? "—" : dbCustomers.length.toLocaleString("en-IN"),
      change: custLoading ? "…" : "Registered",
      up: dbCustomers.length > 0,
      sub: "in your account",
      icon: Users,
      bg: "bg-violet-50",
      iconColor: "text-violet-600",
      accent: "bg-violet-500",
    },
    {
      label: "Total Products",
      value: prodLoading ? "—" : String(dbProducts.length),
      change: prodLoading ? "…" : "Active",
      up: dbProducts.length > 0,
      sub: "in inventory",
      icon: Package,
      bg: "bg-cyan-50",
      iconColor: "text-cyan-600",
      accent: "bg-cyan-500",
    },
    {
      label: "Monthly Profit",
      value: "₹41,220",
      change: "+9%",
      up: true,
      sub: "vs last month",
      icon: TrendingUp,
      bg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      accent: "bg-indigo-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <StatCard key={card.label} card={card} index={i} />
      ))}
    </div>
  );
}

// Custom tooltip for charts
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
      <p className="mb-1.5 text-xs font-semibold text-slate-500">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-bold text-foreground">{fmt(p.value)} <span className="text-xs font-normal text-muted-foreground">{p.name}</span></p>
      ))}
    </div>
  );
}

// ── Inventory Overview (real-data) ────────────────────────────────

function InventoryOverview({ businessId }: { businessId: string | null }) {
  const { data: dbProducts = [], isLoading: productsLoading } = useProducts(businessId);
  const { data: allMovements = [], isLoading: movementsLoading } = useInventoryMovements(businessId);

  const products = dbProducts.map(dbToProduct);
  const outOfStock = products.filter((p) => getStockStatus(p) === "out-of-stock").length;
  const lowStock   = products.filter((p) => {
    const s = getStockStatus(p);
    return s === "low-stock" || s === "critical";
  }).length;
  const totalAlerts = outOfStock + lowStock;
  const inventoryValue = products.reduce(
    (sum, p) => sum + p.currentStock * p.purchasePrice,
    0
  );
  const recentMovements = allMovements.slice(0, 6);

  function movementIcon(type: string) {
    if (type === "in")         return <PackageOpen className="h-3.5 w-3.5 text-emerald-600" />;
    if (type === "out")        return <PackageMinus className="h-3.5 w-3.5 text-red-500" />;
    return <SlidersHorizontal className="h-3.5 w-3.5 text-violet-500" />;
  }
  function movementBg(type: string) {
    if (type === "in")  return "bg-emerald-50";
    if (type === "out") return "bg-red-50";
    return "bg-violet-50";
  }
  function movementQty(m: typeof allMovements[0]) {
    if (m.movement_type === "in") return `+${m.quantity}`;
    if (m.movement_type === "out") return `-${m.quantity}`;
    return m.adjustment_type === "increase" ? `+${m.quantity}` : `-${m.quantity}`;
  }
  function movementQtyColor(m: (typeof allMovements)[0]) {
    if (m.movement_type === "in") return "text-emerald-700";
    if (m.movement_type === "out") return "text-red-600";
    return m.adjustment_type === "increase" ? "text-emerald-700" : "text-red-600";
  }
  function productName(productId: string) {
    const p = dbProducts.find((p) => p.id === productId);
    return p?.name ?? productId.slice(0, 8) + "…";
  }

  const tiles = [
    {
      label: "Total Products",
      value: productsLoading ? "—" : String(products.length),
      icon: Package,
      bg: "bg-cyan-50",
      iconColor: "text-cyan-600",
      accent: "text-cyan-700",
    },
    {
      label: "Inventory Value",
      value: productsLoading ? "—" : fmtINR(inventoryValue),
      icon: IndianRupee,
      bg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      accent: "text-indigo-700",
    },
    {
      label: "Low Stock Alerts",
      value: productsLoading ? "—" : `${lowStock} items`,
      icon: AlertTriangle,
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
      accent: "text-amber-700",
      urgent: lowStock > 0,
    },
    {
      label: "Out of Stock",
      value: productsLoading ? "—" : `${outOfStock} items`,
      icon: XCircle,
      bg: "bg-red-50",
      iconColor: "text-red-600",
      accent: "text-red-700",
      urgent: outOfStock > 0,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-600" />
          <h3 className="text-sm font-semibold text-foreground">Inventory Overview</h3>
          {totalAlerts > 0 && !productsLoading && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
              {totalAlerts} alert{totalAlerts > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <Link
          to="/inventory"
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          View Inventory <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
        {/* Left: Tiles */}
        <div className="grid grid-cols-2 gap-4 p-6 border-b border-slate-100 lg:border-b-0 lg:border-r">
          {tiles.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i, duration: 0.3 }}
                className={`flex items-center gap-3 rounded-xl ${t.bg} p-4 ${t.urgent ? "ring-1 ring-red-200" : ""}`}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/70`}>
                  <Icon className={`h-4 w-4 ${t.iconColor}`} />
                </div>
                <div className="min-w-0">
                  {productsLoading ? (
                    <div className="h-5 w-16 animate-pulse rounded bg-current/20 mb-1" />
                  ) : (
                    <p className={`text-base font-bold leading-tight ${t.accent}`}>{t.value}</p>
                  )}
                  <p className="text-xs text-muted-foreground leading-tight truncate">{t.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
        {/* Right: Recent stock activity */}
        <div className="p-6">
          <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Recent Stock Activity
          </p>
          {movementsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-9 rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : recentMovements.length === 0 ? (
            <p className="text-xs text-muted-foreground">No stock movements yet.</p>
          ) : (
            <div className="space-y-2">
              {recentMovements.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2.5"
                >
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${movementBg(m.movement_type)}`}>
                    {movementIcon(m.movement_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {productName(m.product_id)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {m.reference && `${m.reference} · `}
                      {fmtMovementDate(m.created_at)} · {fmtMovementTime(m.created_at)}
                    </p>
                  </div>
                  <span className={`shrink-0 text-xs font-bold tabular-nums ${movementQtyColor(m)}`}>
                    {movementQty(m)}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────

type StatCardData = {
  label: string;
  value: string;
  change: string;
  up: boolean;
  sub: string;
  icon: React.ElementType;
  bg: string;
  iconColor: string;
  accent: string;
};

function StatCard({ card, index }: { card: StatCardData; index: number }) {
  const Icon = card.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.bg}`}>
          <Icon className={`h-5 w-5 ${card.iconColor}`} />
        </div>
        <span className={`flex items-center gap-0.5 text-xs font-semibold ${card.up ? "text-emerald-600" : "text-slate-500"}`}>
          {card.up ? <ArrowUpRight className="h-3.5 w-3.5" /> : null}
          {card.change}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold tracking-tight text-foreground">{card.value}</p>
        <p className="mt-1 text-sm font-medium text-foreground">{card.label}</p>
        <p className="text-xs text-muted-foreground">{card.sub}</p>
      </div>
      {/* Accent strip */}
      <div className={`absolute bottom-0 left-0 h-0.5 w-full ${card.accent} opacity-0 transition-opacity group-hover:opacity-100`} />
    </motion.div>
  );
}

function SectionCard({ title, subtitle, action, children, className = "" }: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────

function DashboardPage() {
  const { business } = useBusiness();
  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";
  const ownerFirst = business?.owner_name?.split(" ")[0] || "there";

  return (
    <div className="min-h-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px] space-y-7">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">{greeting}, {ownerFirst} 👋</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {now.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              {business?.business_name && <> · <span className="font-medium text-foreground">{business.business_name}</span></>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live · {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </motion.div>

        {/* AI Insight Banner */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="flex items-center gap-4 rounded-2xl border border-[color:var(--brand-electric)]/20 bg-[image:var(--gradient-brand)] px-6 py-4 text-white shadow-[0_4px_24px_-8px_oklch(0.62_0.22_258/0.4)]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">Nexora AI Insight</p>
            <p className="mt-0.5 text-sm text-white/80 truncate">
              Your Tuesday sales are 34% above average. Consider restocking <strong className="text-white">Tata Salt</strong> and <strong className="text-white">Amul Butter</strong> before next week.
            </p>
          </div>
          <Link to="/ai-assistant" className="hidden shrink-0 items-center gap-1.5 rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/30 transition-colors sm:flex">
            Ask AI <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Stat Cards — live data from DB */}
        <LiveStatCards businessId={business?.id ?? null} />

        {/* Inventory Overview — real data */}
        <InventoryOverview businessId={business?.id ?? null} />

        {/* Row 2: Revenue Chart + Business Health */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* Revenue Overview */}
          <SectionCard
            title="Revenue Overview"
            subtitle="Last 13 days · INR"
            className="xl:col-span-2"
            action={
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" />Revenue</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-300" />Target</span>
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.08} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="target" name="Target" stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="4 4" fill="url(#colorTarget)" dot={false} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#colorRevenue)" dot={false} activeDot={{ r: 5, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }} />
              </AreaChart>
            </ResponsiveContainer>
          </SectionCard>

          {/* Business Health */}
          <SectionCard title="Business Health" subtitle="Score: 72 / 100">
            {/* Score ring */}
            <div className="flex justify-center mb-5">
              <div className="relative flex h-28 w-28 items-center justify-center">
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="url(#healthGrad)" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${(72 / 100) * 264} 264`} />
                  <defs>
                    <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">72</p>
                  <p className="text-[10px] font-medium text-muted-foreground">/ 100</p>
                </div>
              </div>
            </div>

            <div className="space-y-3.5">
              {healthMetrics.map((m) => (
                <div key={m.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-foreground">{m.label}</span>
                    <span className={`text-xs font-bold ${m.color}`}>{m.value}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${m.score}%` }}
                      transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                      className={`h-1.5 rounded-full ${m.bar}`}
                    />
                  </div>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{m.sub}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Row 3: Sales Trend + Top Products + Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Sales Trend */}
          <SectionCard title="Sales Trend" subtitle="This week · units sold">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={salesData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(241,245,249,0.6)", radius: 6 }}
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                        <p className="mb-1 text-xs font-semibold text-slate-500">{label}</p>
                        {payload.map((p: { value: number; name: string }, i: number) => (
                          <p key={i} className="text-sm font-bold text-foreground">{p.value} <span className="text-xs font-normal text-muted-foreground">{p.name}</span></p>
                        ))}
                      </div>
                    );
                  }}
                />
                <Bar dataKey="sales" name="Sales" fill="#3b82f6" radius={[5, 5, 0, 0]} maxBarSize={36} />
                <Bar dataKey="returns" name="Returns" fill="#fca5a5" radius={[5, 5, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>

          {/* Top Products */}
          <SectionCard title="Top Products" subtitle="By sales value · INR">
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="w-4 text-xs font-bold text-muted-foreground shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="truncate text-xs font-medium text-foreground">{p.name}</span>
                      <span className="ml-2 shrink-0 text-xs font-bold text-foreground">₹{p.sales.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(p.sales / topProducts[0].sales) * 100}%` }}
                        transition={{ duration: 0.7, delay: 0.1 * i, ease: "easeOut" }}
                        className="h-1.5 rounded-full"
                        style={{ backgroundColor: p.color }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mini pie */}
            <div className="mt-5 flex justify-center">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie data={topProducts} dataKey="sales" cx="50%" cy="50%" innerRadius={32} outerRadius={52} paddingAngle={2}>
                    {topProducts.map((p, i) => (
                      <Cell key={i} fill={p.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          {/* Recent Activity */}
          <SectionCard title="Recent Activity" subtitle="Live feed">
            <div className="space-y-4">
              {activityFeed.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                  className="flex items-start gap-3"
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm ${item.color}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.sub}</p>
                  </div>
                  <span className="shrink-0 text-[10px] text-muted-foreground">{item.time}</span>
                </motion.div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-xl border border-slate-200 py-2 text-xs font-medium text-muted-foreground hover:bg-slate-50 hover:text-foreground transition-colors">
              View all activity
            </button>
          </SectionCard>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-5 flex items-center gap-2">
            <Zap className="h-4 w-4 text-[color:var(--brand-electric)]" />
            <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  to={action.to}
                  className={`group flex flex-col items-center gap-2.5 rounded-2xl p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-md ${action.color} text-white`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold leading-snug">{action.label}</p>
                    <p className="text-[10px] text-white/70">{action.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
