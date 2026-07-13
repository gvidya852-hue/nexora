// ── Nexora Billing Module — Mock Data Layer ────────────────────────
// All data here is static/mock. No backend, no Supabase, no API calls.
// Structured so it can be swapped for real API responses later without
// changing component shapes. Reuses `products` from inventory-data.ts
// so invoice line items can be built from the same catalog.

import { products, type Product } from "@/lib/inventory-data";

export type InvoiceStatus = "draft" | "sent" | "paid" | "partial" | "overdue" | "cancelled";
export type PaymentMode = "cash" | "upi" | "card" | "bank-transfer" | "credit" | "wallet";
export type PaymentStatus = "paid" | "pending" | "partial" | "overdue";
export type QuotationStatus = "draft" | "sent" | "accepted" | "rejected" | "expired";
export type RecurringFrequency = "weekly" | "monthly" | "quarterly" | "yearly";
export type RecurringStatus = "active" | "paused";
export type CreditNoteStatus = "issued" | "adjusted" | "refunded";
export type PaymentTxnStatus = "received" | "pending" | "refunded";

export interface Customer {
  id: string;
  name: string;
  contactPerson: string;
  gstin: string;
  phone: string;
  email: string;
  address: string;
  shippingAddress: string;
  city: string;
  state: string;
  outstandingBalance: number;
}

export interface InvoiceItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  gstPercent: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  status: InvoiceStatus;
  paymentStatus: PaymentStatus;
  paymentMode: PaymentMode;
  items: InvoiceItem[];
  createdDate: string;
  dueDate: string;
  amountPaid: number;
  notes: string;
  terms: string;
  placeOfSupply: string;
  isInterState: boolean;
}

export interface Quotation {
  id: string;
  quoteNumber: string;
  customerId: string;
  status: QuotationStatus;
  items: InvoiceItem[];
  createdDate: string;
  expiryDate: string;
  convertedInvoiceId?: string;
  notes: string;
}

export interface CreditNote {
  id: string;
  creditNoteNumber: string;
  invoiceId: string;
  customerId: string;
  amount: number;
  reason: string;
  status: CreditNoteStatus;
  createdDate: string;
}

export interface RecurringInvoice {
  id: string;
  templateName: string;
  customerId: string;
  frequency: RecurringFrequency;
  nextBillingDate: string;
  startDate: string;
  amount: number;
  status: RecurringStatus;
  itemsSummary: string;
  invoicesGenerated: number;
}

export interface PaymentTxn {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  customerId: string;
  amount: number;
  mode: PaymentMode;
  status: PaymentTxnStatus;
  date: string;
  time: string;
  notes: string;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  accentColor: string;
  isDefault: boolean;
}

// ── Company (issuer) profile ───────────────────────────────────────

export const company = {
  name: "Nexora Retail Solutions Pvt Ltd",
  gstin: "27AAFCN4455K1Z9",
  address: "4th Floor, Prestige Tech Park, Kadubeesanahalli, Bengaluru, Karnataka 560103",
  phone: "+91 80 4567 8900",
  email: "billing@nexora.app",
  bankName: "HDFC Bank",
  accountNumber: "50200098765432",
  ifsc: "HDFC0001234",
  state: "Karnataka",
};

// ── Customers ───────────────────────────────────────────────────────

