export type Guardian = "Mother" | "Father" | "Other"

export interface User {
  id: string
  name: string
  username: string
  age: number
  password: string
  guardian: Guardian
  whatsapp: string
  createdAt: string // ISO date
  role: "student" | "admin"
}

export type AnalyticsType =
  | "session_start"
  | "session_end"
  | "activity_complete"
  | "exercise_answer"
  | "phonics_attempt"
  | "video_watch"
  | "leo_message"
  | "reward_earned"

export interface AnalyticsEvent {
  id: string
  userId: string
  type: AnalyticsType
  timestamp: string
  responseTimeMs?: number
  correct?: boolean
  score?: number // 0-100
  label?: string
  unitId?: string
}

export interface Progress {
  unitId: string
  starsEarned: number // 0-3 per unit
  bestScore: number // 0-100
  completed: boolean
}

export interface AppState {
  users: User[]
  currentUserId: string | null
  events: AnalyticsEvent[]
  progress: Record<string, Progress[]> // userId -> progress list
  stickers: Record<string, string[]> // userId -> earned sticker ids
  totalTimeMs: Record<string, number> // userId -> ms
}

/* ---------- Curriculum data structures (scalable) ---------- */

export interface PhonicsItem {
  id: string
  grapheme: string // the letter/word shown
  word: string // example word
  ipaHint?: string
  emoji?: string // optional decorative reference (not used as icon)
}

export interface Exercise {
  id: string
  prompt: string
  options: string[]
  answerIndex: number
}

export interface Unit {
  id: string
  order: number
  title: string
  subtitle: string
  color: string // tailwind-ish token key for the map node
  objectives: string[]
  activities: { id: string; title: string; description: string }[]
  phonics: PhonicsItem[]
  exercises: Exercise[]
  test: {
    id: string
    title: string
    questions: Exercise[]
  }
}

export interface VideoTopic {
  id: string
  topic: string
  videos: {
    id: string
    title: string
    duration: string
    src: string
    poster?: string
  }[]
}
