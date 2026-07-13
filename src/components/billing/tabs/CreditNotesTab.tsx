// ── Credit Notes Tab ──────────────────────────────────────────────
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  FileX,
  Pencil,
  Trash2,
  Eye,
  ReceiptText,
  TrendingDown,
  RefreshCcw,
} from "lucide-react";
import {
  creditNotes as seedCreditNotes,
  invoices,
  customers,
  getCustomer,
  getInvoice,
  fmtINR,
  fmtDate,
  type CreditNote,
  type CreditNoteStatus,
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

function nextCNNumber(notes: CreditNote[]) {
  const nums = notes.map((n) => parseInt(n.creditNoteNumber.split("-").pop() ?? "0", 10));
  const next = Math.max(0, ...nums) + 1;
  return `CN-2026-${String(next).padStart(4, "0")}`;
}

interface CNForm {
  invoiceId: string;
  customerId: string;
  amount: string;
  reason: string;
  status: CreditNoteStatus;
}

const emptyForm = (): CNForm => ({
  invoiceId: "",
  customerId: "",
  amount: "",
  reason: "",
  status: "issued",
});

function CNFormModal({
  open,
  onClose,
  initial,
  title,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  initial?: CNForm;
  title: string;
  onSave: (f: CNForm) => void;
}) {
  const [form, setForm] = useState<CNForm>(initial ?? emptyForm());

  const set = <K extends keyof CNForm>(k: K, v: CNForm[K]) => setForm((p) => ({ ...p, [k]: v }));

  const handleInvoiceChange = (id: string) => {
    const inv = invoices.find((i) => i.id === id);
    setForm((p) => ({ ...p, invoiceId: id, customerId: inv?.customerId ?? "" }));
  };

  const handleSave = () => {
    if (!form.invoiceId || !form.amount || !form.reason.trim()) return;
    onSave(form);
    onClose();
  };

  // reset when opening
  const handleOpen = () => {
    setForm(initial ?? emptyForm());
  };

  return (
    <ModalShell open={open} onClose={onClose} title={title}>
      <div onMouseEnter={handleOpen} className="space-y-4">
        {/* Linked Invoice */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Linked Invoice</label>
          <select
            value={form.invoiceId}
            onChange={(e) => handleInvoiceChange(e.target.value)}
            className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-foreground outline-none focus:border-[color:var(--brand-electric)] focus:ring-1 focus:ring-[color:var(--brand-electric)]"
          >
            <option value="">Select invoice…</option>
            {invoices.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.invoiceNumber} — {getCustomer(inv.customerId)?.name ?? inv.customerId}
              </option>
            ))}
          </select>
        </div>

        {/* Customer (auto-filled) */}
        {form.customerId && (
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-xs text-muted-foreground">Customer</p>
            <p className="text-sm font-semibold text-foreground">
              {getCustomer(form.customerId)?.name ?? form.customerId}
            </p>
          </div>
        )}

        {/* Refund Amount */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Refund Amount (₹)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => set("amount", e.target.value)}
            placeholder="e.g. 2500"
            className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[color:var(--brand-electric)] focus:ring-1 focus:ring-[color:var(--brand-electric)]"
          />
        </div>

        {/* Reason */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Reason</label>
          <textarea
            rows={3}
            value={form.reason}
            onChange={(e) => set("reason", e.target.value)}
            placeholder="e.g. Product returned due to defect"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[color:var(--brand-electric)] focus:ring-1 focus:ring-[color:var(--brand-electric)] resize-none"
          />
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Status</label>
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value as CreditNoteStatus)}
            className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-foreground outline-none focus:border-[color:var(--brand-electric)] focus:ring-1 focus:ring-[color:var(--brand-electric)]"
          >
            <option value="issued">Issued</option>
            <option value="adjusted">Adjusted</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton onClick={handleSave}>Save Credit Note</PrimaryButton>
        </div>
      </div>
    </ModalShell>
  );
}

