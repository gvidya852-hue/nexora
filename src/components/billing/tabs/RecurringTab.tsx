// ── Recurring Invoices Tab ────────────────────────────────────────
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  RefreshCw,
  Pause,
  Play,
  Pencil,
  Trash2,
  Calendar,
  Users,
  IndianRupee,
  Activity,
} from "lucide-react";
import {
  recurringInvoices as seedRecurring,
  customers,
  getCustomer,
  fmtINR,
  fmtDate,
  type RecurringInvoice,
  type RecurringFrequency,
  type RecurringStatus,
} from "@/lib/billing-data";
import {
  SectionCard,
  StatTile,
  SearchInput,
  Select,
  Pagination,
  PrimaryButton,
  SecondaryButton,
  EmptyState,
  BillingStatusPill,
  ModalShell,
} from "@/components/billing/shared";

const PAGE_SIZE = 8;

const frequencyLabels: Record<RecurringFrequency, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
};

const frequencyColors: Record<RecurringFrequency, string> = {
  weekly: "bg-blue-50 text-blue-700 border-blue-200",
  monthly: "bg-emerald-50 text-emerald-700 border-emerald-200",
  quarterly: "bg-violet-50 text-violet-700 border-violet-200",
  yearly: "bg-amber-50 text-amber-700 border-amber-200",
};

