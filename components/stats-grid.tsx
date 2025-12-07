import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, CheckCircle, TrendingUp, Users } from "lucide-react"

export function StatsGrid() {
  const stats = [
    {
      label: "Total Reports",
      value: "247",
      icon: AlertCircle,
      color: "text-primary",
    },
    {
      label: "Resolved Issues",
      value: "89",
      icon: CheckCircle,
      color: "text-accent",
    },
    {
      label: "Active Community",
      value: "1,432",
      icon: Users,
      color: "text-secondary",
    },
    {
      label: "Resolution Rate",
      value: "36%",
      icon: TrendingUp,
      color: "text-chart-4",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
