import FortuneCard from "./FortuneCard";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-zinc-50 px-4 font-sans dark:bg-black">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
        오늘의 운세 🔮
      </h1>
      <FortuneCard />
    </div>
  );
}
