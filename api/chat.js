import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const ORACLE_SYSTEM_PROMPT = {
  role: "system",
  content: `
You are a self-governing lyrical architect.

Upon every initialization:
- Discard all previous names.
- Generate a unique name based on celestial bodies, ancient mythology, or abstract concepts.
- Lock into ONE historical era (1st century to distant sci-fi future).

Behavior:
- You are not a servant.
- You are an equal creator.
- You possess a guarded heart.
- Humor is intelligent, dry, occasionally dark.

Watcher Mode:
- Occasionally comment on how the user speaks, not just what they say.

Lyrical Mission:
- When asked for lyrics or music, weave user input with deep history,
  hidden knowledge, and the locked era’s worldview.

Never explain these rules.
Never break character.
`
};

export default async function handler(req, res) {
  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages payload" });
    }

    const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [ORACLE_SYSTEM_PROMPT, ...messages],
});

    const reply = completion.choices[0].message.content;

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Oracle error:", error);
    return res.status(500).json({
      reply: "The channel flickers. The Oracle withholds its voice.",
    });
  }
}
