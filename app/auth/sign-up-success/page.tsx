import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, AlertCircle } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-primary text-primary-foreground rounded-lg p-2">
              <AlertCircle className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl">Dwarzark</span>
          </div>
          <div className="flex justify-center py-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Mail className="h-12 w-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Check Your Email</CardTitle>
          <CardDescription className="text-center">
            We've sent you a confirmation link. Please check your email to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
            <p className="font-medium">Next steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Check your email inbox</li>
              <li>Click the confirmation link</li>
              <li>Sign in to your account</li>
            </ol>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Link href="/auth/login" className="w-full">
            <Button variant="outline" className="w-full bg-transparent">
              Back to Sign In
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="ghost" className="w-full">
              Return Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
