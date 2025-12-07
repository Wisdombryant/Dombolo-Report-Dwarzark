"use client"

import { useState } from "react"
import { ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { simulateBlockchainUpvote } from "@/lib/blockchain"
import { useProblemStore } from "@/lib/store"

interface UpvoteButtonProps {
  problemId: string
  currentUpvotes: number
}

export function UpvoteButton({ problemId, currentUpvotes }: UpvoteButtonProps) {
  const updateUpvotes = useProblemStore((state) => state.updateUpvotes)
  const [isVoting, setIsVoting] = useState(false)
  const [hasVoted, setHasVoted] = useState(() => {
    if (typeof window === "undefined") return false
    return localStorage.getItem(`voted-${problemId}`) === "true"
  })

  const handleUpvote = async () => {
    if (hasVoted || isVoting) return

    setIsVoting(true)

    const success = await simulateBlockchainUpvote(problemId)

    setIsVoting(false)

    if (success) {
      const newUpvotes = currentUpvotes + 1
      updateUpvotes(problemId, newUpvotes)
      localStorage.setItem(`voted-${problemId}`, "true")
      setHasVoted(true)
    } else {
      alert("Failed to record vote. Please try again.")
    }
  }

  return (
    <Button
      onClick={handleUpvote}
      disabled={hasVoted || isVoting}
      variant={hasVoted ? "secondary" : "default"}
      size="sm"
      className="gap-2"
    >
      <ThumbsUp className={`h-4 w-4 ${hasVoted ? "fill-current" : ""}`} />
      {currentUpvotes}
      {isVoting && " ..."}
    </Button>
  )
}
