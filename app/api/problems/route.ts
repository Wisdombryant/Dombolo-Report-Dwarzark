import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import crypto from "crypto"
import { transcribeAudio } from "@/lib/transcription"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const sortBy = searchParams.get("sortBy") || "recent"
    const search = searchParams.get("search")
    const isAdmin = searchParams.get("isAdmin") === "true"

    const supabase = await createClient()

    const selectFields = isAdmin
      ? "*" // Admin gets all fields including original_transcription and english_translation
      : "id, title, description, category, status, location_name, latitude, longitude, upvotes, photos, videos, audio, documents, reporter_language, blockchain_hash, created_at, updated_at"

    let query = supabase.from("problems").select(selectFields)

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
      photos,
      videos,
      documents,
    } = body

    const supabase = await createClient()

    let originalTranscription = null
    let englishTranslation = null
    const reporterLanguage = language || "english"

    if (audioBlob) {
      // In production, you would process the actual audio blob
      // For now, simulate transcription based on language
      const mockAudioBlob = new Blob(["mock audio"], { type: "audio/wav" })
      const transcriptionResult = await transcribeAudio(mockAudioBlob, reporterLanguage)

      originalTranscription = transcriptionResult.originalTranscription
      englishTranslation = transcriptionResult.englishTranslation

      console.log("[v0] Transcription completed:", {
        language: reporterLanguage,
        original: originalTranscription,
        translated: englishTranslation,
      })
    }

    // Generate blockchain hash
    const blockchainHash = crypto.createHash("sha256").update(`${title}-${Date.now()}`).digest("hex")

    const { data, error } = await supabase
      .from("problems")
      .insert({
        title: title || "Untitled Report",
        description: description || englishTranslation || originalTranscription || "",
        category: category || "infrastructure",
        location_name: locationName,
        latitude: latitude ? Number.parseFloat(latitude) : null,
        longitude: longitude ? Number.parseFloat(longitude) : null,
        photos: photos || [],
        videos: videos || [],
        audio: audioBlob ? ["audio_placeholder.wav"] : [],
        documents: documents || [],
        reporter_language: reporterLanguage,
        original_transcription: originalTranscription,
        english_translation: englishTranslation,
        blockchain_hash: blockchainHash,
        upvotes: 0,
        status: "reported",
      })
      .select()
      .single()

    if (error) throw error

    console.log("[v0] Problem created successfully with language data:", data.id)

    return NextResponse.json({ problem: data, blockchainHash }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating problem:", error)
    return NextResponse.json({ error: "Failed to create problem" }, { status: 500 })
  }
}