export function CreditNotesTab() {
  const [notes, setNotes] = useState<CreditNote[]>(seedCreditNotes);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CreditNote | null>(null);
  const [viewTarget, setViewTarget] = useState<CreditNote | null>(null);

  // Stats
  const totalIssued = notes.length;
  const totalRefunded = notes
    .filter((n) => n.status === "refunded")
    .reduce((s, n) => s + n.amount, 0);
  const totalAdjusted = notes
    .filter((n) => n.status === "adjusted")
    .reduce((s, n) => s + n.amount, 0);
  const totalAmount = notes.reduce((s, n) => s + n.amount, 0);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return notes.filter((n) => {
      const inv = getInvoice(n.invoiceId);
      const cust = getCustomer(n.customerId);
      const matchSearch =
        n.creditNoteNumber.toLowerCase().includes(q) ||
        (inv?.invoiceNumber ?? "").toLowerCase().includes(q) ||
        (cust?.name ?? "").toLowerCase().includes(q) ||
        n.reason.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || n.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [notes, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCreate = (f: CNForm) => {
    const newNote: CreditNote = {
      id: `cn-${Date.now()}`,
      creditNoteNumber: nextCNNumber(notes),
      invoiceId: f.invoiceId,
      customerId: f.customerId,
      amount: parseFloat(f.amount) || 0,
      reason: f.reason,
      status: f.status,
      createdDate: new Date().toISOString().slice(0, 10),
    };
    setNotes((prev) => [newNote, ...prev]);
    setPage(1);
  };

  const handleEdit = (f: CNForm) => {
    if (!editTarget) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === editTarget.id
          ? {
              ...n,
              invoiceId: f.invoiceId,
              customerId: f.customerId,
              amount: parseFloat(f.amount) || n.amount,
              reason: f.reason,
              status: f.status,
            }
          : n,
      ),
    );
    setEditTarget(null);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this credit note? This cannot be undone.")) return;
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Stat Strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile
          label="Total Issued"
          value={String(totalIssued)}
          icon={ReceiptText}
          bg="bg-blue-50"
          iconColor="text-blue-600"
          index={0}
        />
        <StatTile
          label="Total Amount"
          value={fmtINR(totalAmount)}
          icon={TrendingDown}
          bg="bg-violet-50"
          iconColor="text-violet-600"
          index={1}
        />
        <StatTile
          label="Total Refunded"
          value={fmtINR(totalRefunded)}
          icon={RefreshCcw}
          bg="bg-cyan-50"
          iconColor="text-cyan-600"
          index={2}
        />
        <StatTile
          label="Total Adjusted"
          value={fmtINR(totalAdjusted)}
          icon={FileX}
          bg="bg-amber-50"
          iconColor="text-amber-600"
          index={3}
        />
      </div>

      {/* Table Card */}
      <SectionCard
        title="Credit Notes"
        subtitle={`${filtered.length} credit note${filtered.length !== 1 ? "s" : ""}`}
        noPadding
        action={
          <div className="flex items-center gap-2">
            <SearchInput
              value={search}
              onChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              placeholder="Search credit notes…"
              className="w-52"
            />
            <Select
              value={statusFilter}
              onChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
              options={[
                { value: "all", label: "All Statuses" },
                { value: "issued", label: "Issued" },
                { value: "adjusted", label: "Adjusted" },
                { value: "refunded", label: "Refunded" },
              ]}
            />
            <PrimaryButton icon={Plus} onClick={() => setCreateOpen(true)}>
              New Credit Note
            </PrimaryButton>
          </div>
        }
      >
        {paginated.length === 0 ? (
          <EmptyState
            icon={FileX}
            title="No credit notes found"
            subtitle="Try adjusting your search or create a new credit note."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Credit Note #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Linked Invoice
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Reason
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Created
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((note, i) => {
                    const inv = getInvoice(note.invoiceId);
                    const cust = getCustomer(note.customerId);
                    return (
                      <motion.tr
                        key={note.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.25 }}
                        className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="px-6 py-3 text-sm font-mono font-medium text-foreground whitespace-nowrap">
                          {note.creditNoteNumber}
                        </td>
                        <td className="px-4 py-3 text-sm text-blue-600 whitespace-nowrap">
                          {inv?.invoiceNumber ?? note.invoiceId}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-foreground whitespace-nowrap">
                            {cust?.name ?? note.customerId}
                          </p>
                          {cust?.city && (
                            <p className="text-xs text-muted-foreground">{cust.city}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-foreground whitespace-nowrap">
                          {fmtINR(note.amount)}
                        </td>
                        <td className="px-4 py-3 max-w-[200px]">
                          <p className="text-sm text-muted-foreground truncate">{note.reason}</p>
                        </td>
                        <td className="px-4 py-3">
                          <BillingStatusPill status={note.status} />
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                          {fmtDate(note.createdDate)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setViewTarget(note)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                              title="View"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setEditTarget(note)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                              title="Edit"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(note.id)}
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
      <CNFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New Credit Note"
        onSave={handleCreate}
      />

      {/* Edit Modal */}
      {editTarget && (
        <CNFormModal
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
          title="Edit Credit Note"
          initial={{
            invoiceId: editTarget.invoiceId,
            customerId: editTarget.customerId,
            amount: String(editTarget.amount),
            reason: editTarget.reason,
            status: editTarget.status,
          }}
          onSave={handleEdit}
        />
      )}

      {/* View Modal */}
      {viewTarget && (
        <ModalShell
          open={!!viewTarget}
          onClose={() => setViewTarget(null)}
          title="Credit Note Details"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs text-muted-foreground">Credit Note #</p>
                <p className="mt-0.5 text-sm font-mono font-semibold text-foreground">
                  {viewTarget.creditNoteNumber}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs text-muted-foreground">Status</p>
                <div className="mt-1">
                  <BillingStatusPill status={viewTarget.status} />
                </div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs text-muted-foreground">Linked Invoice</p>
                <p className="mt-0.5 text-sm font-medium text-blue-600">
                  {getInvoice(viewTarget.invoiceId)?.invoiceNumber ?? viewTarget.invoiceId}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="mt-0.5 text-sm font-bold text-foreground">
                  {fmtINR(viewTarget.amount)}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 col-span-2">
                <p className="text-xs text-muted-foreground">Customer</p>
                <p className="mt-0.5 text-sm font-medium text-foreground">
                  {getCustomer(viewTarget.customerId)?.name ?? viewTarget.customerId}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 col-span-2">
                <p className="text-xs text-muted-foreground">Reason</p>
                <p className="mt-0.5 text-sm text-foreground">{viewTarget.reason}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs text-muted-foreground">Created Date</p>
                <p className="mt-0.5 text-sm text-foreground">{fmtDate(viewTarget.createdDate)}</p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <SecondaryButton onClick={() => setViewTarget(null)}>Close</SecondaryButton>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
}
