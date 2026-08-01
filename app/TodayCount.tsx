"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { supabase } from "@/lib/supabase";

export type TodayCountHandle = {
  refresh: () => void;
};

function getTodayStartIso() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString();
}

const TodayCount = forwardRef<TodayCountHandle>(function TodayCount(_props, ref) {
  const [count, setCount] = useState<number | null>(null);

  async function loadCount() {
    const { count, error } = await supabase
      .from("fortune_draws")
      .select("*", { count: "exact", head: true })
      .gte("created_at", getTodayStartIso());
    if (!error) setCount(count ?? 0);
  }

  useEffect(() => {
    loadCount();
  }, []);

  useImperativeHandle(ref, () => ({ refresh: loadCount }));

  if (count === null) return null;

  return (
    <p className="text-sm text-zinc-500 dark:text-zinc-400">
      오늘 운세를 뽑은 사람 <span className="font-semibold text-zinc-700 dark:text-zinc-200">{count}</span>명
    </p>
  );
});

export default TodayCount;
