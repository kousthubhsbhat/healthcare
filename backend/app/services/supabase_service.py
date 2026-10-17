import logging
import uuid
from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any, List
from supabase import create_client, Client
from app.config import settings

logger = logging.getLogger("supabase_service")

class SupabaseService:
    def __init__(self):
        self.client: Optional[Client] = None
        self._is_live_supabase = False
        
        # Try initializing live Supabase client if valid URL and Key provided
        if settings.SUPABASE_URL and settings.SUPABASE_KEY and not settings.SUPABASE_KEY.startswith("mock"):
            try:
                self.client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
                self._is_live_supabase = True
                logger.info(f"Connected to live Supabase project at {settings.SUPABASE_URL}")
            except Exception as e:
                logger.warning(f"Could not connect to live Supabase: {e}. Running with robust local medical store.")

        # Local in-memory repository store for resilient offline/development execution
        self._init_local_store()

    def _init_local_store(self):
        """Initializes default patient data, active medications, and access logs."""
        self.patient_id = "pt-99421-bangalore"
        self.patients: Dict[str, Dict[str, Any]] = {
            self.patient_id: {
                "id": self.patient_id,
                "name": "Rajesh V. Kumar",
                "healthId": "91-4820-1942-8821",
                "age": 44,
                "gender": "Male",
                "dob": "1982-05-14",
                "bloodGroup": "B+",
                "phone": "+91 98450 28192",
                "email": "rajesh.kumar@healthconnect.in",
                "address": "Indiranagar 12th Main, Bangalore, Karnataka - 560038",
                "organDonor": True,
                "dnrStatus": False,
                "chronicConditions": [
                    "Type 2 Diabetes Mellitus (Controlled)",
                    "Essential Hypertension (Stage 1)",
                    "Mild Hyperlipidemia"
                ],
                "allergies": [
                    {
                        "id": "alg-1",
                        "substance": "Penicillin & Amoxicillin",
                        "severity": "Severe",
                        "reaction": "Anaphylaxis, severe broncho-spasm, and angioedema",
                        "category": "Drug",
                        "contraindicatedDrugs": ["Amoxicillin", "Ampicillin", "Augmentin", "Piperacillin", "Cefuroxime"]
                    },
                    {
                        "id": "alg-2",
                        "substance": "Sulfa Drugs / Sulfonamides",
                        "severity": "Moderate",
                        "reaction": "Severe urticaria, cutaneous rash, and facial flushing",
                        "category": "Drug",
                        "contraindicatedDrugs": ["Sulfamethoxazole", "Bactrim", "Cotrimoxazole"]
                    }
                ],
                "emergencyContacts": [
                    {
                        "id": "ec-1",
                        "name": "Priya Rajesh Kumar",
                        "relation": "Spouse",
                        "phone": "+91 98451 90812",
                        "isPrimary": True
                    },
                    {
                        "id": "ec-2",
                        "name": "Dr. Arvind Kumar",
                        "relation": "Brother (Cardiologist)",
                        "phone": "+91 94480 33411",
                        "isPrimary": False
                    }
                ],
                "primaryPhysician": {
                    "name": "Dr. Ramesh N. Rao, MD",
                    "specialty": "Internal Medicine & Diabetology",
                    "hospital": "Manipal Hospital, HAL Airport Rd, Bangalore",
                    "phone": "+91 80 2502 4444"
                },
                "insurance": {
                    "provider": "Star Health & Allied Insurance",
                    "policyNumber": "SH-MED-99281-2026",
                    "validThru": "2027-12-31"
                },
                "createdAt": datetime.now(timezone.utc),
                "updatedAt": datetime.now(timezone.utc)
            }
        }

        self.medications: List[Dict[str, Any]] = [
            {
                "id": "med-1",
                "patientId": self.patient_id,
                "name": "Metformin HCl 500mg",
                "genericName": "Metformin Hydrochloride ER",
                "dosage": "500 mg",
                "frequency": "Twice daily",
                "timing": "After Food",
                "prescribedBy": "Dr. Ramesh N. Rao",
                "prescribedDate": "2026-01-10",
                "pillsRemaining": 4,
                "totalPills": 60,
                "refillAlert": True,
                "category": "Endocrinology",
                "isTakenToday": True
            },
            {
                "id": "med-2",
                "patientId": self.patient_id,
                "name": "Telmisartan 40mg",
                "genericName": "Telmisartan IP",
                "dosage": "40 mg",
                "frequency": "Once daily (Morning)",
                "timing": "Before Food",
                "prescribedBy": "Dr. Arvind Kumar",
                "prescribedDate": "2026-02-15",
                "pillsRemaining": 24,
                "totalPills": 30,
                "refillAlert": False,
                "category": "Cardiology",
                "isTakenToday": True
            },
            {
                "id": "med-3",
                "patientId": self.patient_id,
                "name": "Rosuvastatin 10mg",
                "genericName": "Rosuvastatin Calcium",
                "dosage": "10 mg",
                "frequency": "Once daily (Night)",
                "timing": "Bedtime",
                "prescribedBy": "Dr. Ramesh N. Rao",
                "prescribedDate": "2026-01-10",
                "pillsRemaining": 18,
                "totalPills": 30,
                "refillAlert": False,
                "category": "Cardiology",
                "isTakenToday": False
            }
        ]

        self.reports: Dict[str, Dict[str, Any]] = {
            "rep-01": {
                "id": "rep-01",
                "patientId": self.patient_id,
                "title": "Comprehensive Metabolic Panel & Glycated HbA1c",
                "category": "Blood Work",
                "doctor": "Dr. Ramesh N. Rao",
                "facility": "Manipal Diagnostic Lab - Bangalore",
                "filePath": "reports/rep-01-metabolic.pdf",
                "fileType": "PDF",
                "fileSize": "1.8 MB",
                "summary": "HbA1c lowered to 6.6%. Fasting blood glucose is 114 mg/dL. Kidney function eGFR > 90 ml/min (Normal).",
                "status": "Verified",
                "keyValues": [
                    {"name": "HbA1c Glycated Hemoglobin", "value": "6.6%", "reference": "< 5.7%", "isAbnormal": True},
                    {"name": "Fasting Plasma Glucose", "value": "114 mg/dL", "reference": "70 - 100 mg/dL", "isAbnormal": True},
                    {"name": "Serum Creatinine", "value": "0.92 mg/dL", "reference": "0.70 - 1.30 mg/dL", "isAbnormal": False}
                ],
                "createdAt": datetime.now(timezone.utc) - timedelta(days=5)
            }
        }

        self.access_tokens: Dict[str, Dict[str, Any]] = {}
        self.access_logs: List[Dict[str, Any]] = [
            {
                "id": "log-1",
                "token": "seed-token-1",
                "patientId": self.patient_id,
                "viewerName": "Dr. Arvind Kumar, MD DM",
                "role": "Consulting Cardiologist",
                "hospital": "Apollo Hospitals - Bangalore",
                "timestamp": "Today, 10:45 AM",
                "duration": "14 mins active",
                "accessType": "Full Medical Record",
                "ipLocation": "Bangalore Hospital VPN (10.42.1.8)",
                "status": "Active Now"
            }
        ]

    # --- Patient Profile Methods ---
    async def get_patient_profile(self, patient_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        pid = patient_id or self.patient_id
        if self._is_live_supabase and self.client:
            try:
                res = self.client.table("patients").select("*").eq("id", pid).execute()
                if res.data and len(res.data) > 0:
                    return res.data[0]
            except Exception as e:
                logger.error(f"Supabase get_patient_profile error: {e}")
        return self.patients.get(pid, self.patients.get(self.patient_id))

    async def upsert_patient_profile(self, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        pid = profile_data.get("id") or str(uuid.uuid4())
        profile_data["id"] = pid
        profile_data["updatedAt"] = datetime.now(timezone.utc)

        if self._is_live_supabase and self.client:
            try:
                self.client.table("patients").upsert(profile_data).execute()
            except Exception as e:
                logger.error(f"Supabase upsert_patient_profile error: {e}")

        self.patients[pid] = profile_data
        return profile_data

    # --- Report Upload & Management Methods ---
    async def upload_file_to_storage(self, file_bytes: bytes, filename: str) -> str:
        unique_name = f"{uuid.uuid4()}_{filename}"
        storage_path = f"reports/{unique_name}"

        if self._is_live_supabase and self.client:
            try:
                self.client.storage.from_(settings.SUPABASE_STORAGE_BUCKET).upload(
                    storage_path, file_bytes
                )
                logger.info(f"Uploaded file to Supabase Storage: {storage_path}")
            except Exception as e:
                logger.error(f"Supabase storage upload error: {e}")

        return storage_path

    async def create_report(self, report_data: Dict[str, Any]) -> Dict[str, Any]:
        rep_id = report_data.get("id") or f"rep-{uuid.uuid4().hex[:8]}"
        report_data["id"] = rep_id
        report_data["createdAt"] = datetime.now(timezone.utc)

        if self._is_live_supabase and self.client:
            try:
                self.client.table("reports").insert(report_data).execute()
            except Exception as e:
                logger.error(f"Supabase insert report error: {e}")

        self.reports[rep_id] = report_data
        return report_data

    async def get_report_by_id(self, report_id: str) -> Optional[Dict[str, Any]]:
        if self._is_live_supabase and self.client:
            try:
                res = self.client.table("reports").select("*").eq("id", report_id).execute()
                if res.data and len(res.data) > 0:
                    return res.data[0]
            except Exception as e:
                logger.error(f"Supabase get_report_by_id error: {e}")
        return self.reports.get(report_id)

    async def update_report(self, report_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if self._is_live_supabase and self.client:
            try:
                self.client.table("reports").update(update_data).eq("id", report_id).execute()
            except Exception as e:
                logger.error(f"Supabase update_report error: {e}")

        if report_id in self.reports:
            self.reports[report_id].update(update_data)
            return self.reports[report_id]
        return None

    async def get_patient_reports(self, patient_id: str) -> List[Dict[str, Any]]:
        if self._is_live_supabase and self.client:
            try:
                res = self.client.table("reports").select("*").eq("patient_id", patient_id).execute()
                if res.data:
                    return res.data
            except Exception as e:
                logger.error(f"Supabase get_patient_reports error: {e}")

        return [r for r in self.reports.values() if r.get("patientId") == patient_id or patient_id == self.patient_id]

    # --- Active Medications Methods ---
    async def get_medications(self, patient_id: str) -> List[Dict[str, Any]]:
        return [m for m in self.medications if m.get("patientId") == patient_id or patient_id == self.patient_id]

    # --- QR Access Token & Logging Methods ---
    async def create_access_token(self, token: str, patient_id: str, scope: str, expires_at: datetime, client_ip: str) -> Dict[str, Any]:
        token_entry = {
            "token": token,
            "patient_id": patient_id,
            "scope": scope,
            "expires_at": expires_at,
            "created_at": datetime.now(timezone.utc),
            "is_revoked": False,
            "created_by_ip": client_ip
        }

        if self._is_live_supabase and self.client:
            try:
                self.client.table("access_tokens").insert(token_entry).execute()
            except Exception as e:
                logger.error(f"Supabase create_access_token error: {e}")

        self.access_tokens[token] = token_entry
        return token_entry

    async def get_access_token(self, token: str) -> Optional[Dict[str, Any]]:
        if self._is_live_supabase and self.client:
            try:
                res = self.client.table("access_tokens").select("*").eq("token", token).execute()
                if res.data and len(res.data) > 0:
                    return res.data[0]
            except Exception as e:
                logger.error(f"Supabase get_access_token error: {e}")
        return self.access_tokens.get(token)

    async def log_access_event(self, token: str, patient_id: str, viewer_name: str, role: str, hospital: str, access_type: str, client_ip: str):
        log_entry = {
            "id": f"log-{uuid.uuid4().hex[:6]}",
            "token": token,
            "patientId": patient_id,
            "viewerName": viewer_name,
            "role": role,
            "hospital": hospital,
            "timestamp": datetime.now(timezone.utc).strftime("%d %b %Y, %I:%M %p"),
            "duration": "Just accessed",
            "accessType": access_type,
            "ipLocation": client_ip,
            "status": "Authorized"
        }

        if self._is_live_supabase and self.client:
            try:
                self.client.table("access_logs").insert(log_entry).execute()
            except Exception as e:
                logger.error(f"Supabase log_access_event error: {e}")

        self.access_logs.insert(0, log_entry)
        return log_entry

    async def get_access_logs(self, patient_id: str) -> List[Dict[str, Any]]:
        return self.access_logs

# Singleton instance
supabase_service = SupabaseService()
