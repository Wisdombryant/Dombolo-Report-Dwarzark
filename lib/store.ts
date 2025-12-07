import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Problem } from "./types"
import { mockProblems } from "./mock-data"

interface ProblemStore {
  problems: Problem[]
  addProblem: (problem: Problem) => void
  updateProblem: (id: string, updates: Partial<Problem>) => void
  updateUpvotes: (id: string, upvotes: number) => void
}

export const useProblemStore = create<ProblemStore>()(
  persist(
    (set) => ({
      problems: mockProblems,
      addProblem: (problem) =>
        set((state) => ({
          problems: [problem, ...state.problems],
        })),
      updateProblem: (id, updates) =>
        set((state) => ({
          problems: state.problems.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      updateUpvotes: (id, upvotes) =>
        set((state) => ({
          problems: state.problems.map((p) => (p.id === id ? { ...p, upvotes } : p)),
        })),
    }),
    {
      name: "dwarzark-problems-storage",
    },
  ),
)
