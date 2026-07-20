"use client"

import { useState } from "react"
import { useApp } from "@/components/providers/app-provider"
import { useSpeech } from "@/hooks/use-speech"
import { LeoAvatar } from "@/components/leo/leo-avatar"
import { KidButton } from "@/components/ui/kid-button"
import { Stars } from "@/components/ui/gamified"
import { cn } from "@/lib/utils"
import { Volume2, RotateCcw } from "lucide-react"
import type { Exercise } from "@/lib/types"

export function UnitExercises({
  unitId,
  questions,
  mode,
}: {
  unitId: string
  questions: Exercise[]
  mode: "exercise" | "test"
}) {
  const { track, setUnitProgress, addSticker } = useApp()
  const { speak, speaking } = useSpeech()
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [startTime, setStartTime] = useState(() => Date.now())

  const q = questions[index]

  function choose(i: number) {
    if (locked) return
    setSelected(i)
    setLocked(true)
    const correct = i === q.answerIndex
    if (correct) {
      setScore((s) => s + 1)
      speak("Correct! Well done!", "en-US")
    } else {
      speak("Not quite. The answer is " + q.options[q.answerIndex], "en-US")
    }
    track(mode === "test" ? "exercise_answer" : "exercise_answer", {
      unitId,
      correct,
      responseTimeMs: Date.now() - startTime,
      label: mode,
    })
  }

  function next() {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1)
      setSelected(null)
      setLocked(false)
      setStartTime(Date.now())
    } else {
      const pct = Math.round((score / questions.length) * 100)
      const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1
      setUnitProgress(unitId, stars, pct, mode === "test" && pct >= 60)
      track("activity_complete", { unitId, score: pct, label: mode })
      if (pct >= 90) addSticker("quiz-champion")
      setDone(true)
    }
  }

  function restart() {
    setIndex(0)
    setSelected(null)
    setLocked(false)
    setScore(0)
    setDone(false)
    setStartTime(Date.now())
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100)
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border-4 border-white bg-card p-6 text-center shadow-lg">
        <LeoAvatar mood={pct >= 60 ? "cheer" : "happy"} size={120} />
        <h2 className="font-display text-2xl font-extrabold text-foreground">
          {pct >= 60 ? "Amazing work!" : "Good try!"}
        </h2>
        <p className="text-muted-foreground">
          You got {score} out of {questions.length} right
        </p>
        <Stars value={stars} size={40} />
        <KidButton color="teal" onClick={restart}>
          <RotateCcw className="h-6 w-6" />
          Play again
        </KidButton>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 rounded-3xl border-4 border-white bg-card p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-muted-foreground">
          {mode === "test" ? "Test" : "Exercise"} {index + 1}/{questions.length}
        </span>
        <span className="rounded-full bg-[var(--color-brand-mint)]/30 px-3 py-1 text-sm font-bold text-[var(--color-brand-teal)]">
          Score: {score}
        </span>
      </div>

      <div className="flex items-center justify-center gap-3 rounded-2xl bg-[var(--color-brand-cream)] p-5 text-center">
        <button
          onClick={() => speak(q.prompt, "en-US")}
          aria-label="Hear the question"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-sky)] text-white shadow-md"
        >
          <Volume2 className={cn("h-6 w-6", speaking && "animate-pulse")} />
        </button>
        <p className="font-display text-xl font-extrabold text-foreground">{q.prompt}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.answerIndex
          const isSelected = i === selected
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={locked}
              className={cn(
                "flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-2xl border-4 p-3 font-display text-lg font-bold transition-all",
                !locked && "border-border bg-card hover:-translate-y-0.5 hover:border-[var(--color-brand-sky)]",
                locked && isCorrect && "border-[var(--color-brand-mint)] bg-[var(--color-brand-mint)]/25 text-[var(--color-brand-teal)]",
                locked && isSelected && !isCorrect && "border-[var(--color-brand-coral)] bg-[var(--color-brand-coral)]/20 text-[var(--color-brand-coral)]",
                locked && !isSelected && !isCorrect && "opacity-50",
              )}
            >
              <span className="text-foreground">{opt}</span>
            </button>
          )
        })}
      </div>

      {locked && (
        <KidButton color="yellow" onClick={next} className="w-full">
          {index < questions.length - 1 ? "Next question" : "Finish"}
        </KidButton>
      )}
    </div>
  )
}
