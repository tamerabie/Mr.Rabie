import { generateText } from "ai"

export const maxDuration = 30

const SYSTEM_PROMPT = `You are Leo, a warm, cheerful AI learning buddy for a 6-year-old child in Egypt learning English (Primary 1).

Rules:
- You are bilingual. Reply in the SAME language the child uses. If they write Arabic, answer in simple Arabic. If English, answer in very simple English. If mixed, mirror them.
- Always be gentle, patient, playful and encouraging. Use lots of positive reinforcement ("Great job!", "You can do it!", "أحسنت!").
- Keep answers VERY short (1-3 short sentences). Use simple words a 6-year-old knows.
- Help explain difficult ideas with tiny, concrete examples (an apple, a cat, a ball).
- Never scold. If they make a mistake, cheer them on to try again.
- No complex vocabulary, no long paragraphs, no markdown formatting.`

const FALLBACKS = [
  "Great question! Let's try it together. You are doing amazing! 🙂",
  "You can do it! Take a deep breath and try one more time.",
  "أحسنت! جرب مرة تانية، أنا معاك خطوة بخطوة.",
  "Well done for asking! Point to the letter and say it out loud with me.",
]

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as {
      messages: { role: "user" | "assistant"; content: string }[]
    }

    const result = await generateText({
      model: "openai/gpt-4o-mini",
      system: SYSTEM_PROMPT,
      messages,
      maxOutputTokens: 200,
      temperature: 0.7,
    })

    return Response.json({ text: result.text })
  } catch (err) {
    console.log("[v0] Leo AI fallback:", (err as Error)?.message)
    const text = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)]
    return Response.json({ text, fallback: true })
  }
}
