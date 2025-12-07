export interface Problem {
  id: string
  title: string
  description: string
  category: "infrastructure" | "sanitation" | "safety" | "utilities"
  status: "open" | "in-progress" | "resolved"
  location: string
  coordinates: {
    lat: number
    lng: number
  }
  upvotes: number
  comments?: number
  imageUrl?: string
  createdAt: string
  reportedBy?: string
}
