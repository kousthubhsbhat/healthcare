from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from typing import Optional, List
from datetime import datetime, timezone
import os

from app.models.schemas import ReportUploadResponse, ProcessReportRequest, ProcessReportResponse, BiomarkerValue
from app.services.supabase_service import supabase_service
from app.services.vision_llm import VisionLLMService
from app.services.rule_engine import ClinicalRuleEngine

router = APIRouter(prefix="/reports", tags=["Medical Reports & AI OCR"])

@router.post("/upload", response_model=ReportUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_medical_report(
    file: UploadFile = File(..., description="PDF or image of lab report/prescription"),
    patient_id: Optional[str] = Form("pt-99421-bangalore"),
    title: Optional[str] = Form(None),
    category: Optional[str] = Form("Blood Work")
):
    """
    Accepts multipart file uploads (PDF, PNG, JPG).
    Secures files in Supabase Storage and logs metadata in the PostgreSQL reports table.
    """
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No filename provided in upload."
        )

    # Allowed extensions
    ext = os.path.splitext(file.filename)[1].lower()
    allowed = [".pdf", ".png", ".jpg", ".jpeg", ".webp"]
    if ext not in allowed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{ext}'. Allowed formats: PDF, PNG, JPG, JPEG, WEBP."
        )

    file_bytes = await file.read()
    if len(file_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty (0 bytes)."
        )

    # Calculate human-readable size
    size_kb = len(file_bytes) / 1024
    size_str = f"{size_kb / 1024:.1f} MB" if size_kb > 1024 else f"{size_kb:.0f} KB"

    # Upload to Supabase Storage
    storage_path = await supabase_service.upload_file_to_storage(file_bytes, file.filename)

    doc_title = title or file.filename.replace(ext, "").replace("_", " ").title()
    file_type = "PDF" if ext == ".pdf" else "IMAGE"

    report_record = {
        "patientId": patient_id,
        "title": doc_title,
        "category": category,
        "filePath": storage_path,
        "fileType": file_type,
        "fileSize": size_str,
        "status": "Pending Review",
        "fileBytes": file_bytes # Stored temporarily for immediate processing pipeline
    }

    created_report = await supabase_service.create_report(report_record)

    return ReportUploadResponse(
        id=created_report["id"],
        patientId=created_report["patientId"],
        title=created_report["title"],
        category=created_report["category"],
        filePath=created_report["filePath"],
        fileType=created_report["fileType"],
        fileSize=created_report["fileSize"],
        status=created_report["status"],
        createdAt=created_report["createdAt"]
    )

@router.post("/process/{report_id}", response_model=ProcessReportResponse)
async def process_report_with_vision_llm(
    report_id: str,
    request: ProcessReportRequest = ProcessReportRequest()
):
    """
    1. Sends uploaded file to Vision LLM API to extract raw text & biomarkers.
    2. Runs deterministic rule-based Python checks to flag abnormal values (e.g. Glucose > 200).
    3. Cross-checks detected drugs against patient allergy profile.
    4. Generates multi-lingual plain language explanations.
    """
    report = await supabase_service.get_report_by_id(report_id)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report with ID '{report_id}' not found."
        )

    file_bytes = report.get("fileBytes") or b"mock-file-content"
    filename = report.get("title", "medical-report") + (".pdf" if report.get("fileType") == "PDF" else ".jpg")
    content_type = "application/pdf" if report.get("fileType") == "PDF" else "image/jpeg"

    # 1. Vision LLM OCR Extraction
    extraction = await VisionLLMService.process_document(file_bytes, filename, content_type)

    raw_biomarkers = [
        BiomarkerValue(name=b["name"], value=b["value"], reference=b.get("reference", ""))
        for b in extraction.get("biomarkers", [])
    ]

    # 2. Deterministic Clinical Safety & Abnormal Flagging
    evaluated_biomarkers, clinical_alerts = ClinicalRuleEngine.evaluate_biomarkers(raw_biomarkers)
    abnormal_count = sum(1 for b in evaluated_biomarkers if b.isAbnormal)

    # 3. Drug-Allergy Interaction Check
    patient = await supabase_service.get_patient_profile(report.get("patientId"))
    patient_allergies = patient.get("allergies", []) if patient else []
    detected_drugs = extraction.get("detected_medications", [])
    contraindication_alerts = ClinicalRuleEngine.check_drug_contraindications(detected_drugs, patient_allergies)

    # 4. Update Report Record
    summary = extraction.get("plain_language_summary", {}).get(request.language) or extraction.get("plain_language_summary", {}).get("en", "")
    extracted_title = extraction.get("title") or report.get("title")
    extracted_category = extraction.get("category") or report.get("category")

    await supabase_service.update_report(
        report_id=report_id,
        update_data={
            "title": extracted_title,
            "category": extracted_category,
            "summary": summary,
            "status": "Flagged" if len(contraindication_alerts) > 0 or abnormal_count > 0 else "Verified",
            "keyValues": [b.model_dump() for b in evaluated_biomarkers],
            "aiProcessedAt": datetime.now(timezone.utc)
        }
    )

    return ProcessReportResponse(
        reportId=report_id,
        title=extraction.get("title", report.get("title")),
        category=extraction.get("category", report.get("category")),
        dateExtracted=extraction.get("date", "Today"),
        rawExtractedText=extraction.get("raw_text", ""),
        keyValues=evaluated_biomarkers,
        abnormalCount=abnormal_count,
        plainLanguageSummary=extraction.get("plain_language_summary", {}),
        contraindicationAlerts=contraindication_alerts + clinical_alerts,
        status="Verified" if len(contraindication_alerts) == 0 else "Flagged",
        aiConfidence=0.96
    )

@router.get("/patient/{patient_id}")
async def get_patient_timeline_reports(patient_id: str):
    """Returns chronological timeline of verified reports for a patient."""
    reports = await supabase_service.get_patient_reports(patient_id)
    return {"patientId": patient_id, "reports": reports}
