"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import type {
  AnalyticsEvent,
  AnalyticsType,
  AppState,
  Guardian,
  Progress,
  User,
} from "@/lib/types"

const STORAGE_KEY = "elh_primary1_state_v1"

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

/* ---------- Seed demo data so admin dashboard has content ---------- */
function buildSeed(): AppState {
  const admin: User = {
    id: "admin-1",
    name: "Site Administrator",
    username: "admin",
    age: 30,
    password: "admin123",
    guardian: "Other",
    whatsapp: "+20 100 000 0000",
    createdAt: daysAgo(120),
    role: "admin",
  }

  const studentSeeds = [
    { name: "Yara Hassan", username: "yara", age: 6, days: 40 },
    { name: "Omar Adel", username: "omar", age: 6, days: 30 },
    { name: "Malak Tarek", username: "malak", age: 7, days: 22 },
    { name: "Ali Sherif", username: "ali", age: 6, days: 15 },
    { name: "Nour Sami", username: "nour", age: 6, days: 8 },
  ]

  const users: User[] = [admin]
  const events: AnalyticsEvent[] = []
  const totalTimeMs: Record<string, number> = {}
  const progress: Record<string, Progress[]> = {}
  const stickers: Record<string, string[]> = {}

  studentSeeds.forEach((s, i) => {
    const id = `stu-${i + 1}`
    users.push({
      id,
      name: s.name,
      username: s.username,
      age: s.age,
      password: "1234",
      guardian: i % 2 === 0 ? "Mother" : "Father",
      whatsapp: `+20 12${i} 555 44${i}${i}`,
      createdAt: daysAgo(s.days),
      role: "student",
    })

    totalTimeMs[id] = (60 + i * 25) * 60 * 1000 // minutes -> ms
    stickers[id] = ["star-collector", "phonics-pro"].slice(0, (i % 2) + 1)
    progress[id] = [
      { unitId: "unit-1", starsEarned: 3, bestScore: 90 - i * 3, completed: true },
      { unitId: "unit-2", starsEarned: i > 1 ? 3 : 2, bestScore: 80 - i * 4, completed: i > 1 },
      { unitId: "unit-3", starsEarned: i > 2 ? 2 : 1, bestScore: 70 - i * 5, completed: i > 3 },
    ]

    // Spread analytics events across the last 8 weeks for W-o-W / M-o-M graphs
    for (let week = 7; week >= 0; week--) {
      const sessions = 2 + ((i + week) % 4)
      for (let sIdx = 0; sIdx < sessions; sIdx++) {
        const ts = daysAgo(week * 7 + (sIdx % 6))
        const correct = Math.random() > 0.25 - week * 0.01
        events.push({
          id: uid(),
          userId: id,
          type: "exercise_answer",
          timestamp: ts,
          responseTimeMs: 2200 + Math.round(Math.random() * 3000) - week * 100,
          correct,
          score: correct ? 70 + Math.round(Math.random() * 30) : 30 + Math.round(Math.random() * 30),
          label: "exercise",
        })
        events.push({
          id: uid(),
          userId: id,
          type: "phonics_attempt",
          timestamp: ts,
          responseTimeMs: 1800 + Math.round(Math.random() * 2500),
          correct: Math.random() > 0.3,
          label: "phonics",
        })
      }
    }
  })

  return {
    users,
    currentUserId: null,
    events,
    progress,
    stickers,
    totalTimeMs,
  }
}

interface SignUpInput {
  name: string
  username: string
  age: number
  password: string
  guardian: Guardian
  whatsapp: string
}

interface AppContextValue {
  state: AppState
  currentUser: User | null
  signUp: (input: SignUpInput) => { ok: boolean; error?: string }
  signIn: (username: string, password: string, remember: boolean) => { ok: boolean; error?: string }
  signOut: () => void
  loginAsDemoStudent: () => void
  loginAsAdmin: () => void
  track: (
    type: AnalyticsType,
    payload?: Partial<Omit<AnalyticsEvent, "id" | "userId" | "type" | "timestamp">>,
  ) => void
  setUnitProgress: (unitId: string, stars: number, score: number, completed: boolean) => void
  addSticker: (stickerId: string) => void
  getProgress: (userId?: string) => Progress[]
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(buildSeed)
  const [hydrated, setHydrated] = useState(false)
  const sessionStart = useRef<number | null>(null)

