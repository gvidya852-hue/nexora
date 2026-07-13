// ── Invoice Templates Tab ─────────────────────────────────────────
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Eye, Star } from "lucide-react";
import { invoiceTemplates, type InvoiceTemplate } from "@/lib/billing-data";
import {
  SectionCard,
  PrimaryButton,
  SecondaryButton,
  ModalShell,
} from "@/components/billing/shared";

// ── Mini Template Preview (card thumbnail) ─────────────────────────
function TemplatePreview({ template, scale = 1 }: { template: InvoiceTemplate; scale?: number }) {
  const w = 160 * scale;
  const h = 210 * scale;
  const r = 6 * scale;
  const headerH = 36 * scale;
  const pad = 12 * scale;
  const lineH = 5 * scale;
  const lineGap = 8 * scale;
  const tableH = 4 * scale;
  const tableGap = 6 * scale;

  return (
    <div
      className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm"
      style={{ width: w, height: h, borderRadius: r }}
    >
      {/* Header band */}
      <div
        style={{
          backgroundColor: template.accentColor,
          height: headerH,
          display: "flex",
          alignItems: "center",
          padding: `0 ${pad}px`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 3 * scale }}>
          <div
            style={{
              width: 50 * scale,
              height: 5 * scale,
              backgroundColor: "rgba(255,255,255,0.9)",
              borderRadius: 2,
            }}
          />
          <div
            style={{
              width: 32 * scale,
              height: 3.5 * scale,
              backgroundColor: "rgba(255,255,255,0.5)",
              borderRadius: 2,
            }}
          />
        </div>
        <div style={{ marginLeft: "auto" }}>
          <div
            style={{
              width: 28 * scale,
              height: 14 * scale,
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 3 * scale,
            }}
          />
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: pad }}>
        {/* "To" section */}
        <div style={{ marginBottom: lineGap }}>
          <div
            style={{
              width: 24 * scale,
              height: 3 * scale,
              backgroundColor: template.accentColor,
              opacity: 0.5,
              borderRadius: 2,
              marginBottom: 3 * scale,
            }}
          />
          <div
            style={{
              width: 70 * scale,
              height: lineH,
              backgroundColor: "#e2e8f0",
              borderRadius: 2,
              marginBottom: 3 * scale,
            }}
          />
          <div
            style={{
              width: 54 * scale,
              height: lineH - 1,
              backgroundColor: "#f1f5f9",
              borderRadius: 2,
            }}
          />
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            backgroundColor: "#e2e8f0",
            marginBottom: lineGap,
          }}
        />

        {/* Table header */}
        <div
          style={{
            display: "flex",
            gap: 4 * scale,
            marginBottom: 5 * scale,
          }}
        >
          {[50, 24, 24].map((w2, i) => (
            <div
              key={i}
              style={{
                width: w2 * scale,
                height: tableH,
                backgroundColor: template.accentColor,
                opacity: 0.15,
                borderRadius: 2,
              }}
            />
          ))}
        </div>

        {/* Table rows */}
        {[0, 1, 2].map((row) => (
          <div
            key={row}
            style={{
              display: "flex",
              gap: 4 * scale,
              marginBottom: tableGap,
            }}
          >
            {[50, 24, 24].map((w2, i) => (
              <div
                key={i}
                style={{
                  width: (w2 - row * 4) * scale,
                  height: tableH - 1,
                  backgroundColor: "#f1f5f9",
                  borderRadius: 2,
                }}
              />
            ))}
          </div>
        ))}

        {/* Divider */}
        <div
          style={{
            height: 1,
            backgroundColor: "#e2e8f0",
            margin: `${lineGap}px 0`,
          }}
        />

        {/* Total line */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8 * scale,
          }}
        >
          <div
            style={{
              width: 32 * scale,
              height: lineH,
              backgroundColor: "#e2e8f0",
              borderRadius: 2,
            }}
          />
          <div
            style={{
              width: 28 * scale,
              height: lineH,
              backgroundColor: template.accentColor,
              opacity: 0.6,
              borderRadius: 2,
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────
export function TemplatesTab() {
  const [templates, setTemplates] = useState<InvoiceTemplate[]>(invoiceTemplates);
  const [previewTemplate, setPreviewTemplate] = useState<InvoiceTemplate | null>(null);

  function handleSetDefault(id: string) {
    setTemplates((prev) => prev.map((tpl) => ({ ...tpl, isDefault: tpl.id === id })));
  }

  return (
    <div className="space-y-6">
      <SectionCard
        title="Invoice Templates"
        subtitle="Choose and customise the visual layout used for your invoices"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((tpl, i) => (
            <motion.div
              key={tpl.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06, ease: "easeOut" }}
              className={`relative flex flex-col rounded-2xl border p-4 transition-all duration-200 hover:shadow-md ${
                tpl.isDefault
                  ? "border-blue-300 bg-blue-50/40 shadow-sm"
                  : "border-slate-200 bg-white"
              }`}
            >
              {/* Default badge */}
              {tpl.isDefault && (
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                  <Star className="h-2.5 w-2.5" />
                  Default
                </div>
              )}

              {/* Preview thumbnail */}
              <div className="flex justify-center mb-4">
                <TemplatePreview template={tpl} scale={0.85} />
              </div>

              {/* Info */}
              <div className="mb-1 flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: tpl.accentColor }}
                />
                <p className="text-sm font-semibold text-foreground truncate">{tpl.name}</p>
              </div>
              <p className="mb-4 text-xs text-muted-foreground leading-relaxed">
                {tpl.description}
              </p>

              {/* Actions */}
              <div className="mt-auto flex flex-col gap-2">
                <SecondaryButton
                  icon={Eye}
                  onClick={() => setPreviewTemplate(tpl)}
                  className="w-full justify-center"
                >
                  Preview
                </SecondaryButton>
                {!tpl.isDefault && (
                  <PrimaryButton
                    icon={CheckCircle2}
                    onClick={() => handleSetDefault(tpl.id)}
                    className="w-full justify-center"
                  >
                    Set as Default
                  </PrimaryButton>
                )}
                {tpl.isDefault && (
                  <div className="flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Currently Active
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </SectionCard>

      {/* Preview Modal */}
      <ModalShell
        open={previewTemplate !== null}
        onClose={() => setPreviewTemplate(null)}
        title={previewTemplate ? `Preview — ${previewTemplate.name}` : ""}
        wide
      >
        {previewTemplate && (
          <div className="flex flex-col items-center gap-6">
            {/* Large preview */}
            <TemplatePreview template={previewTemplate} scale={2.2} />

            {/* Details */}
            <div className="w-full max-w-sm space-y-3 text-center">
              <div className="flex items-center justify-center gap-2">
                <span
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: previewTemplate.accentColor }}
                />
                <p className="text-base font-semibold text-foreground">{previewTemplate.name}</p>
                {previewTemplate.isDefault && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                    <Star className="h-2.5 w-2.5" />
                    Default
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{previewTemplate.description}</p>
              <p className="text-xs text-muted-foreground">
                Accent colour:{" "}
                <span className="font-semibold text-foreground">{previewTemplate.accentColor}</span>
              </p>
            </div>

            <div className="flex gap-3">
              {!previewTemplate.isDefault && (
                <PrimaryButton
                  icon={CheckCircle2}
                  onClick={() => {
                    handleSetDefault(previewTemplate.id);
                    setPreviewTemplate(null);
                  }}
                >
                  Set as Default
                </PrimaryButton>
              )}
              <SecondaryButton onClick={() => setPreviewTemplate(null)}>Close</SecondaryButton>
            </div>
          </div>
        )}
      </ModalShell>
    </div>
  );
}
