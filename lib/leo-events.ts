import type { LeoMood } from "@/components/leo/leo-avatar"

export function leoSay(text: string, lang: "en" | "ar" = "en") {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent("leo:say", { detail: { text, lang } }))
}

export function leoMood(mood: LeoMood, ms?: number) {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent("leo:mood", { detail: { mood, ms } }))
}
