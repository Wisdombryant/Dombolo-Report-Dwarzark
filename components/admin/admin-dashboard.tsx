"use client"
import type { User } from "@supabase/supabase-js"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminStats } from "./admin-stats"
import { AdminProblemsTable } from "./admin-problems-table"
import { Shield, BarChart3, Settings } from "lucide-react"

interface AdminDashboardProps {
  user: User
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-primary text-primary-foreground rounded-lg p-2">
              <Shield className="h-6 w-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground text-lg">Manage and moderate community reports for Dwarzark</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="reports">
              <Settings className="h-4 w-4 mr-2" />
              Reports Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AdminStats />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Reports</CardTitle>
                <CardDescription>View, filter, and manage all community problem reports</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminProblemsTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
