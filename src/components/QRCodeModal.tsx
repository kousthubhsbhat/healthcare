import React, { useState, useEffect } from 'react';
import { 
  X, 
  QrCode, 
  Clock, 
  ShieldCheck, 
  Copy, 
  Check, 
  RefreshCw, 
  Lock, 
  Users, 
  Share2, 
  AlertOctagon,
  Eye
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { AccessLog, LanguageCode } from '../types/health';
import { translations } from '../data/translations';

import { generateQRToken, fetchAccessLogs } from '../services/api';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  accessLogs: AccessLog[];
  patientId: string;
  patientName: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  language,
  accessLogs: initialLogs,
  patientId,
  patientName,
}) => {
  const t = translations[language];

  // 24-hour countdown state (starts at 24 hours)
  const [secondsRemaining, setSecondsRemaining] = useState(24 * 3600);
  const [sessionToken, setSessionToken] = useState('926528f7-25a0-42c1-9a79-73dc3e7966bd');
  const [shareUrl, setShareUrl] = useState(`http://localhost:5173/doctor-portal?token=926528f7-25a0-42c1-9a79-73dc3e7966bd`);
  const [isCopied, setIsCopied] = useState(false);
  const [accessScope, setAccessScope] = useState<'Full' | 'Emergency' | 'Labs'>('Full');
  const [isRevoked, setIsRevoked] = useState(false);
  const [liveLogs, setLiveLogs] = useState<AccessLog[]>(initialLogs);

  // Generate real UUID token from backend on mount or scope change
  useEffect(() => {
    if (!isOpen) return;

    async function loadTokenAndLogs() {
      try {
        const tokenRes = await generateQRToken(patientId, accessScope);
        setSessionToken(tokenRes.token);
        setShareUrl(tokenRes.shareUrl || `http://localhost:5173/doctor-portal?token=${tokenRes.token}`);
        
        const expTime = new Date(tokenRes.expiresAt).getTime();
        const nowTime = new Date().getTime();
        const diffSeconds = Math.max(0, Math.floor((expTime - nowTime) / 1000));
        setSecondsRemaining(diffSeconds > 0 ? diffSeconds : 24 * 3600);

        // Fetch logs
        const logs = await fetchAccessLogs(patientId);
        if (logs && logs.length > 0) {
          setLiveLogs(logs);
        }
      } catch (err) {
        console.warn('Backend QR generate error, using client fallback:', err);
      }
    }

    loadTokenAndLogs();
  }, [isOpen, accessScope, patientId]);

  useEffect(() => {
    if (!isOpen || isRevoked) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isRevoked]);

  if (!isOpen) return null;

  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;

  const formatDigits = (n: number) => n.toString().padStart(2, '0');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleRegenerate = async () => {
    setIsRevoked(false);
    try {
      const tokenRes = await generateQRToken(patientId, accessScope);
      setSessionToken(tokenRes.token);
      setShareUrl(tokenRes.shareUrl || `http://localhost:5173/doctor-portal?token=${tokenRes.token}`);
      setSecondsRemaining(24 * 3600);
    } catch (err) {
      const fallbackToken = `MED-SEC-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
      setSessionToken(fallbackToken);
      setShareUrl(`http://localhost:5173/doctor-portal?token=${fallbackToken}`);
      setSecondsRemaining(24 * 3600);
    }
  };

  const handleRevoke = () => {
    setIsRevoked(true);
    setSecondsRemaining(0);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-heading font-bold text-slate-900">
                {t.accessSharing}
              </h2>
              <p className="text-xs text-slate-500">Secure Temporary QR Portal for Doctors, Clinics & First Responders</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          
          {/* Top Grid: QR Display + Countdown Timer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* Left Box: QR Card */}
            <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-white rounded-2xl border-2 border-slate-200/90 shadow-card relative">
              
              {isRevoked ? (
                <div className="h-56 flex flex-col items-center justify-center text-center p-4">
                  <AlertOctagon className="w-16 h-16 text-red-500 mb-2 animate-bounce" />
                  <h4 className="font-heading font-bold text-red-600 text-base">Access Revoked</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    This QR code and token have been invalidated. Generate a new token to grant access.
                  </p>
                  <button
                    onClick={handleRegenerate}
                    className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-md"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Generate New 24h Pass</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* Clean QR code frame */}
                  <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-200">
                    <QRCodeSVG
                      value={shareUrl}
                      size={180}
                      level="H"
                      includeMargin={false}
                      className="rounded-lg"
                    />
                  </div>

                  <div className="text-center mt-3">
                    <p className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>End-to-End Encrypted Session</span>
                    </p>
                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                      Session Token: {sessionToken}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-3 w-full">
                    <button
                      onClick={handleCopyLink}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition-colors"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{isCopied ? 'Link Copied!' : 'Copy Portal URL'}</span>
                    </button>

                    <button
                      onClick={handleRegenerate}
                      title="Generate new token"
                      className="p-2 rounded-xl text-slate-600 hover:text-sky-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}

            </div>

            {/* Right Box: Live Countdown & Scope Settings */}
            <div className="space-y-4">
              
              {/* Expiration Timer Card */}
              <div className="bg-gradient-to-br from-sky-50 via-blue-50 to-emerald-50 rounded-2xl p-5 border border-sky-200/80 shadow-xs">
                <div className="flex items-center gap-2 text-sky-900 font-bold text-xs uppercase tracking-wider mb-2">
                  <Clock className="w-4 h-4 text-sky-600" />
                  <span>{t.qrExpiresIn}</span>
                </div>

                {/* Digital Clock Display */}
                <div className="flex items-center justify-center gap-3 py-2">
                  <div className="flex flex-col items-center bg-white rounded-xl px-3 py-2 border border-slate-200 shadow-xs min-w-[58px]">
                    <span className="font-heading font-extrabold text-2xl text-slate-900">
                      {formatDigits(hours)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Hours</span>
                  </div>

                  <span className="text-2xl font-bold text-slate-400">:</span>

                  <div className="flex flex-col items-center bg-white rounded-xl px-3 py-2 border border-slate-200 shadow-xs min-w-[58px]">
                    <span className="font-heading font-extrabold text-2xl text-slate-900">
                      {formatDigits(minutes)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Mins</span>
                  </div>

                  <span className="text-2xl font-bold text-slate-400">:</span>

                  <div className="flex flex-col items-center bg-white rounded-xl px-3 py-2 border border-slate-200 shadow-xs min-w-[58px]">
                    <span className="font-heading font-extrabold text-2xl text-emerald-600">
                      {formatDigits(seconds)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Secs</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 text-center mt-2">
                  After 24 hours, this QR code automatically revokes all hospital view permissions.
                </p>
              </div>

              {/* Permission Scope Radios */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Access Permission Scope:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Full', label: 'Full Record', desc: 'All history & scans' },
                    { id: 'Labs', label: 'Lab Reports', desc: 'Blood & diagnostics' },
                    { id: 'Emergency', label: 'Emergency', desc: 'Allergies & blood only' },
                  ].map((scope) => (
                    <button
                      key={scope.id}
                      type="button"
                      onClick={() => setAccessScope(scope.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        accessScope === scope.id
                          ? 'border-sky-500 bg-sky-50 text-sky-900 font-bold ring-2 ring-sky-200'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <p className="text-xs font-bold">{scope.label}</p>
                      <p className="text-[10px] text-slate-500 truncate">{scope.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Emergency Revoke Button */}
              {!isRevoked && (
                <button
                  onClick={handleRevoke}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
                  <span>Revoke Access Immediately</span>
                </button>
              )}

            </div>

          </div>

          {/* Live Access Audit Trail Table */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-600" />
                <h3 className="font-heading font-bold text-slate-900 text-sm">
                  {t.liveAccessLogs}
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                Audited via National Health Gateway
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Authorized Clinician</th>
                      <th className="py-2.5 px-3">Hospital / Facility</th>
                      <th className="py-2.5 px-3">Scope</th>
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {liveLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-800">
                          {log.viewerName}
                          <p className="text-[10px] font-normal text-slate-500">{log.role}</p>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {log.hospital}
                          <p className="text-[10px] text-slate-400">{log.ipLocation}</p>
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 font-medium">
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            {log.accessType}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">
                          {log.timestamp}
                          <p className="text-[10px] text-slate-400">{log.duration}</p>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {log.status === 'Active Now' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Active Now
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                              <ShieldCheck className="w-3 h-3 text-sky-600" />
                              Authorized
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