  // Hydrate from localStorage (prototype persistence)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setState(JSON.parse(raw))
      else {
        const remembered = localStorage.getItem("elh_remember")
        if (remembered) {
          setState((s) => ({ ...s, currentUserId: remembered }))
        }
      }
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  // Persist
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore
    }
  }, [state, hydrated])

  // Session time tracking
  useEffect(() => {
    if (!state.currentUserId) return
    sessionStart.current = Date.now()
    const id = state.currentUserId
    const flush = () => {
      if (sessionStart.current) {
        const delta = Date.now() - sessionStart.current
        sessionStart.current = Date.now()
        setState((s) => ({
          ...s,
          totalTimeMs: { ...s.totalTimeMs, [id]: (s.totalTimeMs[id] ?? 0) + delta },
        }))
      }
    }
    const interval = setInterval(flush, 30000)
    window.addEventListener("beforeunload", flush)
    return () => {
      flush()
      clearInterval(interval)
      window.removeEventListener("beforeunload", flush)
    }
  }, [state.currentUserId])

  const currentUser = useMemo(
    () => state.users.find((u) => u.id === state.currentUserId) ?? null,
    [state.users, state.currentUserId],
  )

  const value: AppContextValue = {
    state,
    currentUser,
    signUp: (input) => {
      if (state.users.some((u) => u.username.toLowerCase() === input.username.toLowerCase())) {
        return { ok: false, error: "That username is already taken." }
      }
      const id = uid()
      const user: User = { ...input, id, createdAt: new Date().toISOString(), role: "student" }
      setState((s) => ({
        ...s,
        users: [...s.users, user],
        currentUserId: id,
        totalTimeMs: { ...s.totalTimeMs, [id]: 0 },
        progress: { ...s.progress, [id]: [] },
        stickers: { ...s.stickers, [id]: [] },
      }))
      return { ok: true }
    },
    signIn: (username, password, remember) => {
      const user = state.users.find(
        (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password,
      )
      if (!user) return { ok: false, error: "Wrong username or password." }
      setState((s) => ({ ...s, currentUserId: user.id }))
      try {
        if (remember) localStorage.setItem("elh_remember", user.id)
        else localStorage.removeItem("elh_remember")
      } catch {
        // ignore
      }
      return { ok: true }
    },
    signOut: () => {
      try {
        localStorage.removeItem("elh_remember")
      } catch {
        // ignore
      }
      setState((s) => ({ ...s, currentUserId: null }))
    },
    loginAsDemoStudent: () => setState((s) => ({ ...s, currentUserId: "stu-1" })),
    loginAsAdmin: () => setState((s) => ({ ...s, currentUserId: "admin-1" })),
    track: (type, payload = {}) => {
      const id = state.currentUserId
      if (!id) return
      setState((s) => ({
        ...s,
        events: [
          ...s.events,
          { id: uid(), userId: id, type, timestamp: new Date().toISOString(), ...payload },
        ],
      }))
    },
    setUnitProgress: (unitId, stars, score, completed) => {
      const id = state.currentUserId
      if (!id) return
      setState((s) => {
        const list = s.progress[id] ? [...s.progress[id]] : []
        const idx = list.findIndex((p) => p.unitId === unitId)
        const next: Progress = {
          unitId,
          starsEarned: Math.max(stars, idx >= 0 ? list[idx].starsEarned : 0),
          bestScore: Math.max(score, idx >= 0 ? list[idx].bestScore : 0),
          completed: completed || (idx >= 0 ? list[idx].completed : false),
        }
        if (idx >= 0) list[idx] = next
        else list.push(next)
        return { ...s, progress: { ...s.progress, [id]: list } }
      })
    },
    addSticker: (stickerId) => {
      const id = state.currentUserId
      if (!id) return
      setState((s) => {
        const owned = s.stickers[id] ?? []
        if (owned.includes(stickerId)) return s
        return { ...s, stickers: { ...s.stickers, [id]: [...owned, stickerId] } }
      })
    },
    getProgress: (userId) => {
      const id = userId ?? state.currentUserId
      if (!id) return []
      return state.progress[id] ?? []
    },
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
