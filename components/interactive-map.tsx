"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Problem } from "@/lib/types"
import { MapPin } from "lucide-react"

interface InteractiveMapProps {
  problems: Problem[]
}

export function InteractiveMap({ problems }: InteractiveMapProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative bg-muted" style={{ height: "600px" }}>
          {/* Placeholder map - In production, integrate with Mapbox/Google Maps */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4 p-8">
              <div className="mx-auto bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center">
                <MapPin className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Interactive Map</h3>
                <p className="text-muted-foreground max-w-md leading-relaxed">
                  This is a placeholder for the interactive map component. In production, this would show real GPS
                  coordinates on a map using Mapbox or Google Maps API.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {problems.slice(0, 5).map((problem) => (
                  <Badge key={problem.id} variant="secondary">
                    {problem.title}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Mock map markers */}
          <div className="absolute top-1/4 left-1/3 animate-bounce">
            <div className="bg-destructive text-destructive-foreground rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 animate-bounce" style={{ animationDelay: "0.2s" }}>
            <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
          <div className="absolute top-2/3 left-2/3 animate-bounce" style={{ animationDelay: "0.4s" }}>
            <div className="bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
