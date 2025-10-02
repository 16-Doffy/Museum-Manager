"use client";

import * as React from 'react';

export function RevenueChart({ data }: { data: number[] }) {
	const dataPoints = data.map((v, i) => ({ label: String(i + 1), value: v }));
	const width = 800;
	const height = 320;
const padding = 28;
	const barGap = 10;

	const niceMax = (v: number) => {
		const magnitude = Math.pow(10, Math.floor(Math.log10(v)));
		const factor = Math.ceil(v / magnitude);
		return factor * magnitude;
	};

	const maxValue = niceMax(Math.max(...dataPoints.map(d => d.value)) * 1.05);
	const innerWidth = width - padding * 2;
	const innerHeight = height - padding * 2;
	const barWidth = (innerWidth - (dataPoints.length - 1) * barGap) / dataPoints.length;
	const yTicks = 5;

	const formatCompactVND = (n: number) => new Intl.NumberFormat('vi-VN', { notation: 'compact', maximumFractionDigits: 1 }).format(n) + '₫';
	const [hover, setHover] = React.useState<{ x: number; y: number; label: string; value: number } | null>(null);

	return (
		<div>
			<svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="w-full">
				<defs>
					<linearGradient id="barRevenue" x1="0" x2="0" y1="0" y2="1">
						<stop offset="0%" stopColor="#22c55e" />
						<stop offset="100%" stopColor="#16a34a" />
					</linearGradient>
				</defs>

				<g transform={`translate(${padding}, ${padding})`}>
					{Array.from({ length: yTicks + 1 }).map((_, idx) => {
						const t = idx / yTicks;
						const y = innerHeight - innerHeight * t;
						const value = Math.round(maxValue * t);
                        return (
                            <g key={idx}>
                                <line x1={0} x2={innerWidth} y1={y} y2={y} stroke="#eef2f7" />
                            </g>
                        );
					})}

					{dataPoints.map((d, i) => {
						const x = i * (barWidth + barGap);
						const h = Math.max(2, (d.value / maxValue) * innerHeight);
						const y = innerHeight - h;
						const cx = x + barWidth / 2;
						return (
							<g key={d.label}
								onMouseEnter={() => setHover({ x: cx, y, label: d.label, value: d.value })}
								onMouseLeave={() => setHover(null)}>
								<rect x={x} y={y} width={barWidth} height={h} fill="url(#barRevenue)" rx={8}
								      style={{ transition: 'y 200ms ease, height 200ms ease' }} />
								<text x={cx} y={innerHeight + 18} textAnchor="middle" fontSize="11" fill="#6b7280">{d.label}</text>
							</g>
						);
					})}

					<line x1={0} y1={innerHeight} x2={innerWidth} y2={innerHeight} stroke="#e5e7eb" />

					{hover && (
						<g transform={`translate(${hover.x}, ${hover.y - 8})`}>
							<foreignObject x={-70} y={-34} width={160} height={32}>
								<div className="rounded-md bg-white shadow-md border border-gray-200 px-2 py-1 text-[11px] text-gray-700 flex items-center justify-between gap-2">
									<span>Tháng {hover.label}</span>
									<strong>{new Intl.NumberFormat('vi-VN').format(hover.value)}₫</strong>
								</div>
							</foreignObject>
						</g>
					)}
				</g>
			</svg>
			<div className="mt-1 text-xs text-gray-500">Đơn vị: VND</div>
		</div>
	);
}


