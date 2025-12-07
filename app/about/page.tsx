import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Shield, Users, Zap } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 rounded-xl overflow-hidden border shadow-lg">
            <img
              src="/vibrant-freetown-sierra-leone-community-market-sce.jpg"
              alt="Dwarzark Community"
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>

          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-4">
              About Us
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Building a Better Dwarzark Together</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
              A community-driven platform empowering residents to report issues, collaborate on solutions, and create
              lasting positive change in Freetown.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Inclusive & Accessible</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Supporting Krio, Mende, Limba, and Themne languages with low-bandwidth design for rural communities
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-secondary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Blockchain Verified</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Transparent upvoting system powered by blockchain technology to prevent manipulation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Community Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Real-time priority list created by community upvotes to guide government action
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-chart-4/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-chart-4" />
                </div>
                <CardTitle>Fast & Simple</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  No authentication required. Report problems via photo, video, text, or voice in seconds
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                The Dwarzark Community Platform was created to bridge the gap between citizens and local government in
                Freetown, Sierra Leone. We believe that every voice matters and every problem deserves attention.
              </p>
              <p>
                By combining crowdsourced reporting, community voting, and transparent data visualization, we create a
                real-time picture of the issues that matter most to Dwarzark residents. This data-driven approach helps
                prioritize government action and ensures accountability.
              </p>
              <p>
                Our platform is designed with inclusivity at its core - supporting multiple local languages, working on
                low-bandwidth connections, and requiring no authentication to participate. Whether you report a broken
                streetlight or vote on a drainage issue, you're contributing to a better community.
              </p>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-2xl">How We Work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <div>
                <h3 className="font-semibold text-foreground mb-2">1. Citizens Report Issues</h3>
                <p>
                  Anyone can report problems using photos, videos, text, or voice recordings in their preferred
                  language.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">2. AI Transcription</h3>
                <p>
                  Voice recordings in Krio, Mende, Limba, or Themne are automatically transcribed to English for wider
                  accessibility.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">3. Community Voting</h3>
                <p>
                  Residents upvote issues that affect them most, with all votes recorded on blockchain for transparency.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">4. Data-Driven Priorities</h3>
                <p>The most upvoted issues rise to the top, creating a clear priority list for government action.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
