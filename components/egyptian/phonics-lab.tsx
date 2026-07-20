"use client"

import { useEffect, useMemo, useState } from "react"
import { useSpeech } from "@/hooks/use-speech"
import { useApp } from "@/components/providers/app-provider"
import { LeoAvatar } from "@/components/leo/leo-avatar"
import { KidButton } from "@/components/ui/kid-button"
import { Volume2, Mic, MicOff, ChevronRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PhonicsItem } from "@/lib/types"

type Feedback = "idle" | "listening" | "great" | "tryagain"

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z]/g, "")
}

function levenshtein(a: string, b: string) {
  const m = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 0; j <= b.length; j++) m[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
  }
  return m[a.length][b.length]
}

function isCloseEnough(said: string, target: string) {
  const a = normalize(said)
  const b = normalize(target)
  if (!a) return false
  if (a === b) return true
  if (a.includes(b) || b.includes(a)) return true
  return levenshtein(a, b) <= Math.max(1, Math.floor(b.length / 3))
}

export function PhonicsLab({ unitId, items }: { unitId: string; items: PhonicsItem[] }) {
  const { speak, speaking, listen, stopListening, listening, sttSupported } = useSpeech()
  const { track, setUnitProgress } = useApp()
  const [index, setIndex] = useState(0)
  const [feedback, setFeedback] = useState<Feedback>("idle")
  const [heard, setHeard] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [startTime, setStartTime] = useState(() => Date.now())

  const item = items[index]

  const leoMood = useMemo<"happy" | "curious" | "cheer" | "sad">(() => {
    if (feedback === "great") return "cheer"
    if (feedback === "tryagain") return "sad"
    if (feedback === "listening") return "curious"
    return "happy"
  }, [feedback])

  useEffect(() => {
    setStartTime(Date.now())
  }, [index])

  function pronounce() {
    setFeedback("idle")
    speak(item.word, "en-US")
  }

  function handleListen() {
    if (listening) {
      stopListening()
      return
    }
    setFeedback("listening")
    setHeard("")
    listen(
      "en-US",
      (transcript) => {
        setHeard(transcript)
        const nextAttempts = attempts + 1
        setAttempts(nextAttempts)
        const ok = isCloseEnough(transcript, item.word)
        if (ok) {
          setFeedback("great")
          track("phonics_attempt", {
            unitId,
            correct: true,
            responseTimeMs: Date.now() - startTime,
            label: item.word,
          })
          // reward a star for mastering a sound
          setUnitProgress(unitId, 1, Math.round(((index + 1) / items.length) * 100), false)
          speak("Great job! You said it perfectly!", "en-US")
        } else {
          setFeedback("tryagain")
          track("phonics_attempt", {
            unitId,
            correct: false,
            responseTimeMs: Date.now() - startTime,
            label: item.word,
          })
          speak(`Almost! Try again. ${item.word}`, "en-US")
        }
      },
      () => setFeedback("idle"),
    )
  }

  function next() {
    if (index < items.length - 1) {
      setIndex((i) => i + 1)
      setFeedback("idle")
      setHeard("")
      setAttempts(0)
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 rounded-3xl border-4 border-white bg-card p-5 shadow-lg">
      <LeoAvatar mood={leoMood} talking={speaking} size={120} />

      <div className="flex w-full flex-col items-center gap-2 rounded-3xl bg-[var(--color-brand-cream)] p-6 text-center">
        <span className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Say this</span>
        <span className="font-display text-6xl font-extrabold text-[var(--color-brand-sky)]">{item.grapheme}</span>
        <span className="font-display text-2xl font-bold text-foreground">{item.word}</span>
        {item.emoji && (
          <span className="text-4xl" aria-hidden>
            {item.emoji}
          </span>
        )}
        {item.ipaHint && <span className="text-sm text-muted-foreground">sounds like &ldquo;{item.ipaHint}&rdquo;</span>}
      </div>

      <div
        aria-live="polite"
        className={cn(
          "flex min-h-14 w-full items-center justify-center rounded-2xl px-4 py-3 text-center font-display text-lg font-extrabold transition-colors",
          feedback === "great" && "bg-[var(--color-brand-mint)]/25 text-[var(--color-brand-teal)]",
          feedback === "tryagain" && "bg-[var(--color-brand-coral)]/20 text-[var(--color-brand-coral)]",
          feedback === "listening" && "bg-[var(--color-brand-sky)]/20 text-[var(--color-brand-sky)]",
          feedback === "idle" && "bg-muted/60 text-muted-foreground",
        )}
      >
        {feedback === "great" && (
          <span className="flex items-center gap-2">
            <Sparkles className="h-6 w-6" /> Great job! You got it!
          </span>
        )}
        {feedback === "tryagain" && <span>Try again! You can do it!</span>}
        {feedback === "listening" && <span>Leo is listening... say the word!</span>}
        {feedback === "idle" && <span>Tap the speaker, then tap the mic to try!</span>}
      </div>

      {heard && (
        <p className="text-sm text-muted-foreground">
          Leo heard: <span className="font-bold text-foreground">&ldquo;{heard}&rdquo;</span>
        </p>
      )}

      <div className="flex w-full flex-wrap items-center justify-center gap-3">
        <KidButton color="sky" onClick={pronounce} className="min-w-[44%]">
          <Volume2 className="h-6 w-6" />
          Hear it
        </KidButton>

        {sttSupported ? (
          <KidButton
            color={listening ? "coral" : "teal"}
            onClick={handleListen}
            className="min-w-[44%]"
            aria-pressed={listening}
          >
            {listening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            {listening ? "Stop" : "Say it"}
          </KidButton>
        ) : (
          <KidButton color="teal" onClick={() => setFeedback("great")} className="min-w-[44%]">
            <Mic className="h-6 w-6" />I said it!
          </KidButton>
        )}
      </div>

      {!sttSupported && (
        <p className="text-center text-xs text-muted-foreground">
          Voice recognition is not supported on this browser. Practice by listening and repeating!
        </p>
      )}

      <div className="flex w-full items-center justify-between gap-3 pt-1">
        <span className="text-sm font-bold text-muted-foreground">
          Word {index + 1} of {items.length}
        </span>
        <KidButton color="yellow" onClick={next} disabled={index >= items.length - 1}>
          Next
          <ChevronRight className="h-6 w-6" />
        </KidButton>
      </div>
    </div>
  )
}
