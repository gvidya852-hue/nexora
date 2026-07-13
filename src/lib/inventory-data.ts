// ── Nexora Inventory Module — Mock Data Layer ──────────────────────
// All data here is static/mock. No backend, no Supabase, no API calls.
// Structured so it can be swapped for real API responses later without
// changing component shapes.

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";
export type POStatus = "pending" | "approved" | "received" | "cancelled";
export type PaymentStatus = "paid" | "partial" | "unpaid" | "overdue";
export type MovementType = "in" | "out" | "adjustment";
export type AdjustmentType = "increase" | "decrease";
export type ApprovalStatus = "approved" | "pending" | "rejected";

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  color: string;
}

export interface Brand {
  id: string;
  name: string;
  description: string;
  productCount: number;
  logoInitial: string;
  color: string;
}

export interface Unit {
  id: string;
  name: string;
  shortCode: string;
  isCustom: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  gstNumber: string;
  city: string;
  outstandingAmount: number;
  rating: number;
  totalPurchases: number;
  productsSupplied: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  categoryId: string;
  brandId: string;
  unitId: string;
  supplierId: string;
  purchasePrice: number;
  sellingPrice: number;
  taxPercent: number;
  hsnCode: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  status: "active" | "inactive" | "archived";
  description: string;
  emoji: string;
}

export interface PurchaseOrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  status: POStatus;
  createdDate: string;
  expectedDate: string;
  items: PurchaseOrderItem[];
  notes: string;
}

export interface PurchaseBill {
  id: string;
  billNumber: string;
  poNumber: string;
  supplierId: string;
  billDate: string;
  dueDate: string;
  subtotal: number;
  gstAmount: number;
  total: number;
  paymentStatus: PaymentStatus;
  amountPaid: number;
}

export interface StockMovement {
  id: string;
  type: MovementType;
  referenceNumber: string;
  productId: string;
  quantity: number;
  supplierId?: string;
  reason?: string;
  invoiceRef?: string;
  adjustmentType?: AdjustmentType;
  approvalStatus?: ApprovalStatus;
  warehouse: string;
  notes: string;
  date: string;
  time: string;
}

// ── Units ─────────────────────────────────────────────────────────

export const units: Unit[] = [
  { id: "u1", name: "Piece", shortCode: "pc", isCustom: false },
  { id: "u2", name: "Kilogram", shortCode: "kg", isCustom: false },
  { id: "u3", name: "Gram", shortCode: "g", isCustom: false },
  { id: "u4", name: "Liter", shortCode: "L", isCustom: false },
  { id: "u5", name: "Box", shortCode: "box", isCustom: false },
  { id: "u6", name: "Packet", shortCode: "pkt", isCustom: false },
  { id: "u7", name: "Dozen", shortCode: "dz", isCustom: false },
  { id: "u8", name: "Meter", shortCode: "m", isCustom: false },
  { id: "u9", name: "Carton (12-pack)", shortCode: "ctn", isCustom: true },
];

// ── Categories ────────────────────────────────────────────────────

export const categories: Category[] = [
  { id: "c1", name: "Computers & Laptops", description: "Laptops, desktops, and computing accessories", productCount: 4, color: "bg-blue-500" },
  { id: "c2", name: "Peripherals", description: "Keyboards, mice, and input devices", productCount: 2, color: "bg-violet-500" },
  { id: "c3", name: "Networking", description: "Routers, switches, and networking gear", productCount: 1, color: "bg-emerald-500" },
  { id: "c4", name: "Storage Devices", description: "SSDs, HDDs, and external storage", productCount: 2, color: "bg-amber-500" },
  { id: "c5", name: "Security & Surveillance", description: "CCTV cameras and security systems", productCount: 1, color: "bg-red-500" },
  { id: "c6", name: "Printers & Scanners", description: "Printing and scanning equipment", productCount: 2, color: "bg-cyan-500" },
  { id: "c7", name: "Power & Backup", description: "UPS units and power accessories", productCount: 1, color: "bg-orange-500" },
  { id: "c8", name: "Office Furniture", description: "Chairs, desks, and workspace furniture", productCount: 2, color: "bg-pink-500" },
];

// ── Brands ────────────────────────────────────────────────────────

