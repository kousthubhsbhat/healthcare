import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Phone, 
  Droplet, 
  Copy, 
  Check, 
  MapPin, 
  HeartHandshake
} from 'lucide-react';
import { PatientProfile, LanguageCode } from '../types/health';
import { translations } from '../data/translations';

interface PatientProfileHeaderProps {
  patient: PatientProfile;
  language: LanguageCode;
  onOpenEmergency: () => void;
  onOpenSettings?: () => void;
}

export const PatientProfileHeader: React.FC<PatientProfileHeaderProps> = ({
  patient,
  language,
  onOpenEmergency,
  onOpenSettings,
}) => {
  const t = translations[language];
  const [copiedId, setCopiedId] = useState(false);

  const handleCopyAbha = () => {
    navigator.clipboard.writeText(patient.healthId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 sm:p-7 relative overflow-hidden transition-all hover:shadow-md">
      {/* Soft Blue Gradient Accent Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-500 via-blue-600 to-emerald-500" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
        
        {/* Left Column: Avatar + Basic Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          
          {/* Avatar with Blood Group Badge */}
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-sky-100 to-blue-200 border-2 border-white shadow-md flex items-center justify-center text-sky-800 text-2xl sm:text-3xl font-extrabold tracking-tight">
              {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            
            {/* Blood Group Pill badge floating over avatar */}
            <div 
              className="absolute -bottom-2 -right-2 bg-red-600 text-white text-xs sm:text-sm font-extrabold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 border-2 border-white"
              title="Blood Group"
            >
              <Droplet className="w-3.5 h-3.5 fill-white" />
              <span>{patient.bloodGroup}</span>
            </div>
          </div>

          {/* Demographic details */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
                {patient.name}
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {patient.age} yrs • {patient.gender}
              </span>
              {patient.organDonor && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <HeartHandshake className="w-3 h-3 text-emerald-600" />
                  Organ Donor
                </span>
              )}
              {onOpenSettings && (
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 hover:border-sky-300 px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 shadow-2xs group"
                  title="Switch family member or account settings"
                >
                  <span>Switch Profile</span>
                  <span className="text-[10px] text-sky-500 group-hover:translate-x-0.5 transition-transform">▾</span>
                </button>
              )}
            </div>

            {/* ABHA ID / Health Card */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 pt-0.5">
              <span className="font-medium text-slate-500">ABHA Health ID:</span>
              <code className="bg-sky-50 text-sky-800 font-mono font-semibold px-2 py-0.5 rounded border border-sky-200">
                {patient.healthId}
              </code>
              <button 
                onClick={handleCopyAbha}
                className="text-slate-400 hover:text-sky-600 transition-colors p-1"
                title="Copy ABHA ID"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Address & Physician */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Bangalore, Karnataka
              </span>
              <span className="hidden sm:inline">•</span>
              <span>Physician: <strong className="text-slate-700">{patient.primaryPhysician.name}</strong></span>
            </div>

            {/* Active & Verified Clinical Conditions */}
            {patient.chronicConditions && patient.chronicConditions.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Conditions:</span>
                {patient.chronicConditions.map((cond, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/90 flex items-center gap-1 shadow-2xs animate-in fade-in"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>{cond}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Critical Allergies & Emergency Contacts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:w-auto w-full border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-6 pt-4 lg:pt-0">
          
          {/* Critical Allergies Box */}
          <div className="bg-red-50/80 border border-red-200/90 rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-red-700 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>{t.criticalAllergies}</span>
              </div>
              <span className="text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded-full">
                {patient.allergies.length} Flagged
              </span>
            </div>

            <div className="space-y-1.5">
              {patient.allergies.map((allergy) => (
                <div 
                  key={allergy.id}
                  className="bg-white/90 rounded-lg p-2 text-xs border border-red-200/60 shadow-xs"
                >
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="text-red-700">{allergy.substance}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      allergy.severity === 'Severe' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {allergy.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 truncate mt-0.5" title={allergy.reaction}>
                    {allergy.reaction}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Contacts Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-700 font-bold text-xs uppercase tracking-wider">
                  {t.emergencyContacts}
                </span>
                <span className="text-[10px] text-sky-700 font-semibold bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                  Quick Dial
                </span>
              </div>

              <div className="space-y-2">
                {patient.emergencyContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-slate-200 shadow-xs">
                    <div>
                      <p className="font-bold text-slate-800">{contact.name}</p>
                      <p className="text-[11px] text-slate-500">{contact.relation}</p>
                    </div>
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors"
                      title={`Call ${contact.name}`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Call</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onOpenEmergency}
              className="mt-2.5 w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Launch Emergency Card</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
