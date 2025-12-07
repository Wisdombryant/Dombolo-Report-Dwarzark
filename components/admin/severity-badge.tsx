// Component for displaying severity levels with color coding
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, AlertCircle, Info, Shield } from "lucide-react"
import { getSeverityInfo, type SeverityLevel } from "@/lib/utils/severity"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SeverityBadgeProps {
  upvotes: number
  adminOverride?: SeverityLevel | null
  showDetails?: boolean
}

export function SeverityBadge({ upvotes, adminOverride, showDetails = false }: SeverityBadgeProps) {
  const severity = getSeverityInfo(upvotes, adminOverride)

  const icons = {
    critical: AlertTriangle,
    high: AlertCircle,
    moderate: Info,
  }

  const Icon = icons[severity.level]

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={`gap-1.5 ${severity.color} ${severity.bgColor} border`}>
            <Icon className="h-3.5 w-3.5" />
            {severity.label}
            {severity.isAdminOverride && <Shield className="h-3 w-3 text-purple-600" />}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs space-y-1">
            <p className="font-semibold">{severity.description}</p>
            <p className="text-muted-foreground">
              {upvotes} upvote{upvotes !== 1 ? "s" : ""}
            </p>
            {severity.isAdminOverride && <p className="text-purple-600 font-medium">Admin Override Active</p>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
