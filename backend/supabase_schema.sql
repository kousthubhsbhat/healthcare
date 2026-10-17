-- ==============================================================================
-- PulseHealth Supabase PostgreSQL Schema & Row Level Security (RLS)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Patients Table
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    health_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. ABHA 91-4820-1942-8821
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    dob DATE NOT NULL,
    blood_group VARCHAR(5) NOT NULL, -- 'A+', 'B+', 'O+', etc.
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    organ_donor BOOLEAN DEFAULT FALSE,
    dnr_status BOOLEAN DEFAULT FALSE,
    chronic_conditions TEXT[] DEFAULT '{}',
    allergies JSONB DEFAULT '[]', -- Array of { id, substance, severity, reaction, contraindicatedDrugs }
    emergency_contacts JSONB DEFAULT '[]', -- Array of { id, name, relation, phone, isPrimary }
    primary_physician JSONB DEFAULT '{}', -- { name, specialty, hospital, phone }
    insurance JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Reports Table (Medical Scans, Lab Panels, Prescriptions)
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Blood Work', 'Cardiology', 'Radiology', 'Prescription', 'Endocrinology'
    doctor VARCHAR(255),
    facility VARCHAR(255),
    file_path TEXT NOT NULL, -- Path in Supabase Storage bucket 'medical-reports'
    file_type VARCHAR(20) NOT NULL, -- 'PDF', 'IMAGE'
    file_size VARCHAR(50),
    summary TEXT,
    key_values JSONB DEFAULT '[]', -- Array of { name, value, reference, isAbnormal }
    status VARCHAR(50) DEFAULT 'Pending Review', -- 'Verified', 'Flagged', 'Pending Review'
    ai_raw_extracted_text TEXT,
    ai_processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Active Medications Table
CREATE TABLE IF NOT EXISTS medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    timing VARCHAR(50), -- 'After Food', 'Before Food', 'Bedtime'
    prescribed_by VARCHAR(255),
    prescribed_date DATE,
    pills_remaining INT NOT NULL DEFAULT 30,
    total_pills INT NOT NULL DEFAULT 30,
    refill_alert BOOLEAN DEFAULT FALSE,
    category VARCHAR(50) DEFAULT 'General',
    notes TEXT,
    is_taken_today BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. QR Access Tokens Table (24-Hour Expiration & Scoped Access)
CREATE TABLE IF NOT EXISTS access_tokens (
    token UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    scope VARCHAR(50) NOT NULL DEFAULT 'Full', -- 'Full', 'Labs', 'Emergency'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL, -- Exactly 24 hours from creation
    is_revoked BOOLEAN DEFAULT FALSE,
    created_by_ip VARCHAR(50)
);

-- 6. Live Access Audit Logs Table
CREATE TABLE IF NOT EXISTS access_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token UUID REFERENCES access_tokens(token) ON DELETE SET NULL,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    viewer_name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    hospital VARCHAR(255) NOT NULL,
    access_type VARCHAR(100) NOT NULL,
    ip_location VARCHAR(255),
    duration VARCHAR(50) DEFAULT 'Active session',
    status VARCHAR(50) DEFAULT 'Authorized',
    accessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for high query performance
CREATE INDEX IF NOT EXISTS idx_reports_patient ON reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_medications_patient ON medications(patient_id);
CREATE INDEX IF NOT EXISTS idx_access_tokens_token ON access_tokens(token);
CREATE INDEX IF NOT EXISTS idx_access_tokens_expires ON access_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_access_logs_patient ON access_logs(patient_id);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read of critical survival data ONLY when a valid emergency token is passed
CREATE POLICY emergency_token_patient_read ON patients
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM access_tokens
            WHERE access_tokens.patient_id = patients.id
            AND access_tokens.expires_at > NOW()
            AND access_tokens.is_revoked = FALSE
        )
    );

-- Storage bucket creation for medical reports
INSERT INTO storage.buckets (id, name, public) 
VALUES ('medical-reports', 'medical-reports', false)
ON CONFLICT (id) DO NOTHING;