export const customers: Customer[] = [
  {
    id: "cu1",
    name: "Priya Traders",
    contactPerson: "Priya Sharma",
    gstin: "29AABCU9603R1ZM",
    phone: "+91 98450 12345",
    email: "priya@priyatraders.in",
    address: "12 MG Road, Bengaluru, Karnataka 560001",
    shippingAddress: "12 MG Road, Bengaluru, Karnataka 560001",
    city: "Bengaluru",
    state: "Karnataka",
    outstandingBalance: 24780,
  },
  {
    id: "cu2",
    name: "Gupta & Sons",
    contactPerson: "Rajesh Gupta",
    gstin: "07AAACG1234N1Z8",
    phone: "+91 98110 22334",
    email: "rajesh@guptasons.co.in",
    address: "45 Chandni Chowk, New Delhi 110006",
    shippingAddress: "45 Chandni Chowk, New Delhi 110006",
    city: "New Delhi",
    state: "Delhi",
    outstandingBalance: 18900,
  },
  {
    id: "cu3",
    name: "Halcyon Group",
    contactPerson: "Ananya Iyer",
    gstin: "33AAECH5678M1Z3",
    phone: "+91 94440 55667",
    email: "ananya@halcyongroup.in",
    address: "78 Anna Salai, Chennai, Tamil Nadu 600002",
    shippingAddress: "78 Anna Salai, Chennai, Tamil Nadu 600002",
    city: "Chennai",
    state: "Tamil Nadu",
    outstandingBalance: 120000,
  },
  {
    id: "cu4",
    name: "Sundar Electronics",
    contactPerson: "Sundar Rajan",
    gstin: "33AABFS2345P1Z1",
    phone: "+91 90030 88990",
    email: "sundar@sundarelectronics.com",
    address: "22 Ranganathan St, Chennai, Tamil Nadu 600017",
    shippingAddress: "22 Ranganathan St, Chennai, Tamil Nadu 600017",
    city: "Chennai",
    state: "Tamil Nadu",
    outstandingBalance: 0,
  },
  {
    id: "cu5",
    name: "Meera Enterprises",
    contactPerson: "Meera Nair",
    gstin: "32AABCM6789Q1Z6",
    phone: "+91 94950 66778",
    email: "meera@meeraenterprises.in",
    address: "9 MG Road, Kochi, Kerala 682016",
    shippingAddress: "9 MG Road, Kochi, Kerala 682016",
    city: "Kochi",
    state: "Kerala",
    outstandingBalance: 8400,
  },
  {
    id: "cu6",
    name: "Om Distributors",
    contactPerson: "Omkar Patil",
    gstin: "27AABCO7890R1Z4",
    phone: "+91 98220 99887",
    email: "omkar@omdistributors.in",
    address: "31 FC Road, Pune, Maharashtra 411005",
    shippingAddress: "31 FC Road, Pune, Maharashtra 411005",
    city: "Pune",
    state: "Maharashtra",
    outstandingBalance: 45200,
  },
  {
    id: "cu7",
    name: "Kavya Retail Hub",
    contactPerson: "Kavya Reddy",
    gstin: "36AABCK8901S1Z2",
    phone: "+91 90000 11223",
    email: "kavya@kavyaretail.in",
    address: "5 Jubilee Hills, Hyderabad, Telangana 500033",
    shippingAddress: "5 Jubilee Hills, Hyderabad, Telangana 500033",
    city: "Hyderabad",
    state: "Telangana",
    outstandingBalance: 61000,
  },
  {
    id: "cu8",
    name: "Deshmukh Traders",
    contactPerson: "Vivek Deshmukh",
    gstin: "27AABCD9012T1Z9",
    phone: "+91 98600 33445",
    email: "vivek@deshmukhtraders.in",
    address: "17 JM Road, Pune, Maharashtra 411004",
    shippingAddress: "17 JM Road, Pune, Maharashtra 411004",
    city: "Pune",
    state: "Maharashtra",
    outstandingBalance: 0,
  },
];

// ── Invoices ──────────────────────────────────────────────────────

