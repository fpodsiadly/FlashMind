import crypto from "node:crypto";
import { Language } from "@/app/utils/types";

const quickDictionary: Record<string, string> = {
  true: "prawda",
  false: "fałsz",
  science: "nauka",
  history: "historia",
  sport: "sport",
  geography: "geografia",
};

function hashText(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

const translationCache = new Map<string, string>();

function mockTranslate(text: string): string {
  const translated = text
    .split(/\b/)
    .map((part) => quickDictionary[part.toLowerCase()] ?? part)
    .join("");

  return translated;
}

async function openAiTranslate(text: string): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return "";
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_TRANSLATION_MODEL ?? "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: "Translate the text from English to Polish. Return only translated text.",
        },
        { role: "user", content: text },
      ],
    }),
  });

  if (!response.ok) {
    return mockTranslate(text);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return data.choices?.[0]?.message?.content?.trim() || "";
}

async function fallbackWebTranslate(text: string): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pl&dt=t&q=${encodeURIComponent(text)}`;
  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    return "";
  }

  const data = (await response.json()) as unknown;
  if (!Array.isArray(data) || !Array.isArray(data[0])) {
    return "";
  }

  const segments = data[0] as unknown[];
  const translated = segments
    .map((segment) => (Array.isArray(segment) && typeof segment[0] === "string" ? segment[0] : ""))
    .join("")
    .trim();

  return translated;
}

export async function translateText(text: string, targetLanguage: Language): Promise<string> {
  if (targetLanguage === "en") {
    return text;
  }

  const sourceHash = hashText(text);
  const cacheKey = `${sourceHash}:${targetLanguage}`;
  const cached = translationCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const openAiResult = await openAiTranslate(text);
  const webResult = openAiResult || (await fallbackWebTranslate(text));
  const translatedText = webResult || mockTranslate(text);

  translationCache.set(cacheKey, translatedText);

  return translatedText;
}
