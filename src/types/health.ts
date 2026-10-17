export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type LanguageCode = 'en' | 'hi' | 'kn' | 'ta';

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isPrimary: boolean;
}

export interface Medication {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  frequency: string;
  timing: 'Before Food' | 'After Food' | 'With Food' | 'Bedtime';
  prescribedBy: string;
  prescribedDate: string;
  pillsRemaining: number;
  totalPills: number;
  refillAlert: boolean;
  category: 'Cardiology' | 'Endocrinology' | 'General' | 'Antibiotic' | 'Respiratory';
  notes?: string;
  isTakenToday?: boolean;
}

export interface VitalMetric {
  id: string;
  name: string;
  value: string | number;
  unit: string;
  status: 'normal' | 'warning' | 'alert' | 'optimal';
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  lastRecorded: string;
}

export interface LabReport {
  id: string;
  title: string;
  date: string;
  category: 'Blood Work' | 'Cardiology' | 'Radiology' | 'Prescription' | 'Endocrinology';
  doctor: string;
  facility: string;
  fileType: 'PDF' | 'IMAGE';
  fileSize: string;
  summary: string;
  status: 'Verified' | 'Pending Review' | 'Flagged';
  keyValues: {
    name: string;
    value: string;
    reference: string;
    isAbnormal: boolean;
  }[];
  downloadUrl?: string;
}

export interface AccessLog {
  id: string;
  viewerName: string;
  role: string;
  hospital: string;
  timestamp: string;
  duration: string;
  accessType: 'Full Medical Record' | 'Emergency Info Only' | 'Lab Reports';
  ipLocation: string;
  status: 'Authorized' | 'Active Now';
}

export interface HealthTrendPoint {
  date: string;
  displayDate: string;
  sugarFasting: number;
  sugarPostPrandial: number;
  bpSystolic: number;
  bpDiastolic: number;
  cholesterolTotal: number;
  cholesterolLdl: number;
}

export interface Allergy {
  id: string;
  substance: string;
  severity: 'Severe' | 'Moderate' | 'Mild';
  reaction: string;
  category: 'Drug' | 'Food' | 'Environmental';
  contraindicatedDrugs: string[];
}

export interface PatientProfile {
  id: string;
  healthId: string; // e.g. ABHA ID: 91-4820-1942-8821
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  bloodGroup: BloodGroup;
  phone: string;
  email: string;
  address: string;
  organDonor: boolean;
  dnrStatus: boolean;
  chronicConditions: string[];
  allergies: Allergy[];
  emergencyContacts: EmergencyContact[];
  primaryPhysician: {
    name: string;
    specialty: string;
    hospital: string;
    phone: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    validThru: string;
  };
}
