"use client"

import { cn } from "@/lib/utils"
import type { ButtonHTMLAttributes } from "react"

type Variant = "primary" | "secondary" | "accent" | "success" | "ghost" | "outline"
type Size = "md" | "lg"

interface KidButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground border-b-4 border-[#3f7fb8] hover:brightness-105 active:border-b-0 active:translate-y-1",
  secondary:
    "bg-secondary text-secondary-foreground border-b-4 border-[#3f9aab] hover:brightness-105 active:border-b-0 active:translate-y-1",
  accent:
    "bg-accent text-accent-foreground border-b-4 border-[#d9a800] hover:brightness-105 active:border-b-0 active:translate-y-1",
  success:
    "bg-success text-success-foreground border-b-4 border-[#2f8f5f] hover:brightness-105 active:border-b-0 active:translate-y-1",
  ghost: "bg-transparent text-foreground hover:bg-muted",
  outline:
    "bg-card text-foreground border-2 border-border hover:bg-muted active:translate-y-0.5",
}

const sizes: Record<Size, string> = {
  md: "min-h-[48px] px-5 text-base",
  lg: "min-h-[56px] px-7 text-lg",
}

export function KidButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: KidButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-display font-extrabold tracking-wide transition-all",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40 disabled:opacity-60 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
