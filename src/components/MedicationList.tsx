import React, { useState } from 'react';
import { Pill, AlertCircle, CheckCircle2, Clock, Calendar, RefreshCw, Plus } from 'lucide-react';
import { Medication, LanguageCode } from '../types/health';
import { translations } from '../data/translations';

interface MedicationListProps {
  medications: Medication[];
  language: LanguageCode;
  onRequestRefill: (med: Medication) => void;
  onAddMedication: () => void;
}

export const MedicationList: React.FC<MedicationListProps> = ({
  medications: initialMeds,
  language,
  onRequestRefill,
  onAddMedication,
}) => {
  const t = translations[language];
  const [meds, setMeds] = useState<Medication[]>(initialMeds);
  const [filter, setFilter] = useState<'All' | 'Cardiology' | 'Endocrinology' | 'General'>('All');

  const toggleTaken = (id: string) => {
    setMeds((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, isTakenToday: !m.isTakenToday } : m
      )
    );
  };

  const filteredMeds = filter === 'All' ? meds : meds.filter((m) => m.category === filter);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-4">
      {/* Header and Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-heading font-bold text-slate-900 tracking-tight">
              {t.activeMedications}
            </h2>
            <p className="text-xs text-slate-500">
              {meds.filter((m) => m.isTakenToday).length} of {meds.length} doses logged for today
            </p>
          </div>
        </div>

        {/* Action button & category pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold text-slate-600">
            {(['All', 'Cardiology', 'Endocrinology', 'General'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  filter === cat
                    ? 'bg-white text-sky-700 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={onAddMedication}
            className="flex items-center gap-1 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Rx</span>
          </button>
        </div>
      </div>

      {/* Medication Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMeds.map((med) => {
          const pillPercentage = Math.round((med.pillsRemaining / med.totalPills) * 100);
          const isCriticalRefill = med.pillsRemaining <= 5 || med.refillAlert;

          return (
            <div
              key={med.id}
              className={`rounded-xl border p-4 transition-all relative overflow-hidden ${
                isCriticalRefill
                  ? 'border-amber-300 bg-amber-50/30 shadow-xs'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
              }`}
            >
              {/* Refill Alert Flag Ribbon if low stock */}
              {isCriticalRefill && (
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900 bg-amber-100/90 border border-amber-300 px-2.5 py-1 rounded-lg mb-3">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>{t.refillAlertMsg}</span>
                  <button
                    onClick={() => onRequestRefill(med)}
                    className="ml-auto underline font-extrabold text-amber-800 hover:text-amber-950"
                  >
                    1-Click Refill
                  </button>
                </div>
              )}

              {/* Top Row: Name, Dosage, Timing Pill */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-heading font-bold text-slate-900 text-base flex items-center gap-2">
                    {med.name}
                    <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {med.dosage}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 italic mt-0.5">
                    {med.genericName}
                  </p>
                </div>

                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 shrink-0">
                  {med.timing}
                </span>
              </div>

              {/* Dosage instructions */}
              <div className="flex items-center gap-3 text-xs text-slate-600 mt-2.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {med.frequency}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {med.prescribedBy}
                </span>
              </div>

              {med.notes && (
                <p className="text-[11px] text-slate-500 bg-white/70 p-1.5 rounded mt-2 border border-slate-200/60">
                  💡 {med.notes}
                </p>
              )}

              {/* Pill Count & Progress Bar */}
              <div className="mt-3.5 pt-3 border-t border-slate-200/80">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500 font-medium">Supply Remaining</span>
                  <span className={`font-bold ${isCriticalRefill ? 'text-amber-700' : 'text-slate-700'}`}>
                    {med.pillsRemaining} / {med.totalPills} {t.pillsLeft}
                  </span>
                </div>
                
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCriticalRefill ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pillPercentage}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons: Mark Taken and Request Refill */}
              <div className="flex items-center justify-between gap-2 mt-4 pt-2">
                <button
                  onClick={() => toggleTaken(med.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    med.isTakenToday
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{med.isTakenToday ? t.doseTaken : t.takeDose}</span>
                </button>

                <button
                  onClick={() => onRequestRefill(med)}
                  className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Refill</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
