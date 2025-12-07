"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation2 } from "lucide-react"
import { useState } from "react"

interface Problem {
  id: string
  title: string
  category: string
  status: string
  latitude: number | null
  longitude: number | null
  upvotes: number
}

interface InteractiveMapProps {
  problems: Problem[]
}

export function InteractiveMap({ problems }: InteractiveMapProps) {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null)

  const getMarkerColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-accent text-accent-foreground"
      case "in-progress":
        return "bg-secondary text-secondary-foreground"
      default:
        return "bg-primary text-primary-foreground"
    }
  }

  const getCategoryIcon = (category: string) => {
    // Returns position based on category for visual clustering
    const positions: Record<string, { top: string; left: string }> = {
      infrastructure: { top: "25%", left: "35%" },
      sanitation: { top: "45%", left: "55%" },
      safety: { top: "65%", left: "40%" },
      utilities: { top: "35%", left: "65%" },
    }
    return positions[category] || { top: "50%", left: "50%" }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative bg-gradient-to-br from-primary/5 to-accent/5" style={{ height: "600px" }}>
          {/* Map Header */}
          <div className="absolute top-4 left-4 z-10 bg-card/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Navigation2 className="h-5 w-5 text-primary" />
              <h3 className="font-bold">Live Problem Map</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>Reported ({problems.filter((p) => p.status === "reported").length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <span>In Progress ({problems.filter((p) => p.status === "in-progress").length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span>Resolved ({problems.filter((p) => p.status === "resolved").length})</span>
              </div>
            </div>
          </div>

          {/* Map Markers */}
          {problems.map((problem, index) => {
            const position = getCategoryIcon(problem.category)
            return (
              <button
                type="button"
                key={problem.id}
                className={`absolute transition-all hover:scale-125 cursor-pointer ${getMarkerColor(problem.status)} rounded-full w-10 h-10 flex items-center justify-center shadow-lg animate-bounce`}
                style={{
                  top: position.top,
                  left: position.left,
                  animationDelay: `${index * 0.1}s`,
                }}
                onClick={() => setSelectedProblem(problem)}
                aria-label={`View problem: ${problem.title}`}
              >
                <MapPin className="h-5 w-5" />
                {problem.upvotes > 10 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {problem.upvotes}
                  </Badge>
                )}
              </button>
            )
          })}

          {/* Problem Detail Popup */}
          {selectedProblem && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-card rounded-lg p-4 shadow-2xl max-w-sm w-full mx-4">
              <div className="flex items-start justify-between mb-2">
                <Badge variant="outline">{selectedProblem.category}</Badge>
                <button
                  type="button"
                  onClick={() => setSelectedProblem(null)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Close popup"
                >
                  ✕
                </button>
              </div>
              <h4 className="font-bold mb-2 line-clamp-2">{selectedProblem.title}</h4>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{selectedProblem.upvotes} upvotes</span>
                <Badge
                  variant={
                    selectedProblem.status === "resolved"
                      ? "default"
                      : selectedProblem.status === "in-progress"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {selectedProblem.status}
                </Badge>
              </div>
              <a
                href={`/problem/${selectedProblem.id}`}
                className="mt-3 block text-center text-sm font-medium text-primary hover:underline"
              >
                View Details →
              </a>
            </div>
          )}

          {/* Map Attribution */}
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-card/80 px-2 py-1 rounded">
            Dwarzark, Freetown
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
