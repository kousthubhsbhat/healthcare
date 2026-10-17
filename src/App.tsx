import React, { useState } from 'react';
import { 
  mockPatient, 
  mockMedications, 
  mockVitals, 
  mockLabReports, 
  mockAccessLogs, 
  mockHealthTrends 
} from './data/mockData';
import { LanguageCode, LabReport, Medication } from './types/health';
import { Header } from './components/Header';
import { PatientProfileHeader } from './components/PatientProfileHeader';
import { VitalsGrid } from './components/VitalsGrid';
import { MedicationList } from './components/MedicationList';
import { QuickActions } from './components/QuickActions';
import { DocumentUploadModal } from './components/DocumentUploadModal';
import { QRCodeModal } from './components/QRCodeModal';
import { DoctorTimelineView } from './components/DoctorTimelineView';
import { HealthTrendsChart } from './components/HealthTrendsChart';
import { DrugAllergyAlert } from './components/DrugAllergyAlert';
import { EmergencyModeModal } from './components/EmergencyModeModal';
import { VoiceSummaryPlayer } from './components/VoiceSummaryPlayer';
import { 
  ShieldAlert, 
  ShieldCheck,
  CheckCircle2, 
  Activity, 
  Heart, 
  Calendar, 
  Hospital,
  AlertCircle
} from 'lucide-react';
import { translations } from './data/translations';

