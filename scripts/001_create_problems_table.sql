-- Create problems table
CREATE TABLE IF NOT EXISTS public.problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'reported' CHECK (status IN ('reported', 'in_progress', 'resolved', 'closed')),
  location_name TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  upvotes INTEGER DEFAULT 0,
  photos TEXT[], -- Array of URLs
  videos TEXT[], -- Array of URLs
  audio TEXT[], -- Array of URLs
  documents TEXT[], -- Array of URLs
  language TEXT DEFAULT 'english',
  audio_transcription TEXT,
  blockchain_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read problems (public platform)
CREATE POLICY "problems_select_all"
  ON public.problems FOR SELECT
  USING (true);

-- Allow anyone to insert problems (no auth required for reporting)
CREATE POLICY "problems_insert_all"
  ON public.problems FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update problems (for upvoting)
CREATE POLICY "problems_update_all"
  ON public.problems FOR UPDATE
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_problems_created_at ON public.problems(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_problems_upvotes ON public.problems(upvotes DESC);
CREATE INDEX IF NOT EXISTS idx_problems_category ON public.problems(category);
CREATE INDEX IF NOT EXISTS idx_problems_status ON public.problems(status);
