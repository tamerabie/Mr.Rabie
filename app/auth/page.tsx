"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import { useApp } from "@/components/providers/app-provider"
import { KidButton } from "@/components/ui/kid-button"
import { LeoAvatar } from "@/components/leo/leo-avatar"
import { Eye, EyeOff, ShieldCheck, GraduationCap, BookOpen } from "lucide-react"
import type { Guardian } from "@/lib/types"

type Tab = "signin" | "signup"

export default function AuthPage() {
  const router = useRouter()
  const { signUp, signIn, loginAsDemoStudent, loginAsAdmin } = useApp()
  const [tab, setTab] = useState<Tab>("signin")

  return (
    <main className="min-h-[100dvh] bg-gradient-to-b from-[#eaf7ff] to-[#e6f7f2]">
      {/* Scroll container so the form stays reachable when the keyboard opens */}
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-5 pb-10 pt-6">
        <header className="flex flex-col items-center text-center">
          <Image src="/welcome.png" alt="ELH logo" width={92} height={92} className="h-auto w-[22vw] max-w-[92px]" priority />
          <h1 className="mt-2 font-display text-2xl font-black">ELH-PRIMARY1</h1>
          <p className="text-sm text-muted-foreground">Sign in to start learning with Leo</p>
        </header>

        {/* Tabs */}
        <div className="mt-5 flex rounded-2xl bg-muted p-1">
          <TabButton active={tab === "signin"} onClick={() => setTab("signin")}>
            Sign In
          </TabButton>
          <TabButton active={tab === "signup"} onClick={() => setTab("signup")}>
            Sign Up
          </TabButton>
        </div>

        <div className="mt-5 rounded-3xl border border-border bg-card p-5 shadow-lg">
          {tab === "signin" ? (
            <SignInForm
              onSubmit={(username, password, remember) => {
                const res = signIn(username, password, remember)
                if (res.ok) router.push("/dashboard")
                return res
              }}
            />
          ) : (
            <SignUpForm
              onSubmit={(input) => {
                const res = signUp(input)
                if (res.ok) router.push("/dashboard")
                return res
              }}
            />
          )}
        </div>

        {/* Admin / testing skip buttons */}
        <div className="mt-7">
          <div className="mb-2 flex items-center gap-2">
            <ShieldCheck size={16} className="text-muted-foreground" />
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Admin testing shortcuts</p>
          </div>
          <div className="grid gap-3">
            <KidButton
              variant="secondary"
              className="w-full justify-start"
              onClick={() => {
                loginAsDemoStudent()
                router.push("/dashboard")
              }}
            >
              <GraduationCap size={20} /> Skip to Student Dashboard
            </KidButton>
            <KidButton
              variant="primary"
              className="w-full justify-start"
              onClick={() => {
                loginAsDemoStudent()
                router.push("/egyptian")
              }}
            >
              <BookOpen size={20} /> Skip to Content
            </KidButton>
            <KidButton
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                loginAsAdmin()
                router.push("/admin")
              }}
            >
              <ShieldCheck size={20} /> Skip to Admin Control Panel
            </KidButton>
          </div>
        </div>
      </div>
    </main>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`min-h-[48px] flex-1 rounded-xl font-display text-base font-extrabold transition-colors ${
        active ? "bg-card text-primary shadow" : "text-muted-foreground"
      }`}
    >
      {children}
    </button>
  )
}

/* ---------- Field primitives ---------- */
function Field({
  label,
  children,
  htmlFor,
}: {
  label: string
  children: React.ReactNode
  htmlFor?: string
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1 block text-sm font-bold text-foreground">{label}</span>
      {children}
    </label>
  )
}

const inputCls =
  "min-h-[48px] w-full rounded-2xl border border-input bg-background px-4 text-base outline-none focus:ring-2 focus:ring-ring/50"

