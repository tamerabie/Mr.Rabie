"use client"

import { cn } from "@/lib/utils"
import { Star } from "lucide-react"

export function StarRating({
  value,
  max = 3,
  size = 22,
  className,
}: {
  value: number
  max?: number
  size?: number
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-1", className)} aria-label={`${value} of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            i < value ? "fill-[#ffd21f] text-[#e6b800]" : "fill-muted text-border",
          )}
        />
      ))}
    </div>
  )
}

export function ProgressBar({
  value,
  className,
  barClassName,
}: {
  value: number
  className?: string
  barClassName?: string
}) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div
      className={cn("h-4 w-full rounded-full bg-muted overflow-hidden border border-border", className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-full rounded-full bg-gradient-to-r from-secondary to-primary transition-all duration-700",
          barClassName,
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
