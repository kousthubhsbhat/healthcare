import React from 'react';
import { Activity, ShieldAlert, Stethoscope, User, Volume2, VolumeX, Globe, Settings } from 'lucide-react';
import { LanguageCode } from '../types/health';
import { translations } from '../data/translations';

interface HeaderProps {
  currentView: 'patient' | 'doctor' | 'emergency';
  onViewChange: (view: 'patient' | 'doctor' | 'emergency') => void;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isSpeaking: boolean;
  onToggleSpeech: () => void;
  patientName: string;
  bloodGroup: string;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  language,
  onLanguageChange,
  isSpeaking,
  onToggleSpeech,
  patientName,
  bloodGroup,
  onOpenSettings,
}) => {
  const t = translations[language];

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Logo & Medical Branding */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => onViewChange('patient')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-sky-500/25 group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-bold text-xl tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors">
                    Pulse<span className="text-sky-600">Health</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded">
                    ABHA
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Smart Clinical Network</p>
              </div>
            </div>
          </div>

          {/* Navigation Pill Switcher */}
          <nav aria-label="Portal Mode" className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/60 shadow-inner">
            <button
              onClick={() => onViewChange('patient')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                currentView === 'patient'
                  ? 'bg-white text-sky-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="hidden md:inline">{t.dashboard}</span>
              <span className="md:hidden">Patient</span>
            </button>

            <button
              onClick={() => onViewChange('doctor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                currentView === 'doctor'
                  ? 'bg-white text-sky-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-sky-600" />
              <span className="hidden md:inline">{t.doctorView}</span>
              <span className="md:hidden">Doctor</span>
            </button>

            <button
              onClick={() => onViewChange('emergency')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                currentView === 'emergency'
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/30'
                  : 'text-red-600 hover:bg-red-50 hover:text-red-700'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span className="hidden sm:inline">Emergency Mode</span>
              <span className="sm:hidden">SOS</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </button>
          </nav>

          {/* Right Controls: Read Aloud Voice, Language Selector, and Mini Patient Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Voice Read Aloud Button */}
            <button
              onClick={onToggleSpeech}
              title={isSpeaking ? t.pauseAudio : t.readAloud}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
                isSpeaking
                  ? 'bg-amber-50 text-amber-700 border-amber-300 ring-2 ring-amber-400/50 animate-pulse'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4 text-amber-600" />
                  <span className="hidden lg:inline font-semibold">{t.pauseAudio}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-sky-600" />
                  <span className="hidden lg:inline">{t.readAloud}</span>
                </>
              )}
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative flex items-center">
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
                <Globe className="w-3.5 h-3.5 text-sky-600" />
                <select
                  aria-label="Select Language"
                  value={language}
                  onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                  className="bg-transparent border-none text-xs font-semibold text-slate-800 focus:outline-hidden cursor-pointer pr-1"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code} className="text-slate-900 bg-white">
                      {lang.native} ({lang.label})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Settings & Account Management Button */}
            <button
              onClick={onOpenSettings}
              title="Account Settings & Family Profiles"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs"
            >
              <Settings className="w-4 h-4 text-slate-600" />
              <span className="hidden md:inline">Settings</span>
            </button>

            {/* Patient Badge Quick Info & Switcher */}
            <button
              onClick={onOpenSettings}
              title="Click to switch active family account"
              className="hidden xl:flex items-center gap-2 pl-2 border-l border-slate-200 text-left hover:opacity-85 transition-opacity cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs ring-2 ring-sky-300 group-hover:scale-105 transition-transform">
                {bloodGroup}
              </div>
              <div className="text-left text-xs leading-tight">
                <p className="font-semibold text-slate-800 truncate max-w-[110px] group-hover:text-sky-600 transition-colors">{patientName}</p>
                <p className="text-[10px] text-emerald-600 font-medium">● Switch Profile</p>
              </div>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
