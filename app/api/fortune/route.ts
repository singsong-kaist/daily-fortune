import { NextResponse } from "next/server";
import { getZodiacSign } from "../../zodiac";

async function callOpenRouter(apiKey: string, body: Record<string, unknown>) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`OpenRouter request failed: ${await response.text()}`);
  }
  return response.json();
}

async function generateFortuneText(apiKey: string, birthdate: string | null, zodiac: string | null) {
  const personalization = birthdate && zodiac
    ? `사용자의 생년월일은 ${birthdate}이고 별자리는 ${zodiac}야. 이 정보를 자연스럽게 반영해서 운세를 알려줘.`
    : "사용자에게 오늘 하루의 운세를 알려줘.";

  const data = await callOpenRouter(apiKey, {
    model: "openai/gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "너는 재치있는 운세 작가야. 한국어 한 문장(40자 이내)으로 오늘의 운세를 알려줘. 따옴표나 접두어 없이 문장만 출력해.",
      },
      { role: "user", content: personalization },
    ],
    temperature: 1,
    max_tokens: 100,
  });

  const fortune = data.choices?.[0]?.message?.content?.trim();
  if (!fortune) throw new Error("Empty fortune response");
  return fortune as string;
}

async function generateFortuneImage(apiKey: string, fortune: string): Promise<string | null> {
  try {
    const data = await callOpenRouter(apiKey, {
      model: "google/gemini-2.5-flash-image",
      modalities: ["image", "text"],
      messages: [
        {
          role: "user",
          content: `다음 운세 문구의 분위기를 표현하는 파스텔톤의 아름다운 미니멀 일러스트를 그려줘: "${fortune}"`,
        },
      ],
    });

    const images = data.choices?.[0]?.message?.images;
    const imageUrl = images?.[0]?.image_url?.url;
    return typeof imageUrl === "string" ? imageUrl : null;
  } catch (err) {
    console.error("generateFortuneImage failed:", err);
    return null;
  }
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENROUTER_API_KEY is not set" }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const birthdate = typeof body.birthdate === "string" && body.birthdate ? body.birthdate : null;
  const zodiac = birthdate ? getZodiacSign(birthdate) : null;

  let fortune: string;
  try {
    fortune = await generateFortuneText(apiKey, birthdate, zodiac);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }

  const imageUrl = await generateFortuneImage(apiKey, fortune);

  return NextResponse.json({ fortune, zodiac, imageUrl });
}
