"use client";

import Link from "next/link";

export default function Navbar() {
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
          <Link href="#results" className="transition hover:text-white">
            Results
          </Link>
          <Link href="#workflow" className="transition hover:text-white">
            Features
          </Link>
          <a href="https://github.com" target="_blank" className="transition hover:text-white">
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
