from fastapi import APIRouter, Request, HTTPException, status
from datetime import datetime, timezone
from app.models.schemas import DoctorViewResponse
from app.services.qr_service import QRService
from app.services.supabase_service import supabase_service

router = APIRouter(prefix="/doctor-view", tags=["Doctor Clinical View"])

@router.get("/{token}", response_model=DoctorViewResponse)
async def get_doctor_clinical_view(token: str, request: Request):
    """
    Validates token, checks if it is expired (strict 24-hour expiration),
    logs the access event in the access_logs table (IP, timestamp, role),
    and returns the patient's timeline, medications, and health summaries.
    """
    client_ip = request.client.host if request.client else "127.0.0.1"

    # 1. Token validation & expiration check
    is_valid, error_msg, token_record = await QRService.validate_token(token)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=error_msg or "Invalid or expired access token."
        )

    patient_id = token_record.get("patient_id") if token_record else "pt-99421-bangalore"
    scope = token_record.get("scope", "Full") if token_record else "Full"

    # 2. Retrieve Patient Data
    patient = await supabase_service.get_patient_profile(patient_id)
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient record associated with this token was not found."
        )

    # 3. Retrieve Medications and Timeline Reports
    medications = await supabase_service.get_medications(patient_id)
    reports = await supabase_service.get_patient_reports(patient_id)

    # 4. Log Access Event in PostgreSQL access_logs
    await supabase_service.log_access_event(
        token=token,
        patient_id=patient_id,
        viewer_name="Dr. Consulting Clinician",
        role="Emergency / Hospital Staff",
        hospital="Verified Clinical Portal Session",
        access_type=f"Doctor View ({scope})",
        client_ip=client_ip
    )

    # 5. Extract active allergy alert messages
    active_alerts = []
    for allergy in patient.get("allergies", []):
        if allergy.get("severity") == "Severe":
            active_alerts.append(
                f"SEVERE ALLERGY WARNING: {allergy.get('substance')}. Contraindicated: {', '.join(allergy.get('contraindicatedDrugs', []))}"
            )

    return DoctorViewResponse(
        token=token,
        patient=patient,
        medications=medications,
        timelineReports=reports,
        activeAlerts=active_alerts,
        accessScope=scope,
        accessLoggedAt=datetime.now(timezone.utc)
    )
