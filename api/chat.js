export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: messages.map(m => ({
          role: m.role,
          content: [{ type: "text", text: m.content }]
        }))
      })
    });

    const data = await response.json();

    if (!data.output_text) {
      return res.status(500).json({
        error: "No output from model",
        raw: data
      });
    }

    res.status(200).json({
      choices: [
        { message: { content: data.output_text } }
      ]
    });

  } catch (err) {
    res.status(500).json({
      error: "AI relay failed",
      details: err.message
    });
  }
}
