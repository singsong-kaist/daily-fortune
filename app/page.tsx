"use client";

import { useRef } from "react";
import FortuneCard from "./FortuneCard";
import TodayCount, { type TodayCountHandle } from "./TodayCount";

export default function Home() {
  const todayCountRef = useRef<TodayCountHandle>(null);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-zinc-50 px-4 font-sans dark:bg-black">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          오늘의 운세 🔮
        </h1>
        <TodayCount ref={todayCountRef} />
      </div>
      <FortuneCard onDrawn={() => todayCountRef.current?.refresh()} />
    </div>
  );
}