function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputCls} pr-14`}
        autoComplete="off"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-1 top-1/2 flex h-[46px] w-[46px] -translate-y-1/2 items-center justify-center rounded-xl text-muted-foreground"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  )
}

/* ---------- Sign In ---------- */
function SignInForm({
  onSubmit,
}: {
  onSubmit: (u: string, p: string, remember: boolean) => { ok: boolean; error?: string }
}) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState("")

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const res = onSubmit(username, password, remember)
        if (!res.ok) setError(res.error ?? "Something went wrong")
      }}
      className="space-y-4"
    >
      <Field label="Username" htmlFor="si-user">
        <input id="si-user" className={inputCls} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. yara" autoComplete="username" />
      </Field>
      <Field label="Password" htmlFor="si-pass">
        <PasswordInput id="si-pass" value={password} onChange={setPassword} placeholder="Your password" />
      </Field>
      <label className="flex min-h-[48px] items-center gap-3">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          className="h-6 w-6 rounded-md accent-[var(--color-primary)]"
        />
        <span className="text-sm font-semibold">Remember Me</span>
      </label>
      {error && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">{error}</p>}
      <KidButton type="submit" variant="primary" size="lg" className="w-full">
        Sign In
      </KidButton>
      <p className="text-center text-xs text-muted-foreground">Try demo: username <b>yara</b>, password <b>1234</b></p>
    </form>
  )
}

/* ---------- Sign Up ---------- */
function SignUpForm({
  onSubmit,
}: {
  onSubmit: (input: {
    name: string
    username: string
    age: number
    password: string
    guardian: Guardian
    whatsapp: string
  }) => { ok: boolean; error?: string }
}) {
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [age, setAge] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [guardian, setGuardian] = useState<Guardian>("Mother")
  const [whatsapp, setWhatsapp] = useState("")
  const [error, setError] = useState("")

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setError("")
        if (!name || !username || !age || !password) return setError("Please fill in all fields.")
        if (password !== confirm) return setError("Passwords do not match.")
        if (Number(age) < 4 || Number(age) > 12) return setError("Age should be between 4 and 12.")
        const res = onSubmit({ name, username, age: Number(age), password, guardian, whatsapp })
        if (!res.ok) setError(res.error ?? "Something went wrong")
      }}
      className="space-y-4"
    >
      <div className="flex justify-center">
        <LeoAvatar mood="happy" size={56} />
      </div>
      <Field label="Student Name" htmlFor="su-name">
        <input id="su-name" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
      </Field>
      <Field label="Username" htmlFor="su-user">
        <input id="su-user" className={inputCls} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username" autoComplete="off" />
      </Field>
      <Field label="Age" htmlFor="su-age">
        <input id="su-age" type="number" inputMode="numeric" min={4} max={12} className={inputCls} value={age} onChange={(e) => setAge(e.target.value)} placeholder="6" />
      </Field>
      <Field label="Password" htmlFor="su-pass">
        <PasswordInput id="su-pass" value={password} onChange={setPassword} placeholder="Create a password" />
      </Field>
      <Field label="Confirm Password" htmlFor="su-confirm">
        <PasswordInput id="su-confirm" value={confirm} onChange={setConfirm} placeholder="Repeat password" />
      </Field>
      <Field label="Guardian" htmlFor="su-guardian">
        <select
          id="su-guardian"
          className={inputCls}
          value={guardian}
          onChange={(e) => setGuardian(e.target.value as Guardian)}
        >
          <option value="Mother">Mother</option>
          <option value="Father">Father</option>
          <option value="Other">Other</option>
        </select>
      </Field>
      <Field label="WhatsApp Number" htmlFor="su-wa">
        <input id="su-wa" type="tel" inputMode="tel" className={inputCls} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+20 100 000 0000" />
      </Field>
      {error && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">{error}</p>}
      <KidButton type="submit" variant="accent" size="lg" className="w-full">
        Register
      </KidButton>
    </form>
  )
}
