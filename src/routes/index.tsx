import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
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
  ShieldCheck,
  Clock3,
  Rocket,
  MousePointerClick,
  MessageCircle,
  Smartphone,
  Building2,
  Mail,
  Phone,
  MapPin,
  Wallet,
  TrendingUp,
  ShoppingCart,
  Plus,
  Minus,
  Star,
  Lock,
  Globe,
  Play,
  Brain,
  Database,
  Layers,
  FileText,
  Bell,
  Cloud,
  Key,
  CheckCircle2,
  ArrowUpRight,
  Zap,
  UserCog,
  Puzzle,
  Bot,
  Printer,
  QrCode,
  Scan,
  Warehouse,
  Shield,
  Server,
  LayoutDashboard,
  Package,
  LineChart,
  CreditCard,
  GitBranch,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

/* ─────────────────────────────────────────────────────────────────
   PRIMITIVES
───────────────────────────────────────────────────────────────── */

function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="#" className={"flex items-center gap-2.5 " + className}>
      <span className="relative grid h-8 w-8 place-items-center rounded-xl bg-[image:var(--gradient-brand)] shadow-[var(--shadow-elegant)]">
        <span className="absolute inset-0.5 rounded-[10px] bg-black/15" />
        <span className="relative text-sm font-black text-white tracking-tight">N</span>
      </span>
      <span className="text-[17px] font-bold tracking-tight text-foreground">
        Nexora
      </span>
    </a>
  );
}

function Btn({
  children,
  href = "#",
  variant = "primary",
  size = "md",
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "ghost" | "outline" | "white";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-sm",
  };
  const base = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 ${sizes[size]}`;

  if (variant === "primary")
    return (
      <a href={href} className={`${base} bg-[image:var(--gradient-brand)] text-white shadow-[var(--shadow-elegant)] hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-16px_oklch(0.62_0.22_258/0.55)] ${className}`}>
        {children}
      </a>
    );
  if (variant === "white")
    return (
      <a href={href} className={`${base} bg-white text-[color:var(--brand-deep)] hover:-translate-y-0.5 hover:shadow-lg ${className}`}>
        {children}
      </a>
    );
  if (variant === "outline")
    return (
      <a href={href} className={`${base} border border-border bg-transparent text-foreground hover:bg-secondary hover:border-[color:var(--brand-electric)]/40 ${className}`}>
        {children}
      </a>
    );
  return (
    <a href={href} className={`${base} border border-border bg-background/60 text-foreground backdrop-blur hover:bg-secondary ${className}`}>
      {children}
    </a>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-electric)]">
      {children}
    </p>
  );
}

/* ─────────────────────────────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────────────────────────────── */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Features", href: "#features" },
    { label: "Solutions", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "AI", href: "#ai" },
    { label: "Resources", href: "#faq" },
    { label: "About", href: "#why" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-white/80 border-b border-border/60 shadow-[0_1px_0_oklch(0.14_0.02_260/0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Login
          </a>
          <Btn href="#contact" variant="outline" size="sm">
            Book Demo
          </Btn>
          <Btn href="#pricing" size="sm">
            Start Free Trial <ArrowRight className="h-3.5 w-3.5" />
          </Btn>
        </div>

        <button
          aria-label="Toggle menu"
          className="grid h-10 w-10 place-items-center rounded-lg border border-border lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-white/95 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary">
                Login
              </a>
              <Btn href="#contact" variant="outline" className="justify-center">
                Book Demo
              </Btn>
              <Btn href="#pricing" className="justify-center">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Btn>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* ─────────────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-glow pt-32 pb-20 lg:pt-44 lg:pb-28">
      {/* Subtle grid */}
      <div className="absolute inset-0 -z-10 [background-image:linear-gradient(oklch(0.14_0.02_260/0.035)_1px,transparent_1px),linear-gradient(90deg,oklch(0.14_0.02_260/0.035)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Left */}
        <div className="animate-rise">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--brand-electric)]/25 bg-[color:var(--brand-electric)]/8 px-3.5 py-1.5 text-xs font-semibold text-[color:var(--brand-electric)]">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[color:var(--brand-electric)]" />
            Nexora AI 2.0 — Now available
          </div>

          <h1 className="mt-6 text-5xl font-black leading-[1.03] tracking-tight text-foreground sm:text-6xl lg:text-[4.5rem]">
            The AI Business{" "}
            <span className="text-gradient">Operating System.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            One intelligent platform to run billing, inventory, customers, finance
            and teams — with an AI that reads your business and takes real action,
            not just gives advice.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Btn href="#pricing" size="lg">
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </Btn>
            <Btn href="#contact" variant="outline" size="lg">
              Book Demo
            </Btn>
            <a
              href="#ai"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-secondary">
                <Play className="h-3 w-3 fill-current" />
              </span>
              Watch product tour
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            {["14-day free trial", "No credit card required", "Cancel anytime"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[color:var(--brand-electric)]" /> {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right — Hero dashboard */}
        <HeroMockup />
      </div>
    </section>
  );
}

function HeroMockup() {
  return (
    <div className="relative animate-rise [animation-delay:100ms]">
      {/* Glow */}
      <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-[image:var(--gradient-brand)] opacity-[0.15] blur-3xl" />

      {/* Main dashboard card */}
      <div className="glass rounded-3xl p-3 shadow-[var(--shadow-elegant)]">
        <div className="overflow-hidden rounded-2xl bg-[color:var(--brand-deep)] shadow-inner">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
            <span className="ml-3 flex-1 rounded-md bg-white/5 px-3 py-1 text-[10px] text-white/40">
              nexora.app / dashboard
            </span>
            <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[9px] font-semibold text-emerald-300 uppercase tracking-wider">
              Live
            </span>
          </div>

          {/* Dashboard content */}
          <div className="p-4 text-white">
            {/* Greeting */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-white/40">Good morning, Aarav · Monday, 14 July</p>
                <p className="text-base font-semibold mt-0.5">Business Overview</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/10 cursor-pointer hover:bg-white/15 transition-colors">
                  <Bell className="h-3.5 w-3.5 text-white/70" />
                </span>
              </div>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {[
                { label: "Revenue", value: "₹1,24,860", tone: "text-emerald-300", delta: "+18%" },
                { label: "Orders", value: "348", tone: "text-sky-300", delta: "+12%" },
                { label: "Customers", value: "1,284", tone: "text-violet-300", delta: "+5%" },
                { label: "Profit", value: "₹41,220", tone: "text-amber-300", delta: "+9%" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-white/5 p-2.5">
                  <p className="text-[9px] uppercase tracking-wider text-white/40">{s.label}</p>
                  <p className={`mt-1 text-sm font-bold ${s.tone}`}>{s.value}</p>
                  <p className="text-[9px] text-emerald-400 mt-0.5">{s.delta}</p>
                </div>
              ))}
            </div>

            {/* Chart + panels row */}
            <div className="grid grid-cols-3 gap-2">
              {/* Revenue chart */}
              <div className="col-span-2 rounded-xl bg-white/5 p-3">
                <div className="mb-2 flex items-center justify-between text-[10px]">
                  <span className="text-white/50">Revenue · last 14 days</span>
                  <span className="text-emerald-400 font-semibold">+18.4%</span>
                </div>
                <div className="flex h-16 items-end gap-1">
                  {[38, 52, 44, 61, 55, 72, 65, 80, 74, 88, 82, 95, 90, 100].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-gradient-to-t from-[color:var(--brand-electric)]/30 to-[color:var(--brand-electric)]"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
              {/* Inventory */}
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-[9px] uppercase tracking-wider text-white/40 mb-2">Inventory</p>
                {[
                  { name: "Amul Gold 1L", pct: 78, color: "bg-emerald-400" },
                  { name: "Tata Salt 1kg", pct: 12, color: "bg-red-400" },
                  { name: "Colgate 150g", pct: 55, color: "bg-sky-400" },
                ].map((item) => (
                  <div key={item.name} className="mb-2">
                    <div className="flex justify-between mb-0.5">
                      <span className="text-[9px] text-white/50 truncate">{item.name}</span>
                      <span className="text-[9px] text-white/50">{item.pct}%</span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-white/10">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent invoices */}
            <div className="mt-2 rounded-xl bg-white/5 p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-semibold text-white/60">Recent Invoices</p>
                <p className="text-[9px] text-[color:var(--brand-glow)] cursor-pointer">View all →</p>
              </div>
              <div className="space-y-1.5">
                {[
                  { name: "Priya Traders", amt: "₹24,780", status: "Paid", color: "text-emerald-400" },
                  { name: "Cascade Foods", amt: "₹18,900", status: "Pending", color: "text-amber-400" },
                  { name: "Halcyon Group", amt: "₹1,20,000", status: "Overdue", color: "text-red-400" },
                ].map((inv) => (
                  <div key={inv.name} className="flex items-center justify-between text-[10px]">
                    <span className="text-white/60">{inv.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{inv.amt}</span>
                      <span className={`${inv.color} font-medium`}>{inv.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating: AI insight */}
      <div className="absolute -left-5 bottom-6 hidden animate-float sm:block">
        <div className="glass rounded-2xl px-4 py-3 min-w-[230px] shadow-lg">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground mb-1.5">
            <span className="grid h-5 w-5 place-items-center rounded-lg bg-[image:var(--gradient-brand)]">
              <Sparkles className="h-3 w-3 text-white" />
            </span>
            Nexora AI
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            "Tata Salt 1kg is critically low (4 units). Reorder now to avoid Friday stockout."
          </p>
        </div>
      </div>

      {/* Floating: Business health */}
      <div className="absolute -right-5 top-8 hidden animate-float-slower md:block">
        <div className="glass rounded-2xl px-4 py-3 min-w-[190px] shadow-lg">
          <p className="text-[9px] uppercase tracking-widest text-muted-foreground">Health Score</p>
          <p className="mt-1 text-2xl font-black text-foreground">92 <span className="text-sm font-medium text-emerald-500">/ 100</span></p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-secondary">
            <div className="h-full w-[92%] rounded-full bg-[image:var(--gradient-brand)]" />
          </div>
          <p className="mt-1.5 text-[10px] text-muted-foreground">Excellent · 2 alerts</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   STATS BANNER
───────────────────────────────────────────────────────────────── */

function StatsBanner() {
  const stats = [
    { value: "12,000+", label: "Businesses running on Nexora" },
    { value: "₹500 Cr+", label: "Invoices processed monthly" },
    { value: "4.9 / 5", label: "Average customer rating" },
    { value: "99.9%", label: "Platform uptime SLA" },
  ];
  return (
    <section className="border-y border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   TRUSTED BY
───────────────────────────────────────────────────────────────── */

function TrustedBy() {
  const logos = [
    "Northwind Co.", "Cascade Foods", "Meridian Retail", "Lumen Group",
    "Vertex Trade", "Halcyon Mart", "Pinnacle Stores", "Solaris Pharma",
    "BluePath Tech", "Zenith Foods", "Orbit Logistics", "Crestline Co.",
  ];
  return (
    <section className="py-14 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Trusted by 12,000+ growing Indian businesses
        </p>
      </div>
      <div className="mt-8 flex gap-0">
        <div className="flex shrink-0 animate-marquee items-center gap-12 pr-12">
          {logos.map((l) => (
            <span
              key={l}
              className="whitespace-nowrap text-base font-bold tracking-tight text-muted-foreground/50 transition-colors hover:text-foreground"
            >
              {l}
            </span>
          ))}
        </div>
        <div aria-hidden="true" className="flex shrink-0 animate-marquee items-center gap-12 pr-12">
          {logos.map((l) => (
            <span
              key={l + "-dup"}
              className="whitespace-nowrap text-base font-bold tracking-tight text-muted-foreground/50"
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FEATURE SHOWCASE — reusable alternating layout
───────────────────────────────────────────────────────────────── */

function FeatureShowcase({
  id,
  eyebrow,
  headline,
  description,
  items,
  badges,
  cta,
  preview,
  reverse = false,
  bg = "",
}: {
  id?: string;
  eyebrow: string;
  headline: string;
  description: string;
  items: string[];
  badges: string[];
  cta?: string;
  preview: () => ReactNode;
  reverse?: boolean;
  bg?: string;
}) {
  return (
    <section id={id} className={`relative py-24 lg:py-32 overflow-hidden ${bg}`}>
      <div className="mx-auto max-w-7xl px-6">
        <div className={`grid grid-cols-1 items-center gap-16 lg:grid-cols-2 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
          {/* Mockup side */}
          <div className="relative">
            {preview()}
          </div>

          {/* Copy side */}
          <div className={reverse ? "lg:pr-8" : "lg:pl-8"}>
            <SectionLabel>{eyebrow}</SectionLabel>
            <h2 className="mt-4 text-3xl font-black leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
              {headline}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground lg:text-[17px]">
              {description}
            </p>

            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {items.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                  <span className="grid h-5 w-5 flex-shrink-0 place-items-center rounded-full bg-[color:var(--brand-electric)]/10">
                    <Check className="h-3 w-3 text-[color:var(--brand-electric)]" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-2">
              {badges.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-[11px] font-semibold text-foreground shadow-[0_1px_4px_oklch(0.14_0.02_260/0.08)]"
                >
                  <CheckCircle2 className="h-3 w-3 text-[color:var(--brand-electric)]" />
                  {b}
                </span>
              ))}
            </div>

            <div className="mt-8">
              <a
                href="#pricing"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--brand-electric)] transition-all duration-200 hover:gap-3"
              >
                {cta ?? `Explore ${eyebrow}`}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   LARGE PREVIEW SHELL (browser-style, more premium)
