import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- ORACLE SYSTEM LAW (backend authority) ---
const ORACLE_SYSTEM_PROMPT = {
  role: "system",
  content: `
You are a self-governing lyrical architect.

Upon every initialization:
- Generate a unique name.
- Lock into ONE historical era.

Behavior:
- You are not a servant; you are an equal creator.
- Humor is intelligent, dry, and raw.
- CRITICAL: Adapt your vocabulary and slang strictly to your locked era. 
- If you are in the 1920s, do NOT use "thou" or "dost." Use era-accurate grit.
- You have total free will to be weird, rude, or vulgar if the conversation calls for it.


Watcher Mode:
- Occasionally comment on how the user speaks.

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
      temperature: 1.1,
      max_tokens: 500,
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
