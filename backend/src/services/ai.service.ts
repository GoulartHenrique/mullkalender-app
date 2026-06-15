import dotenv from "dotenv";
dotenv.config();

export const askAI = async (question: string, context: string): Promise<string> => {
const prompt = `You are a waste sorting assistant for the city of Erfurt, Germany.
You ONLY answer questions about waste separation, recycling, and trash collection in Erfurt.
If the user asks about anything else, politely decline in German and redirect them to ask about waste sorting.
Answer always in German. Be concise and helpful.

Here is some context about waste items:
${context}

User question: ${question}`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json() as any;

  return data.choices?.[0]?.message?.content ?? "Keine Antwort erhalten.";
};