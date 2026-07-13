import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/_app/ai-assistant")({
  component: AiAssistantPage,
});

function AiAssistantPage() {
  return (
    <div className="flex min-h-full items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[image:var(--gradient-brand)] shadow-[0_8px_32px_-8px_oklch(0.62_0.22_258/0.5)]">
          <Sparkles className="h-9 w-9 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Nexora AI Assistant</h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Your intelligent business copilot. Ask questions, get insights, automate tasks, and make smarter decisions — all powered by AI.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 text-left">
          {["Business Insights","Smart Forecasting","Invoice Drafting","Stock Suggestions","Customer Summaries","Voice Commands"].map(f => (
            <div key={f} className="flex items-center gap-2 rounded-xl border border-[color:var(--brand-electric)]/20 bg-blue-50/50 px-3 py-2.5 text-xs font-medium text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-electric)]" />{f}
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-medium text-blue-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" /> Training on your business data — coming soon
        </div>
      </div>
    </div>
  );
}