export const brands: Brand[] = [
  { id: "b1", name: "Dell", description: "Laptops and desktop computers", productCount: 2, logoInitial: "D", color: "bg-blue-600" },
  { id: "b2", name: "HP", description: "Printers, laptops, and scanners", productCount: 3, logoInitial: "H", color: "bg-sky-600" },
  { id: "b3", name: "Logitech", description: "Keyboards, mice, and peripherals", productCount: 2, logoInitial: "L", color: "bg-slate-700" },
  { id: "b4", name: "Samsung", description: "Monitors and storage devices", productCount: 2, logoInitial: "S", color: "bg-indigo-600" },
  { id: "b5", name: "TP-Link", description: "Networking equipment", productCount: 1, logoInitial: "T", color: "bg-emerald-600" },
  { id: "b6", name: "CP Plus", description: "CCTV and surveillance", productCount: 1, logoInitial: "C", color: "bg-red-600" },
  { id: "b7", name: "APC", description: "UPS and power backup", productCount: 1, logoInitial: "A", color: "bg-orange-600" },
  { id: "b8", name: "Godrej Interio", description: "Office furniture", productCount: 2, logoInitial: "G", color: "bg-pink-600" },
];

// ── Suppliers ─────────────────────────────────────────────────────

export const suppliers: Supplier[] = [
  { id: "s1", name: "Ingram Micro India Pvt Ltd", contactPerson: "Rakesh Malhotra", phone: "+91 98200 11223", email: "rakesh.m@ingrammicro.in", gstNumber: "27AAACI1234M1Z5", city: "Mumbai", outstandingAmount: 84500, rating: 4.6, totalPurchases: 1245000, productsSupplied: 6 },
  { id: "s2", name: "Redington India Ltd", contactPerson: "Sunita Iyer", phone: "+91 98450 33421", email: "sunita.iyer@redington.co.in", gstNumber: "33AAACR5678N1Z2", city: "Chennai", outstandingAmount: 32000, rating: 4.3, totalPurchases: 876000, productsSupplied: 4 },
  { id: "s3", name: "Rashi Peripherals Pvt Ltd", contactPerson: "Vivek Deshmukh", phone: "+91 99870 44556", email: "vivek.d@rptechindia.com", gstNumber: "27AABCR4321P1Z8", city: "Pune", outstandingAmount: 0, rating: 4.8, totalPurchases: 542000, productsSupplied: 3 },
  { id: "s4", name: "Savex Technologies", contactPerson: "Anita Kulkarni", phone: "+91 98220 77889", email: "anita.k@savex.in", gstNumber: "27AADCS9988Q1Z3", city: "Nagpur", outstandingAmount: 18900, rating: 4.1, totalPurchases: 298000, productsSupplied: 2 },
  { id: "s5", name: "Neoteric Infomatique Ltd", contactPerson: "Manoj Bhatt", phone: "+91 98120 99001", email: "manoj.bhatt@neoteric.co.in", gstNumber: "07AABCN6655R1Z1", city: "Delhi", outstandingAmount: 51200, rating: 3.9, totalPurchases: 421000, productsSupplied: 3 },
];

// ── Products ──────────────────────────────────────────────────────

