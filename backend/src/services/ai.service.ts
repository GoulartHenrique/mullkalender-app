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

export const askAIWithPhoto = async (base64Image: string, mimeType: string): Promise<string> => {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${base64Image}` },
            },
            {
              type: "text",
              text: "Du bist ein Mülltrennungs-Assistent für Erfurt. Identifiziere das Objekt im Bild und sage mir, in welche Tonne es gehört: Biotonne, Gelber Sack, Papiertonne, Restmüll oder Sondermüll. Antworte auf Deutsch und sei kurz.",
            },
          ],
        },
      ],
    }),
  });

  const data = await response.json() as any;
  console.log("Groq photo response:", JSON.stringify(data));
  return data.choices?.[0]?.message?.content ?? "Keine Antwort erhalten.";
};