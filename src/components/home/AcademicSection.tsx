import React, { useState } from 'react';
import type { AcademicSemesterDTO } from '@/lib/types/api.types';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Award, ArrowRight, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

interface AcademicSectionProps {
  summary?: { overallGpa: number; totalCredits: number; completedSemesters: number } | null;
  semesters?: AcademicSemesterDTO[];
}

export const AcademicSection: React.FC<AcademicSectionProps> = ({ summary, semesters = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Compute graph data points dynamically from live MongoDB semesters or clean fallback
  const graphData = semesters.length > 0
    ? (() => {
        let runningTotal = 0;
        return semesters.map((s, idx) => {
          const sgpa = Number(s.gpa || (s as any).sgpa || 9.0);
          runningTotal += sgpa;
          const cumulativeCgpa = Number((runningTotal / (idx + 1)).toFixed(2));
          return {
            label: s.semesterName || s.title || `Sem ${idx + 1}`,
            shortLabel: (s.semesterName || s.title || `S${idx + 1}`).replace('Semester ', 'Sem '),
            sgpa,
            cgpa: cumulativeCgpa,
            term: s.term || `Spring ${s.year || 2026}`,
          };
        });
      })()
    : [
        { label: 'Semester 1', shortLabel: 'Sem 1', sgpa: 8.5, cgpa: 8.5, term: 'Fall 2023' },
        { label: 'Semester 2', shortLabel: 'Sem 2', sgpa: 8.7, cgpa: 8.6, term: 'Spring 2024' },
        { label: 'Semester 3', shortLabel: 'Sem 3', sgpa: 9.0, cgpa: 8.7, term: 'Fall 2024' },
        { label: 'Semester 4', shortLabel: 'Sem 4', sgpa: 9.1, cgpa: 8.8, term: 'Spring 2025' },
        { label: 'Semester 5', shortLabel: 'Sem 5', sgpa: 9.2, cgpa: 8.9, term: 'Fall 2025' },
        { label: 'Semester 6', shortLabel: 'Sem 6', sgpa: 9.0, cgpa: 8.9, term: 'Spring 2026' },
      ];

  // Latest added semester and latest CGPA
  const latestSemester = graphData[graphData.length - 1];
  const calculatedCgpa = summary?.overallGpa ?? latestSemester.cgpa.toFixed(2);
  const totalSemestersCount = semesters.length > 0 ? semesters.length : graphData.length;

  const completedCourses = [
    'Distributed Systems & Microservices (A+)',
    'AI & Agentic Systems Architecture (A+)',
    'Database Management Systems (A+)',
    'Cloud Native Infrastructure (A)',
  ];

  // Calculate Zoomed Min and Max so small changes appear large and pronounced
  const allValues = graphData.flatMap((d) => [d.sgpa, d.cgpa]);
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  // Auto-tight zoom range (e.g. 8.2 to 9.4)
  const minY = Math.max(0, Math.floor((rawMin - 0.2) * 10) / 10);
  const maxY = Math.min(10, Math.ceil((rawMax + 0.2) * 10) / 10);
  const ySpan = Math.max(0.5, maxY - minY);

  // SVG Chart Geometry with margins for axes and angled labels
  const svgWidth = 480;
  const svgHeight = 180;
  const paddingLeft = 45;
  const paddingRight = 25;
  const paddingTop = 20;
  const paddingBottom = 45;

  const chartAreaWidth = svgWidth - paddingLeft - paddingRight;
  const chartAreaHeight = svgHeight - paddingTop - paddingBottom;

  const getX = (index: number) => {
    if (graphData.length <= 1) return paddingLeft + chartAreaWidth / 2;
    return paddingLeft + (index / (graphData.length - 1)) * chartAreaWidth;
  };

  const getY = (val: number) => {
    const clamped = Math.max(minY, Math.min(maxY, val));
    const ratio = (clamped - minY) / ySpan;
    return paddingTop + chartAreaHeight - ratio * chartAreaHeight;
  };

  // Build SVG path
  const points = graphData.map((d, i) => `${getX(i)},${getY(d.sgpa)}`).join(' ');

  // Y-axis tick intervals (4 steps)
  const yTicks = [
    minY,
    Number((minY + ySpan * 0.33).toFixed(1)),
    Number((minY + ySpan * 0.66).toFixed(1)),
    maxY,
  ];

  return (
    <section className="py-16 md:py-24 border-t border-border/80">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/60 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-primary uppercase tracking-wider">
              <Award className="w-4 h-4" /> Academic Trajectory
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              Academic <span className="orange-gradient-text">Performance</span>
            </h2>
          </div>
          <a href="/academics">
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View Academic Overview
            </Button>
          </a>
        </div>

        {/* Academic Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Live CGPA & Degree Info */}
          <Card variant="glass" padding="lg" className="lg:col-span-5 flex flex-col justify-between space-y-6 border-primary/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-primary" /> Cumulative CGPA
                </span>
                <Badge variant="primary" size="sm" className="font-mono text-[10px]">
                  {latestSemester ? latestSemester.label : 'Active'}
                </Badge>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-extrabold text-foreground font-mono tracking-tight">
                  {calculatedCgpa}
                </span>
                <span className="text-xl font-mono text-primary font-bold">/ 10.0</span>
              </div>

              <p className="text-xs text-muted-foreground font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Updated across {totalSemestersCount} recorded semesters
              </p>
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <h3 className="text-sm font-bold text-foreground">B.Tech in Computer Science & Engineering</h3>
              <p className="text-xs font-mono text-muted-foreground">State Technological University — Department of Computing</p>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Key Core Coursework:</span>
              <div className="grid grid-cols-1 gap-1.5 text-xs text-foreground font-mono">
                {completedCourses.slice(0, 3).map((course, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-1.5 rounded bg-surface/80 border border-border text-[11px]">
                    <CheckCircle2 className="w-3 h-3 text-primary shrink-0" />
                    <span className="truncate">{course}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Right Column: Zoomed Line Graph matching reference image */}
          <Card variant="glass" padding="lg" className="lg:col-span-7 flex flex-col justify-between space-y-4 border-primary/20 bg-surface/40">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> Semester vs SGPA Line Chart
                </h4>
                <p className="text-[11px] font-mono text-muted-foreground">High-resolution zoomed trajectory showing term-by-term score variation</p>
              </div>

              {hoveredIndex !== null ? (
                <div className="text-right font-mono text-xs">
                  <span className="text-foreground font-bold">{graphData[hoveredIndex].label}: </span>
                  <span className="text-primary font-extrabold text-sm">{graphData[hoveredIndex].sgpa} SGPA </span>
                  <span className="text-muted-foreground text-[10px]">({graphData[hoveredIndex].cgpa} CGPA)</span>
                </div>
              ) : (
                <div className="text-right font-mono text-[11px] text-muted-foreground">
                  Latest: <span className="text-primary font-bold">{latestSemester.sgpa} SGPA</span>
                </div>
              )}
            </div>

            {/* Zoomed Cartesian Grid Chart */}
            <div className="relative w-full h-[200px] flex items-center justify-center p-2 rounded-xl bg-background/60 border border-border/70 shadow-inner">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-full overflow-visible"
              >
                <defs>
                  {/* Arrow markers for Cartesian axes */}
                  <marker
                    id="arrowhead-x"
                    markerWidth="8"
                    markerHeight="8"
                    refX="6"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 6 3, 0 6" className="fill-muted-foreground" />
                  </marker>
                  <marker
                    id="arrowhead-y"
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
                        x={paddingLeft - 8}
                        y={y + 3.5}
                        className="text-[10px] fill-muted-foreground font-mono font-semibold"
                        textAnchor="end"
                      >
                        {val.toFixed(1)}
                      </text>
                    </g>
                  );
                })}

                {/* Vertical Grid Lines for each semester */}
                {graphData.map((_, i) => {
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

                {/* Cartesian Main Axes with Arrowheads */}
                {/* Y-Axis */}
                <line
                  x1={paddingLeft}
                  y1={paddingTop + chartAreaHeight}
                  x2={paddingLeft}
                  y2={paddingTop - 10}
                  stroke="currentColor"
                  className="text-muted-foreground"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead-y)"
                />
                {/* X-Axis */}
                <line
                  x1={paddingLeft}
                  y1={paddingTop + chartAreaHeight}
                  x2={svgWidth - paddingRight + 12}
                  y2={paddingTop + chartAreaHeight}
                  stroke="currentColor"
                  className="text-muted-foreground"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead-x)"
                />

                {/* Line Chart Path */}
                <polyline
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />

                {/* Data Points with Hollow Circle Style (like reference image) */}
                {graphData.map((d, i) => {
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
                      {/* Vertical highlight line on hover */}
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

                      {/* Outer Ring Node Dot */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? 7.5 : 5.5}
                        stroke="#14b8a6"
                        strokeWidth="3"
                        className="fill-background transition-all duration-150"
                      />

                      {/* Center Core Dot on Hover */}
                      {isHovered && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r="3"
                          fill="#14b8a6"
                        />
                      )}

                      {/* Angled X-Axis Label */}
                      <text
                        x={cx}
                        y={paddingTop + chartAreaHeight + 16}
                        className={`text-[10px] font-mono font-medium ${isHovered ? 'fill-teal-400 font-bold' : 'fill-muted-foreground'}`}
                        textAnchor="end"
                        transform={`rotate(-35, ${cx}, ${paddingTop + chartAreaHeight + 16})`}
                      >
                        {d.shortLabel}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Bottom Semester Timeline Badges */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2 border-t border-border/60">
              {graphData.map((item, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                    hoveredIndex === idx
                      ? 'bg-teal-500/10 border-teal-500 shadow-sm'
                      : 'bg-surface/60 border-border/70 hover:border-teal-500/40'
                  }`}
                >
                  <span className="text-[10px] font-mono text-muted-foreground block truncate">{item.shortLabel}</span>
                  <span className="text-xs font-mono font-bold text-teal-400 block">{item.sgpa}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