export const invoices: Invoice[] = [
  {
    id: "inv1",
    invoiceNumber: "INV-2026-0041",
    customerId: "cu2",
    status: "paid",
    paymentStatus: "paid",
    paymentMode: "upi",
    items: [{ productId: "p4", quantity: 14, unitPrice: 549, discountPercent: 5, gstPercent: 18 }],
    createdDate: "2026-07-11",
    dueDate: "2026-07-18",
    amountPaid: 8121,
    notes: "Thank you for your business.",
    terms: "Payment due within 7 days.",
    placeOfSupply: "Delhi",
    isInterState: true,
  },
  {
    id: "inv2",
    invoiceNumber: "INV-2026-0042",
    customerId: "cu1",
    status: "partial",
    paymentStatus: "partial",
    paymentMode: "bank-transfer",
    items: [
      { productId: "p1", quantity: 1, unitPrice: 49999, discountPercent: 0, gstPercent: 18 },
      { productId: "p5", quantity: 2, unitPrice: 399, discountPercent: 0, gstPercent: 18 },
    ],
    createdDate: "2026-07-10",
    dueDate: "2026-07-20",
    amountPaid: 30000,
    notes: "",
    terms: "Payment due within 10 days.",
    placeOfSupply: "Karnataka",
    isInterState: false,
  },
  {
    id: "inv3",
    invoiceNumber: "INV-2026-0043",
    customerId: "cu3",
    status: "overdue",
    paymentStatus: "overdue",
    paymentMode: "credit",
    items: [{ productId: "p2", quantity: 2, unitPrice: 53990, discountPercent: 2, gstPercent: 18 }],
    createdDate: "2026-06-25",
    dueDate: "2026-07-05",
    amountPaid: 0,
    notes: "Follow up required.",
    terms: "Payment due within 10 days.",
    placeOfSupply: "Tamil Nadu",
    isInterState: true,
  },
  {
    id: "inv4",
    invoiceNumber: "INV-2026-0044",
    customerId: "cu1",
    status: "paid",
    paymentStatus: "paid",
    paymentMode: "card",
    items: [{ productId: "p11", quantity: 6, unitPrice: 4499, discountPercent: 0, gstPercent: 18 }],
    createdDate: "2026-07-12",
    dueDate: "2026-07-19",
    amountPaid: 31853,
    notes: "",
    terms: "Payment due within 7 days.",
    placeOfSupply: "Karnataka",
    isInterState: false,
  },
  {
    id: "inv5",
    invoiceNumber: "INV-2026-0045",
    customerId: "cu5",
    status: "sent",
    paymentStatus: "pending",
    paymentMode: "upi",
    items: [
      { productId: "p6", quantity: 1, unitPrice: 12499, discountPercent: 0, gstPercent: 18 },
      { productId: "p14", quantity: 5, unitPrice: 199, discountPercent: 0, gstPercent: 18 },
    ],
    createdDate: "2026-07-12",
    dueDate: "2026-07-22",
    amountPaid: 0,
    notes: "",
    terms: "Payment due within 10 days.",
    placeOfSupply: "Kerala",
    isInterState: true,
  },
  {
    id: "inv6",
    invoiceNumber: "INV-2026-0046",
    customerId: "cu3",
    status: "paid",
    paymentStatus: "paid",
    paymentMode: "bank-transfer",
    items: [{ productId: "p5", quantity: 20, unitPrice: 399, discountPercent: 8, gstPercent: 18 }],
    createdDate: "2026-07-12",
    dueDate: "2026-07-19",
    amountPaid: 8646,
    notes: "Bulk order discount applied.",
    terms: "Payment due within 7 days.",
    placeOfSupply: "Tamil Nadu",
    isInterState: true,
  },
  {
    id: "inv7",
    invoiceNumber: "INV-2026-0047",
    customerId: "cu6",
    status: "overdue",
    paymentStatus: "overdue",
    paymentMode: "credit",
    items: [{ productId: "p8", quantity: 8, unitPrice: 5799, discountPercent: 0, gstPercent: 18 }],
    createdDate: "2026-06-20",
    dueDate: "2026-06-30",
    amountPaid: 0,
    notes: "Second reminder sent.",
    terms: "Payment due within 10 days.",
    placeOfSupply: "Maharashtra",
    isInterState: false,
  },
  {
    id: "inv8",
    invoiceNumber: "INV-2026-0048",
    customerId: "cu7",
    status: "partial",
    paymentStatus: "partial",
    paymentMode: "wallet",
    items: [
      { productId: "p10", quantity: 4, unitPrice: 14999, discountPercent: 3, gstPercent: 18 },
    ],
    createdDate: "2026-07-08",
    dueDate: "2026-07-18",
    amountPaid: 40000,
    notes: "",
    terms: "Payment due within 10 days.",
    placeOfSupply: "Telangana",
    isInterState: true,
  },
  {
    id: "inv9",
    invoiceNumber: "INV-2026-0049",
    customerId: "cu4",
    status: "paid",
    paymentStatus: "paid",
    paymentMode: "cash",
    items: [{ productId: "p3", quantity: 3, unitPrice: 10999, discountPercent: 0, gstPercent: 18 }],
    createdDate: "2026-07-09",
    dueDate: "2026-07-16",
    amountPaid: 38937,
    notes: "",
    terms: "Payment due within 7 days.",
    placeOfSupply: "Tamil Nadu",
    isInterState: false,
  },
  {
    id: "inv10",
    invoiceNumber: "INV-2026-0050",
    customerId: "cu8",
    status: "draft",
    paymentStatus: "pending",
    paymentMode: "bank-transfer",
    items: [
      { productId: "p13", quantity: 10, unitPrice: 2299, discountPercent: 0, gstPercent: 18 },
    ],
    createdDate: "2026-07-13",
    dueDate: "2026-07-23",
    amountPaid: 0,
    notes: "Awaiting confirmation from customer.",
    terms: "Payment due within 10 days.",
    placeOfSupply: "Maharashtra",
    isInterState: false,
  },
  {
    id: "inv11",
    invoiceNumber: "INV-2026-0051",
    customerId: "cu2",
    status: "sent",
    paymentStatus: "pending",
    paymentMode: "upi",
    items: [{ productId: "p9", quantity: 3, unitPrice: 3299, discountPercent: 0, gstPercent: 18 }],
    createdDate: "2026-07-13",
    dueDate: "2026-07-23",
    amountPaid: 0,
    notes: "",
    terms: "Payment due within 10 days.",
    placeOfSupply: "Delhi",
    isInterState: true,
  },
  {
    id: "inv12",
    invoiceNumber: "INV-2026-0052",
    customerId: "cu6",
    status: "cancelled",
    paymentStatus: "pending",
    paymentMode: "cash",
    items: [{ productId: "p15", quantity: 2, unitPrice: 8999, discountPercent: 0, gstPercent: 18 }],
    createdDate: "2026-07-02",
    dueDate: "2026-07-12",
    amountPaid: 0,
    notes: "Order cancelled by customer.",
    terms: "Payment due within 10 days.",
    placeOfSupply: "Maharashtra",
    isInterState: false,
  },
];

