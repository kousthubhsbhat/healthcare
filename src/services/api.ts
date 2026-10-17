import { PatientProfile, LabReport, AccessLog, Medication } from '../types/health';

const ENV_API_URL = (import.meta as any).env?.VITE_API_URL;
const isVercelHost = typeof window !== 'undefined' && 
  (window.location.hostname.includes('vercel.app') || (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'));

// In local development, use relative '/api' proxied to FastAPI on port 8000.
// On static production hosts (like Vercel) where there is no backend server running at /api,
// only make requests if an explicit VITE_API_URL is configured.
export const API_BASE_URL = ENV_API_URL || (isVercelHost ? '' : '/api');

export const isBackendAvailable = Boolean(ENV_API_URL) || !isVercelHost;

/**
 * Safely fetches JSON from an endpoint, verifying Content-Type to prevent
 * SyntaxError when a static host (like Vercel) serves index.html for unknown routes.
 */
async function safeFetchJson<T>(url: string, options?: RequestInit): Promise<T | null> {
  if (!url || !isBackendAvailable) return null;
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || !contentType.includes('application/json')) {
      return null;
    }
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/**
 * Fetch patient profile from backend / Supabase
 */
export async function fetchPatientProfile(): Promise<PatientProfile | null> {
  if (!isBackendAvailable) return null;
  return safeFetchJson<PatientProfile>(`${API_BASE_URL}/patients/profile`);
}

/**
 * Uploads a medical document (PDF, PNG, JPG) to Supabase Storage via backend
 */
export async function uploadMedicalReport(
  file: File,
  category = 'Blood Work',
  title?: string
): Promise<{ id: string; filePath: string; title: string; category: string }> {
  if (!isBackendAvailable) {
    throw new Error('BACKEND_STANDALONE_MODE');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', category);
  if (title) formData.append('title', title);

  const res = await fetch(`${API_BASE_URL}/reports/upload`, {
    method: 'POST',
    body: formData,
  });

  const contentType = res.headers.get('content-type') || '';
  if (!res.ok || !contentType.includes('application/json')) {
    throw new Error(`Upload failed with status ${res.status}`);
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
  if (!isBackendAvailable) {
    throw new Error('BACKEND_STANDALONE_MODE');
  }

  const res = await fetch(`${API_BASE_URL}/reports/process/${reportId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language }),
  });

  const contentType = res.headers.get('content-type') || '';
  if (!res.ok || !contentType.includes('application/json')) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `AI processing failed with status ${res.status}`);
  }

  return await res.json();
}

/**
 * Fetches all timeline diagnostic reports for a patient from backend/Supabase
 */
export async function fetchPatientReports(patientId = 'pt-99421-bangalore'): Promise<any[]> {
  if (!isBackendAvailable) return [];
  const data = await safeFetchJson<{ reports: any[] }>(`${API_BASE_URL}/reports/patient/${patientId}`);
  return data?.reports || [];
}

/**
 * Generates a randomized 24-hour UUID access token for QR sharing
 */
export async function generateQRToken(
  patientId: string,
  scope: 'Full' | 'Labs' | 'Emergency' = 'Full'
): Promise<{ token: string; expiresAt: string; shareUrl: string; hoursValid: number }> {
  if (!isBackendAvailable) {
    // Generate deterministic client-side token when standalone
    const token = `qr-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    return {
      token,
      expiresAt: expires,
      shareUrl: `${window.location.origin}/doctor-portal?token=${token}&scope=${scope}`,
      hoursValid: 24,
    };
  }

  const res = await fetch(`${API_BASE_URL}/qr/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patientId, scope }),
  });

  const contentType = res.headers.get('content-type') || '';
  if (!res.ok || !contentType.includes('application/json')) {
    const token = `qr-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    return {
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      shareUrl: `${window.location.origin}/doctor-portal?token=${token}&scope=${scope}`,
      hoursValid: 24,
    };
  }

  return await res.json();
}

/**
 * Validates doctor token and retrieves longitudinal dossier + logs access event
 */
export async function fetchDoctorView(token: string): Promise<any> {
  if (!isBackendAvailable) return null;
  return safeFetchJson(`${API_BASE_URL}/doctor-view/${token}`);
}

/**
 * Zero-login emergency access endpoint
 */
export async function fetchEmergencyView(token: string): Promise<any> {
  if (!isBackendAvailable) return null;
  return safeFetchJson(`${API_BASE_URL}/emergency-view/${token}`);
}

/**
 * Fetches live access audit logs
 */
export async function fetchAccessLogs(patientId = 'pt-99421-bangalore'): Promise<AccessLog[]> {
  if (!isBackendAvailable) return [];
  const data = await safeFetchJson<{ logs: AccessLog[] }>(`${API_BASE_URL}/qr/logs/${patientId}`);
  return data?.logs || [];
}

/**
 * Fetches local LAN/Wi-Fi network IP from backend so devices on same network can connect
 */
export async function fetchNetworkInfo(): Promise<{ localIp: string; wifiUrl: string } | null> {
  if (!isBackendAvailable) return null;
  return safeFetchJson<{ localIp: string; wifiUrl: string }>(`${API_BASE_URL}/network-info`);
}
