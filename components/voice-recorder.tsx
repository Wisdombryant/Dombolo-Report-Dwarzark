"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, Square, Play, Trash2, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { transcribeAudio } from "@/lib/transcription"

interface VoiceRecorderProps {
  language: string
  onRecordingComplete: (audioBlob: Blob, transcription: string) => void
}

export function VoiceRecorder({ language, onRecordingComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcription, setTranscription] = useState<string>("")
  const [duration, setDuration] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)

        setIsTranscribing(true)
        try {
          const result = await transcribeAudio(blob, language)
          const displayText =
            language === "english"
              ? result.englishTranslation
              : `${result.originalTranscription}\n(English: ${result.englishTranslation})`
          setTranscription(displayText)

          console.log("[v0] Transcription completed:", {
            language: result.originalLanguage,
            original: result.originalTranscription,
            translation: result.englishTranslation,
          })

          onRecordingComplete(blob, result.englishTranslation)
        } catch (error) {
          console.error("[v0] Transcription error:", error)
        } finally {
          setIsTranscribing(false)
        }

        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setDuration(0)

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("[v0] Error accessing microphone:", error)
      alert("Unable to access microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const playRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl)
      audio.play()
    }
  }

  const deleteRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setAudioBlob(null)
    setAudioUrl(null)
    setTranscription("")
    setDuration(0)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Voice Recording</h3>
              <p className="text-sm text-muted-foreground">
                Record your report in {language === "english" ? "English" : language}
              </p>
            </div>
            {isRecording && (
              <Badge variant="destructive" className="animate-pulse">
                Recording {formatDuration(duration)}
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            {!isRecording && !audioBlob && (
              <Button onClick={startRecording} className="flex-1" variant="secondary">
                <Mic className="mr-2 h-4 w-4" />
                Start Recording
              </Button>
            )}

            {isRecording && (
              <Button onClick={stopRecording} className="flex-1" variant="destructive">
                <Square className="mr-2 h-4 w-4" />
                Stop Recording
              </Button>
            )}

            {audioBlob && !isRecording && (
              <>
                <Button onClick={playRecording} variant="outline" className="flex-1 bg-transparent">
                  <Play className="mr-2 h-4 w-4" />
                  Play
                </Button>
                <Button onClick={deleteRecording} variant="outline">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {isTranscribing && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Transcribing and translating audio from {language}...
            </div>
          )}

          {transcription && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium mb-2">Transcription:</p>
              <p className="text-sm whitespace-pre-line">{transcription}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
