"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, User, MessageSquare, ArrowLeft, Shield } from "lucide-react"
import { UpvoteButton } from "@/components/upvote-button"
import Link from "next/link"
import type { Problem } from "@/lib/types"

export default function ProblemDetailPage({ params }: { params: { id: string } }) {
  const [problem, setProblem] = useState<Problem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProblem() {
      try {
        const response = await fetch(`/api/problems/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setProblem(data)
        } else {
          setProblem(null)
        }
      } catch (error) {
        console.error("[v0] Error fetching problem:", error)
        setProblem(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProblem()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Problem Not Found</h1>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {problem.imageUrl && (
              <Card className="overflow-hidden">
                <img
                  src={problem.imageUrl || "/placeholder.svg"}
                  alt={problem.title}
                  className="w-full aspect-video object-cover"
                />
              </Card>
            )}

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex gap-2 flex-wrap">
                    <Badge>{problem.category}</Badge>
                    <Badge variant={problem.status === "resolved" ? "default" : "secondary"}>{problem.status}</Badge>
                  </div>
                </div>
                <CardTitle className="text-3xl">{problem.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg leading-relaxed">{problem.description}</p>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{problem.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(problem.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Anonymous Reporter</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  <span>No comments yet. Be the first to comment!</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Community Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <UpvoteButton problemId={problem.id} currentUpvotes={problem.upvotes} />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Show support for this issue by upvoting. All votes are blockchain-verified for transparency.
                </p>
                {problem.blockchain_hash && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-green-700">Report Verified</p>
                        <p className="text-xs text-green-600 font-mono break-all mt-1">
                          {problem.blockchain_hash.substring(0, 24)}...
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center p-4">
                    <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Map integration placeholder</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Lat: {problem.coordinates.lat}, Lng: {problem.coordinates.lng}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Report Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge>{problem.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Category</span>
                  <span className="text-sm font-medium">{problem.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Upvotes</span>
                  <span className="text-sm font-medium">{problem.upvotes}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
