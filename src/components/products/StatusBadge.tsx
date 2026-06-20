import type { ProductStatus } from "@/types/product";

const config: Record<ProductStatus, { label: string; className: string }> = {
  live: {
    label: "Live",
    className: "bg-brand-50 text-brand-800",
  },
  draft: {
    label: "Draft",
    className: "bg-amber-50 text-amber-800",
  },
  out_of_stock: {
    label: "Out of stock",
    className: "bg-red-50 text-red-700",
  },
};

export default function StatusBadge({ status }: { status: ProductStatus }) {
  const { label, className } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}