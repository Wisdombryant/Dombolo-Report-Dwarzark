// Utility for generating secure, anonymized voter fingerprints
import crypto from "crypto"

/**
 * Generates a secure, anonymized fingerprint for voter identification
 * Combines multiple signals to create a unique but privacy-preserving identifier
 */
export function generateVoterFingerprint(options: {
  ipAddress?: string
  userAgent?: string
  sessionId?: string
}): string {
  const { ipAddress, userAgent, sessionId } = options

  // Combine available signals
  const signals: string[] = []

  if (ipAddress) {
    // Hash IP address to anonymize
    signals.push(hashValue(ipAddress))
  }

  if (userAgent) {
    // Hash user agent to anonymize
    signals.push(hashValue(userAgent))
  }

  if (sessionId) {
    // Use session ID if available
    signals.push(sessionId)
  }

  // If no signals available, generate a random session-based ID
  if (signals.length === 0) {
    signals.push(crypto.randomUUID())
  }

  // Combine all signals and hash
  const combined = signals.join("|")
  return hashValue(combined)
}

/**
 * Hashes a value using SHA-256
 */
export function hashValue(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex")
}

/**
 * Client-side fingerprint generator (for browser environment)
 */
export function generateClientFingerprint(): string {
  if (typeof window === "undefined") {
    return crypto.randomUUID()
  }

  const signals: string[] = []

  // Use navigator properties
  if (navigator.userAgent) {
    signals.push(navigator.userAgent)
  }

  if (navigator.language) {
    signals.push(navigator.language)
  }

  if (screen.width && screen.height) {
    signals.push(`${screen.width}x${screen.height}`)
  }

  // Use timezone
  signals.push(new Date().getTimezoneOffset().toString())

  // Combine and create a simple hash (client-side)
  const combined = signals.join("|")
  return simpleHash(combined)
}

/**
 * Simple hash function for client-side (not cryptographically secure, but sufficient for fingerprinting)
 */
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}
