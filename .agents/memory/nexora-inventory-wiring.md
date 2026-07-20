---
name: Nexora Inventory Supabase Wiring
description: Which inventory tabs are wired to Supabase and which still use mock data, plus hook/service coverage.
---

## Tabs fully wired to Supabase (as of July 2026)

| Tab | Notes |
|-----|-------|
| OverviewTab | KPIs, charts, timeline all from DB hooks |
| ProductsTab | Full CRUD + search/filter/pagination |
| StockInTab | useCreateStockIn + useInventoryMovements |
| StockOutTab | useCreateStockOut; shows insufficient-stock warning |
| StockAdjustmentsTab | pending-approval pattern; approved calls useCreateStockAdjustment |
| LowStockTab | useProducts + useCategories + useSuppliers |
| CategoriesTab | Full CRUD via useCategories/useCreate/useUpdate/useDelete |
| SuppliersTab | Full CRUD via useSuppliers/useCreate/useUpdate/useDelete; dbToSupplier adapter maps snake_case → camelCase |
| BarcodeTab | useProducts for product selector dropdown |

## Tabs still using mock data (no DB table yet)

- BrandsTab, UnitsTab — no brands/units tables
- PurchaseOrdersTab, PurchaseBillsTab — no PO/bills tables
- ReportsTab — uses mock products/suppliers/categories/stockMovements
- SettingsTab — local config only

## Hook coverage in useProductsQuery.ts

Products: useProducts, useCreateProduct, useUpdateProduct (optimistic), useDeleteProduct, useDeleteManyProducts, useBulkUpdateProducts
Categories: useCategories, useCreateCategory, useUpdateCategory (optimistic), useDeleteCategory (optimistic)
Suppliers: useSuppliers, useCreateSupplier, useUpdateSupplier, useDeleteSupplier (optimistic)

## Key patterns

- `dbToSupplier(db: DbSupplier): Supplier` adapter defined inline in SuppliersTab (maps snake_case DB fields to camelCase UI type)
- `supplierFormStateToDb(data, businessId): DbSupplierInsert` maps form state to DB insert
- Categories: productCount computed from `useProducts` filtered by `category_id` (not a DB field)
- SupplierProfileDialog "Recent Orders" section shows empty state (no PO table yet)
- GlobalSearch in inventory.tsx uses live hooks; `useMemo` for filtering

## **Why:**
The DB schema uses snake_case (Postgres convention); UI components use camelCase (React convention). Adapter functions at the tab boundary keep the DB types isolated from the UI logic.
