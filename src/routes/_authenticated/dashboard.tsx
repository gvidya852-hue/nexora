import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../../contexts/AuthContext";
import { useBusiness } from "../../contexts/BusinessContext";
import { Logo } from "../../components/Logo";
import {
  LogOut,
  LayoutDashboard,
  Receipt,
  Boxes,
  Users,
  BarChart3,
  ChevronRight,
  Sparkles,
  Building2,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

const comingSoonModules = [
  { icon: Receipt,   label: "GST Billing",  description: "Invoices, e-invoicing & GST returns" },
  { icon: Boxes,     label: "Inventory",    description: "Stock management & purchase orders" },
  { icon: Users,     label: "CRM",          description: "Customers, leads & follow-ups" },
  { icon: BarChart3, label: "Finance",      description: "P&L, cash flow & reports" },
  { icon: Sparkles,  label: "AI Insights",  description: "Predictive analytics & recommendations" },
];

function DashboardPage() {
  const { user, signOut } = useAuth();
  const { business } = useBusiness();

  const displayName =
    business?.owner_name ||
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "there";

  const businessName = business?.business_name || "Your Business";

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />

          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[image:var(--gradient-brand)] text-xs font-bold text-white shadow-sm">
              {initials}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-foreground leading-none">{displayName}</p>
              <p className="mt-0.5 text-xs text-muted-foreground leading-none">{user?.email}</p>
            </div>

            <button
              onClick={() => signOut()}
              className="ml-2 flex items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-border hover:text-foreground"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Welcome */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-4">
            <Sparkles className="h-3 w-3" />
            Your workspace is ready
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {displayName.split(" ")[0]} 👋
          </h1>
          <div className="mt-2 flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4 shrink-0" />
            <span className="text-sm">{businessName}</span>
            {business?.business_type && (
              <>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-sm">{business.business_type}</span>
              </>
            )}
          </div>
        </div>

        {/* Stats placeholder */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {["Revenue", "Invoices", "Customers", "Stock Items"].map((label) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
            >
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {label}
              </p>
              <div className="mt-2 h-6 w-24 animate-pulse rounded-md bg-muted" />
              <div className="mt-1 h-3 w-16 animate-pulse rounded-md bg-muted/60" />
            </div>
          ))}
        </div>

        {/* Modules grid */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Modules</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {/* Dashboard card (active) */}
            <div className="flex items-center gap-4 rounded-xl border border-primary/30 bg-primary/5 p-4 shadow-[var(--shadow-card)]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[image:var(--gradient-brand)] shadow-sm">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground">Dashboard</p>
                <p className="text-xs text-muted-foreground">Overview & analytics</p>
              </div>
              <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wide">
                Active
              </span>
            </div>

            {/* Coming soon modules */}
            {comingSoonModules.map(({ icon: Icon, label, description }) => (
              <div
                key={label}
                className="group flex cursor-default items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)] opacity-70 transition-opacity hover:opacity-100"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                <div className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground">
                  <span>Soon</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
