"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useApp } from "@/components/providers/app-provider"
import { ArrowLeft, LogOut } from "lucide-react"

export function SiteHeader({
  title,
  backHref,
}: {
  title?: string
  backHref?: string
}) {
  const router = useRouter()
  const { currentUser, signOut } = useApp()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-2 px-3">
        {backHref ? (
          <Link
            href={backHref}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted text-foreground"
            aria-label="Go back"
          >
            <ArrowLeft size={22} />
          </Link>
        ) : (
          <Image src="/welcome.png" alt="ELH logo" width={40} height={40} className="h-10 w-10 object-contain" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg font-black leading-tight">{title ?? "ELH-PRIMARY1"}</p>
          {currentUser && <p className="truncate text-xs text-muted-foreground">Hi, {currentUser.name.split(" ")[0]}!</p>}
        </div>
        {currentUser && (
          <button
            onClick={() => {
              signOut()
              router.push("/auth")
            }}
            className="flex h-11 min-w-[44px] items-center justify-center gap-1 rounded-2xl bg-muted px-3 text-sm font-bold text-foreground"
            aria-label="Sign out"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </header>
  )
}
