# Nexora Billing

AI-powered billing and business management landing page for modern Indian businesses.

## Stack

- **Framework**: TanStack Start (React 19 + SSR via Vite + Nitro)
- **Styling**: Tailwind CSS v4
- **UI components**: shadcn/ui (Radix primitives)
- **Language**: TypeScript

## Running the app

```bash
npm run dev
```

Runs on **port 5000**. The workflow "Start application" handles this automatically.

## Project structure

```
src/
  routes/
    index.tsx       # Full landing page (Hero, Features, Pricing, FAQ, Contact)
    __root.tsx      # Root layout
  components/       # shadcn/ui components
  hooks/            # React hooks
  lib/              # Utilities
  start.ts          # TanStack Start entry
  server.ts         # SSR error wrapper
vite.config.ts      # Vite config (uses @lovable.dev/vite-tanstack-config)
```

## Notes

- All landing page content lives in `src/routes/index.tsx`
- The app is currently a static landing page — no backend or database
- Vite config delegates to `@lovable.dev/vite-tanstack-config`; do not add duplicate plugins (tanstackStart, tailwindcss, react, etc.)

## User preferences
