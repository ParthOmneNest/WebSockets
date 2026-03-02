import type { Stock } from "../types/types";
import { create } from "zustand"

type StoreState = {
    stocks: Record<string, Stock>,
    isConnected: boolean,
    selectedSymbol: string | null,
    priceHistory: Record<string, number[]>,

    setStock: (stock: Stock) => void,
    setConnected: (value: boolean) => void,
    setSelected: (symbol: string | null) => void,
}

export const useStore = create<StoreState>((set)=>({
    stocks:{},
    isConnected:false,
    selectedSymbol:null,
    priceHistory:{},

    setStock:(stock:Stock)=>{
        set((state)=>{
            const oldHistory=state.priceHistory[stock.symbol] || [];
            const newHistory=[...oldHistory,stock.price].slice(-30);
            return{
                stocks:{...state.stocks,[stock.symbol]:stock},
                priceHistory:{...state.priceHistory,[stock.symbol]:newHistory},
            }
        });
    },
    setConnected:(value)=>set({isConnected:value}),
    setSelected:(symbol)=>set({selectedSymbol:symbol}),
        
}));

