-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read comments
CREATE POLICY "comments_select_all"
  ON public.comments FOR SELECT
  USING (true);

-- Allow anyone to insert comments
CREATE POLICY "comments_insert_all"
  ON public.comments FOR INSERT
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_comments_problem_id ON public.comments(problem_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);
