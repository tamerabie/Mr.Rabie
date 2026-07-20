"use client"

import { useEffect, useRef, useState } from "react"
import { X, Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"
import type { VideoItem } from "@/lib/types"

export function VideoPlayer({ video, onClose }: { video: VideoItem; onClose: () => void }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [onClose])

  function toggle() {
    const el = ref.current
    if (!el) return
    if (el.paused) {
      el.play()
      setPlaying(true)
    } else {
      el.pause()
      setPlaying(false)
    }
  }

  function restart() {
    const el = ref.current
    if (!el) return
    el.currentTime = 0
    el.play()
    setPlaying(true)
  }

  function toggleMute() {
    const el = ref.current
    if (!el) return
    el.muted = !el.muted
    setMuted(el.muted)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Playing ${video.title}`}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl border-4 border-white bg-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close video"
          className="absolute right-3 top-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg"
        >
          <X className="h-6 w-6" />
        </button>

        <video
          ref={ref}
          className="aspect-video w-full bg-black"
          poster={video.thumbnail}
          preload="metadata"
          playsInline
          onTimeUpdate={(e) => {
            const el = e.currentTarget
            setProgress((el.currentTime / (el.duration || 1)) * 100)
          }}
          onEnded={() => setPlaying(false)}
        >
          <source src={video.src} type="video/mp4" />
        </video>

        {/* Large child-friendly controls */}
        <div className="flex flex-col gap-3 bg-[var(--color-brand-navy)] p-4">
          <div className="h-3 w-full overflow-hidden rounded-full bg-white/20" aria-hidden>
            <div
              className="h-full rounded-full bg-[var(--color-brand-yellow)] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-center gap-4">
            <ControlButton label="Restart" onClick={restart}>
              <RotateCcw className="h-7 w-7" />
            </ControlButton>
            <ControlButton label={playing ? "Pause" : "Play"} onClick={toggle} big>
              {playing ? <Pause className="h-9 w-9 fill-current" /> : <Play className="h-9 w-9 fill-current" />}
            </ControlButton>
            <ControlButton label={muted ? "Unmute" : "Mute"} onClick={toggleMute}>
              {muted ? <VolumeX className="h-7 w-7" /> : <Volume2 className="h-7 w-7" />}
            </ControlButton>
          </div>
          <p className="text-center font-display text-lg font-extrabold text-white">{video.title}</p>
        </div>
      </div>
    </div>
  )
}

function ControlButton({
  children,
  label,
  onClick,
  big,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
  big?: boolean
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105",
        big
          ? "h-20 w-20 bg-[var(--color-brand-sky)]"
          : "h-14 w-14 bg-white/15 hover:bg-white/25",
      )}
    >
      {children}
    </button>
  )
}
