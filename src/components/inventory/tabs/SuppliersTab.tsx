import { useState } from "react";
import { Plus, MoreVertical, Pencil, Trash2, Users, Star, Phone, Mail, MapPin, Building2 } from "lucide-react";
import { suppliers as initialSuppliers, purchaseOrders, fmtINR } from "@/lib/inventory-data";
import type { Supplier } from "@/lib/inventory-data";
import { SectionCard, PrimaryButton, SearchInput, StatusPill, EmptyState, fmtDate } from "@/components/inventory/shared";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ── Star Rating ───────────────────────────────────────────────────

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const rounded = Math.round(rating);
  const iconSize = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${iconSize} ${i < rounded ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`}
        />
      ))}
      {size === "lg" && (
        <span className="ml-1.5 text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}

// ── Supplier Profile Dialog ───────────────────────────────────────

function SupplierProfileDialog({
  supplier,
  onClose,
}: {
  supplier: Supplier | null;
  onClose: () => void;
}) {
  if (!supplier) return null;

  const supplierPOs = purchaseOrders.filter((po) => po.supplierId === supplier.id);

  return (
    <Dialog open={!!supplier} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Supplier Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Header card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-lg font-bold text-white">
                {supplier.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-foreground">{supplier.name}</h3>
                <p className="text-sm text-muted-foreground">{supplier.contactPerson}</p>
                <div className="mt-2">
                  <StarRating rating={supplier.rating} size="lg" />
                </div>
              </div>
              {supplier.outstandingAmount > 0 && (
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Outstanding</p>
                  <p className="text-base font-bold text-red-600">{fmtINR(supplier.outstandingAmount)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact details */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Contact Details</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Phone</p>
                  <p className="text-sm font-medium text-foreground">{supplier.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Email</p>
                  <p className="text-sm font-medium text-foreground truncate">{supplier.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">City</p>
                  <p className="text-sm font-medium text-foreground">{supplier.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">GST Number</p>
                  <p className="text-sm font-mono font-medium text-foreground">{supplier.gstNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
              <p className="text-lg font-bold text-foreground">{fmtINR(supplier.totalPurchases)}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total Purchases</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
              <p className={`text-lg font-bold ${supplier.outstandingAmount > 0 ? "text-red-600" : "text-emerald-600"}`}>
                {fmtINR(supplier.outstandingAmount)}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Outstanding</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
              <p className="text-lg font-bold text-foreground">{supplier.productsSupplied}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Products Supplied</p>
            </div>
          </div>

          {/* Purchase History */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              Purchase History
              <span className="ml-2 text-xs font-normal text-muted-foreground">({supplierPOs.length} orders)</span>
            </h4>
            {supplierPOs.length === 0 ? (
              <p className="rounded-xl border border-slate-200 bg-slate-50 py-6 text-center text-sm text-muted-foreground">
                No purchase orders found.
              </p>
            ) : (
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-100 hover:bg-transparent bg-slate-50">
                      <TableHead className="text-xs font-semibold text-muted-foreground">PO Number</TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground">Date</TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground">Status</TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground text-right">Items</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supplierPOs.map((po) => (
                      <TableRow key={po.id} className="border-slate-100 hover:bg-slate-50/60">
                        <TableCell className="text-sm font-mono font-medium text-foreground">{po.poNumber}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{fmtDate(po.createdDate)}</TableCell>
                        <TableCell><StatusPill status={po.status} /></TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">{po.items.length}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-foreground hover:bg-slate-50">
              Close
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Supplier Form Dialog ──────────────────────────────────────────

interface SupplierFormState {
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  gstNumber: string;
  city: string;
}

function SupplierFormDialog({
  open,
  onClose,
  initial,
  onSubmit,
  title,
}: {
  open: boolean;
  onClose: () => void;
  initial?: SupplierFormState;
  onSubmit: (data: SupplierFormState) => void;
  title: string;
}) {
  const [form, setForm] = useState<SupplierFormState>(
    initial ?? { name: "", contactPerson: "", phone: "", email: "", gstNumber: "", city: "" }
  );

  const handleOpenChange = (o: boolean) => {
    if (o && initial) setForm(initial);
    if (!o) onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit(form);
    onClose();
  };

  const field = (label: string, key: keyof SupplierFormState, placeholder: string, required = false) => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {field("Supplier Name", "name", "e.g. Ingram Micro India", true)}
          {field("Contact Person", "contactPerson", "e.g. Rakesh Malhotra")}
          {field("Phone", "phone", "e.g. +91 98200 11223")}
          {field("Email", "email", "e.g. contact@supplier.com")}
          {field("GST Number", "gstNumber", "e.g. 27AAACI1234M1Z5")}
          {field("City", "city", "e.g. Mumbai")}
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-foreground hover:bg-slate-50">
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-brand)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md"
            >
              Save Supplier
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Tab ──────────────────────────────────────────────────────

export function SuppliersTab() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Supplier | null>(null);
  const [profileTarget, setProfileTarget] = useState<Supplier | null>(null);

  const filtered = suppliers.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.contactPerson.toLowerCase().includes(q)
    );
  });

  const handleCreate = (data: SupplierFormState) => {
    const newSupplier: Supplier = {
      id: `s-${Date.now()}`,
      name: data.name,
      contactPerson: data.contactPerson,
      phone: data.phone,
      email: data.email,
      gstNumber: data.gstNumber,
      city: data.city,
      outstandingAmount: 0,
      rating: 0,
      totalPurchases: 0,
      productsSupplied: 0,
    };
    setSuppliers((prev) => [...prev, newSupplier]);
  };

  const handleEdit = (data: SupplierFormState) => {
    if (!editTarget) return;
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === editTarget.id
          ? { ...s, name: data.name, contactPerson: data.contactPerson, phone: data.phone, email: data.email, gstNumber: data.gstNumber, city: data.city }
          : s
      )
    );
    setEditTarget(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this supplier? This cannot be undone.")) {
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <>
      <SectionCard
        title="Suppliers"
        subtitle={`${suppliers.length} suppliers`}
        action={
          <div className="flex items-center gap-2">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search suppliers..."
              className="w-52"
            />
            <PrimaryButton icon={Plus} onClick={() => setCreateOpen(true)}>
              Add Supplier
            </PrimaryButton>
          </div>
        }
        noPadding
      >
        {filtered.length === 0 ? (
          <EmptyState icon={Users} title="No suppliers found" subtitle="Try adjusting your search or add a new supplier." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead className="text-xs font-semibold text-muted-foreground">Supplier</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground">Phone</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground">Email</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground">GST Number</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground">City</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground text-right">Outstanding</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground">Rating</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground text-right">Total Purchases</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground text-right">Products</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow
                  key={s.id}
                  className="border-slate-100 hover:bg-slate-50/60 cursor-pointer"
                  onClick={() => setProfileTarget(s)}
                >
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.contactPerson}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{s.phone}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[160px] truncate">{s.email}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{s.gstNumber}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{s.city}</TableCell>
                  <TableCell className="text-right">
                    <span className={`text-sm font-semibold ${s.outstandingAmount > 0 ? "text-red-600" : "text-emerald-600"}`}>
                      {fmtINR(s.outstandingAmount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StarRating rating={s.rating} />
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground whitespace-nowrap">
                    {fmtINR(s.totalPurchases)}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{s.productsSupplied}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem onClick={() => setEditTarget(s)}>
                          <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(s.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>

      {/* Supplier Profile */}
      <SupplierProfileDialog
        supplier={profileTarget}
        onClose={() => setProfileTarget(null)}
      />

      {/* Create Dialog */}
      <SupplierFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        title="Add Supplier"
      />

      {/* Edit Dialog */}
      {editTarget && (
        <SupplierFormDialog
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
          initial={{
            name: editTarget.name,
            contactPerson: editTarget.contactPerson,
            phone: editTarget.phone,
            email: editTarget.email,
            gstNumber: editTarget.gstNumber,
            city: editTarget.city,
          }}
          onSubmit={handleEdit}
          title="Edit Supplier"
        />
      )}
    </>
  );
}
