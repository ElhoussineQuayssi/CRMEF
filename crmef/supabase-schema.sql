-- Fixed Supabase SQL Schema for CRMEF project
-- Run in Supabase Dashboard > SQL Editor

-- Bookings table (exact match to app code)
CREATE TABLE IF NOT EXISTS public.bookings (
    id BIGSERIAL PRIMARY KEY,
    student_name TEXT NOT NULL,
    student_phone TEXT NOT NULL,
    subject_topic TEXT NOT NULL,
    date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public can read bookings (for admin preview)
CREATE POLICY "Public read bookings" ON public.bookings
FOR SELECT USING (true);

-- Allow public insert (no auth required for booking form)
CREATE POLICY "Public insert bookings" ON public.bookings
FOR INSERT WITH CHECK (true);

-- Service role full access (server actions)
CREATE POLICY "Service role full access" ON public.bookings
FOR ALL USING (auth.role() = 'service_role');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings (date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings (created_at DESC);

-- Auto-update updated_at trigger
DROP FUNCTION IF EXISTS update_updated_at_column();
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON public.bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'Schema created successfully for CRMEF bookings table' as status;

-- =============================================
-- RESOURCES TABLE (for videos and PDFs)
-- =============================================
CREATE TABLE IF NOT EXISTS public.resources (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('video', 'pdf')),
    level TEXT,
    file_url TEXT,
    youtube_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on resources
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for resources
CREATE POLICY "Public read resources" ON public.resources
FOR SELECT USING (true);

CREATE POLICY "Service role full access resources" ON public.resources
FOR ALL USING (auth.role() = 'service_role');

-- Indexes for resources
CREATE INDEX IF NOT EXISTS idx_resources_type ON public.resources (type);
CREATE INDEX IF NOT EXISTS idx_resources_level ON public.resources (level);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON public.resources (created_at DESC);

-- =============================================
-- STORAGE SETUP
-- =============================================
-- Create bucket for PDF uploads if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('resources', 'resources', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read resources files" ON storage.objects
FOR SELECT USING (bucket_id = 'resources');

CREATE POLICY "Service role upload resources" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'resources' AND auth.role() = 'service_role');

CREATE POLICY "Service role delete resources" ON storage.objects
FOR DELETE USING (bucket_id = 'resources' AND auth.role() = 'service_role');

SELECT 'Resources table and storage bucket created successfully' as status;
