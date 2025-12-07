"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getProblems } from "@/lib/actions/problems"
import { updateProblemStatus } from "@/lib/actions/admin"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search, Filter, ExternalLink, Loader2 } from "lucide-react"
import { format } from "date-fns"

interface Problem {
  id: string
  title: string
  category: string
  status: string
  upvotes: number
  created_at: string
  location_name: string
}

export function AdminProblemsTable() {
  const router = useRouter()
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  useEffect(() => {
    fetchProblems()
  }, [categoryFilter, statusFilter])

  async function fetchProblems() {
    try {
      const data = await getProblems({
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        sortBy: "recent",
      })
      setProblems(data as Problem[])
    } catch (error) {
      console.error("Failed to fetch problems:", error)
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
      console.error("Failed to update status:", error)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const filteredProblems = problems.filter((problem) => problem.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reported":
        return "bg-blue-500/10 text-blue-500"
      case "in-progress":
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
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Upvotes</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProblems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No reports found
                </TableCell>
              </TableRow>
            ) : (
              filteredProblems.map((problem) => (
                <TableRow key={problem.id}>
                  <TableCell className="font-medium">{problem.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {problem.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{problem.location_name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{problem.upvotes}</Badge>
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
                        {updatingStatus === problem.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <SelectValue />}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reported">Reported</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/problems/${problem.id}`)}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
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
