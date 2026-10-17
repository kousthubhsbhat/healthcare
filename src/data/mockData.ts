import { PatientProfile, Medication, VitalMetric, LabReport, AccessLog, HealthTrendPoint, UserAccount } from '../types/health';

export const mockPatient: PatientProfile = {
  id: 'PT-99421',
  healthId: '91-4820-1942-8821', // ABHA Indian National Health ID format
  name: 'Rajesh V. Kumar',
  age: 44,
  gender: 'Male',
  dob: '14 May 1982',
  bloodGroup: 'B+',
  phone: '+91 98450 28192',
  email: 'rajesh.kumar@healthconnect.in',
  address: 'Indiranagar 12th Main, Bangalore, Karnataka - 560038',
  organDonor: true,
  dnrStatus: false,
  chronicConditions: ['Type 2 Diabetes Mellitus (Controlled)', 'Essential Hypertension (Stage 1)', 'Mild Hyperlipidemia'],
  allergies: [
    {
      id: 'alg-1',
      substance: 'Penicillin & Amoxicillin',
      severity: 'Severe',
      reaction: 'Anaphylaxis, severe broncho-spasm, and angioedema',
      category: 'Drug',
      contraindicatedDrugs: ['Amoxicillin', 'Ampicillin', 'Augmentin', 'Piperacillin', 'Cefuroxime (Cross-reactivity risk)'],
    },
    {
      id: 'alg-2',
      substance: 'Sulfa Drugs / Sulfonamides',
      severity: 'Moderate',
      reaction: 'Severe urticaria, cutaneous rash, and facial flushing',
      category: 'Drug',
      contraindicatedDrugs: ['Sulfamethoxazole', 'Bactrim', 'Cotrimoxazole'],
    },
    {
      id: 'alg-3',
      substance: 'Peanuts & Tree Nuts',
      severity: 'Severe',
      reaction: 'Throat tightness, acute hives',
      category: 'Food',
      contraindicatedDrugs: [],
    }
  ],
  emergencyContacts: [
    {
      id: 'ec-1',
      name: 'Priya Rajesh Kumar',
      relation: 'Spouse',
      phone: '+91 98451 90812',
      isPrimary: true,
    },
    {
      id: 'ec-2',
      name: 'Dr. Arvind Kumar',
      relation: 'Brother (Cardiologist)',
      phone: '+91 94480 33411',
      isPrimary: false,
    }
  ],
  primaryPhysician: {
    name: 'Dr. Ramesh N. Rao, MD (Int. Med)',
    specialty: 'Internal Medicine & Diabetology',
    hospital: 'Manipal Hospital, HAL Airport Rd, Bangalore',
    phone: '+91 80 2502 4444',
  },
  insurance: {
    provider: 'Star Health & Allied Insurance',
    policyNumber: 'SH-MED-99281-2026',
    validThru: '31 Dec 2027',
  }
};

export const mockMedications: Medication[] = [
  {
    id: 'med-1',
    name: 'Metformin HCl 500mg',
    genericName: 'Metformin Hydrochloride (Extended Release)',
    dosage: '500 mg',
    frequency: 'Twice daily',
    timing: 'After Food',
    prescribedBy: 'Dr. Ramesh N. Rao',
    prescribedDate: '10 Jan 2026',
    pillsRemaining: 4,
    totalPills: 60,
    refillAlert: true,
    category: 'Endocrinology',
    notes: 'Take with breakfast and dinner. Do not skip meals.',
    isTakenToday: true,
  },
  {
    id: 'med-2',
    name: 'Telmisartan 40mg',
    genericName: 'Telmisartan Tablets IP',
    dosage: '40 mg',
    frequency: 'Once daily (Morning)',
    timing: 'Before Food',
    prescribedBy: 'Dr. Arvind Kumar',
    prescribedDate: '15 Feb 2026',
    pillsRemaining: 24,
    totalPills: 30,
    refillAlert: false,
    category: 'Cardiology',
    notes: 'Monitor sitting blood pressure weekly.',
    isTakenToday: true,
  },
  {
    id: 'med-3',
    name: 'Rosuvastatin 10mg',
    genericName: 'Rosuvastatin Calcium',
    dosage: '10 mg',
    frequency: 'Once daily (Night)',
    timing: 'Bedtime',
    prescribedBy: 'Dr. Ramesh N. Rao',
    prescribedDate: '10 Jan 2026',
    pillsRemaining: 18,
    totalPills: 30,
    refillAlert: false,
    category: 'Cardiology',
    notes: 'Lipid control. Routine LFT test suggested in 3 months.',
    isTakenToday: false,
  },
  {
    id: 'med-4',
    name: 'Vitamin D3 Calcirol 60K',
    genericName: 'Cholecalciferol Capsule',
    dosage: '60,000 IU',
    frequency: 'Once weekly (Sundays)',
    timing: 'With Food',
    prescribedBy: 'Dr. Ramesh N. Rao',
    prescribedDate: '01 Feb 2026',
    pillsRemaining: 2,
    totalPills: 8,
    refillAlert: true,
    category: 'General',
    notes: 'Take with milk after morning breakfast.',
    isTakenToday: false,
  }
];

