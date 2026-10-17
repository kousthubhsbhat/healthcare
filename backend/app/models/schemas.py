from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime, date
import uuid

class BloodGroup(str, Enum):
    A_POS = "A+"
    A_NEG = "A-"
    B_POS = "B+"
    B_NEG = "B-"
    AB_POS = "AB+"
    AB_NEG = "AB-"
    O_POS = "O+"
    O_NEG = "O-"

class AccessScope(str, Enum):
    FULL = "Full"
    LABS = "Labs"
    EMERGENCY = "Emergency"

class EmergencyContact(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    relation: str
    phone: str
    isPrimary: bool = False

class Allergy(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    substance: str
    severity: str = "Severe" # 'Severe', 'Moderate', 'Mild'
    reaction: str
    category: str = "Drug" # 'Drug', 'Food', 'Environmental'
    contraindicatedDrugs: List[str] = []

class PrimaryPhysician(BaseModel):
    name: str
    specialty: str
    hospital: str
    phone: str

class Insurance(BaseModel):
    provider: str
    policyNumber: str
    validThru: str

class PatientProfileCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    healthId: str = Field(..., description="ABHA ID e.g. 91-4820-1942-8821")
    age: int = Field(..., ge=0, le=130)
    gender: str
    dob: str
    bloodGroup: BloodGroup
    phone: str
    email: Optional[str] = None
    address: Optional[str] = None
    organDonor: bool = False
    dnrStatus: bool = False
    chronicConditions: List[str] = []
    allergies: List[Allergy] = []
    emergencyContacts: List[EmergencyContact] = []
    primaryPhysician: Optional[PrimaryPhysician] = None
    insurance: Optional[Insurance] = None

class PatientProfileResponse(PatientProfileCreate):
    id: str
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

class MedicationSchema(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    patientId: Optional[str] = None
    name: str
    genericName: Optional[str] = None
    dosage: str
    frequency: str
    timing: str = "After Food"
    prescribedBy: str
    prescribedDate: str
    pillsRemaining: int
    totalPills: int
    refillAlert: bool = False
    category: str = "General"
    notes: Optional[str] = None
    isTakenToday: bool = False

class BiomarkerValue(BaseModel):
    name: str
    value: str
    reference: str
    isAbnormal: bool = False
    clinicalAlert: Optional[str] = None

class ReportUploadResponse(BaseModel):
    id: str
    patientId: str
    title: str
    category: str
    filePath: str
    fileType: str
    fileSize: str
    status: str
    createdAt: datetime

class ProcessReportRequest(BaseModel):
    language: str = "en" # 'en', 'hi', 'kn', 'ta'

class ProcessReportResponse(BaseModel):
    reportId: str
    title: str
    category: str
    dateExtracted: str
    rawExtractedText: str
    keyValues: List[BiomarkerValue]
    abnormalCount: int
    plainLanguageSummary: Dict[str, str] # localized summaries: en, hi, kn, ta
    contraindicationAlerts: List[str]
    status: str
    aiConfidence: float

class QRGenerateRequest(BaseModel):
    patientId: str
    scope: AccessScope = AccessScope.FULL

class QRGenerateResponse(BaseModel):
    token: str
    patientId: str
    scope: AccessScope
    createdAt: datetime
    expiresAt: datetime
    shareUrl: str
    hoursValid: int = 24

class AccessLogItem(BaseModel):
    id: str
    viewerName: str
    role: str
    hospital: str
    timestamp: str
    duration: str
    accessType: str
    ipLocation: str
    status: str

class DoctorViewResponse(BaseModel):
    token: str
    patient: PatientProfileResponse
    medications: List[MedicationSchema]
    timelineReports: List[Dict[str, Any]]
    activeAlerts: List[str]
    accessScope: str
    accessLoggedAt: datetime

class EmergencyViewResponse(BaseModel):
    token: str
    patientId: str
    name: str
    age: int
    gender: str
    bloodGroup: str
    criticalAllergies: List[Allergy]
    chronicConditions: List[str]
    emergencyContacts: List[EmergencyContact]
    organDonor: bool
    dnrStatus: bool
    emergencyLocation: Dict[str, Any]
    notice: str = "EMERGENCY ZERO-LOGIN RESCUE RECORD"
