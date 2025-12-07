// Utility for calculating problem severity based on upvotes and admin overrides

export type SeverityLevel = "critical" | "high" | "moderate"

export interface SeverityInfo {
  level: SeverityLevel
  color: string
  bgColor: string
  label: string
  description: string
  isAdminOverride: boolean
}

// Configurable thresholds
export const SEVERITY_THRESHOLDS = {
  CRITICAL: 100, // >= 100 votes
  HIGH: 20, // 20-99 votes
  MODERATE: 0, // 0-19 votes
} as const

/**
 * Calculate severity level based on upvotes
 */
export function calculateSeverityFromUpvotes(upvotes: number): SeverityLevel {
  if (upvotes >= SEVERITY_THRESHOLDS.CRITICAL) {
    return "critical"
  }
  if (upvotes >= SEVERITY_THRESHOLDS.HIGH) {
    return "high"
  }
  return "moderate"
}

/**
 * Get complete severity information for a problem
 * Respects admin overrides if present
 */
export function getSeverityInfo(upvotes: number, adminOverride?: SeverityLevel | null): SeverityInfo {
  const level = adminOverride || calculateSeverityFromUpvotes(upvotes)
  const isAdminOverride = !!adminOverride

  const severityMap: Record<SeverityLevel, Omit<SeverityInfo, "level" | "isAdminOverride">> = {
    critical: {
      color: "text-red-600",
      bgColor: "bg-red-50 border-red-200",
      label: "Critical Severity",
      description: "Immediate action required",
    },
    high: {
      color: "text-amber-600",
      bgColor: "bg-amber-50 border-amber-200",
      label: "High Concern",
      description: "Elevated priority",
    },
    moderate: {
      color: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-200",
      label: "Moderate Concern",
      description: "Monitoring status",
    },
  }

  return {
    level,
    isAdminOverride,
    ...severityMap[level],
  }
}

/**
 * Get severity badge color classes
 */
export function getSeverityBadgeColor(level: SeverityLevel): string {
  const colors = {
    critical: "bg-red-500 text-white border-red-600",
    high: "bg-amber-500 text-white border-amber-600",
    moderate: "bg-blue-500 text-white border-blue-600",
  }
  return colors[level]
}

/**
 * Get severity row background color for tables
 */
export function getSeverityRowColor(level: SeverityLevel): string {
  const colors = {
    critical: "bg-red-50/50 hover:bg-red-100/50 border-l-4 border-l-red-500",
    high: "bg-amber-50/50 hover:bg-amber-100/50 border-l-4 border-l-amber-500",
    moderate: "bg-blue-50/50 hover:bg-blue-100/50 border-l-4 border-l-blue-500",
  }
  return colors[level]
}
