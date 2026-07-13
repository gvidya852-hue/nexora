// ── Inventory Overview Tab ────────────────────────────────────────
import { motion } from "framer-motion";
import {
  Package,
  IndianRupee,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShoppingCart,
  Users,
  Activity,
  Plus,
  PackagePlus,
  ArrowDownToLine,
  SlidersHorizontal,
  BarChart3,
  ArrowUpFromLine,
  Wrench,
  Zap,
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
  Legend,
} from "recharts";
import {
  categories,
  products,
  purchaseOrders,
  suppliers,
  stockMovements,
  getProduct,
  getStockStatus,
  stockValue,
  totalStockValue,
  fmtINR,
} from "@/lib/inventory-data";
import {
  SectionCard,
  StatTile,
  fmtDate,
} from "@/components/inventory/shared";

// ── Color map for category colors ──────────────────────────────────
const tailwindToHex: Record<string, string> = {
  "bg-blue-500": "#3b82f6",
  "bg-violet-500": "#8b5cf6",
  "bg-emerald-500": "#10b981",
  "bg-amber-500": "#f59e0b",
  "bg-red-500": "#ef4444",
  "bg-cyan-500": "#06b6d4",
  "bg-orange-500": "#f97316",
  "bg-pink-500": "#ec4899",
};

// ── Derived stats ──────────────────────────────────────────────────
const totalProducts = products.length;
const itemsInStock = products.filter((p) => p.currentStock > 0).length;
const outOfStock = products.filter((p) => p.currentStock <= 0).length;
const lowStockItems = products.filter((p) => {
  const s = getStockStatus(p);
  return s === "low-stock";
}).length;
const pendingPOs = purchaseOrders.filter((po) => po.status === "pending").length;
const supplierCount = suppliers.length;

// Today's stock movements = movements with the most recent date in the data
const allDates = [...new Set(stockMovements.map((m) => m.date))].sort();
const mostRecentDate = allDates[allDates.length - 1] ?? "";
const todayMovements = stockMovements.filter((m) => m.date === mostRecentDate).length;

// ── Stock Movement Chart Data (last 7 distinct dates) ──────────────
const last7Dates = allDates.slice(-7);
const movementChartData = last7Dates.map((date) => {
  const dayMovements = stockMovements.filter((m) => m.date === date);
  const inQty = dayMovements.filter((m) => m.type === "in").reduce((s, m) => s + m.quantity, 0);
  const outQty = dayMovements.filter((m) => m.type === "out").reduce((s, m) => s + m.quantity, 0);
  const adjQty = dayMovements.filter((m) => m.type === "adjustment").reduce((s, m) => s + m.quantity, 0);
  const label = new Date(date + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  return { date: label, In: inQty, Out: outQty, Adj: adjQty };
});

// ── Inventory Value by Category (pie chart) ────────────────────────
const categoryValueMap: Record<string, number> = {};
products.forEach((p) => {
  categoryValueMap[p.categoryId] = (categoryValueMap[p.categoryId] ?? 0) + stockValue(p);
});
const pieData = categories
  .filter((c) => (categoryValueMap[c.id] ?? 0) > 0)
  .map((c) => ({
    name: c.name.split(" ")[0], // short name for pie label
    fullName: c.name,
    value: categoryValueMap[c.id] ?? 0,
    color: tailwindToHex[c.color] ?? "#94a3b8",
  }));

// ── Category Distribution (product count) ─────────────────────────
const categoryDist = categories
  .map((c) => ({
    name: c.name,
    count: products.filter((p) => p.categoryId === c.id).length,
    color: tailwindToHex[c.color] ?? "#94a3b8",
  }))
  .filter((c) => c.count > 0)
  .sort((a, b) => b.count - a.count);
const maxCatCount = categoryDist[0]?.count ?? 1;

// ── Top Selling (out movements) ────────────────────────────────────
const outByProduct: Record<string, number> = {};
stockMovements
  .filter((m) => m.type === "out")
  .forEach((m) => {
    outByProduct[m.productId] = (outByProduct[m.productId] ?? 0) + m.quantity;
  });
const topSelling = Object.entries(outByProduct)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .map(([pid, qty]) => ({ product: getProduct(pid), qty }))
  .filter((x) => x.product != null) as { product: NonNullable<ReturnType<typeof getProduct>>; qty: number }[];

// ── Most Purchased (in movements) ─────────────────────────────────
const inByProduct: Record<string, number> = {};
stockMovements
  .filter((m) => m.type === "in")
  .forEach((m) => {
    inByProduct[m.productId] = (inByProduct[m.productId] ?? 0) + m.quantity;
  });
const mostPurchased = Object.entries(inByProduct)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .map(([pid, qty]) => ({ product: getProduct(pid), qty }))
  .filter((x) => x.product != null) as { product: NonNullable<ReturnType<typeof getProduct>>; qty: number }[];

// ── Recent Activity (last 8 movements) ────────────────────────────
const recentMovements = [...stockMovements]
  .sort((a, b) => {
    const da = new Date(`${a.date}T00:00:00`).getTime();
    const db = new Date(`${b.date}T00:00:00`).getTime();
    return db !== da ? db - da : a.time > b.time ? -1 : 1;
  })
  .slice(0, 8);

// ── Quick Actions data ─────────────────────────────────────────────
const quickActions = [
  { label: "Add Product", icon: PackagePlus, color: "bg-blue-600 hover:bg-blue-700", desc: "Add to inventory", tabId: "products" },
  { label: "Create Purchase Order", icon: ShoppingCart, color: "bg-violet-600 hover:bg-violet-700", desc: "Order from supplier", tabId: "purchase-orders" },
  { label: "Receive Stock", icon: ArrowDownToLine, color: "bg-emerald-600 hover:bg-emerald-700", desc: "Record GRN / stock-in", tabId: "stock-in" },
  { label: "Adjust Stock", icon: SlidersHorizontal, color: "bg-amber-600 hover:bg-amber-700", desc: "Correct stock levels", tabId: "stock-adjustments" },
  { label: "View Reports", icon: BarChart3, color: "bg-[image:var(--gradient-brand)]", desc: "Business insights", tabId: "reports" },
];

// ── Custom Tooltip ─────────────────────────────────────────────────
function ChartTip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
      <p className="mb-1.5 text-xs font-semibold text-slate-500">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-bold text-foreground">
          {p.value} <span className="text-xs font-normal text-muted-foreground">{p.name}</span>
        </p>
      ))}
    </div>
  );
}

