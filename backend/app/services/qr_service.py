import uuid
from datetime import datetime, timezone, timedelta
from typing import Tuple, Optional, Dict, Any
from app.config import settings
from app.services.supabase_service import supabase_service

class QRService:
    @staticmethod
    async def generate_token(patient_id: str, scope: str = "Full", client_ip: str = "127.0.0.1") -> Dict[str, Any]:
        """
        Generates a secure, cryptographically random UUID token linked to the patient ID
        with a strict 24-hour expiration timestamp.
        """
        token = str(uuid.uuid4())
        created_at = datetime.now(timezone.utc)
        expires_at = created_at + timedelta(hours=settings.TOKEN_EXPIRATION_HOURS)

        await supabase_service.create_access_token(
            token=token,
            patient_id=patient_id,
            scope=scope,
            expires_at=expires_at,
            client_ip=client_ip
        )

        share_url = f"{settings.FRONTEND_URL}/doctor-portal?token={token}&scope={scope.lower()}"

        return {
            "token": token,
            "patientId": patient_id,
            "scope": scope,
            "createdAt": created_at,
            "expiresAt": expires_at,
            "shareUrl": share_url,
            "hoursValid": settings.TOKEN_EXPIRATION_HOURS
        }

    @staticmethod
    async def validate_token(token_str: str) -> Tuple[bool, Optional[str], Optional[Dict[str, Any]]]:
        """
        Validates token existence, expiration timestamp, and revocation flag.
        Returns: (is_valid, error_message, token_record)
        """
        # 1. Format check
        try:
            uuid.UUID(token_str)
        except ValueError:
            # Also allow fallback seed tokens for ease of manual testing
            if not token_str.startswith("seed-token"):
                return False, "Invalid token format. Must be a valid UUID.", None

        # 2. Retrieve token
        token_record = await supabase_service.get_access_token(token_str)
        if not token_record:
            return False, "Access token not found or does not exist.", None

        # 3. Check revocation
        if token_record.get("is_revoked", False):
            return False, "Access token has been revoked by the patient.", None

        # 4. Check expiration
        expires_at = token_record.get("expires_at")
        if isinstance(expires_at, str):
            expires_at = datetime.fromisoformat(expires_at.replace("Z", "+00:00"))

        now_utc = datetime.now(timezone.utc)
        if expires_at and expires_at < now_utc:
            return False, "Access token has expired (24-hour lifetime elapsed). Request a new QR code from patient.", None

        return True, None, token_record
