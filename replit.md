# Nexora Billing

AI-powered billing and business management landing page for modern Indian businesses.

## Stack

- **Framework**: TanStack Start (React 19 + SSR via Vite + Nitro)
- **Styling**: Tailwind CSS v4
- **UI components**: shadcn/ui (Radix primitives)
- **Auth**: Supabase Auth
- **Language**: TypeScript

## Running the app

```bash
npm run dev
```

Runs on **port 5000**. The workflow "Start application" handles this automatically.

## Environment variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |

## Database setup

Run `supabase/schema.sql` in the Supabase SQL Editor to create:
- `profiles` table (auto-populated on signup via trigger)
- Row-level security policies
- `updated_at` auto-update trigger

## Project structure

```
src/
  routes/
    index.tsx                   # Landing page (do not modify)
    __root.tsx                  # Root layout (AuthProvider lives here)
    login.tsx                   # /login
    signup.tsx                  # /signup
    forgot-password.tsx         # /forgot-password
    reset-password.tsx          # /reset-password
    verify-email.tsx            # /verify-email
    _authenticated.tsx          # Protected layout (redirects to /login if unauthed)
    _authenticated/
      onboarding.tsx            # Business setup wizard (protected, do not modify)
      _app.tsx                  # App shell (sidebar + topbar) for signed-in pages
      _app/
        dashboard.tsx           # /dashboard (protected, do not modify)
        billing.tsx             # /billing (protected, "Coming soon" — do not modify)
        crm.tsx                 # /crm (protected, "Coming soon" — do not modify)
        finance.tsx             # /finance (protected, "Coming soon" — do not modify)
        inventory.tsx           # /inventory (protected) — Inventory Management module, tab shell
  contexts/
    AuthContext.tsx             # AuthProvider, useAuth, useSession hooks
    BusinessContext.tsx         # BusinessProvider, useBusiness (business record + onboarding state)
  lib/
    supabase.ts                 # Lazy Supabase client (browser-only, SSR-safe)
    inventory-data.ts           # Mock data + types + helpers for the Inventory module (no backend)
  components/
    Logo.tsx                    # Shared Nexora logo component
    AppSidebar.tsx               # Sidebar nav for signed-in app
    ui/                         # shadcn/ui components
    inventory/
      shared.tsx                 # Shared UI primitives for Inventory tabs (SectionCard, StatTile, StatusPill, etc.)
      tabs/                       # One component per Inventory sub-section (Products, Categories, Suppliers, Purchase Orders, Stock In/Out/Adjustments, Low Stock, Barcode, Reports, Settings, ...)
  hooks/                        # React hooks
```

## Auth flow

```
Landing page (/)
  → Sign Up (/signup)
    → Verify Email (/verify-email)
  → Login (/login)
    → Dashboard (/dashboard)  ← protected
  → Forgot Password (/forgot-password)
    → Reset Password (/reset-password)
```

## Inventory Management module

`/inventory` is a self-contained, mock-data-only module (no backend, no Supabase calls) covering 15 sub-sections rendered as tabs within a single route: Overview, Products, Categories, Brands, Units, Suppliers, Purchase Orders, Purchase Bills, Stock In, Stock Out, Stock Adjustments, Low Stock, Barcode Management, Inventory Reports, Inventory Settings.

- All mock data (products, categories, brands, units, suppliers, purchase orders/bills, stock movements) and helpers live in `src/lib/inventory-data.ts`. Uses realistic Indian business data (₹ pricing, GST numbers, SKUs/barcodes).
- Shared UI primitives (cards, stat tiles, status pills, search/pagination, buttons) live in `src/components/inventory/shared.tsx`.
- Each tab is its own component under `src/components/inventory/tabs/`, wired together by the tab shell in `src/routes/_authenticated/_app/inventory.tsx`.
- All interactivity (create/edit/delete, search, filter, sort, pagination, CSV export) is client-side React state seeded from the mock data — nothing persists across a page reload, and there are no API/database calls.
- Follows the same design system as the rest of the app (rounded-2xl white cards, slate borders, brand gradient, recharts, framer-motion) — no new visual language was introduced.
- Landing page, Auth, Business Setup Wizard, Dashboard, and the Billing module were intentionally left untouched while building this.

## Notes

- The Supabase client uses a lazy Proxy to defer instantiation until the browser — safe for SSR with Node 20
- `_authenticated.tsx` is a pathless layout route; all routes inside `_authenticated/` are protected
- The landing page (`/`) and auth pages are public
- Vite config delegates to `@lovable.dev/vite-tanstack-config`; do not add duplicate plugins

## User preferences