// ── Quotations ────────────────────────────────────────────────────

export const quotations: Quotation[] = [
  {
    id: "qt1",
    quoteNumber: "QUO-2026-0021",
    customerId: "cu5",
    status: "sent",
    items: [{ productId: "p1", quantity: 2, unitPrice: 49999, discountPercent: 4, gstPercent: 18 }],
    createdDate: "2026-07-08",
    expiryDate: "2026-07-22",
    notes: "Bulk laptop order for new office.",
  },
  {
    id: "qt2",
    quoteNumber: "QUO-2026-0022",
    customerId: "cu7",
    status: "accepted",
    items: [
      { productId: "p10", quantity: 6, unitPrice: 14999, discountPercent: 2, gstPercent: 18 },
    ],
    createdDate: "2026-07-05",
    expiryDate: "2026-07-19",
    convertedInvoiceId: "inv8",
    notes: "",
  },
  {
    id: "qt3",
    quoteNumber: "QUO-2026-0023",
    customerId: "cu4",
    status: "draft",
    items: [
      { productId: "p3", quantity: 10, unitPrice: 10999, discountPercent: 5, gstPercent: 18 },
    ],
    createdDate: "2026-07-12",
    expiryDate: "2026-07-26",
    notes: "Awaiting final specs from customer.",
  },
  {
    id: "qt4",
    quoteNumber: "QUO-2026-0024",
    customerId: "cu6",
    status: "expired",
    items: [{ productId: "p9", quantity: 15, unitPrice: 3299, discountPercent: 0, gstPercent: 18 }],
    createdDate: "2026-06-10",
    expiryDate: "2026-06-24",
    notes: "",
  },
  {
    id: "qt5",
    quoteNumber: "QUO-2026-0025",
    customerId: "cu8",
    status: "rejected",
    items: [{ productId: "p16", quantity: 5, unitPrice: 9499, discountPercent: 0, gstPercent: 18 }],
    createdDate: "2026-07-01",
    expiryDate: "2026-07-15",
    notes: "Customer opted for a different vendor.",
  },
  {
    id: "qt6",
    quoteNumber: "QUO-2026-0026",
    customerId: "cu3",
    status: "sent",
    items: [{ productId: "p2", quantity: 4, unitPrice: 53990, discountPercent: 3, gstPercent: 18 }],
    createdDate: "2026-07-13",
    expiryDate: "2026-07-27",
    notes: "",
  },
];

// ── Credit Notes ──────────────────────────────────────────────────

export const creditNotes: CreditNote[] = [
  {
    id: "cn1",
    creditNoteNumber: "CN-2026-0011",
    invoiceId: "inv1",
    customerId: "cu2",
    amount: 1098,
    reason: "2 units returned — packaging damaged",
    status: "adjusted",
    createdDate: "2026-07-13",
  },
  {
    id: "cn2",
    creditNoteNumber: "CN-2026-0012",
    invoiceId: "inv6",
    customerId: "cu3",
    amount: 3990,
    reason: "Price correction after billing error",
    status: "refunded",
    createdDate: "2026-07-13",
  },
  {
    id: "cn3",
    creditNoteNumber: "CN-2026-0013",
    invoiceId: "inv9",
    customerId: "cu4",
    amount: 10999,
    reason: "Product exchanged for different model",
    status: "issued",
    createdDate: "2026-07-12",
  },
];

