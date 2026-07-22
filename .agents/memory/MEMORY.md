# Memory Index

- [Lovable-imported TanStack Start projects](lovable-tanstack-projects.md) — use bun install (bun.lock is canonical), don't edit vite.config.ts plugins, Supabase has no Replit integration.
- [Nexora Billing inventory movements](nexora-inventory-movements.md) — stock management design decisions, trigger-based stock updates, pending-approval pattern for adjustments.
- [Nexora invoices DB integration](nexora-invoices-integration.md) — InvoiceBuilder/InvoicesTab/Dashboard wired to Supabase; customer adapter pattern, skipMovements flag, LiveStatCards.
- [Nexora Inventory Supabase Wiring](nexora-inventory-wiring.md) — which tabs are live vs still mock; hook coverage; dbToSupplier adapter pattern; productCount computed from useProducts.
- [Nexora Credit Notes module](nexora-credit-notes.md) — fully Supabase-backed; schema, service, hook patterns; PrimaryButton now accepts disabled prop.
