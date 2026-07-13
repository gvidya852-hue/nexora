// ── Reports Tab ───────────────────────────────────────────────────
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart2,
  TrendingUp,
  Users,
  Receipt,
  Download,
  FileText,
  Printer,
  Star,
  AlertTriangle,
  CheckCircle2,
  Clock,
  IndianRupee,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  invoices,
  payments,
  customers,
  quotations,
  invoiceGrandTotal,
  computeDocumentTotals,
  getCustomer,
  fmtINR,
  fmtDate,
  computeLineItem,
  getInvoiceProduct,
} from "@/lib/billing-data";
import {
  SectionCard,
  StatTile,
  SecondaryButton,
  EmptyState,
} from "@/components/billing/shared";
import { BillingStatusPill } from "@/components/billing/shared";

type ReportTab =
  | "invoice-analytics"
  | "payment-analytics"
  | "customer-sales"
  | "gst-summary"
  | "top-products"
  | "monthly-revenue"
  | "outstanding"
  | "collection";

const REPORT_TABS: { id: ReportTab; label: string; icon: React.ElementType }[] = [
  { id: "invoice-analytics", label: "Invoice Analytics", icon: BarChart2 },
  { id: "payment-analytics", label: "Payment Analytics", icon: IndianRupee },
  { id: "customer-sales", label: "Customer Sales", icon: Users },
  { id: "gst-summary", label: "GST Summary", icon: Receipt },
  { id: "top-products", label: "Top Products", icon: TrendingUp },
  { id: "monthly-revenue", label: "Monthly Revenue", icon: TrendingUp },
  { id: "outstanding", label: "Outstanding", icon: AlertTriangle },
  { id: "collection", label: "Collection", icon: CheckCircle2 },
];

const CHART_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

// ── Export Bar ─────────────────────────────────────────────────────
function ExportBar({ reportName }: { reportName: string }) {
  const handleExportCSV = () => {
    const csvContent = `Report,${reportName}\nGenerated,${new Date().toLocaleDateString("en-IN")}\nData,Mock export placeholder`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportName.toLowerCase().replace(/\s+/g, "-")}-report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="mr-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Export:</span>
      <button
        onClick={() => alert("Export to PDF would generate the report. UI placeholder only.")}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <FileText className="h-3.5 w-3.5" /> PDF
      </button>
      <button
        onClick={() => alert("Export to Excel would generate the report. UI placeholder only.")}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <Download className="h-3.5 w-3.5" /> Excel
      </button>
      <button
        onClick={handleExportCSV}
        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
      >
        <Download className="h-3.5 w-3.5" /> CSV
      </button>
      <button
        onClick={() => alert("Export to JSON would generate the report. UI placeholder only.")}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <Download className="h-3.5 w-3.5" /> JSON
      </button>
      <button
        onClick={() => alert("Print would generate the report. UI placeholder only.")}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <Printer className="h-3.5 w-3.5" /> Print
      </button>
    </div>
  );
}

// ── Table helpers ──────────────────────────────────────────────────
function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th className={`px-4 py-3 text-xs font-semibold text-muted-foreground ${right ? "text-right" : "text-left"}`}>
      {children}
    </th>
  );
}
function Td({ children, right, className = "" }: { children: React.ReactNode; right?: boolean; className?: string }) {
  return (
    <td className={`px-4 py-3 text-sm ${right ? "text-right font-semibold" : ""} ${className}`}>
      {children}
    </td>
  );
}

