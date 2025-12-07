// Component for admins to manually override severity levels
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Shield, X } from "lucide-react"
import { updateAdminPriorityOverride } from "@/lib/actions/admin"
import type { SeverityLevel } from "@/lib/utils/severity"

interface AdminOverrideControlProps {
  problemId: string
  currentOverride?: SeverityLevel | null
  currentReason?: string | null
  onUpdate?: () => void
}

export function AdminOverrideControl({
  problemId,
  currentOverride,
  currentReason,
  onUpdate,
}: AdminOverrideControlProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<SeverityLevel | "">(currentOverride || "")
  const [reason, setReason] = useState(currentReason || "")

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await updateAdminPriorityOverride(problemId, selectedLevel || null, reason || null)
      setOpen(false)
      onUpdate?.()
    } catch (error) {
      console.error("Failed to update override:", error)
      alert("Failed to update priority override")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemove = async () => {
    setIsSubmitting(true)
    try {
      await updateAdminPriorityOverride(problemId, null, null)
      setSelectedLevel("")
      setReason("")
      setOpen(false)
      onUpdate?.()
    } catch (error) {
      console.error("Failed to remove override:", error)
      alert("Failed to remove priority override")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={currentOverride ? "secondary" : "outline"} size="sm" className="gap-2">
          <Shield className="h-4 w-4" />
          {currentOverride ? "Edit Override" : "Set Priority"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Admin Priority Override</DialogTitle>
          <DialogDescription>
            Manually set the priority level for this problem, overriding the upvote-based severity calculation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="priority-level">Priority Level</Label>
            <Select value={selectedLevel} onValueChange={(value) => setSelectedLevel(value as SeverityLevel | "")}>
              <SelectTrigger id="priority-level">
                <SelectValue placeholder="Select priority level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical (Immediate Action)</SelectItem>
                <SelectItem value="high">High (Elevated Priority)</SelectItem>
                <SelectItem value="moderate">Moderate (Monitoring)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Override</Label>
            <Textarea
              id="reason"
              placeholder="Explain why you're overriding the automatic priority..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {currentOverride && (
            <Button variant="destructive" onClick={handleRemove} disabled={isSubmitting} className="gap-2 sm:mr-auto">
              <X className="h-4 w-4" />
              Remove Override
            </Button>
          )}
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedLevel || isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Override"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
