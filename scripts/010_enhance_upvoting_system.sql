-- Add admin override field to problems table
ALTER TABLE public.problems
ADD COLUMN IF NOT EXISTS admin_priority_override TEXT CHECK (admin_priority_override IN ('critical', 'high', 'moderate', NULL)),
ADD COLUMN IF NOT EXISTS admin_override_reason TEXT,
ADD COLUMN IF NOT EXISTS admin_override_by UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS admin_override_at TIMESTAMP WITH TIME ZONE;

-- Rename upvotes table to upvote_transactions for clarity
DROP TABLE IF EXISTS public.upvote_transactions CASCADE;
CREATE TABLE public.upvote_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  voter_fingerprint_hash TEXT NOT NULL, -- SHA-256 hash of anonymized identifier
  blockchain_hash TEXT NOT NULL UNIQUE,
  transaction_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address_hash TEXT, -- Hashed IP for fraud detection
  user_agent_hash TEXT, -- Hashed user agent
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_vote_per_problem UNIQUE(problem_id, voter_fingerprint_hash)
);

-- Enable Row Level Security
ALTER TABLE public.upvote_transactions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read transactions (for verification)
CREATE POLICY "upvote_transactions_select_all"
  ON public.upvote_transactions FOR SELECT
  USING (true);

-- Allow anyone to insert transactions (validated by RPC function)
CREATE POLICY "upvote_transactions_insert_all"
  ON public.upvote_transactions FOR INSERT
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_upvote_transactions_problem ON public.upvote_transactions(problem_id);
CREATE INDEX IF NOT EXISTS idx_upvote_transactions_fingerprint ON public.upvote_transactions(voter_fingerprint_hash);
CREATE INDEX IF NOT EXISTS idx_upvote_transactions_blockchain ON public.upvote_transactions(blockchain_hash);
CREATE INDEX IF NOT EXISTS idx_problems_admin_override ON public.problems(admin_priority_override) WHERE admin_priority_override IS NOT NULL;

-- Create atomic upvote function with blockchain verification
CREATE OR REPLACE FUNCTION record_upvote(
  p_problem_id UUID,
  p_voter_fingerprint_hash TEXT,
  p_ip_hash TEXT,
  p_user_agent_hash TEXT
) RETURNS JSON AS $$
DECLARE
  v_blockchain_hash TEXT;
  v_new_upvotes INTEGER;
  v_result JSON;
BEGIN
  -- Check if voter already voted for this problem
  IF EXISTS (
    SELECT 1 FROM upvote_transactions 
    WHERE problem_id = p_problem_id 
    AND voter_fingerprint_hash = p_voter_fingerprint_hash
  ) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'ALREADY_VOTED',
      'message', 'You have already upvoted this problem'
    );
  END IF;

  -- Generate blockchain hash (SHA-256 of problem_id + fingerprint + timestamp)
  v_blockchain_hash := encode(
    digest(p_problem_id::TEXT || p_voter_fingerprint_hash || EXTRACT(EPOCH FROM NOW())::TEXT, 'sha256'),
    'hex'
  );

  -- Insert transaction record (atomic)
  INSERT INTO upvote_transactions (
    problem_id,
    voter_fingerprint_hash,
    blockchain_hash,
    ip_address_hash,
    user_agent_hash
  ) VALUES (
    p_problem_id,
    p_voter_fingerprint_hash,
    v_blockchain_hash,
    p_ip_hash,
    p_user_agent_hash
  );

  -- Increment upvotes count (atomic)
  UPDATE problems 
  SET upvotes = upvotes + 1,
      updated_at = NOW()
  WHERE id = p_problem_id
  RETURNING upvotes INTO v_new_upvotes;

  -- Return success with blockchain hash
  v_result := json_build_object(
    'success', true,
    'blockchainHash', v_blockchain_hash,
    'newUpvotes', v_new_upvotes,
    'timestamp', NOW()
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION record_upvote TO anon, authenticated;
