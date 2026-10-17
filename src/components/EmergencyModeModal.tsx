import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Phone, 
  Droplet, 
  AlertTriangle, 
  MapPin, 
  X, 
  Volume2, 
  VolumeX, 
  HeartHandshake, 
  Radio, 
  Share2, 
  Check
} from 'lucide-react';
import { PatientProfile, LanguageCode } from '../types/health';
import { translations } from '../data/translations';

interface EmergencyModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
  language: LanguageCode;
}

export const EmergencyModeModal: React.FC<EmergencyModeModalProps> = ({
  isOpen,
  onClose,
  patient,
  language,
}) => {
  const t = translations[language];
  const [beaconActive, setBeaconActive] = useState(true);
  const [copiedLocation, setCopiedLocation] = useState(false);

  if (!isOpen) return null;

  const handleCopyLocation = () => {
    navigator.clipboard.writeText('Emergency Location: 12.9716° N, 77.5946° E - Indiranagar 12th Main, Bangalore');
    setCopiedLocation(true);
    setTimeout(() => setCopiedLocation(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white overflow-y-auto animate-in fade-in duration-200">
      
      {/* Top High-Contrast Banner with flashing SOS beacon */}
      <div className="bg-red-600 text-white px-4 py-3 sm:py-4 flex items-center justify-between border-b-4 border-red-700 shadow-emergency">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white text-red-600 flex items-center justify-center font-black animate-pulse shadow-md">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-widest bg-black/30 px-2 py-0.5 rounded">
                CRITICAL RESCUE
              </span>
              <h1 className="font-heading font-black text-sm sm:text-base tracking-wide">
                {t.zeroLoginNotice}
              </h1>
            </div>
            <p className="text-[11px] sm:text-xs text-red-100 font-medium">
              Zero login required for emergency medical technicians, EMTs, and ER trauma units.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="bg-black/40 hover:bg-black/60 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border border-white/20"
        >
          <X className="w-4 h-4" />
          <span>Exit Emergency View</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Core Survival Data 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Blood Group Giant Hero Card */}
          <div className="md:col-span-1 bg-slate-900 border-2 border-red-500 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-emergency relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-red-600/30 border border-red-500 flex items-center justify-center text-red-400 mb-2">
              <Droplet className="w-8 h-8 fill-red-500 stroke-red-200" />
            </div>

            <span className="text-xs font-black uppercase tracking-widest text-red-400">
              {t.bloodGroup}
            </span>

            <div className="text-6xl sm:text-7xl font-heading font-black text-white tracking-tighter my-1 drop-shadow-md">
              {patient.bloodGroup}
            </div>

            <span className="text-xs text-slate-300 font-semibold bg-red-900/60 border border-red-700/60 px-3 py-1 rounded-full mt-1">
              Rhesus Positive (Rh+)
            </span>

            <div className="mt-4 pt-3 border-t border-red-900/60 w-full text-center">
              <p className="text-[11px] text-slate-400 font-medium">Compatible Donor Units:</p>
              <p className="text-xs font-bold text-slate-200">B+, B-, O+, O-</p>
            </div>
          </div>

          {/* Critical Allergies Hero Box */}
          <div className="md:col-span-2 bg-slate-900 border-2 border-red-500 rounded-3xl p-6 space-y-4 shadow-emergency">
            <div className="flex items-center justify-between pb-2 border-b border-red-900/50">
              <div className="flex items-center gap-2 text-red-400 font-black text-sm uppercase tracking-wider">
                <AlertTriangle className="w-5 h-5 text-red-500 animate-bounce" />
                <span>{t.criticalAllergies} - STRICT CONTRAINDICATION</span>
              </div>
              <span className="bg-red-600 text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full">
                DO NOT ADMINISTER
              </span>
            </div>

            <div className="space-y-3">
              {patient.allergies.map((allergy) => (
                <div
                  key={allergy.id}
                  className="bg-red-950/40 border border-red-600/60 rounded-2xl p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-black text-lg text-red-400 tracking-wide">
                      ⚠️ {allergy.substance}
                    </h3>
                    <span className="bg-red-600 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded">
                      {allergy.severity} Risk
                    </span>
                  </div>

                  <p className="text-xs text-red-200 font-semibold">
                    Reaction: {allergy.reaction}
                  </p>

                  {allergy.contraindicatedDrugs.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                        Contraindicated Drugs:
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {allergy.contraindicatedDrugs.map((d, i) => (
                          <span
                            key={i}
                            className="bg-red-900/80 text-red-100 font-bold text-xs px-2.5 py-0.5 rounded-lg border border-red-700"
                          >
                            ✕ {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 1-Tap Quick Action Emergency Dialers */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-400" />
              <span>1-Tap Instant Emergency Calls</span>
            </h3>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
              Direct Phone Link
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Ambulance 108 */}
            <a
              href="tel:108"
              className="bg-red-600 hover:bg-red-500 active:scale-95 text-white p-4 rounded-2xl flex flex-col items-center justify-center text-center font-bold shadow-lg transition-all border-2 border-red-400"
            >
              <span className="text-2xl mb-1">🚑</span>
              <span className="text-sm font-extrabold uppercase tracking-wide">{t.callAmbulance}</span>
              <span className="text-xs text-red-100 font-medium mt-0.5">National Emergency Hotline</span>
            </a>

            {/* Primary Contact: Spouse */}
            <a
              href={`tel:${patient.emergencyContacts[0]?.phone}`}
              className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white p-4 rounded-2xl flex flex-col items-center justify-center text-center font-bold shadow-lg transition-all border-2 border-emerald-400"
            >
              <Phone className="w-6 h-6 mb-1" />
              <span className="text-sm font-extrabold">Call {patient.emergencyContacts[0]?.name}</span>
              <span className="text-xs text-emerald-100 font-medium mt-0.5">
                {patient.emergencyContacts[0]?.relation} ({patient.emergencyContacts[0]?.phone})
              </span>
            </a>

            {/* Secondary Contact: Doctor Brother */}
            <a
              href={`tel:${patient.emergencyContacts[1]?.phone}`}
              className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white p-4 rounded-2xl flex flex-col items-center justify-center text-center font-bold shadow-lg transition-all border-2 border-blue-400"
            >
              <Phone className="w-6 h-6 mb-1" />
              <span className="text-sm font-extrabold">Call {patient.emergencyContacts[1]?.name}</span>
              <span className="text-xs text-blue-100 font-medium mt-0.5">
                {patient.emergencyContacts[1]?.relation} ({patient.emergencyContacts[1]?.phone})
              </span>
            </a>
          </div>
        </div>

        {/* Patient Identity & Medical Directives */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Patient Identification & Directives
            </h4>
            <div className="space-y-1 text-xs">
              <p><strong>Name:</strong> {patient.name} ({patient.age} yrs, {patient.gender})</p>
              <p><strong>ABHA Health ID:</strong> <code className="text-sky-400 font-mono font-bold">{patient.healthId}</code></p>
              <p><strong>Date of Birth:</strong> {patient.dob}</p>
              <p><strong>Chronic Conditions:</strong> {patient.chronicConditions.join(', ')}</p>
              <div className="flex gap-2 pt-2">
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold text-[11px] flex items-center gap-1">
                  <HeartHandshake className="w-3.5 h-3.5" />
                  Organ Donor: YES
                </span>
                <span className="bg-slate-800 text-slate-200 border border-slate-700 px-2 py-0.5 rounded font-bold text-[11px]">
                  DNR: Resuscitate If Needed
                </span>
              </div>
            </div>
          </div>

          {/* GPS Location & Live Beacon */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                <span>Live Emergency GPS Location</span>
              </h4>
              <span className="text-[10px] text-emerald-400 font-mono">GPS Active</span>
            </div>

            <p className="text-xs text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-500 shrink-0" />
              <span>12.9716° N, 77.5946° E • Indiranagar 12th Main, Bangalore</span>
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleCopyLocation}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
              >
                {copiedLocation ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLocation ? 'Coordinates Copied!' : 'Share GPS Coordinates'}</span>
              </button>

              <button
                onClick={() => setBeaconActive(!beaconActive)}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-colors ${
                  beaconActive
                    ? 'bg-red-600/40 text-red-300 border border-red-500'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {beaconActive ? 'Beacon: ON' : 'Beacon: OFF'}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