function PieTip({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: { fullName: string } }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
      <p className="text-xs font-semibold text-foreground">{p.payload.fullName}</p>
      <p className="mt-0.5 text-sm font-bold text-foreground">{fmtINR(p.value)}</p>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────
export function OverviewTab({ onNavigate }: { onNavigate?: (tabId: string) => void }) {
  const statTiles = [
    { label: "Total Products", value: String(totalProducts), icon: Package, bg: "bg-blue-50", iconColor: "text-blue-600" },
    { label: "Total Stock Value", value: fmtINR(totalStockValue()), icon: IndianRupee, bg: "bg-emerald-50", iconColor: "text-emerald-600" },
    { label: "Items In Stock", value: String(itemsInStock), icon: CheckCircle2, bg: "bg-cyan-50", iconColor: "text-cyan-600" },
    { label: "Out of Stock", value: String(outOfStock), icon: XCircle, bg: "bg-red-50", iconColor: "text-red-600" },
    { label: "Low Stock Items", value: String(lowStockItems), icon: AlertTriangle, bg: "bg-amber-50", iconColor: "text-amber-600" },
    { label: "POs Pending", value: String(pendingPOs), icon: ShoppingCart, bg: "bg-violet-50", iconColor: "text-violet-600" },
    { label: "Suppliers", value: String(supplierCount), icon: Users, bg: "bg-orange-50", iconColor: "text-orange-600" },
    { label: "Today's Movements", value: String(todayMovements), sub: mostRecentDate ? fmtDate(mostRecentDate) : "", icon: Activity, bg: "bg-pink-50", iconColor: "text-pink-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Tiles */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {statTiles.map((tile, i) => (
          <div key={tile.label} className="lg:col-span-1 sm:col-span-2">
            <StatTile
              label={tile.label}
              value={tile.value}
              sub={tile.sub}
              icon={tile.icon}
              bg={tile.bg}
              iconColor={tile.iconColor}
              index={i}
            />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Stock Movement Bar Chart */}
        <SectionCard
          title="Stock Movement"
          subtitle="Last 7 active days · quantity"
          action={
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" />In</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-400" />Out</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-400" />Adj</span>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={movementChartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "rgba(241,245,249,0.6)", radius: 6 }} content={<ChartTip />} />
              <Bar dataKey="In" name="In" fill="#10b981" radius={[5, 5, 0, 0]} maxBarSize={28} />
              <Bar dataKey="Out" name="Out" fill="#f87171" radius={[5, 5, 0, 0]} maxBarSize={28} />
              <Bar dataKey="Adj" name="Adj" fill="#c4b5fd" radius={[5, 5, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Inventory Value Pie Chart */}
        <SectionCard title="Inventory Value by Category" subtitle="By purchase cost · INR">
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
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="flex-1 truncate text-xs text-foreground">{d.fullName}</span>
                  <span className="shrink-0 text-xs font-semibold text-foreground">{fmtINR(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Category Distribution + Top Lists */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Category Distribution */}
        <SectionCard title="Category Distribution" subtitle="Products per category">
          <div className="space-y-3">
            {categoryDist.map((cat, i) => (
              <div key={cat.name} className="flex items-center gap-3">
                <span className="w-4 text-xs font-bold text-muted-foreground shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="truncate text-xs font-medium text-foreground">{cat.name}</span>
                    <span className="ml-2 shrink-0 text-xs font-bold text-foreground">{cat.count}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(cat.count / maxCatCount) * 100}%` }}
                      transition={{ duration: 0.7, delay: 0.08 * i, ease: "easeOut" }}
                      className="h-1.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Top Selling */}
        <SectionCard title="Top Selling Products" subtitle="By stock-out quantity">
          <div className="space-y-3">
            {topSelling.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">No outbound movements yet</p>
            )}
            {topSelling.map((item, i) => (
              <div key={item.product.id} className="flex items-center gap-3">
                <span className="w-4 text-xs font-bold text-muted-foreground shrink-0">{i + 1}</span>
                <span className="text-base">{item.product.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="truncate text-xs font-medium text-foreground">{item.product.name}</span>
                    <span className="ml-2 shrink-0 text-xs font-bold text-red-600">{item.qty} out</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.qty / (topSelling[0]?.qty ?? 1)) * 100}%` }}
                      transition={{ duration: 0.7, delay: 0.08 * i, ease: "easeOut" }}
                      className="h-1.5 rounded-full bg-red-400"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Most Purchased */}
        <SectionCard title="Most Purchased Products" subtitle="By stock-in quantity">
          <div className="space-y-3">
            {mostPurchased.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">No inbound movements yet</p>
            )}
            {mostPurchased.map((item, i) => (
              <div key={item.product.id} className="flex items-center gap-3">
                <span className="w-4 text-xs font-bold text-muted-foreground shrink-0">{i + 1}</span>
                <span className="text-base">{item.product.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="truncate text-xs font-medium text-foreground">{item.product.name}</span>
                    <span className="ml-2 shrink-0 text-xs font-bold text-emerald-600">{item.qty} in</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.qty / (mostPurchased[0]?.qty ?? 1)) * 100}%` }}
                      transition={{ duration: 0.7, delay: 0.08 * i, ease: "easeOut" }}
                      className="h-1.5 rounded-full bg-emerald-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Recent Activity + Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Inventory Activity Timeline */}
        <SectionCard title="Recent Inventory Activity" subtitle="Latest stock movements">
          <div className="space-y-4">
            {recentMovements.map((mv, i) => {
              const prod = getProduct(mv.productId);
              const isIn = mv.type === "in";
              const isOut = mv.type === "out";
              const iconEl = isIn
                ? <Package className="h-4 w-4" />
                : isOut
                ? <ArrowUpFromLine className="h-4 w-4" />
                : <Wrench className="h-4 w-4" />;
              const iconBg = isIn
                ? "bg-emerald-50 text-emerald-600"
                : isOut
                ? "bg-red-50 text-red-600"
                : "bg-violet-50 text-violet-600";
              return (
                <motion.div
                  key={mv.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.3 }}
                  className="flex items-start gap-3"
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
                    {iconEl}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground">
                      {prod?.emoji} {prod?.name ?? mv.productId}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {mv.referenceNumber} · {mv.quantity} {mv.type === "adjustment" ? `(${mv.adjustmentType ?? "adj"})` : mv.type}
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] text-muted-foreground whitespace-nowrap">
                    {fmtDate(mv.date)} {mv.time}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </SectionCard>

        {/* Quick Actions */}
        <SectionCard title="Quick Actions" subtitle="Jump to common tasks" action={<Zap className="h-4 w-4 text-[color:var(--brand-electric)]" />}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => onNavigate ? onNavigate(action.tabId) : console.log("navigate:", action.tabId)}
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
