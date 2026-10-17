import httpx
import asyncio
import json

BASE_URL = "http://127.0.0.1:8000"

async def run_tests():
    print("=" * 70)
    print("🧪 Running PulseHealth FastAPI Medical Backend Test Suite")
    print("=" * 70)

    async with httpx.AsyncClient(base_url=BASE_URL, timeout=15.0) as client:
        # 1. Health Check
        print("\n1. Testing GET /health...")
        r = await client.get("/health")
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text}"
        print(f"   ✅ Health OK: {r.json()['service']} ({r.json()['status']})")

        # 2. GET /api/patients/profile
        print("\n2. Testing GET /api/patients/profile...")
        r = await client.get("/api/patients/profile")
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text}"
        data = r.json()
        print(f"   ✅ Patient loaded: {data['name']}, Blood Group: {data['bloodGroup']}, Allergies: {len(data['allergies'])}")
        patient_id = data["id"]

        # 3. POST /api/reports/upload (Multipart upload)
        print("\n3. Testing POST /api/reports/upload...")
        sample_pdf_bytes = b"%PDF-1.4 Mock Lab Report Content for Fasting Blood Sugar and Lipid Profile"
        files = {"file": ("Manipal_Lab_Glucose_Panel.pdf", sample_pdf_bytes, "application/pdf")}
        data = {"patient_id": patient_id, "category": "Blood Work", "title": "Manipal Fasting Blood Sugar Panel"}
        r = await client.post("/api/reports/upload", files=files, data=data)
        assert r.status_code == 201, f"Expected 201, got {r.status_code}: {r.text}"
        upload_res = r.json()
        report_id = upload_res["id"]
        print(f"   ✅ Report uploaded: ID={report_id}, StoragePath={upload_res['filePath']}")

        # 4. POST /api/reports/process/{report_id} (Vision LLM + Rule Engine)
        print(f"\n4. Testing POST /api/reports/process/{report_id}...")
        r = await client.post(f"/api/reports/process/{report_id}", json={"language": "en"})
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text}"
        proc_res = r.json()
        print(f"   ✅ Vision LLM Processed: Title='{proc_res['title']}', Biomarkers={len(proc_res['keyValues'])}, Abnormal Flags={proc_res['abnormalCount']}")
        print(f"   💬 Plain Language Summary (English): {proc_res['plainLanguageSummary'].get('en')}")
        print(f"   💬 Plain Language Summary (Hindi): {proc_res['plainLanguageSummary'].get('hi')}")
        print(f"   💬 Plain Language Summary (Kannada): {proc_res['plainLanguageSummary'].get('kn')}")

        # 5. POST /api/qr/generate (24-Hour UUID Token)
        print("\n5. Testing POST /api/qr/generate...")
        r = await client.post("/api/qr/generate", json={"patientId": patient_id, "scope": "Full"})
        assert r.status_code == 201, f"Expected 201, got {r.status_code}: {r.text}"
        qr_res = r.json()
        token = qr_res["token"]
        expires_at = qr_res["expiresAt"]
        print(f"   ✅ Secure 24h UUID Token Generated: {token}")
        print(f"   ⏳ Expiration Timestamp: {expires_at} (Valid: {qr_res['hoursValid']} hours)")

        # 6. GET /api/doctor-view/{token}
        print(f"\n6. Testing GET /api/doctor-view/{token}...")
        r = await client.get(f"/api/doctor-view/{token}")
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text}"
        doc_res = r.json()
        print(f"   ✅ Doctor View Authorized: Patient={doc_res['patient']['name']}, Medications={len(doc_res['medications'])}, Reports={len(doc_res['timelineReports'])}")
        print(f"   ⚠️ Active Alerts: {doc_res['activeAlerts']}")

        # 7. GET /api/emergency-view/{token} (Zero-Login Survival Mode)
        print(f"\n7. Testing GET /api/emergency-view/{token}...")
        r = await client.get(f"/api/emergency-view/{token}")
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text}"
        em_res = r.json()
        print(f"   ✅ Emergency Survival Mode OK: Blood Group={em_res['bloodGroup']}, Allergies={len(em_res['criticalAllergies'])}, Contacts={len(em_res['emergencyContacts'])}")
        print(f"   📍 GPS Emergency Beacon: {em_res['emergencyLocation']['address']} ({em_res['emergencyLocation']['beacon']})")

        # 8. Testing Security & Error Responses (401, 400, 404)
        print("\n8. Testing Security & Error Responses...")
        
        # Invalid Token
        r = await client.get("/api/doctor-view/invalid-non-uuid-token")
        assert r.status_code == 401, f"Expected 401, got {r.status_code}"
        print(f"   ✅ Rejected invalid token format: 401 Unauthorized ({r.json()['detail']})")

        # Non-existent Report
        r = await client.post("/api/reports/process/rep-nonexistent", json={"language": "en"})
        assert r.status_code == 404, f"Expected 404, got {r.status_code}"
        print(f"   ✅ Non-existent report handled: 404 Not Found")

        # Invalid file upload format
        files = {"file": ("malicious.exe", b"binary-data", "application/octet-stream")}
        r = await client.post("/api/reports/upload", files=files, data={"patient_id": patient_id})
        assert r.status_code == 400, f"Expected 400, got {r.status_code}"
        print(f"   ✅ Blocked invalid file extension: 400 Bad Request ({r.json()['detail']})")

    print("\n" + "=" * 70)
    print("🎉 ALL API & SECURITY TESTS PASSED SUCCESSFULLY (100% PASS RATE)!")
    print("=" * 70)

if __name__ == "__main__":
    asyncio.run(run_tests())
