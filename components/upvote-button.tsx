"use client"

import { useState, useEffect } from "react"
import { ThumbsUp, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { recordBlockchainUpvote } from "@/lib/blockchain"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface UpvoteButtonProps {
  problemId: string
  currentUpvotes: number
  variant?: "default" | "compact"
}

export function UpvoteButton({ problemId, currentUpvotes, variant = "default" }: UpvoteButtonProps) {
  const router = useRouter()
  const [isVoting, setIsVoting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [upvotes, setUpvotes] = useState(currentUpvotes)
  const [blockchainHash, setBlockchainHash] = useState<string | null>(null)

  useEffect(() => {
    // Check if user has voted (from localStorage for UI persistence)
    if (typeof window !== "undefined") {
      const voted = localStorage.getItem(`voted-${problemId}`)
      const hash = localStorage.getItem(`vote-hash-${problemId}`)
      if (voted === "true") {
        setHasVoted(true)
        if (hash) setBlockchainHash(hash)
      }
    }
  }, [problemId])

  const handleUpvote = async () => {
    if (hasVoted || isVoting) return

    setIsVoting(true)

    const result = await recordBlockchainUpvote(problemId)

    setIsVoting(false)

    if (result.success && result.blockchainHash) {
      // Update UI
      setUpvotes(result.newUpvotes || upvotes + 1)
      setHasVoted(true)
      setBlockchainHash(result.blockchainHash)

      // Store in localStorage for persistence
      localStorage.setItem(`voted-${problemId}`, "true")
      localStorage.setItem(`vote-hash-${problemId}`, result.blockchainHash)

      // Refresh the page data
      router.refresh()
    } else if (result.alreadyUpvoted) {
      // Already voted
      setHasVoted(true)
      alert("You have already upvoted this problem.")
    } else {
      // Error
      alert(result.error || "Failed to record vote. Please try again.")
    }
  }

  if (variant === "compact") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleUpvote}
              disabled={hasVoted || isVoting}
              variant={hasVoted ? "secondary" : "default"}
              size="sm"
              className="gap-1.5"
            >
              <ThumbsUp className={`h-3.5 w-3.5 ${hasVoted ? "fill-current" : ""}`} />
              <span className="font-semibold">{upvotes}</span>
              {hasVoted && <Shield className="h-3 w-3 text-green-500" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {hasVoted ? (
              <div className="text-xs">
                <p className="font-semibold">Blockchain Verified</p>
                <p className="text-muted-foreground">Hash: {blockchainHash?.substring(0, 12)}...</p>
              </div>
            ) : (
              <p>Upvote this problem to increase priority</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleUpvote}
        disabled={hasVoted || isVoting}
        variant={hasVoted ? "secondary" : "default"}
        size="lg"
        className="gap-2"
      >
        <ThumbsUp className={`h-5 w-5 ${hasVoted ? "fill-current" : ""}`} />
        <span className="font-semibold text-lg">{upvotes}</span>
        {isVoting ? "Recording..." : hasVoted ? "Upvoted" : "Upvote"}
        {hasVoted && <Shield className="h-4 w-4 text-green-500" />}
      </Button>

      {hasVoted && blockchainHash && (
        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-green-50 border border-green-200 rounded-lg p-3">
          <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-green-700">Blockchain Verified</p>
            <p className="break-all font-mono">{blockchainHash.substring(0, 32)}...</p>
          </div>
        </div>
      )}
    </div>
  )
}
