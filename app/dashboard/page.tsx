"use client"

import Link from "next/link"
import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/components/providers/app-provider"
import { SiteHeader } from "@/components/site-header"
import { StarRating, ProgressBar } from "@/components/ui/gamified"
import { EGYPTIAN_UNITS } from "@/lib/curriculum"
import { leoSay, leoMood } from "@/lib/leo-events"
import { Globe2, Landmark, Star, Clock, Trophy, Sparkles } from "lucide-react"

const STICKER_LABELS: Record<string, string> = {
  "star-collector": "Star Collector",
  "phonics-pro": "Phonics Pro",
  "video-explorer": "Video Explorer",
  "game-champion": "Game Champion",
}

export default function DashboardPage() {
  const router = useRouter()
  const { currentUser, getProgress, state } = useApp()

  useEffect(() => {
    if (currentUser === null) {
      const t = setTimeout(() => router.replace("/auth"), 400)
      return () => clearTimeout(t)
    }
    if (currentUser) {
      leoMood("happy", 2500)
      leoSay(`Welcome back ${currentUser.name.split(" ")[0]}! Pick an adventure!`)
    }
  }, [currentUser, router])

  const progress = getProgress()
  const totalStars = useMemo(() => progress.reduce((a, p) => a + p.starsEarned, 0), [progress])
  const maxStars = EGYPTIAN_UNITS.length * 3
  const completion = Math.round((totalStars / maxStars) * 100)
  const minutes = currentUser ? Math.round((state.totalTimeMs[currentUser.id] ?? 0) / 60000) : 0
  const stickers = currentUser ? state.stickers[currentUser.id] ?? [] : []

  if (!currentUser) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center">
        <p className="text-muted-foreground">Loading your adventure…</p>
      </main>
    )
  }

  return (
    <>
      <SiteHeader title="My Adventure" />
      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-5">
        {/* Hero greeting */}
        <section className="rounded-3xl bg-gradient-to-br from-primary to-secondary p-5 text-primary-foreground shadow-lg">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-accent" />
            <p className="font-display text-xl font-black">Hi, {currentUser.name.split(" ")[0]}!</p>
          </div>
          <p className="mt-1 text-sm opacity-90">Ready to learn English and play with Leo today?</p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <StatChip icon={<Star size={18} />} value={`${totalStars}/${maxStars}`} label="Stars" />
            <StatChip icon={<Clock size={18} />} value={`${minutes}m`} label="Time" />
            <StatChip icon={<Trophy size={18} />} value={String(stickers.length)} label="Badges" />
          </div>

          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs font-bold">
              <span>Overall progress</span>
              <span>{completion}%</span>
            </div>
            <ProgressBar value={completion} barClassName="from-accent to-[#ffe066]" />
          </div>
        </section>

        {/* Path selection */}
        <h2 className="mt-7 font-display text-xl font-black">Choose your path</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <PathCard
            href="/egyptian"
            title="Egyptian Curriculum"
            desc="Units, Leo Phonics Lab & 3D videos"
            icon={<Landmark size={26} />}
            className="from-[#7cc6ea] to-[#4a9fd4]"
          />
          <PathCard
            href="/international"
            title="International Curriculum"
            desc="Games, songs & animated stories"
            icon={<Globe2 size={26} />}
            className="from-[#5fd0c5] to-[#37a99b]"
          />
        </div>

        {/* Badges */}
        <h2 className="mt-7 font-display text-xl font-black">My Badges</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {["star-collector", "phonics-pro", "video-explorer", "game-champion"].map((id) => {
            const owned = stickers.includes(id)
            return (
              <div
                key={id}
                className={`flex w-[104px] flex-col items-center gap-1 rounded-2xl border p-3 text-center ${
                  owned ? "border-accent bg-accent/15" : "border-dashed border-border bg-muted/40 opacity-60"
                }`}
              >
                <Trophy size={26} className={owned ? "text-accent-foreground" : "text-muted-foreground"} />
                <span className="text-xs font-bold leading-tight">{STICKER_LABELS[id]}</span>
              </div>
            )
          })}
        </div>

        {/* Continue units */}
        <h2 className="mt-7 font-display text-xl font-black">Egyptian units</h2>
        <div className="mt-3 grid gap-3">
          {EGYPTIAN_UNITS.map((u) => {
            const p = progress.find((x) => x.unitId === u.id)
            return (
              <Link
                key={u.id}
                href={`/egyptian?unit=${u.id}`}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm transition-transform active:scale-[0.99]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 font-display text-lg font-black text-primary">
                  {u.order}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{u.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{u.subtitle}</p>
                </div>
                <StarRating value={p?.starsEarned ?? 0} size={16} />
              </Link>
            )
          })}
        </div>
      </main>
    </>
  )
}

function StatChip({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white/15 py-2">
      <span className="text-accent">{icon}</span>
      <span className="font-display text-lg font-black leading-none">{value}</span>
      <span className="text-[11px] opacity-90">{label}</span>
    </div>
  )
}

function PathCard({
  href,
  title,
  desc,
  icon,
  className,
}: {
  href: string
  title: string
  desc: string
  icon: React.ReactNode
  className: string
}) {
  return (
    <Link
      href={href}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br p-5 text-white shadow-lg transition-transform active:scale-[0.98] ${className}`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">{icon}</div>
      <div className="mt-6">
        <p className="font-display text-xl font-black">{title}</p>
        <p className="text-sm text-white/90">{desc}</p>
      </div>
      <span className="mt-4 inline-flex w-fit items-center gap-1 rounded-full bg-white/25 px-3 py-1 text-sm font-bold">
        Start
      </span>
    </Link>
  )
}
