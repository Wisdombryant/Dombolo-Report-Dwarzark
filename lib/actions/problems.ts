"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import crypto from "crypto"

export async function getProblems(filters?: {
  category?: string
  status?: string
  sortBy?: "recent" | "upvotes"
}) {
  const supabase = await createClient()

  let query = supabase.from("problems").select("*")

  if (filters?.category && filters.category !== "all") {
    query = query.eq("category", filters.category)
  }

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status)
  }

  if (filters?.sortBy === "upvotes") {
    query = query.order("upvotes", { ascending: false })
  } else {
    query = query.order("created_at", { ascending: false })
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching problems:", error)
    throw error
  }

  return data
}

export async function getProblemById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("problems").select("*").eq("id", id).single()

  if (error) {
    console.error("[v0] Error fetching problem:", error)
    throw error
  }

  return data
}

export async function createProblem(formData: FormData) {
  const supabase = await createClient()

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const locationName = formData.get("locationName") as string
  const latitude = formData.get("latitude") as string
  const longitude = formData.get("longitude") as string
  const language = formData.get("language") as string

  // Handle file uploads (photos, videos, audio, documents)
  // For now, we'll use placeholder URLs - in production, upload to Supabase Storage
  const photos: string[] = []
  const videos: string[] = []
  const audio: string[] = []
  const documents: string[] = []

  // Simulate blockchain hash
  const blockchainHash = crypto.createHash("sha256").update(`${title}-${Date.now()}`).digest("hex")

  const { data, error } = await supabase
    .from("problems")
    .insert({
      title: title || "Untitled Report",
      description,
      category: category || "other",
      location_name: locationName,
      latitude: latitude ? Number.parseFloat(latitude) : null,
      longitude: longitude ? Number.parseFloat(longitude) : null,
      photos,
      videos,
      audio,
      documents,
      language: language || "english",
      blockchain_hash: blockchainHash,
      upvotes: 0,
      status: "reported",
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating problem:", error)
    throw error
  }

  revalidatePath("/")
  revalidatePath("/dashboard")

  return data
}

export async function upvoteProblem(problemId: string, voterIdentifier: string) {
  const supabase = await createClient()

  // Check if user already upvoted
  const { data: existingVote } = await supabase
    .from("upvotes")
    .select("id")
    .eq("problem_id", problemId)
    .eq("voter_identifier", voterIdentifier)
    .single()

  if (existingVote) {
    return { error: "Already upvoted", alreadyUpvoted: true }
  }

  // Generate blockchain hash
  const blockchainHash = crypto
    .createHash("sha256")
    .update(`${problemId}-${voterIdentifier}-${Date.now()}`)
    .digest("hex")

  // Add upvote record
  const { error: upvoteError } = await supabase.from("upvotes").insert({
    problem_id: problemId,
    voter_identifier: voterIdentifier,
    blockchain_hash: blockchainHash,
  })

  if (upvoteError) {
    console.error("[v0] Error adding upvote:", upvoteError)
    throw upvoteError
  }

  // Increment upvotes count
  const { data: problem } = await supabase.from("problems").select("upvotes").eq("id", problemId).single()

  const { error: updateError } = await supabase
    .from("problems")
    .update({ upvotes: (problem?.upvotes || 0) + 1 })
    .eq("id", problemId)

  if (updateError) {
    console.error("[v0] Error updating upvotes:", updateError)
    throw updateError
  }

  revalidatePath("/")
  revalidatePath("/dashboard")
  revalidatePath(`/problem/${problemId}`)

  return { success: true, blockchainHash }
}

export async function getComments(problemId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("problem_id", problemId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching comments:", error)
    throw error
  }

  return data
}

export async function addComment(problemId: string, authorName: string, content: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("comments")
    .insert({
      problem_id: problemId,
      author_name: authorName,
      content,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error adding comment:", error)
    throw error
  }

  revalidatePath(`/problem/${problemId}`)

  return data
}

export async function getStats() {
  const supabase = await createClient()

  const { count: totalReports } = await supabase.from("problems").select("*", { count: "exact", head: true })

  const { count: resolvedCount } = await supabase
    .from("problems")
    .select("*", { count: "exact", head: true })
    .eq("status", "resolved")

  const { data: upvotesData } = await supabase.from("problems").select("upvotes")

  const totalUpvotes = upvotesData?.reduce((sum, p) => sum + (p.upvotes || 0), 0) || 0

  const { data: categoriesData } = await supabase.from("problems").select("category")

  const activeCategories = new Set(categoriesData?.map((p) => p.category)).size

  return {
    totalReports: totalReports || 0,
    resolvedIssues: resolvedCount || 0,
    activeUsers: totalUpvotes, // Using upvotes as proxy for active users
    activeCategories,
  }
}
