"use client"

import type React from "react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, Mail, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      })

      if (error) throw error

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Failed to send magic link")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="bg-primary text-primary-foreground rounded-lg p-3">
              <AlertCircle className="h-6 w-6" />
            </div>
            <span className="font-bold text-2xl">Dwarzark Admin</span>
          </div>
          <CardTitle className="text-2xl">Admin Sign In</CardTitle>
          <CardDescription className="text-base">Enter your email to receive a secure sign-in link</CardDescription>
        </CardHeader>

        {!success ? (
          <form onSubmit={handleMagicLink}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@dwarzark.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg border">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">How it works:</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      We'll send you a secure magic link to your email. Click the link to instantly access the admin
                      dashboard - no password needed.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Mail className="mr-2 h-4 w-4" />
                Send Magic Link
              </Button>

              <div className="text-sm text-center">
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  ← Back to home
                </Link>
              </div>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-4">
            <Alert className="border-primary/50 bg-primary/5">
              <CheckCircle className="h-5 w-5 text-primary" />
              <AlertDescription className="ml-2">
                <p className="font-medium mb-1">Magic link sent!</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Check your inbox at <span className="font-medium text-foreground">{email}</span> and click the secure
                  link to access the admin dashboard.
                </p>
              </AlertDescription>
            </Alert>

            <div className="bg-muted/50 p-4 rounded-lg border space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Didn't receive the email?</p>
              <ul className="space-y-1 text-xs list-disc list-inside">
                <li>Check your spam or junk folder</li>
                <li>Verify the email address is correct</li>
                <li>Wait a few minutes for delivery</li>
              </ul>
            </div>

            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => {
                setSuccess(false)
                setEmail("")
              }}
            >
              Try Different Email
            </Button>

            <div className="text-sm text-center">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                ← Back to home
              </Link>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
