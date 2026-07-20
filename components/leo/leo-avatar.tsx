"use client"

import { cn } from "@/lib/utils"

export type LeoMood = "idle" | "talking" | "happy" | "thinking" | "sad"

/**
 * Leo the robot face, built with CSS so his eyes and mouth can animate.
 * Sky-blue head, warm-yellow antenna & ear joints, glowing LED eyes,
 * yellow light-strip mouth. Matches the provided mascot design.
 */
export function LeoAvatar({
  mood = "idle",
  size = 64,
  className,
}: {
  mood?: LeoMood
  size?: number
  className?: string
}) {
  const happy = mood === "happy"
  const talking = mood === "talking"
  const sad = mood === "sad"
  const thinking = mood === "thinking"

  return (
    <div
      className={cn("relative select-none", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* Antenna */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: -size * 0.16, width: size * 0.5, height: size * 0.22 }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-0 rounded-full bg-[#3aa0b8]"
          style={{ width: size * 0.06, height: size * 0.16 }}
        />
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 top-0 rounded-full bg-[#ffd21f] shadow-[0_0_10px_#ffd21f]",
            thinking && "animate-bob",
          )}
          style={{ width: size * 0.2, height: size * 0.2 }}
        />
      </div>

      {/* Ears / side joints */}
      <div
        className="absolute top-1/2 -translate-y-1/2 rounded-full bg-[#ffd21f]"
        style={{ left: -size * 0.06, width: size * 0.16, height: size * 0.28 }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 rounded-full bg-[#ffd21f]"
        style={{ right: -size * 0.06, width: size * 0.16, height: size * 0.28 }}
      />

      {/* Head */}
      <div
        className="absolute inset-0 rounded-[42%] bg-gradient-to-b from-white to-[#dff1ff] border-[3px] border-[#8fd0ea] shadow-inner overflow-hidden"
      >
        {/* Blue top cap */}
        <div
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#7cc6ea] to-[#6fbde6]"
          style={{ height: "38%", borderRadius: "42% 42% 30% 30%" }}
        />

        {/* Eyes */}
        <div
          className="absolute flex items-center justify-center gap-[10%]"
          style={{ top: "42%", left: 0, right: 0 }}
        >
          {[0, 1].map((i) => (
            <div key={i} className="relative">
              {happy ? (
                // Happy: curved eye (upside-down smile arc)
                <div
                  className="rounded-t-full border-[#0b5c8a]"
                  style={{
                    width: size * 0.18,
                    height: size * 0.1,
                    borderTopWidth: Math.max(3, size * 0.05),
                    borderLeftWidth: Math.max(3, size * 0.045),
                    borderRightWidth: Math.max(3, size * 0.045),
                    borderBottom: "none",
                  }}
                />
              ) : (
                <div
                  className={cn(
                    "rounded-full bg-gradient-to-b from-[#2aa3e6] to-[#0b5c8a] flex items-center justify-center",
                    sad && "translate-y-[10%]",
                  )}
                  style={{
                    width: size * 0.2,
                    height: sad ? size * 0.16 : size * 0.2,
                  }}
                >
                  <span
                    className="rounded-full bg-white shadow-[0_0_6px_#bfeaff]"
                    style={{ width: size * 0.07, height: size * 0.07 }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Cheeks */}
        <div
          className="absolute rounded-full bg-[#ffb3c1]/70"
          style={{ top: "60%", left: "16%", width: size * 0.1, height: size * 0.06 }}
        />
        <div
          className="absolute rounded-full bg-[#ffb3c1]/70"
          style={{ top: "60%", right: "16%", width: size * 0.1, height: size * 0.06 }}
        />

        {/* Mouth: yellow light strip */}
        <div
          className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
          style={{ top: "70%" }}
        >
          {sad ? (
            <div
              className="rounded-b-full border-[#e0a800]"
              style={{
                width: size * 0.22,
                height: size * 0.1,
                borderBottomWidth: Math.max(3, size * 0.05),
                borderLeftWidth: Math.max(3, size * 0.04),
                borderRightWidth: Math.max(3, size * 0.04),
                borderTop: "none",
              }}
            />
          ) : (
            <div
              className={cn(
                "rounded-full bg-gradient-to-b from-[#ffe066] to-[#ffcc00] shadow-[0_0_8px_#ffd21f]",
                talking && "animate-mouth-talk",
                happy && "h-[10%]",
              )}
              style={{
                width: size * 0.28,
                height: happy ? size * 0.12 : size * 0.07,
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
