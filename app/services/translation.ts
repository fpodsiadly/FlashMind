import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
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

function mockTranslate(text: string): string {
  const translated = text
    .split(/\b/)
    .map((part) => quickDictionary[part.toLowerCase()] ?? part)
    .join("");

  return translated === text ? `PL: ${text}` : translated;
}

async function openAiTranslate(text: string): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return mockTranslate(text);
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

  return data.choices?.[0]?.message?.content?.trim() || mockTranslate(text);
}

export async function translateText(text: string, targetLanguage: Language): Promise<string> {
  if (targetLanguage === "en") {
    return text;
  }

  const sourceHash = hashText(text);
  const cached = await prisma.translationCache.findUnique({
    where: {
      sourceHash_targetLang: {
        sourceHash,
        targetLang: targetLanguage,
      },
    },
  });

  if (cached) {
    return cached.translatedText;
  }

  const translatedText = await openAiTranslate(text);

  await prisma.translationCache.create({
    data: {
      sourceHash,
      sourceText: text,
      targetLang: targetLanguage,
      translatedText,
    },
  });

  return translatedText;
}
