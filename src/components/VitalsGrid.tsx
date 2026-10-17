import React from 'react';
import { Heart, Activity, Droplets, Wind, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { VitalMetric, LanguageCode } from '../types/health';
import { translations } from '../data/translations';

interface VitalsGridProps {
  vitals: VitalMetric[];
  language: LanguageCode;
}

export const VitalsGrid: React.FC<VitalsGridProps> = ({ vitals, language }) => {
  const t = translations[language];

  const getIcon = (name: string) => {
    if (name.includes('Pressure')) return <Activity className="w-5 h-5 text-sky-600" />;
    if (name.includes('Sugar') || name.includes('Glucose')) return <Droplets className="w-5 h-5 text-amber-600" />;
    if (name.includes('Heart Rate')) return <Heart className="w-5 h-5 text-rose-600" />;
    return <Wind className="w-5 h-5 text-emerald-600" />;
  };

  const getStatusBadge = (status: VitalMetric['status']) => {
    switch (status) {
      case 'optimal':
        return <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Optimal</span>;
      case 'normal':
        return <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">{t.normal}</span>;
      case 'warning':
        return <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">{t.elevated}</span>;
      case 'alert':
        return <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">Alert</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-heading font-bold text-slate-800 flex items-center gap-2">
          <Activity className="w-5 h-5 text-sky-600" />
          <span>{t.vitalsOverview}</span>
        </h2>
        <span className="text-xs text-slate-400 font-medium">Synced today 08:30 AM via Health Band</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {vitals.map((vital) => (
          <div
            key={vital.id}
            className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-card hover:shadow-card-hover transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                {getIcon(vital.name)}
              </div>
              {getStatusBadge(vital.status)}
            </div>

            <p className="text-xs font-semibold text-slate-500 truncate">{vital.name}</p>
            
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
                {vital.value}
              </span>
              <span className="text-xs font-semibold text-slate-500">{vital.unit}</span>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1 text-[11px]">
              {vital.changeType === 'down' && <ArrowDownRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
              {vital.changeType === 'up' && <ArrowUpRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
              {vital.changeType === 'neutral' && <Minus className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
              <span className="text-slate-500 truncate">{vital.change}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
