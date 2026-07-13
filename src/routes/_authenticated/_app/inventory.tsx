import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutGrid,
  Package,
  Tag,
  Award,
  Ruler,
  Truck,
  ClipboardList,
  Receipt,
  ArrowDownToLine,
  ArrowUpFromLine,
  SlidersHorizontal,
  AlertTriangle,
  Barcode,
  BarChart3,
  Settings,
} from "lucide-react";

import { OverviewTab } from "../../../components/inventory/tabs/OverviewTab";
import { ProductsTab } from "../../../components/inventory/tabs/ProductsTab";
import { CategoriesTab } from "../../../components/inventory/tabs/CategoriesTab";
import { BrandsTab } from "../../../components/inventory/tabs/BrandsTab";
import { UnitsTab } from "../../../components/inventory/tabs/UnitsTab";
import { SuppliersTab } from "../../../components/inventory/tabs/SuppliersTab";
import { PurchaseOrdersTab } from "../../../components/inventory/tabs/PurchaseOrdersTab";
import { PurchaseBillsTab } from "../../../components/inventory/tabs/PurchaseBillsTab";
import { StockInTab } from "../../../components/inventory/tabs/StockInTab";
import { StockOutTab } from "../../../components/inventory/tabs/StockOutTab";
import { StockAdjustmentsTab } from "../../../components/inventory/tabs/StockAdjustmentsTab";
import { LowStockTab } from "../../../components/inventory/tabs/LowStockTab";
import { BarcodeTab } from "../../../components/inventory/tabs/BarcodeTab";
import { ReportsTab } from "../../../components/inventory/tabs/ReportsTab";
import { SettingsTab } from "../../../components/inventory/tabs/SettingsTab";

export const Route = createFileRoute("/_authenticated/_app/inventory")({
  component: InventoryPage,
});

// ── Sub-navigation ────────────────────────────────────────────────

type TabId =
  | "overview"
  | "products"
  | "categories"
  | "brands"
  | "units"
  | "suppliers"
  | "purchase-orders"
  | "purchase-bills"
  | "stock-in"
  | "stock-out"
  | "stock-adjustments"
  | "low-stock"
  | "barcode"
  | "reports"
  | "settings";

interface InventoryNavItem {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const navItems: InventoryNavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "products", label: "Products", icon: Package },
  { id: "categories", label: "Categories", icon: Tag },
  { id: "brands", label: "Brands", icon: Award },
  { id: "units", label: "Units", icon: Ruler },
  { id: "suppliers", label: "Suppliers", icon: Truck },
  { id: "purchase-orders", label: "Purchase Orders", icon: ClipboardList },
  { id: "purchase-bills", label: "Purchase Bills", icon: Receipt },
  { id: "stock-in", label: "Stock In", icon: ArrowDownToLine },
  { id: "stock-out", label: "Stock Out", icon: ArrowUpFromLine },
  { id: "stock-adjustments", label: "Stock Adjustments", icon: SlidersHorizontal },
  { id: "low-stock", label: "Low Stock", icon: AlertTriangle },
  { id: "barcode", label: "Barcode Management", icon: Barcode },
  { id: "reports", label: "Inventory Reports", icon: BarChart3 },
  { id: "settings", label: "Inventory Settings", icon: Settings },
];

function InventoryPage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <div className="min-h-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px] space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Products, stock, purchasing, and warehouse operations — all in one place.
            </p>
          </div>
        </div>

        {/* Sub-navigation */}
        <div className="rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
          <div className="flex gap-1 overflow-x-auto scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-150 ${
                    active
                      ? "bg-[image:var(--gradient-brand)] text-white shadow-[0_4px_16px_-4px_oklch(0.62_0.22_258/0.45)]"
                      : "text-muted-foreground hover:bg-slate-100 hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : ""}`} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active tab content */}
        <div>
          {activeTab === "overview" && <OverviewTab onNavigate={(id) => setActiveTab(id as TabId)} />}
          {activeTab === "products" && <ProductsTab />}
          {activeTab === "categories" && <CategoriesTab />}
          {activeTab === "brands" && <BrandsTab />}
          {activeTab === "units" && <UnitsTab />}
          {activeTab === "suppliers" && <SuppliersTab />}
          {activeTab === "purchase-orders" && <PurchaseOrdersTab />}
          {activeTab === "purchase-bills" && <PurchaseBillsTab />}
          {activeTab === "stock-in" && <StockInTab />}
          {activeTab === "stock-out" && <StockOutTab />}
          {activeTab === "stock-adjustments" && <StockAdjustmentsTab />}
          {activeTab === "low-stock" && <LowStockTab onCreatePO={() => setActiveTab("purchase-orders")} />}
          {activeTab === "barcode" && <BarcodeTab />}
          {activeTab === "reports" && <ReportsTab />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}
