import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    // Verify admin authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    // Fetch problem with all fields including translations
    const { data, error } = await supabase.from("problems").select("*").eq("id", params.id).single()

    if (error) throw error

    console.log("[v0] Admin fetched problem with translations:", params.id)

    return NextResponse.json({ problem: data })
  } catch (error) {
    console.error("[v0] Error fetching admin problem:", error)
    return NextResponse.json({ error: "Failed to fetch problem" }, { status: 500 })
  }
}
