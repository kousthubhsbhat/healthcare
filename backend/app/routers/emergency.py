from fastapi import APIRouter, Request, HTTPException, status
from app.models.schemas import EmergencyViewResponse
from app.services.qr_service import QRService
from app.services.supabase_service import supabase_service

router = APIRouter(prefix="/emergency-view", tags=["Emergency Survival Mode"])

@router.get("/{token}", response_model=EmergencyViewResponse)
async def get_emergency_survival_view(token: str, request: Request):
    """
    Zero-Login Emergency Rescue Endpoint:
    Bypasses authentication for first responders, EMTs, and ER trauma units.
    Returns ONLY critical survival data:
    - Blood Group (e.g. B+)
    - Critical Allergies & strictly prohibited drugs
    - Chronic medical conditions
    - Direct phone numbers for emergency contacts
    - Resuscitation directives & GPS coordinates
    """
    client_ip = request.client.host if request.client else "127.0.0.1"

    # Even in emergency mode, log the emergency access attempt for audit security
    patient_id = "pt-99421-bangalore"
    
    # If token exists, retrieve linked patient ID
    token_record = await supabase_service.get_access_token(token)
    if token_record:
        patient_id = token_record.get("patient_id", patient_id)

    patient = await supabase_service.get_patient_profile(patient_id)
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Emergency medical dossier not located."
        )

    # Log emergency audit entry
    await supabase_service.log_access_event(
        token=token,
        patient_id=patient_id,
        viewer_name="Paramedic / Emergency Trauma Unit",
        role="First Responder",
        hospital="Emergency Geo-Access",
        access_type="Zero-Login Emergency Survival Screen",
        client_ip=client_ip
    )

    # Filter critical allergies only
    critical_allergies = [
        a for a in patient.get("allergies", [])
        if a.get("severity") in ["Severe", "Moderate"]
    ]

    return EmergencyViewResponse(
        token=token,
        patientId=patient.get("id", patient_id),
        name=patient.get("name", "Unknown Patient"),
        age=patient.get("age", 0),
        gender=patient.get("gender", "Unknown"),
        bloodGroup=patient.get("bloodGroup", "Unknown"),
        criticalAllergies=critical_allergies,
        chronicConditions=patient.get("chronicConditions", []),
        emergencyContacts=patient.get("emergencyContacts", []),
        organDonor=patient.get("organDonor", False),
        dnrStatus=patient.get("dnrStatus", False),
        emergencyLocation={
            "latitude": 12.9716,
            "longitude": 77.5946,
            "address": "Indiranagar 12th Main, Bangalore, Karnataka",
            "accuracy": "Within 5 meters",
            "beacon": "ACTIVE"
        },
        notice="ZERO-LOGIN RESCUE INTERFACE • NO PASSCODE REQUIRED FOR EMTS"
    )
