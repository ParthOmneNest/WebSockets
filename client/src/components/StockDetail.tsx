
import type { Stock } from "../types/types";
import { Sparkline } from "./Sparkline";
import { formatPrice, formatPercent, formatChange,
         formatVolume, getColor, getBgColor } from "../helpers/helper";
 
type StockDetailProps = {
  stock:   Stock | null;
  history: number[];
  onClose: () => void;
};
 
function StatItem({ label, value, color }:
  { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      <span style={{ fontSize: "9px", color: "#484F58",
                     fontFamily: "monospace", letterSpacing: "1px" }}>
        {label}
      </span>
      <span style={{ fontSize: "12px", fontFamily: "monospace",
                     fontWeight: "bold", color: color || "#8B949E" }}>
        {value}
      </span>
    </div>
  );
}
 
export function StockDetail({ stock, history, onClose }: StockDetailProps) {
  if (!stock) {
    return (
      <div style={{
        width: "260px", borderLeft: "1px solid #21262D",
        backgroundColor: "#0D1117", display: "flex",
        alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <p style={{ color: "#484F58", fontFamily: "monospace",
                    fontSize: "11px", textAlign: "center" }}>
          Click any stock<br />to see details
        </p>
      </div>
    );
  }
 
  const isPositive = stock.changePercent >= 0;
 
  return (
    <div style={{
      width: "260px", borderLeft: "1px solid #21262D",
      backgroundColor: "#0D1117", overflowY: "auto", flexShrink: 0,
    }}>
 
      {/* Header */}
      <div style={{ padding: "16px", borderBottom: "1px solid #21262D",
                    position: "relative" }}>
 
        <button onClick={onClose} style={{
          position: "absolute", top: "12px", right: "12px",
          background: "none", border: "none", color: "#484F58",
          fontSize: "18px", cursor: "pointer", lineHeight: 1,
        }}>
          \u00d7
        </button>
 
        <div style={{ fontSize: "9px", color: "#484F58",
                      fontFamily: "monospace", marginBottom: "4px" }}>
          {stock.sector}
        </div>
        <div style={{ fontSize: "20px", fontWeight: "bold", color: "#FFB800" }}>
          {stock.symbol}
        </div>
        <div style={{ fontSize: "11px", color: "#484F58", marginBottom: "12px" }}>
          {stock.name}
        </div>
 
        <div style={{ fontSize: "22px", fontWeight: "bold",
                      fontFamily: "monospace", color: "#E6EDF3" }}>
          {formatPrice(stock.price)}
        </div>
 
        <div style={{ display: "flex", gap: "8px", marginTop: "4px", alignItems: "center" }}>
          <span style={{
            padding: "2px 8px", borderRadius: "4px",
            backgroundColor: getBgColor(stock.changePercent),
            color: getColor(stock.changePercent),
            fontFamily: "monospace", fontSize: "12px", fontWeight: "bold",
          }}>
            {formatPercent(stock.changePercent)}
          </span>
          <span style={{ fontFamily: "monospace", fontSize: "12px",
                         color: getColor(stock.change) }}>
            {formatChange(stock.change)}
          </span>
        </div>
 
        <div style={{ marginTop: "12px" }}>
          <Sparkline prices={history} isGreen={isPositive} width={228} height={50} />
        </div>
      </div>
 
      {/* Stats */}
      <div style={{
        padding: "14px 16px", borderBottom: "1px solid #21262D",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px",
      }}>
        <StatItem label="OPEN" value={formatPrice(stock.open)} />
        <StatItem label="PREV" value={formatPrice(stock.prevClose)} />
        <StatItem label="HIGH" value={formatPrice(stock.high)}  color="#00C87C" />
        <StatItem label="LOW"  value={formatPrice(stock.low)}   color="#FF4D4D" />
        <StatItem label="VOL"  value={formatVolume(stock.volume)} />
      </div>
 
    </div>
  );
}