export const mockVitals: VitalMetric[] = [
  {
    id: 'vit-1',
    name: 'Blood Pressure',
    value: '128 / 82',
    unit: 'mmHg',
    status: 'optimal',
    change: '-4 mmHg from last week',
    changeType: 'down',
    lastRecorded: 'Today, 08:30 AM',
  },
  {
    id: 'vit-2',
    name: 'Fasting Blood Sugar',
    value: 114,
    unit: 'mg/dL',
    status: 'warning',
    change: '+6 mg/dL from avg',
    changeType: 'up',
    lastRecorded: 'Today, 07:15 AM',
  },
  {
    id: 'vit-3',
    name: 'Heart Rate (Resting)',
    value: 72,
    unit: 'bpm',
    status: 'normal',
    change: 'Stable in target zone',
    changeType: 'neutral',
    lastRecorded: 'Today, 08:30 AM',
  },
  {
    id: 'vit-4',
    name: 'Oxygen Saturation (SpO2)',
    value: 99,
    unit: '%',
    status: 'optimal',
    change: 'Normal respiratory function',
    changeType: 'neutral',
    lastRecorded: 'Today, 08:30 AM',
  }
];

export const mockHealthTrends: HealthTrendPoint[] = [
  {
    date: '2026-05',
    displayDate: 'May 26',
    sugarFasting: 138,
    sugarPostPrandial: 184,
    bpSystolic: 142,
    bpDiastolic: 92,
    cholesterolTotal: 228,
    cholesterolLdl: 146,
  },
  {
    date: '2026-06',
    displayDate: 'Jun 26',
    sugarFasting: 130,
    sugarPostPrandial: 172,
    bpSystolic: 138,
    bpDiastolic: 88,
    cholesterolTotal: 216,
    cholesterolLdl: 138,
  },
  {
    date: '2026-07',
    displayDate: 'Jul 26',
    sugarFasting: 124,
    sugarPostPrandial: 165,
    bpSystolic: 134,
    bpDiastolic: 86,
    cholesterolTotal: 204,
    cholesterolLdl: 126,
  },
  {
    date: '2026-08',
    displayDate: 'Aug 26',
    sugarFasting: 118,
    sugarPostPrandial: 154,
    bpSystolic: 130,
    bpDiastolic: 84,
    cholesterolTotal: 195,
    cholesterolLdl: 118,
  },
  {
    date: '2026-09',
    displayDate: 'Sep 26',
    sugarFasting: 112,
    sugarPostPrandial: 148,
    bpSystolic: 126,
    bpDiastolic: 82,
    cholesterolTotal: 188,
    cholesterolLdl: 110,
  },
  {
    date: '2026-10',
    displayDate: 'Oct 26 (Latest)',
    sugarFasting: 114,
    sugarPostPrandial: 150,
    bpSystolic: 128,
    bpDiastolic: 82,
    cholesterolTotal: 184,
    cholesterolLdl: 104,
  }
];

