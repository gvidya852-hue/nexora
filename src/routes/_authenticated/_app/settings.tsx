import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings, Building2, User, Bell, Shield, CreditCard, Palette, ChevronRight } from "lucide-react";
import { useBusiness } from "../../../contexts/BusinessContext";
import { useAuth } from "../../../contexts/AuthContext";

export const Route = createFileRoute("/_authenticated/_app/settings")({
  component: SettingsPage,
});

const sections = [
  { icon: Building2, label: "Business Profile",   sub: "Name, logo, GST, address",       color: "text-blue-600",   bg: "bg-blue-50"   },
  { icon: User,      label: "Account & Profile",   sub: "Name, email, password",           color: "text-violet-600", bg: "bg-violet-50" },
  { icon: Bell,      label: "Notifications",       sub: "Alerts, reminders, emails",       color: "text-amber-600",  bg: "bg-amber-50"  },
  { icon: Shield,    label: "Security",            sub: "2FA, sessions, data export",      color: "text-emerald-600",bg: "bg-emerald-50"},
  { icon: CreditCard,label: "Billing & Plan",      sub: "Subscription, usage, invoices",   color: "text-indigo-600", bg: "bg-indigo-50" },
  { icon: Palette,   label: "Appearance",          sub: "Theme, language, timezone",       color: "text-pink-600",   bg: "bg-pink-50"   },
];

function SettingsPage() {
  const { business } = useBusiness();
  const { user } = useAuth();

  return (
    <div className="min-h-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your business and account preferences</p>
        </div>

        {/* Business summary */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[image:var(--gradient-brand)] text-xl font-bold text-white shadow">
              {business?.business_name?.charAt(0) || "N"}
            </div>
            <div>
              <p className="font-semibold text-foreground">{business?.business_name || "Your Business"}</p>
              <p className="text-sm text-muted-foreground">{business?.business_type} · {business?.city}, {business?.state}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Settings sections */}
        <div className="space-y-2">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button key={s.label} className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.bg}`}>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.sub}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">Settings panels are being built · Part of Phase 2</p>
      </div>
    </div>
  );
}