───────────────────────────────────────────────────────────────── */

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
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        </div>
        <p className="text-[11px] font-medium text-muted-foreground">{title}</p>
        <div className="text-[11px] text-muted-foreground">{right}</div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function LargePreviewShell({
  url,
  badge,
  children,
  floats,
}: {
  url: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  floats?: React.ReactNode;
}) {
  return (
    <div className="relative">
      {/* Background glow */}
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-[image:var(--gradient-brand)] opacity-[0.12] blur-3xl" />

      {/* Browser window */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_80px_-20px_oklch(0.14_0.02_260/0.22),0_0_0_1px_oklch(0.14_0.02_260/0.05)]">
        {/* Chrome bar */}
        <div className="flex items-center gap-2 border-b border-border bg-secondary/60 px-5 py-3.5">
          <span className="h-3 w-3 rounded-full bg-red-400/70" />
          <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
          <span className="h-3 w-3 rounded-full bg-green-400/70" />
          <div className="ml-3 flex flex-1 items-center gap-1.5 rounded-md bg-border/60 px-3 py-1.5">
            <span className="text-[11px] text-muted-foreground/60">nexora.app /</span>
            <span className="text-[11px] font-medium text-muted-foreground">{url}</span>
          </div>
          {badge && <div className="ml-2">{badge}</div>}
        </div>
        {/* Content */}
        <div className="p-6">{children}</div>
      </div>

      {/* Floating cards */}
      {floats}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   BILLING PREVIEW (large)
───────────────────────────────────────────────────────────────── */

function BillingMockup() {
  return (
    <LargePreviewShell
      url="billing / invoices"
      badge={
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">
          GST Ready
        </span>
      }
      floats={
        <>
          {/* Floating: revenue card */}
          <div className="absolute -right-6 top-16 hidden animate-float-slower lg:block">
            <div className="glass rounded-2xl px-4 py-3.5 shadow-lg min-w-[160px]">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Today's Collections</p>
              <p className="mt-1.5 text-xl font-black text-foreground">₹64,320</p>
              <p className="mt-0.5 text-[11px] font-semibold text-emerald-600">↑ 12% vs yesterday</p>
            </div>
          </div>
          {/* Floating: QR sent */}
          <div className="absolute -left-6 bottom-10 hidden animate-float lg:block">
            <div className="glass rounded-2xl px-4 py-3 shadow-lg">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500">
                  <Check className="h-3 w-3 text-white" />
                </span>
                Payment received
              </div>
              <p className="mt-1 text-xs text-muted-foreground">₹24,780 · Priya Traders</p>
            </div>
          </div>
        </>
      }
    >
      {/* Invoice detail */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded-full bg-[color:var(--brand-electric)]/10 px-2.5 py-0.5 text-[10px] font-bold text-[color:var(--brand-electric)] uppercase tracking-wider">INV-1042</span>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600">Paid</span>
          </div>
          <p className="text-sm font-bold text-foreground">Priya Traders Pvt. Ltd.</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">GSTIN 29ABCDE1234F1Z5 · Due: 20 July</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-muted-foreground">Total</p>
          <p className="text-2xl font-black text-foreground mt-0.5">₹24,780</p>
        </div>
      </div>

      {/* Line items */}
      <div className="space-y-2 mb-4">
        {[
          { name: "Amul Gold 1L × 24 crates", qty: "576 units", gst: "5%", amt: "₹1,440" },
          { name: "Tata Salt 1kg × 40 bags", qty: "40 units", gst: "0%", amt: "₹960" },
          { name: "Maggi 70g × 60 boxes", qty: "60 units", gst: "18%", amt: "₹840" },
        ].map((r) => (
          <div key={r.name} className="flex items-center justify-between rounded-xl border border-border/60 bg-secondary/40 px-4 py-2.5 text-xs">
            <div>
              <p className="font-medium text-foreground">{r.name}</p>
              <p className="text-[10px] text-muted-foreground">{r.qty}</p>
            </div>
            <div className="flex items-center gap-4 text-right">
              <span className="text-[10px] text-muted-foreground">GST {r.gst}</span>
              <span className="font-semibold text-foreground min-w-[52px]">{r.amt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* GST summary */}
      <div className="flex items-center justify-between rounded-xl border border-dashed border-[color:var(--brand-electric)]/25 bg-[color:var(--brand-electric)]/5 px-4 py-3 mb-4">
        <div>
          <p className="text-[11px] text-muted-foreground">CGST 9% + SGST 9% — Auto calculated</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-muted-foreground">Tax</p>
          <p className="text-sm font-bold text-[color:var(--brand-electric)]">₹3,780</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { icon: QrCode, label: "UPI QR", style: "bg-secondary text-foreground border border-border" },
          { icon: Printer, label: "Thermal Print", style: "bg-secondary text-foreground border border-border" },
          { icon: FileText, label: "PDF Export", style: "bg-secondary text-foreground border border-border" },
          { icon: Check, label: "Mark Paid", style: "bg-[image:var(--gradient-brand)] text-white" },
        ].map(({ icon: Icon, label, style }) => (
          <button key={label} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ${style} transition-all hover:opacity-90`}>
            <Icon className="h-3 w-3" /> {label}
          </button>
        ))}
      </div>
    </LargePreviewShell>
  );
}

/* ─────────────────────────────────────────────────────────────────
   INVENTORY PREVIEW (large)
───────────────────────────────────────────────────────────────── */

function InventoryMockup() {
  const rows = [
    { name: "Amul Gold 1L", sku: "SKU-0021", stock: 128, capacity: 200, pct: 64, tone: "bg-emerald-400", status: "Healthy" },
    { name: "Tata Salt 1kg", sku: "SKU-0034", stock: 4, capacity: 100, pct: 4, tone: "bg-red-400", status: "Critical" },
    { name: "Maggi 70g", sku: "SKU-0058", stock: 9, capacity: 80, pct: 11, tone: "bg-amber-400", status: "Low" },
    { name: "Colgate MaxFresh", sku: "SKU-0072", stock: 46, capacity: 80, pct: 57, tone: "bg-sky-400", status: "Healthy" },
    { name: "Britannia Good Day", sku: "SKU-0091", stock: 72, capacity: 120, pct: 60, tone: "bg-emerald-400", status: "Healthy" },
  ];
  return (
    <LargePreviewShell
      url="inventory / stock"
      badge={
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live sync
        </span>
      }
      floats={
        <>
          <div className="absolute -left-6 top-20 hidden animate-float lg:block">
            <div className="glass rounded-2xl px-4 py-3.5 shadow-lg min-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-red-500">
                  <Bell className="h-3 w-3 text-white" />
                </span>
                <p className="text-xs font-semibold text-foreground">Restock Alert</p>
              </div>
              <p className="text-xs text-muted-foreground">2 items below threshold</p>
              <p className="text-xs font-semibold text-[color:var(--brand-electric)] mt-1.5 cursor-pointer">Create POs →</p>
            </div>
          </div>
          <div className="absolute -right-6 bottom-12 hidden animate-float-slower lg:block">
            <div className="glass rounded-2xl px-4 py-3 shadow-lg">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total SKUs</p>
              <p className="mt-1 text-xl font-black text-foreground">1,284</p>
              <p className="text-[11px] text-muted-foreground">3 warehouses</p>
            </div>
          </div>
        </>
      }
    >
      {/* Search */}
      <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-border bg-secondary/40 px-4 py-2.5">
        <Scan className="h-4 w-4 text-muted-foreground/60" />
        <span className="text-sm text-muted-foreground/60">Scan barcode or search products…</span>
        <span className="ml-auto text-[11px] text-[color:var(--brand-electric)] font-semibold cursor-pointer">+ Add Product</span>
      </div>

      {/* Headers */}
      <div className="mb-2 grid grid-cols-[1fr_auto_auto_auto] gap-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
        <span>Product</span>
        <span className="text-right">Stock</span>
        <span className="w-20 text-center">Level</span>
        <span className="w-14 text-right">Status</span>
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.name} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 rounded-xl border border-border/40 bg-secondary/30 px-3 py-2.5">
            <div>
              <p className="text-sm font-medium text-foreground">{r.name}</p>
              <p className="text-[10px] text-muted-foreground">{r.sku}</p>
            </div>
            <p className="text-sm font-bold text-foreground text-right">{r.stock}</p>
            <div className="w-20">
              <div className="h-1.5 w-full rounded-full bg-border">
                <div className={`h-full rounded-full ${r.tone}`} style={{ width: `${r.pct}%` }} />
              </div>
            </div>
            <span className={`w-14 rounded-full px-2 py-0.5 text-center text-[10px] font-semibold ${
              r.status === "Healthy" ? "bg-emerald-50 text-emerald-700" :
              r.status === "Critical" ? "bg-red-50 text-red-600" :
              "bg-amber-50 text-amber-700"
            }`}>{r.status}</span>
          </div>
        ))}
      </div>

      {/* AI suggestion */}
      <div className="mt-4 flex items-start gap-3 rounded-xl border border-[color:var(--brand-electric)]/20 bg-[color:var(--brand-electric)]/5 px-4 py-3">
        <span className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-[image:var(--gradient-brand)]">
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </span>
        <div>
          <p className="text-xs font-semibold text-foreground">AI Recommendation</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Reorder Tata Salt 1kg (200 units) and Maggi 70g (100 units) before Friday to avoid weekend stockout.</p>
        </div>
        <button className="ml-auto flex-shrink-0 rounded-full bg-[image:var(--gradient-brand)] px-3 py-1 text-[10px] font-semibold text-white">
          Order
        </button>
      </div>
    </LargePreviewShell>
  );
}

/* ─────────────────────────────────────────────────────────────────
   CRM PREVIEW (large)
───────────────────────────────────────────────────────────────── */

function CRMMockup() {
  const customers = [
    { name: "Meridian Retail", initials: "MR", ltv: "₹1.42L", orders: 48, tag: "VIP", health: 96, last: "2 hrs ago" },
    { name: "Cascade Foods", initials: "CF", ltv: "₹98,400", orders: 34, tag: "Loyal", health: 82, last: "Yesterday" },
    { name: "Halcyon Group", initials: "HG", ltv: "₹32,100", orders: 8, tag: "New", health: 61, last: "3 days ago" },
    { name: "Vertex Trade", initials: "VT", ltv: "₹2.18L", orders: 72, tag: "VIP", health: 99, last: "1 hr ago" },
  ];
  return (
    <LargePreviewShell
      url="crm / customers"
      badge={
        <span className="rounded-full bg-[color:var(--brand-electric)]/10 px-2.5 py-1 text-[10px] font-semibold text-[color:var(--brand-electric)]">
          Pipeline · Live
        </span>
      }
      floats={
        <>
          <div className="absolute -right-6 top-14 hidden animate-float-slower lg:block">
            <div className="glass rounded-2xl px-4 py-3.5 shadow-lg min-w-[170px]">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Won (MTD)</p>
              <p className="mt-1.5 text-xl font-black text-foreground">₹6.2L</p>
              <div className="mt-2 flex items-center gap-1">
                <span className="text-[11px] font-semibold text-emerald-600">↑ 24%</span>
                <span className="text-[11px] text-muted-foreground">vs last month</span>
              </div>
            </div>
          </div>
        </>
      }
    >
      {/* Pipeline KPIs */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        {[
          { l: "Total Customers", v: "5,821", c: "text-foreground" },
          { l: "Active Deals", v: "12", c: "text-[color:var(--brand-electric)]" },
          { l: "Due Follow-ups", v: "7", c: "text-amber-600" },
        ].map((k) => (
          <div key={k.l} className="rounded-xl border border-border/60 bg-secondary/40 p-3">
            <p className="text-[10px] text-muted-foreground">{k.l}</p>
            <p className={`mt-1 text-lg font-black ${k.c}`}>{k.v}</p>
          </div>
        ))}
      </div>

      {/* Customer list */}
      <div className="space-y-2">
        {customers.map((c) => (
          <div key={c.name} className="flex items-center gap-4 rounded-xl border border-border/40 bg-secondary/30 px-4 py-3 transition-colors hover:bg-secondary/60 cursor-pointer">
            <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-[image:var(--gradient-brand)] text-xs font-bold text-white">
              {c.initials}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">{c.name}</p>
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                  c.tag === "VIP" ? "bg-[image:var(--gradient-brand)] text-white" : "bg-secondary text-muted-foreground border border-border"
                }`}>{c.tag}</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">LTV {c.ltv} · {c.orders} orders · {c.last}</p>
            </div>
            <div className="flex items-center gap-3 text-right">
              <div>
                <div className="h-1 w-16 rounded-full bg-border">
                  <div className="h-full rounded-full bg-[image:var(--gradient-brand)]" style={{ width: `${c.health}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">{c.health}% health</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground/40" />
            </div>
          </div>
        ))}
      </div>
    </LargePreviewShell>
  );
}

/* ─────────────────────────────────────────────────────────────────
   REPORTS PREVIEW (large)
───────────────────────────────────────────────────────────────── */

function ReportsMockup() {
  const bars = [32, 48, 38, 60, 52, 70, 62, 80, 72, 88, 78, 95];
  const points = [18, 28, 22, 38, 32, 48, 42, 56, 50, 64, 58, 72];
  const w = 500;
  const h = 100;
  const step = w / (points.length - 1);
  const path = points.map((v, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (v / 100) * h}`).join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;

  return (
    <LargePreviewShell
      url="analytics / overview"
      badge={
        <span className="rounded-full bg-violet-500/10 px-2.5 py-1 text-[10px] font-semibold text-violet-600">
          Live · Auto-refresh
        </span>
      }
      floats={
        <>
          <div className="absolute -left-6 bottom-10 hidden animate-float lg:block">
            <div className="glass rounded-2xl px-4 py-3.5 shadow-lg min-w-[160px]">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Business Score</p>
              <p className="mt-1.5 text-2xl font-black text-foreground">92 <span className="text-sm font-normal text-muted-foreground">/ 100</span></p>
              <div className="mt-2 h-1.5 rounded-full bg-secondary">
                <div className="h-full w-[92%] rounded-full bg-[image:var(--gradient-brand)]" />
              </div>
            </div>
          </div>
        </>
      }
    >
      {/* KPI row */}
      <div className="mb-5 grid grid-cols-4 gap-2.5">
        {[
          { l: "Revenue", v: "₹8.4L", d: "+12%", tone: "text-emerald-600" },
          { l: "Profit", v: "₹2.1L", d: "+9%", tone: "text-emerald-600" },
          { l: "Expenses", v: "₹6.3L", d: "-3%", tone: "text-sky-600" },
          { l: "Orders", v: "2,148", d: "+7%", tone: "text-violet-600" },
        ].map((k) => (
          <div key={k.l} className="rounded-xl border border-border/60 bg-secondary/40 p-3">
            <p className="text-[10px] text-muted-foreground">{k.l}</p>
            <p className="mt-1 text-sm font-bold text-foreground">{k.v}</p>
            <p className={`text-[10px] font-semibold mt-0.5 ${k.tone}`}>{k.d}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="rounded-xl border border-border/60 bg-secondary/30 p-4 mb-3">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Revenue trend</p>
            <p className="text-[11px] text-muted-foreground">Last 12 months</p>
          </div>
          <div className="flex gap-1">
            {["1M", "3M", "6M", "1Y"].map((t, i) => (
              <span key={t} className={`rounded-full px-2.5 py-1 text-[10px] cursor-pointer transition-colors ${i === 3 ? "bg-[color:var(--brand-electric)] text-white font-semibold" : "text-muted-foreground hover:text-foreground"}`}>
                {t}
              </span>
            ))}
          </div>
        </div>
        <svg viewBox={`0 0 ${w} ${h}`} className="h-24 w-full">
          <defs>
            <linearGradient id="rptArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.62 0.22 258)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="oklch(0.62 0.22 258)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#rptArea)" />
          <path d={path} fill="none" stroke="oklch(0.55 0.24 258)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Top products mini row */}
      <div className="flex items-center gap-2">
        <p className="text-[11px] font-semibold text-muted-foreground shrink-0">Top products:</p>
        {["Amul Gold 1L", "Colgate MaxF.", "Maggi 70g"].map((p, i) => (
          <span key={p} className="rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-medium text-foreground">
            {i + 1}. {p}
          </span>
        ))}
      </div>
    </LargePreviewShell>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FINANCE PREVIEW (large)
───────────────────────────────────────────────────────────────── */

function FinanceMockup() {
  return (
    <LargePreviewShell
      url="finance / cash-flow"
      badge={
        <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold text-amber-600">
          Reconciled ✓
        </span>
      }
      floats={
        <>
          <div className="absolute -right-6 top-20 hidden animate-float-slower lg:block">
            <div className="glass rounded-2xl px-4 py-3.5 shadow-lg min-w-[165px]">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">30-day Forecast</p>
              <p className="mt-1.5 text-xl font-black text-foreground">₹9.2L</p>
              <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">↑ Positive cashflow</p>
            </div>
          </div>
        </>
      }
    >
      {/* P&L summary */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        {[
          { l: "Total Income", v: "₹8,42,910", bar: 100, tone: "bg-emerald-400", textTone: "text-emerald-600" },
          { l: "Total Expenses", v: "₹4,71,220", bar: 56, tone: "bg-red-400", textTone: "text-red-500" },
          { l: "Net Profit", v: "₹3,71,690", bar: 44, tone: "bg-[color:var(--brand-electric)]", textTone: "text-[color:var(--brand-electric)]" },
          { l: "GST Liability", v: "₹92,210", bar: 11, tone: "bg-amber-400", textTone: "text-amber-600" },
        ].map((k) => (
          <div key={k.l} className="rounded-xl border border-border/60 bg-secondary/40 p-3">
            <p className="text-[10px] text-muted-foreground">{k.l}</p>
            <p className={`mt-1 text-sm font-bold ${k.textTone}`}>{k.v}</p>
            <div className="mt-2 h-1 w-full rounded-full bg-border">
              <div className={`h-full rounded-full ${k.tone}`} style={{ width: `${k.bar}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Bank reconciliation */}
      <div className="rounded-xl border border-border/60 bg-secondary/30 p-4 mb-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Bank Reconciliation</p>
            <p className="text-[11px] text-muted-foreground">HDFC · October 2025</p>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">94% matched</span>
        </div>
        <div className="h-2 w-full rounded-full bg-secondary">
          <div className="h-full w-[94%] rounded-full bg-[image:var(--gradient-brand)]" />
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>1,842 transactions matched</span>
          <span className="text-amber-600 font-semibold">12 need review</span>
        </div>
      </div>

      {/* Expense categories */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { cat: "COGS", amt: "₹2.8L" },
          { cat: "Staff", amt: "₹92K" },
          { cat: "Rent", amt: "₹45K" },
          { cat: "Utilities", amt: "₹18K" },
        ].map((e) => (
          <div key={e.cat} className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-[11px]">
            <span className="font-medium text-foreground">{e.cat}</span>
            <span className="text-muted-foreground">{e.amt}</span>
          </div>
        ))}
      </div>
    </LargePreviewShell>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MULTI-BRANCH PREVIEW (large)
───────────────────────────────────────────────────────────────── */

function MultiBranchMockup() {
  const branches = [
    { name: "Bengaluru HQ", city: "Karnataka", rev: "₹3.2L", delta: "+14%", health: 96, status: "Excellent" },
    { name: "Mumbai · Andheri", city: "Maharashtra", rev: "₹2.1L", delta: "+9%", health: 88, status: "Good" },
    { name: "Delhi · Karol Bagh", city: "Delhi", rev: "₹1.6L", delta: "+4%", health: 74, status: "Monitor" },
    { name: "Chennai · T. Nagar", city: "Tamil Nadu", rev: "₹1.5L", delta: "+11%", health: 91, status: "Good" },
  ];
  return (
    <LargePreviewShell
      url="branches / overview"
      badge={
        <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-[10px] font-semibold text-sky-600">
          4 branches · Central view
        </span>
      }
      floats={
        <>
          <div className="absolute -right-6 bottom-14 hidden animate-float-slower lg:block">
            <div className="glass rounded-2xl px-4 py-3.5 shadow-lg min-w-[165px]">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Combined Revenue</p>
              <p className="mt-1.5 text-xl font-black text-foreground">₹8.4L</p>
              <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">↑ 9.5% MTD</p>
            </div>
          </div>
        </>
      }
    >
      {/* Summary row */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        {[
          { l: "Total Revenue", v: "₹8.4L" },
          { l: "Active Users", v: "28" },
          { l: "Stock Transfers", v: "14" },
        ].map((k) => (
          <div key={k.l} className="rounded-xl border border-border/60 bg-secondary/40 p-3">
            <p className="text-[10px] text-muted-foreground">{k.l}</p>
            <p className="mt-1 text-sm font-bold text-foreground">{k.v}</p>
          </div>
        ))}
      </div>

      {/* Branch list */}
      <div className="space-y-2">
        {branches.map((b) => (
          <div key={b.name} className="flex items-center gap-4 rounded-xl border border-border/40 bg-secondary/30 px-4 py-3 transition-colors hover:bg-secondary/60 cursor-pointer">
            <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl border border-border bg-background">
              <Building2 className="h-4 w-4 text-[color:var(--brand-deep)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{b.name}</p>
              <p className="text-[11px] text-muted-foreground">{b.city}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">{b.rev}</p>
                <p className="text-[10px] font-semibold text-emerald-600">{b.delta}</p>
              </div>
              <div>
                <div className="h-1 w-20 rounded-full bg-border">
                  <div className="h-full rounded-full bg-[image:var(--gradient-brand)]" style={{ width: `${b.health}%` }} />
                </div>
                <p className={`text-[10px] mt-0.5 font-semibold ${b.status === "Excellent" || b.status === "Good" ? "text-emerald-600" : "text-amber-600"}`}>{b.status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed border-border bg-secondary/30 px-4 py-2.5 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5"><Key className="h-3 w-3" /> Role-based access · Central billing</span>
        <span className="text-emerald-600 font-semibold">All systems active</span>
      </div>
    </LargePreviewShell>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FEATURES — 6 alternating showcase sections
───────────────────────────────────────────────────────────────── */

function Features() {
  return (
    <div id="features">
      {/* Billing — image left, text right */}
      <FeatureShowcase
        eyebrow="Billing & Invoicing"
        headline="Billing that works as fast as your business."
        description="Create GST-compliant invoices, quotations, purchase bills and recurring invoices from one intelligent workspace. UPI QR, thermal printing and auto payment reminders built in."
        items={[
          "GST Invoices & Quotations",
          "Purchase Bills & Credit Notes",
          "Recurring Invoices",
          "Multiple Invoice Templates",
          "PDF Export & Thermal Print",
          "UPI Payment QR",
          "Razorpay & PhonePe",
          "Auto Payment Reminders",
          "Outstanding Tracking",
          "GSTR-1 Export",
        ]}
        badges={["GST Certified", "Razorpay Ready", "UPI Payments", "Thermal Printing"]}
        cta="Explore Billing"
        preview={() => <BillingMockup />}
      />

      {/* Inventory — image right, text left */}
      <FeatureShowcase
        eyebrow="Inventory Management"
        headline="Every product, every unit, always accurate."
        description="Real-time stock updates with every sale and purchase. Batch tracking, expiry alerts, barcode scanning and AI-powered restock suggestions keep shelves full and cash flowing."
        items={[
          "Unlimited Products & Categories",
          "Barcode Generation & Scanner",
          "Batch & Expiry Tracking",
          "Low Stock Alerts",
          "Purchase Orders",
          "Supplier Management",
          "Multi-location Inventory",
          "Stock Transfer",
          "Inventory Valuation",
          "Auto Restock Suggestions",
        ]}
        badges={["Barcode Ready", "Multi-Warehouse", "Real-time Sync", "AI Reorder"]}
        cta="Explore Inventory"
        preview={() => <InventoryMockup />}
        reverse
        bg="bg-secondary/30"
      />

      {/* CRM — image left, text right */}
      <FeatureShowcase
        eyebrow="CRM & Customer Management"
        headline="Every customer relationship, in one place."
        description="Complete customer profiles with full purchase history, outstanding dues, loyalty points and sales pipeline status. Follow-ups and reminders run automatically so nothing slips through."
        items={[
          "Customer Database & 360° View",
          "Full Purchase History",
          "Sales Pipeline",
          "Lead Management",
          "Follow-up Reminders",
          "Customer Segmentation",
          "Loyalty Program",
          "Outstanding Tracking",
          "Customer Analytics",
        ]}
        badges={["360° Customer View", "Pipeline Tracking", "Auto Follow-ups", "Loyalty Points"]}
        cta="Explore CRM"
        preview={() => <CRMMockup />}
      />

      {/* Reports — image right, text left */}
      <FeatureShowcase
        eyebrow="Reports & Analytics"
        headline="Every number, live. Every insight, instant."
        description="Live P&L, revenue trends, business health score, tax summaries and employee performance — always current, always precise. Monthly close drops from weeks to hours."
        items={[
          "Daily & Monthly Sales Reports",
          "Profit & Loss Statement",
          "Revenue Analytics",
          "Best & Slow-Moving Products",
          "Customer Analytics",
          "Employee Performance",
          "Tax Reports & GST Summary",
          "Business Health Dashboard",
          "Export to PDF & Excel",
        ]}
        badges={["Live Dashboard", "GST Summary", "P&L Reports", "Export to Excel"]}
        cta="Explore Analytics"
        preview={() => <ReportsMockup />}
        reverse
        bg="bg-secondary/30"
      />

      {/* Finance — image left, text right */}
      <FeatureShowcase
        eyebrow="Finance & Cash Flow"
        headline="Full financial clarity, zero surprises."
        description="Track every rupee in and out. Cash flow forecasting, expense management, bank reconciliation and tax summary in one cockpit. Know your position 30 days ahead."
        items={[
          "Expense Management",
          "Income Tracking",
          "Cash Flow Dashboard",
          "30-Day Forecast",
          "Profit Tracking",
          "Tax Summary",
          "Bank Reconciliation",
          "Financial Dashboard",
        ]}
        badges={["Bank Reconciliation", "30-day Forecast", "Tax Summary", "Auto-Categorise"]}
        cta="Explore Finance"
        preview={() => <FinanceMockup />}
      />

      {/* Multi-Branch — image right, text left */}
      <FeatureShowcase
        eyebrow="Multi-Branch Management"
        headline="Run every location from one command centre."
        description="Unlimited branches, centralised reporting and branch-wise inventory — all visible from a single login. Role-based access ensures the right people see the right data."
        items={[
          "Unlimited Branch Management",
          "Centralised Dashboard",
          "Branch Performance Comparison",
          "Branch-wise Inventory",
          "Branch-wise Reports",
          "Central Billing",
          "Role-Based Access",
          "Stock Transfer Between Branches",
        ]}
        badges={["Unlimited Branches", "Central Billing", "Role-Based Access", "Stock Transfer"]}
        cta="Explore Multi-Branch"
        preview={() => <MultiBranchMockup />}
        reverse
        bg="bg-secondary/30"
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   AI SHOWCASE
───────────────────────────────────────────────────────────────── */

const CHAT_MESSAGES: { role: "user" | "ai"; text: string; action?: string }[] = [
  { role: "user", text: "How did sales perform today?" },
  { role: "ai", text: "You've done ₹64,320 across 87 invoices — up 12% vs yesterday. Best seller: Amul Gold 1L (42 units). One customer, Meridian Retail, accounts for 28% of today's revenue." },
  { role: "user", text: "Create an invoice for Priya Traders, 3 usual items." },
  { role: "ai", text: "Drafted INV-1042 for Priya Traders with their 3 most frequent items. GST auto-calculated (₹3,780). Shall I send to their registered email or print?", action: "Preview Invoice" },
  { role: "user", text: "Which products need restocking this week?" },
  { role: "ai", text: "3 items below reorder threshold: Tata Salt 1kg (4 left · reorder 200), Colgate MaxFresh (6 left · reorder 50), Maggi 70g (9 left · reorder 100). Shall I create purchase orders?", action: "Create POs" },
  { role: "user", text: "What's my GST liability for October?" },
  { role: "ai", text: "Output GST: ₹1,84,320 · Input Credit: ₹92,110 · Net payable: ₹92,210. GSTR-1 ready for filing. Due date: 11 November." },
];

function AIShowcase() {
  return (
    <section id="ai" className="relative overflow-hidden bg-[color:var(--brand-deep)] py-24 text-white lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_15%_0%,oklch(0.62_0.22_258/0.4),transparent_55%),radial-gradient(700px_400px_at_100%_100%,oklch(0.72_0.19_250/0.28),transparent_55%)]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2">
        {/* Left */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-glow)]">
            Nexora AI
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            An operator who never sleeps,{" "}
            <span className="text-[color:var(--brand-glow)]">inside your business.</span>
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/65">
            Ask in plain English or Hindi. Nexora AI understands your full business context — sales, inventory, customers, cash flow — and takes real actions, not just answers.
          </p>

          <div className="mt-8 space-y-4">
            {[
              { icon: Brain, title: "Answers business questions in seconds", desc: "Revenue, profit, top customers, tax liability — ask anything, get precise answers instantly." },
              { icon: FileText, title: "Drafts invoices, reports and reminders for you", desc: "Say 'create an invoice for Priya Traders' and it's done. With correct GST, in 3 seconds." },
              { icon: Bell, title: "Catches problems before they cost you", desc: "Detects stock issues, overdue invoices, cash flow risks and anomalies before they escalate." },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-white/10">
                  <item.icon className="h-5 w-5 text-[color:var(--brand-glow)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-0.5 text-sm text-white/55">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Btn href="#pricing" variant="white" size="lg">
              Try Nexora AI Free <ArrowRight className="h-4 w-4" />
            </Btn>
          </div>
        </div>

        {/* Right: chat UI */}
        <div className="glass-dark rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-brand)]">
                <Sparkles className="h-4 w-4 text-white" />
              </span>
              <div>
                <p className="text-sm font-semibold">Nexora AI</p>
                <p className="text-[10px] text-white/45">Trained on your business data</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Ready
            </span>
          </div>

          <div className="max-h-[420px] overflow-y-auto p-5 space-y-3 scrollbar-hide">
            {CHAT_MESSAGES.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[88%] space-y-2">
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-white text-[color:var(--brand-deep)] font-medium"
                      : "bg-white/10 text-white"
                  }`}>
                    {m.text}
                  </div>
                  {m.action && (
                    <button className="flex items-center gap-1.5 rounded-full border border-[color:var(--brand-electric)]/40 bg-[color:var(--brand-electric)]/15 px-3 py-1.5 text-[11px] font-semibold text-[color:var(--brand-glow)] transition-colors hover:bg-[color:var(--brand-electric)]/25">
                      <Check className="h-3 w-3" /> {m.action}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-3">
              <Sparkles className="h-4 w-4 text-white/40 flex-shrink-0" />
              <input
                disabled
                placeholder="Ask Nexora anything about your business…"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none"
              />
              <button className="grid h-7 w-7 place-items-center rounded-full bg-[image:var(--gradient-brand)] flex-shrink-0">
                <ArrowRight className="h-3.5 w-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   DASHBOARD PREVIEW
───────────────────────────────────────────────────────────────── */

function DashboardPreview() {
  return (
    <section className="relative py-24 lg:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <SectionLabel>Command Centre</SectionLabel>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            See every part of your business, in real time.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground lg:text-lg">
            One clean command centre for revenue, orders, customers, profit, inventory and outstanding payments — updated the moment a transaction happens.
          </p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-3 shadow-[var(--shadow-elegant)] sm:p-4">
          <div className="overflow-hidden rounded-2xl border border-border bg-background">
            {/* KPI row */}
            <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
              {[
                { icon: Wallet, label: "Revenue", value: "₹8,42,910", delta: "+12.3%", sub: "vs last month" },
                { icon: ShoppingCart, label: "Orders", value: "2,148", delta: "+6.8%", sub: "vs last month" },
                { icon: Users, label: "Customers", value: "5,821", delta: "+3.2%", sub: "active buyers" },
                { icon: TrendingUp, label: "Net Profit", value: "₹2,10,480", delta: "+9.1%", sub: "margin 25%" },
              ].map((k) => (
                <div key={k.label} className="bg-card px-6 py-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium text-muted-foreground">{k.label}</p>
                    <k.icon className="h-4 w-4 text-muted-foreground/60" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{k.value}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-emerald-600">{k.delta}</span>
                    <span className="text-xs text-muted-foreground">{k.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart + pending */}
            <div className="grid grid-cols-1 gap-px bg-border lg:grid-cols-3">
              <div className="col-span-2 bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Revenue trend</p>
                    <p className="text-xs text-muted-foreground">Last 30 days</p>
                  </div>
                  <div className="flex gap-1 text-[11px]">
                    {["1W", "1M", "3M", "1Y"].map((r, i) => (
                      <span key={r} className={`rounded-full px-2.5 py-1 cursor-pointer transition-colors ${
                        i === 1 ? "bg-secondary font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}>
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
                <ChartArea />
              </div>
              <div className="bg-card p-6">
                <p className="text-sm font-semibold text-foreground">Outstanding payments</p>
                <p className="text-xs text-muted-foreground mt-0.5">12 invoices · ₹3,24,110</p>
                <div className="mt-5 space-y-4">
                  {[
                    { name: "Meridian Traders", amt: "₹42,300", status: "Due in 2 days", urgent: false },
                    { name: "Cascade Foods", amt: "₹18,900", status: "Due tomorrow", urgent: true },
                    { name: "Halcyon Retail", amt: "₹1,20,000", status: "Overdue 3 days", urgent: true },
                    { name: "Vertex Wholesale", amt: "₹24,600", status: "Due in 5 days", urgent: false },
                  ].map((p) => (
                    <div key={p.name} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{p.name}</p>
                        <p className={`text-[11px] font-medium ${p.urgent ? "text-red-500" : "text-muted-foreground"}`}>
                          {p.status}
                        </p>
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
  const path = points.map((v, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (v / max) * h}`).join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-36 w-full">
      <defs>
        <linearGradient id="chartArea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.62 0.22 258)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="oklch(0.62 0.22 258)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#chartArea)" />
      <path d={path} fill="none" stroke="oklch(0.55 0.24 258)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   INTEGRATIONS
───────────────────────────────────────────────────────────────── */

const INTEGRATIONS = [
  { name: "Razorpay", category: "Payments", color: "bg-blue-50 border-blue-100 text-blue-700" },
  { name: "PhonePe", category: "Payments", color: "bg-violet-50 border-violet-100 text-violet-700" },
  { name: "Stripe", category: "Payments", color: "bg-indigo-50 border-indigo-100 text-indigo-700" },
  { name: "UPI", category: "Payments", color: "bg-orange-50 border-orange-100 text-orange-700" },
  { name: "WhatsApp", category: "Messaging", color: "bg-green-50 border-green-100 text-green-700" },
  { name: "Google Workspace", category: "Productivity", color: "bg-red-50 border-red-100 text-red-700" },
  { name: "Microsoft 365", category: "Productivity", color: "bg-sky-50 border-sky-100 text-sky-700" },
  { name: "Google Sheets", category: "Data", color: "bg-emerald-50 border-emerald-100 text-emerald-700" },
  { name: "Google Drive", category: "Storage", color: "bg-yellow-50 border-yellow-100 text-yellow-700" },
  { name: "Excel / CSV", category: "Data", color: "bg-green-50 border-green-100 text-green-700" },
  { name: "Barcode Scanner", category: "Hardware", color: "bg-slate-50 border-slate-100 text-slate-700" },
  { name: "Thermal Printer", category: "Hardware", color: "bg-slate-50 border-slate-100 text-slate-700" },
  { name: "Gmail", category: "Email", color: "bg-red-50 border-red-100 text-red-700" },
  { name: "Developer API", category: "Platform", color: "bg-neutral-50 border-neutral-100 text-neutral-700" },
  { name: "Webhooks", category: "Platform", color: "bg-neutral-50 border-neutral-100 text-neutral-700" },
  { name: "Tally", category: "Accounting", color: "bg-blue-50 border-blue-100 text-blue-700" },
];

function Integrations() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <SectionLabel>Integrations</SectionLabel>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Connects with the tools you already use.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Nexora plugs into your existing payment rails, communication channels, hardware and productivity stack — no migration, no friction.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {INTEGRATIONS.map((int) => (
            <div
              key={int.name}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-4 shadow-[0_1px_4px_oklch(0.14_0.02_260/0.07)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--brand-electric)]/30 hover:shadow-[var(--shadow-elegant)]"
            >
              <span className={`grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl border text-xs font-bold ${int.color}`}>
                {int.name.charAt(0)}
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{int.name}</p>
                <p className="text-[11px] text-muted-foreground">{int.category}</p>
              </div>
            </div>
          ))}
          {/* API card */}
          <div className="group flex items-center justify-center gap-2 rounded-2xl border border-dashed border-[color:var(--brand-electric)]/30 bg-[color:var(--brand-electric)]/5 px-4 py-4 transition-all duration-300 hover:bg-[color:var(--brand-electric)]/10 cursor-pointer">
            <Puzzle className="h-4 w-4 text-[color:var(--brand-electric)]" />
            <span className="text-sm font-semibold text-[color:var(--brand-electric)]">Build your own</span>
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Can't see your tool?{" "}
          <a href="#contact" className="font-semibold text-[color:var(--brand-electric)] hover:underline underline-offset-4">
            Request an integration →
          </a>
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SECURITY & TRUST
───────────────────────────────────────────────────────────────── */

function Security() {
  const pillars = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      desc: "All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Your business data is never readable by anyone but you.",
    },
    {
      icon: Cloud,
      title: "Automatic Cloud Backup",
      desc: "Daily automated backups with 30-day point-in-time restore. Business continuity guaranteed even in disaster scenarios.",
    },
    {
      icon: Key,
      title: "Role-Based Access Control",
      desc: "Define exactly what each employee can see and do. Cashiers, managers, accountants — each with the right access level.",
    },
    {
      icon: FileText,
      title: "Complete Audit Logs",
      desc: "Every action, change and login is logged with user, time and IP. Full accountability across your entire team.",
    },
    {
      icon: Shield,
      title: "99.9% Uptime SLA",
      desc: "Hosted on enterprise-grade cloud infrastructure with automatic failover. Your business never stops because Nexora does.",
    },
    {
      icon: Globe,
      title: "GST Compliance Built In",
      desc: "Stays current with every GST notification. GSTR-1 export, e-invoice, and e-way bills handled automatically.",
    },
  ];
  return (
    <section className="py-24 lg:py-32 bg-[color:var(--brand-deep)] text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-glow)]">Enterprise Trust</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Enterprise-grade security,{" "}
            <span className="text-[color:var(--brand-glow)]">SMB-friendly pricing.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/60">
            The same security standards used by Fortune 500 companies — available to every business on Nexora from day one.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="group rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur transition-all duration-300 hover:bg-white/10 hover:border-[color:var(--brand-glow)]/30"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-[color:var(--brand-glow)] transition-colors group-hover:bg-[image:var(--gradient-brand)]">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-center gap-6">
          {[
            "AES-256 Encryption", "TLS 1.3 in Transit", "Daily Backups",
            "RBAC Access Control", "GST Compliant", "99.9% SLA",
          ].map((badge) => (
            <span key={badge} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80">
              <CheckCircle2 className="h-3.5 w-3.5 text-[color:var(--brand-glow)]" />
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────────────────────────────── */

const TESTIMONIALS = [
  {
    quote: "We replaced four different tools with Nexora. Monthly closing dropped from 2 weeks to 2 days. The AI catches things I'd miss on my busiest days.",
    name: "Priya Sharma",
    role: "Founder",
    company: "Meridian Retail, Bengaluru",
    revenue: "₹2.4 Cr annual revenue",
  },
  {
    quote: "The AI flagged a stock issue on a Friday afternoon that would have cost us a full weekend of sales. That one alert paid for a year's subscription.",
    name: "Rahul Menon",
    role: "COO",
    company: "Cascade Foods, Mumbai",
    revenue: "₹1.8 Cr annual revenue",
  },
  {
    quote: "One login for billing, inventory and reports across all 4 branches. Our store managers actually enjoy using it — that alone was worth it.",
    name: "Ananya Iyer",
    role: "Head of Operations",
    company: "Halcyon Group, Chennai",
    revenue: "4 branches · ₹5.1 Cr revenue",
  },
];

function Testimonials() {
  return (
    <section className="bg-secondary/40 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <SectionLabel>Customer Stories</SectionLabel>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Real businesses. Measurable results.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Nexora customers don't just save time — they make better decisions, catch more problems and grow faster.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-3xl border border-border bg-white p-8 shadow-[0_1px_4px_oklch(0.14_0.02_260/0.07)] transition-all duration-300 hover:shadow-[var(--shadow-elegant)] hover:-translate-y-0.5"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <blockquote className="flex-1 text-base leading-relaxed text-foreground">
                "{t.quote}"
              </blockquote>

              <figcaption className="mt-6 pt-6 border-t border-border flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-[image:var(--gradient-brand)] text-sm font-bold text-white flex-shrink-0">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role} · {t.company}</p>
                  <p className="text-xs font-medium text-[color:var(--brand-electric)] mt-0.5">{t.revenue}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   PRICING
───────────────────────────────────────────────────────────────── */

const PLANS = [
  {
    name: "Starter",
    price: "₹299",
    period: "/month",
    tagline: "For solo operators and small shops.",
    highlight: false,
    badge: null,
    features: [
      "Dashboard & analytics",
      "GST billing & invoicing",
      "Up to 500 invoices/month",
      "Customer management",
      "Inventory management",
      "Basic AI assistant",
      "PDF export & print",
      "Email support",
    ],
    cta: "Start Free Trial",
  },
  {
    name: "Growth",
    price: "₹499",
    period: "/month",
    tagline: "For growing businesses that need everything.",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Everything in Starter",
      "Unlimited invoices",
      "CRM & sales pipeline",
      "Finance & cash flow",
      "Full AI business assistant",
      "Recurring invoices",
      "Multi-user (up to 5)",
      "Razorpay & PhonePe",
      "WhatsApp notifications",
      "Priority support",
    ],
    cta: "Start Free Trial",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    tagline: "For multi-branch and high-volume operations.",
    highlight: false,
    badge: null,
    features: [
      "Everything in Growth",
      "Multi-branch management",
      "Unlimited users",
      "Advanced AI & forecasting",
      "Custom integrations",
      "SLA guarantee",
      "Dedicated account manager",
      "Custom onboarding",
      "API access & webhooks",
      "SSO & advanced RBAC",
    ],
    cta: "Talk to Sales",
  },
];

function Pricing() {
  return (
    <section id="pricing" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <SectionLabel>Pricing</SectionLabel>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Simple, honest pricing.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            No hidden fees. No per-feature upsells. Choose a plan and get everything listed — including a 14-day free trial on every paid plan.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative overflow-hidden rounded-3xl border transition-all duration-300 ${
                plan.highlight
                  ? "border-[color:var(--brand-electric)]/40 bg-[color:var(--brand-deep)] text-white shadow-[var(--shadow-elegant)] scale-[1.02]"
                  : "border-border bg-white shadow-[0_1px_4px_oklch(0.14_0.02_260/0.07)] hover:shadow-[var(--shadow-elegant)] hover:-translate-y-1"
              }`}
            >
              {plan.highlight && (
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_300px_at_100%_0%,oklch(0.72_0.19_250/0.3),transparent_60%)]" />
              )}
              {plan.badge && (
                <div className="absolute -right-8 top-5 rotate-45 bg-[image:var(--gradient-brand)] px-10 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  {plan.badge}
                </div>
              )}

              <div className="relative p-8">
                <p className={`text-sm font-semibold ${plan.highlight ? "text-[color:var(--brand-glow)]" : "text-[color:var(--brand-electric)]"}`}>
                  {plan.name}
                </p>
                <p className={`mt-1 text-sm ${plan.highlight ? "text-white/60" : "text-muted-foreground"}`}>
                  {plan.tagline}
                </p>

                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className={`text-5xl font-black tracking-tight ${plan.highlight ? "text-white" : "text-foreground"}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`text-sm ${plan.highlight ? "text-white/50" : "text-muted-foreground"}`}>
                      {plan.period} · GST inclusive
                    </span>
                  )}
                </div>

                <ul className={`mt-7 space-y-3 text-sm ${plan.highlight ? "text-white/80" : "text-foreground/80"}`}>
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className={`mt-0.5 h-4 w-4 flex-shrink-0 ${plan.highlight ? "text-[color:var(--brand-glow)]" : "text-[color:var(--brand-electric)]"}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`mt-8 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                    plan.highlight
                      ? "bg-white text-[color:var(--brand-deep)] hover:shadow-lg"
                      : "bg-[image:var(--gradient-brand)] text-white shadow-[var(--shadow-elegant)] hover:shadow-[0_24px_60px_-16px_oklch(0.62_0.22_258/0.5)]"
                  }`}
                >
                  {plan.cta} <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          All plans include a 14-day free trial. No credit card required to start.{" "}
          <a href="#faq" className="font-semibold text-[color:var(--brand-electric)] hover:underline underline-offset-4">
            Have questions? See FAQ →
          </a>
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   COMING SOON (ROADMAP)
───────────────────────────────────────────────────────────────── */

const ROADMAP = [
  {
    icon: UserCog,
    title: "Employee Management",
    desc: "A complete HR toolkit — attendance, payroll and performance built directly into your business OS.",
    items: ["Employee Profiles", "Attendance", "Leave Management", "Payroll", "Shift Scheduling", "Performance Tracking", "Employee Mobile App"],
  },
  {
    icon: ShieldCheck,
    title: "Advanced Role & Permissions",
    desc: "Granular access control with pre-built roles and approval workflows for every business shape.",
    items: ["Super Admin", "Manager", "Cashier", "Accountant", "Warehouse Staff", "Custom Roles", "Approval Workflows", "Activity Logs"],
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Business",
    desc: "Sell, notify and support your customers where they already spend their time.",
    items: ["Send Invoices", "Payment Reminders", "Order Notifications", "AI Customer Chat", "Broadcast Messages", "WhatsApp Catalog"],
  },
  {
    icon: Smartphone,
    title: "Native Mobile Apps",
    desc: "Full-featured Android and iOS apps to run the business from your pocket — even offline.",
    items: ["Android App", "iOS App", "Offline Mode", "Push Notifications", "Mobile Dashboard"],
  },
  {
    icon: Bot,
    title: "Specialised AI Agents",
    desc: "Dedicated AI agents for sales, inventory, accounting, marketing and customer support.",
    items: ["AI Sales Agent", "AI Inventory Manager", "AI Accountant", "AI Marketing", "AI Customer Support", "Voice Assistant"],
  },
  {
    icon: Puzzle,
    title: "Extended Integrations",
    desc: "Connect to Tally, Zoho, QuickBooks, POS machines and the full suite of Indian enterprise tools.",
    items: ["Tally Export", "Zoho Books", "QuickBooks", "POS Machines", "e-Invoice (IRN)", "e-Way Bill"],
  },
];

function ComingSoon() {
  return (
    <section id="roadmap" className="relative overflow-hidden py-24 lg:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--brand-electric)]/30 bg-[color:var(--brand-electric)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-electric)]">
            <Zap className="h-3 w-3" /> On the roadmap
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Coming soon to{" "}
            <span className="text-gradient">Nexora</span>.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            The platform ships new capability every month. Here's a transparent look at what's being built next. Every feature below is <strong>planned, not yet available</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {ROADMAP.map((r, i) => (
            <div
              key={r.title}
              className="group relative overflow-hidden rounded-3xl border border-dashed border-border bg-white p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[color:var(--brand-electric)]/40 hover:shadow-[var(--shadow-elegant)]"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[image:var(--gradient-brand)] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-15" />
              <div className="flex items-start justify-between gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-[color:var(--brand-deep)] transition-all duration-500 group-hover:bg-[image:var(--gradient-brand)] group-hover:text-white">
                  <r.icon className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--brand-electric)]/30 bg-[color:var(--brand-electric)]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--brand-electric)]">
                  <Clock3 className="h-3 w-3" /> Planned
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-foreground">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {r.items.map((it) => (
                  <span key={it} className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[11px] font-medium text-foreground/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-electric)]/50" />
                    {it}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-xl text-center text-xs text-muted-foreground">
          Roadmap items are shared for transparency. Delivery timing may change. Items are{" "}
          <strong>not available today</strong>. Request early access via{" "}
          <a className="underline underline-offset-4 hover:text-foreground" href="#contact">Contact</a>.
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FAQ
───────────────────────────────────────────────────────────────── */

const FAQS = [
  {
    q: "Is GST fully supported, including e-invoicing?",
    a: "Yes. Nexora calculates CGST, SGST and IGST automatically on every invoice. You get monthly GST summaries, GSTR-1 export, and e-invoicing (IRN generation) support. GST compliance is core to the platform, not an add-on.",
  },
  {
    q: "How long does it take to get set up?",
    a: "Most businesses are billing their first customer within 30 minutes. Import your products from an Excel file, enter your GSTIN and bank details, and start. No consultant, no implementation project, no training budget.",
  },
  {
    q: "Can I migrate data from my existing software or Excel?",
    a: "Yes. Nexora supports bulk import of products, customers, suppliers and opening stock from CSV or Excel. For complex migrations from Tally or other software, our team assists at no extra cost.",
  },
  {
    q: "How does the AI assistant actually work?",
    a: "Nexora AI is trained on your business data — your products, customers, transactions and history. You ask questions in plain English (or Hindi) and it answers using your actual data. It can also draft invoices, generate reminders and flag anomalies proactively.",
  },
  {
    q: "Does it work on mobile?",
    a: "Yes. The web app is fully responsive and works on any phone, tablet or desktop browser without an install. Native Android and iOS apps with offline mode are on the roadmap.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "You can export all your data — customers, invoices, products, reports — in CSV or PDF format at any time. Your data belongs to you. We provide a 90-day data retention window after cancellation.",
  },
  {
    q: "Is multi-user access included?",
    a: "Growth plan includes up to 5 users. Enterprise plan is unlimited. Each user can be assigned a role (Admin, Manager, Cashier, Accountant, Warehouse) with custom permissions for exactly what they can see and do.",
  },
  {
    q: "How is my data secured?",
    a: "All data is encrypted at rest (AES-256) and in transit (TLS 1.3), stored on enterprise cloud infrastructure with daily automated backups and 30-day restore. No Nexora employee can read your data without explicit audit log entry.",
  },
  {
    q: "Can I manage multiple branches or stores?",
    a: "Yes, with the Enterprise plan. Each branch gets its own inventory, billing and reports, plus a centralised view across all branches. Central billing, stock transfer between branches, and branch performance comparison are all included.",
  },
  {
    q: "Do you offer a demo or onboarding help?",
    a: "Yes. Book a 30-minute live demo with our team who will walk through your specific business use case. Enterprise customers get a dedicated onboarding engineer and a custom setup session.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center mb-14">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Questions business owners actually ask.
          </h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_1px_4px_oklch(0.14_0.02_260/0.07)]">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            const isLast = i === FAQS.length - 1;
            return (
              <div key={f.q} className={!isLast ? "border-b border-border" : ""}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-start gap-4 px-6 py-5 text-left transition-colors hover:bg-secondary/40"
                >
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-foreground sm:text-base">{f.q}</span>
                    {isOpen && (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground pr-4">{f.a}</p>
                    )}
                  </div>
                  <span className="mt-0.5 grid h-7 w-7 flex-shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors">
                    {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Still have questions?{" "}
          <a href="#contact" className="font-semibold text-[color:var(--brand-electric)] hover:underline underline-offset-4">
            Talk to our team →
          </a>
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   CONTACT
───────────────────────────────────────────────────────────────── */

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" className="bg-secondary/40 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <SectionLabel>Get in Touch</SectionLabel>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Let's talk about your business.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Book a demo, ask a question, or request a custom quote. Our team is online and responds within 2 hours on business days.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            {[
              { icon: Mail, title: "Email us", value: "hello@nexora.app", sub: "Replies within 2 hours" },
              { icon: Phone, title: "Call us", value: "+91 80 4718 0000", sub: "Mon–Sat, 9am–7pm IST" },
              { icon: MapPin, title: "Visit us", value: "Prestige Tower, 14th Floor", sub: "MG Road, Bengaluru 560001" },
            ].map((c) => (
              <div key={c.title} className="flex items-start gap-4 rounded-2xl border border-border bg-white p-5 shadow-[0_1px_4px_oklch(0.14_0.02_260/0.07)]">
                <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-brand)] text-white">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.title}</p>
                  <p className="mt-0.5 text-sm font-semibold text-foreground">{c.value}</p>
                  <p className="text-xs text-muted-foreground">{c.sub}</p>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-[color:var(--brand-electric)]/20 bg-[color:var(--brand-electric)]/5 p-5">
              <p className="text-sm font-semibold text-foreground mb-2">Book a live demo</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                30 minutes with a Nexora product specialist. We'll walk through your specific business use case and answer every question.
              </p>
              <Btn href="#contact" size="sm" className="mt-4">
                Schedule Demo <ArrowRight className="h-3.5 w-3.5" />
              </Btn>
            </div>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="rounded-3xl border border-border bg-white p-8 shadow-[0_1px_4px_oklch(0.14_0.02_260/0.07)]"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { label: "Full Name", type: "text", placeholder: "Aarav Sharma", required: true },
                { label: "Work Email", type: "email", placeholder: "you@company.com", required: true },
              ].map((f) => (
                <label key={f.label} className="block">
                  <span className="text-xs font-semibold text-foreground">{f.label}</span>
                  <input required={f.required} type={f.type} placeholder={f.placeholder}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-[color:var(--brand-electric)] focus:ring-2 focus:ring-[color:var(--brand-electric)]/20"
                  />
                </label>
              ))}
            </div>
            <label className="mt-4 block">
              <span className="text-xs font-semibold text-foreground">Business Name</span>
              <input type="text" placeholder="Sharma Traders Pvt. Ltd."
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-[color:var(--brand-electric)] focus:ring-2 focus:ring-[color:var(--brand-electric)]/20"
              />
            </label>
            <label className="mt-4 block">
              <span className="text-xs font-semibold text-foreground">How can we help?</span>
              <textarea required rows={4} placeholder="Tell us about your business and what you're looking for…"
                className="mt-1.5 w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-[color:var(--brand-electric)] focus:ring-2 focus:ring-[color:var(--brand-electric)]/20"
              />
            </label>
            <button type="submit"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[image:var(--gradient-brand)] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-elegant)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              {sent ? "Message sent — we'll be in touch soon ✓" : (
                <><span>Send message</span><ArrowRight className="h-4 w-4" /></>
              )}
            </button>
            <p className="mt-3 text-xs text-muted-foreground">
              By submitting you agree to be contacted by the Nexora team. No spam, ever.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FINAL CTA
───────────────────────────────────────────────────────────────── */

function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[color:var(--brand-deep)] px-8 py-20 text-center text-white shadow-[var(--shadow-elegant)] sm:px-16 sm:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_400px_at_50%_-10%,oklch(0.72_0.19_250/0.45),transparent_55%),radial-gradient(600px_300px_at_50%_120%,oklch(0.55_0.24_258/0.4),transparent_60%)]" />
          {/* Subtle grid */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:48px_48px]" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              14-day free trial · No credit card required
            </span>
            <h2 className="mx-auto max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Ready to run your business on intelligence?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/60 leading-relaxed">
              Join 12,000+ operators who replaced spreadsheets and disconnected tools with one platform that actually thinks.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Btn href="#pricing" variant="white" size="lg">
                Start Free Trial — 14 days free <ArrowRight className="h-4 w-4" />
              </Btn>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
              >
                Book a Demo
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/50">
              {["No credit card needed", "Cancel anytime", "Live in 30 minutes", "Full support included"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-[color:var(--brand-glow)]" /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────────────── */

function Footer() {
  const groups = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "AI Assistant", href: "#ai" },
        { label: "Roadmap", href: "#roadmap" },
        { label: "Changelog", href: "#" },
        { label: "Status", href: "#" },
      ],
    },
    {
      title: "Solutions",
      links: [
        { label: "Retail & FMCG", href: "#" },
        { label: "Wholesale & Distribution", href: "#" },
        { label: "Restaurants & F&B", href: "#" },
        { label: "Healthcare & Pharma", href: "#" },
        { label: "Multi-branch Chains", href: "#" },
      ],
    },
    {
      title: "Developers",
      links: [
        { label: "API Reference", href: "#" },
        { label: "Documentation", href: "#" },
        { label: "Webhooks", href: "#" },
        { label: "SDKs", href: "#" },
        { label: "Integrations", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Nexora", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Press", href: "#" },
        { label: "Contact", href: "#contact" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "#" },
        { label: "Community", href: "#" },
        { label: "Book a Demo", href: "#contact" },
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-background">
      {/* Newsletter strip */}
      <div className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold text-foreground">Stay ahead with Nexora updates</p>
              <p className="text-xs text-muted-foreground mt-0.5">Product launches, GST updates and business growth tips — monthly.</p>
            </div>
            <form className="flex w-full max-w-sm gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="you@company.com"
                className="flex-1 rounded-xl border border-border bg-secondary px-4 py-2 text-sm text-foreground outline-none transition focus:border-[color:var(--brand-electric)] focus:ring-2 focus:ring-[color:var(--brand-electric)]/20"
              />
              <Btn href="#" size="sm">
                Subscribe
              </Btn>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-7">
          {/* Brand */}
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The AI Business Operating System. One intelligent platform to run billing, inventory, CRM, finance and teams — built for modern Indian businesses.
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { label: "X", title: "Twitter / X" },
                { label: "In", title: "LinkedIn" },
                { label: "Ig", title: "Instagram" },
                { label: "Yt", title: "YouTube" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  title={s.title}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {groups.map((g) => (
            <div key={g.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
                {g.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© 2026 Nexora Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            {["Privacy Policy", "Terms of Service", "Security", "Cookie Policy"].map((l) => (
              <a key={l} href="#" className="transition-colors hover:text-foreground">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────── */

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Nav />
      <main>
        <Hero />
        <StatsBanner />
        <TrustedBy />
        <Features />
        <AIShowcase />
        <DashboardPreview />
        <Integrations />
        <Security />
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
