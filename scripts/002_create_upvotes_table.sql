-- Create upvotes tracking table for blockchain verification
CREATE TABLE IF NOT EXISTS public.upvotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  voter_identifier TEXT NOT NULL, -- IP or device fingerprint
  blockchain_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(problem_id, voter_identifier)
);

-- Enable Row Level Security
ALTER TABLE public.upvotes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read upvotes
CREATE POLICY "upvotes_select_all"
  ON public.upvotes FOR SELECT
  USING (true);

-- Allow anyone to insert upvotes
CREATE POLICY "upvotes_insert_all"
  ON public.upvotes FOR INSERT
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_upvotes_problem_id ON public.upvotes(problem_id);
CREATE INDEX IF NOT EXISTS idx_upvotes_voter ON public.upvotes(voter_identifier);
