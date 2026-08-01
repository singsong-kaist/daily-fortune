"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthProvider";

export default function AuthBar() {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const { error } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setSubmitting(false);
    if (error) {
      setMessage(error.message);
    } else if (mode === "signup") {
      setMessage("가입 확인 이메일을 보냈어요. 메일함을 확인해주세요.");
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  if (loading) return null;

  if (user) {
    return (
      <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
        <span>{user.email}</span>
        <button
          onClick={handleSignOut}
          className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
      <div className="flex gap-2">
        <input
          type="email"
          required
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-full border border-zinc-300 px-3 py-1.5 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <input
          type="password"
          required
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-full border border-zinc-300 px-3 py-1.5 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {mode === "signin" ? "로그인" : "가입"}
        </button>
      </div>
      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        {message && <span>{message}</span>}
        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setMessage(null);
          }}
          className="underline"
        >
          {mode === "signin" ? "계정이 없으신가요? 가입하기" : "이미 계정이 있으신가요? 로그인"}
        </button>
      </div>
    </form>
  );
}
