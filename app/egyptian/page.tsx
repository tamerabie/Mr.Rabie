"use client"

import Link from "next/link"
import { useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { ProgressMap } from "@/components/egyptian/progress-map"
import { leoSay } from "@/lib/leo-events"
import { Clapperboard, MapPin } from "lucide-react"

export default function EgyptianPage() {
  useEffect(() => {
    leoSay("Welcome to the Egyptian Curriculum! Pick a unit on the map to begin.", "happy")
  }, [])

  return (
    <main className="min-h-[100svh] pb-28">
      <SiteHeader title="Egyptian Curriculum" backHref="/dashboard" />

      <div className="mx-auto w-full max-w-3xl px-4 pt-4">
        <div className="flex flex-col gap-3 rounded-3xl border-4 border-white bg-[var(--color-brand-teal)] p-5 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-xl font-extrabold">Your Learning Journey</h2>
              <p className="text-sm text-white/90">Follow the path and collect stars!</p>
            </div>
          </div>
          <Link
            href="/egyptian/videos"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-display text-base font-bold text-[var(--color-brand-teal)] shadow-md transition-transform hover:scale-105"
          >
            <Clapperboard className="h-5 w-5" />
            3D Video Hub
          </Link>
        </div>
      </div>

      <div className="px-4 pt-6">
        <ProgressMap />
      </div>
    </main>
  )
}
