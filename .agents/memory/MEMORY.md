# Memory Index

- [Lovable-imported TanStack Start projects](lovable-tanstack-projects.md) — use bun install (bun.lock is canonical), don't edit vite.config.ts plugins, Supabase has no Replit integration.
- [Nexora Billing inventory movements](nexora-inventory-movements.md) — stock management design decisions, trigger-based stock updates, pending-approval pattern for adjustments.
- [Nexora invoices DB integration](nexora-invoices-integration.md) — InvoiceBuilder/InvoicesTab/Dashboard wired to Supabase; customer adapter pattern, skipMovements flag, LiveStatCards.
- [Nexora Inventory Supabase Wiring](nexora-inventory-wiring.md) — which tabs are live vs still mock; hook coverage; dbToSupplier adapter pattern; productCount computed from useProducts.
- [Nexora Credit Notes module](nexora-credit-notes.md) — fully Supabase-backed; schema, service, hook patterns; PrimaryButton now accepts disabled prop; SecondaryButton onClick limitations.
- [Nexora Quotations module](nexora-quotations.md) — fully Supabase-backed; QT-YYYY-#### numbers; convert-to-invoice; product search by name/SKU/barcode; useBusiness().business?.id pattern.
- [Nexora Recurring Invoices module](nexora-recurring-module.md) — fully Supabase-backed; schema in schema_recurring.sql (not yet applied); generateInvoice() ready for scheduler; DbProduct uses tax_rate not gst_percent.
