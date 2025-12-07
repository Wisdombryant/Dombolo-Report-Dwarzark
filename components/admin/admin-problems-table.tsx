"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { updateProblemStatus } from "@/lib/actions/admin"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search, Filter, ExternalLink, Loader2, Languages } from "lucide-react"
import { format } from "date-fns"
import { SeverityBadge } from "./severity-badge"
import { AdminOverrideControl } from "./admin-override-control"
import { getSeverityInfo, getSeverityRowColor, type SeverityLevel } from "@/lib/utils/severity"

interface AdminProblem {
  id: string
  title: string
  category: string
  status: string
  upvotes: number
  created_at: string
  location_name: string
  reporter_language?: string
  original_transcription?: string
  english_translation?: string
  admin_priority_override?: SeverityLevel | null
  admin_override_reason?: string | null
}

export function AdminProblemsTable() {
  const router = useRouter()
  const [problems, setProblems] = useState<AdminProblem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  useEffect(() => {
    fetchProblems()
  }, [categoryFilter, statusFilter])

  async function fetchProblems() {
    try {
      const params = new URLSearchParams()
      if (categoryFilter !== "all") params.append("category", categoryFilter)
      if (statusFilter !== "all") params.append("status", statusFilter)

      const response = await fetch(`/api/admin/problems?${params.toString()}`)
      if (!response.ok) throw new Error("Failed to fetch problems")

      const data = await response.json()
      setProblems(data.problems)
      console.log("[v0] Admin fetched problems with severity data")
    } catch (error) {
      console.error("[v0] Failed to fetch problems:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(problemId: string, newStatus: string) {
    setUpdatingStatus(problemId)
    try {
      await updateProblemStatus(problemId, newStatus)
      await fetchProblems()
      router.refresh()
    } catch (error) {
      console.error("[v0] Failed to update status:", error)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const filteredProblems = problems
    .filter((problem) => problem.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((problem) => {
      if (severityFilter === "all") return true
      const severity = getSeverityInfo(problem.upvotes, problem.admin_priority_override)
      return severity.level === severityFilter
    })
    .sort((a, b) => {
      // Sort by severity: critical > high > moderate, then by upvotes
      const aSeverity = getSeverityInfo(a.upvotes, a.admin_priority_override)
      const bSeverity = getSeverityInfo(b.upvotes, b.admin_priority_override)

      const severityOrder = { critical: 3, high: 2, moderate: 1 }
      const severityDiff = severityOrder[bSeverity.level] - severityOrder[aSeverity.level]

      if (severityDiff !== 0) return severityDiff
      return b.upvotes - a.upvotes
    })

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
    return <div className="text-center py-8">Loading reports...</div>
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
          </SelectContent>
        </Select>
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
            <SelectItem value="reported">Reported</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Severity</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Upvotes</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProblems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                  No reports found
                </TableCell>
              </TableRow>
            ) : (
              filteredProblems.map((problem) => {
                const severity = getSeverityInfo(problem.upvotes, problem.admin_priority_override)
                return (
                  <TableRow key={problem.id} className={getSeverityRowColor(severity.level)}>
                    <TableCell>
                      <SeverityBadge upvotes={problem.upvotes} adminOverride={problem.admin_priority_override} />
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">{problem.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {problem.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Languages className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs capitalize">{problem.reporter_language || "english"}</span>
                        {problem.english_translation && (
                          <Badge variant="secondary" className="text-xs">
                            Translated
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{problem.location_name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-semibold">
                        {problem.upvotes}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(problem.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={problem.status}
                        onValueChange={(value) => handleStatusChange(problem.id, value)}
                        disabled={updatingStatus === problem.id}
                      >
                        <SelectTrigger className={`w-[140px] ${getStatusColor(problem.status)}`}>
                          {updatingStatus === problem.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <SelectValue />
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reported">Reported</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <AdminOverrideControl
                        problemId={problem.id}
                        currentOverride={problem.admin_priority_override}
                        currentReason={problem.admin_override_reason}
                        onUpdate={fetchProblems}
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/problems/${problem.id}`)}>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredProblems.length} of {problems.length} reports
      </div>
    </div>
  )
}
