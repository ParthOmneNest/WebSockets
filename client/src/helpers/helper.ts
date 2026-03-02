export function formatPrice(price: number): string {
    return "\u20b9" + price.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

export function formatPercent(value: number): string {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
}
export function formatChange(value: number): string {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}`;
}

export function formatVolume(volume: number): string {
    if (volume >= 10_000_000) return (volume / 10_000_000).toFixed(2) + "Cr";
    if (volume >= 100_000) return (volume / 100_000).toFixed(2) + "L";
    return volume.toLocaleString("en-IN");
}

export function getColor(value: number): string {
    return value >= 0 ? '#00C87C' : '#FF4D4D';
}
export function getBgColor(value: number): string {
    return value >= 0 ? 'rgba(0,200,124,0.10)' : 'rgba(255,77,77,0.10)';
}



