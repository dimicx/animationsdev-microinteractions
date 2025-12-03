"use client";

import { Scene } from "@/components/scene";
import { useTheme } from "next-themes";

export default function Home() {
  return (
    <>
      <header className="sticky top-4 z-50 flex w-full items-center justify-end gap-4 p-4 pt-0 sm:top-6 sm:p-6 sm:pt-0">
        <ThemeToggle />
        <GithubLink />
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

function GithubLink() {
  return (
    <a
      href="https://github.com/dimicx/animationsdev-microinteractions"
      target="_blank"
      rel="noopener noreferrer"
      className="size-5.5 flex items-center justify-center text-neutral-500 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors"
    >
      <GithubLogo />
      <span className="sr-only">View on GitHub</span>
    </a>
  );
}

function GithubLogo() {
  return (
    <svg
      viewBox="0 0 98 96"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-auto"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
        fill="currentColor"
      />
    </svg>
  );
}
