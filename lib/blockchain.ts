import { createClient } from "@/lib/supabase/client"
import { generateClientFingerprint, hashValue } from "@/lib/utils/fingerprint"

export interface BlockchainUpvoteResult {
  success: boolean
  blockchainHash?: string
  newUpvotes?: number
  error?: string
  alreadyUpvoted?: boolean
}

/**
 * Record an upvote using Supabase RPC function with blockchain verification
 */
export async function recordBlockchainUpvote(problemId: string): Promise<BlockchainUpvoteResult> {
  try {
    const supabase = createClient()

    // Generate voter fingerprint
    const fingerprint = generateClientFingerprint()
    const fingerprintHash = hashFingerprint(fingerprint)

    // Get additional signals for fraud detection
    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : ""
    const userAgentHash = hashValue(userAgent)

    // Note: IP address hashing happens server-side for security
    const ipHash = "" // Server will handle IP hashing

    console.log("[v0] Recording blockchain upvote for problem:", problemId)
    console.log("[v0] Voter fingerprint hash:", fingerprintHash.substring(0, 10) + "...")

    // Call Supabase RPC function for atomic upvote
    const { data, error } = await supabase.rpc("record_upvote", {
      p_problem_id: problemId,
      p_voter_fingerprint_hash: fingerprintHash,
      p_ip_hash: ipHash,
      p_user_agent_hash: userAgentHash,
    })

    if (error) {
      console.error("[v0] Blockchain upvote error:", error)
      return {
        success: false,
        error: error.message,
      }
    }

    const result = data as {
      success: boolean
      error?: string
      blockchainHash?: string
      newUpvotes?: number
    }

    if (!result.success) {
      console.log("[v0] Upvote rejected:", result.error)
      return {
        success: false,
        error: result.error,
        alreadyUpvoted: result.error === "ALREADY_VOTED",
      }
    }

    console.log("[v0] Blockchain upvote recorded successfully")
    console.log("[v0] Blockchain hash:", result.blockchainHash?.substring(0, 16) + "...")
    console.log("[v0] New upvote count:", result.newUpvotes)

    return {
      success: true,
      blockchainHash: result.blockchainHash,
      newUpvotes: result.newUpvotes,
    }
  } catch (error) {
    console.error("[v0] Blockchain upvote exception:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Hash fingerprint for storage
 */
function hashFingerprint(fingerprint: string): string {
  return hashValue(fingerprint)
}

/**
 * Verify a blockchain transaction (for auditing)
 */
export async function verifyBlockchainTransaction(blockchainHash: string): Promise<boolean> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("upvote_transactions")
      .select("id")
      .eq("blockchain_hash", blockchainHash)
      .single()

    if (error || !data) {
      return false
    }

    return true
  } catch {
    return false
  }
}
