"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/* ---------- Text to Speech ---------- */
export function useTTS() {
  const [speaking, setSpeaking] = useState(false)
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window)
  }, [])

  const speak = useCallback(
    (text: string, opts?: { lang?: string; rate?: number; pitch?: number }) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.lang = opts?.lang ?? "en-US"
      u.rate = opts?.rate ?? 0.85
      u.pitch = opts?.pitch ?? 1.15
      u.onstart = () => setSpeaking(true)
      u.onend = () => setSpeaking(false)
      u.onerror = () => setSpeaking(false)
      window.speechSynthesis.speak(u)
    },
    [],
  )

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
    }
  }, [])

  return { speak, stop, speaking, supported }
}

/* ---------- Speech Recognition (STT) ---------- */
type SRResult = {
  transcript: string
  confidence: number
}

export function useSTT(lang = "en-US") {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(true)
  const recognitionRef = useRef<any>(null)
  const resolverRef = useRef<((r: SRResult) => void) | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      setSupported(false)
      return
    }
    const rec = new SR()
    rec.lang = lang
    rec.interimResults = false
    rec.maxAlternatives = 3
    rec.continuous = false

    rec.onresult = (event: any) => {
      const res = event.results[0][0]
      resolverRef.current?.({
        transcript: res.transcript ?? "",
        confidence: res.confidence ?? 0,
      })
    }
    rec.onerror = () => {
      resolverRef.current?.({ transcript: "", confidence: 0 })
    }
    rec.onend = () => setListening(false)
    recognitionRef.current = rec

    return () => {
      try {
        rec.abort()
      } catch {
        // ignore
      }
    }
  }, [lang])

  const listen = useCallback((): Promise<SRResult> => {
    return new Promise((resolve) => {
      const rec = recognitionRef.current
      if (!rec) {
        resolve({ transcript: "", confidence: 0 })
        return
      }
      resolverRef.current = (r) => resolve(r)
      try {
        setListening(true)
        rec.start()
      } catch {
        setListening(false)
        resolve({ transcript: "", confidence: 0 })
      }
    })
  }, [])

  const stop = useCallback(() => {
    try {
      recognitionRef.current?.stop()
    } catch {
      // ignore
    }
    setListening(false)
  }, [])

  return { listen, stop, listening, supported }
}

/* ---------- Pronunciation scoring helper ---------- */
export function scorePronunciation(target: string, spoken: string): number {
  const a = target.trim().toLowerCase().replace(/[^a-z\u0600-\u06FF]/g, "")
  const b = spoken.trim().toLowerCase().replace(/[^a-z\u0600-\u06FF]/g, "")
  if (!b) return 0
  if (a === b) return 100
  if (b.includes(a) || a.includes(b)) return 85
  // Levenshtein similarity
  const dist = levenshtein(a, b)
  const sim = 1 - dist / Math.max(a.length, b.length, 1)
  return Math.round(Math.max(0, sim) * 100)
}

function levenshtein(a: string, b: string) {
  const m = a.length
  const n = b.length
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    }
  }
  return dp[m][n]
}
