"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { VoiceRecorder } from "@/components/voice-recorder"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Camera, Video, FileText, MapPin, Upload, CheckCircle2, Loader2 } from "lucide-react"

export default function ReportPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [location, setLocation] = useState<string>("")
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const photoInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const documentInputRef = useRef<HTMLInputElement>(null)

  const [uploadedFiles, setUploadedFiles] = useState<{
    photos: File[]
    videos: File[]
    documents: File[]
  }>({
    photos: [],
    videos: [],
    documents: [],
  })

  const [audioRecording, setAudioRecording] = useState<{
    blob: Blob | null
    transcription: string
  }>({
    blob: null,
    transcription: "",
  })

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    language: "english",
  })

  const handleFileUpload = (type: "photos" | "videos" | "documents", files: FileList | null) => {
    if (files && files.length > 0) {
      const newFiles = Array.from(files)
      setUploadedFiles((prev) => ({
        ...prev,
        [type]: [...prev[type], ...newFiles],
      }))
    }
  }

  const getLocation = () => {
    setIsGettingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          setCoordinates({ lat, lng })
          setLocation(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
          setIsGettingLocation(false)
        },
        (error) => {
          console.error("[v0] Geolocation error:", error)
          // Fallback to Dwarzark approximate location
          setCoordinates({ lat: 8.4657, lng: -13.2317 })
          setLocation("8.4657, -13.2317 (Dwarzark, Freetown)")
          setIsGettingLocation(false)
        },
      )
    } else {
      setCoordinates({ lat: 8.4657, lng: -13.2317 })
      setLocation("8.4657, -13.2317 (Dwarzark, Freetown)")
      setIsGettingLocation(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        title: formData.title,
        description: formData.description || audioRecording.transcription,
        category: formData.category,
        locationName: location,
        latitude: coordinates?.lat?.toString(),
        longitude: coordinates?.lng?.toString(),
        language: formData.language,
        audioBlob: audioRecording.blob ? "audio_blob_placeholder" : null,
        audioTranscription: audioRecording.transcription,
        photos: uploadedFiles.photos.map((f) => f.name),
        videos: uploadedFiles.videos.map((f) => f.name),
        documents: uploadedFiles.documents.map((f) => f.name),
      }

      const response = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Failed to submit report")

      const result = await response.json()
      console.log("[v0] Problem report submitted:", result)

      setIsSubmitting(false)
      setIsSuccess(true)

      setTimeout(() => {
        router.push(`/problem/${result.problem.id}`)
      }, 2000)
    } catch (error) {
      console.error("[v0] Error submitting report:", error)
      setIsSubmitting(false)
      alert("Failed to submit report. Please try again.")
    }
  }

  const handleRecordingComplete = (blob: Blob, transcription: string) => {
    setAudioRecording({ blob, transcription })
    if (!formData.description) {
      setFormData({ ...formData, description: transcription })
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="pt-12 pb-12">
              <div className="mx-auto bg-accent/10 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="h-10 w-10 text-accent" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Report Submitted Successfully!</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Your report has been recorded on the blockchain and will be visible to the community shortly. Thank you
                for helping improve Dwarzark!
              </p>
              <Button onClick={() => router.push("/dashboard")} variant="secondary">
                View All Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-balance">Report a Problem</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Help improve our community by reporting local issues. Your report will be reviewed and shared with the
              community.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Language Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Select Language</CardTitle>
                <CardDescription>Choose your preferred language for transcription</CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.language}
                  onValueChange={(value) => setFormData({ ...formData, language: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="krio">Krio</SelectItem>
                    <SelectItem value="mende">Mende</SelectItem>
                    <SelectItem value="limba">Limba</SelectItem>
                    <SelectItem value="themne">Themne</SelectItem>
                    <SelectItem value="fullah">Fullah</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <VoiceRecorder language={formData.language} onRecordingComplete={handleRecordingComplete} />

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Problem Details</CardTitle>
                <CardDescription>Describe the issue you're reporting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Problem Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Broken street light on Main Road"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="sanitation">Sanitation</SelectItem>
                      <SelectItem value="safety">Safety</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed information about the problem..."
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  {audioRecording.transcription && (
                    <p className="text-xs text-muted-foreground mt-2">Auto-filled from voice recording</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Media Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Add Media (Optional)</CardTitle>
                <CardDescription>Photos, videos, or documents help provide context</CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload("photos", e.target.files)}
                />
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload("videos", e.target.files)}
                />
                <input
                  ref={documentInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload("documents", e.target.files)}
                />

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-24 flex-col gap-2 bg-transparent relative"
                    onClick={() => photoInputRef.current?.click()}
                  >
                    <Camera className="h-6 w-6" />
                    <span className="text-xs">Photo</span>
                    {uploadedFiles.photos.length > 0 && (
                      <Badge variant="secondary" className="absolute top-2 right-2">
                        {uploadedFiles.photos.length}
                      </Badge>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-24 flex-col gap-2 bg-transparent relative"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <Video className="h-6 w-6" />
                    <span className="text-xs">Video</span>
                    {uploadedFiles.videos.length > 0 && (
                      <Badge variant="secondary" className="absolute top-2 right-2">
                        {uploadedFiles.videos.length}
                      </Badge>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-24 flex-col gap-2 bg-transparent relative"
                    onClick={() => documentInputRef.current?.click()}
                  >
                    <FileText className="h-6 w-6" />
                    <span className="text-xs">Document</span>
                    {uploadedFiles.documents.length > 0 && (
                      <Badge variant="secondary" className="absolute top-2 right-2">
                        {uploadedFiles.documents.length}
                      </Badge>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>Help us identify where the problem is located</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="GPS coordinates will appear here" value={location} readOnly />
                  <Button type="button" onClick={getLocation} disabled={isGettingLocation} variant="secondary">
                    {isGettingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                  </Button>
                </div>
                {location && (
                  <Badge variant="secondary" className="bg-accent/10 text-accent-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    Location captured
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Submit */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-primary/10 rounded-full p-2 mt-1">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Blockchain Verification</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Your report will be recorded on the blockchain to ensure transparency and prevent manipulation
                    </p>
                  </div>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting} variant="secondary">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting Report...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-5 w-5" />
                      Submit Report
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
