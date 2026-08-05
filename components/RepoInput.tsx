"use client";

import { useState } from "react";

interface Props {
  repos: string[];
  setRepos: (repos: string[]) => void;
}

export default function RepoInput({ repos, setRepos }: Props) {
  const [input, setInput] = useState("");

  const addRepo = () => {
    const value = input.trim();
    if (!value) return;

    const isValid = (() => {
      try {
        const parsed = new URL(value);
        return parsed.hostname === "github.com";
      } catch {
        return false;
      }
    })();

    if (!isValid) {
      alert("Please enter a valid GitHub repository URL");
      return;
    }

    if (repos.includes(value)) {
      alert("This repository is already added");
      return;
    }

    setRepos([...repos, value]);
    setInput("");
  };

  const removeRepo = (index: number) => {
    const updated = [...repos];
    updated.splice(index, 1);
    setRepos(updated);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.9)] backdrop-blur-xl sm:flex-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://github.com/user/repo"
          className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-500/30"
        />

        <button
          onClick={addRepo}
          className="inline-flex items-center justify-center rounded-xl bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
        >
          Add repository
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {repos.map((repo, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.9)] sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="text-sm text-slate-100 truncate">{repo}</span>
            <button
              onClick={() => removeRepo(index)}
              className="rounded-xl border border-slate-700 px-3 py-2 text-xs text-slate-100 transition hover:border-slate-400 hover:text-white"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
