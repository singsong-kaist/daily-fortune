"use client";

import { useState } from "react";
import { getRandomFortune } from "./fortunes";

export default function FortuneCard() {
  const [flipped, setFlipped] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof getRandomFortune> | null>(null);

  function handleDraw() {
    if (flipped) {
      setFlipped(false);
      setResult(null);
      return;
    }
    setResult(getRandomFortune());
    setFlipped(true);
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="[perspective:1200px]">
        <div
          className={`relative h-80 w-56 transition-transform duration-700 [transform-style:preserve-3d] sm:h-96 sm:w-64 ${
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
        className="rounded-full bg-black px-8 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        {flipped ? "다시 뽑기" : "오늘의 운세 보기"}
      </button>
    </div>
  );
}
