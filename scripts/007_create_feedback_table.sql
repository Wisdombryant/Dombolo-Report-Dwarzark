-- Create feedback table for citizen feedback on resolved issues
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Anyone can read feedback
CREATE POLICY "feedback_select_all"
  ON public.feedback FOR SELECT
  USING (true);

-- Anyone can insert feedback
CREATE POLICY "feedback_insert_all"
  ON public.feedback FOR INSERT
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_feedback_problem_id ON public.feedback(problem_id);
