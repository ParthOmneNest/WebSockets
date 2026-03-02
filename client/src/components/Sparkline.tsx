type SparklineProps = {
    prices: number[];
    isGreen: boolean;
    width?: number;
    height?: number;
}

export function Sparkline({ prices, isGreen, width = 80, height = 30 }: SparklineProps) {
    if (prices.length < 2) return <svg width={width} height={height} />

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;
    const points = prices.map((price, index) => {
        const x = (index / (prices.length - 1)) * width;
        const y = height - ((price - minPrice) / priceRange) * (height - 4) - 2;
        return `${x},${y}`;
    })

    const linePath = `M${points.join(" L")}`;
    const lineColor=isGreen?"#00C87C" : "#FF4D4D";

    return(
        <svg width={width} height={height}>
            <path
                d={linePath}
                fill="none"
                stroke={lineColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}