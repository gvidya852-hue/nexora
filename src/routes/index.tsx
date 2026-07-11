import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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

const FEATURES = [
  {
    icon: BarChart3,
    title: "Dashboard",
    desc: "A live business overview with the numbers that matter most.",
    bullets: ["Business overview", "Sales analytics", "Daily & monthly reports", "Beautiful charts"],
  },
  {
    icon: Users,
    title: "Customer Management",
    desc: "A clean CRM built around real shop-floor workflows.",
    bullets: ["Customer database", "Purchase history", "Fast customer search", "Credit tracking"],
  },
  {
    icon: Package,
    title: "Product Management",
    desc: "Organise your catalogue, pricing and stock with zero clutter.",
    bullets: ["Product catalogue", "Categories", "GST support", "Pricing & stock tracking"],
  },
  {
    icon: Receipt,
    title: "Billing & Invoicing",
    desc: "Create GST-ready invoices in seconds, from any device.",
    bullets: ["Fast invoice creation", "Automatic GST calculation", "PDF & print invoices", "Sales history"],
  },
  {
    icon: Boxes,
    title: "Inventory Management",
    desc: "Stock stays in sync with every sale and purchase, automatically.",
    bullets: ["Automatic stock updates", "Low-stock alerts", "Purchase entries", "Inventory reports"],
  },
  {
    icon: Sparkles,
    title: "AI Assistant",
    desc: "Ask questions and take actions in plain English.",
    bullets: ["Sales & GST summaries", "Find low-stock products", "Top customers insights", "Smart business tips"],
  },
];

function Features() {
  return (
    <section id="features" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Platform"
          title="Everything you need to run a modern business."
          subtitle="Six focused modules working together — no bloat, no learning curve, no juggling spreadsheets."
        />
        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--brand-electric)]/40 hover:shadow-[var(--shadow-elegant)]"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[image:var(--gradient-brand)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20" />
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[image:var(--gradient-brand)] text-white shadow-[var(--shadow-elegant)]">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              <ul className="mt-5 space-y-2">
                {f.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[color:var(--brand-electric)]" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
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
      links: ["Features", "Pricing", "AI Assistant", "Integrations", "Changelog"],
    },
    {
      title: "Company",
      links: ["About", "Customers", "Careers", "Press", "Contact"],
    },
    {
      title: "Resources",
      links: ["Docs", "Guides", "Blog", "Support", "Status"],
    },
    {
      title: "Legal",
      links: ["Privacy", "Terms", "Security", "DPA", "Cookies"],
    },
  ];
  return (
    <footer className="border-t border-border bg-background py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The AI Business Operating System for modern retailers,
              wholesalers and growing teams.
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
          <p>© {new Date().getFullYear()} Nexora Technologies. All rights reserved.</p>
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
        <Pricing />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
