import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Check,
  Menu,
  X,
  Sparkles,
  Receipt,
  Boxes,
  Users,
  BarChart3,
  Package,
  ShieldCheck,
  Clock3,
  Rocket,
  MousePointerClick,
  MessageCircle,
  Smartphone,
  Mic,
  Building2,
  LineChart,
  CalendarDays,
  Mail,
  Phone,
  MapPin,
  Wallet,
  TrendingUp,
  ShoppingCart,
  Plus,
  Minus,
} from "lucide-react";
import {
  UserCog,
  Puzzle,
  Bot,
  Printer,
  QrCode,
  Scan,
  Warehouse,
  Landmark,
  Zap,
  Volume2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

/* ---------- Primitives ---------- */

function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="#" className={"flex items-center gap-2 " + className}>
      <span className="relative grid h-8 w-8 place-items-center rounded-xl bg-[image:var(--gradient-brand)] shadow-[var(--shadow-elegant)]">
        <span className="absolute inset-0.5 rounded-[10px] bg-black/20" />
        <span className="relative text-sm font-black text-white">N</span>
      </span>
      <span className="text-[17px] font-bold tracking-tight text-foreground">
        Nexora <span className="text-muted-foreground font-medium">Billing</span>
      </span>
    </a>
  );
}

function GradientButton({
  children,
  href = "#",
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300";
  if (variant === "primary") {
    return (
      <a
        href={href}
        className={`${base} bg-[image:var(--gradient-brand)] text-white shadow-[var(--shadow-elegant)] hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-16px_oklch(0.62_0.22_258/0.55)] ${className}`}
      >
        {children}
      </a>
    );
  }
  return (
    <a
      href={href}
      className={`${base} border border-border bg-background/60 text-foreground backdrop-blur hover:bg-secondary ${className}`}
    >
      {children}
    </a>
  );
}

/* ---------- Nav ---------- */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "#why" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ];
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-xl bg-background/70 border-b border-border/60" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Login
          </a>
          <GradientButton href="#pricing">
            Get Started <ArrowRight className="h-4 w-4" />
          </GradientButton>
        </div>
        <button
          aria-label="Toggle menu"
          className="grid h-10 w-10 place-items-center rounded-lg border border-border md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary"
            >
              Login
            </a>
            <GradientButton className="mt-2 justify-center" href="#pricing">
              Get Started
            </GradientButton>
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------- Hero ---------- */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-glow pt-32 pb-20 lg:pt-40 lg:pb-28">
      <div className="absolute inset-0 -z-10 [background-image:linear-gradient(oklch(0.14_0.02_260/0.04)_1px,transparent_1px),linear-gradient(90deg,oklch(0.14_0.02_260/0.04)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-[1.05fr_1fr]">
        <div className="animate-rise">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--brand-electric)]" />
            Now with Nexora AI Assistant 2.0
          </div>
          <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            AI-Powered Billing &{" "}
            <span className="text-gradient">Business Management.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Nexora Billing brings GST invoicing, inventory, customers, reports
            and an AI assistant into one beautifully simple workspace — built
            for modern Indian businesses.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <GradientButton href="#pricing">
              Get Started <ArrowRight className="h-4 w-4" />
            </GradientButton>
            <GradientButton href="#contact" variant="ghost">
              Book Demo
            </GradientButton>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-[color:var(--brand-electric)]" /> 14-day free trial
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-[color:var(--brand-electric)]" /> No credit card required
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-[color:var(--brand-electric)]" /> Cancel anytime
            </span>
          </div>
        </div>
        <HeroMockup />
      </div>
    </section>
  );
}

