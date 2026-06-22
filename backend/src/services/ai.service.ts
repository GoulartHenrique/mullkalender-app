import dotenv from "dotenv";
import { buildChatPrompt, getPhotoPrompt, getNoResponseFallback } from "../prompts/aiPrompts";

dotenv.config();

export const askAI = async (
  question: string,
  context: string,
  language?: string
): Promise<string> => {
  const prompt = buildChatPrompt(question, context, language);

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
  return data.choices?.[0]?.message?.content ?? getNoResponseFallback(language);
};

export const askAIWithPhoto = async (
  base64Image: string,
  mimeType: string,
  language?: string
): Promise<string> => {
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
              text: getPhotoPrompt(language),
            },
          ],
        },
      ],
    }),
  });

  const data = await response.json() as any;
  return data.choices?.[0]?.message?.content ?? getNoResponseFallback(language);
};