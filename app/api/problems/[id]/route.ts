import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import crypto from "crypto"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("problems").select("*").eq("id", params.id).single()

    if (error) throw error

    return NextResponse.json({ problem: data })
  } catch (error) {
    console.error("[v0] Error fetching problem:", error)
    return NextResponse.json({ error: "Problem not found" }, { status: 404 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status, upvote, voterIdentifier } = body

    const supabase = await createClient()

    // Handle upvote
    if (upvote && voterIdentifier) {
      // Check if already voted
      const { data: existingVote } = await supabase
        .from("upvotes")
        .select("id")
        .eq("problem_id", params.id)
        .eq("voter_identifier", voterIdentifier)
        .single()

      if (existingVote) {
        return NextResponse.json({ error: "Already upvoted" }, { status: 400 })
      }

      // Add upvote with blockchain verification
      const blockchainHash = crypto
        .createHash("sha256")
        .update(`${params.id}-${voterIdentifier}-${Date.now()}`)
        .digest("hex")

      await supabase.from("upvotes").insert({
        problem_id: params.id,
        voter_identifier: voterIdentifier,
        blockchain_hash: blockchainHash,
      })

      // Increment upvotes count
      const { data: problem } = await supabase.from("problems").select("upvotes").eq("id", params.id).single()

      const { data: updatedProblem, error: updateError } = await supabase
        .from("problems")
        .update({ upvotes: (problem?.upvotes || 0) + 1 })
        .eq("id", params.id)
        .select()
        .single()

      if (updateError) throw updateError

      return NextResponse.json({ problem: updatedProblem, blockchainHash })
    }

    // Handle status update
    if (status) {
      const updates: any = { status }
      if (status === "resolved") {
        updates.resolved_at = new Date().toISOString()
      }

      const { data, error } = await supabase.from("problems").update(updates).eq("id", params.id).select().single()

      if (error) throw error

      return NextResponse.json({ problem: data })
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Error updating problem:", error)
    return NextResponse.json({ error: "Failed to update problem" }, { status: 500 })
  }
}
