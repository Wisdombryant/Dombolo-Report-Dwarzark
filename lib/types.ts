export interface Problem {
  id: string
  title: string
  description: string
  category: "infrastructure" | "sanitation" | "safety" | "utilities"
  status: "reported" | "in_progress" | "resolved" | "closed"
  location: string
  location_name?: string
  latitude?: number
  longitude?: number
  coordinates: {
    lat: number
    lng: number
  }
  upvotes: number
  comments?: number
  imageUrl?: string
  photos?: string[]
  videos?: string[]
  audio?: string[]
  documents?: string[]
  createdAt: string
  created_at?: string
  reportedBy?: string
  blockchain_hash?: string
  reporter_language?: string // Public field: language code
  original_transcription?: string // Admin-only: raw transcription in original language
  english_translation?: string // Admin-only: AI-generated English translation
  audio_transcription?: string // Deprecated, keeping for backward compatibility
}

export interface AdminProblem extends Problem {
  original_transcription: string
  english_translation: string
}
