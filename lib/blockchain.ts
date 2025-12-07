// Mock blockchain service for upvoting
export const simulateBlockchainUpvote = async (problemId: string): Promise<boolean> => {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

  // Simulate 95% success rate
  const success = Math.random() > 0.05

  if (success) {
    console.log(`[v0] Blockchain upvote recorded for problem ${problemId}`)
  } else {
    console.log(`[v0] Blockchain upvote failed for problem ${problemId}`)
  }

  return success
}
