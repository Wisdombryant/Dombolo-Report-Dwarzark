"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getAdminStats() {
  const supabase = await createClient()

  const { count: totalReports } = await supabase.from("problems").select("*", { count: "exact", head: true })

  const { count: openReports } = await supabase
    .from("problems")
    .select("*", { count: "exact", head: true })
    .in("status", ["reported", "in-progress"])

  const { count: resolvedReports } = await supabase
    .from("problems")
    .select("*", { count: "exact", head: true })
    .eq("status", "resolved")

  const resolutionRate = totalReports ? Math.round((resolvedReports! / totalReports) * 100) : 0

  return {
    totalReports: totalReports || 0,
    openReports: openReports || 0,
    resolvedReports: resolvedReports || 0,
    resolutionRate,
  }
}

export async function updateProblemStatus(problemId: string, status: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const updateData: any = { status }

  if (status === "resolved") {
    updateData.resolved_at = new Date().toISOString()
    updateData.resolved_by = user.id
  }

  const { error } = await supabase.from("problems").update(updateData).eq("id", problemId)

  if (error) {
    console.error("[v0] Error updating problem status:", error)
    throw error
  }

  revalidatePath("/admin")
  revalidatePath("/dashboard")
  revalidatePath(`/problem/${problemId}`)

  return { success: true }
}

export async function getAdminNotes(problemId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("admin_notes")
    .select("*, profiles(full_name)")
    .eq("problem_id", problemId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching admin notes:", error)
    throw error
  }

  return data
}

export async function addAdminNote(problemId: string, note: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("admin_notes")
    .insert({
      problem_id: problemId,
      admin_id: user.id,
      note,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error adding admin note:", error)
    throw error
  }

  revalidatePath(`/admin/problems/${problemId}`)

  return data
}

export async function submitFeedback(problemId: string, rating: number, comment: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("feedback")
    .insert({
      problem_id: problemId,
      rating,
      comment,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error submitting feedback:", error)
    throw error
  }

  revalidatePath(`/problem/${problemId}`)

  return data
}

export async function getFeedback(problemId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .eq("problem_id", problemId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching feedback:", error)
    throw error
  }

  return data
}