export const mockLabReports: LabReport[] = [
  {
    id: 'rep-01',
    title: 'Comprehensive Metabolic Panel & Glycated HbA1c',
    date: '12 Oct 2026',
    category: 'Blood Work',
    doctor: 'Dr. Ramesh N. Rao',
    facility: 'Manipal Diagnostic Lab - Bangalore',
    fileType: 'PDF',
    fileSize: '1.8 MB',
    summary: 'HbA1c lowered from 7.4% to 6.6%. Fasting blood glucose is 114 mg/dL. Kidney function eGFR > 90 ml/min/1.73m² (Normal).',
    status: 'Verified',
    keyValues: [
      { name: 'HbA1c Glycated Hemoglobin', value: '6.6%', reference: '< 5.7% Normal, 5.7-6.4% Prediabetes', isAbnormal: true },
      { name: 'Fasting Plasma Glucose', value: '114 mg/dL', reference: '70 - 100 mg/dL', isAbnormal: true },
      { name: 'Serum Creatinine', value: '0.92 mg/dL', reference: '0.70 - 1.30 mg/dL', isAbnormal: false },
      { name: 'eGFR', value: '98 mL/min', reference: '> 90 mL/min', isAbnormal: false },
    ]
  },
  {
    id: 'rep-02',
    title: 'Lipid Profile & Apolipoprotein Analysis',
    date: '28 Sep 2026',
    category: 'Endocrinology',
    doctor: 'Dr. Arvind Kumar',
    facility: 'Apollo Health City Diagnostics',
    fileType: 'PDF',
    fileSize: '1.2 MB',
    summary: 'Marked improvement on Rosuvastatin 10mg. Total cholesterol down to 184 mg/dL. LDL at 104 mg/dL. Triglycerides at 162 mg/dL.',
    status: 'Verified',
    keyValues: [
      { name: 'Total Cholesterol', value: '184 mg/dL', reference: '< 200 mg/dL Desirable', isAbnormal: false },
      { name: 'LDL Cholesterol', value: '104 mg/dL', reference: '< 100 mg/dL Optimal', isAbnormal: true },
      { name: 'HDL Good Cholesterol', value: '48 mg/dL', reference: '> 40 mg/dL Normal', isAbnormal: false },
      { name: 'Triglycerides', value: '162 mg/dL', reference: '< 150 mg/dL Normal', isAbnormal: true },
    ]
  },
  {
    id: 'rep-03',
    title: '12-Lead Electrocardiogram (ECG) & Echo Screening',
    date: '14 Aug 2026',
    category: 'Cardiology',
    doctor: 'Dr. Arvind Kumar',
    facility: 'Narayana Institute of Cardiac Sciences',
    fileType: 'PDF',
    fileSize: '3.4 MB',
    summary: 'Normal sinus rhythm, heart rate 74 bpm. Normal left ventricular ejection fraction (LVEF 62%). No regional wall motion abnormalities.',
    status: 'Verified',
    keyValues: [
      { name: 'LVEF Ejection Fraction', value: '62%', reference: '55% - 70% Normal', isAbnormal: false },
      { name: 'Resting Heart Rate', value: '74 bpm', reference: '60 - 100 bpm', isAbnormal: false },
      { name: 'PR Interval', value: '160 ms', reference: '120 - 200 ms Normal', isAbnormal: false },
    ]
  },
  {
    id: 'rep-04',
    title: 'High Resolution Chest Digital Radiograph (PA View)',
    date: '02 Jun 2026',
    category: 'Radiology',
    doctor: 'Dr. Sunita Sharma',
    facility: 'Columbia Asia Hospital',
    fileType: 'IMAGE',
    fileSize: '4.9 MB',
    summary: 'Clear bilateral lung fields. Normal cardiothoracic ratio. No infiltrates, consolidation, or pleural effusion detected.',
    status: 'Verified',
    keyValues: [
      { name: 'Cardiothoracic Ratio', value: '0.46', reference: '< 0.50 Normal', isAbnormal: false },
      { name: 'Costophrenic Angles', value: 'Sharp & Clear', reference: 'Normal', isAbnormal: false },
    ]
  },
  {
    id: 'rep-05',
    title: 'Clinical Consultation & Prescription Note',
    date: '10 May 2026',
    category: 'Prescription',
    doctor: 'Dr. Ramesh N. Rao',
    facility: 'Manipal Outpatient Clinic',
    fileType: 'PDF',
    fileSize: '650 KB',
    summary: 'Adjusted Metformin to 500mg ER twice daily. Advised 30 min brisk walk daily. Warned against beta-lactam antibiotics due to Penicillin allergy.',
    status: 'Verified',
    keyValues: [
      { name: 'Rx Added', value: 'Metformin 500mg ER', reference: 'B.I.D', isAbnormal: false },
      { name: 'Diet Plan', value: 'Low Glycemic Index', reference: 'Compliant', isAbnormal: false },
    ]
  }
];