export const products: Product[] = [
  { id: "p1", name: "Dell Vostro 15 Laptop", sku: "DEL-VOS15-001", barcode: "8901234500011", categoryId: "c1", brandId: "b1", unitId: "u1", supplierId: "s1", purchasePrice: 42000, sellingPrice: 49999, taxPercent: 18, hsnCode: "8471", currentStock: 14, minStock: 5, maxStock: 40, status: "active", description: "15.6-inch business laptop, Core i5, 8GB RAM, 512GB SSD", emoji: "💻" },
  { id: "p2", name: "HP ProBook 440 Laptop", sku: "HP-PB440-002", barcode: "8901234500028", categoryId: "c1", brandId: "b2", unitId: "u1", supplierId: "s2", purchasePrice: 45500, sellingPrice: 53990, taxPercent: 18, hsnCode: "8471", currentStock: 3, minStock: 5, maxStock: 30, status: "active", description: "14-inch professional laptop, Core i5, 16GB RAM, 512GB SSD", emoji: "💻" },
  { id: "p3", name: "Samsung 24\" LED Monitor", sku: "SAM-MON24-003", barcode: "8901234500035", categoryId: "c1", brandId: "b4", unitId: "u1", supplierId: "s1", purchasePrice: 8200, sellingPrice: 10999, taxPercent: 18, hsnCode: "8528", currentStock: 22, minStock: 8, maxStock: 60, status: "active", description: "24-inch Full HD LED monitor with HDMI + VGA", emoji: "🖥️" },
  { id: "p4", name: "Logitech K120 Keyboard", sku: "LOG-KB120-004", barcode: "8901234500042", categoryId: "c2", brandId: "b3", unitId: "u1", supplierId: "s3", purchasePrice: 350, sellingPrice: 549, taxPercent: 18, hsnCode: "8471", currentStock: 86, minStock: 20, maxStock: 200, status: "active", description: "USB wired keyboard, spill-resistant", emoji: "⌨️" },
  { id: "p5", name: "Logitech M100 Mouse", sku: "LOG-MS100-005", barcode: "8901234500059", categoryId: "c2", brandId: "b3", unitId: "u1", supplierId: "s3", purchasePrice: 220, sellingPrice: 399, taxPercent: 18, hsnCode: "8471", currentStock: 4, minStock: 15, maxStock: 150, status: "active", description: "Optical USB mouse, 1000 DPI", emoji: "🖱️" },
  { id: "p6", name: "HP LaserJet Pro M15w Printer", sku: "HP-PRN15-006", barcode: "8901234500066", categoryId: "c6", brandId: "b2", unitId: "u1", supplierId: "s2", purchasePrice: 9800, sellingPrice: 12499, taxPercent: 18, hsnCode: "8443", currentStock: 7, minStock: 4, maxStock: 25, status: "active", description: "Compact monochrome laser printer with WiFi", emoji: "🖨️" },
  { id: "p7", name: "HP ScanJet Pro 2000 Scanner", sku: "HP-SCN20-007", barcode: "8901234500073", categoryId: "c6", brandId: "b2", unitId: "u1", supplierId: "s4", purchasePrice: 13500, sellingPrice: 16999, taxPercent: 18, hsnCode: "8471", currentStock: 0, minStock: 3, maxStock: 15, status: "active", description: "Flatbed document scanner, 25 ppm", emoji: "🖨️" },
  { id: "p8", name: "APC 1100VA UPS", sku: "APC-UPS11-008", barcode: "8901234500080", categoryId: "c7", brandId: "b7", unitId: "u1", supplierId: "s5", purchasePrice: 4200, sellingPrice: 5799, taxPercent: 18, hsnCode: "8504", currentStock: 11, minStock: 6, maxStock: 40, status: "active", description: "Line-interactive UPS with surge protection", emoji: "🔌" },
  { id: "p9", name: "TP-Link Archer C6 Router", sku: "TPL-ARC6-009", barcode: "8901234500097", categoryId: "c3", brandId: "b5", unitId: "u1", supplierId: "s2", purchasePrice: 2400, sellingPrice: 3299, taxPercent: 18, hsnCode: "8517", currentStock: 2, minStock: 8, maxStock: 50, status: "active", description: "AC1200 dual-band WiFi router", emoji: "📡" },
  { id: "p10", name: "CP Plus 4-Channel CCTV Kit", sku: "CPP-CCTV4-010", barcode: "8901234500103", categoryId: "c5", brandId: "b6", unitId: "u1", supplierId: "s5", purchasePrice: 11200, sellingPrice: 14999, taxPercent: 18, hsnCode: "8525", currentStock: 5, minStock: 3, maxStock: 20, status: "active", description: "4-channel HD CCTV kit with 2 dome + 2 bullet cameras", emoji: "📷" },
  { id: "p11", name: "Samsung 500GB SSD 870 EVO", sku: "SAM-SSD5-011", barcode: "8901234500110", categoryId: "c4", brandId: "b4", unitId: "u1", supplierId: "s1", purchasePrice: 3400, sellingPrice: 4499, taxPercent: 18, hsnCode: "8471", currentStock: 18, minStock: 10, maxStock: 80, status: "active", description: "SATA III internal SSD, 560MB/s read", emoji: "💾" },
  { id: "p12", name: "Seagate 1TB HDD Barracuda", sku: "SEA-HDD1-012", barcode: "8901234500127", categoryId: "c4", brandId: "b4", unitId: "u1", supplierId: "s3", purchasePrice: 2600, sellingPrice: 3399, taxPercent: 18, hsnCode: "8471", currentStock: 1, minStock: 10, maxStock: 60, status: "active", description: "3.5-inch internal hard drive, 7200 RPM", emoji: "💾" },
  { id: "p13", name: "Corsair 8GB DDR4 RAM", sku: "COR-RAM8-013", barcode: "8901234500134", categoryId: "c1", brandId: "b1", unitId: "u1", supplierId: "s4", purchasePrice: 1650, sellingPrice: 2299, taxPercent: 18, hsnCode: "8473", currentStock: 34, minStock: 12, maxStock: 100, status: "active", description: "8GB DDR4 3200MHz desktop RAM module", emoji: "🧠" },
  { id: "p14", name: "HDMI Cable 1.5m", sku: "GEN-HDMI1-014", barcode: "8901234500141", categoryId: "c2", brandId: "b3", unitId: "u1", supplierId: "s3", purchasePrice: 90, sellingPrice: 199, taxPercent: 18, hsnCode: "8544", currentStock: 120, minStock: 30, maxStock: 300, status: "active", description: "High-speed HDMI 2.0 cable, 1.5 meters", emoji: "🔗" },
  { id: "p15", name: "Godrej Ergonomic Office Chair", sku: "GOD-CHR01-015", barcode: "8901234500158", categoryId: "c8", brandId: "b8", unitId: "u1", supplierId: "s5", purchasePrice: 6800, sellingPrice: 8999, taxPercent: 18, hsnCode: "9401", currentStock: 9, minStock: 4, maxStock: 30, status: "active", description: "Mesh-back ergonomic chair with lumbar support", emoji: "🪑" },
  { id: "p16", name: "Godrej Study Office Desk", sku: "GOD-DSK01-016", barcode: "8901234500165", categoryId: "c8", brandId: "b8", unitId: "u1", supplierId: "s5", purchasePrice: 7200, sellingPrice: 9499, taxPercent: 18, hsnCode: "9403", currentStock: 3, minStock: 4, maxStock: 20, status: "active", description: "Engineered wood office desk, 120x60cm", emoji: "🪑" },
];

