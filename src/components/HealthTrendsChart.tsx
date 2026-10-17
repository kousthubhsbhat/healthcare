import React, { useState } from 'react';
import { LineChart, Activity, TrendingDown, TrendingUp, Info } from 'lucide-react';
import { HealthTrendPoint, LanguageCode } from '../types/health';
import { translations } from '../data/translations';

interface HealthTrendsChartProps {
  data: HealthTrendPoint[];
  language: LanguageCode;
}

type MetricType = 'sugar' | 'bp' | 'cholesterol';

export const HealthTrendsChart: React.FC<HealthTrendsChartProps> = ({ data, language }) => {
  const t = translations[language];
  const [activeMetric, setActiveMetric] = useState<MetricType>('sugar');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG dimensions
  const width = 640;
  const height = 240;
  const paddingX = 50;
  const paddingY = 30;

  // Compute values and scaling based on selected metric
  let primaryValues: number[] = [];
  let secondaryValues: number[] = [];
  let primaryLabel = '';
  let secondaryLabel = '';
  let unit = '';
  let targetBand = { min: 0, max: 0, label: '' };
  let minY = 0;
  let maxY = 250;

  if (activeMetric === 'sugar') {
    primaryValues = data.map((d) => d.sugarPostPrandial);
    secondaryValues = data.map((d) => d.sugarFasting);
    primaryLabel = 'Post-Prandial (PP)';
    secondaryLabel = 'Fasting Blood Sugar';
    unit = 'mg/dL';
    minY = 60;
    maxY = 220;
    targetBand = { min: 70, max: 140, label: 'Target Norm: 70 - 140 mg/dL' };
  } else if (activeMetric === 'bp') {
    primaryValues = data.map((d) => d.bpSystolic);
    secondaryValues = data.map((d) => d.bpDiastolic);
    primaryLabel = 'Systolic BP';
    secondaryLabel = 'Diastolic BP';
    unit = 'mmHg';
    minY = 60;
    maxY = 160;
    targetBand = { min: 80, max: 120, label: 'Optimal: < 120/80 mmHg' };
  } else {
    primaryValues = data.map((d) => d.cholesterolTotal);
    secondaryValues = data.map((d) => d.cholesterolLdl);
    primaryLabel = 'Total Cholesterol';
    secondaryLabel = 'LDL Bad Cholesterol';
    unit = 'mg/dL';
    minY = 80;
    maxY = 250;
    targetBand = { min: 100, max: 200, label: 'Desirable: < 200 mg/dL' };
  }

  const getCoordinates = (values: number[]) => {
    return values.map((val, idx) => {
      const x = paddingX + (idx / (values.length - 1)) * (width - 2 * paddingX);
      const y = height - paddingY - ((val - minY) / (maxY - minY)) * (height - 2 * paddingY);
      return { x, y, val };
    });
  };

  const primaryCoords = getCoordinates(primaryValues);
  const secondaryCoords = getCoordinates(secondaryValues);

  const makePath = (coords: { x: number; y: number }[]) => {
    return coords.reduce((acc, curr, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`, '');
  };

  const targetMinY = height - paddingY - ((targetBand.min - minY) / (maxY - minY)) * (height - 2 * paddingY);
  const targetMaxY = height - paddingY - ((targetBand.max - minY) / (maxY - minY)) * (height - 2 * paddingY);

  const latestVal = primaryValues[primaryValues.length - 1];
  const prevVal = primaryValues[0];
  const isImproved = latestVal < prevVal;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-4">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-heading font-bold text-slate-900 flex items-center gap-2">
            <LineChart className="w-5 h-5 text-sky-600" />
            <span>{t.trendAnalytics}</span>
          </h2>
          <p className="text-xs text-slate-500">6-Month Longitudinal Biomarker Trajectory</p>
        </div>

        {/* Metric Switcher Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
          <button
            onClick={() => { setActiveMetric('sugar'); setHoveredIndex(null); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMetric === 'sugar' ? 'bg-white text-sky-700 font-bold shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Blood Sugar
          </button>
          <button
            onClick={() => { setActiveMetric('bp'); setHoveredIndex(null); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMetric === 'bp' ? 'bg-white text-sky-700 font-bold shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Blood Pressure
          </button>
          <button
            onClick={() => { setActiveMetric('cholesterol'); setHoveredIndex(null); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMetric === 'cholesterol' ? 'bg-white text-sky-700 font-bold shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Cholesterol
          </button>
        </div>
      </div>

      {/* Metric Summary Quick Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-sky-600" />
            <span className="text-xs font-semibold text-slate-700">{primaryLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-slate-700">{secondaryLabel}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          {isImproved ? (
            <span className="flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
              <TrendingDown className="w-3.5 h-3.5" />
              Trend Improving (-{prevVal - latestVal} {unit})
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
              <TrendingUp className="w-3.5 h-3.5" />
              Fluctuating
            </span>
          )}
        </div>
      </div>

      {/* Interactive Responsive SVG Graph */}
      <div className="w-full overflow-x-auto relative pt-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[500px] h-60 overflow-visible select-none"
        >
          {/* Target Reference Range Band */}
          <rect
            x={paddingX}
            y={Math.min(targetMinY, targetMaxY)}
            width={width - 2 * paddingX}
            height={Math.abs(targetMinY - targetMaxY)}
            fill="#10b981"
            fillOpacity="0.08"
          />
          <text
            x={width - paddingX - 4}
            y={Math.min(targetMinY, targetMaxY) + 12}
            textAnchor="end"
            fontSize="10"
            fill="#059669"
            fontWeight="bold"
          >
            {targetBand.label}
          </text>

          {/* Grid lines */}
          {[minY, (minY + maxY) / 2, maxY].map((val, i) => {
            const y = height - paddingY - ((val - minY) / (maxY - minY)) * (height - 2 * paddingY);
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill="#94a3b8"
                >
                  {Math.round(val)}
                </text>
              </g>
            );
          })}

          {/* Lines */}
          <path
            d={makePath(primaryCoords)}
            fill="none"
            stroke="#0284c7"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d={makePath(secondaryCoords)}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="6 4"
          />

          {/* Points & Hover interactions */}
          {primaryCoords.map((coord, i) => (
            <g key={`pri-${i}`} className="cursor-pointer" onMouseEnter={() => setHoveredIndex(i)}>
              <circle
                cx={coord.x}
                cy={coord.y}
                r={hoveredIndex === i ? 6 : 4}
                fill="#0284c7"
                stroke="#ffffff"
                strokeWidth="2"
                className="transition-all"
              />
            </g>
          ))}

          {secondaryCoords.map((coord, i) => (
            <g key={`sec-${i}`} className="cursor-pointer" onMouseEnter={() => setHoveredIndex(i)}>
              <circle
                cx={coord.x}
                cy={coord.y}
                r={hoveredIndex === i ? 6 : 3.5}
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth="2"
                className="transition-all"
              />
            </g>
          ))}

          {/* X Axis labels */}
          {data.map((item, i) => {
            const x = paddingX + (i / (data.length - 1)) * (width - 2 * paddingX);
            return (
              <text
                key={i}
                x={x}
                y={height - 8}
                textAnchor="middle"
                fontSize="11"
                fill={hoveredIndex === i ? '#0284c7' : '#64748b'}
                fontWeight={hoveredIndex === i ? 'bold' : 'normal'}
              >
                {item.displayDate}
              </text>
            );
          })}
        </svg>

        {/* Hover Tooltip display */}
        {hoveredIndex !== null && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded-xl py-2 px-3.5 text-xs shadow-lg flex items-center gap-4 z-10 pointer-events-none border border-slate-700 animate-in fade-in">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">{data[hoveredIndex].displayDate}</span>
              <p className="font-bold text-sky-300">
                {primaryLabel}: {primaryValues[hoveredIndex]} {unit}
              </p>
            </div>
            <div className="border-l border-slate-700 pl-3">
              <p className="font-bold text-emerald-400">
                {secondaryLabel}: {secondaryValues[hoveredIndex]} {unit}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
