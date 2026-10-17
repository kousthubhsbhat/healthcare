import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Smartphone, 
  ShieldCheck, 
  CheckCircle, 
  KeyRound, 
  Building2, 
  Stethoscope, 
  User, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  Lock,
  QrCode
} from 'lucide-react';
import { LanguageCode } from '../types/health';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  onLoginSuccess: (user: { name: string; email?: string; phone?: string; role: 'patient' | 'doctor'; abhaId?: string }) => void;
  showToast: (msg: string) => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  language,
  onLoginSuccess,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'google' | 'otp' | 'abha' | 'doctor'>('google');

  // Google State
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  // OTP State
  const [mobileNumber, setMobileNumber] = useState('98450 28192');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpError, setOtpError] = useState<string | null>(null);

  // ABHA State
  const [abhaId, setAbhaId] = useState('91-4820-1942-8821');
  const [abhaLoading, setAbhaLoading] = useState(false);

  // Doctor State
  const [doctorId, setDoctorId] = useState('DOC-KA-2819');
  const [doctorName, setDoctorName] = useState('Dr. Arvind Kumar, MD DM');
  const [hospitalName, setHospitalName] = useState('Apollo Specialty Hospitals - Bangalore');

  useEffect(() => {
    let interval: any = null;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  if (!isOpen) return null;

  // Google Login Handler
  const handleGoogleSignIn = (email: string, name: string) => {
    setGoogleLoading(true);
    setTimeout(() => {
      setGoogleLoading(false);
      onLoginSuccess({
        name,
        email,
        role: 'patient',
        abhaId: '91-4820-1942-8821'
      });
      showToast(`✅ Successfully signed in with Google (${email})`);
      onClose();
    }, 600);
  };

  // Send OTP
  const handleSendOtp = () => {
    const clean = mobileNumber.replace(/[^0-9]/g, '');
    if (clean.length < 10) {
      setOtpError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setOtpError(null);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCode(code);
    setOtpSent(true);
    setOtpTimer(45);
    showToast(`📱 SMS OTP Sent to +91 ${clean.slice(-10)}`);
  };

  // Verify OTP
  const handleVerifyOtp = () => {
    if (enteredOtp !== otpCode) {
      setOtpError('Invalid OTP code. Please enter the generated code.');
      return;
    }
    setOtpError(null);
    onLoginSuccess({
      name: 'Priya S. Sharma',
      phone: `+91 ${mobileNumber.slice(-10)}`,
      role: 'patient',
      abhaId: '91-4820-1942-8821'
    });
    showToast(`✅ Verified phone +91 ${mobileNumber.slice(-10)}. Signed in successfully!`);
    onClose();
  };

  // ABHA Login
  const handleAbhaLogin = () => {
    if (!abhaId.trim()) return;
    setAbhaLoading(true);
    setTimeout(() => {
      setAbhaLoading(false);
      onLoginSuccess({
        name: 'Priya S. Sharma',
        role: 'patient',
        abhaId: abhaId.trim()
      });
      showToast(`✅ Authenticated with National Health Authority ABHA ID: ${abhaId}`);
      onClose();
    }, 600);
  };

  // Doctor Clinician Login
  const handleDoctorLogin = () => {
    onLoginSuccess({
      name: doctorName,
      role: 'doctor',
      email: `${doctorId.toLowerCase()}@apollo.org`
    });
    showToast(`🩺 Doctor Session Authenticated: ${doctorName} (${doctorId})`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-heading font-bold text-slate-900">
                Sign In to Health Portal
              </h3>
              <p className="text-xs text-slate-500">Secure National Health Gateway & Patient Login</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-4 p-2 bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('google')}
            className={`py-2 text-center rounded-lg transition-colors flex flex-col items-center gap-1 ${
              activeTab === 'google' ? 'bg-white text-sky-700 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Google</span>
          </button>

          <button
            onClick={() => setActiveTab('otp')}
            className={`py-2 text-center rounded-lg transition-colors flex flex-col items-center gap-1 ${
              activeTab === 'otp' ? 'bg-white text-emerald-700 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile OTP</span>
          </button>

          <button
            onClick={() => setActiveTab('abha')}
            className={`py-2 text-center rounded-lg transition-colors flex flex-col items-center gap-1 ${
              activeTab === 'abha' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ABHA ID</span>
          </button>

          <button
            onClick={() => setActiveTab('doctor')}
            className={`py-2 text-center rounded-lg transition-colors flex flex-col items-center gap-1 ${
              activeTab === 'doctor' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Clinician</span>
          </button>
        </div>

        <div className="p-5 space-y-4">

          {/* TAB 1: GOOGLE 1-TAP LOGIN */}
          {activeTab === 'google' && (
            <div className="space-y-3.5">
              <p className="text-xs text-slate-600">
                Choose a verified patient or doctor account to sign in immediately:
              </p>

              <div className="space-y-2">
                {[
                  { name: 'Priya S. Sharma', email: 'priya.sharma@gmail.com', role: 'Patient (ABHA Verified)' },
                  { name: 'Kousthubh S. Bhat', email: 'kousthubh.bhat@gmail.com', role: 'Patient (Cardiology)' },
                  { name: 'Dr. Arvind Kumar', email: 'dr.arvind.kumar@apollo.org', role: 'Cardiology Specialist' }
                ].map((account, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleGoogleSignIn(account.email, account.name)}
                    className="w-full p-3 rounded-xl border border-slate-200 hover:border-sky-400 bg-white hover:bg-slate-50 transition-all flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                        {account.name[0]}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-sky-700">{account.name}</p>
                        <p className="text-[11px] text-slate-400">{account.email} • {account.role}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600" />
                  </button>
                ))}
              </div>

              {/* Custom Google Email */}
              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <input
                  type="email"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  placeholder="Or enter custom Google email..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-sky-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (googleEmail.includes('@')) {
                      handleGoogleSignIn(googleEmail, googleEmail.split('@')[0]);
                    }
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: MOBILE NUMBER & SMS OTP */}
          {activeTab === 'otp' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Enter Registered Mobile Number</label>
                <div className="flex gap-2">
                  <span className="px-3 py-2 text-xs font-bold bg-slate-100 rounded-xl border border-slate-200 text-slate-600 flex items-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="98450 28192"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono focus:outline-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shrink-0"
                  >
                    {otpSent ? 'Resend' : 'Send OTP'}
                  </button>
                </div>
              </div>

              {otpSent && otpCode && (
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs text-emerald-900 font-bold">
                    <span>Simulated SMS Received:</span>
                    <button
                      type="button"
                      onClick={() => setEnteredOtp(otpCode)}
                      className="text-[10px] bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded transition-colors"
                    >
                      Auto-fill: {otpCode}
                    </button>
                  </div>
                  <p className="text-xs text-emerald-800 font-mono bg-white p-2 rounded border border-emerald-200">
                    "PulseHealth OTP: Your verification code is <strong>{otpCode}</strong>."
                  </p>

                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder="••••••"
                      className="w-32 px-3 py-1.5 text-center text-sm font-mono font-bold rounded-lg border border-slate-300 bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="flex-1 px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                    >
                      Verify & Sign In
                    </button>
                  </div>
                </div>
              )}

              {otpError && (
                <p className="text-xs font-bold text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{otpError}</span>
                </p>
              )}
            </div>
          )}

          {/* TAB 3: ABHA NATIONAL HEALTH ID */}
          {activeTab === 'abha' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  14-Digit ABHA Indian National Health ID
                </label>
                <input
                  type="text"
                  value={abhaId}
                  onChange={(e) => setAbhaId(e.target.value)}
                  placeholder="91-4820-1942-8821"
                  className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 bg-white focus:outline-blue-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Federated authentication via National Health Authority (NHA / ABDM).
                </p>
              </div>

              <button
                type="button"
                onClick={handleAbhaLogin}
                disabled={abhaLoading}
                className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{abhaLoading ? 'Authenticating with NHA...' : 'Authenticate with ABHA ID'}</span>
              </button>
            </div>
          )}

          {/* TAB 4: CLINICIAN / DOCTOR EMR LOGIN */}
          {activeTab === 'doctor' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Full Name</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Medical Council Reg ID</label>
                <input
                  type="text"
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hospital / Clinic Affiliation</label>
                <input
                  type="text"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <button
                type="button"
                onClick={handleDoctorLogin}
                className="w-full py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Stethoscope className="w-4 h-4" />
                <span>Login as Attending Clinician</span>
              </button>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>256-Bit Encrypted PKI Security</span>
          </span>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 font-semibold"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
