"use client"

import Link from "next/link"
import { useApp } from "@/components/providers/app-provider"
import { EGYPTIAN_UNITS } from "@/lib/curriculum"
import { ProgressBar } from "@/components/ui/gamified"
import { Lock, Star, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Unit } from "@/lib/types"

const UNIT_COLORS: Record<string, string> = {
  sky: "var(--color-brand-sky)",
  teal: "var(--color-brand-teal)",
  coral: "var(--color-brand-coral)",
  grape: "var(--color-brand-grape)",
  mint: "var(--color-brand-mint)",
  yellow: "var(--color-brand-yellow)",
}

export function ProgressMap() {
  const { getProgress } = useApp()
  const progress = getProgress()

  function unitStats(unitId: string) {
    const p = progress.find((x) => x.unitId === unitId)
    return { completed: p?.bestScore ?? 0, stars: p?.starsEarned ?? 0, done: p?.completed ?? false }
  }

  return (
    <section aria-label="Curriculum progress map" className="mx-auto w-full max-w-3xl">
      <div className="relative flex flex-col gap-6 py-4">
        <div
          aria-hidden
          className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded-full border-l-4 border-dashed border-[var(--color-brand-sky)]/40"
        />
        {EGYPTIAN_UNITS.map((unit, i) => {
          const { completed, stars } = unitStats(unit.id)
          const prevDone = i === 0 || (unitStats(EGYPTIAN_UNITS[i - 1].id).completed ?? 0) >= 40
          const locked = !prevDone
          const color = UNIT_COLORS[unit.color] ?? "var(--color-brand-sky)"
          const alignRight = i % 2 === 1

          return (
            <div
              key={unit.id}
              className={cn("relative z-10 flex w-full", alignRight ? "justify-end" : "justify-start")}
            >
              <UnitNode unit={unit} index={i} color={color} completed={completed} stars={stars} locked={locked} />
            </div>
          )
        })}
      </div>
    </section>
  )
}

function UnitNode({
  unit,
  index,
  color,
  completed,
  stars,
  locked,
}: {
  unit: Unit
  index: number
  color: string
  completed: number
  stars: number
  locked: boolean
}) {
  const inner = (
    <div
      className={cn(
        "w-[78vw] max-w-sm rounded-3xl border-4 border-white bg-card p-4 shadow-lg transition-transform",
        locked ? "opacity-70" : "hover:-translate-y-1 hover:shadow-xl",
      )}
      style={{ boxShadow: `0 10px 0 ${color}33, 0 14px 24px rgba(0,0,0,0.12)` }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-extrabold text-white"
          style={{ backgroundColor: color }}
          aria-hidden
        >
          {locked ? <Lock className="h-6 w-6" /> : index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg font-extrabold text-foreground">{unit.title}</p>
          <p className="truncate text-sm text-muted-foreground">{unit.subtitle}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1" aria-label={`${stars} of 3 stars`}>
        {[0, 1, 2].map((s) => (
          <Star
            key={s}
            className={cn(
              "h-5 w-5",
              s < stars ? "fill-[var(--color-brand-yellow)] text-[var(--color-brand-yellow)]" : "text-muted-foreground/30",
            )}
          />
        ))}
        <span className="ml-auto text-sm font-bold" style={{ color }}>
          {completed}%
        </span>
      </div>

      <div className="mt-2">
        <ProgressBar value={completed} color={color} />
      </div>

      {!locked ? (
        <div
          className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-2xl px-4 py-2 font-display text-base font-bold text-white"
          style={{ backgroundColor: color }}
        >
          <Play className="h-5 w-5 fill-white" />
          {completed > 0 ? "Continue" : "Start Unit"}
        </div>
      ) : (
        <p className="mt-3 text-center text-sm font-semibold text-muted-foreground">
          Finish the last unit to unlock
        </p>
      )}
    </div>
  )

  if (locked) {
    return (
      <div aria-disabled className="cursor-not-allowed">
        {inner}
      </div>
    )
  }

  return (
    <Link href={`/egyptian/unit/${unit.id}`} aria-label={`Open ${unit.title}`}>
      {inner}
    </Link>
  )
}
