-- Add resolved_at and resolved_by columns to problems table
ALTER TABLE public.problems 
ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS resolved_by UUID REFERENCES auth.users(id);

-- Update RLS policies to allow admins to update any problem
CREATE POLICY "problems_update_admin"
  ON public.problems FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create index for faster admin queries
CREATE INDEX IF NOT EXISTS idx_problems_status ON public.problems(status);
CREATE INDEX IF NOT EXISTS idx_problems_created_at ON public.problems(created_at);
CREATE INDEX IF NOT EXISTS idx_problems_upvotes ON public.problems(upvotes);
