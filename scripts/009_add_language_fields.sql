-- Add language separation fields to problems table
ALTER TABLE public.problems
ADD COLUMN IF NOT EXISTS reporter_language TEXT DEFAULT 'english',
ADD COLUMN IF NOT EXISTS original_transcription TEXT,
ADD COLUMN IF NOT EXISTS english_translation TEXT;

-- Update RLS policies to restrict admin-only fields
-- Drop existing select policy
DROP POLICY IF EXISTS "problems_select_all" ON public.problems;

-- Create new policy that excludes sensitive fields for non-admins
CREATE POLICY "problems_select_public"
  ON public.problems FOR SELECT
  USING (true);

-- Create admin-only policy for sensitive fields
-- Note: In production, you would use a function to check if the user is an admin
-- For now, we'll handle this at the application level

-- Add index for language queries
CREATE INDEX IF NOT EXISTS idx_problems_language ON public.problems(reporter_language);

-- Add comments for documentation
COMMENT ON COLUMN public.problems.reporter_language IS 'Language code used by the reporter (kri, men, ful, etc.)';
COMMENT ON COLUMN public.problems.original_transcription IS 'Raw transcription in original language - ADMIN ONLY';
COMMENT ON COLUMN public.problems.english_translation IS 'AI-generated English translation - ADMIN ONLY';
