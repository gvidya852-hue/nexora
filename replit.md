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
      dashboard.tsx             # /dashboard (protected)
  contexts/
    AuthContext.tsx             # AuthProvider, useAuth, useSession hooks
  lib/
    supabase.ts                 # Lazy Supabase client (browser-only, SSR-safe)
  components/
    Logo.tsx                    # Shared Nexora logo component
    ui/                         # shadcn/ui components
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

## Notes

- The Supabase client uses a lazy Proxy to defer instantiation until the browser — safe for SSR with Node 20
- `_authenticated.tsx` is a pathless layout route; all routes inside `_authenticated/` are protected
- The landing page (`/`) and auth pages are public
- Vite config delegates to `@lovable.dev/vite-tanstack-config`; do not add duplicate plugins

## User preferences
