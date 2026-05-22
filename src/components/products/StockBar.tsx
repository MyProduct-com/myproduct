import { getStockColor, getStockPct } from "@/lib/utils";

interface StockBarProps {
  stock: number;
  maxStock: number;
}

export default function StockBar({ stock, maxStock }: StockBarProps) {
  const pct = getStockPct(stock, maxStock);
  const color = getStockColor(stock, maxStock);

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs text-gray-400 whitespace-nowrap tabular-nums">
        {stock}/{maxStock}
      </span>
    </div>
  );
}