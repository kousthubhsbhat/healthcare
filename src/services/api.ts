import { PatientProfile, LabReport, AccessLog, Medication } from '../types/health';

const API_BASE_URL = '/api';

/**
 * Fetch patient profile from backend / Supabase
 */
export async function fetchPatientProfile(): Promise<PatientProfile | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/patients/profile`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend API offline or unreachable, using local mock data:', err);
    return null;
  }
}

/**
 * Uploads a medical document (PDF, PNG, JPG) to Supabase Storage via backend
 */
export async function uploadMedicalReport(
  file: File,
  category = 'Blood Work',
  title?: string
): Promise<{ id: string; filePath: string; title: string; category: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', category);
  if (title) formData.append('title', title);

  const res = await fetch(`${API_BASE_URL}/reports/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Upload failed with status ${res.status}`);
  }

  return await res.json();
}

/**
 * Sends uploaded file to Vision LLM for OCR, parameter extraction, and rule-based safety checking
 */
export async function processReportWithVisionAI(
  reportId: string,
  language = 'en'
): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/reports/process/${reportId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `AI processing failed with status ${res.status}`);
  }

  return await res.json();
}

/**
 * Generates a randomized 24-hour UUID access token for QR sharing
 */
export async function generateQRToken(
  patientId: string,
  scope: 'Full' | 'Labs' | 'Emergency' = 'Full'
): Promise<{ token: string; expiresAt: string; shareUrl: string; hoursValid: number }> {
  const res = await fetch(`${API_BASE_URL}/qr/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patientId, scope }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `QR token generation failed with status ${res.status}`);
  }

  return await res.json();
}

/**
 * Validates doctor token and retrieves longitudinal dossier + logs access event
 */
export async function fetchDoctorView(token: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/doctor-view/${token}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Doctor view access denied (${res.status})`);
  }
  return await res.json();
}

/**
 * Zero-login emergency access endpoint
 */
export async function fetchEmergencyView(token: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/emergency-view/${token}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Emergency view retrieval failed (${res.status})`);
  }
  return await res.json();
}

/**
 * Fetches live access audit logs
 */
export async function fetchAccessLogs(patientId = 'pt-99421-bangalore'): Promise<AccessLog[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/qr/logs/${patientId}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data.logs || [];
  } catch (err) {
    console.warn('Could not fetch access logs from backend:', err);
    return [];
  }
}

/**
 * Fetches local LAN/Wi-Fi network IP from backend so devices on same network can connect
 */
export async function fetchNetworkInfo(): Promise<{ localIp: string; wifiUrl: string } | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/network-info`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