// ── Recurring Invoices ────────────────────────────────────────────

export const recurringInvoices: RecurringInvoice[] = [
  {
    id: "ri1",
    templateName: "Monthly AMC — Halcyon Group",
    customerId: "cu3",
    frequency: "monthly",
    nextBillingDate: "2026-08-01",
    startDate: "2026-01-01",
    amount: 15000,
    status: "active",
    itemsSummary: "Annual Maintenance Contract — IT Support",
    invoicesGenerated: 6,
  },
  {
    id: "ri2",
    templateName: "Quarterly Supply — Priya Traders",
    customerId: "cu1",
    frequency: "quarterly",
    nextBillingDate: "2026-09-15",
    startDate: "2026-03-15",
    amount: 42000,
    status: "active",
    itemsSummary: "Peripheral bulk restock",
    invoicesGenerated: 2,
  },
  {
    id: "ri3",
    templateName: "Weekly Consumables — Om Distributors",
    customerId: "cu6",
    frequency: "weekly",
    nextBillingDate: "2026-07-20",
    startDate: "2026-05-05",
    amount: 6800,
    status: "paused",
    itemsSummary: "Cables & consumables restock",
    invoicesGenerated: 10,
  },
  {
    id: "ri4",
    templateName: "Yearly Licensing — Kavya Retail Hub",
    customerId: "cu7",
    frequency: "yearly",
    nextBillingDate: "2027-01-10",
    startDate: "2026-01-10",
    amount: 96000,
    status: "active",
    itemsSummary: "Software licensing renewal",
    invoicesGenerated: 1,
  },
];

// ── Payments ──────────────────────────────────────────────────────

export const payments: PaymentTxn[] = [
  {
    id: "pay1",
    paymentNumber: "PMT-2026-1001",
    invoiceId: "inv1",
    customerId: "cu2",
    amount: 8121,
    mode: "upi",
    status: "received",
    date: "2026-07-11",
    time: "2:40 PM",
    notes: "Paid in full via UPI",
  },
  {
    id: "pay2",
    paymentNumber: "PMT-2026-1002",
    invoiceId: "inv2",
    customerId: "cu1",
    amount: 30000,
    mode: "bank-transfer",
    status: "received",
    date: "2026-07-10",
    time: "11:05 AM",
    notes: "Partial payment, balance pending",
  },
  {
    id: "pay3",
    paymentNumber: "PMT-2026-1003",
    invoiceId: "inv4",
    customerId: "cu1",
    amount: 31853,
    mode: "card",
    status: "received",
    date: "2026-07-12",
    time: "4:15 PM",
    notes: "",
  },
  {
    id: "pay4",
    paymentNumber: "PMT-2026-1004",
    invoiceId: "inv6",
    customerId: "cu3",
    amount: 8646,
    mode: "bank-transfer",
    status: "received",
    date: "2026-07-12",
    time: "9:30 AM",
    notes: "",
  },
  {
    id: "pay5",
    paymentNumber: "PMT-2026-1005",
    invoiceId: "inv8",
    customerId: "cu7",
    amount: 40000,
    mode: "wallet",
    status: "received",
    date: "2026-07-08",
    time: "5:50 PM",
    notes: "Partial payment",
  },
  {
    id: "pay6",
    paymentNumber: "PMT-2026-1006",
    invoiceId: "inv9",
    customerId: "cu4",
    amount: 38937,
    mode: "cash",
    status: "received",
    date: "2026-07-09",
    time: "1:20 PM",
    notes: "",
  },
  {
    id: "pay7",
    paymentNumber: "PMT-2026-1007",
    invoiceId: "inv3",
    customerId: "cu3",
    amount: 127182,
    mode: "credit",
    status: "pending",
    date: "2026-07-05",
    time: "10:00 AM",
    notes: "Awaiting customer settlement",
  },
  {
    id: "pay8",
    paymentNumber: "PMT-2026-1008",
    invoiceId: "inv7",
    customerId: "cu6",
    amount: 54744,
    mode: "credit",
    status: "pending",
    date: "2026-06-30",
    time: "9:00 AM",
    notes: "Overdue — reminder sent",
  },
  {
    id: "pay9",
    paymentNumber: "PMT-2026-1009",
    invoiceId: "inv6",
    customerId: "cu3",
    amount: 3990,
    mode: "bank-transfer",
    status: "refunded",
    date: "2026-07-13",
    time: "3:10 PM",
    notes: "Refund against CN-2026-0012",
  },
];

