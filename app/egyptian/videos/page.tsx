"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { VideoPlayer } from "@/components/egyptian/video-player"
import { videoTopics } from "@/lib/curriculum"
import { cn } from "@/lib/utils"
import { Play } from "lucide-react"
import type { VideoItem } from "@/lib/types"

export default function VideoHubPage() {
  const [activeTopic, setActiveTopic] = useState(videoTopics[0].id)
  const [playing, setPlaying] = useState<VideoItem | null>(null)

  const topic = videoTopics.find((t) => t.id === activeTopic)!

  return (
    <main className="min-h-[100svh] pb-28">
      <SiteHeader title="3D Video Hub" backHref="/egyptian" />

      <div className="mx-auto w-full max-w-4xl px-4 pt-4">
        {/* Topic chips (categorized by topic, not unit) */}
        <div
          role="tablist"
          aria-label="Video topics"
          className="flex gap-2 overflow-x-auto pb-3"
          style={{ scrollbarWidth: "none" }}
        >
          {videoTopics.map((t) => {
            const active = t.id === activeTopic
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTopic(t.id)}
                className={cn(
                  "flex min-h-12 shrink-0 items-center gap-2 rounded-full border-2 px-4 py-2 font-display text-sm font-bold transition-all",
                  active
                    ? "border-transparent bg-[var(--color-brand-sky)] text-white shadow-md"
                    : "border-border bg-card text-muted-foreground",
                )}
              >
                <span className="text-lg" aria-hidden>{t.emoji}</span>
                {t.title}
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2 lg:grid-cols-3">
          {topic.videos.map((v) => (
            <button
              key={v.id}
              onClick={() => setPlaying(v)}
              className="group flex flex-col overflow-hidden rounded-3xl border-4 border-white bg-card text-left shadow-md transition-transform hover:-translate-y-1"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-[var(--color-brand-cream)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.thumbnail || "/placeholder.svg"}
                  alt={v.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-[var(--color-brand-sky)] shadow-lg transition-transform group-hover:scale-110">
                    <Play className="h-8 w-8 fill-current" />
                  </span>
                </span>
                <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-bold text-white">
                  {v.duration}
                </span>
              </div>
              <div className="p-3">
                <p className="font-display text-base font-extrabold text-foreground">{v.title}</p>
                <p className="text-sm text-muted-foreground">{v.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {playing && <VideoPlayer video={playing} onClose={() => setPlaying(null)} />}
    </main>
  )
}
