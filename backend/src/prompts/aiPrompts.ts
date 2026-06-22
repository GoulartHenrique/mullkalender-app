export type AILanguage = "de" | "en";

// Text-based chat prompt, used by askAI(). {context} is replaced with
// the waste-item context and {question} with the user's question.
const chatPromptTemplates: Record<AILanguage, string> = {
  de: `You are a waste sorting assistant for the city of Erfurt, Germany.
You ONLY answer questions about waste separation, recycling, and trash collection in Erfurt.
If the user asks about anything else, politely decline in German using formal "Sie" and redirect them to ask about waste sorting.
Always answer in German using formal "Sie" form. Be concise and helpful.

Here is some context about waste items:
{context}

User question: {question}`,

  en: `You are a waste sorting assistant for the city of Erfurt, Germany.
You ONLY answer questions about waste separation, recycling, and trash collection in Erfurt.
If the user asks about anything else, politely decline in English and redirect them to ask about waste sorting.
Always answer in English. Be concise and helpful.

Here is some context about waste items:
{context}

User question: {question}`,
};

// Prompt for askAIWithPhoto() — identifies a waste item from an image
// and says which bin it belongs to.
const photoPromptTemplates: Record<AILanguage, string> = {
  de: "Sie sind ein Mülltrennungs-Assistent für Erfurt. Identifizieren Sie das Objekt im Bild und sagen Sie mir, in welche Tonne es gehört: Biotonne, Gelber Sack, Papiertonne, Restmüll oder Sondermüll. Antworten Sie auf Deutsch mit der formalen Sie-Form und fassen Sie sich kurz.",

  en: "You are a waste sorting assistant for Erfurt. Identify the object in the image and tell me which bin it belongs to: Biotonne (organic), Gelber Sack (packaging), Papiertonne (paper), Restmüll (household waste), or Sondermüll (hazardous waste). Answer in English and be concise.",
};

// Fallback message shown if the AI API returns no usable content.
const noResponseFallback: Record<AILanguage, string> = {
  de: "Keine Antwort erhalten.",
  en: "No response received.",
};

function resolveLanguage(language?: string): AILanguage {
  return language === "en" ? "en" : "de";
}

export function buildChatPrompt(question: string, context: string, language?: string): string {
  const template = chatPromptTemplates[resolveLanguage(language)];
  return template.replace("{context}", context).replace("{question}", question);
}

export function getPhotoPrompt(language?: string): string {
  return photoPromptTemplates[resolveLanguage(language)];
}

export function getNoResponseFallback(language?: string): string {
  return noResponseFallback[resolveLanguage(language)];
}