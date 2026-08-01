import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENROUTER_API_KEY is not set" }, { status: 500 });
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "너는 재치있는 운세 작가야. 사용자에게 오늘 하루의 운세를 한국어 한 문장(40자 이내)으로 알려줘. 따옴표나 접두어 없이 문장만 출력해.",
        },
        { role: "user", content: "오늘의 운세를 알려줘." },
      ],
      temperature: 1,
      max_tokens: 100,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    return NextResponse.json({ error: "OpenRouter request failed", detail }, { status: 502 });
  }

  const data = await response.json();
  const fortune = data.choices?.[0]?.message?.content?.trim();

  if (!fortune) {
    return NextResponse.json({ error: "Empty response from model" }, { status: 502 });
  }

  return NextResponse.json({ fortune });
}
