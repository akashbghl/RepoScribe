"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-800 bg-gray-950">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-white">
          RepoScribe
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6 text-sm">
          <Link
            href="/"
            className="text-gray-300 hover:text-white transition"
          >
            Dashboard
          </Link>

          <Link
            href="/history"
            className="text-gray-300 hover:text-white transition"
          >
            History
          </Link>

          <a
            href="https://github.com"
            target="_blank"
            className="text-gray-300 hover:text-white transition"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
