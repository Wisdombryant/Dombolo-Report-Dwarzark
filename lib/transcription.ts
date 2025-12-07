// Simulated AI Transcription Service
// In production, this would call an actual AI service like OpenAI Whisper, Google Speech-to-Text, etc.

export interface TranscriptionResult {
  originalLanguage: string
  transcribedText: string
  translatedText: string
  confidence: number
}

export async function transcribeAudio(audioBlob: Blob, language: string): Promise<TranscriptionResult> {
  // Simulate API processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock transcription based on language
  const mockTranscriptions: Record<string, { original: string; translated: string }> = {
    krio: {
      original: "Di road nar mi area don bad. Wi nid help fiks am.",
      translated: "The road in my area is damaged. We need help to fix it.",
    },
    mende: {
      original: "Ngila yɛlɛ ma kɔɔ wɔ. A lo ya lɔ kpɛ.",
      translated: "The water system is broken. It needs to be repaired.",
    },
    limba: {
      original: "Kanthabon ke fa banta kondaa. Ma na yɔŋo kɛ fa banta.",
      translated: "The street light is not working. We need it to be fixed.",
    },
    themne: {
      original: "A kath ka yɔnth a banta ra. Ma yɔnth kɛ sɔsɔ.",
      translated: "The bridge is damaged. We need repairs urgently.",
    },
    fullah: {
      original: "Ndiyan e waɗa, min mbaɗa wallafa ko.",
      translated: "The drainage is blocked, we need it to be cleared.",
    },
    english: {
      original: "There is a major pothole on Main Street that needs urgent attention.",
      translated: "There is a major pothole on Main Street that needs urgent attention.",
    },
  }

  const result = mockTranscriptions[language.toLowerCase()] || mockTranscriptions.english

  return {
    originalLanguage: language,
    transcribedText: result.original,
    translatedText: result.translated,
    confidence: 0.95,
  }
}

export function createAudioBase64(audioBlob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(",")[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(audioBlob)
  })
}
