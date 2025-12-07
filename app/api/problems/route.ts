import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import crypto from "crypto"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const sortBy = searchParams.get("sortBy") || "recent"
    const search = searchParams.get("search")

    const supabase = await createClient()
    let query = supabase.from("problems").select("*")

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (sortBy === "upvotes") {
      query = query.order("upvotes", { ascending: false })
    } else {
      query = query.order("created_at", { ascending: false })
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ problems: data })
  } catch (error) {
    console.error("[v0] Error fetching problems:", error)
    return NextResponse.json({ error: "Failed to fetch problems" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      category,
      locationName,
      latitude,
      longitude,
      language,
      audioBlob,
      audioTranscription,
      photos,
      videos,
      documents,
    } = body

    const supabase = await createClient()

    // Generate blockchain hash
    const blockchainHash = crypto.createHash("sha256").update(`${title}-${Date.now()}`).digest("hex")

    // In production, upload media files to Supabase Storage
    // For now, use placeholder URLs
    const mediaUrls = {
      photos: photos || [],
      videos: videos || [],
      audio: audioBlob ? ["audio_url_placeholder"] : [],
      documents: documents || [],
    }

    const { data, error } = await supabase
      .from("problems")
      .insert({
        title: title || "Untitled Report",
        description: description || audioTranscription || "",
        category: category || "other",
        location_name: locationName,
        latitude: latitude ? Number.parseFloat(latitude) : null,
        longitude: longitude ? Number.parseFloat(longitude) : null,
        photos: mediaUrls.photos,
        videos: mediaUrls.videos,
        audio: mediaUrls.audio,
        documents: mediaUrls.documents,
        language: language || "english",
        blockchain_hash: blockchainHash,
        upvotes: 0,
        status: "reported",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ problem: data, blockchainHash }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating problem:", error)
    return NextResponse.json({ error: "Failed to create problem" }, { status: 500 })
  }
}
