// ── Documents Tab ─────────────────────────────────────────────────
import { motion } from "framer-motion";
import {
  FileText,
  FileSpreadsheet,
  FileClock,
  Truck,
  Undo2,
  Redo2,
  Repeat,
  ShoppingCart,
  ArrowRight,
  Plus,
} from "lucide-react";
import {
  invoices,
  quotations,
  proformaInvoices,
  deliveryChallans,
  creditNotes,
  debitNotes,
  recurringInvoices,
  getCustomer,
  fmtINR,
  fmtDate,
  computeDocumentTotals,
} from "@/lib/billing-data";
import { SectionCard } from "@/components/billing/shared";
import { BillingStatusPill } from "@/components/billing/shared";

// ── Document type card data ────────────────────────────────────────
interface DocTypeCard {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  count: number;
  colorBg: string;
  colorText: string;
  colorBorder: string;
  viewTab?: string;
  comingSoon?: boolean;
}

const docTypes: DocTypeCard[] = [
  {
    id: "invoices",
    label: "Invoices",
    description: "GST-compliant tax invoices",
    icon: FileText,
    count: invoices.length,
    colorBg: "bg-blue-50",
    colorText: "text-blue-600",
    colorBorder: "border-blue-200",
    viewTab: "invoices",
  },
  {
    id: "quotations",
    label: "Quotations",
    description: "Price quotations for customers",
    icon: FileSpreadsheet,
    count: quotations.length,
    colorBg: "bg-violet-50",
    colorText: "text-violet-600",
    colorBorder: "border-violet-200",
    viewTab: "quotations",
  },
  {
    id: "proforma",
    label: "Proforma Invoices",
    description: "Pre-invoice estimates",
    icon: FileClock,
    count: proformaInvoices.length,
    colorBg: "bg-amber-50",
    colorText: "text-amber-600",
    colorBorder: "border-amber-200",
  },
  {
    id: "delivery-challans",
    label: "Delivery Challans",
    description: "Goods delivery documents",
    icon: Truck,
    count: deliveryChallans.length,
    colorBg: "bg-emerald-50",
    colorText: "text-emerald-600",
    colorBorder: "border-emerald-200",
  },
  {
    id: "credit-notes",
    label: "Credit Notes",
    description: "Customer credit adjustments",
    icon: Undo2,
    count: creditNotes.length,
    colorBg: "bg-rose-50",
    colorText: "text-rose-600",
    colorBorder: "border-rose-200",
    viewTab: "credit-notes",
  },
  {
    id: "debit-notes",
    label: "Debit Notes",
    description: "Supplier debit adjustments",
    icon: Redo2,
    count: debitNotes.length,
    colorBg: "bg-orange-50",
    colorText: "text-orange-600",
    colorBorder: "border-orange-200",
  },
  {
    id: "recurring",
    label: "Recurring Invoices",
    description: "Scheduled recurring billing",
    icon: Repeat,
    count: recurringInvoices.length,
    colorBg: "bg-indigo-50",
    colorText: "text-indigo-600",
    colorBorder: "border-indigo-200",
    viewTab: "recurring",
  },
  {
    id: "purchase",
    label: "Purchase Invoices",
    description: "Purchase invoices from suppliers",
    icon: ShoppingCart,
    count: 0,
    colorBg: "bg-slate-50",
    colorText: "text-slate-500",
    colorBorder: "border-slate-200",
    comingSoon: true,
  },
];

