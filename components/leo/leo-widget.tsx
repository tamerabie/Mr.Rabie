"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { LeoAvatar, type LeoMood } from "./leo-avatar"
import { useTTS, useSTT } from "@/hooks/use-speech"
import { useApp } from "@/components/providers/app-provider"
import { cn } from "@/lib/utils"
import { Mic, Send, X, Minus, Languages, Volume2 } from "lucide-react"

interface Msg {
  role: "user" | "assistant"
  content: string
}

const GREETING_EN = "Hi! I'm Leo. Ask me anything, or tap the mic to talk to me!"
const GREETING_AR = "أهلاً! أنا ليو. اسألني أي حاجة أو دوس على الميكروفون تكلمني!"

export function LeoWidget() {
  const { currentUser, track } = useApp()
  const { speak, speaking, stop: stopTTS } = useTTS()
  const [lang, setLang] = useState<"en" | "ar">("en")
  const stt = useSTT(lang === "en" ? "en-US" : "ar-EG")

  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [mood, setMood] = useState<LeoMood>("idle")
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: GREETING_EN }])

  // draggable position
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const dragRef = useRef<{ dx: number; dy: number; moved: boolean } | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Sync mood with TTS speaking state
  useEffect(() => {
    if (speaking) setMood("talking")
    else setMood((m) => (m === "talking" ? "idle" : m))
  }, [speaking])

  // Global event bridge: other pages can make Leo talk / react
  useEffect(() => {
    const onSay = (e: Event) => {
      const detail = (e as CustomEvent).detail as { text: string; lang?: "en" | "ar" }
      if (!detail?.text) return
      speak(detail.text, { lang: detail.lang === "ar" ? "ar-EG" : "en-US" })
    }
    const onMood = (e: Event) => {
      const detail = (e as CustomEvent).detail as { mood: LeoMood; ms?: number }
      setMood(detail.mood)
      if (detail.ms) setTimeout(() => setMood("idle"), detail.ms)
    }
    window.addEventListener("leo:say", onSay)
    window.addEventListener("leo:mood", onMood)
    return () => {
      window.removeEventListener("leo:say", onSay)
      window.removeEventListener("leo:mood", onMood)
    }
  }, [speak])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, loading])

  const send = useCallback(
    async (text: string) => {
      const clean = text.trim()
      if (!clean || loading) return
      const next = [...messages, { role: "user" as const, content: clean }]
      setMessages(next)
      setInput("")
      setLoading(true)
      setMood("thinking")
      track("leo_message", { label: clean.slice(0, 60) })
      try {
        const res = await fetch("/api/leo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: next.slice(-8) }),
        })
        const data = await res.json()
        const reply = data.text as string
        setMessages((m) => [...m, { role: "assistant", content: reply }])
        speak(reply, { lang: /[\u0600-\u06FF]/.test(reply) ? "ar-EG" : "en-US" })
      } catch {
        const reply = lang === "ar" ? "حاول تاني، أنا معاك!" : "Let's try again, I'm here to help!"
        setMessages((m) => [...m, { role: "assistant", content: reply }])
      } finally {
        setLoading(false)
      }
    },
    [messages, loading, track, speak, lang],
  )

  const handleMic = useCallback(async () => {
    if (!stt.supported) return
    setMood("thinking")
    const { transcript } = await stt.listen()
    if (transcript) await send(transcript)
    else setMood("idle")
  }, [stt, send])

  // Dragging
  const onPointerDown = (e: React.PointerEvent) => {
    const startX = pos?.x ?? window.innerWidth - 92
    const startY = pos?.y ?? window.innerHeight - 92
    dragRef.current = { dx: e.clientX - startX, dy: e.clientY - startY, moved: false }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return
    const x = e.clientX - dragRef.current.dx
    const y = e.clientY - dragRef.current.dy
    if (Math.abs(e.movementX) + Math.abs(e.movementY) > 2) dragRef.current.moved = true
    const clampedX = Math.max(8, Math.min(window.innerWidth - 76, x))
    const clampedY = Math.max(8, Math.min(window.innerHeight - 76, y))
    setPos({ x: clampedX, y: clampedY })
  }
  const onPointerUp = (e: React.PointerEvent) => {
    const moved = dragRef.current?.moved
    dragRef.current = null
    if (!moved) setOpen((o) => !o)
    ;(e.target as HTMLElement).releasePointerCapture?.(e.pointerId)
  }

  const bubbleStyle = pos
    ? { left: pos.x, top: pos.y, right: "auto", bottom: "auto" }
    : { right: 16, bottom: 16 }

  const toggleLang = () => {
    const nl = lang === "en" ? "ar" : "en"
    setLang(nl)
    setMessages((m) => {
      if (m.length === 1) return [{ role: "assistant", content: nl === "ar" ? GREETING_AR : GREETING_EN }]
      return m
    })
  }

  // Minimized: tiny tab on the edge
  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-4 right-0 z-[60] flex items-center gap-1 rounded-l-2xl bg-primary py-2 pl-3 pr-2 text-primary-foreground shadow-lg min-h-[48px]"
        aria-label="Show Leo"
      >
        <LeoAvatar mood="happy" size={30} />
        <span className="font-display text-sm font-bold">Leo</span>
      </button>
    )
  }

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div
          className="fixed z-[70] flex w-[min(92vw,360px)] flex-col overflow-hidden rounded-3xl border-2 border-primary/30 bg-card shadow-2xl animate-pop-in"
          style={{
            right: 16,
            bottom: 92,
            maxHeight: "min(70dvh, 560px)",
          }}
          role="dialog"
          aria-label="Chat with Leo"
        >
          {/* Header */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary px-3 py-2 text-primary-foreground">
            <LeoAvatar mood={mood} size={40} />
            <div className="flex-1">
              <p className="font-display text-base font-extrabold leading-none">Leo</p>
              <p className="text-xs opacity-90">{lang === "ar" ? "صديقك المساعد" : "Your learning buddy"}</p>
            </div>
            <button
              onClick={toggleLang}
              className="flex min-h-[40px] min-w-[40px] items-center justify-center gap-1 rounded-xl bg-white/20 px-2 text-xs font-bold"
              aria-label="Toggle language"
            >
              <Languages size={16} />
              {lang.toUpperCase()}
            </button>
            <button
              onClick={() => setMinimized(true)}
              className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl bg-white/20"
              aria-label="Minimize Leo"
            >
              <Minus size={18} />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl bg-white/20"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-muted/40 p-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn("flex items-end gap-2", m.role === "user" ? "flex-row-reverse" : "")}
                dir={/[\u0600-\u06FF]/.test(m.content) ? "rtl" : "ltr"}
              >
                {m.role === "assistant" && <LeoAvatar mood={mood} size={30} className="shrink-0" />}
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card border border-border rounded-bl-sm",
                  )}
                >
                  {m.content}
                  {m.role === "assistant" && (
                    <button
                      onClick={() => speak(m.content, { lang: /[\u0600-\u06FF]/.test(m.content) ? "ar-EG" : "en-US" })}
                      className="ml-2 inline-flex align-middle text-muted-foreground"
                      aria-label="Play Leo's voice"
                    >
                      <Volume2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2">
                <LeoAvatar mood="thinking" size={30} />
                <div className="flex gap-1 rounded-2xl border border-border bg-card px-3 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.2s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-secondary" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:0.2s]" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
            className="flex items-center gap-2 border-t border-border bg-card p-2"
          >
            <button
              type="button"
              onClick={handleMic}
              disabled={!stt.supported}
              className={cn(
                "flex min-h-[48px] min-w-[48px] items-center justify-center rounded-2xl transition-colors",
                stt.listening ? "bg-destructive text-destructive-foreground animate-wiggle" : "bg-secondary text-secondary-foreground",
                !stt.supported && "opacity-40",
              )}
              aria-label="Speak to Leo"
            >
              <Mic size={20} />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing && (e as any).keyCode !== 229) {
                  e.preventDefault()
                  send(input)
                }
              }}
              placeholder={lang === "ar" ? "اكتب لليو..." : "Type to Leo..."}
              dir={lang === "ar" ? "rtl" : "ltr"}
              className="min-h-[48px] flex-1 rounded-2xl border border-input bg-background px-4 text-base outline-none focus:ring-2 focus:ring-ring/40"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-2xl bg-primary text-primary-foreground disabled:opacity-40"
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}

      {/* Floating draggable Leo */}
      <div
        className="fixed z-[60] touch-none"
        style={bubbleStyle as React.CSSProperties}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div className="relative animate-bob cursor-grab active:cursor-grabbing">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-white to-[#e7f5ff] shadow-xl ring-4 ring-primary/25">
            <LeoAvatar mood={open ? mood : "happy"} size={52} />
          </div>
          {!open && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-black text-accent-foreground shadow">
              ?
            </span>
          )}
        </div>
      </div>
    </>
  )
}
