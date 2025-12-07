"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { ProblemCard } from "@/components/problem-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, List, Search, Filter } from "lucide-react"
import { useProblemStore } from "@/lib/store"
import { InteractiveMap } from "@/components/interactive-map"

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const problems = useProblemStore((state) => state.problems)

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || problem.category === categoryFilter
    const matchesStatus = statusFilter === "all" || problem.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Community Dashboard</h1>
          <p className="text-muted-foreground text-lg">View and track all reported issues in Dwarzark</p>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search problems..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="sanitation">Sanitation</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredProblems.length} of {problems.length} problems
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="list">
              <List className="h-4 w-4 mr-2" />
              List View
            </TabsTrigger>
            <TabsTrigger value="map">
              <MapPin className="h-4 w-4 mr-2" />
              Map View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProblems.map((problem) => (
                <ProblemCard key={problem.id} problem={problem} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="map">
            <InteractiveMap problems={filteredProblems} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
