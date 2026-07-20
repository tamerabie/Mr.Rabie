import Image from "next/image"
import Link from "next/link"
import { KidButton } from "@/components/ui/kid-button"
import { Sparkles } from "lucide-react"

const FLOATERS = [
  { label: "A", top: "12%", left: "10%", cls: "animate-float-slow", color: "bg-secondary text-secondary-foreground", delay: "0s" },
  { label: "B", top: "22%", left: "80%", cls: "animate-float-medium", color: "bg-primary text-primary-foreground", delay: "0.4s" },
  { label: "1", top: "68%", left: "14%", cls: "animate-float-fast", color: "bg-accent text-accent-foreground", delay: "0.8s" },
  { label: "C", top: "76%", left: "78%", cls: "animate-float-medium", color: "bg-success text-success-foreground", delay: "0.2s" },
  { label: "★", top: "42%", left: "6%", cls: "animate-float-fast", color: "bg-accent text-accent-foreground", delay: "0.6s" },
  { label: "2", top: "50%", left: "88%", cls: "animate-float-slow", color: "bg-secondary text-secondary-foreground", delay: "0.1s" },
]

export default function WelcomePage() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#eaf7ff] via-[#f4fbff] to-[#e6f7f2] px-6">
      {/* Playful floating letters/numbers background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {FLOATERS.map((f, i) => (
          <span
            key={i}
            className={`absolute flex h-14 w-14 items-center justify-center rounded-2xl font-display text-2xl font-black shadow-lg ${f.color} ${f.cls}`}
            style={{ top: f.top, left: f.left, animationDelay: f.delay }}
          >
            {f.label}
          </span>
        ))}
        {/* soft blurred blobs for depth */}
        <div className="absolute -left-16 top-1/3 h-56 w-56 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute -right-10 bottom-1/4 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      </div>

      {/* Center logo */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="animate-pop-in">
          <div className="relative animate-bob">
            <Image
              src="/welcome.png"
              alt="ELH Primary 1 English learning platform logo"
              width={280}
              height={280}
              priority
              className="h-auto w-[62vw] max-w-[280px] drop-shadow-2xl"
            />
          </div>
        </div>

        <h1 className="mt-4 font-display text-3xl font-black text-foreground text-balance sm:text-4xl">
          ELH-PRIMARY1
        </h1>
        <p className="mt-1 flex items-center gap-2 font-display text-lg font-bold text-secondary">
          <Sparkles size={18} className="text-accent" />
          1st Term English Adventure
          <Sparkles size={18} className="text-accent" />
        </p>
        <p className="mt-3 max-w-xs text-pretty text-muted-foreground">
          Learn to read, speak and play with Leo, your friendly robot buddy!
        </p>

        <Link href="/auth" className="mt-8 w-full max-w-xs">
          <KidButton size="lg" variant="accent" className="w-full animate-wiggle">
            Let&apos;s Start!
          </KidButton>
        </Link>
      </div>

      <p className="absolute bottom-4 z-10 text-xs text-muted-foreground">Egyptian &amp; International Curriculum</p>
    </main>
  )
}