function HeroMockup() {
  return (
    <div className="relative animate-rise [animation-delay:120ms]">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-[image:var(--gradient-brand)] opacity-20 blur-3xl" />
      <div className="glass rounded-3xl p-4">
        <div className="rounded-2xl bg-[color:var(--brand-deep)] p-5 text-white shadow-[var(--shadow-elegant)]">
          <div className="flex items-center justify-between text-xs text-white/60">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            </div>
            <span>nexora.app / dashboard</span>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-white/50">Good morning, Aarav</p>
              <p className="text-lg font-semibold">Today's overview</p>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium">
              Live
            </span>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { label: "Revenue", value: "₹1,24,860", tone: "text-emerald-300" },
              { label: "Orders", value: "348", tone: "text-sky-300" },
              { label: "Profit", value: "₹41,220", tone: "text-fuchsia-300" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-white/5 p-3">
                <p className="text-[10px] uppercase tracking-wider text-white/50">{s.label}</p>
                <p className={`mt-1 text-base font-bold ${s.tone}`}>{s.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-white/5 p-4">
            <div className="mb-3 flex items-center justify-between text-xs text-white/50">
              <span>Revenue · last 14 days</span>
              <span className="text-emerald-300">+18.4%</span>
            </div>
            <div className="flex h-24 items-end gap-1.5">
              {[38, 52, 44, 61, 55, 72, 65, 80, 74, 88, 82, 95, 90, 100].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-gradient-to-t from-[color:var(--brand-electric)]/40 to-[color:var(--brand-electric)]"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating cards */}
      <div className="absolute -left-4 -bottom-6 hidden animate-float sm:block">
        <div className="glass rounded-2xl p-4 min-w-[220px]">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-[color:var(--brand-electric)]" /> AI Assistant
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            "3 products are low on stock. Reorder 2 SKUs before Friday to avoid stockout."
          </p>
        </div>
      </div>
      <div className="absolute -right-4 top-10 hidden animate-float-slower md:block">
        <div className="glass rounded-2xl p-4 min-w-[200px]">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Inventory</p>
          <p className="mt-1 text-lg font-bold text-foreground">1,284 SKUs</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-secondary">
            <div className="h-full w-3/4 rounded-full bg-[image:var(--gradient-brand)]" />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">74% healthy</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Trusted By ---------- */

function TrustedBy() {
  const logos = ["Northwind", "Cascade", "Meridian", "Lumen", "Vertex", "Halcyon"];
  return (
    <section className="border-y border-border/60 bg-background py-12">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Trusted by 12,000+ growing businesses
        </p>
        <div className="mt-8 grid grid-cols-2 items-center gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
          {logos.map((l) => (
            <div
              key={l}
              className="text-center text-lg font-bold tracking-tight text-muted-foreground/60 transition-colors hover:text-foreground"
            >
              {l}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Features ---------- */

type FeatureCategory = {
  id: string;
  icon: typeof Receipt;
  title: string;
  tagline: string;
  desc: string;
  items: string[];
  preview: () => ReactNode;
};

const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    id: "billing",
    icon: Receipt,
    title: "Billing & GST",
    tagline: "Invoice at the speed of your business.",
    desc: "GST-ready invoices, quotations, credit notes and payment tracking — with print, PDF and UPI built in.",
    items: [
      "GST Invoices",
      "Quotations",
      "Estimates",
      "Purchase Bills",
      "Credit Notes",
      "Debit Notes",
      "Recurring Invoices",
      "Multiple Invoice Templates",
      "Invoice History",
      "PDF Export",
      "Print Support",
      "Thermal Printer Support",
      "Digital Signature",
      "UPI Payment QR",
      "Razorpay Integration",
      "Tax Reports",
      "Payment Tracking",
      "Outstanding Payments",
      "Auto Payment Reminders",
    ],
    preview: () => <BillingPreview />,
  },
  {
    id: "inventory",
    icon: Boxes,
    title: "Inventory Management",
    tagline: "Every SKU, batch and warehouse in sync.",
    desc: "Track unlimited products with barcodes, batches, expiry dates and multi-location stock — with smart restock suggestions.",
    items: [
      "Unlimited Products",
      "Product Categories",
      "Barcode Generation",
      "Barcode Scanner Support",
      "Batch Management",
      "Expiry Date Tracking",
      "Low Stock Alerts",
      "Purchase Orders",
      "Supplier Management",
      "Warehouse Management",
      "Multi-location Inventory",
      "Stock Transfer",
      "Inventory Valuation",
      "Auto Restock Suggestions",
      "Import from Excel",
      "Export to Excel",
    ],
    preview: () => <InventoryPreview />,
  },
  {
    id: "crm",
    icon: Users,
    title: "CRM",
    tagline: "A relationship engine for repeat revenue.",
    desc: "Customer profiles, purchase history, pipelines and loyalty — all in one operator-friendly workspace.",
    items: [
      "Customer Database",
      "Customer Purchase History",
      "Customer Notes",
      "Sales Pipeline",
      "Lead Management",
      "Follow-up Reminders",
      "Customer Segmentation",
      "Loyalty Program",
      "Outstanding Payment Tracking",
      "Customer Analytics",
    ],
    preview: () => <CRMPreview />,
  },
  {
    id: "reports",
    icon: BarChart3,
    title: "Reports & Analytics",
    tagline: "The whole business, one dashboard.",
    desc: "Daily, monthly and yearly reports with P&L, tax, revenue trends and business health at a glance.",
    items: [
      "Daily Sales Report",
      "Monthly Report",
      "Yearly Report",
      "Profit & Loss",
      "Revenue Analytics",
      "Best Selling Products",
      "Slow Moving Products",
      "Customer Analytics",
      "Employee Performance Reports",
      "Tax Reports",
      "Business Health Dashboard",
      "Export Reports to PDF & Excel",
    ],
    preview: () => <ReportsPreview />,
  },
  {
    id: "ai",
    icon: Sparkles,
    title: "AI Business Assistant",
    tagline: "An operator that never sleeps.",
    desc: "Natural-language Q&A, forecasting, smart suggestions and workflow automations across your entire business.",
    items: [
      "AI Chat Assistant",
      "Business Insights",
      "Sales Forecasting",
      "Inventory Forecasting",
      "Smart Business Suggestions",
      "Invoice Generation",
      "AI Report Summaries",
      "Payment Reminder Generation",
      "Natural Language Search",
      "Business Q&A",
      "Smart Notifications",
      "Workflow Recommendations",
    ],
    preview: () => <AIPreview />,
  },
  {
    id: "finance",
    icon: Wallet,
    title: "Finance",
    tagline: "Know exactly where your money is.",
    desc: "Expenses, income, cash flow, profit and reconciliation — one financial cockpit for the whole business.",
    items: [
      "Expense Management",
      "Income Tracking",
      "Cash Flow",
      "Profit Tracking",
      "Tax Summary",
      "Bank Reconciliation",
      "Financial Dashboard",
    ],
    preview: () => <FinancePreview />,
  },
  {
    id: "multi-branch",
    icon: Building2,
    title: "Multi Branch",
    tagline: "Every outlet, one command centre.",
    desc: "Manage multiple branches with centralised reporting, branch-wise inventory and role-based access.",
    items: [
      "Multiple Branch Management",
      "Centralized Dashboard",
      "Branch Performance Comparison",
      "Branch-wise Inventory",
      "Branch-wise Reports",
      "Central Billing",
      "Role-Based Branch Access",
    ],
    preview: () => <MultiBranchPreview />,
  },
];

function Features() {
  const [active, setActive] = useState(FEATURE_CATEGORIES[0].id);
  const current =
    FEATURE_CATEGORIES.find((c) => c.id === active) ?? FEATURE_CATEGORIES[0];
  return (
    <section id="features" className="relative py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-24 -z-10 mx-auto h-[520px] max-w-5xl bg-[image:var(--gradient-hero)] opacity-70" />
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Product Features"
          title="Everything you need to run your business."
          subtitle="Seven deeply integrated modules — from GST billing to AI insights — engineered to work together out of the box."
        />

        {/* Category tabs */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-2">
          {FEATURE_CATEGORIES.map((c) => {
            const isActive = c.id === active;
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "border-transparent bg-[image:var(--gradient-brand)] text-white shadow-[var(--shadow-elegant)]"
                    : "border-border bg-card text-muted-foreground hover:-translate-y-0.5 hover:border-[color:var(--brand-electric)]/40 hover:text-foreground"
                }`}
              >
                <c.icon className="h-4 w-4" />
                {c.title}
              </button>
            );
          })}
        </div>

        {/* Active category card */}
        <div
          key={current.id}
          className="relative mt-10 overflow-hidden rounded-[2rem] border border-border bg-card p-6 shadow-[var(--shadow-elegant)] animate-rise sm:p-10"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[image:var(--gradient-brand)] opacity-10 blur-3xl" />
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                <current.icon className="h-3.5 w-3.5 text-[color:var(--brand-electric)]" />
                {current.title}
              </div>
              <h3 className="mt-4 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                {current.tagline}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {current.desc}
              </p>
              <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {current.items.map((item) => (
                  <li
                    key={item}
                    className="group flex items-start gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground/80 transition-colors hover:bg-secondary/70 hover:text-foreground"
                  >
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[color:var(--brand-electric)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Screenshot / preview */}
            <div className="relative">
              <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-[image:var(--gradient-brand)] opacity-15 blur-2xl" />
              <div className="rounded-2xl border border-border bg-background p-4 shadow-[var(--shadow-card)] transition-transform duration-500 hover:-translate-y-1">
                {current.preview()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Feature Previews ---------- */

function PreviewShell({
  title,
  children,
  right,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-secondary/50">
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
        </div>
        <p className="text-[11px] font-medium text-muted-foreground">{title}</p>
        <div className="text-[11px] text-muted-foreground">{right}</div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function BillingPreview() {
  return (
    <PreviewShell title="Invoice · INV-1042" right="GST · draft">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Bill To</p>
          <p className="mt-0.5 text-sm font-semibold text-foreground">Priya Traders</p>
          <p className="text-[11px] text-muted-foreground">GSTIN 29ABCDE1234F1Z5</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-muted-foreground">Total</p>
          <p className="text-lg font-black text-foreground">₹24,780</p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {[
          { name: "Amul Gold 1L × 24", amt: "₹1,440" },
          { name: "Tata Salt 1kg × 40", amt: "₹960" },
          { name: "Maggi 70g × 60", amt: "₹840" },
        ].map((r) => (
          <div key={r.name} className="flex items-center justify-between rounded-lg bg-card px-3 py-2 text-xs">
            <span className="text-foreground">{r.name}</span>
            <span className="font-semibold text-foreground">{r.amt}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between rounded-lg border border-dashed border-border bg-card px-3 py-2 text-[11px]">
        <span className="text-muted-foreground">CGST 9% · SGST 9%</span>
        <span className="font-semibold text-foreground">Auto calculated</span>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold text-foreground">
          <QrCode className="h-3 w-3" /> UPI QR
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold text-foreground">
          <Printer className="h-3 w-3" /> Thermal
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-[image:var(--gradient-brand)] px-2.5 py-1 text-[10px] font-semibold text-white">
          <Check className="h-3 w-3" /> GST ready
        </span>
      </div>
    </PreviewShell>
  );
}

function InventoryPreview() {
  const rows = [
    { name: "Amul Gold 1L", batch: "B-1042", stock: 128, tone: "text-emerald-600" },
    { name: "Tata Salt 1kg", batch: "B-0921", stock: 4, tone: "text-destructive" },
    { name: "Maggi 70g", batch: "B-1188", stock: 9, tone: "text-yellow-600" },
    { name: "Colgate MaxFresh", batch: "B-0714", stock: 46, tone: "text-emerald-600" },
  ];
  return (
    <PreviewShell title="Inventory · 1,284 SKUs" right="Live sync">
      <div className="mb-3 flex items-center gap-2 rounded-lg bg-card px-3 py-2 text-xs">
        <Scan className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">Scan barcode or search…</span>
      </div>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div
            key={r.name}
            className="flex items-center justify-between rounded-lg bg-card px-3 py-2 text-xs"
          >
            <div>
              <p className="font-semibold text-foreground">{r.name}</p>
              <p className="text-[10px] text-muted-foreground">Batch {r.batch}</p>
            </div>
            <div className={`text-right text-[11px] font-bold ${r.tone}`}>
              {r.stock} in stock
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-[color:var(--brand-electric)]/40 bg-[color:var(--brand-electric)]/5 px-3 py-2 text-[11px] text-foreground">
        <Warehouse className="h-3.5 w-3.5 text-[color:var(--brand-electric)]" />
        Auto-restock suggests <b className="ml-1">reorder 3 SKUs</b>
      </div>
    </PreviewShell>
  );
}

function CRMPreview() {
  const customers = [
    { name: "Meridian Retail", tag: "VIP", ltv: "₹1.42L", tone: "bg-[image:var(--gradient-brand)] text-white" },
    { name: "Cascade Foods", tag: "Loyal", ltv: "₹98k", tone: "bg-secondary text-foreground" },
    { name: "Halcyon Group", tag: "New", ltv: "₹32k", tone: "bg-secondary text-foreground" },
  ];
  return (
    <PreviewShell title="Customer 360°" right="Pipeline · Oct">
      <div className="grid grid-cols-3 gap-2">
        {[
          { l: "Leads", v: "48" },
          { l: "Deals", v: "12" },
          { l: "Won", v: "₹6.2L" },
        ].map((k) => (
          <div key={k.l} className="rounded-lg bg-card p-2.5 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k.l}</p>
            <p className="mt-0.5 text-sm font-bold text-foreground">{k.v}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-1.5">
        {customers.map((c) => (
          <div key={c.name} className="flex items-center justify-between rounded-lg bg-card px-3 py-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[image:var(--gradient-brand)] text-[10px] font-bold text-white">
                {c.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <div>
                <p className="font-semibold text-foreground">{c.name}</p>
                <p className="text-[10px] text-muted-foreground">LTV {c.ltv}</p>
              </div>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${c.tone}`}>
              {c.tag}
            </span>
          </div>
        ))}
      </div>
    </PreviewShell>
  );
}

function ReportsPreview() {
  const bars = [40, 62, 48, 74, 58, 82, 70, 92, 78, 96];
  return (
    <PreviewShell title="Business Health" right="Oct 2025">
      <div className="grid grid-cols-3 gap-2">
        {[
          { l: "Revenue", v: "₹8.4L", d: "+12%" },
          { l: "Profit", v: "₹2.1L", d: "+9%" },
          { l: "Orders", v: "2,148", d: "+7%" },
        ].map((k) => (
          <div key={k.l} className="rounded-lg bg-card p-2.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k.l}</p>
            <p className="mt-0.5 text-sm font-bold text-foreground">{k.v}</p>
            <p className="text-[10px] font-semibold text-emerald-600">{k.d}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-lg bg-card p-3">
        <div className="mb-2 flex items-center justify-between text-[11px]">
          <span className="font-semibold text-foreground">Sales trend</span>
          <span className="text-emerald-600">+18.4%</span>
        </div>
        <div className="flex h-20 items-end gap-1.5">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-gradient-to-t from-[color:var(--brand-electric)]/40 to-[color:var(--brand-electric)] transition-all duration-500 hover:from-[color:var(--brand-electric)]/60"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </PreviewShell>
  );
}

function AIPreview() {
  return (
    <PreviewShell title="Nexora AI · Chat" right="Online">
      <div className="space-y-2">
        <div className="flex justify-end">
          <div className="max-w-[85%] rounded-2xl bg-[image:var(--gradient-brand)] px-3 py-2 text-xs text-white">
            Forecast next month's revenue.
          </div>
        </div>
        <div className="flex justify-start">
          <div className="max-w-[85%] rounded-2xl bg-card px-3 py-2 text-xs text-foreground">
            Based on the last 6 months, Nov trends to <b>₹9.6L (+14%)</b>. Confidence 82%.
          </div>
        </div>
        <div className="flex justify-end">
          <div className="max-w-[85%] rounded-2xl bg-[image:var(--gradient-brand)] px-3 py-2 text-xs text-white">
            Draft reminders for overdue invoices.
          </div>
        </div>
        <div className="flex justify-start">
          <div className="max-w-[85%] rounded-2xl bg-card px-3 py-2 text-xs text-foreground">
            Prepared 7 personalised reminders. Send now?
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2">
        <Bot className="h-3.5 w-3.5 text-[color:var(--brand-electric)]" />
        <span className="text-[11px] text-muted-foreground">Ask Nexora anything…</span>
      </div>
    </PreviewShell>
  );
}

function FinancePreview() {
  return (
    <PreviewShell title="Cash Flow · Oct" right="Reconciled">
      <div className="grid grid-cols-2 gap-2">
        {[
          { l: "Income", v: "₹8,42,910", tone: "text-emerald-600" },
          { l: "Expenses", v: "₹4,71,220", tone: "text-destructive" },
          { l: "Profit", v: "₹3,71,690", tone: "text-foreground" },
          { l: "Tax due", v: "₹92,210", tone: "text-foreground" },
        ].map((k) => (
          <div key={k.l} className="rounded-lg bg-card p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k.l}</p>
            <p className={`mt-0.5 text-base font-bold ${k.tone}`}>{k.v}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-lg bg-card p-3">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-foreground">Bank reconciliation</span>
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-600">
            94% matched
          </span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-secondary">
          <div className="h-full w-[94%] rounded-full bg-[image:var(--gradient-brand)]" />
        </div>
      </div>
    </PreviewShell>
  );
}

function MultiBranchPreview() {
  const branches = [
    { name: "Bengaluru HQ", rev: "₹3.2L", up: "+14%" },
    { name: "Mumbai · Andheri", rev: "₹2.1L", up: "+9%" },
    { name: "Delhi · Karol Bagh", rev: "₹1.6L", up: "+4%" },
    { name: "Chennai · T. Nagar", rev: "₹1.5L", up: "+11%" },
  ];
  return (
    <PreviewShell title="Branches · 4 active" right="Central view">
      <div className="space-y-1.5">
        {branches.map((b) => (
          <div key={b.name} className="flex items-center justify-between rounded-lg bg-card px-3 py-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-secondary">
                <Building2 className="h-3.5 w-3.5 text-[color:var(--brand-deep)]" />
              </span>
              <p className="font-semibold text-foreground">{b.name}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-foreground">{b.rev}</p>
              <p className="text-[10px] font-semibold text-emerald-600">{b.up}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between rounded-lg border border-dashed border-border bg-card px-3 py-2 text-[11px] text-muted-foreground">
        <span>Central billing · role-based access</span>
        <span className="font-semibold text-foreground">Enabled</span>
      </div>
    </PreviewShell>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-electric)]">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ---------- AI Showcase ---------- */

const CHAT: { role: "user" | "ai"; text: string }[] = [
  { role: "user", text: "Show today's sales." },
  { role: "ai", text: "You've done ₹64,320 across 87 invoices today — up 12% vs yesterday. Best seller: Amul Gold 1L (42 units)." },
  { role: "user", text: "Create an invoice for Priya Traders." },
  { role: "ai", text: "Drafted invoice #INV-1042 for Priya Traders with 3 recent items. GST auto-calculated. Preview or send?" },
  { role: "user", text: "Find low-stock products." },
  { role: "ai", text: "3 items below reorder: Tata Salt 1kg (4 left), Colgate MaxFresh (6), Maggi 70g (9)." },
  { role: "user", text: "Show top customers this month." },
  { role: "ai", text: "Top 3: Meridian Retail (₹1.42L), Cascade Foods (₹98k), Halcyon Group (₹71k)." },
  { role: "user", text: "GST summary for October." },
  { role: "ai", text: "Output GST: ₹1,84,320 · Input GST: ₹92,110 · Net payable: ₹92,210. Ready for GSTR-1 export." },
];

function AIShowcase() {
  return (
    <section className="relative overflow-hidden bg-[color:var(--brand-deep)] py-24 text-white lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_400px_at_20%_0%,oklch(0.62_0.22_258/0.35),transparent_60%),radial-gradient(600px_300px_at_100%_100%,oklch(0.72_0.19_250/0.25),transparent_60%)]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-glow)]">
            Nexora AI
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            An operator who never sleeps, sitting inside your business.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70">
            Ask questions in plain English or Hindi. Nexora AI reads your sales,
            stock, customers and cash flow — and takes real actions, not just
            answers.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-white/80">
            {[
              "Answers business questions in seconds",
              "Drafts invoices, reminders and reports for you",
              "Detects anomalies before they cost you money",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 text-[color:var(--brand-glow)]" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass-dark rounded-3xl p-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-[image:var(--gradient-brand)]">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </span>
              <div>
                <p className="text-sm font-semibold">Nexora Assistant</p>
                <p className="text-[10px] text-white/50">Online · learns from your data</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
              Ready
            </span>
          </div>
          <div className="mt-4 space-y-3 max-h-[430px] overflow-hidden">
            {CHAT.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-white text-[color:var(--brand-deep)]"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5">
            <Sparkles className="h-4 w-4 text-white/50" />
            <input
              disabled
              placeholder="Ask Nexora anything about your business…"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
            <button className="rounded-full bg-[image:var(--gradient-brand)] p-1.5">
              <ArrowRight className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Dashboard Preview ---------- */

function DashboardPreview() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Dashboard"
          title="See every part of your business, in real time."
          subtitle="One clean workspace for revenue, orders, customers, profit, inventory and pending payments."
        />
        <div className="mt-16 rounded-3xl border border-border bg-card p-3 shadow-[var(--shadow-elegant)] sm:p-5">
          <div className="overflow-hidden rounded-2xl border border-border bg-background">
            <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-4">
              {[
                { icon: Wallet, label: "Revenue", value: "₹8,42,910", delta: "+12.3%" },
                { icon: ShoppingCart, label: "Orders", value: "2,148", delta: "+6.8%" },
                { icon: Users, label: "Customers", value: "5,821", delta: "+3.2%" },
                { icon: TrendingUp, label: "Profit", value: "₹2,10,480", delta: "+9.1%" },
              ].map((k) => (
                <div key={k.label} className="bg-card p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">{k.label}</p>
                    <k.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="mt-3 text-2xl font-bold text-foreground">{k.value}</p>
                  <p className="mt-1 text-xs font-semibold text-emerald-600">{k.delta} vs last week</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-px bg-border lg:grid-cols-3">
              <div className="col-span-2 bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Revenue trend</p>
                    <p className="text-xs text-muted-foreground">Last 30 days</p>
                  </div>
                  <div className="flex gap-1 text-[11px]">
                    {["1W", "1M", "3M", "1Y"].map((r, i) => (
                      <span
                        key={r}
                        className={`rounded-full px-2.5 py-1 ${
                          i === 1
                            ? "bg-secondary font-semibold text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
                <ChartArea />
              </div>
              <div className="bg-card p-6">
                <p className="text-sm font-semibold text-foreground">Pending payments</p>
                <p className="text-xs text-muted-foreground">12 invoices · ₹3,24,110</p>
                <div className="mt-4 space-y-3">
                  {[
                    { name: "Meridian Traders", amt: "₹42,300", days: "Due in 2 days" },
                    { name: "Cascade Foods", amt: "₹18,900", days: "Due tomorrow" },
                    { name: "Halcyon Retail", amt: "₹1,20,000", days: "Overdue 3d" },
                    { name: "Vertex Wholesale", amt: "₹24,600", days: "Due in 5 days" },
                  ].map((p) => (
                    <div key={p.name} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{p.name}</p>
                        <p className="text-[11px] text-muted-foreground">{p.days}</p>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{p.amt}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChartArea() {
  const points = [10, 22, 18, 30, 26, 40, 34, 48, 42, 58, 52, 64, 60, 72, 68, 82, 78, 90, 84, 95];
  const max = 100;
  const w = 640;
  const h = 180;
  const step = w / (points.length - 1);
  const path = points
    .map((v, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (v / max) * h}`)
    .join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-40 w-full">
      <defs>
        <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.62 0.22 258)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="oklch(0.62 0.22 258)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#area)" />
      <path d={path} fill="none" stroke="oklch(0.55 0.24 258)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Why Nexora ---------- */

function WhyNexora() {
  const cards = [
    { icon: Sparkles, title: "AI-powered workflow", desc: "Let the AI assistant handle the busywork — summaries, drafts and insights on demand." },
    { icon: Rocket, title: "Faster billing", desc: "Create GST-ready invoices in seconds and print or share them instantly." },
    { icon: Boxes, title: "Better inventory tracking", desc: "Every sale, return and purchase keeps your stock perfectly in sync." },
    { icon: MousePointerClick, title: "Simple interface", desc: "A clean, uncluttered workspace your entire team can learn in a day." },
    { icon: ShieldCheck, title: "Secure cloud platform", desc: "Encrypted at rest and in transit with automatic daily backups." },
    { icon: Clock3, title: "Time-saving automation", desc: "Auto-updates, alerts and smart shortcuts save hours every single week." },
  ];
  return (
    <section id="why" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Why Nexora"
          title="Why businesses choose Nexora Billing."
          subtitle="Built for shop owners, wholesalers and growing teams who want modern software without the complexity."
        />
        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.title}
              className="group rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--brand-electric)]/40 hover:shadow-[var(--shadow-elegant)]"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-[color:var(--brand-deep)] transition-colors group-hover:bg-[image:var(--gradient-brand)] group-hover:text-white">
                <c.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-foreground">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Pricing ---------- */

const LAUNCH_FEATURES = [
  "Dashboard & analytics",
  "Billing & GST invoicing",
  "Customer management",
  "Product management",
  "Inventory management",
  "AI Business Assistant",
  "Daily & monthly reports",
  "Full GST support",
  "Free updates forever",
];

function Pricing() {
  return (
    <section id="pricing" className="py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="Pricing"
          title="One simple launch price."
          subtitle="Everything you need to run your business, at a fair price. No tiers, no upsells."
        />
        <div className="mt-16 flex justify-center">
          <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-[color:var(--brand-electric)]/30 bg-[color:var(--brand-deep)] p-10 text-white shadow-[var(--shadow-elegant)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_300px_at_100%_0%,oklch(0.72_0.19_250/0.35),transparent_60%),radial-gradient(400px_200px_at_0%_100%,oklch(0.55_0.24_258/0.3),transparent_60%)]" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[image:var(--gradient-brand)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                <Sparkles className="h-3 w-3" /> Launch Offer
              </span>
              <h3 className="mt-5 text-2xl font-bold">Nexora Billing</h3>
              <p className="mt-1 text-sm text-white/70">Everything included. Cancel anytime.</p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-6xl font-black tracking-tight">₹499</span>
                <span className="text-white/60">/month</span>
              </div>
              <p className="mt-1 text-xs text-white/50">Billed monthly · GST inclusive</p>
              <ul className="mt-8 grid grid-cols-1 gap-3 text-sm text-white/90 sm:grid-cols-2">
                {LAUNCH_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[color:var(--brand-glow)]" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[color:var(--brand-deep)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Testimonials ---------- */

const TESTIMONIALS = [
  {
    quote:
      "We replaced four different tools with Nexora. Our monthly closing now takes 2 days instead of 2 weeks.",
    name: "Priya Sharma",
    role: "Founder, Meridian Retail",
  },
  {
    quote:
      "The AI Assistant flagged a stock issue that would have cost us a full weekend of sales. It has paid for itself many times over.",
    name: "Rahul Menon",
    role: "COO, Cascade Foods",
  },
  {
    quote:
      "Finally, one login for billing, inventory and reports. Our store managers actually enjoy using it.",
    name: "Ananya Iyer",
    role: "Head of Ops, Halcyon Group",
  },
];

function Testimonials() {
  return (
    <section className="bg-secondary/40 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Customers"
          title="Loved by operators who ship."
        />
        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)]"
            >
              <blockquote className="text-base leading-relaxed text-foreground">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[image:var(--gradient-brand)] text-sm font-bold text-white">
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */

const FAQS = [
  {
    q: "Is GST supported?",
    a: "Yes. Nexora Billing calculates CGST, SGST and IGST automatically on every invoice and gives you a clean monthly GST summary ready for filing.",
  },
  {
    q: "Can I print invoices?",
    a: "Absolutely. Every invoice can be printed on A4 or thermal printers, downloaded as PDF, or shared as a link with your customer.",
  },
  {
    q: "Is my data secure?",
    a: "Your data is encrypted in transit and at rest, stored on secure cloud infrastructure with automatic daily backups. Only you and your team can access it.",
  },
  {
    q: "Does it work on mobile?",
    a: "Yes. Nexora Billing is fully responsive and works beautifully on phone, tablet and desktop browsers — no install required.",
  },
  {
    q: "Can I manage inventory?",
    a: "Yes. Stock updates automatically with every sale and purchase, and you get low-stock alerts, purchase entries and inventory reports out of the box.",
  },
  {
    q: "How does the AI assistant help?",
    a: "Ask questions like ‘Show today's sales’ or ‘Find low-stock products’ in plain English. The AI reads your data and answers instantly — and can draft invoices and reports for you.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeading eyebrow="FAQ" title="Answers to common questions." />
        <div className="mt-12 divide-y divide-border rounded-2xl border border-border bg-card">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <button
                key={f.q}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full flex-col items-start gap-2 px-6 py-5 text-left"
              >
                <div className="flex w-full items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-foreground sm:text-base">{f.q}</span>
                  <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full border border-border text-muted-foreground">
                    {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </span>
                </div>
                {isOpen && (
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */

const ROADMAP = [
  { icon: CalendarDays, title: "Appointment Management", desc: "Bookings, calendars and reminders for service businesses." },
  { icon: MessageCircle, title: "WhatsApp Integration", desc: "Send invoices, receipts and reminders on WhatsApp Business." },
  { icon: Sparkles, title: "Advanced AI Automation", desc: "Automated workflows, follow-ups and daily briefings." },
  { icon: Mic, title: "Voice Commands", desc: "Create invoices and get insights hands-free with your voice." },
  { icon: Building2, title: "Multi-Branch Management", desc: "Consolidated reporting and stock across every location." },
  { icon: Smartphone, title: "Mobile App", desc: "Native iOS and Android apps that stay in sync everywhere." },
  { icon: LineChart, title: "Advanced Analytics", desc: "Cohorts, forecasts and profitability insights." },
];

function ComingSoon() {
  return (
    <section id="roadmap" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Roadmap"
          title="Coming soon to Nexora Billing."
          subtitle="Big things on the way. Here's a peek at what our team is building next."
        />
        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ROADMAP.map((r) => (
            <div
              key={r.title}
              className="relative overflow-hidden rounded-2xl border border-dashed border-border bg-card/60 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--brand-electric)]/40"
            >
              <div className="flex items-center justify-between">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-[color:var(--brand-deep)]">
                  <r.icon className="h-5 w-5" />
                </div>
                <span className="rounded-full border border-[color:var(--brand-electric)]/30 bg-[color:var(--brand-electric)]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--brand-electric)]">
                  Coming soon
                </span>
              </div>
              <h3 className="mt-5 text-base font-semibold text-foreground">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" className="bg-secondary/40 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Contact"
          title="Talk to our team."
          subtitle="Have a question, a demo request or a special ask? We usually reply within a few hours."
        />
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            {[
              { icon: Mail, title: "Email us", value: "hello@nexorabilling.com" },
              { icon: Phone, title: "Call us", value: "+91 80 4718 0000" },
              { icon: MapPin, title: "Visit us", value: "Prestige Tower, Bengaluru 560001" },
            ].map((c) => (
              <div
                key={c.title}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
              >
                <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-brand)] text-white">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {c.title}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)]"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold text-foreground">Name</span>
                <input
                  required
                  type="text"
                  placeholder="Aarav Sharma"
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-[color:var(--brand-electric)] focus:ring-2 focus:ring-[color:var(--brand-electric)]/20"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-foreground">Email</span>
                <input
                  required
                  type="email"
                  placeholder="you@company.com"
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-[color:var(--brand-electric)] focus:ring-2 focus:ring-[color:var(--brand-electric)]/20"
                />
              </label>
            </div>
            <label className="mt-4 block">
              <span className="text-xs font-semibold text-foreground">Business name</span>
              <input
                type="text"
                placeholder="Sharma Traders"
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-[color:var(--brand-electric)] focus:ring-2 focus:ring-[color:var(--brand-electric)]/20"
              />
            </label>
            <label className="mt-4 block">
              <span className="text-xs font-semibold text-foreground">Message</span>
              <textarea
                required
                rows={4}
                placeholder="Tell us a little about your business…"
                className="mt-1.5 w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-[color:var(--brand-electric)] focus:ring-2 focus:ring-[color:var(--brand-electric)]/20"
              />
            </label>
            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[image:var(--gradient-brand)] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-elegant)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              {sent ? "Message sent ✓" : "Send message"}
              {!sent && <ArrowRight className="h-4 w-4" />}
            </button>
            <p className="mt-3 text-xs text-muted-foreground">
              By submitting, you agree to be contacted by the Nexora Billing team.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */

function FinalCTA() {
  return (
    <section id="cta" className="relative overflow-hidden py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-[color:var(--brand-deep)] px-8 py-16 text-center text-white shadow-[var(--shadow-elegant)] sm:px-16 sm:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_300px_at_50%_0%,oklch(0.72_0.19_250/0.35),transparent_60%),radial-gradient(500px_260px_at_50%_100%,oklch(0.55_0.24_258/0.35),transparent_60%)]" />
          <div className="relative">
            <h2 className="mx-auto max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
              Ready to transform your business?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/70">
              Join 12,000+ operators running smarter with Nexora. 14 days free.
              No credit card. See value on day one.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[color:var(--brand-deep)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/10"
              >
                Book a Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */

function Footer() {
  const groups = [
    {
      title: "Product",
      links: ["Features", "Pricing", "AI Assistant", "Roadmap"],
    },
    {
      title: "Company",
      links: ["About", "Blog", "Careers", "Contact"],
    },
    {
      title: "Support",
      links: ["Help Center", "Docs", "Community", "Status"],
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms", "Security", "GST Info"],
    },
  ];
  return (
    <footer className="border-t border-border bg-background py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              AI-powered billing and business management for modern Indian
              businesses. Built with care, priced fairly.
            </p>
            <div className="mt-5 flex gap-2">
              {["X", "In", "Ig", "Yt"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
          {groups.map((g) => (
            <div key={g.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
                {g.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {g.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Nexora Billing. All rights reserved.</p>
          <p>Made for operators. Built with care.</p>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Page ---------- */

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Nav />
      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <AIShowcase />
        <DashboardPreview />
        <WhyNexora />
        <Testimonials />
        <Pricing />
        <ComingSoon />
        <FAQ />
        <Contact />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