// ── Document Type Card ─────────────────────────────────────────────
function DocCard({ doc, index }: { doc: DocTypeCard; index: number }) {
  const Icon = doc.icon;

  const handleViewAll = () => {
    if (doc.comingSoon) return;
    if (doc.viewTab) {
      alert(`Navigate to ${doc.label} — handled by billing route tab switching`);
    } else {
      alert(`Navigate to ${doc.label} — handled by billing route tab switching`);
    }
  };

  const handleCreate = () => {
    if (doc.comingSoon) return;
    const descriptions: Record<string, string> = {
      invoices: "Opens the invoice builder with GST calculation",
      quotations: "Creates a new customer quotation",
      proforma: "Creates a proforma invoice for customer approval",
      "delivery-challans": "Generates a delivery challan for dispatch",
      "credit-notes": "Issues a credit note against an existing invoice",
      "debit-notes": "Raises a debit note for supplier adjustments",
      recurring: "Sets up a new recurring invoice schedule",
    };
    alert(`Create ${doc.label} — ${descriptions[doc.id] ?? "Opens document creator"}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className={`relative rounded-2xl border ${doc.colorBorder} bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200`}
    >
      {doc.comingSoon && (
        <div className="absolute top-3 right-3">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
            Coming Soon
          </span>
        </div>
      )}

      {/* Icon */}
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${doc.colorBg}`}>
        <Icon className={`h-6 w-6 ${doc.colorText}`} />
      </div>

      {/* Info */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-foreground">{doc.label}</h3>
          {!doc.comingSoon && (
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${doc.colorBg} ${doc.colorText}`}>
              {doc.count}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{doc.description}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleViewAll}
          disabled={doc.comingSoon}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
            doc.comingSoon
              ? "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
              : `${doc.colorBorder} ${doc.colorBg} ${doc.colorText} hover:opacity-80`
          }`}
        >
          View All <ArrowRight className="h-3 w-3" />
        </button>
        <button
          onClick={handleCreate}
          disabled={doc.comingSoon}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
            doc.comingSoon
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-[image:var(--gradient-brand)] text-white shadow-sm hover:opacity-90"
          }`}
        >
          <Plus className="h-3 w-3" /> Create New
        </button>
      </div>
    </motion.div>
  );
}

// ── Recent Proforma Invoices ───────────────────────────────────────
function RecentProformaList() {
  return (
    <SectionCard title="Recent Proforma Invoices">
      {proformaInvoices.length === 0 ? (
        <p className="text-sm text-muted-foreground">No proforma invoices found.</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {proformaInvoices.map((pi, i) => {
            const cust = getCustomer(pi.customerId);
            const total = computeDocumentTotals(pi.items, false).grandTotal;
            return (
              <motion.div
                key={pi.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold font-mono text-foreground">{pi.proformaNumber}</p>
                  <p className="text-xs text-muted-foreground truncate">{cust?.name ?? pi.customerId}</p>
                  <p className="text-xs text-muted-foreground">Valid until {fmtDate(pi.validUntil)}</p>
                </div>
                <div className="shrink-0 text-right space-y-1">
                  <p className="text-sm font-bold text-foreground">{fmtINR(total)}</p>
                  <BillingStatusPill status={pi.status} />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}

// ── Recent Delivery Challans ───────────────────────────────────────
function RecentChallanList() {
  return (
    <SectionCard title="Recent Delivery Challans">
      {deliveryChallans.length === 0 ? (
        <p className="text-sm text-muted-foreground">No delivery challans found.</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {deliveryChallans.map((dc, i) => {
            const cust = getCustomer(dc.customerId);
            return (
              <motion.div
                key={dc.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold font-mono text-foreground">{dc.challanNumber}</p>
                  <p className="text-xs text-muted-foreground truncate">{cust?.name ?? dc.customerId}</p>
                  <p className="text-xs text-muted-foreground">Delivery: {fmtDate(dc.deliveryDate)}</p>
                </div>
                <div className="shrink-0 text-right space-y-1">
                  {dc.vehicleNumber && (
                    <p className="text-xs font-mono text-slate-500">{dc.vehicleNumber}</p>
                  )}
                  <BillingStatusPill status={dc.status} />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}

// ── Main Component ─────────────────────────────────────────────────
export function DocumentsTab() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h2 className="text-lg font-bold text-foreground">Document Management</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          All your billing documents in one place — invoices, challans, credit notes, and more.
        </p>
      </div>

      {/* Document type grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {docTypes.map((doc, i) => (
          <DocCard key={doc.id} doc={doc} index={i} />
        ))}
      </div>

      {/* Recent documents lists */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentProformaList />
        <RecentChallanList />
      </div>
    </div>
  );
}