function FrequencyBadge({ frequency }: { frequency: RecurringFrequency }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${frequencyColors[frequency]}`}
    >
      {frequencyLabels[frequency]}
    </span>
  );
}

interface RIForm {
  templateName: string;
  customerId: string;
  frequency: RecurringFrequency;
  startDate: string;
  amount: string;
  itemsSummary: string;
}

const emptyForm = (): RIForm => ({
  templateName: "",
  customerId: "",
  frequency: "monthly",
  startDate: new Date().toISOString().slice(0, 10),
  amount: "",
  itemsSummary: "",
});

function computeNextBilling(startDate: string, frequency: RecurringFrequency): string {
  const d = new Date(startDate + "T00:00:00");
  const now = new Date();
  while (d <= now) {
    if (frequency === "weekly") d.setDate(d.getDate() + 7);
    else if (frequency === "monthly") d.setMonth(d.getMonth() + 1);
    else if (frequency === "quarterly") d.setMonth(d.getMonth() + 3);
    else d.setFullYear(d.getFullYear() + 1);
  }
  return d.toISOString().slice(0, 10);
}

function RIFormModal({
  open,
  onClose,
  initial,
  title,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  initial?: RIForm;
  title: string;
  onSave: (f: RIForm) => void;
}) {
  const [form, setForm] = useState<RIForm>(initial ?? emptyForm());
  const set = <K extends keyof RIForm>(k: K, v: RIForm[K]) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.templateName.trim() || !form.customerId || !form.amount) return;
    onSave(form);
    onClose();
  };

  return (
    <ModalShell open={open} onClose={onClose} title={title}>
      <div className="space-y-4">
        {/* Template Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Template Name</label>
          <input
            value={form.templateName}
            onChange={(e) => set("templateName", e.target.value)}
            placeholder="e.g. Monthly AMC — Halcyon Group"
            className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[color:var(--brand-electric)] focus:ring-1 focus:ring-[color:var(--brand-electric)]"
          />
        </div>

        {/* Customer */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Customer</label>
          <select
            value={form.customerId}
            onChange={(e) => set("customerId", e.target.value)}
            className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-foreground outline-none focus:border-[color:var(--brand-electric)] focus:ring-1 focus:ring-[color:var(--brand-electric)]"
          >
            <option value="">Select customer…</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Frequency */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Frequency</label>
          <select
            value={form.frequency}
            onChange={(e) => set("frequency", e.target.value as RecurringFrequency)}
            className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-foreground outline-none focus:border-[color:var(--brand-electric)] focus:ring-1 focus:ring-[color:var(--brand-electric)]"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Start Date */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Start Date</label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => set("startDate", e.target.value)}
            className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[color:var(--brand-electric)] focus:ring-1 focus:ring-[color:var(--brand-electric)]"
          />
        </div>

        {/* Amount */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Amount (₹)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => set("amount", e.target.value)}
            placeholder="e.g. 15000"
            className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[color:var(--brand-electric)] focus:ring-1 focus:ring-[color:var(--brand-electric)]"
          />
        </div>

        {/* Items Summary */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Items Summary</label>
          <textarea
            rows={3}
            value={form.itemsSummary}
            onChange={(e) => set("itemsSummary", e.target.value)}
            placeholder="e.g. Annual Maintenance Contract — IT Support"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[color:var(--brand-electric)] focus:ring-1 focus:ring-[color:var(--brand-electric)] resize-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton onClick={handleSave}>Save Recurring Invoice</PrimaryButton>
        </div>
      </div>
    </ModalShell>
  );
}

export function RecurringTab() {
  const [recurring, setRecurring] = useState<RecurringInvoice[]>(seedRecurring);
  const [search, setSearch] = useState("");
  const [freqFilter, setFreqFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<RecurringInvoice | null>(null);

  // Stats
  const activeCount = recurring.filter((r) => r.status === "active").length;
  const pausedCount = recurring.filter((r) => r.status === "paused").length;
  const totalMonthly = recurring
    .filter((r) => r.status === "active")
    .reduce((s, r) => {
      if (r.frequency === "weekly") return s + r.amount * 4.33;
      if (r.frequency === "monthly") return s + r.amount;
      if (r.frequency === "quarterly") return s + r.amount / 3;
      return s + r.amount / 12;
    }, 0);
  const totalGenerated = recurring.reduce((s, r) => s + r.invoicesGenerated, 0);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return recurring.filter((r) => {
      const cust = getCustomer(r.customerId);
      const matchSearch =
        r.templateName.toLowerCase().includes(q) ||
        (cust?.name ?? "").toLowerCase().includes(q) ||
        r.itemsSummary.toLowerCase().includes(q);
      const matchFreq = freqFilter === "all" || r.frequency === freqFilter;
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchSearch && matchFreq && matchStatus;
    });
  }, [recurring, search, freqFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleStatus = (id: string) => {
    setRecurring((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === "active" ? "paused" : ("active" as RecurringStatus) }
          : r,
      ),
    );
  };

  const handleCreate = (f: RIForm) => {
    const nextBilling = computeNextBilling(f.startDate, f.frequency);
    const newRI: RecurringInvoice = {
      id: `ri-${Date.now()}`,
      templateName: f.templateName,
      customerId: f.customerId,
      frequency: f.frequency,
      nextBillingDate: nextBilling,
      startDate: f.startDate,
      amount: parseFloat(f.amount) || 0,
      status: "active",
      itemsSummary: f.itemsSummary,
      invoicesGenerated: 0,
    };
    setRecurring((prev) => [newRI, ...prev]);
    setPage(1);
  };

  const handleEdit = (f: RIForm) => {
    if (!editTarget) return;
    const nextBilling = computeNextBilling(f.startDate, f.frequency);
    setRecurring((prev) =>
      prev.map((r) =>
        r.id === editTarget.id
          ? {
              ...r,
              templateName: f.templateName,
              customerId: f.customerId,
              frequency: f.frequency,
              startDate: f.startDate,
              amount: parseFloat(f.amount) || r.amount,
              itemsSummary: f.itemsSummary,
              nextBillingDate: nextBilling,
            }
          : r,
      ),
    );
    setEditTarget(null);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this recurring invoice? This cannot be undone.")) return;
    setRecurring((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Stat Strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile
          label="Active Schedules"
          value={String(activeCount)}
          icon={Activity}
          bg="bg-emerald-50"
          iconColor="text-emerald-600"
          index={0}
        />
        <StatTile
          label="Paused"
          value={String(pausedCount)}
          icon={Pause}
          bg="bg-slate-100"
          iconColor="text-slate-500"
          index={1}
        />
        <StatTile
          label="Est. Monthly Revenue"
          value={fmtINR(Math.round(totalMonthly))}
          icon={IndianRupee}
          bg="bg-blue-50"
          iconColor="text-blue-600"
          index={2}
        />
        <StatTile
          label="Invoices Generated"
          value={String(totalGenerated)}
          icon={RefreshCw}
          bg="bg-violet-50"
          iconColor="text-violet-600"
          index={3}
        />
      </div>

      {/* Table Card */}
      <SectionCard
        title="Recurring Invoices"
        subtitle={`${filtered.length} schedule${filtered.length !== 1 ? "s" : ""}`}
        noPadding
        action={
          <div className="flex items-center gap-2">
            <SearchInput
              value={search}
              onChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              placeholder="Search schedules…"
              className="w-48"
            />
            <Select
              value={freqFilter}
              onChange={(v) => {
                setFreqFilter(v);
                setPage(1);
              }}
              options={[
                { value: "all", label: "All Frequencies" },
                { value: "weekly", label: "Weekly" },
                { value: "monthly", label: "Monthly" },
                { value: "quarterly", label: "Quarterly" },
                { value: "yearly", label: "Yearly" },
              ]}
            />
            <Select
              value={statusFilter}
              onChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
              options={[
                { value: "all", label: "All Statuses" },
                { value: "active", label: "Active" },
                { value: "paused", label: "Paused" },
              ]}
            />
            <PrimaryButton icon={Plus} onClick={() => setCreateOpen(true)}>
              New Recurring Invoice
            </PrimaryButton>
          </div>
        }
      >
        {paginated.length === 0 ? (
          <EmptyState
            icon={RefreshCw}
            title="No recurring invoices found"
            subtitle="Try adjusting your search or create a new recurring schedule."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Template Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Frequency
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Next Billing
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">
                      Generated
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((ri, i) => {
                    const cust = getCustomer(ri.customerId);
                    return (
                      <motion.tr
                        key={ri.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.25 }}
                        className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="px-6 py-3">
                          <p className="text-sm font-medium text-foreground">{ri.templateName}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[220px]">
                            {ri.itemsSummary}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-foreground whitespace-nowrap">
                            {cust?.name ?? ri.customerId}
                          </p>
                          {cust?.city && (
                            <p className="text-xs text-muted-foreground">{cust.city}</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <FrequencyBadge frequency={ri.frequency} />
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                          {fmtDate(ri.nextBillingDate)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-foreground whitespace-nowrap">
                          {fmtINR(ri.amount)}
                        </td>
                        <td className="px-4 py-3">
                          <BillingStatusPill status={ri.status} />
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-muted-foreground">
                          {ri.invoicesGenerated}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => toggleStatus(ri.id)}
                              className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${ri.status === "active" ? "text-amber-500 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"}`}
                              title={ri.status === "active" ? "Pause" : "Resume"}
                            >
                              {ri.status === "active" ? (
                                <Pause className="h-3.5 w-3.5" />
                              ) : (
                                <Play className="h-3.5 w-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => setEditTarget(ri)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                              title="Edit"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(ri.id)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </SectionCard>

      {/* Create Modal */}
      <RIFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New Recurring Invoice"
        onSave={handleCreate}
      />

      {/* Edit Modal */}
      {editTarget && (
        <RIFormModal
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
          title="Edit Recurring Invoice"
          initial={{
            templateName: editTarget.templateName,
            customerId: editTarget.customerId,
            frequency: editTarget.frequency,
            startDate: editTarget.startDate,
            amount: String(editTarget.amount),
            itemsSummary: editTarget.itemsSummary,
          }}
          onSave={handleEdit}
        />
      )}
    </div>
  );
}
