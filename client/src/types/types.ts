export type Stock = {
    symbol: string,
    name: string,
    sector: string,
    price: number,
    open: number,
    high: number,
    low: number,
    prevClose: number,
    change: number,
    changePercent: number,
    volume: number,
}

export type ServerMessage = {
    type: string,
    message?: string,
    stock?: Stock,
}