"use client"

import { use, useState } from "react"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { PhonicsLab } from "@/components/egyptian/phonics-lab"
import { UnitExercises } from "@/components/egyptian/unit-exercises"
import { EGYPTIAN_UNITS } from "@/lib/curriculum"
import { cn } from "@/lib/utils"
import { Target, Mic2, Puzzle, PencilRuler, Trophy } from "lucide-react"

type Tab = "objectives" | "phonics" | "activities" | "exercises" | "test"

const TABS: { id: Tab; label: string; icon: typeof Target; color: string }[] = [
  { id: "objectives", label: "Goals", icon: Target, color: "var(--color-brand-sky)" },
  { id: "phonics", label: "Phonics", icon: Mic2, color: "var(--color-brand-teal)" },
  { id: "activities", label: "Activities", icon: Puzzle, color: "var(--color-brand-coral)" },
  { id: "exercises", label: "Exercises", icon: PencilRuler, color: "var(--color-brand-grape)" },
  { id: "test", label: "Test", icon: Trophy, color: "var(--color-brand-yellow)" },
]

export default function UnitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const unit = EGYPTIAN_UNITS.find((u) => u.id === id)
  const [tab, setTab] = useState<Tab>("objectives")

  if (!unit) return notFound()

  return (
    <main className="min-h-[100svh] pb-28">
      <SiteHeader title={unit.title} backHref="/egyptian" />

      <div className="mx-auto w-full max-w-2xl px-4 pt-4">
        {/* Tab bar */}
        <div
          role="tablist"
          aria-label="Unit sections"
          className="flex gap-2 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {TABS.map((t) => {
            const Icon = t.icon
            const active = tab === t.id
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex min-h-12 shrink-0 items-center gap-2 rounded-2xl border-2 px-4 py-2 font-display text-sm font-bold transition-all",
                  active ? "border-transparent text-white shadow-md" : "border-border bg-card text-muted-foreground",
                )}
                style={active ? { backgroundColor: t.color } : undefined}
              >
                <Icon className="h-5 w-5" />
                {t.label}
              </button>
            )
          })}
        </div>

        <div className="pt-4">
          {tab === "objectives" && (
            <div className="flex flex-col gap-3 rounded-3xl border-4 border-white bg-card p-5 shadow-lg">
              <h2 className="font-display text-xl font-extrabold text-foreground">Unit Objectives</h2>
              <p className="text-sm text-muted-foreground">{unit.theme}</p>
              <ul className="flex flex-col gap-3 pt-1">
                {unit.objectives.map((o, i) => (
                  <li key={i} className="flex items-start gap-3 rounded-2xl bg-[var(--color-brand-cream)] p-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-sky)] font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="pt-1 font-semibold text-foreground">{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === "phonics" && <PhonicsLab unitId={unit.id} items={unit.phonics} />}

          {tab === "activities" && (
            <div className="flex flex-col gap-3">
              {unit.activities.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-3xl border-4 border-white bg-card p-4 shadow-md"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-brand-coral)] text-2xl">
                    {a.icon}
                  </div>
                  <div>
                    <p className="font-display text-lg font-extrabold text-foreground">{a.title}</p>
                    <p className="text-sm text-muted-foreground">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "exercises" && (
            <UnitExercises unitId={unit.id} questions={unit.exercises} mode="exercise" />
          )}

          {tab === "test" && <UnitExercises unitId={unit.id} questions={unit.test} mode="test" />}
        </div>
      </div>
    </main>
  )
}