export const mockAccessLogs: AccessLog[] = [
  {
    id: 'log-101',
    viewerName: 'Dr. Arvind Kumar, MD DM',
    role: 'Consulting Cardiologist',
    hospital: 'Apollo Hospitals - Jayanagar',
    timestamp: 'Today, 10:45 AM',
    duration: '14 mins active',
    accessType: 'Full Medical Record',
    ipLocation: 'Bangalore, KA (Hospital VPN IP 10.42.1.8)',
    status: 'Active Now',
  },
  {
    id: 'log-102',
    viewerName: 'EMT Officer S. Nanjappa',
    role: 'Emergency Response Squad #108',
    hospital: 'Bangalore Emergency Services Command',
    timestamp: 'Yesterday, 11:20 PM',
    duration: '3 mins scan',
    accessType: 'Emergency Info Only',
    ipLocation: 'GPS Geo-Fence: MG Road Station',
    status: 'Authorized',
  },
  {
    id: 'log-103',
    viewerName: 'Apollo 24/7 E-Pharmacy Hub',
    role: 'Licensed Pharmacist (K. Meenakshi)',
    hospital: 'Indiranagar Apollo Pharmacy Branch',
    timestamp: '15 Oct 2026, 04:15 PM',
    duration: '2 mins verification',
    accessType: 'Lab Reports',
    ipLocation: 'Bangalore Urban, KA',
    status: 'Authorized',
  },
  {
    id: 'log-104',
    viewerName: 'Dr. Ramesh N. Rao',
    role: 'Primary Diabetologist',
    hospital: 'Manipal Hospital HAL Clinic',
    timestamp: '12 Oct 2026, 09:30 AM',
    duration: '28 mins session',
    accessType: 'Full Medical Record',
    ipLocation: 'Manipal Hospital Intranet',
    status: 'Authorized',
  }
];