// ── Purchase Orders ───────────────────────────────────────────────

export const purchaseOrders: PurchaseOrder[] = [
  { id: "po1", poNumber: "PO-2026-0041", supplierId: "s1", status: "received", createdDate: "2026-07-01", expectedDate: "2026-07-06", items: [{ productId: "p1", quantity: 10, unitPrice: 42000 }, { productId: "p3", quantity: 15, unitPrice: 8200 }], notes: "Quarterly laptop + monitor restock" },
  { id: "po2", poNumber: "PO-2026-0042", supplierId: "s2", status: "approved", createdDate: "2026-07-03", expectedDate: "2026-07-10", items: [{ productId: "p2", quantity: 12, unitPrice: 45500 }, { productId: "p9", quantity: 20, unitPrice: 2400 }], notes: "Urgent — HP ProBook low stock" },
  { id: "po3", poNumber: "PO-2026-0043", supplierId: "s3", status: "pending", createdDate: "2026-07-08", expectedDate: "2026-07-15", items: [{ productId: "p5", quantity: 50, unitPrice: 220 }, { productId: "p14", quantity: 200, unitPrice: 90 }], notes: "Peripherals bulk order" },
  { id: "po4", poNumber: "PO-2026-0044", supplierId: "s4", status: "pending", createdDate: "2026-07-09", expectedDate: "2026-07-16", items: [{ productId: "p7", quantity: 8, unitPrice: 13500 }, { productId: "p12", quantity: 20, unitPrice: 2600 }], notes: "Restock scanners + HDDs" },
  { id: "po5", poNumber: "PO-2026-0045", supplierId: "s5", status: "cancelled", createdDate: "2026-06-28", expectedDate: "2026-07-04", items: [{ productId: "p10", quantity: 6, unitPrice: 11200 }], notes: "Cancelled — supplier price revision" },
  { id: "po6", poNumber: "PO-2026-0046", supplierId: "s1", status: "approved", createdDate: "2026-07-11", expectedDate: "2026-07-18", items: [{ productId: "p11", quantity: 25, unitPrice: 3400 }], notes: "SSD restock ahead of festive season" },
];

// ── Purchase Bills ────────────────────────────────────────────────

export const purchaseBills: PurchaseBill[] = [
  { id: "pb1", billNumber: "BILL-2026-0091", poNumber: "PO-2026-0041", supplierId: "s1", billDate: "2026-07-06", dueDate: "2026-07-21", subtotal: 543000, gstAmount: 97740, total: 640740, paymentStatus: "paid", amountPaid: 640740 },
  { id: "pb2", billNumber: "BILL-2026-0092", poNumber: "PO-2026-0042", supplierId: "s2", billDate: "2026-07-10", dueDate: "2026-07-25", subtotal: 594000, gstAmount: 106920, total: 700920, paymentStatus: "partial", amountPaid: 400000 },
  { id: "pb3", billNumber: "BILL-2026-0093", poNumber: "PO-2026-0039", supplierId: "s3", billDate: "2026-06-20", dueDate: "2026-07-05", subtotal: 88000, gstAmount: 15840, total: 103840, paymentStatus: "overdue", amountPaid: 0 },
  { id: "pb4", billNumber: "BILL-2026-0094", poNumber: "PO-2026-0038", supplierId: "s4", billDate: "2026-06-15", dueDate: "2026-06-30", subtotal: 45500, gstAmount: 8190, total: 53690, paymentStatus: "unpaid", amountPaid: 0 },
  { id: "pb5", billNumber: "BILL-2026-0095", poNumber: "PO-2026-0037", supplierId: "s5", billDate: "2026-06-10", dueDate: "2026-06-25", subtotal: 67200, gstAmount: 12096, total: 79296, paymentStatus: "paid", amountPaid: 79296 },
];

