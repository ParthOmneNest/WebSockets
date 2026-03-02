import { useEffect, useRef } from "react";
import { useStore } from "../store/store";
import type { Stock } from "../types/types";
// interface ServerMessage {
//     type: 'STOCK_UPDATE';
//     stock: any; // Replace 'any' with your actual stock object type
// }

const SERVER_URL = "ws://localhost:8080";

export function useWebSocket() {
    const wsRef = useRef<WebSocket | null>(null);
    const retryCountRef = useRef<number>(0);
    const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { setStock, setConnected } = useStore();

    function getWaitTime() {
        const seconds = Math.pow(2, retryCountRef.current);
        return Math.min(seconds, 30) * 1000;
    }

    function connect() {
        console.log(`Connecting to ${SERVER_URL}`);
        const ws = new WebSocket(SERVER_URL);
        wsRef.current = ws;

        ws.onopen = () => {
            setConnected(true);
            retryCountRef.current = 0;
            console.log("Connected to server");

            const subscribeMsg = {
                type: "SUBSCRIBE",
                symbols: ["RELIANCE", "TCS", "HDFCBANK", "INFY", "WIPRO", "SBIN", "ICICIBANK"]
            };
            ws.send(JSON.stringify(subscribeMsg));
        };

        ws.onmessage = (event: MessageEvent) => {
            try {
                const msg = JSON.parse(event.data);

                // 1. Identify if the message contains stock data (SNAPSHOT or UPDATE)
                const serverData = msg.data || msg.stock;

                if (serverData && (msg.type === "SNAPSHOT" || msg.type === "STOCK_UPDATE" || msg.type === "QUOTE")) {

                    const formattedStock: Stock = {
                        symbol: msg.symbol,
                        price: serverData.ltp, // CRITICAL: Map 'ltp' to 'price'
                        change: serverData.change,
                        changePercent: serverData.changePercent,
                        volume: serverData.volume,
                        sector: serverData.sector || "N/A",
                        // Provide defaults for missing fields
                        name: msg.symbol,
                        open: serverData.open || 0,
                        high: serverData.high || 0,
                        low: serverData.low || 0,
                        prevClose: serverData.prevClose || 0
                    };

                    setStock(formattedStock);
                } else if (msg.type === "INDEX" && msg.data) {
                    console.log("Index Update:", msg.symbol, msg.data.value);
                }
                 else if (msg.type === "DEPTH" && msg.data) {
                    console.log("Depth Update:", msg.symbol, msg.data.value);
                }
            } catch (err) {
                console.error("Parse error:", err);
            }
        };

        ws.onclose = () => {
            setConnected(false);
            const waitTime = getWaitTime();
            retryCountRef.current += 1;
            console.log(`Retrying in ${waitTime / 1000}s...`);
            retryTimerRef.current = setTimeout(connect, waitTime);
        };
        ws.onerror = () => {
            console.log("WebSocket error - server may be offline");
        };
    }

    useEffect(() => {
        connect();
        return () => {
            if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.onclose = null;
                wsRef.current.close();
            }
        };
    }, []);
}