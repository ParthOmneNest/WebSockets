
import type { Stock } from "../types/types";
import { StockRow } from "./StockRow";
import { useStore } from "../store/store";
 
type StockTableProps = {
  stocks:   Stock[];
  history:  Record<string, number[]>;
  sortBy:   string;
  sortDir:  "asc" | "desc";
  onSort:   (column: string) => void;
};
 
const COLUMNS = [
  { key: "symbol",        label: "SYMBOL", align: "left"   as const },
  { key: "price",         label: "PRICE",  align: "right"  as const },
  { key: "changePercent", label: "CHNG %", align: "right"  as const },
  { key: "change",        label: "CHNG",   align: "right"  as const },
  { key: "volume",        label: "VOLUME", align: "right"  as const },
  { key: "trend",         label: "TREND",  align: "center" as const, noSort: true },
];
 
export function StockTable({ stocks, history, sortBy, sortDir, onSort }: StockTableProps) {
  const { selectedSymbol, setSelected } = useStore();
 
  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
 
        <thead style={{
          position: "sticky", top: 0, zIndex: 10,
          backgroundColor: "#0D1117",
          borderBottom: "1px solid #21262D",
        }}>
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                onClick={() => !col.noSort && onSort(col.key)}
                style={{
                  padding: "8px 16px", textAlign: col.align,
                  fontSize: "10px", letterSpacing: "1px",
                  fontWeight: "bold", fontFamily: "monospace",
                  color: sortBy === col.key ? "#FFB800" : "#484F58",
                  cursor: col.noSort ? "default" : "pointer",
                  userSelect: "none",
                }}
              >
                {col.label}
                {sortBy === col.key && (
                  <span style={{ marginLeft: "4px" }}>
                    {sortDir === "asc" ? "\u2191" : "\u2193"}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
 
        <tbody>
          {stocks.map((stock) => (
            <StockRow
              key={stock.symbol}
              stock={stock}
              history={history[stock.symbol] || []}
              isSelected={selectedSymbol === stock.symbol}
              onClick={() => {
                setSelected(selectedSymbol === stock.symbol ? null : stock.symbol);
              }}
            />
          ))}
          {stocks.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "60px",
                                       color: "#484F58", fontFamily: "monospace" }}>
                No stocks found
              </td>
            </tr>
          )}
        </tbody>
 
      </table>
    </div>
  );
}


