// ── WarehouseTab ──────────────────────────────────────────────────
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Warehouse,
  MapPin,
  Package,
  BarChart3,
  Lock,
  Sparkles,
  Plus,
  User,
  Phone,
  Layers,
  Thermometer,
  Grid3X3,
  Box,
} from "lucide-react";
import { warehouses, fmtINR, products, stockValue } from "@/lib/inventory-data";
import { SectionCard } from "@/components/inventory/shared";

// ── Zone helpers ──────────────────────────────────────────────────

const zoneTypeColors: Record<string, string> = {
  rack: "bg-blue-50 text-blue-700 border-blue-200",
  bin: "bg-violet-50 text-violet-700 border-violet-200",
  floor: "bg-amber-50 text-amber-700 border-amber-200",
  "cold-storage": "bg-cyan-50 text-cyan-700 border-cyan-200",
};

function ZoneIcon({ type }: { type: string }) {
  const cls = "h-5 w-5";
  if (type === "rack") return <Layers className={cls} />;
  if (type === "bin") return <Box className={cls} />;
  if (type === "floor") return <Grid3X3 className={cls} />;
  if (type === "cold-storage") return <Thermometer className={cls} />;
  return <Package className={cls} />;
}

// ── Mock bin locations derived from zones ─────────────────────────

interface BinLocation {
  code: string;
  zone: string;
  type: string;
  capacity: number;
  used: number;
}

function generateBinLocations(): BinLocation[] {
  const wh = warehouses[0];
  const bins: BinLocation[] = [];
  const zoneSlice = wh.zones.slice(0, 4); // Use rack + bin zones
  zoneSlice.forEach((zone) => {
    const rows = zone.type === "floor" ? 2 : 2;
    for (let i = 1; i <= rows; i++) {
      const cap = Math.round(zone.capacity / rows);
      const used = Math.round((zone.used / zone.capacity) * cap * (0.8 + Math.random() * 0.4));
      bins.push({
        code: `${zone.locationCode}-0${i}`,
        zone: zone.name.split("—")[1]?.trim() ?? zone.name,
        type: zone.type,
        capacity: cap,
        used: Math.min(used, cap),
      });
    }
  });
  return bins.slice(0, 8);
}

const binLocations = generateBinLocations();

// ── WarehouseTab ──────────────────────────────────────────────────

export function WarehouseTab() {
  const wh = warehouses[0];
  const utilPct = Math.round((wh.usedCapacity / wh.totalCapacity) * 100);
  const available = wh.totalCapacity - wh.usedCapacity;

  // Total stock value stored in this warehouse (all products)
  const totalValue = products.reduce((s, p) => s + stockValue(p), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Warehouse Management</h2>
          <p className="text-sm text-muted-foreground">Storage locations, zones, and capacity</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            1 Active Warehouse
          </span>
          <div className="relative group">
            <button
              disabled
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-400 cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              Add Warehouse
            </button>
            <div className="absolute right-0 top-full mt-1.5 z-10 hidden group-hover:block whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 shadow-lg">
              Multi-warehouse coming soon
            </div>
          </div>
        </div>
      </div>

      {/* Warehouse Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                <Warehouse className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">{wh.name}</h3>
                <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-mono font-semibold text-slate-600">
                  {wh.code}
                </span>
              </div>
              {wh.isDefault && (
                <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                  Default
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                <span>{wh.address}, {wh.city}, {wh.state} — {wh.pincode}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4 shrink-0 text-slate-400" />
                <span>{wh.manager}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                <span>{wh.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4 shrink-0 text-slate-400" />
                <span>{wh.zones.length} zones configured</span>
              </div>
            </div>

            {/* Utilization bar */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Storage Utilization</span>
                <span className="font-bold text-foreground">
                  {wh.usedCapacity.toLocaleString()} / {wh.totalCapacity.toLocaleString()} sq ft ({utilPct}%)
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${utilPct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-3 rounded-full ${utilPct >= 85 ? "bg-red-500" : utilPct >= 65 ? "bg-amber-500" : "bg-emerald-500"}`}
                />
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 lg:grid-cols-1 lg:w-48">
            {[
              { label: "Total Capacity", value: `${wh.totalCapacity.toLocaleString()} sq ft`, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Used", value: `${wh.usedCapacity.toLocaleString()} sq ft`, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Available", value: `${available.toLocaleString()} sq ft`, color: "text-emerald-600", bg: "bg-emerald-50" },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl ${s.bg} p-3 text-center`}>
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Zone Grid */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Zones</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wh.zones.map((zone, i) => {
            const pct = zone.capacity > 0 ? Math.round((zone.used / zone.capacity) * 100) : 0;
            const colorCls = zoneTypeColors[zone.type] ?? "bg-slate-100 text-slate-600 border-slate-200";
            return (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${colorCls}`}>
                      <ZoneIcon type={zone.type} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground leading-tight">{zone.name}</p>
                      <span className={`mt-0.5 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${colorCls}`}>
                        {zone.type.replace("-", " ")}
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-mono font-bold text-slate-600">
                    {zone.locationCode}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{zone.used.toLocaleString()} / {zone.capacity.toLocaleString()} sq ft</span>
                    <span className="font-bold text-foreground">{pct}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, delay: 0.1 + i * 0.06, ease: "easeOut" }}
                      className={`h-2 rounded-full ${pct >= 85 ? "bg-red-500" : pct >= 65 ? "bg-amber-500" : "bg-emerald-500"}`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bin/Rack Locations Table */}
      <SectionCard
        title="Bin / Rack Locations"
        subtitle="Individual storage slot utilization"
        action={
          <div className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1">
            <BarChart3 className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700">{binLocations.length} locations</span>
          </div>
        }
      >
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left">
                {["Location Code", "Zone", "Type", "Capacity (sq ft)", "Used (sq ft)", "Available (sq ft)", "Utilization"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {binLocations.map((bin, i) => {
                const avail = bin.capacity - bin.used;
                const pct = bin.capacity > 0 ? Math.round((bin.used / bin.capacity) * 100) : 0;
                return (
                  <motion.tr
                    key={bin.code}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-slate-100 hover:bg-slate-50 last:border-0 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-bold text-foreground">{bin.code}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{bin.zone}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${zoneTypeColors[bin.type] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                        {bin.type.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{bin.capacity.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{bin.used.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{avail.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-1.5 rounded-full ${pct >= 85 ? "bg-red-500" : pct >= 65 ? "bg-amber-500" : "bg-emerald-500"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-foreground">{pct}%</span>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Multi-Warehouse Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
            <Lock className="h-6 w-6 text-slate-400" />
          </div>
          <div className="flex-1">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
              <h3 className="text-sm font-bold text-foreground">Multi-Warehouse Support</h3>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">
                Coming Soon
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground max-w-xl">
              Manage multiple warehouses, inter-warehouse transfers, and zone-level stock tracking from one unified dashboard.
            </p>
          </div>
          <button
            disabled
            className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-400 cursor-not-allowed"
          >
            Learn More
          </button>
        </div>
      </motion.div>

      {/* AI Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
            <Sparkles className="h-4 w-4 text-slate-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400">Warehouse Optimization AI</p>
            <p className="text-xs text-slate-400">Auto-suggest optimal zone allocation and flag inefficiencies — Coming Soon</p>
          </div>
          <span className="ml-auto inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[11px] font-semibold text-slate-400">
            Coming Soon
          </span>
        </div>
      </motion.div>
    </div>
  );
}
