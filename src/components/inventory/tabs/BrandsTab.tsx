import { useState } from "react";
import { motion } from "framer-motion";
import { MoreVertical, Plus, Pencil, Trash2 } from "lucide-react";
import { brands as initialBrands } from "@/lib/inventory-data";
import type { Brand } from "@/lib/inventory-data";
import { SectionCard, PrimaryButton } from "@/components/inventory/shared";
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

const COLOR_OPTIONS = [
  { label: "Blue", value: "bg-blue-500" },
  { label: "Violet", value: "bg-violet-500" },
  { label: "Emerald", value: "bg-emerald-500" },
  { label: "Amber", value: "bg-amber-500" },
  { label: "Red", value: "bg-red-500" },
  { label: "Cyan", value: "bg-cyan-500" },
  { label: "Orange", value: "bg-orange-500" },
  { label: "Pink", value: "bg-pink-500" },
];

interface BrandFormState {
  name: string;
  description: string;
  logoInitial: string;
  color: string;
}

function BrandFormDialog({
  open,
  onClose,
  initial,
  onSubmit,
  title,
}: {
  open: boolean;
  onClose: () => void;
  initial?: BrandFormState;
  onSubmit: (data: BrandFormState) => void;
  title: string;
}) {
  const [form, setForm] = useState<BrandFormState>(
    initial ?? { name: "", description: "", logoInitial: "", color: "bg-blue-500" }
  );

  const handleNameChange = (name: string) => {
    setForm((f) => ({
      ...f,
      name,
      logoInitial: f.logoInitial || name.charAt(0).toUpperCase(),
    }));
  };

  const handleOpenChange = (o: boolean) => {
    if (o && initial) setForm(initial);
    if (!o) onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit({ ...form, logoInitial: form.logoInitial || form.name.charAt(0).toUpperCase() });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Preview */}
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white ${form.color}`}>
              {form.logoInitial || form.name.charAt(0).toUpperCase() || "?"}
            </div>
            <span className="text-sm text-muted-foreground">Brand logo preview</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Name</label>
            <input
              className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Brand name"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Description</label>
            <input
              className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Short description"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Logo Initial</label>
            <input
              className="h-9 w-20 rounded-xl border border-slate-200 bg-white px-3 text-center text-sm font-bold uppercase outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={form.logoInitial}
              onChange={(e) => setForm((f) => ({ ...f, logoInitial: e.target.value.slice(0, 1).toUpperCase() }))}
              placeholder="A"
              maxLength={1}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Color</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  title={c.label}
                  onClick={() => setForm((f) => ({ ...f, color: c.value }))}
                  className={`h-7 w-7 rounded-full ${c.value} transition-transform hover:scale-110 ${form.color === c.value ? "ring-2 ring-offset-2 ring-slate-400 scale-110" : ""}`}
                />
              ))}
            </div>
          </div>
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
              Save Brand
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function BrandsTab() {
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Brand | null>(null);

  const handleCreate = (data: BrandFormState) => {
    const newBrand: Brand = {
      id: `b-${Date.now()}`,
      name: data.name,
      description: data.description,
      logoInitial: data.logoInitial,
      color: data.color,
      productCount: 0,
    };
    setBrands((prev) => [...prev, newBrand]);
  };

  const handleEdit = (data: BrandFormState) => {
    if (!editTarget) return;
    setBrands((prev) =>
      prev.map((b) =>
        b.id === editTarget.id
          ? { ...b, name: data.name, description: data.description, logoInitial: data.logoInitial, color: data.color }
          : b
      )
    );
    setEditTarget(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this brand? This cannot be undone.")) {
      setBrands((prev) => prev.filter((b) => b.id !== id));
    }
  };

  return (
    <SectionCard
      title="Brands"
      subtitle={`${brands.length} brands`}
      action={
        <PrimaryButton icon={Plus} onClick={() => setCreateOpen(true)}>
          Create Brand
        </PrimaryButton>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {brands.map((brand, i) => (
          <motion.div
            key={brand.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04, ease: "easeOut" }}
            className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            {/* Actions menu */}
            <div className="absolute right-3 top-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem onClick={() => setEditTarget(brand)}>
                    <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(brand.id)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Logo avatar */}
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white ${brand.color}`}>
              {brand.logoInitial}
            </div>

            {/* Name + product count */}
            <div className="flex items-start justify-between gap-2 pr-6">
              <h4 className="text-sm font-semibold text-foreground leading-snug">{brand.name}</h4>
              <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                {brand.productCount}
              </span>
            </div>

            {/* Description */}
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{brand.description}</p>

            {/* Products label */}
            <p className="mt-3 text-[10px] text-muted-foreground uppercase tracking-wide">
              {brand.productCount} {brand.productCount === 1 ? "product" : "products"}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Create Dialog */}
      <BrandFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        title="Create Brand"
      />

      {/* Edit Dialog */}
      {editTarget && (
        <BrandFormDialog
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
          initial={{
            name: editTarget.name,
            description: editTarget.description,
            logoInitial: editTarget.logoInitial,
            color: editTarget.color,
          }}
          onSubmit={handleEdit}
          title="Edit Brand"
        />
      )}
    </SectionCard>
  );
}
