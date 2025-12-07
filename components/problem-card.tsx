"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, MessageSquare } from "lucide-react"
import type { Problem } from "@/lib/types"
import { UpvoteButton } from "@/components/upvote-button"

interface ProblemCardProps {
  problem: Problem
}

export function ProblemCard({ problem }: ProblemCardProps) {
  const categoryColors: Record<string, string> = {
    infrastructure: "bg-primary/10 text-primary",
    sanitation: "bg-accent/10 text-accent",
    safety: "bg-destructive/10 text-destructive",
    utilities: "bg-secondary/10 text-secondary",
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {problem.imageUrl && (
        <div className="aspect-video relative overflow-hidden bg-muted">
          <img
            src={problem.imageUrl || "/placeholder.svg"}
            alt={problem.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge className={categoryColors[problem.category] || "bg-muted"}>{problem.category}</Badge>
          <Badge variant={problem.status === "resolved" ? "default" : "secondary"}>{problem.status}</Badge>
        </div>
        <h3 className="font-bold text-lg leading-tight line-clamp-2">{problem.title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{problem.description}</p>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{problem.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(problem.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-4 border-t pt-4">
        <UpvoteButton problemId={problem.id} currentUpvotes={problem.upvotes} />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          <span>{problem.comments || 0}</span>
        </div>
        <Link href={`/problem/${problem.id}`}>
          <Button variant="ghost" size="sm">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