// ── Invoice Templates ─────────────────────────────────────────────

export const invoiceTemplates: InvoiceTemplate[] = [
  {
    id: "tpl1",
    name: "Classic Blue",
    description: "Clean layout with a bold header band — the Nexora default.",
    accentColor: "#2563eb",
    isDefault: true,
  },
  {
    id: "tpl2",
    name: "Minimal Slate",
    description: "Understated, text-forward layout for professional services.",
    accentColor: "#475569",
    isDefault: false,
  },
  {
    id: "tpl3",
    name: "Emerald Retail",
    description: "Retail-friendly layout with a compact item table.",
    accentColor: "#059669",
    isDefault: false,
  },
  {
    id: "tpl4",
    name: "Amber Contractor",
    description: "Warm accent, ideal for contractors and trade businesses.",
    accentColor: "#d97706",
    isDefault: false,
  },
];

// ── Helpers ───────────────────────────────────────────────────────

export function getCustomer(id: string) {
  return customers.find((c) => c.id === id);
}

export function getInvoice(id: string) {
  return invoices.find((i) => i.id === id);
}

export function getInvoiceProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function fmtINR(v: number) {
  return "₹" + Math.round(v).toLocaleString("en-IN");
}

export function fmtDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Line-item computed amounts: taxable value, discount, gst amount, line total. */
export function computeLineItem(item: InvoiceItem) {
  const gross = item.quantity * item.unitPrice;
  const discountAmount = gross * (item.discountPercent / 100);
  const taxable = gross - discountAmount;
  const gstAmount = taxable * (item.gstPercent / 100);
  const total = taxable + gstAmount;
  return { gross, discountAmount, taxable, gstAmount, total };
}

/** Full document totals for an invoice/quotation, splitting GST into CGST/SGST or IGST. */
export function computeDocumentTotals(items: InvoiceItem[], isInterState: boolean) {
  let subtotal = 0;
  let totalDiscount = 0;
  let totalGst = 0;
  for (const item of items) {
    const { gross, discountAmount, gstAmount } = computeLineItem(item);
    subtotal += gross;
    totalDiscount += discountAmount;
    totalGst += gstAmount;
  }
  const taxableValue = subtotal - totalDiscount;
  const cgst = isInterState ? 0 : totalGst / 2;
  const sgst = isInterState ? 0 : totalGst / 2;
  const igst = isInterState ? totalGst : 0;
  const cess = 0;
  const preRoundTotal = taxableValue + totalGst + cess;
  const grandTotal = Math.round(preRoundTotal);
  const roundOff = grandTotal - preRoundTotal;
  return { subtotal, totalDiscount, taxableValue, cgst, sgst, igst, cess, roundOff, grandTotal };
}

export function invoiceGrandTotal(invoice: Invoice) {
  return computeDocumentTotals(invoice.items, invoice.isInterState).grandTotal;
}

export function invoiceBalance(invoice: Invoice) {
  return invoiceGrandTotal(invoice) - invoice.amountPaid;
}

export function quotationTotal(quotation: Quotation) {
  return computeDocumentTotals(quotation.items, false).grandTotal;
}

export function nextInvoiceNumber() {
  const nums = invoices.map((i) => parseInt(i.invoiceNumber.split("-").pop() ?? "0", 10));
  const next = Math.max(0, ...nums) + 1;
  return `INV-2026-${String(next).padStart(4, "0")}`;
}

export function nextQuoteNumber() {
  const nums = quotations.map((q) => parseInt(q.quoteNumber.split("-").pop() ?? "0", 10));
  const next = Math.max(0, ...nums) + 1;
  return `QUO-2026-${String(next).padStart(4, "0")}`;
}

export const paymentModeLabels: Record<PaymentMode, string> = {
  cash: "Cash",
  upi: "UPI",
  card: "Card",
  "bank-transfer": "Bank Transfer",
  credit: "Credit",
  wallet: "Wallet",
};