import { fetchPatientProfile, fetchDoctorView } from './services/api';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'patient' | 'doctor' | 'emergency'>('patient');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoicePlayerOpen, setIsVoicePlayerOpen] = useState(false);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  // Doctor session state for QR code deep-links
  const [doctorSession, setDoctorSession] = useState<{
    token: string;
    scope: string;
    clinicianName: string;
    verified: boolean;
    expiresInHours: number;
  } | null>(null);

  // Data state
  const [patient, setPatient] = useState(mockPatient);
  const [medications, setMedications] = useState(mockMedications);
  const [reports, setReports] = useState<LabReport[]>(mockLabReports);
  const [accessLogs] = useState(mockAccessLogs);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with backend API on mount
  React.useEffect(() => {
    async function loadData() {
      const liveProfile = await fetchPatientProfile();
      if (liveProfile) {
        setPatient(liveProfile);
      }
    }
    loadData();
  }, []);

  // Handle QR Deep Links, Query Parameters and Pathnames on Mount
  React.useEffect(() => {
    const handleUrlRoute = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const path = window.location.pathname;

        const token = urlParams.get('token');
        const viewParam = urlParams.get('view');
        const scopeParam = (urlParams.get('scope') || 'Full').toUpperCase();

        const isDoctorRoute = 
          path.includes('/doctor-portal') || 
          path.includes('/doctor-view') || 
          viewParam === 'doctor' || 
          Boolean(token);

        const isEmergencyRoute = 
          path.includes('/emergency') || 
          viewParam === 'emergency' || 
          scopeParam === 'EMERGENCY';

        if (isEmergencyRoute) {
          setIsEmergencyOpen(true);
        }

        if (isDoctorRoute) {
          setCurrentView('doctor');

          if (token) {
            setDoctorSession({
              token,
              scope: scopeParam,
              clinicianName: 'Dr. Ramesh N. Rao (Emergency / Hospital Staff)',
              verified: true,
              expiresInHours: 24,
            });

            // Sync with backend API to log access event in Supabase and fetch fresh dossier
            try {
              const docViewData = await fetchDoctorView(token);
              if (docViewData?.patient) {
                setPatient(docViewData.patient);
              }
              if (docViewData?.medications) {
                setMedications(docViewData.medications);
              }
              if (docViewData?.timelineReports) {
                setReports(docViewData.timelineReports);
              }
            } catch (err) {
              console.warn('Doctor view sync fallback to local dossier:', err);
            }

            showToast(`🔐 Authorized Doctor Session Active (Scope: ${scopeParam})`);
          }
        }
      } catch (e) {
        console.error('Error parsing route params:', e);
      }
    };

    handleUrlRoute();
  }, []);

  const t = translations[language];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleSpeech = () => {
    setIsVoicePlayerOpen(true);
    if (isSpeaking) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(t.audioSpeechText);
        const langMap: Record<LanguageCode, string> = { en: 'en-IN', hi: 'hi-IN', kn: 'kn-IN', ta: 'ta-IN' };
        utterance.lang = langMap[language] || 'en-IN';
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleRequestRefill = (med: Medication) => {
    showToast(`Refill request for ${med.name} sent to ${mockPatient.primaryPhysician.hospital} Pharmacy!`);
  };

  const handleAddMedication = () => {
    const newMed: Medication = {
      id: `med-${Date.now()}`,
      name: 'Atorvastatin 20mg',
      genericName: 'Atorvastatin Calcium IP',
      dosage: '20 mg',
      frequency: 'Once daily bedtime',
      timing: 'Bedtime',
      prescribedBy: 'Dr. Ramesh N. Rao',
      prescribedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      pillsRemaining: 30,
      totalPills: 30,
      refillAlert: false,
      category: 'Cardiology',
      isTakenToday: false,
    };
    setMedications([newMed, ...medications]);
    showToast(`Added new prescription: ${newMed.name}`);
  };

  const handleReportAdded = (newReport: LabReport) => {
    setReports([newReport, ...reports]);
    showToast(`Report "${newReport.title}" successfully added to health timeline!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-sky-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Global Header */}
      <Header
        currentView={currentView}
        onViewChange={(view) => {
          if (view === 'emergency') {
            setIsEmergencyOpen(true);
          } else {
            setCurrentView(view);
          }
        }}
        language={language}
        onLanguageChange={setLanguage}
        isSpeaking={isSpeaking}
        onToggleSpeech={handleToggleSpeech}
        patientName={patient.name}
        bloodGroup={patient.bloodGroup}
      />

      {/* Emergency Mode Modal (Zero-login high-contrast screen) */}
      <EmergencyModeModal
        isOpen={isEmergencyOpen || currentView === 'emergency'}
        onClose={() => {
          setIsEmergencyOpen(false);
          if (currentView === 'emergency') setCurrentView('patient');
        }}
        patient={patient}
        language={language}
      />

      {/* Upload Document Modal */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        language={language}
        onReportAdded={handleReportAdded}
      />

      {/* QR Code Sharing Modal */}
      <QRCodeModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        language={language}
        accessLogs={accessLogs}
        patientId={patient.id}
        patientName={patient.name}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Voice Summary Drawer / Card if active */}
        {isVoicePlayerOpen && (
          <VoiceSummaryPlayer
            language={language}
            isOpen={isVoicePlayerOpen}
            onClose={() => {
              setIsVoicePlayerOpen(false);
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              setIsSpeaking(false);
            }}
            isSpeaking={isSpeaking}
            setIsSpeaking={setIsSpeaking}
          />
        )}

        {/* ================= PATIENT DASHBOARD VIEW ================= */}
        {currentView === 'patient' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Patient Profile Header Card */}
            <PatientProfileHeader
              patient={patient}
              language={language}
              onOpenEmergency={() => setIsEmergencyOpen(true)}
            />

            {/* Quick Actions (Upload, QR, Emergency, Trends) */}
            <QuickActions
              language={language}
              onOpenUpload={() => setIsUploadOpen(true)}
              onOpenQR={() => setIsQROpen(true)}
              onOpenEmergency={() => setIsEmergencyOpen(true)}
              onOpenDoctorView={() => setCurrentView('doctor')}
            />

            {/* Current Vitals Grid */}
            <VitalsGrid vitals={mockVitals} language={language} />

            {/* Active Medications List & Refill Alerts */}
            <MedicationList
              medications={medications}
              language={language}
              onRequestRefill={handleRequestRefill}
              onAddMedication={handleAddMedication}
            />

            {/* Recent Lab Reports Mini-Widget */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-heading font-bold text-slate-900">
                    Recent Diagnostic Reports
                  </h2>
                  <p className="text-xs text-slate-500">Verified by hospital pathology network</p>
                </div>
                <button
                  onClick={() => setCurrentView('doctor')}
                  className="text-xs font-bold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200 transition-colors"
                >
                  View Full Clinical Timeline →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {reports.slice(0, 2).map((r) => (
                  <div key={r.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                        {r.category}
                      </span>
                      <span className="text-xs text-slate-400">{r.date}</span>
                    </div>
                    <h3 className="font-heading font-bold text-slate-900 text-sm mt-1.5">{r.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{r.summary}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================= DOCTOR CLINICAL VIEW ================= */}
        {currentView === 'doctor' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Active QR Doctor Session Banner */}
            {doctorSession && (
              <div className="bg-emerald-950 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-emerald-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 bg-emerald-500/30 text-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Verified QR Token Session
                      </span>
                      <span className="text-xs text-emerald-200 font-mono bg-black/30 px-2 py-0.5 rounded">
                        Token: {doctorSession.token.length > 20 ? `${doctorSession.token.substring(0, 18)}...` : doctorSession.token}
                      </span>
                      <span className="bg-sky-500/20 text-sky-200 text-[11px] font-bold px-2 py-0.5 rounded">
                        Scope: {doctorSession.scope}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-100/90 mt-1">
                      Temporary 24-hour read access granted by patient {patient.name}. Authenticated via National Health Gateway.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => {
                      setDoctorSession(null);
                      setCurrentView('patient');
                      if (typeof window !== 'undefined') {
                        window.history.replaceState({}, '', window.location.pathname);
                      }
                      showToast('Exited Doctor Session. Returned to Patient Dashboard.');
                    }}
                    className="text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl border border-white/20 transition-colors flex items-center gap-1.5"
                  >
                    <span>Exit to Patient View</span>
                  </button>
                </div>
              </div>
            )}

            {/* Doctor View Sub-Header */}
            <div className="bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-900 text-white rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded backdrop-blur-xs">
                    EMR Clinician Portal
                  </span>
                  <span className="text-xs text-sky-200">
                    Logged as Dr. Ramesh N. Rao (ID: DOC-KA-2819)
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-heading font-black tracking-tight mt-1">
                  Patient Clinical Dossier: {patient.name}
                </h1>
                <p className="text-xs text-sky-100 mt-0.5">
                  ABHA ID: <code className="font-mono bg-black/20 px-1.5 py-0.5 rounded">{patient.healthId}</code> • Age: {patient.age} • Blood Group: <strong className="text-amber-300">{patient.bloodGroup}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md"
                >
                  + Upload Clinical Report
                </button>
                <button
                  onClick={() => setIsEmergencyOpen(true)}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Emergency Mode</span>
                </button>
              </div>
            </div>

            {/* High Priority Drug-Allergy Interaction Alert Banner */}
            <DrugAllergyAlert allergies={patient.allergies} language={language} />

            {/* Interactive Trend Graphs (Blood Sugar, BP, Cholesterol) */}
            <HealthTrendsChart data={mockHealthTrends} language={language} />

            {/* Clean Timeline of Past Lab Reports and Scans */}
            <DoctorTimelineView
              reports={reports}
              language={language}
              onOpenUpload={() => setIsUploadOpen(true)}
            />

          </div>
        )}

      </main>

      {/* Global Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-600" />
            <span className="font-heading font-bold text-slate-800">PulseHealth National Medical Registry</span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">v2.4 LTS</span>
          </div>
          <p className="text-slate-400">
            HIPAA & NDHM / ABDM Compliant • 256-Bit Cryptographic Vault • Emergency Zero-Login SOS Enabled
          </p>
        </div>
      </footer>

    </div>
  );
};

export default App;
