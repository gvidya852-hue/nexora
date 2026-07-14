// ── Customer Profile ──────────────────────────────────────────────
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Building2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  FileText,
  MessageSquare,
  Activity,
  AlertCircle,
  Plus,
  ShieldCheck,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getCustomerById,
  crmActivity,
  fmtINR,
  fmtDate,
  type CustomerNote,
  type CrmActivityType,
} from "@/lib/crm-data";
import {
  SectionCard,
  CrmStatusPill,
  EmptyState,
  Avatar,
  SecondaryButton,
} from "@/components/crm/shared";

// ── Activity icon ─────────────────────────────────────────────────
function activityIcon(type: CrmActivityType) {
  switch (type) {
    case "customer-created": return { bg: "bg-blue-50", color: "text-blue-600" };
    case "invoice-generated": return { bg: "bg-indigo-50", color: "text-indigo-600" };
    case "payment-received": return { bg: "bg-emerald-50", color: "text-emerald-600" };
    case "customer-updated": return { bg: "bg-amber-50", color: "text-amber-600" };
    case "lead-created": return { bg: "bg-violet-50", color: "text-violet-600" };
    case "lead-converted": return { bg: "bg-emerald-50", color: "text-emerald-600" };
    case "note-added": return { bg: "bg-slate-100", color: "text-slate-600" };
    case "follow-up-scheduled": return { bg: "bg-cyan-50", color: "text-cyan-600" };
    case "follow-up-completed": return { bg: "bg-emerald-50", color: "text-emerald-600" };
    default: return { bg: "bg-slate-100", color: "text-slate-500" };
  }
}

type ProfileTab = "overview" | "purchases" | "outstanding" | "notes" | "activity";

// ── Field display helper ──────────────────────────────────────────
function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm text-foreground">{value ?? "—"}</p>
    </div>
  );
}

