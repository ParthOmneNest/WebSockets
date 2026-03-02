
import { useState, useMemo } from "react";
import { useStore } from "./store/store";
import { useWebSocket } from "./webSockets/useWebSocket";
import { Header } from "./components/Header";
import { StockTable } from "./components/StockTable";
import { StockDetail } from "./components/StockDetail";
import type { Stock } from "./types/types";
 
export default function App() {
  useWebSocket();
 
  const stocks = useStore((state) => state.stocks);
  const isConnected = useStore((state) => state.isConnected);
  const selectedSymbol = useStore((state) => state.selectedSymbol);
  const priceHistory = useStore((state) => state.priceHistory);
  const setSelected = useStore((state) => state.setSelected);
 
  const [searchText, setSearchText] = useState<string>("");
  const [sortBy,     setSortBy]     = useState<string>("symbol");
  const [sortDir,    setSortDir]    = useState<"asc" | "desc">("asc");
 
  const filteredStocks = useMemo(() => {
    const query = searchText.toUpperCase().trim();
    const all   = Object.values(stocks);
    if (!query) return all;
    return all.filter((s) =>
      s.symbol.includes(query) || s.name.toUpperCase().includes(query)
    );
  }, [stocks, searchText]);
 
  const sortedStocks = useMemo(() => {
    return [...filteredStocks].sort((a, b) => {
      const va = a[sortBy as keyof Stock];
      const vb = b[sortBy as keyof Stock];
      let cmp = 0;
      if (typeof va === "string" && typeof vb === "string")
        cmp = va.localeCompare(vb);
      else if (typeof va === "number" && typeof vb === "number")
        cmp = va - vb;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filteredStocks, sortBy, sortDir]);
 
  function handleSort(column: string) {
    if (sortBy === column) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(column); setSortDir("asc"); }
  }
 
  const selectedStock   = selectedSymbol ? stocks[selectedSymbol] : null;
  const selectedHistory = selectedSymbol ? (priceHistory[selectedSymbol] || []) : [];
 
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100vh", backgroundColor: "#010409", color: "#E6EDF3",
    }}>
 
      <Header isConnected={isConnected} />
 
      <div style={{
        padding: "10px 20px", borderBottom: "1px solid #21262D",
        backgroundColor: "#0D1117",
      }}>
        <input
          type="text"
          placeholder="Search stocks..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            width: "280px", padding: "7px 12px",
            backgroundColor: "#161B22", border: "1px solid #30363D",
            borderRadius: "6px", color: "#E6EDF3",
            fontFamily: "monospace", fontSize: "12px", outline: "none",
          }}
        />
        <span style={{ marginLeft: "12px", fontSize: "11px",
                       color: "#484F58", fontFamily: "monospace" }}>
          {sortedStocks.length} stocks
        </span>
      </div>
 
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <StockTable
          stocks={sortedStocks}
          history={priceHistory}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
        />
        <StockDetail
          stock={selectedStock}
          history={selectedHistory}
          onClose={() => setSelected(null)}
        />
      </div>
 
      <div style={{
        padding: "5px 20px", borderTop: "1px solid #21262D",
        backgroundColor: "#0D1117", display: "flex",
        justifyContent: "space-between",
        fontSize: "10px", color: "#484F58", fontFamily: "monospace",
      }}>
        <span>ws://localhost:8080</span>
        <span>Simulated data — for learning only</span>
      </div>
 
    </div>
  );
}