export const mockAccounts: UserAccount[] = [
  {
    id: 'acc-1',
    name: 'Rajesh V. Kumar',
    relationship: 'Self',
    abhaId: '91-4820-1942-8821',
    phone: '+91 98450 28192',
    email: 'rajesh.kumar@healthconnect.in',
    bloodGroup: 'B+',
    gender: 'Male',
    age: 44,
    googleConnected: true,
    googleEmail: 'rajesh.kumar@gmail.com',
    phoneVerified: true,
    patientData: mockPatient,
    vitals: mockVitals,
    medications: mockMedications,
    reports: mockLabReports,
    trends: mockHealthTrends
  },
  {
    id: 'acc-2',
    name: 'Sunita R. Kumar',
    relationship: 'Spouse',
    abhaId: '91-8842-9912-3301',
    phone: '+91 98451 90812',
    email: 'sunita.kumar84@gmail.com',
    bloodGroup: 'O+',
    gender: 'Female',
    age: 41,
    googleConnected: true,
    googleEmail: 'sunita.kumar84@gmail.com',
    phoneVerified: true,
    patientData: {
      ...mockPatient,
      id: 'PT-88412',
      name: 'Sunita R. Kumar',
      age: 41,
      gender: 'Female',
      dob: '22 Aug 1985',
      bloodGroup: 'O+',
      healthId: '91-8842-9912-3301',
      phone: '+91 98451 90812',
      email: 'sunita.kumar84@gmail.com',
      chronicConditions: ['Subclinical Hypothyroidism', 'Vitamin D Deficiency', 'Mild Cervical Spondylosis'],
      allergies: [
        {
          id: 'alg-sunita-1',
          substance: 'Ciprofloxacin (Fluoroquinolones)',
          severity: 'Severe',
          reaction: 'Tendon tenderness, severe skin rash, and nausea',
          category: 'Drug',
          contraindicatedDrugs: ['Ciprofloxacin', 'Levofloxacin', 'Ofloxacin']
        }
      ]
    },
    vitals: [
      { id: 'v-s-1', name: 'Blood Pressure', value: '118/76', unit: 'mmHg', status: 'optimal', change: 'Normal healthy range', changeType: 'neutral', lastRecorded: 'Today, 08:30 AM' },
      { id: 'v-s-2', name: 'Fasting Blood Glucose', value: 92, unit: 'mg/dL', status: 'optimal', change: 'Within ideal glycemic limits', changeType: 'down', lastRecorded: 'Yesterday' },
      { id: 'v-s-3', name: 'TSH (Thyroid Stimulating Hormone)', value: 4.8, unit: 'uIU/mL', status: 'warning', change: 'Elevated (Target < 4.0)', changeType: 'up', lastRecorded: '14 Oct 2026' },
      { id: 'v-s-4', name: 'Resting Heart Rate', value: 72, unit: 'bpm', status: 'optimal', change: 'Resting sinus rhythm', changeType: 'neutral', lastRecorded: 'Today, 08:30 AM' },
      { id: 'v-s-5', name: 'Vitamin D3 (25-OH)', value: 18.4, unit: 'ng/mL', status: 'alert', change: 'Deficient (< 20 ng/mL)', changeType: 'down', lastRecorded: '02 Oct 2026' }
    ],
    medications: [
      {
        id: 'med-s-1',
        name: 'Thyronorm 50 mcg',
        genericName: 'Levothyroxine Sodium IP',
        dosage: '50 mcg',
        frequency: 'Once daily (Empty stomach)',
        timing: 'Before Food',
        prescribedBy: 'Dr. Ramesh N. Rao',
        prescribedDate: '05 Sep 2026',
        pillsRemaining: 18,
        totalPills: 30,
        refillAlert: false,
        category: 'Endocrinology',
        isTakenToday: true
      },
      {
        id: 'med-s-2',
        name: 'Calcirol 60K Sachet',
        genericName: 'Cholecalciferol 60,000 IU',
        dosage: '60,000 IU',
        frequency: 'Once weekly on Sundays with milk',
        timing: 'After Food',
        prescribedBy: 'Dr. Ramesh N. Rao',
        prescribedDate: '02 Oct 2026',
        pillsRemaining: 3,
        totalPills: 8,
        refillAlert: false,
        category: 'General',
        isTakenToday: false
      }
    ],
    reports: [
      {
        id: 'rep-s-01',
        title: 'Thyroid Panel & Vitamin D3 Profile',
        date: '14 Oct 2026',
        category: 'Endocrinology',
        doctor: 'Dr. Ramesh N. Rao',
        facility: 'Apollo Clinic - Indiranagar',
        fileType: 'PDF',
        fileSize: '1.4 MB',
        summary: 'TSH mildly elevated at 4.8 uIU/mL. Free T3 and Free T4 within normal reference limits. Vitamin D3 requires 8-week weekly supplementation.',
        status: 'Verified',
        keyValues: [
          { name: 'TSH', value: '4.8 uIU/mL', reference: '0.4 - 4.2 uIU/mL', isAbnormal: true },
          { name: 'Free T4', value: '1.14 ng/dL', reference: '0.8 - 1.8 ng/dL', isAbnormal: false },
          { name: 'Vitamin D3', value: '18.4 ng/mL', reference: '30 - 100 ng/mL', isAbnormal: true }
        ]
      }
    ],
    trends: [
      { date: '2026-05', displayDate: 'May', sugarFasting: 95, sugarPostPrandial: 120, bpSystolic: 120, bpDiastolic: 78, cholesterolTotal: 172, cholesterolLdl: 94 },
      { date: '2026-07', displayDate: 'Jul', sugarFasting: 91, sugarPostPrandial: 118, bpSystolic: 116, bpDiastolic: 75, cholesterolTotal: 168, cholesterolLdl: 90 },
      { date: '2026-09', displayDate: 'Sep', sugarFasting: 94, sugarPostPrandial: 122, bpSystolic: 118, bpDiastolic: 76, cholesterolTotal: 170, cholesterolLdl: 92 },
      { date: '2026-10', displayDate: 'Oct', sugarFasting: 92, sugarPostPrandial: 119, bpSystolic: 118, bpDiastolic: 76, cholesterolTotal: 165, cholesterolLdl: 88 }
    ]
  },
  {
    id: 'acc-3',
    name: 'Aarav Kumar',
    relationship: 'Child',
    abhaId: '91-2291-7744-1299',
    phone: '+91 98450 28192',
    email: 'rajesh.kumar@healthconnect.in',
    bloodGroup: 'A+',
    gender: 'Male',
    age: 12,
    googleConnected: false,
    phoneVerified: true,
    patientData: {
      ...mockPatient,
      id: 'PT-22910',
      name: 'Aarav Kumar',
      age: 12,
      gender: 'Male',
      dob: '10 Nov 2014',
      bloodGroup: 'A+',
      healthId: '91-2291-7744-1299',
      chronicConditions: ['Mild Allergic Asthma (Cold/Dust Induced)', 'Seasonal Allergic Rhinitis'],
      allergies: [
        {
          id: 'alg-aarav-1',
          substance: 'House Dust Mite & Pollen',
          severity: 'Moderate',
          reaction: 'Sneezing, wheezing, and ocular pruritus',
          category: 'Environmental',
          contraindicatedDrugs: []
        }
      ]
    },
    vitals: [
      { id: 'v-a-1', name: 'Pulse / Heart Rate', value: 84, unit: 'bpm', status: 'optimal', change: 'Normal pediatric pulse', changeType: 'neutral', lastRecorded: 'Today, 09:00 AM' },
      { id: 'v-a-2', name: 'Blood Oxygen (SpO2)', value: 99, unit: '%', status: 'optimal', change: 'Normal pulmonary oxygenation', changeType: 'neutral', lastRecorded: 'Today, 09:00 AM' },
      { id: 'v-a-3', name: 'Body Temperature', value: 98.4, unit: '°F', status: 'optimal', change: 'Afebrile', changeType: 'neutral', lastRecorded: 'Today, 09:00 AM' },
      { id: 'v-a-4', name: 'Peak Expiratory Flow (PEF)', value: 380, unit: 'L/min', status: 'optimal', change: 'Green zone (> 80% predicted)', changeType: 'up', lastRecorded: '12 Oct 2026' }
    ],
    medications: [
      {
        id: 'med-a-1',
        name: 'Budecort 100 Inhaler',
        genericName: 'Budesonide Inhalation IP',
        dosage: '100 mcg',
        frequency: '1 puff bedtime with spacer',
        timing: 'Bedtime',
        prescribedBy: 'Dr. Geeta Shenoy (Pediatrician)',
        prescribedDate: '10 Aug 2026',
        pillsRemaining: 45,
        totalPills: 120,
        refillAlert: false,
        category: 'Respiratory',
        isTakenToday: true
      },
      {
        id: 'med-a-2',
        name: 'Montair LC Kid Syrup',
        genericName: 'Montelukast 4mg + Levocetirizine 2.5mg',
        dosage: '5 mL',
        frequency: 'Once daily at night (as needed during dust exposure)',
        timing: 'Bedtime',
        prescribedBy: 'Dr. Geeta Shenoy (Pediatrician)',
        prescribedDate: '10 Aug 2026',
        pillsRemaining: 15,
        totalPills: 60,
        refillAlert: false,
        category: 'Respiratory',
        isTakenToday: false
      }
    ],
    reports: [
      {
        id: 'rep-a-01',
        title: 'Pediatric Pulmonary Function & Allergy Panel',
        date: '20 Sep 2026',
        category: 'Blood Work',
        doctor: 'Dr. Geeta Shenoy',
        facility: 'Rainbow Children Hospital - Bangalore',
        fileType: 'PDF',
        fileSize: '1.1 MB',
        summary: 'Serum IgE levels elevated at 280 IU/mL confirming allergic diathesis. Lung spirometry shows excellent bronchodilator reversibility response.',
        status: 'Verified',
        keyValues: [
          { name: 'Total Serum IgE', value: '280 IU/mL', reference: '< 100 IU/mL', isAbnormal: true },
          { name: 'Absolute Eosinophil Count', value: '480 /mcL', reference: '40 - 450 /mcL', isAbnormal: true },
          { name: 'SpO2 Room Air', value: '99%', reference: '> 95%', isAbnormal: false }
        ]
      }
    ],
    trends: [
      { date: '2026-06', displayDate: 'Jun', sugarFasting: 84, sugarPostPrandial: 104, bpSystolic: 102, bpDiastolic: 64, cholesterolTotal: 140, cholesterolLdl: 72 },
      { date: '2026-08', displayDate: 'Aug', sugarFasting: 82, sugarPostPrandial: 102, bpSystolic: 100, bpDiastolic: 62, cholesterolTotal: 138, cholesterolLdl: 70 },
      { date: '2026-10', displayDate: 'Oct', sugarFasting: 85, sugarPostPrandial: 106, bpSystolic: 104, bpDiastolic: 65, cholesterolTotal: 142, cholesterolLdl: 74 }
    ]
  }
];
