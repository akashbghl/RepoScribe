"use client";

import { Moon, Star, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <nav className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
        <Link href="/" className="inline-flex items-center gap-3 text-white">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900 text-base font-bold text-white shadow-sm shadow-slate-950/10">
            R
          </span>
          <span className="text-lg font-semibold">RepoScribe</span>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="relative h-9 w-9 rounded-full"
          >
            <Sun
              className="cursor-pointer absolute inset-0 m-auto h-7 w-7 px-1.5 py-1.5 rotate-0 scale-100 transition-all bg-white/90 text-black rounded-full dark:-rotate-90 dark:scale-0"
            />

            <Moon
              className="cursor-pointer absolute inset-0 m-auto h-7 w-7 px-1.5 py-1.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            />
          </button>
          <Link href="#results" className="transition hover:text-white">
            Results
          </Link>
          <Link href="#workflow" className="transition hover:text-white">
            Features
          </Link>
          <a href="https://github.com/akashbghl/RepoScribe" target="_blank" className="transition flex gap-2 items-center hover:text-white">
            GitHub
            <Star size={16}/>
          </a>
        </div>
      </div>
    </nav>
  );
}
