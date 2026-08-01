"use client";

import { useEffect, useState } from "react";
import { fortunes, getRandomLuckyExtras } from "./fortunes";
import { supabase, type FortuneDraw } from "@/lib/supabase";
import { useAuth } from "./AuthProvider";

type FortuneResult = { fortune: string; luckyItem: string; luckyNumber: number; imageUrl: string | null };

const BIRTHDATE_STORAGE_KEY = "fortune-birthdate";

async function generateAiFortune(birthdate: string): Promise<{ fortune: string; imageUrl: string | null }> {
  const res = await fetch("/api/fortune", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ birthdate }),
  });
  if (!res.ok) throw new Error("AI fortune request failed");
  const data = await res.json();
  if (!data.fortune) throw new Error("Empty AI fortune");
  return { fortune: data.fortune as string, imageUrl: data.imageUrl ?? null };
}

export default function FortuneCard({ onDrawn }: { onDrawn?: () => void }) {
  const { user } = useAuth();
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [history, setHistory] = useState<FortuneDraw[]>([]);
  const [birthdate, setBirthdate] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(BIRTHDATE_STORAGE_KEY);
    if (saved) setBirthdate(saved);
  }, []);

  useEffect(() => {
    if (user) loadHistory(user.id);
    else setHistory([]);
  }, [user]);

  async function loadHistory(userId: string) {
    const { data, error } = await supabase
      .from("fortune_draws")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);
    if (!error && data) setHistory(data);
  }

  function handleBirthdateChange(value: string) {
    setBirthdate(value);
    window.localStorage.setItem(BIRTHDATE_STORAGE_KEY, value);
  }

  async function handleDraw() {
    if (flipped) {
      setFlipped(false);
      setResult(null);
      return;
    }
    if (!birthdate) return;

    setLoading(true);
    let fortune: string;
    let imageUrl: string | null = null;
    try {
      const ai = await generateAiFortune(birthdate);
      fortune = ai.fortune;
      imageUrl = ai.imageUrl;
    } catch {
      fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    }
    const draw: FortuneResult = { fortune, imageUrl, ...getRandomLuckyExtras() };
    setResult(draw);
    setFlipped(true);
    setLoading(false);

    await supabase.from("fortune_draws").insert({
      fortune: draw.fortune,
      lucky_item: draw.luckyItem,
      lucky_number: draw.luckyNumber,
      user_id: user?.id ?? null,
    });
    if (user) loadHistory(user.id);
    onDrawn?.();
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {!flipped && (
        <label className="flex flex-col items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
          생년월일을 입력해주세요
          <input
            type="date"
            value={birthdate}
            onChange={(e) => handleBirthdateChange(e.target.value)}
            className="rounded-full border border-zinc-300 px-3 py-1.5 text-sm text-zinc-800 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </label>
      )}

      <div className="[perspective:1200px]">
        <div
          className={`relative h-[26rem] w-56 transition-transform duration-700 [transform-style:preserve-3d] sm:h-[30rem] sm:w-64 ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* front */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl [backface-visibility:hidden]">
            <span className="text-6xl">🔮</span>
            <span className="text-lg font-semibold text-white">오늘의 운세</span>
          </div>

          {/* back */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl bg-white p-6 text-center shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)] dark:bg-zinc-900">
            {result && (
              <>
                {result.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={result.imageUrl}
                    alt="오늘의 운세 이미지"
                    className="h-32 w-32 rounded-xl object-cover shadow-md"
                  />
                )}
                <p className="text-base font-medium leading-relaxed text-zinc-800 dark:text-zinc-100">
                  {result.fortune}
                </p>
                <div className="mt-2 flex flex-col gap-1 text-sm text-zinc-500 dark:text-zinc-400">
                  <p>
                    🍀 행운의 아이템: <span className="font-semibold text-zinc-700 dark:text-zinc-200">{result.luckyItem}</span>
                  </p>
                  <p>
                    🔢 행운의 숫자: <span className="font-semibold text-zinc-700 dark:text-zinc-200">{result.luckyNumber}</span>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleDraw}
        disabled={loading || (!flipped && !birthdate)}
        className="rounded-full bg-black px-8 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        {loading ? "AI가 운세를 만드는 중..." : flipped ? "다시 뽑기" : "오늘의 운세 보기"}
      </button>

      {user ? (
        history.length > 0 && (
          <div className="w-full max-w-sm">
            <h2 className="mb-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              내가 뽑은 운세
            </h2>
            <ul className="flex flex-col gap-2">
              {history.map((item) => (
                <li
                  key={item.id}
                  className="rounded-lg bg-white p-3 text-sm text-zinc-700 shadow-sm dark:bg-zinc-900 dark:text-zinc-200"
                >
                  <p>{item.fortune}</p>
                  <p className="mt-1 text-xs text-zinc-400">
                    🍀 {item.lucky_item} · 🔢 {item.lucky_number}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )
      ) : (
        <p className="text-sm text-zinc-400">로그인하면 내가 뽑은 운세 기록을 볼 수 있어요.</p>
      )}
    </div>
  );
}
