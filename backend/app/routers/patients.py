from fastapi import APIRouter, HTTPException, Query, status
from typing import Optional
from app.models.schemas import PatientProfileCreate, PatientProfileResponse
from app.services.supabase_service import supabase_service

router = APIRouter(prefix="/patients", tags=["Patient Profile"])

@router.get("/profile", response_model=PatientProfileResponse)
async def get_patient_profile(patient_id: Optional[str] = Query(None, description="Patient UUID or ABHA ID")):
    """
    Retrieves the patient profile including Blood Group, Critical Allergies,
    Chronic Conditions, and Emergency Contacts.
    """
    profile = await supabase_service.get_patient_profile(patient_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient profile not found."
        )
    return profile

@router.post("/profile", response_model=PatientProfileResponse, status_code=status.HTTP_201_CREATED)
async def update_patient_profile(profile_data: PatientProfileCreate):
    """
    Creates or updates patient profile with strict Pydantic validation.
    """
    try:
        updated = await supabase_service.upsert_patient_profile(profile_data.model_dump())
        return updated
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to save patient profile: {str(e)}"
        )