// ── CustomerProfile ───────────────────────────────────────────────
export function CustomerProfile({
  customerId,
  onBack,
}: {
  customerId: string;
  onBack: () => void;
}) {
  const customer = getCustomerById(customerId);
  const [tab, setTab] = useState<ProfileTab>("overview");
  const [notes, setNotes] = useState<CustomerNote[]>(() => customer?.notes ?? []);
  const [noteInput, setNoteInput] = useState("");

  if (!customer) {
    return (
      <div className="space-y-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-foreground hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Customers
        </button>
        <EmptyState icon={AlertCircle} title="Customer not found" subtitle="This customer profile could not be found." />
      </div>
    );
  }

  const customerActivities = crmActivity.filter((a) => a.customerId === customer.id);
  const pendingPurchases = customer.purchaseHistory.filter((p) => p.status !== "paid");
  const totalOutstanding = customer.purchaseHistory
    .filter((p) => p.status !== "paid")
    .reduce((s, p) => s + p.amount, 0);

  function addNote() {
    if (!noteInput.trim()) return;
    const newNote: CustomerNote = {
      id: `note-new-${Math.random().toString(36).slice(2, 9)}`,
      text: noteInput.trim(),
      author: "You",
      date: new Date().toISOString().slice(0, 10),
    };
    setNotes((prev) => [newNote, ...prev]);
    setNoteInput("");
  }

  const tabs: { key: ProfileTab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "purchases", label: "Purchase History" },
    { key: "outstanding", label: "Outstanding" },
    { key: "notes", label: "Notes" },
    { key: "activity", label: "Activity" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-4"
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
        <SecondaryButton icon={ArrowLeft} onClick={onBack}>Back to Customers</SecondaryButton>
        <div className="flex items-center gap-2.5 ml-2">
          <Avatar name={customer.name} size="md" />
          <div>
            <p className="text-sm font-bold text-foreground">{customer.name}</p>
            <p className="text-xs text-muted-foreground">{customer.customerCode} · {customer.company}</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <CrmStatusPill status={customer.status} />
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
            {customer.group}
          </span>
        </div>
      </div>

      {/* Hero card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
        <div className="flex flex-wrap items-start gap-6">
          <Avatar name={customer.name} size="lg" />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-foreground">{customer.name}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{customer.company}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <CrmStatusPill status={customer.status} />
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{customer.group}</span>
            </div>
            <div className="mt-3 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < customer.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-200"}`} />
              ))}
              <span className="ml-1 text-xs text-muted-foreground">{customer.rating}/5</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-center">
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-xs text-muted-foreground">Total Revenue</p>
              <p className="mt-0.5 text-sm font-bold text-foreground">{fmtINR(customer.totalRevenue)}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-xs text-muted-foreground">Outstanding</p>
              <p className={`mt-0.5 text-sm font-bold ${customer.outstandingAmount > 0 ? "text-red-600" : "text-emerald-600"}`}>
                {customer.outstandingAmount > 0 ? fmtINR(customer.outstandingAmount) : "Nil"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-xs text-muted-foreground">Credit Limit</p>
              <p className="mt-0.5 text-sm font-bold text-foreground">{fmtINR(customer.creditLimit)}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-xs text-muted-foreground">Credit Days</p>
              <p className="mt-0.5 text-sm font-bold text-foreground">{customer.creditDays}d</p>
            </div>
          </div>
        </div>
      </div>

      {/* Inner tab nav */}
      <div className="flex gap-1 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
              tab === t.key
                ? "bg-[image:var(--gradient-brand)] text-white shadow-sm"
                : "text-muted-foreground hover:bg-slate-100 hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Business Info */}
          <SectionCard title="Business Information" action={<Building2 className="h-4 w-4 text-muted-foreground" />}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <Field label="Company" value={customer.company} />
              <Field label="Contact Person" value={customer.contactPerson} />
              <Field label="Customer Code" value={customer.customerCode} />
              <Field label="Group" value={customer.group} />
              <Field label="Created Date" value={fmtDate(customer.createdDate)} />
              <Field label="Last Purchase" value={fmtDate(customer.lastPurchase)} />
            </div>
          </SectionCard>

          {/* Contact Details */}
          <SectionCard title="Contact Details" action={<Phone className="h-4 w-4 text-muted-foreground" />}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <Field label="Phone" value={customer.phone} />
              <Field label="Email" value={customer.email} />
              <Field label="City" value={customer.city} />
              <Field label="State" value={customer.state} />
            </div>
          </SectionCard>

          {/* GST Information */}
          <SectionCard title="GST Information" action={<ShieldCheck className="h-4 w-4 text-muted-foreground" />}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <Field label="GSTIN" value={customer.gstin} />
              <Field label="PAN" value={customer.pan} />
            </div>
          </SectionCard>

          {/* Credit */}
          <SectionCard title="Credit Terms" action={<CreditCard className="h-4 w-4 text-muted-foreground" />}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <Field label="Credit Limit" value={fmtINR(customer.creditLimit)} />
              <Field label="Credit Days" value={`${customer.creditDays} days`} />
              <Field label="Outstanding Amount" value={fmtINR(customer.outstandingAmount)} />
              <Field label="Total Revenue" value={fmtINR(customer.totalRevenue)} />
            </div>
          </SectionCard>

          {/* Billing Address */}
          <SectionCard title="Billing Address" action={<MapPin className="h-4 w-4 text-muted-foreground" />}>
            <p className="text-sm text-foreground leading-relaxed">{customer.billingAddress || "—"}</p>
          </SectionCard>

          {/* Shipping Address */}
          <SectionCard title="Shipping Address" action={<MapPin className="h-4 w-4 text-muted-foreground" />}>
            <p className="text-sm text-foreground leading-relaxed">{customer.shippingAddress || "—"}</p>
          </SectionCard>
        </div>
      )}

      {/* ── Purchase History ── */}
      {tab === "purchases" && (
        <SectionCard title="Purchase History" subtitle={`${customer.purchaseHistory.length} transactions`} action={<FileText className="h-4 w-4 text-muted-foreground" />}>
          {customer.purchaseHistory.length === 0 ? (
            <EmptyState icon={FileText} title="No purchases yet" subtitle="Purchase history will appear here." />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/60">
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customer.purchaseHistory.map((p, i) => (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.03 * i, duration: 0.2 }}
                      className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors"
                    >
                      <TableCell className="font-mono text-xs font-semibold text-blue-700">{p.invoiceNumber}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{fmtDate(p.date)}</TableCell>
                      <TableCell className="text-xs font-bold text-foreground">{fmtINR(p.amount)}</TableCell>
                      <TableCell><CrmStatusPill status={p.status} /></TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </SectionCard>
      )}

      {/* ── Outstanding ── */}
      {tab === "outstanding" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
              <p className="text-xs text-red-600 font-semibold">Total Outstanding</p>
              <p className="mt-1 text-2xl font-bold text-red-700">{fmtINR(customer.outstandingAmount)}</p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
              <p className="text-xs text-amber-600 font-semibold">Pending Transactions</p>
              <p className="mt-1 text-2xl font-bold text-amber-700">{pendingPurchases.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <p className="text-xs text-slate-600 font-semibold">Credit Limit Remaining</p>
              <p className="mt-1 text-2xl font-bold text-slate-700">{fmtINR(Math.max(0, customer.creditLimit - customer.outstandingAmount))}</p>
            </div>
          </div>
          <SectionCard title="Pending / Overdue Payments" subtitle="Unpaid purchase records">
            {pendingPurchases.length === 0 ? (
              <EmptyState icon={AlertCircle} title="No outstanding payments" subtitle="All purchases have been paid." />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/60">
                      <TableHead>Invoice</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingPurchases.map((p, i) => (
                      <motion.tr
                        key={p.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.03 * i, duration: 0.2 }}
                        className="border-b border-slate-100 hover:bg-slate-50/60"
                      >
                        <TableCell className="font-mono text-xs font-semibold text-blue-700">{p.invoiceNumber}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{fmtDate(p.date)}</TableCell>
                        <TableCell className="text-xs font-bold text-red-600">{fmtINR(p.amount)}</TableCell>
                        <TableCell><CrmStatusPill status={p.status} /></TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </div>
      )}

      {/* ── Notes ── */}
      {tab === "notes" && (
        <SectionCard title="Customer Notes" subtitle="Internal notes and comments" action={<MessageSquare className="h-4 w-4 text-muted-foreground" />}>
          {/* Add note */}
          <div className="flex gap-2 mb-5">
            <input
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addNote()}
              placeholder="Add a note and press Enter..."
              className="h-9 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition-colors focus:border-[color:var(--brand-electric)] focus:ring-1 focus:ring-[color:var(--brand-electric)] placeholder:text-slate-400"
            />
            <button
              onClick={addNote}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[image:var(--gradient-brand)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>

          {notes.length === 0 ? (
            <EmptyState icon={MessageSquare} title="No notes yet" subtitle="Add your first note above." />
          ) : (
            <div className="space-y-3">
              {notes.map((note, i) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * i, duration: 0.2 }}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                >
                  <p className="text-sm text-foreground">{note.text}</p>
                  <p className="mt-1.5 text-[11px] text-muted-foreground">{note.author} · {fmtDate(note.date)}</p>
                </motion.div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* ── Activity ── */}
      {tab === "activity" && (
        <SectionCard title="Activity Timeline" subtitle="All CRM events for this customer" action={<Activity className="h-4 w-4 text-muted-foreground" />}>
          {customerActivities.length === 0 ? (
            <EmptyState icon={Activity} title="No activity recorded" subtitle="CRM events for this customer will appear here." />
          ) : (
            <div className="relative space-y-0">
              {/* Timeline line */}
              <div className="absolute left-[22px] top-2 bottom-2 w-px bg-slate-100" />
              {customerActivities.map((act, i) => {
                const { bg, color } = activityIcon(act.type);
                return (
                  <motion.div
                    key={act.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.25 }}
                    className="relative flex gap-4 pb-5"
                  >
                    <div className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-white ${bg} shadow-sm`}>
                      <Activity className={`h-4 w-4 ${color}`} />
                    </div>
                    <div className="pt-2 min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground">{act.title}</p>
                      <p className="text-[11px] text-muted-foreground">{act.subtitle}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{fmtDate(act.timestamp)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </SectionCard>
      )}
    </motion.div>
  );
}
