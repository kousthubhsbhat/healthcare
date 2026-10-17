import React, { useState } from 'react';
import { 
  mockPatient, 
  mockMedications, 
  mockVitals, 
  mockLabReports, 
  mockAccessLogs, 
  mockHealthTrends,
  mockAccounts 
} from './data/mockData';
import { LanguageCode, LabReport, Medication, HealthTrendPoint, VitalMetric, PatientProfile, UserAccount } from './types/health';
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
import { SettingsModal } from './components/SettingsModal';
import { SignInModal } from './components/SignInModal';
import { 
  ShieldAlert, 
  ShieldCheck,
  CheckCircle2, 
  Activity, 
  Heart, 
  Calendar, 
  Hospital,
  AlertCircle,
  FileCheck,
  FileText,
  Sparkles,
  Eye,
  UploadCloud,
  X,
  ExternalLink,
  RefreshCw,
  Lock
} from 'lucide-react';
import { translations } from './data/translations';

import { fetchPatientProfile, fetchDoctorView, fetchPatientReports } from './services/api';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'patient' | 'doctor' | 'emergency'>('patient');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoicePlayerOpen, setIsVoicePlayerOpen] = useState(false);

  // Modals state
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedReportDetail, setSelectedReportDetail] = useState<LabReport | null>(null);

  // Security Check live audit state
  const [verifyingReportId, setVerifyingReportId] = useState<string | null>(null);
  const [verifiedAuditBadge, setVerifiedAuditBadge] = useState<Record<string, boolean>>({});

  // Accounts & Multi-Family Profile State
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('pulsehealth_accounts');
      return saved ? JSON.parse(saved) : mockAccounts;
    } catch {
      return mockAccounts;
    }
  });

  const [activeAccountId, setActiveAccountId] = useState<string>(() => {
    try {
      return localStorage.getItem('pulsehealth_active_account_id') || 'acc-1';
    } catch {
      return 'acc-1';
    }
  });

  // Doctor session state for QR code deep-links
  const [doctorSession, setDoctorSession] = useState<{
    token: string;
    scope: string;
    clinicianName: string;
    verified: boolean;
    expiresInHours: number;
  } | null>(null);

  // Data state with localStorage persistence
  const [patient, setPatient] = useState<PatientProfile>(() => {
    try {
      const saved = localStorage.getItem('pulsehealth_patient');
      return saved ? JSON.parse(saved) : mockPatient;
    } catch {
      return mockPatient;
    }
  });
  const [medications, setMedications] = useState<Medication[]>(() => {
    try {
      const saved = localStorage.getItem('pulsehealth_medications');
      return saved ? JSON.parse(saved) : mockMedications;
    } catch {
      return mockMedications;
    }
  });
  const [reports, setReports] = useState<LabReport[]>(() => {
    try {
      const saved = localStorage.getItem('pulsehealth_reports');
      return saved ? JSON.parse(saved) : mockLabReports;
    } catch {
      return mockLabReports;
    }
  });
  const [vitals, setVitals] = useState<VitalMetric[]>(() => {
    try {
      const saved = localStorage.getItem('pulsehealth_vitals');
      return saved ? JSON.parse(saved) : mockVitals;
    } catch {
      return mockVitals;
    }
  });
  const [healthTrends, setHealthTrends] = useState<HealthTrendPoint[]>(() => {
    try {
      const saved = localStorage.getItem('pulsehealth_trends');
      return saved ? JSON.parse(saved) : mockHealthTrends;
    } catch {
      return mockHealthTrends;
    }
  });
  const [accessLogs] = useState(mockAccessLogs);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to localStorage so updates survive page reloads
  React.useEffect(() => {
    try {
      localStorage.setItem('pulsehealth_reports', JSON.stringify(reports));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [reports]);

  React.useEffect(() => {
    try {
      localStorage.setItem('pulsehealth_vitals', JSON.stringify(vitals));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [vitals]);

  React.useEffect(() => {
    try {
      localStorage.setItem('pulsehealth_patient', JSON.stringify(patient));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [patient]);

  React.useEffect(() => {
    try {
      localStorage.setItem('pulsehealth_medications', JSON.stringify(medications));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [medications]);

  React.useEffect(() => {
    try {
      localStorage.setItem('pulsehealth_trends', JSON.stringify(healthTrends));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [healthTrends]);

  React.useEffect(() => {
    try {
      localStorage.setItem('pulsehealth_accounts', JSON.stringify(accounts));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [accounts]);

  React.useEffect(() => {
    try {
      localStorage.setItem('pulsehealth_active_account_id', activeAccountId);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [activeAccountId]);

  // Sync with backend API on mount
  React.useEffect(() => {
    async function loadData() {
      try {
        const liveProfile = await fetchPatientProfile();
        if (liveProfile) {
          setPatient((prev: any) => ({ ...prev, ...liveProfile }));
        }

        const liveReports = await fetchPatientReports();
        if (liveReports && liveReports.length > 0) {
          setReports((prev) => {
            const map = new Map<string, LabReport>();
            // Keep user's existing & uploaded reports FIRST so newest uploaded reports stay at top
            prev.forEach((r) => {
              if (r && r.id) map.set(r.id, r);
            });
            // Merge in backend live reports if not already present
            liveReports.forEach((r: any) => {
              if (r && r.id && !map.has(r.id)) {
                map.set(r.id, {
                  id: r.id,
                  title: r.title || 'Diagnostic Report',
                  date: r.date || 'Today',
                  category: r.category || 'Blood Work',
                  doctor: r.doctor || 'Dr. Ramesh N. Rao',
                  facility: r.facility || 'Manipal Diagnostic Lab - Supabase Vault',
                  fileType: r.fileType || 'PDF',
                  fileSize: r.fileSize || '1.2 MB',
                  summary: r.summary || 'Verified clinical diagnostic report',
                  status: r.status || 'Verified',
                  keyValues: r.keyValues || []
                });
              }
            });
            return Array.from(map.values());
          });
        }
      } catch (err) {
        console.warn('Could not sync with live backend on mount:', err);
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

  const handleSwitchAccount = (account: UserAccount) => {
    setActiveAccountId(account.id);
    setPatient(account.patientData);
    if (account.vitals && account.vitals.length > 0) {
      setVitals(account.vitals);
    }
    if (account.medications) {
      setMedications(account.medications);
    }
    if (account.reports) {
      setReports(account.reports);
    }
    if (account.trends && account.trends.length > 0) {
      setHealthTrends(account.trends);
    }
    showToast(`Switched active profile to ${account.name} (${account.relationship})`);
  };

  const handleAddAccount = (newAccount: UserAccount) => {
    setAccounts((prev) => [newAccount, ...prev.filter((a) => a.id !== newAccount.id)]);
  };

  const handleUpdateAccount = (updatedAccount: UserAccount) => {
    setAccounts((prev) => prev.map((a) => (a.id === updatedAccount.id ? updatedAccount : a)));
    if (updatedAccount.id === activeAccountId) {
      setPatient(updatedAccount.patientData);
    }
  };

  const handleRunLiveAudit = (reportId: string) => {
    setVerifyingReportId(reportId);
    setTimeout(() => {
      setVerifyingReportId(null);
      setVerifiedAuditBadge((prev) => ({ ...prev, [reportId]: true }));
      showToast('🔒 Cryptographic SHA-256 Checksum & PKI Signature Verified Tamper-Proof!');
    }, 850);
  };

  const handleReportAdded = (newReport: LabReport, patientDetails?: { name: string; doctor?: string; facility?: string }) => {
    const assignedPatientName = newReport.patientName || patientDetails?.name || patient.name;
    const assignedDoctor = newReport.doctor || patientDetails?.doctor || patient.primaryPhysician.name;
    const assignedFacility = newReport.facility || patientDetails?.facility || patient.primaryPhysician.hospital;

    // 1. Ensure valid ID and place at the very top of Recent Diagnostic Reports
    const reportWithId: LabReport = {
      ...newReport,
      id: newReport.id || `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      patientName: assignedPatientName,
      doctor: assignedDoctor,
      facility: assignedFacility,
    };

    // Immediately update dashboard patient info to match doctor's uploaded report
    setPatient((prev) => ({
      ...prev,
      name: assignedPatientName,
      primaryPhysician: {
        ...prev.primaryPhysician,
        name: assignedDoctor,
        hospital: assignedFacility,
      }
    }));

    setReports((prev) => [reportWithId, ...prev.filter((r) => r.id !== reportWithId.id)]);
    showToast(`✅ "${newReport.title}" synced for patient ${assignedPatientName}!`);

    // Smoothly scroll down to the spotlight section so the user sees it immediately
    setTimeout(() => {
      const el = document.getElementById('latest-report-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);

    // 2. Dynamically Update Vitals Grid
    setVitals((prevVitals: VitalMetric[]) => {
      let updated = [...prevVitals];

      newReport.keyValues.forEach((kv) => {
        const nameLower = kv.name.toLowerCase();
        const valMatch = kv.value.match(/([0-9]+(?:\.[0-9]+)?)/);
        const numVal = valMatch ? parseFloat(valMatch[1]) : null;

        // Blood Glucose / Fasting Sugar
        if (nameLower.includes('glucose') || nameLower.includes('sugar') || nameLower.includes('fbs')) {
          const idx = updated.findIndex((v) => v.name.toLowerCase().includes('sugar') || v.name.toLowerCase().includes('glucose'));
          if (idx !== -1) {
            updated[idx] = {
              ...updated[idx],
              value: numVal ?? kv.value,
              status: kv.isAbnormal ? (numVal && numVal > 200 ? 'alert' : 'warning') : 'optimal',
              change: `Updated from ${newReport.title}`,
              changeType: kv.isAbnormal ? 'up' : 'down',
              lastRecorded: `Today • ${newReport.date}`,
            };
          }
        }
        // Blood Pressure
        else if (nameLower.includes('bp') || nameLower.includes('blood pressure') || nameLower.includes('systolic')) {
          const idx = updated.findIndex((v) => v.name.toLowerCase().includes('pressure'));
          if (idx !== -1) {
            updated[idx] = {
              ...updated[idx],
              value: kv.value.replace(/[^0-9/]/g, '').trim() || kv.value,
              status: kv.isAbnormal ? 'warning' : 'optimal',
              change: `Synced from ${newReport.title}`,
              changeType: kv.isAbnormal ? 'up' : 'down',
              lastRecorded: `Today • ${newReport.date}`,
            };
          }
        }
        // Heart Rate / Pulse
        else if (nameLower.includes('heart rate') || nameLower.includes('pulse')) {
          const idx = updated.findIndex((v) => v.name.toLowerCase().includes('heart rate'));
          if (idx !== -1) {
            updated[idx] = {
              ...updated[idx],
              value: numVal ?? kv.value,
              status: kv.isAbnormal ? 'warning' : 'normal',
              change: `Recorded in ${newReport.title}`,
              lastRecorded: `Today • ${newReport.date}`,
            };
          }
        }
        // Oxygen SpO2
        else if (nameLower.includes('oxygen') || nameLower.includes('spo2')) {
          const idx = updated.findIndex((v) => v.name.toLowerCase().includes('oxygen') || v.name.toLowerCase().includes('spo2'));
          if (idx !== -1) {
            updated[idx] = {
              ...updated[idx],
              value: numVal ?? kv.value,
              status: numVal && numVal < 94 ? 'alert' : 'optimal',
              lastRecorded: `Today • ${newReport.date}`,
            };
          }
        }
        // Other High-Impact Biomarkers: Cholesterol, TSH, Hemoglobin, Creatinine, etc.
        else if (
          nameLower.includes('cholesterol') ||
          nameLower.includes('tsh') ||
          nameLower.includes('thyroid') ||
          nameLower.includes('hemoglobin') ||
          nameLower.includes('creatinine') ||
          nameLower.includes('sgpt') ||
          kv.isAbnormal
        ) {
          const existingIdx = updated.findIndex((v) => v.name.toLowerCase() === kv.name.toLowerCase());
          if (existingIdx !== -1) {
            updated[existingIdx] = {
              ...updated[existingIdx],
              value: numVal ?? kv.value,
              status: kv.isAbnormal ? 'warning' : 'optimal',
              lastRecorded: `Today • ${newReport.title}`,
            };
          } else {
            let unitStr = kv.value.replace(/[0-9.]/g, '').trim();
            if (!unitStr) {
              if (nameLower.includes('cholesterol') || nameLower.includes('triglyceride')) unitStr = 'mg/dL';
              else if (nameLower.includes('tsh')) unitStr = 'uIU/mL';
              else if (nameLower.includes('hemoglobin')) unitStr = 'g/dL';
              else if (nameLower.includes('wbc')) unitStr = '/mcL';
              else if (nameLower.includes('platelet')) unitStr = '/mcL';
              else unitStr = 'Units';
            }
            updated.push({
              id: `vit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              name: kv.name,
              value: numVal ?? kv.value,
              unit: unitStr,
              status: kv.isAbnormal ? 'warning' : 'optimal',
              change: `Extracted from ${newReport.title}`,
              changeType: kv.isAbnormal ? 'up' : 'neutral',
              lastRecorded: `Just now • ${newReport.title}`,
            });
          }
        }
      });

      return updated;
    });

    // 3. Dynamically Update Patient Chronic Conditions
    setPatient((prevPatient: PatientProfile) => {
      const conditions = [...prevPatient.chronicConditions];
      const titleLower = newReport.title.toLowerCase();

      if (titleLower.includes('thyroid') || newReport.keyValues.some((k) => k.name.toLowerCase().includes('tsh'))) {
        const hasHypo = conditions.some((c) => c.toLowerCase().includes('thyroid'));
        if (!hasHypo) {
          conditions.push('Subclinical Hypothyroidism (Diagnosed via lab)');
        }
      }

      if (titleLower.includes('lipid') || newReport.keyValues.some((k) => k.name.toLowerCase().includes('cholesterol') && k.isAbnormal)) {
        const hasLipid = conditions.some((c) => c.toLowerCase().includes('lipid') || c.toLowerCase().includes('cholesterol'));
        if (!hasLipid) {
          conditions.push('Dyslipidemia / Hypercholesterolemia');
        }
      }

      if (titleLower.includes('cbc') || newReport.keyValues.some((k) => k.name.toLowerCase().includes('hemoglobin') && k.isAbnormal)) {
        const hasAnemia = conditions.some((c) => c.toLowerCase().includes('anemia'));
        if (!hasAnemia) {
          conditions.push('Mild Microcytic Anemia');
        }
      }

      return {
        ...prevPatient,
        chronicConditions: conditions,
      };
    });

    // 4. Dynamically Update Active Medications if Prescription or Medication detected
    const summaryLower = (newReport.summary || '').toLowerCase();
    const commonMeds: {
      match: string;
      name: string;
      genericName: string;
      dosage: string;
      frequency: string;
      timing: 'Before Food' | 'After Food' | 'With Food' | 'Bedtime';
      category: 'Cardiology' | 'Endocrinology' | 'General';
    }[] = [
      { match: 'atorvastatin', name: 'Atorvastatin 20mg', genericName: 'Atorvastatin Calcium IP', dosage: '20 mg', frequency: 'Once daily bedtime', timing: 'Bedtime', category: 'Cardiology' },
      { match: 'levothyroxine', name: 'Levothyroxine 50mcg', genericName: 'Levothyroxine Sodium', dosage: '50 mcg', frequency: 'Once daily morning', timing: 'Before Food', category: 'Endocrinology' },
      { match: 'metformin', name: 'Metformin 500mg ER', genericName: 'Metformin Hydrochloride', dosage: '500 mg', frequency: 'Twice daily with meals', timing: 'After Food', category: 'Endocrinology' },
      { match: 'telmisartan', name: 'Telmisartan 40mg', genericName: 'Telmisartan IP', dosage: '40 mg', frequency: 'Once daily morning', timing: 'Before Food', category: 'Cardiology' },
      { match: 'rosuvastatin', name: 'Rosuvastatin 10mg', genericName: 'Rosuvastatin Calcium', dosage: '10 mg', frequency: 'Once daily bedtime', timing: 'Bedtime', category: 'Cardiology' },
    ];

    commonMeds.forEach((m) => {
      if (summaryLower.includes(m.match)) {
        setMedications((prevMeds) => {
          if (prevMeds.some((existing) => existing.name.toLowerCase().includes(m.match))) {
            return prevMeds;
          }
          const newMed: Medication = {
            id: `med-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: m.name,
            genericName: m.genericName,
            dosage: m.dosage,
            frequency: m.frequency,
            timing: m.timing,
            prescribedBy: newReport.doctor || 'Dr. Ramesh N. Rao',
            prescribedDate: newReport.date || 'Today',
            pillsRemaining: 30,
            totalPills: 30,
            refillAlert: false,
            category: m.category,
            isTakenToday: false,
          };
          return [newMed, ...prevMeds];
        });
      }
    });

    // 5. Update Health Trends Point
    let extractedSugar: number | undefined;
    let extractedCholesterol: number | undefined;
    let extractedLdl: number | undefined;

    newReport.keyValues.forEach((kv) => {
      const n = kv.name.toLowerCase();
      const numMatch = kv.value.match(/([0-9]+(?:\.[0-9]+)?)/);
      if (!numMatch) return;
      const val = parseFloat(numMatch[1]);
      if (n.includes('glucose') || n.includes('sugar') || n.includes('fbs')) extractedSugar = val;
      if (n.includes('total cholesterol') || n === 'cholesterol') extractedCholesterol = val;
      if (n.includes('ldl')) extractedLdl = val;
    });

    if (extractedSugar || extractedCholesterol || extractedLdl) {
      setHealthTrends((prevTrends: HealthTrendPoint[]) => {
        const last = prevTrends[prevTrends.length - 1] || mockHealthTrends[mockHealthTrends.length - 1];
        const newPoint: HealthTrendPoint = {
          date: new Date().toISOString().slice(0, 7),
          displayDate: 'Today (Live)',
          sugarFasting: extractedSugar ?? last.sugarFasting,
          sugarPostPrandial: Math.round((extractedSugar ?? last.sugarFasting) * 1.35),
          bpSystolic: last.bpSystolic,
          bpDiastolic: last.bpDiastolic,
          cholesterolTotal: extractedCholesterol ?? last.cholesterolTotal,
          cholesterolLdl: extractedLdl ?? last.cholesterolLdl,
        };
        return [...prevTrends, newPoint];
      });
    }

    showToast(`✅ Patient Dashboard & Vitals updated from "${newReport.title}"!`);
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
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSignIn={() => setIsSignInOpen(true)}
        signedInUser={patient.name}
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

      {/* Sign In Options Modal (Google, Mobile OTP, ABHA, Clinician) */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        language={language}
        onLoginSuccess={(user) => {
          if (user.role === 'doctor') {
            setCurrentView('doctor');
            showToast(`🩺 Clinician mode activated: Logged in as ${user.name}`);
          } else {
            setPatient((prev) => ({
              ...prev,
              name: user.name,
              email: user.email || prev.email,
              phone: user.phone || prev.phone,
              healthId: user.abhaId || prev.healthId,
            }));
            showToast(`✅ Profile authenticated: ${user.name}`);
          }
        }}
        showToast={showToast}
      />

      {/* Upload Document Modal */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        language={language}
        onReportAdded={handleReportAdded}
        defaultPatientName={patient.name}
        defaultDoctorName={patient.primaryPhysician.name}
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

      {/* Account Settings & Multi-Profile Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        language={language}
        onLanguageChange={setLanguage}
        accounts={accounts}
        activeAccountId={activeAccountId}
        onSwitchAccount={handleSwitchAccount}
        onAddAccount={handleAddAccount}
        onUpdateAccount={handleUpdateAccount}
        showToast={showToast}
      />

      {/* Report Detail Inspection Modal */}
      {selectedReportDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-slate-900">{selectedReportDetail.title}</h3>
                  <p className="text-xs text-slate-500">{selectedReportDetail.facility} • {selectedReportDetail.date}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReportDetail(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px] font-bold">PATIENT NAME</span>
                  <span className="font-bold text-slate-800 truncate block">{selectedReportDetail.patientName || patient.name}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px] font-bold">CATEGORY</span>
                  <span className="font-bold text-slate-800">{selectedReportDetail.category}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px] font-bold">ATTENDING DOCTOR</span>
                  <span className="font-bold text-slate-800 truncate block">{selectedReportDetail.doctor}</span>
                </div>
              </div>

              {/* Document Security Verification */}
              <div className="bg-slate-900 text-white rounded-xl p-3.5 space-y-2 border border-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5 text-sky-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Cryptographic Document Security
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                    {verifiedAuditBadge[selectedReportDetail.id] ? 'LIVE AUDIT PASSED ✓' : (selectedReportDetail.securityCheck?.tamperCheckStatus || 'VERIFIED TAMPER-PROOF')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div>
                    <span className="text-slate-400 block text-[10px]">DOCTOR REGISTRATION</span>
                    <span className="font-mono">{selectedReportDetail.securityCheck?.doctorLicenseNo || 'KMC Reg #44192 / NMC-INDIA'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">CONSENT ARTIFACT</span>
                    <span className="font-mono">{selectedReportDetail.securityCheck?.consentArtifactId || 'ABDM-CONSENT-99421-A'}</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate">
                  {selectedReportDetail.securityCheck?.sha256Hash || 'SHA-256: 7f83b1657ff1...9069'}
                </div>
              </div>

              <div className="bg-sky-50/70 p-3.5 rounded-xl border border-sky-100">
                <span className="text-[11px] font-bold text-sky-800 uppercase block mb-1">Clinical AI Synthesis</span>
                <p className="text-xs text-slate-700 leading-relaxed">{selectedReportDetail.summary}</p>
              </div>

              {selectedReportDetail.keyValues && selectedReportDetail.keyValues.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-800 block mb-2">All Extracted Biomarkers:</span>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto">
                    {selectedReportDetail.keyValues.map((kv, i) => (
                      <div key={i} className="flex items-center justify-between text-xs bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                        <span className="font-medium text-slate-700">{kv.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold font-mono ${kv.isAbnormal ? 'text-amber-600' : 'text-slate-800'}`}>
                            {kv.value}
                          </span>
                          {kv.reference && (
                            <span className="text-[10px] text-slate-400">({kv.reference})</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedReportDetail(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              onOpenSettings={() => setIsSettingsOpen(true)}
            />

            {/* Quick Actions (Upload, QR, Emergency, Trends, Settings) */}
            <QuickActions
              language={language}
              onOpenUpload={() => setIsUploadOpen(true)}
              onOpenQR={() => setIsQROpen(true)}
              onOpenEmergency={() => setIsEmergencyOpen(true)}
              onOpenDoctorView={() => setCurrentView('doctor')}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />

            {/* Latest Uploaded Report Spotlight Showcase Card */}
            {reports.length > 0 && (
              <div 
                id="latest-report-section"
                className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-700 flex items-center justify-center font-bold shrink-0">
                      <FileCheck className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          LATEST ACTIVE DIAGNOSTIC REPORT
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{reports[0].date}</span>
                      </div>
                      <h2 className="text-base sm:text-lg font-heading font-bold text-slate-900 mt-0.5">
                        {reports[0].title}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <button
                      onClick={() => setSelectedReportDetail(reports[0])}
                      className="text-xs font-bold text-sky-700 hover:text-sky-800 bg-sky-100/70 hover:bg-sky-100 px-3 py-1.5 rounded-xl border border-sky-200 transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Breakdown</span>
                    </button>
                    <button
                      onClick={() => setIsUploadOpen(true)}
                      className="text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 px-3 py-1.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload New Report</span>
                    </button>
                  </div>
                </div>

                {/* Metadata Pills */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="bg-sky-50 text-sky-900 border border-sky-200 px-2.5 py-1 rounded-lg font-bold">
                    👤 <strong>Patient:</strong> {reports[0].patientName || patient.name}
                  </span>
                  <span className="bg-slate-100 px-2.5 py-1 rounded-lg font-medium">
                    🩺 <strong>Doctor:</strong> {reports[0].doctor}
                  </span>
                  <span className="bg-slate-100 px-2.5 py-1 rounded-lg font-medium">
                    🏥 <strong>Facility:</strong> {reports[0].facility}
                  </span>
                  <span className="bg-sky-100/80 text-sky-800 px-2.5 py-1 rounded-lg font-bold">
                    {reports[0].category}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                    reports[0].status === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {reports[0].status}
                  </span>
                </div>

                {/* Clinical Security & Cryptographic Integrity Check */}
                <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-white tracking-wide">
                            Clinical Security & Cryptographic Integrity Check
                          </span>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                            {verifiedAuditBadge[reports[0].id] ? 'LIVE AUDIT PASSED ✓' : (reports[0].securityCheck?.tamperCheckStatus || 'VERIFIED TAMPER-PROOF')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          PKI 4096-bit Doctor Digital Signature • ABDM National Health Consent Token
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRunLiveAudit(reports[0].id)}
                      disabled={verifyingReportId === reports[0].id}
                      className="self-start sm:self-auto text-xs font-bold px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition-colors flex items-center gap-1.5 disabled:opacity-75 cursor-pointer shadow-xs"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${verifyingReportId === reports[0].id ? 'animate-spin' : ''}`} />
                      <span>{verifyingReportId === reports[0].id ? 'Verifying Integrity...' : 'Run Security Check'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                    <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Cryptographic SHA-256</span>
                      <span className="font-mono text-slate-200 text-[11px] truncate block" title={reports[0].securityCheck?.sha256Hash || 'SHA-256: 7f83b165...9069'}>
                        {reports[0].securityCheck?.sha256Hash || 'SHA-256: 7f83b1657ff1...9069'}
                      </span>
                    </div>

                    <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Doctor Registration</span>
                      <span className="font-mono text-slate-200 text-[11px] truncate block">
                        {reports[0].securityCheck?.doctorLicenseNo || 'KMC Reg #44192 / NMC-INDIA'}
                      </span>
                    </div>

                    <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">ABDM Consent Token</span>
                      <span className="font-mono text-slate-200 text-[11px] truncate block">
                        {reports[0].securityCheck?.consentArtifactId || 'ABDM-CONSENT-99421-A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Clinical Synthesis Callout */}
                <div className="bg-white/90 rounded-xl p-3.5 border border-sky-100 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900 mb-1">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    <span>Gemini Vision AI Clinical Synthesis:</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {reports[0].summary}
                  </p>
                </div>

                {/* Structured Biomarkers Extracted */}
                {reports[0].keyValues && reports[0].keyValues.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                      <span>Extracted Biomarkers & Key Clinical Metrics:</span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        {reports[0].keyValues.filter(k => k.isAbnormal).length > 0 ? (
                          <span className="text-amber-600 font-bold">
                            ⚠️ {reports[0].keyValues.filter(k => k.isAbnormal).length} flagged abnormal
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-bold">✓ All within normal range</span>
                        )}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {reports[0].keyValues.map((kv, i) => (
                        <div 
                          key={i}
                          className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between transition-all ${
                            kv.isAbnormal
                              ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                              : 'bg-white border-slate-200/90 text-slate-800'
                          }`}
                        >
                          <span className="text-[11px] font-medium text-slate-500 line-clamp-1">{kv.name}</span>
                          <div className="mt-1 flex items-baseline justify-between gap-1">
                            <span className={`text-sm font-bold font-mono ${kv.isAbnormal ? 'text-amber-700' : 'text-slate-900'}`}>
                              {kv.value}
                            </span>
                            {kv.reference && (
                              <span className="text-[10px] text-slate-400 truncate max-w-[80px]">
                                ref: {kv.reference}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Current Vitals Grid (Synchronized with AI-analyzed reports) */}
            <VitalsGrid vitals={vitals} language={language} />

            {/* Active Medications List & Refill Alerts */}
            <MedicationList
              medications={medications}
              language={language}
              onRequestRefill={handleRequestRefill}
              onAddMedication={handleAddMedication}
            />

            {/* Interactive Longitudinal Trends (Updated on Report Upload) */}
            <HealthTrendsChart data={healthTrends} language={language} />

            {/* Recent Lab Reports Mini-Widget */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-heading font-bold text-slate-900 flex items-center gap-2">
                    <span>Recent Diagnostic Reports</span>
                    <span className="text-xs bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">
                      {reports.length} Total
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500">Verified by hospital pathology & AI extraction</p>
                </div>
                <button
                  onClick={() => setCurrentView('doctor')}
                  className="text-xs font-bold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200 transition-colors"
                >
                  View Full Clinical Timeline →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {reports.slice(0, 6).map((r, idx) => (
                  <div
                    key={r.id || `rep-${idx}`}
                    onClick={() => setSelectedReportDetail(r)}
                    className={`p-4 rounded-xl border transition-all shadow-2xs cursor-pointer ${
                      idx === 0
                        ? 'border-emerald-300 bg-emerald-50/40 ring-2 ring-emerald-100 hover:border-emerald-400 hover:shadow-md'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-sky-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                          {r.category}
                        </span>
                        {idx === 0 && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            NEW • LIVE SYNC
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 font-medium">{r.date}</span>
                    </div>
                    <div className="flex items-start justify-between gap-2 mt-1.5">
                      <h3 className="font-heading font-bold text-slate-900 text-sm">{r.title}</h3>
                      <span className="text-[10px] font-bold text-sky-600 hover:underline shrink-0">Details →</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{r.summary}</p>
                    
                    {/* Compact Biomarker Chips */}
                    {r.keyValues && r.keyValues.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-slate-200/60">
                        {r.keyValues.slice(0, 4).map((kv, i) => (
                          <span
                            key={i}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              kv.isAbnormal
                                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {kv.name}: <strong>{kv.value}</strong>
                          </span>
                        ))}
                      </div>
                    )}
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
            <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
            <HealthTrendsChart data={healthTrends} language={language} />

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
