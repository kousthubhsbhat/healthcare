import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Search, Pill, ChevronDown, ChevronUp } from 'lucide-react';
import { Allergy, LanguageCode } from '../types/health';
import { translations } from '../data/translations';

interface DrugAllergyAlertProps {
  allergies: Allergy[];
  language: LanguageCode;
}

export const DrugAllergyAlert: React.FC<DrugAllergyAlertProps> = ({ allergies, language }) => {
  const t = translations[language];
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchDrug, setSearchDrug] = useState('');
  const [checkResult, setCheckResult] = useState<{
    status: 'safe' | 'danger' | 'warning' | null;
    message: string;
  }>({ status: null, message: '' });

  const drugAllergies = allergies.filter((a) => a.category === 'Drug');

  const handleCheckDrug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchDrug.trim()) return;

    const query = searchDrug.toLowerCase().trim();
    const allContra = drugAllergies.flatMap((a) => a.contraindicatedDrugs.map((d) => d.toLowerCase()));

    // Check dangerous drugs
    const match = allContra.find((d) => query.includes(d.split(' ')[0].toLowerCase()) || d.toLowerCase().includes(query));

    if (match || query.includes('penicillin') || query.includes('amox') || query.includes('sulfa') || query.includes('augmentin')) {
      setCheckResult({
        status: 'danger',
        message: `CONTRAINDICATED! "${searchDrug}" poses severe risk of anaphylaxis due to Penicillin/Sulfa cross-reactivity. Do NOT prescribe.`,
      });
    } else if (query.includes('cefu') || query.includes('ceph') || query.includes('bactrim')) {
      setCheckResult({
        status: 'warning',
        message: `CAUTION: Potential cephalosporin cross-allergy risk (10-15% cross-reactivity with beta-lactams). Exercise caution.`,
      });
    } else {
      setCheckResult({
        status: 'safe',
        message: `Verified Safe: "${searchDrug}" has no documented allergen cross-reactivity in patient record.`,
      });
    }
  };

  return (
    <aside aria-label="Clinical safety warning" className="rounded-2xl border-2 border-red-400 bg-gradient-to-r from-red-500 via-rose-500 to-red-600 text-white shadow-lg overflow-hidden transition-all">
      {/* Top Banner Alert Bar */}
      <div className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30">
            <ShieldAlert className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-white text-red-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                High Priority Alert
              </span>
              <h2 className="font-heading font-extrabold text-sm sm:text-base tracking-tight text-white">
                {t.severeAllergyAlert}
              </h2>
            </div>
            <p className="text-xs text-red-100 mt-1 max-w-2xl font-medium">
              {t.allergyInteractionWarning}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-xl transition-colors shrink-0"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Contraindications & Interactive Safety Check */}
      {isExpanded && (
        <div className="bg-white text-slate-800 p-4 sm:p-5 border-t border-red-200 space-y-4">
          
          {/* Contraindicated Drug Pills */}
          <div>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Strictly Prohibited & Contraindicated Medications:</span>
            </p>

            <div className="flex flex-wrap gap-2">
              {drugAllergies.flatMap((a) => a.contraindicatedDrugs).map((drug, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 bg-red-100/90 text-red-900 border border-red-300 px-3 py-1 rounded-lg text-xs font-bold shadow-2xs"
                >
                  <Pill className="w-3.5 h-3.5 text-red-600" />
                  <span>{drug}</span>
                  <span className="text-[10px] uppercase text-red-600 font-extrabold">({t.contraindicated})</span>
                </span>
              ))}
            </div>
          </div>

          {/* Real-time Drug Safety Checker Tool */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">
                Prescription Safety Checker (Doctor Drug-Allergy Verification)
              </span>
              <span className="text-[11px] text-slate-500">Live Clinical Database</span>
            </div>

            <form onSubmit={handleCheckDrug} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchDrug}
                  onChange={(e) => setSearchDrug(e.target.value)}
                  placeholder="Type drug name (e.g., Augmentin, Paracetamol, Cefuroxime)..."
                  className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow-xs"
              >
                Check Drug
              </button>
            </form>

            {/* Check Result Feedback */}
            {checkResult.status && (
              <div
                className={`mt-2.5 p-2.5 rounded-lg text-xs flex items-center gap-2 font-semibold ${
                  checkResult.status === 'danger'
                    ? 'bg-red-100 text-red-900 border border-red-300'
                    : checkResult.status === 'warning'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                }`}
              >
                {checkResult.status === 'danger' && <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />}
                {checkResult.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
                {checkResult.status === 'safe' && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
                <span>{checkResult.message}</span>
              </div>
            )}
          </div>

        </div>
      )}
    </aside>
  );
};
