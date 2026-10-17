import React from 'react';
import { UploadCloud, QrCode, ShieldAlert, LineChart, FileText, Settings, Users } from 'lucide-react';
import { LanguageCode } from '../types/health';
import { translations } from '../data/translations';

interface QuickActionsProps {
  language: LanguageCode;
  onOpenUpload: () => void;
  onOpenQR: () => void;
  onOpenEmergency: () => void;
  onOpenDoctorView: () => void;
  onOpenSettings?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  language,
  onOpenUpload,
  onOpenQR,
  onOpenEmergency,
  onOpenDoctorView,
  onOpenSettings,
}) => {
  const t = translations[language];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-5">
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-sm font-heading font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-sky-600" />
          <span>{t.quickActions}</span>
        </h2>
        <span className="text-[11px] text-slate-500 font-medium">Instant Clinical Workflows</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Upload Report Button */}
        <button
          onClick={onOpenUpload}
          className="flex flex-col items-center justify-center p-4 rounded-xl border border-sky-100 bg-gradient-to-b from-sky-50/80 to-white hover:from-sky-100 hover:to-sky-50 text-slate-800 hover:text-sky-900 shadow-xs hover:shadow-card transition-all group"
        >
          <div className="w-11 h-11 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>
          <span className="font-heading font-bold text-xs sm:text-sm mt-2.5 text-center text-slate-800 group-hover:text-sky-700">
            {t.uploadReport}
          </span>
          <span className="text-[10px] text-slate-500 text-center mt-0.5">
            OCR & AI Analysis
          </span>
        </button>

        {/* Show QR Code Button */}
        <button
          onClick={onOpenQR}
          className="flex flex-col items-center justify-center p-4 rounded-xl border border-emerald-100 bg-gradient-to-b from-emerald-50/80 to-white hover:from-emerald-100 hover:to-emerald-50 text-slate-800 hover:text-emerald-900 shadow-xs hover:shadow-card transition-all group"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform">
            <QrCode className="w-6 h-6" />
          </div>
          <span className="font-heading font-bold text-xs sm:text-sm mt-2.5 text-center text-slate-800 group-hover:text-emerald-700">
            {t.showQRCode}
          </span>
          <span className="text-[10px] text-slate-500 text-center mt-0.5">
            24h Doctor Pass
          </span>
        </button>

        {/* Doctor Clinical View & Trends */}
        <button
          onClick={onOpenDoctorView}
          className="flex flex-col items-center justify-center p-4 rounded-xl border border-blue-100 bg-gradient-to-b from-blue-50/80 to-white hover:from-blue-100 hover:to-blue-50 text-slate-800 hover:text-blue-900 shadow-xs hover:shadow-card transition-all group"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <LineChart className="w-6 h-6" />
          </div>
          <span className="font-heading font-bold text-xs sm:text-sm mt-2.5 text-center text-slate-800 group-hover:text-blue-700">
            {t.doctorView}
          </span>
          <span className="text-[10px] text-slate-500 text-center mt-0.5">
            Timeline & Graphs
          </span>
        </button>

        {/* Emergency Mode Button */}
        <button
          onClick={onOpenEmergency}
          className="flex flex-col items-center justify-center p-4 rounded-xl border border-red-200 bg-gradient-to-b from-red-50 to-rose-100 hover:from-red-100 hover:to-rose-200 text-red-900 shadow-xs hover:shadow-card transition-all group relative overflow-hidden"
        >
          <div className="w-11 h-11 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-500/30 group-hover:scale-110 transition-transform">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <span className="font-heading font-extrabold text-xs sm:text-sm mt-2.5 text-center text-red-700">
            {t.emergencyMode}
          </span>
          <span className="text-[10px] text-red-600 font-semibold text-center mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping inline-block"></span>
            Zero-Login SOS
          </span>
        </button>

        {/* Account & Settings Button */}
        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center p-4 rounded-xl border border-purple-100 bg-gradient-to-b from-purple-50/80 to-white hover:from-purple-100 hover:to-purple-50 text-slate-800 hover:text-purple-900 shadow-xs hover:shadow-card transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <span className="font-heading font-bold text-xs sm:text-sm mt-2.5 text-center text-slate-800 group-hover:text-purple-700">
              Accounts & Settings
            </span>
            <span className="text-[10px] text-slate-500 text-center mt-0.5">
              Switch • OTP • Google
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
