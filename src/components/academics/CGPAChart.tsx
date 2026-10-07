import React, { useState } from 'react';
import type { CGPADataPoint } from '@/data/academicsData';
import { Card } from '@/components/cards/Card';
import { TrendingUp, Sparkles } from 'lucide-react';

export interface CGPAChartProps {
  data: CGPADataPoint[];
}

export const CGPAChart: React.FC<CGPAChartProps> = ({ data = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartData = data.length > 0
    ? data
    : [
        { semester: 'Sem 1', sgpa: 8.5, cgpa: 8.5 },
        { semester: 'Sem 2', sgpa: 8.7, cgpa: 8.6 },
        { semester: 'Sem 3', sgpa: 9.0, cgpa: 8.7 },
        { semester: 'Sem 4', sgpa: 9.1, cgpa: 8.8 },
        { semester: 'Sem 5', sgpa: 9.2, cgpa: 8.9 },
        { semester: 'Sem 6', sgpa: 9.0, cgpa: 8.9 },
      ];

  // Zoomed dynamic bounds
  const allValues = chartData.map((d) => d.sgpa);
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const minY = Math.max(0, Math.floor((rawMin - 0.2) * 10) / 10);
  const maxY = Math.min(10, Math.ceil((rawMax + 0.2) * 10) / 10);
  const ySpan = Math.max(0.5, maxY - minY);

  const svgWidth = 560;
  const svgHeight = 220;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 50;

  const chartAreaWidth = svgWidth - paddingLeft - paddingRight;
  const chartAreaHeight = svgHeight - paddingTop - paddingBottom;

  const getX = (index: number) => {
    if (chartData.length <= 1) return paddingLeft + chartAreaWidth / 2;
    return paddingLeft + (index / (chartData.length - 1)) * chartAreaWidth;
  };

  const getY = (val: number) => {
    const clamped = Math.max(minY, Math.min(maxY, val));
    const ratio = (clamped - minY) / ySpan;
    return paddingTop + chartAreaHeight - ratio * chartAreaHeight;
  };

  const points = chartData.map((d, i) => `${getX(i)},${getY(d.sgpa)}`).join(' ');

  const yTicks = [
    minY,
    Number((minY + ySpan * 0.33).toFixed(1)),
    Number((minY + ySpan * 0.66).toFixed(1)),
    maxY,
  ];

  return (
    <Card variant="glass" padding="md" className="space-y-5 border-border/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3 sm:pb-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono font-bold text-teal-400 uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Academic Trajectory Line Graph
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2 mt-0.5">
            <span>Semester vs SGPA Performance Curve</span>
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400" />
          </h3>
        </div>

        {hoveredIndex !== null ? (
          <div className="font-mono text-xs text-left sm:text-right">
            <span className="text-foreground font-bold">{chartData[hoveredIndex].semester}: </span>
            <span className="text-teal-400 font-extrabold text-base">{chartData[hoveredIndex].sgpa} SGPA </span>
            <span className="text-muted-foreground text-[11px]">({chartData[hoveredIndex].cgpa} CGPA)</span>
          </div>
        ) : (
          <div className="text-xs font-mono text-muted-foreground flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-teal-400 inline-block" /> SGPA Trajectory
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-teal-400 bg-background inline-block" /> Data Points
            </div>
          </div>
        )}
      </div>

      {/* Zoomed Cartesian Grid Line Chart */}
      <div className="relative w-full aspect-[2.2/1] min-h-[170px] sm:min-h-[220px] flex items-center justify-center p-1.5 sm:p-3 rounded-xl bg-background/60 border border-border/70 shadow-inner">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full"
        >
          <defs>
            <marker
              id="chart-arrow-x"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 6 3, 0 6" className="fill-muted-foreground" />
            </marker>
            <marker
              id="chart-arrow-y"
              markerWidth="8"
              markerHeight="8"
              refX="3"
              refY="2"
              orient="auto"
            >
              <polygon points="0 6, 3 0, 6 6" className="fill-muted-foreground" />
            </marker>
          </defs>

          {/* Horizontal Grid Lines */}
          {yTicks.map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="currentColor"
                  className="text-border/40"
                  strokeDasharray="2 2"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 3.5}
                  className="text-[11px] fill-muted-foreground font-mono font-semibold"
                  textAnchor="end"
                >
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Vertical Grid Lines */}
          {chartData.map((_, i) => {
            const x = getX(i);
            return (
              <line
                key={i}
                x1={x}
                y1={paddingTop}
                x2={x}
                y2={paddingTop + chartAreaHeight}
                stroke="currentColor"
                className="text-border/30"
                strokeDasharray="2 2"
                strokeWidth="1"
              />
            );
          })}

          {/* Cartesian Axes */}
          <line
            x1={paddingLeft}
            y1={paddingTop + chartAreaHeight}
            x2={paddingLeft}
            y2={paddingTop - 12}
            stroke="currentColor"
            className="text-muted-foreground"
            strokeWidth="2"
            markerEnd="url(#chart-arrow-y)"
          />
          <line
            x1={paddingLeft}
            y1={paddingTop + chartAreaHeight}
            x2={svgWidth - paddingRight + 15}
            y2={paddingTop + chartAreaHeight}
            stroke="currentColor"
            className="text-muted-foreground"
            strokeWidth="2"
            markerEnd="url(#chart-arrow-x)"
          />

          {/* Line Chart Path */}
          <polyline
            fill="none"
            stroke="#14b8a6"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Ring Node Dots matching uploaded photo */}
          {chartData.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d.sgpa);
            const isHovered = hoveredIndex === i;

            return (
              <g
                key={i}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Vertical Guideline on Hover */}
                {isHovered && (
                  <line
                    x1={cx}
                    y1={paddingTop}
                    x2={cx}
                    y2={paddingTop + chartAreaHeight}
                    stroke="#14b8a6"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Outer Ring Dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 8.5 : 6}
                  stroke="#14b8a6"
                  strokeWidth="3.5"
                  className="fill-background transition-all duration-150"
                />

                {/* Inner Dot on Hover */}
                {isHovered && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="3.5"
                    fill="#14b8a6"
                  />
                )}

                {/* Angled X-Axis Labels */}
                <text
                  x={cx}
                  y={paddingTop + chartAreaHeight + 18}
                  className={`text-[11px] font-mono font-medium ${isHovered ? 'fill-teal-400 font-bold' : 'fill-muted-foreground'}`}
                  textAnchor="end"
                  transform={`rotate(-35, ${cx}, ${paddingTop + chartAreaHeight + 18})`}
                >
                  {d.semester}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Semester Snapshot Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 pt-2">
        {chartData.map((item, idx) => (
          <div
            key={idx}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
              hoveredIndex === idx
                ? 'bg-teal-500/10 border-teal-500 shadow-md scale-105'
                : 'bg-surface/60 border-border/70 hover:border-teal-500/40'
            }`}
          >
            <span className="text-[11px] font-mono text-muted-foreground block truncate">{item.semester}</span>
            <span className="text-sm font-mono font-extrabold text-teal-400 block mt-0.5">{item.sgpa}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
