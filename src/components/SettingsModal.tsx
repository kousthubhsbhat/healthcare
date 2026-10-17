import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Users, 
  Phone, 
  Mail, 
  ShieldCheck, 
  CheckCircle, 
  CheckCircle2, 
  Smartphone, 
  KeyRound, 
  Globe, 
  Lock, 
  Plus, 
  ArrowRight, 
  RefreshCw, 
  Sparkles, 
  AlertCircle,
  ExternalLink,
  Shield,
  Heart
} from 'lucide-react';
import { UserAccount, LanguageCode, BloodGroup, PatientProfile } from '../types/health';
import { translations } from '../data/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  accounts: UserAccount[];
  activeAccountId: string;
  onSwitchAccount: (account: UserAccount) => void;
  onAddAccount: (newAccount: UserAccount) => void;
  onUpdateAccount: (updatedAccount: UserAccount) => void;
  showToast: (msg: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  accounts,
  activeAccountId,
  onSwitchAccount,
  onAddAccount,
  onUpdateAccount,
  showToast,
}) => {
  const t = translations[language];

  // Active tab inside settings
  const [activeTab, setActiveTab] = useState<'accounts' | 'google' | 'otp' | 'preferences'>('accounts');

  // Add Family Member form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelationship, setNewRelationship] = useState<'Spouse' | 'Child' | 'Parent' | 'Other'>('Spouse');
  const [newAge, setNewAge] = useState(30);
  const [newGender, setNewGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [newBloodGroup, setNewBloodGroup] = useState<BloodGroup>('O+');
  const [newPhone, setNewPhone] = useState('+91 ');
  const [newConditions, setNewConditions] = useState('');

  // Mobile + OTP Login State
  const [mobileNumber, setMobileNumber] = useState('98450 28192');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccess, setOtpSuccess] = useState(false);

  // Google Login State
  const [googleLoading, setGoogleLoading] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [showGooglePicker, setShowGooglePicker] = useState(false);

  // Gemini API Key State
  const [apiKeyInput, setApiKeyInput] = useState(() => {
    try {
      return localStorage.getItem('pulsehealth_gemini_api_key') || '';
    } catch {
      return '';
    }
  });

  // Timer countdown for OTP
  useEffect(() => {
    let interval: any = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  if (!isOpen) return null;

  const currentActiveAccount = accounts.find((a) => a.id === activeAccountId) || accounts[0];

  // Handle OTP Generation
  const handleSendOtp = () => {
    const cleanNumber = mobileNumber.replace(/[^0-9]/g, '');
    if (cleanNumber.length < 10) {
      setOtpError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setOtpError(null);
    // Generate realistic 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    setOtpTimer(45);
    setOtpSuccess(false);
    showToast(`📱 SMS OTP Sent to +91 ${cleanNumber.slice(-10)}`);
  };

  // Handle OTP Verification
  const handleVerifyOtp = () => {
    if (!enteredOtp || enteredOtp.trim() !== generatedOtp) {
      setOtpError('Invalid OTP code. Please enter the exact 6-digit code received.');
      return;
    }
    setOtpError(null);
    setOtpSuccess(true);

    // Update active account with phone verification
    if (currentActiveAccount) {
      const updated = {
        ...currentActiveAccount,
        phone: `+91 ${mobileNumber.replace(/[^0-9]/g, '').slice(-10)}`,
        phoneVerified: true,
      };
      onUpdateAccount(updated);
    }

    showToast(`✅ Phone +91 ${mobileNumber.slice(-10)} verified & logged in successfully!`);
    setTimeout(() => {
      setOtpSuccess(false);
      setActiveTab('accounts');
    }, 1200);
  };

  // Handle Google Login Simulation
  const handleGoogleLogin = (email: string, displayName?: string) => {
    setGoogleLoading(true);
    setTimeout(() => {
      setGoogleLoading(false);
      setShowGooglePicker(false);

      if (currentActiveAccount) {
        const updated: UserAccount = {
          ...currentActiveAccount,
          googleConnected: true,
          googleEmail: email,
          name: displayName || currentActiveAccount.name,
        };
        onUpdateAccount(updated);
      }

      showToast(`✅ Connected Google Account: ${email}`);
    }, 600);
  };

  // Handle Add Family Member
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const randomAbha = `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newId = `acc-${Date.now()}`;

    const newPatientProfile: PatientProfile = {
      ...currentActiveAccount.patientData,
      id: `PT-${Date.now().toString().slice(-5)}`,
      healthId: randomAbha,
      name: newName.trim(),
      age: Number(newAge),
      gender: newGender,
      dob: `15 Jan ${new Date().getFullYear() - Number(newAge)}`,
      bloodGroup: newBloodGroup,
      phone: newPhone || currentActiveAccount.phone,
      email: `${newName.toLowerCase().replace(/[^a-z]/g, '')}@healthconnect.in`,
      chronicConditions: newConditions ? newConditions.split(',').map((c) => c.trim()) : ['Healthy • No active conditions'],
      allergies: [],
    };

    const newAccountObj: UserAccount = {
      id: newId,
      name: newName.trim(),
      relationship: newRelationship,
      abhaId: randomAbha,
      phone: newPhone || currentActiveAccount.phone,
      email: `${newName.toLowerCase().replace(/[^a-z]/g, '')}@healthconnect.in`,
      bloodGroup: newBloodGroup,
      gender: newGender,
      age: Number(newAge),
      googleConnected: false,
      phoneVerified: true,
      patientData: newPatientProfile,
      vitals: [
        { id: `v-${Date.now()}-1`, name: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'optimal', change: 'Normal healthy baseline', changeType: 'neutral', lastRecorded: 'Today' },
        { id: `v-${Date.now()}-2`, name: 'Fasting Blood Sugar', value: 94, unit: 'mg/dL', status: 'optimal', change: 'Optimal glycemic range', changeType: 'neutral', lastRecorded: 'Today' },
        { id: `v-${Date.now()}-3`, name: 'Heart Rate', value: 74, unit: 'bpm', status: 'optimal', change: 'Normal sinus rhythm', changeType: 'neutral', lastRecorded: 'Today' },
        { id: `v-${Date.now()}-4`, name: 'SpO2 Oxygen', value: 99, unit: '%', status: 'optimal', change: 'Normal room air', changeType: 'neutral', lastRecorded: 'Today' },
      ],
      medications: [],
      reports: [],
      trends: [
        { date: '2026-07', displayDate: 'Jul', sugarFasting: 92, sugarPostPrandial: 118, bpSystolic: 118, bpDiastolic: 76, cholesterolTotal: 168, cholesterolLdl: 90 },
        { date: '2026-09', displayDate: 'Sep', sugarFasting: 95, sugarPostPrandial: 122, bpSystolic: 120, bpDiastolic: 78, cholesterolTotal: 172, cholesterolLdl: 92 },
        { date: '2026-10', displayDate: 'Oct', sugarFasting: 94, sugarPostPrandial: 120, bpSystolic: 120, bpDiastolic: 80, cholesterolTotal: 170, cholesterolLdl: 90 },
      ],
    };

    onAddAccount(newAccountObj);
    onSwitchAccount(newAccountObj);
    setShowAddForm(false);
    setNewName('');
    setNewConditions('');
    showToast(`🎉 New account added & activated for ${newAccountObj.name} (${newRelationship})!`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-md shadow-sky-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-heading font-bold text-slate-900">
                  Account & Settings
                </h2>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                  ABHA Gateway Linked
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Manage accounts, Google login, OTP verification, and family profiles
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-4 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('accounts')}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'accounts'
                ? 'border-sky-600 text-sky-700 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-sky-600" />
            <span>Accounts & Family ({accounts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('google')}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'google'
                ? 'border-sky-600 text-sky-700 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Google Account</span>
            {currentActiveAccount?.googleConnected && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('otp')}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'otp'
                ? 'border-sky-600 text-sky-700 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Mobile OTP Login</span>
            {currentActiveAccount?.phoneVerified && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'preferences'
                ? 'border-sky-600 text-sky-700 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4 text-slate-600" />
            <span>Preferences</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">

          {/* ================= TAB 1: ACCOUNTS & FAMILY ================= */}
          {activeTab === 'accounts' && (
            <div className="space-y-5">
              
              {/* Active Profile Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-sky-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-sky-600/20">
                    {currentActiveAccount.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-slate-900 text-base">
                        {currentActiveAccount.name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-200/80 text-sky-900">
                        {currentActiveAccount.relationship}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ACTIVE PROFILE
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      ABHA ID: <strong className="font-mono text-sky-800">{currentActiveAccount.abhaId}</strong> • Blood Group: <strong className="text-red-600">{currentActiveAccount.bloodGroup}</strong> • Age: {currentActiveAccount.age}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Switcher Header */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h3 className="text-sm font-heading font-bold text-slate-900">
                    Linked Profiles & Family Members
                  </h3>
                  <p className="text-xs text-slate-500">
                    Switch profiles to view individualized medical timelines, vitals & prescriptions.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold border border-sky-200 transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{showAddForm ? 'Cancel' : 'Add Account'}</span>
                </button>
              </div>

              {/* Add Account Inline Form */}
              {showAddForm && (
                <form
                  onSubmit={handleCreateAccount}
                  className="bg-slate-50 border border-slate-300/80 rounded-2xl p-4 sm:p-5 space-y-4 animate-in fade-in duration-200"
                >
                  <div className="flex items-center gap-2 text-slate-800 font-heading font-bold text-xs uppercase tracking-wider">
                    <Plus className="w-4 h-4 text-sky-600" />
                    <span>Register New Family Profile</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Meenakshi Devi"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-sky-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Relationship *</label>
                      <select
                        value={newRelationship}
                        onChange={(e: any) => setNewRelationship(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-sky-500 bg-white"
                      >
                        <option value="Spouse">Spouse</option>
                        <option value="Child">Child</option>
                        <option value="Parent">Parent</option>
                        <option value="Other">Other Family Member</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={newAge}
                        onChange={(e) => setNewAge(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-sky-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                      <select
                        value={newBloodGroup}
                        onChange={(e: any) => setNewBloodGroup(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-sky-500 bg-white"
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                      <select
                        value={newGender}
                        onChange={(e: any) => setNewGender(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-sky-500 bg-white"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Known Conditions (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Thyroid, Asthma, Hypertension"
                        value={newConditions}
                        onChange={(e) => setNewConditions(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-sky-500 bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md shadow-sky-500/20 transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Save & Switch to Profile</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Profiles List Cards */}
              <div className="space-y-2.5">
                {accounts.map((acc) => {
                  const isActive = acc.id === activeAccountId;
                  return (
                    <div
                      key={acc.id}
                      className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        isActive
                          ? 'border-sky-400 bg-sky-50/40 ring-2 ring-sky-100 shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isActive
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {acc.name.slice(0, 2).toUpperCase()}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-bold text-slate-900 text-sm">
                              {acc.name}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {acc.relationship}
                            </span>
                            {acc.googleConnected && (
                              <span title="Google Account Connected" className="inline-flex items-center text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                                Google
                              </span>
                            )}
                            {acc.phoneVerified && (
                              <span title="Phone OTP Verified" className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                OTP ✓
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            ABHA: <span className="font-mono">{acc.abhaId}</span> • Blood: <strong className="text-slate-700">{acc.bloodGroup}</strong> • Age: {acc.age}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {isActive ? (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Current Active</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              onSwitchAccount(acc);
                              showToast(`Switched active health profile to ${acc.name}!`);
                              onClose();
                            }}
                            className="text-xs font-bold text-sky-700 hover:text-white bg-sky-50 hover:bg-sky-600 border border-sky-200 px-3 py-1.5 rounded-xl transition-all shadow-2xs flex items-center gap-1"
                          >
                            <span>Switch Profile</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ================= TAB 2: GOOGLE ACCOUNT LOGIN ================= */}
          {activeTab === 'google' && (
            <div className="space-y-5">
              
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-slate-900 text-sm">
                        Google Single Sign-On (OAuth 2.0)
                      </h4>
                      <p className="text-xs text-slate-500">
                        Link your Google account to sync lab records across devices securely.
                      </p>
                    </div>
                  </div>

                  {currentActiveAccount?.googleConnected ? (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Connected</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      Not Linked
                    </span>
                  )}
                </div>

                {currentActiveAccount?.googleConnected && (
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-sky-600" />
                      <span className="font-semibold text-slate-800">
                        {currentActiveAccount.googleEmail || 'rajesh.kumar@gmail.com'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">Authenticated Token Active</span>
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-slate-700 block">
                    Choose or Switch Google Account:
                  </span>

                  {/* Quick Google Profiles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { email: 'rajesh.kumar@gmail.com', name: 'Rajesh V. Kumar (Primary)' },
                      { email: 'sunita.kumar84@gmail.com', name: 'Sunita Kumar' },
                      { email: 'dr.rajesh.health@gmail.com', name: 'Dr. Rajesh (Clinical)' },
                    ].map((g, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleGoogleLogin(g.email, g.name.split(' (')[0])}
                        disabled={googleLoading}
                        className="p-3 rounded-xl border border-slate-200 bg-white hover:border-sky-400 hover:bg-sky-50/40 text-left transition-all shadow-2xs group flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-sky-600 text-white font-bold text-[10px] flex items-center justify-center">
                            {g.name[0]}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 group-hover:text-sky-700">{g.name}</p>
                            <p className="text-[11px] text-slate-400">{g.email}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 transition-colors" />
                      </button>
                    ))}
                  </div>

                  {/* Custom Gmail Input */}
                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Or Sign In with Any Other Google Account:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="your.name@gmail.com"
                        value={customGoogleEmail}
                        onChange={(e) => setCustomGoogleEmail(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-sky-500 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customGoogleEmail.includes('@')) {
                            handleGoogleLogin(customGoogleEmail);
                            setCustomGoogleEmail('');
                          } else {
                            showToast('Please enter a valid Google email address');
                          }
                        }}
                        disabled={googleLoading}
                        className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shrink-0 shadow-xs flex items-center gap-1.5"
                      >
                        {googleLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                        <span>Continue</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ================= TAB 3: MOBILE NUMBER & OTP LOGIN ================= */}
          {activeTab === 'otp' && (
            <div className="space-y-5">
              
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-slate-900 text-sm">
                      National Health Portal Mobile & OTP Login
                    </h4>
                    <p className="text-xs text-slate-500">
                      Two-factor verified authentication linked directly to Indian ABHA records.
                    </p>
                  </div>
                </div>

                {/* Mobile Input Row */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Enter Registered Mobile Number (India +91)
                  </label>
                  <div className="flex gap-2">
                    <span className="px-3 py-2 text-xs font-bold text-slate-600 bg-slate-200 rounded-xl flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={14}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="98450 XXXXX"
                      className="flex-1 px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-300 focus:outline-sky-500 bg-white tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpTimer > 0}
                      className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 disabled:bg-slate-400 rounded-xl transition-colors shrink-0 shadow-xs flex items-center gap-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>{otpTimer > 0 ? `Resend (${otpTimer}s)` : 'Send OTP'}</span>
                    </button>
                  </div>
                </div>

                {/* Simulated SMS Alert Box with instant 1-click test button */}
                {otpSent && generatedOtp && (
                  <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Simulated SMS Gateway Received:</span>
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                        Live Simulation
                      </span>
                    </div>

                    <p className="text-xs text-emerald-800 bg-white/80 p-2.5 rounded-lg border border-emerald-200 font-mono">
                      "PulseHealth Auth: Your one-time verification passcode is <strong className="text-emerald-900 font-black text-sm">{generatedOtp}</strong>. Valid for 10 minutes. Do not share."
                    </p>

                    <button
                      type="button"
                      onClick={() => setEnteredOtp(generatedOtp)}
                      className="text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-700" />
                      <span>Auto-fill OTP ({generatedOtp})</span>
                    </button>
                  </div>
                )}

                {/* OTP Entry Box */}
                {otpSent && (
                  <div className="space-y-3 pt-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Enter 6-Digit Verification Code
                    </label>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="••••••"
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-44 px-3 py-2 text-center text-lg font-mono font-black tracking-widest rounded-xl border border-slate-300 focus:outline-emerald-500 bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify & Sign In</span>
                      </button>
                    </div>

                    {otpError && (
                      <p className="text-xs font-bold text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{otpError}</span>
                      </p>
                    )}

                    {otpSuccess && (
                      <div className="p-3 bg-emerald-100/90 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-700" />
                        <span>Passcode verified! Authenticating patient session...</span>
                      </div>
                    )}
                  </div>
                )}

              </div>

            </div>
          )}

          {/* ================= TAB 4: PREFERENCES ================= */}
          {activeTab === 'preferences' && (
            <div className="space-y-4">
              
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <h4 className="font-heading font-bold text-slate-900 text-sm">
                  Language & Speech Settings
                </h4>
                
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-800">Interface Language</p>
                    <p className="text-slate-500">Multilingual audio and dashboard translations</p>
                  </div>

                  <select
                    value={language}
                    onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 cursor-pointer"
                  >
                    <option value="en">English (India)</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="kn">ಕನ್ನಡ (Kannada)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    <span>Gemini Vision AI Engine</span>
                  </h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    apiKeyInput.startsWith('AIza')
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-sky-100 text-sky-800'
                  }`}>
                    {apiKeyInput.startsWith('AIza') ? 'Custom API Key Connected' : 'Clinical Medical Engine (Built-in)'}
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  By default, documents are analyzed with high accuracy using our built-in Clinical Medical Knowledge Engine. You can optionally connect a Google AI Studio API key.
                </p>

                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="AIzaSy... (Optional Google AI Studio Key)"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-sky-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (apiKeyInput.trim()) {
                        localStorage.setItem('pulsehealth_gemini_api_key', apiKeyInput.trim());
                        showToast('✅ Google Gemini API Key saved for vision OCR analysis!');
                      } else {
                        localStorage.removeItem('pulsehealth_gemini_api_key');
                        showToast('Switched to built-in Clinical Medical Knowledge Engine.');
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <h4 className="font-heading font-bold text-slate-900 text-sm">
                  ABHA & National Health Gateway Security
                </h4>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-800">256-Bit Cryptographic Vault</p>
                    <p className="text-slate-500">Patient consent mandated for all emergency QR access</p>
                  </div>
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Active</span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                  <div>
                    <p className="font-semibold text-slate-800">Zero-Login Emergency SOS Mode</p>
                    <p className="text-slate-500">High-contrast instant screen for first responders</p>
                  </div>
                  <span className="font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">Enabled</span>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50/50">
          <p className="text-[11px] text-slate-400">
            Active: <strong>{currentActiveAccount.name}</strong> ({currentActiveAccount.relationship})
          </p>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
