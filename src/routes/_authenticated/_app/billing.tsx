import { createFileRoute } from "@tanstack/react-router";
import { Receipt, Plus, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/_app/billing")({
  component: BillingPage,
});

function BillingPage() {
  return (
    <div className="flex min-h-full items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50">
          <Receipt className="h-9 w-9 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">GST Billing</h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Create GST-compliant invoices, track payments, manage credit notes, and generate e-invoices. Coming soon.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 text-left">
          {["GST Invoices","Credit Notes","Payment Tracking","E-Invoice (IRN)","Recurring Bills","Bulk Export"].map(f => (
            <div key={f} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />{f}
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Coming soon — in active development
        </div>
      </div>
    </div>
  );
}
