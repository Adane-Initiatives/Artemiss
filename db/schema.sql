-- Update the schema to ensure it works properly with the application

-- Create threads table
CREATE TABLE IF NOT EXISTS public.threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'low', 'medium', 'high')),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  camera_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create activities table
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  camera_id TEXT NOT NULL,
  thread_id UUID REFERENCES public.threads(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_threads_camera_id ON public.threads (camera_id);
CREATE INDEX IF NOT EXISTS idx_threads_timestamp ON public.threads (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activities_camera_id ON public.activities (camera_id);
CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON public.activities (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activities_thread_id ON public.activities (thread_id);
CREATE INDEX IF NOT EXISTS idx_activities_severity ON public.activities (severity);

-- Set up Row Level Security (RLS)
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (for development purposes)
DROP POLICY IF EXISTS "Allow anonymous read access to threads" ON public.threads;
CREATE POLICY "Allow anonymous read access to threads" 
  ON public.threads FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anonymous read access to activities" ON public.activities;
CREATE POLICY "Allow anonymous read access to activities" 
  ON public.activities FOR SELECT USING (true);

-- Create policy for inserting data (for development purposes)
DROP POLICY IF EXISTS "Allow insert access to threads" ON public.threads;
CREATE POLICY "Allow insert access to threads" 
  ON public.threads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow insert access to activities" ON public.activities;
CREATE POLICY "Allow insert access to activities" 
  ON public.activities FOR INSERT WITH CHECK (true);

-- Create policy for updating data (for development purposes)
DROP POLICY IF EXISTS "Allow update access to threads" ON public.threads;
CREATE POLICY "Allow update access to threads" 
  ON public.threads FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow update access to activities" ON public.activities;
CREATE POLICY "Allow update access to activities" 
  ON public.activities FOR UPDATE USING (true);

-- Create storage bucket for video clips (if needed)
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('clips', 'clips', true);

-- Create policy to allow access to the storage bucket (if needed)
-- CREATE POLICY "Allow public access to clips" 
-- ON storage.objects FOR SELECT 
-- USING (bucket_id = 'clips');