// ── 1. Invoice Analytics ───────────────────────────────────────────
function InvoiceAnalyticsReport() {
  const totalInvoiced = useMemo(() => invoices.reduce((s, inv) => s + invoiceGrandTotal(inv), 0), []);
  const totalCollected = useMemo(() => invoices.reduce((s, inv) => s + inv.amountPaid, 0), []);
  const totalOutstanding = totalInvoiced - totalCollected;
  const collectionRate = totalInvoiced > 0 ? ((totalCollected / totalInvoiced) * 100).toFixed(1) : "0";

  const statusGroups = useMemo(() => {
    const groups: Record<string, number> = {};
    for (const inv of invoices) {
      groups[inv.status] = (groups[inv.status] ?? 0) + invoiceGrandTotal(inv);
    }
    return Object.entries(groups).map(([status, amount]) => ({ status, amount }));
  }, []);

  const top10 = useMemo(
    () => [...invoices].sort((a, b) => invoiceGrandTotal(b) - invoiceGrandTotal(a)).slice(0, 10),
    []
  );

  return (
    <div className="space-y-6">
      <ExportBar reportName="Invoice Analytics" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Total Invoiced" value={fmtINR(totalInvoiced)} icon={Receipt} bg="bg-blue-50" iconColor="text-blue-600" index={0} />
        <StatTile label="Collected" value={fmtINR(totalCollected)} icon={CheckCircle2} bg="bg-emerald-50" iconColor="text-emerald-600" index={1} />
        <StatTile label="Outstanding" value={fmtINR(totalOutstanding)} icon={Clock} bg="bg-amber-50" iconColor="text-amber-600" index={2} />
        <StatTile label="Collection Rate" value={`${collectionRate}%`} icon={TrendingUp} bg="bg-violet-50" iconColor="text-violet-600" index={3} />
      </div>
      <SectionCard title="Invoice Amounts by Status">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={statusGroups} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="status" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => fmtINR(v)} />
            <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>
      <SectionCard title="Top 10 Invoices by Amount" noPadding>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <Th>Invoice #</Th>
                <Th>Customer</Th>
                <Th>Date</Th>
                <Th right>Amount</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {top10.map((inv, i) => {
                const cust = getCustomer(inv.customerId);
                return (
                  <motion.tr
                    key={inv.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-slate-100 hover:bg-slate-50/60"
                  >
                    <Td><span className="font-mono font-medium text-foreground">{inv.invoiceNumber}</span></Td>
                    <Td>{cust?.name ?? inv.customerId}</Td>
                    <Td>{fmtDate(inv.createdDate)}</Td>
                    <Td right>{fmtINR(invoiceGrandTotal(inv))}</Td>
                    <Td><BillingStatusPill status={inv.status} /></Td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

// ── 2. Payment Analytics ───────────────────────────────────────────
function PaymentAnalyticsReport() {
  const totalReceived = payments.filter((p) => p.status === "received").reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);
  const totalRefunded = payments.filter((p) => p.status === "refunded").reduce((s, p) => s + p.amount, 0);

  const dailyData = [
    { day: "Jul 7", amount: 0 },
    { day: "Jul 8", amount: 40000 },
    { day: "Jul 9", amount: 38937 },
    { day: "Jul 10", amount: 30000 },
    { day: "Jul 11", amount: 8121 },
    { day: "Jul 12", amount: 40499 },
    { day: "Jul 13", amount: 3990 },
  ];

  const modeBreakdown = useMemo(() => {
    const groups: Record<string, number> = {};
    const received = payments.filter((p) => p.status === "received");
    for (const p of received) {
      groups[p.mode] = (groups[p.mode] ?? 0) + p.amount;
    }
    const total = Object.values(groups).reduce((s, v) => s + v, 0);
    return Object.entries(groups)
      .map(([mode, amount]) => ({ mode, amount, pct: total > 0 ? ((amount / total) * 100).toFixed(1) : "0" }))
      .sort((a, b) => b.amount - a.amount);
  }, []);

  return (
    <div className="space-y-6">
      <ExportBar reportName="Payment Analytics" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Total Received" value={fmtINR(totalReceived)} icon={CheckCircle2} bg="bg-emerald-50" iconColor="text-emerald-600" index={0} />
        <StatTile label="Total Pending" value={fmtINR(totalPending)} icon={Clock} bg="bg-amber-50" iconColor="text-amber-600" index={1} />
        <StatTile label="Total Refunded" value={fmtINR(totalRefunded)} icon={IndianRupee} bg="bg-cyan-50" iconColor="text-cyan-600" index={2} />
        <StatTile label="Avg Payment Time" value="8.4 days" icon={TrendingUp} bg="bg-blue-50" iconColor="text-blue-600" index={3} />
      </div>
      <SectionCard title="Daily Payments — Last 7 Days">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={dailyData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => fmtINR(v)} />
            <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>
      <SectionCard title="Payment Mode Breakdown">
        <div className="space-y-3">
          {modeBreakdown.map((m, i) => (
            <div key={m.mode} className="flex items-center gap-4">
              <div className="w-28 text-sm font-medium capitalize text-foreground">{m.mode.replace(/-/g, " ")}</div>
              <div className="flex-1 rounded-full bg-slate-100 h-2.5">
                <div
                  className="h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${m.pct}%`, background: CHART_COLORS[i % CHART_COLORS.length] }}
                />
              </div>
              <div className="w-24 text-right text-sm font-semibold text-foreground">{fmtINR(m.amount)}</div>
              <div className="w-12 text-right text-xs text-muted-foreground">{m.pct}%</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// ── 3. Customer Sales Report ───────────────────────────────────────
function CustomerSalesReport() {
  const customerStats = useMemo(() => {
    return customers
      .map((cust) => {
        const custInvoices = invoices.filter((inv) => inv.customerId === cust.id);
        const totalAmount = custInvoices.reduce((s, inv) => s + invoiceGrandTotal(inv), 0);
        const paidAmount = custInvoices.reduce((s, inv) => s + inv.amountPaid, 0);
        return {
          ...cust,
          invoiceCount: custInvoices.length,
          totalAmount,
          paidAmount,
          outstanding: totalAmount - paidAmount,
        };
      })
      .sort((a, b) => b.totalAmount - a.totalAmount);
  }, []);

  const activeCustomers = customerStats.filter((c) => c.invoiceCount > 0).length;
  const avgOrderValue =
    customerStats.length > 0
      ? customerStats.reduce((s, c) => s + c.totalAmount, 0) / customerStats.length
      : 0;

  return (
    <div className="space-y-6">
      <ExportBar reportName="Customer Sales" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatTile label="Total Customers" value={String(customers.length)} icon={Users} bg="bg-blue-50" iconColor="text-blue-600" index={0} />
        <StatTile label="Active Customers" value={String(activeCustomers)} icon={CheckCircle2} bg="bg-emerald-50" iconColor="text-emerald-600" index={1} />
        <StatTile label="Avg Order Value" value={fmtINR(avgOrderValue)} icon={IndianRupee} bg="bg-violet-50" iconColor="text-violet-600" index={2} />
      </div>
      <SectionCard title="Customer Sales Breakdown" noPadding>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <Th>Customer</Th>
                <Th>City</Th>
                <Th right>Invoices</Th>
                <Th right>Total Amount</Th>
                <Th right>Paid</Th>
                <Th right>Outstanding</Th>
                <Th>Rating</Th>
              </tr>
            </thead>
            <tbody>
              {customerStats.map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-slate-100 hover:bg-slate-50/60"
                >
                  <Td>
                    <p className="font-medium text-foreground whitespace-nowrap">{c.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{c.customerType}</p>
                  </Td>
                  <Td>{c.city}</Td>
                  <Td right>{c.invoiceCount}</Td>
                  <Td right>{fmtINR(c.totalAmount)}</Td>
                  <Td right className="text-emerald-700">{fmtINR(c.paidAmount)}</Td>
                  <Td right className={c.outstanding > 0 ? "text-amber-700" : "text-slate-400"}>{fmtINR(c.outstanding)}</Td>
                  <Td>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star key={si} className={`h-3.5 w-3.5 ${si < c.customerRating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                      ))}
                    </div>
                  </Td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

// ── 4. GST Summary ─────────────────────────────────────────────────
function GSTSummaryReport() {
  const gstData = useMemo(() => {
    return invoices
      .filter((inv) => inv.status !== "cancelled")
      .map((inv) => {
        const totals = computeDocumentTotals(inv.items, inv.isInterState);
        const cust = getCustomer(inv.customerId);
        return {
          invoiceNumber: inv.invoiceNumber,
          customer: cust?.name ?? inv.customerId,
          taxableValue: totals.taxableValue,
          cgst: totals.cgst,
          sgst: totals.sgst,
          igst: totals.igst,
          totalGst: totals.cgst + totals.sgst + totals.igst,
          grandTotal: totals.grandTotal,
          isInterState: inv.isInterState,
        };
      });
  }, []);

  const totalTaxable = gstData.reduce((s, r) => s + r.taxableValue, 0);
  const totalIGST = gstData.reduce((s, r) => s + r.igst, 0);
  const totalCGST = gstData.reduce((s, r) => s + r.cgst, 0);
  const totalSGST = gstData.reduce((s, r) => s + r.sgst, 0);

  const interState = gstData.filter((r) => r.isInterState);
  const intraState = gstData.filter((r) => !r.isInterState);

  const GSTTable = ({ rows, title }: { rows: typeof gstData; title: string }) => (
    <SectionCard title={title} noPadding>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <Th>Invoice #</Th>
              <Th>Customer</Th>
              <Th right>Taxable</Th>
              <Th right>CGST</Th>
              <Th right>SGST</Th>
              <Th right>IGST</Th>
              <Th right>Total GST</Th>
              <Th right>Grand Total</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <motion.tr
                key={r.invoiceNumber}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="border-b border-slate-100 hover:bg-slate-50/60"
              >
                <Td><span className="font-mono text-xs font-medium">{r.invoiceNumber}</span></Td>
                <Td>{r.customer}</Td>
                <Td right>{fmtINR(r.taxableValue)}</Td>
                <Td right>{r.cgst > 0 ? fmtINR(r.cgst) : "—"}</Td>
                <Td right>{r.sgst > 0 ? fmtINR(r.sgst) : "—"}</Td>
                <Td right>{r.igst > 0 ? fmtINR(r.igst) : "—"}</Td>
                <Td right className="text-violet-700">{fmtINR(r.totalGst)}</Td>
                <Td right className="text-foreground font-bold">{fmtINR(r.grandTotal)}</Td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );

  return (
    <div className="space-y-6">
      <ExportBar reportName="GST Summary" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Total Taxable" value={fmtINR(totalTaxable)} icon={Receipt} bg="bg-blue-50" iconColor="text-blue-600" index={0} />
        <StatTile label="Total IGST" value={fmtINR(totalIGST)} icon={IndianRupee} bg="bg-violet-50" iconColor="text-violet-600" index={1} />
        <StatTile label="Total CGST" value={fmtINR(totalCGST)} icon={IndianRupee} bg="bg-emerald-50" iconColor="text-emerald-600" index={2} />
        <StatTile label="Total SGST" value={fmtINR(totalSGST)} icon={IndianRupee} bg="bg-amber-50" iconColor="text-amber-600" index={3} />
      </div>
      <GSTTable rows={interState} title="Inter-State Supply (IGST)" />
      <GSTTable rows={intraState} title="Intra-State Supply (CGST + SGST)" />
    </div>
  );
}

// ── 5. Top Products ────────────────────────────────────────────────
function TopProductsReport() {
  const productStats = useMemo(() => {
    const map: Record<string, { name: string; hsn: string; qty: number; revenue: number; unitPrices: number[] }> = {};
    for (const inv of invoices) {
      if (inv.status === "cancelled") continue;
      for (const item of inv.items) {
        const product = getInvoiceProduct(item.productId);
        if (!product) continue;
        const { total } = computeLineItem(item);
        if (!map[item.productId]) {
          map[item.productId] = { name: product.name, hsn: product.hsnCode ?? "N/A", qty: 0, revenue: 0, unitPrices: [] };
        }
        map[item.productId].qty += item.quantity;
        map[item.productId].revenue += total;
        map[item.productId].unitPrices.push(item.unitPrice);
      }
    }
    return Object.entries(map)
      .map(([id, v]) => ({
        id,
        ...v,
        avgUnitPrice: v.unitPrices.reduce((s, p) => s + p, 0) / v.unitPrices.length,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, []);

  return (
    <div className="space-y-6">
      <ExportBar reportName="Top Products" />
      <SectionCard title="Top 10 Products by Revenue" noPadding>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <Th>#</Th>
                <Th>Product</Th>
                <Th>HSN Code</Th>
                <Th right>Qty Sold</Th>
                <Th right>Total Revenue</Th>
                <Th right>Avg Unit Price</Th>
              </tr>
            </thead>
            <tbody>
              {productStats.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-slate-100 hover:bg-slate-50/60"
                >
                  <Td>
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${i < 3 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                      {i + 1}
                    </span>
                  </Td>
                  <Td><span className="font-medium text-foreground">{p.name}</span></Td>
                  <Td><span className="font-mono text-xs">{p.hsn}</span></Td>
                  <Td right>{p.qty}</Td>
                  <Td right className="text-emerald-700">{fmtINR(p.revenue)}</Td>
                  <Td right>{fmtINR(p.avgUnitPrice)}</Td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

// ── 6. Monthly Revenue ─────────────────────────────────────────────
function MonthlyRevenueReport() {
  const monthlyData = [
    { month: "Jan", revenue: 380000, invoices: 8, collected: 340000 },
    { month: "Feb", revenue: 420000, invoices: 9, collected: 390000 },
    { month: "Mar", revenue: 510000, invoices: 11, collected: 470000 },
    { month: "Apr", revenue: 465000, invoices: 10, collected: 420000 },
    { month: "May", revenue: 580000, invoices: 13, collected: 530000 },
    { month: "Jun", revenue: 620000, invoices: 14, collected: 560000 },
    { month: "Jul", revenue: 710000, invoices: 12, collected: 620000 },
  ];

  const totalRevenue = monthlyData.reduce((s, m) => s + m.revenue, 0);
  const totalCollected = monthlyData.reduce((s, m) => s + m.collected, 0);

  return (
    <div className="space-y-6">
      <ExportBar reportName="Monthly Revenue" />
      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <TrendingUp className="h-5 w-5 text-emerald-600 shrink-0" />
        <p className="text-sm font-semibold text-emerald-700">+18.4% vs same period last year</p>
        <span className="text-xs text-emerald-600">YoY Growth (Jan–Jul 2025 baseline)</span>
      </div>
      <SectionCard title="Monthly Revenue — Jan to Jul 2026">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={monthlyData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
            <Tooltip formatter={(v: number) => fmtINR(v)} />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} name="Revenue" />
            <Line type="monotone" dataKey="collected" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} name="Collected" />
          </LineChart>
        </ResponsiveContainer>
      </SectionCard>
      <SectionCard title="Month-by-Month Breakdown" noPadding>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <Th>Month</Th>
                <Th right>Invoices</Th>
                <Th right>Revenue</Th>
                <Th right>Collected</Th>
                <Th right>Outstanding</Th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((m, i) => (
                <motion.tr
                  key={m.month}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-slate-100 hover:bg-slate-50/60"
                >
                  <Td><span className="font-semibold text-foreground">{m.month} 2026</span></Td>
                  <Td right>{m.invoices}</Td>
                  <Td right>{fmtINR(m.revenue)}</Td>
                  <Td right className="text-emerald-700">{fmtINR(m.collected)}</Td>
                  <Td right className="text-amber-700">{fmtINR(m.revenue - m.collected)}</Td>
                </motion.tr>
              ))}
              <tr className="border-t-2 border-slate-200 bg-slate-50 font-bold">
                <Td><span className="font-bold text-foreground">Total</span></Td>
                <Td right className="font-bold">{monthlyData.reduce((s, m) => s + m.invoices, 0)}</Td>
                <Td right className="font-bold">{fmtINR(totalRevenue)}</Td>
                <Td right className="font-bold text-emerald-700">{fmtINR(totalCollected)}</Td>
                <Td right className="font-bold text-amber-700">{fmtINR(totalRevenue - totalCollected)}</Td>
              </tr>
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

// ── 7. Outstanding Payments ────────────────────────────────────────
function OutstandingReport() {
  const TODAY = new Date("2026-07-13T00:00:00");

  const outstandingInvoices = useMemo(() => {
    return invoices
      .map((inv) => {
        const balance = invoiceGrandTotal(inv) - inv.amountPaid;
        const cust = getCustomer(inv.customerId);
        const dueDateObj = new Date(inv.dueDate + "T00:00:00");
        const overdueDays = Math.max(0, Math.floor((TODAY.getTime() - dueDateObj.getTime()) / (1000 * 60 * 60 * 24)));
        return { ...inv, balance, cust, dueDateObj, overdueDays };
      })
      .filter((inv) => inv.balance > 0)
      .sort((a, b) => a.dueDateObj.getTime() - b.dueDateObj.getTime());
  }, []);

  const totalOutstanding = outstandingInvoices.reduce((s, inv) => s + inv.balance, 0);

  return (
    <div className="space-y-6">
      <ExportBar reportName="Outstanding Payments" />
      <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Total Outstanding Balance</p>
            <p className="text-xs text-amber-600">{outstandingInvoices.length} invoices with pending payments</p>
          </div>
        </div>
        <p className="text-xl font-bold text-amber-800">{fmtINR(totalOutstanding)}</p>
      </div>
      <SectionCard title="Outstanding Invoices" noPadding>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <Th>Invoice #</Th>
                <Th>Customer</Th>
                <Th>Due Date</Th>
                <Th right>Overdue (days)</Th>
                <Th right>Balance Due</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {outstandingInvoices.map((inv, i) => {
                const isOverdue = inv.overdueDays > 0;
                return (
                  <motion.tr
                    key={inv.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`border-b border-slate-100 ${isOverdue ? "bg-red-50 hover:bg-red-100/60" : "hover:bg-slate-50/60"}`}
                  >
                    <Td><span className="font-mono text-sm font-medium">{inv.invoiceNumber}</span></Td>
                    <Td>
                      <p className="font-medium text-foreground whitespace-nowrap">{inv.cust?.name ?? inv.customerId}</p>
                      <p className="text-xs text-muted-foreground">{inv.cust?.city}</p>
                    </Td>
                    <Td>{fmtDate(inv.dueDate)}</Td>
                    <Td right>
                      {isOverdue ? (
                        <span className="font-bold text-red-600">{inv.overdueDays}d</span>
                      ) : (
                        <span className="text-emerald-600">Due soon</span>
                      )}
                    </Td>
                    <Td right className={isOverdue ? "text-red-700 font-bold" : "text-amber-700 font-bold"}>
                      {fmtINR(inv.balance)}
                    </Td>
                    <Td><BillingStatusPill status={inv.status} /></Td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

// ── 8. Collection Report ───────────────────────────────────────────
function CollectionReport() {
  const totalInvoiced = invoices.reduce((s, inv) => s + invoiceGrandTotal(inv), 0);
  const totalCollected = invoices.reduce((s, inv) => s + inv.amountPaid, 0);
  const collectionEfficiency = totalInvoiced > 0 ? ((totalCollected / totalInvoiced) * 100).toFixed(1) : "0";

  const fullyCollected = invoices.filter((inv) => inv.status === "paid").length;
  const partiallyCollected = invoices.filter((inv) => inv.status === "partial").length;
  const notCollected = invoices.filter((inv) => ["sent", "overdue", "draft"].includes(inv.status)).length;

  const receivedPayments = useMemo(() => {
    return payments
      .filter((p) => p.status === "received")
      .map((p) => {
        const inv = invoices.find((i) => i.id === p.invoiceId);
        const cust = getCustomer(p.customerId);
        return { ...p, inv, cust, invoiceAmount: inv ? invoiceGrandTotal(inv) : 0 };
      });
  }, []);

  return (
    <div className="space-y-6">
      <ExportBar reportName="Collection Report" />
      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        <p className="text-sm font-semibold text-emerald-700">
          Collection Efficiency: {collectionEfficiency}%
        </p>
        <span className="text-xs text-emerald-600">({fmtINR(totalCollected)} collected of {fmtINR(totalInvoiced)} total)</span>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Invoices Issued" value={String(invoices.length)} icon={FileText} bg="bg-blue-50" iconColor="text-blue-600" index={0} />
        <StatTile label="Fully Collected" value={String(fullyCollected)} icon={CheckCircle2} bg="bg-emerald-50" iconColor="text-emerald-600" index={1} />
        <StatTile label="Partially Collected" value={String(partiallyCollected)} icon={Clock} bg="bg-amber-50" iconColor="text-amber-600" index={2} />
        <StatTile label="Not Collected" value={String(notCollected)} icon={AlertTriangle} bg="bg-red-50" iconColor="text-red-600" index={3} />
      </div>
      <SectionCard title="Payment Collections" noPadding>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <Th>Payment #</Th>
                <Th>Invoice</Th>
                <Th>Customer</Th>
                <Th right>Invoice Amount</Th>
                <Th right>Collected</Th>
                <Th>Date</Th>
                <Th>Mode</Th>
              </tr>
            </thead>
            <tbody>
              {receivedPayments.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-slate-100 hover:bg-slate-50/60"
                >
                  <Td><span className="font-mono text-xs font-medium">{p.paymentNumber}</span></Td>
                  <Td><span className="font-mono text-xs text-blue-600">{p.inv?.invoiceNumber ?? p.invoiceId}</span></Td>
                  <Td><span className="font-medium text-foreground whitespace-nowrap">{p.cust?.name ?? p.customerId}</span></Td>
                  <Td right>{fmtINR(p.invoiceAmount)}</Td>
                  <Td right className="text-emerald-700">{fmtINR(p.amount)}</Td>
                  <Td>{fmtDate(p.date)}</Td>
                  <Td><span className="capitalize text-xs text-muted-foreground">{p.mode.replace(/-/g, " ")}</span></Td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────
export function ReportsTab() {
  const [activeReport, setActiveReport] = useState<ReportTab>("invoice-analytics");

  return (
    <div className="space-y-6">
      {/* Sub-tab navigation */}
      <div className="rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
        <div className="flex flex-wrap gap-1">
          {REPORT_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeReport === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveReport(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-150 whitespace-nowrap ${
                  active
                    ? "bg-[image:var(--gradient-brand)] text-white shadow-sm"
                    : "text-muted-foreground hover:bg-slate-100 hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Report content */}
      <motion.div
        key={activeReport}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {activeReport === "invoice-analytics" && <InvoiceAnalyticsReport />}
        {activeReport === "payment-analytics" && <PaymentAnalyticsReport />}
        {activeReport === "customer-sales" && <CustomerSalesReport />}
        {activeReport === "gst-summary" && <GSTSummaryReport />}
        {activeReport === "top-products" && <TopProductsReport />}
        {activeReport === "monthly-revenue" && <MonthlyRevenueReport />}
        {activeReport === "outstanding" && <OutstandingReport />}
        {activeReport === "collection" && <CollectionReport />}
      </motion.div>
    </div>
  );
}
