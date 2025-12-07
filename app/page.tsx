import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, MapPin, Users, TrendingUp } from "lucide-react"
import { ProblemCard } from "@/components/problem-card"
import { StatsGrid } from "@/components/stats-grid"
import { Navigation } from "@/components/navigation"
import { mockProblems } from "@/lib/mock-data"

export default function HomePage() {
  const recentProblems = [...mockProblems].sort((a, b) => b.upvotes - a.upvotes).slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="text-sm">
              Dwarzark Community • Freetown
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
              Your Voice Matters in Our Community
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
              Report local problems, support community concerns, and help create positive change in Dwarzark. Together,
              we build a better neighborhood.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/report">
                <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Report a Problem
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                  <MapPin className="mr-2 h-5 w-5" />
                  View Problems Map
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b bg-card">
        <div className="container mx-auto px-4">
          <StatsGrid />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
              Simple, transparent, and effective community problem-solving
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Report Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-relaxed">
                  Share problems using photos, videos, text, or voice recordings in your preferred language
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle>Community Upvotes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-relaxed">
                  Support issues that matter to you. Blockchain-verified voting ensures transparency
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <CardTitle>Create Change</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-relaxed">
                  Your reports create a data-driven priority list for local government action
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Problems */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Top Priority Issues</h2>
              <p className="text-muted-foreground">Most upvoted problems from the community</p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProblems.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Ready to Make a Difference?</h2>
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto text-balance leading-relaxed">
            Join hundreds of Dwarzark residents working together to improve our community
          </p>
          <Link href="/report">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              <AlertCircle className="mr-2 h-5 w-5" />
              Report Your First Issue
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Dwarzark Platform</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Community-driven civic engagement platform for Dwarzark Community, Freetown, Sierra Leone
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/report" className="text-muted-foreground hover:text-foreground">
                    Report Problem
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
                    View Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Languages Supported</h3>
              <p className="text-muted-foreground text-sm">English, Krio, Mende, Limba, Themne</p>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Dwarzark Community Platform. Building a better Freetown together.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
