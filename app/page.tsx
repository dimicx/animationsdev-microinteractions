"use client";

import { Scene } from "@/components/scene";
import { useTheme } from "next-themes";

export default function Home() {
  return (
    <>
      <header className="sticky top-2 z-50 flex w-full items-center justify-end gap-6 p-4 pt-0 sm:top-6 sm:p-6 sm:pt-0">
        <ThemeToggle />
      </header>
      <main className="mx-auto mt-6! mb-8 w-full max-w-[732px] px-4 text-gray-1200 sm:mt-32 md:mb-12 md:mt-20">
        <Scene />
      </main>
    </>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300 no-underline transition-colors cursor-pointer"
    >
      Toggle theme
    </button>
  );
}
