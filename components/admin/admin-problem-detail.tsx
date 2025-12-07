"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateProblemStatus } from "@/lib/actions/admin"
import { ArrowLeft, MapPin, Calendar, ThumbsUp, Globe, Languages, Shield, Loader2 } from "lucide-react"
import { format } from "date-fns"
import type { AdminProblem } from "@/lib/types"
import { SeverityBadge } from "./severity-badge"
import { AdminOverrideControl } from "./admin-override-control"
import type { SeverityLevel } from "@/lib/utils/severity"

interface AdminProblemDetailProps {
  problemId: string
}

export function AdminProblemDetail({ problemId }: AdminProblemDetailProps) {
  const router = useRouter()
  const [problem, setProblem] = useState<AdminProblem | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    fetchProblem()
  }, [problemId])

  async function fetchProblem() {
    try {
      const response = await fetch(`/api/admin/problems/${problemId}`)
      if (!response.ok) throw new Error("Failed to fetch problem")
      const data = await response.json()
      setProblem(data.problem)
    } catch (error) {
      console.error("[v0] Error fetching problem:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!problem) return
    setUpdatingStatus(true)
    try {
      await updateProblemStatus(problem.id, newStatus)
      await fetchProblem()
      router.refresh()
    } catch (error) {
      console.error("[v0] Failed to update status:", error)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reported":
        return "bg-blue-500/10 text-blue-500"
      case "in_progress":
        return "bg-yellow-500/10 text-yellow-500"
      case "resolved":
        return "bg-green-500/10 text-green-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading problem details...</p>
        </div>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Problem not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.push("/admin")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admin Dashboard
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Problem Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-2xl">{problem.title}</CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="capitalize">
                        {problem.category}
                      </Badge>
                      <Badge className={getStatusColor(problem.status)}>{problem.status}</Badge>
                      <SeverityBadge
                        upvotes={problem.upvotes}
                        adminOverride={problem.admin_priority_override as SeverityLevel | null}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Public Description</h3>
                  <p className="text-muted-foreground">{problem.description}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{problem.location_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{format(new Date(problem.created_at!), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                    <span>{problem.upvotes} upvotes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {problem.latitude?.toFixed(6)}, {problem.longitude?.toFixed(6)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admin-Only: Language & Translation */}
            {(problem.original_transcription || problem.english_translation) && (
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <CardTitle>Admin-Only: Language Data</CardTitle>
                  </div>
                  <CardDescription>This information is only visible to administrators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Languages className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">Reporter Language</span>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {problem.reporter_language || "english"}
                    </Badge>
                  </div>

                  {problem.original_transcription && (
                    <div>
                      <h4 className="font-semibold mb-2">Original Transcription ({problem.reporter_language})</h4>
                      <div className="bg-background rounded-lg p-4 border">
                        <p className="text-sm">{problem.original_transcription}</p>
                      </div>
                    </div>
                  )}

                  {problem.english_translation && (
                    <div>
                      <h4 className="font-semibold mb-2">English Translation (AI-Generated)</h4>
                      <div className="bg-background rounded-lg p-4 border">
                        <p className="text-sm">{problem.english_translation}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Media */}
            {(problem.photos?.length || problem.audio?.length) && (
              <Card>
                <CardHeader>
                  <CardTitle>Attachments</CardTitle>
                </CardHeader>
                <CardContent>
                  {problem.photos && problem.photos.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Photos</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {problem.photos.map((photo, idx) => (
                          <div key={idx} className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                            <span className="text-sm text-muted-foreground">{photo}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {problem.audio && problem.audio.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Audio Recordings</h4>
                      <div className="space-y-2">
                        {problem.audio.map((audio, idx) => (
                          <div key={idx} className="p-3 bg-muted rounded-lg">
                            <span className="text-sm">{audio}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Priority Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Override the automatic priority based on upvotes</p>
                  <AdminOverrideControl
                    problemId={problem.id}
                    currentOverride={problem.admin_priority_override as SeverityLevel | null}
                    currentReason={problem.admin_override_reason}
                    onUpdate={fetchProblem}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Status Management */}
            <Card>
              <CardHeader>
                <CardTitle>Status Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Update Status</label>
                  <Select value={problem.status} onValueChange={handleStatusChange} disabled={updatingStatus}>
                    <SelectTrigger className={getStatusColor(problem.status)}>
                      {updatingStatus ? <Loader2 className="h-4 w-4 animate-spin" /> : <SelectValue />}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reported">Reported</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => router.push(`/problem/${problem.id}`)}
                >
                  View Public Page
                </Button>
              </CardContent>
            </Card>

            {/* Blockchain Info */}
            {problem.blockchain_hash && (
              <Card>
                <CardHeader>
                  <CardTitle>Blockchain Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Hash</p>
                    <p className="text-xs font-mono break-all bg-muted p-2 rounded">{problem.blockchain_hash}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