// ── Stock Movements (In / Out / Adjustments) ─────────────────────

export const stockMovements: StockMovement[] = [
  { id: "sm1", type: "in", referenceNumber: "GRN-2026-0201", productId: "p1", quantity: 10, supplierId: "s1", warehouse: "Main Warehouse", notes: "Received against PO-2026-0041", date: "2026-07-06", time: "10:15 AM" },
  { id: "sm2", type: "in", referenceNumber: "GRN-2026-0202", productId: "p3", quantity: 15, supplierId: "s1", warehouse: "Main Warehouse", notes: "Received against PO-2026-0041", date: "2026-07-06", time: "10:20 AM" },
  { id: "sm3", type: "out", referenceNumber: "SO-2026-0501", productId: "p4", quantity: 14, invoiceRef: "INV-2026-0041", reason: "Sale", warehouse: "Main Warehouse", notes: "Sold to Gupta & Sons", date: "2026-07-11", time: "3:45 PM" },
  { id: "sm4", type: "out", referenceNumber: "SO-2026-0502", productId: "p11", quantity: 6, invoiceRef: "INV-2026-0044", reason: "Sale", warehouse: "Main Warehouse", notes: "Sold to Priya Traders", date: "2026-07-12", time: "11:05 AM" },
  { id: "sm5", type: "adjustment", referenceNumber: "ADJ-2026-0031", productId: "p12", quantity: 3, adjustmentType: "decrease", approvalStatus: "approved", reason: "Damaged in storage", warehouse: "Main Warehouse", notes: "3 units damaged due to moisture", date: "2026-07-10", time: "5:30 PM" },
  { id: "sm6", type: "adjustment", referenceNumber: "ADJ-2026-0032", productId: "p9", quantity: 2, adjustmentType: "decrease", approvalStatus: "pending", reason: "Stock count mismatch", warehouse: "Main Warehouse", notes: "Found short during cycle count", date: "2026-07-12", time: "9:10 AM" },
  { id: "sm7", type: "in", referenceNumber: "GRN-2026-0203", productId: "p13", quantity: 40, supplierId: "s4", warehouse: "Main Warehouse", notes: "Bulk RAM restock", date: "2026-07-09", time: "1:00 PM" },
  { id: "sm8", type: "out", referenceNumber: "SO-2026-0503", productId: "p5", quantity: 20, invoiceRef: "INV-2026-0046", reason: "Sale", warehouse: "Main Warehouse", notes: "Sold to Halcyon Group", date: "2026-07-12", time: "4:20 PM" },
  { id: "sm9", type: "adjustment", referenceNumber: "ADJ-2026-0033", productId: "p2", quantity: 1, adjustmentType: "increase", approvalStatus: "approved", reason: "Found extra unit during audit", warehouse: "Main Warehouse", notes: "Reconciled after physical count", date: "2026-07-08", time: "2:15 PM" },
  { id: "sm10", type: "in", referenceNumber: "GRN-2026-0204", productId: "p15", quantity: 12, supplierId: "s5", warehouse: "Main Warehouse", notes: "Office chairs restock", date: "2026-07-05", time: "12:00 PM" },
];

// ── Helpers ───────────────────────────────────────────────────────

export function getCategory(id: string) {
  return categories.find((c) => c.id === id);
}
export function getBrand(id: string) {
  return brands.find((b) => b.id === id);
}
export function getUnit(id: string) {
  return units.find((u) => u.id === id);
}
export function getSupplier(id: string) {
  return suppliers.find((s) => s.id === id);
}
export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export function getStockStatus(product: Product): StockStatus {
  if (product.currentStock <= 0) return "out-of-stock";
  if (product.currentStock <= product.minStock) return "low-stock";
  return "in-stock";
}

export function stockValue(product: Product) {
  return product.currentStock * product.purchasePrice;
}

export function totalStockValue() {
  return products.reduce((sum, p) => sum + stockValue(p), 0);
}

export function fmtINR(v: number) {
  return "₹" + v.toLocaleString("en-IN");
}

export function reorderQty(product: Product) {
  const gap = product.maxStock - product.currentStock;
  return Math.max(Math.ceil(gap * 0.6), product.minStock);
}
