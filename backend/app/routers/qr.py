from fastapi import APIRouter, Request, HTTPException, status
from app.models.schemas import QRGenerateRequest, QRGenerateResponse
from app.services.qr_service import QRService
from app.services.supabase_service import supabase_service

router = APIRouter(prefix="/qr", tags=["QR Access Sharing"])

@router.post("/generate", response_model=QRGenerateResponse, status_code=status.HTTP_201_CREATED)
async def generate_qr_token(request_body: QRGenerateRequest, request: Request):
    """
    Generates a secure, randomized UUID token linked to the patient ID
    with a strict 24-hour expiration timestamp.
    Stores the token in the access_tokens table.
    """
    client_ip = request.client.host if request.client else "127.0.0.1"
    origin = request.headers.get("origin") or request.headers.get("referer")
    if origin and "://" in origin:
        # Extract protocol + host only if referer has paths
        parts = origin.split("/")
        origin = f"{parts[0]}//{parts[2]}"

    token_data = await QRService.generate_token(
        patient_id=request_body.patientId,
        scope=request_body.scope.value,
        client_ip=client_ip,
        origin=origin
    )

    return QRGenerateResponse(
        token=token_data["token"],
        patientId=token_data["patientId"],
        scope=token_data["scope"],
        createdAt=token_data["createdAt"],
        expiresAt=token_data["expiresAt"],
        shareUrl=token_data["shareUrl"],
        hoursValid=token_data["hoursValid"]
    )

@router.get("/logs/{patient_id}")
async def get_patient_access_audit_logs(patient_id: str):
    """
    Returns live access audit trail showing who viewed the patient's records,
    their clinical role, facility, duration, and timestamp.
    """
    logs = await supabase_service.get_access_logs(patient_id)
    return {"patientId": patient_id, "logs": logs}
