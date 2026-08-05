"use client";

import { useState } from "react";
import RepoInput from "@/components/RepoInput";
import ReadmePreview from "@/components/ReadmePreview";
import Link from "next/link";
import { DIcons } from "dicons";

import ThemeToogle from "@/components/ui/footer";

type RepoStatus = "idle" | "processing" | "success" | "error";

interface RepoItem {
  url: string;
  status: RepoStatus;
  message?: string;
  readme?: string;
}

const highlights = [
  {
    title: "Smart repository understanding",
    description:
      "Scan directories, package files, and docs to identify the most important project information.",
  },
  {
    title: "Professional README output",
    description:
      "Generate a clean, shareable README with usage, setup, and feature guidance automatically.",
  },
  {
    title: "Minimal setup required",
    description:
      "Keep the backend logic unchanged while enjoying a modern interface and faster workflow.",
  },
];

export default function HomePage() {
  const [repos, setRepos] = useState<string[]>([]);
  const [items, setItems] = useState<RepoItem[]>([]);
  const [preview, setPreview] = useState<RepoItem | null>(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const generate = async (reposToGenerate: string[] = repos) => {
    if (!reposToGenerate.length) {
      alert("Please add at least one repository URL");
      return;
    }

    setLoading(true);

    // Initialize cards
    const initialItems: RepoItem[] = reposToGenerate.map((url) => ({
      url,
      status: "processing",
      message: "Analyzing repository...",
    }));
    setItems(initialItems);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repos: reposToGenerate }),
      });

      const data = await res.json();
      console.log("Analysis API Response:", data);

      if (!data.success) {
        throw new Error(data.message || "Analysis failed");
      }

      const updated: RepoItem[] = data.results.map((r: any) => ({
        url: r.repo,
        status: r.success ? "success" : "error",
        message: r.success
          ? "README generated successfully"
          : r.error,
        readme: r.readme,
      }));

      setItems(updated);
      setShowResultsModal(true);
    } catch (error: any) {
      console.error(error);
      alert("Something went wrong while generating README");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    await generate();
  };

  const handlePreview = (item: RepoItem) => {
    setPreview(item);
  };

  const handleRetry = (url: string) => {
    setRepos([url]);
    generate([url]);
  };

  const closeResultsModal = () => {
    setShowResultsModal(false);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="relative overflow-hidden pb-16">
        <div className="absolute inset-x-0 top-0 h-112 bg-linear-to-b from-slate-900 via-slate-950 to-transparent opacity-95" />
        <div className="absolute right-0 top-24 hidden h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl lg:block" />
        <div className="absolute left-0 top-44 hidden h-64 w-64 rounded-full bg-violet-500/10 blur-3xl lg:block" />

        <div className="relative mx-auto max-w-7xl px-6 pt-12 sm:px-8 lg:px-10 lg:pt-20">
          <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] items-start">
            <section className="space-y-8">
              <div className="space-y-5">
                <div className="inline-flex rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-400 shadow-sm shadow-slate-950/10">
                  Professional README generation
                </div>
                <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                  Convert GitHub repositories into elegant README files fast.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-300">
                  Add repository links, generate documentation, and review outputs in a focused popup. The backend remains intact while the interface is clean, minimal, and polished.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  onClick={handleGenerate}
                  disabled={loading || repos.length === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-7 py-3 text-base font-semibold text-slate-950 transition duration-300 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Analyzing..." : "Generate README"}
                  {!loading && <span className="text-slate-500">›</span>}
                </button>
                <button
                  type="button"
                  onClick={() => setShowResultsModal(true)}
                  disabled={!items.length}
                  className="rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold text-card-foreground transition hover:bg-popover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Open results popup
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Repositories", value: repos.length },
                  { label: "Processed", value: items.length },
                  { label: "Success", value: items.filter((i) => i.status === "success").length },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-border bg-card p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.9)]"
                  >
                    <p className="text-3xl font-semibold text-card-foreground">{stat.value}</p>
                    <p className="mt-2 text-sm uppercase tracking-[0.3em] text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>

            <aside className="rounded-lg border border-border bg-card p-8 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.9)]">
              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Quick start</p>
                  <h2 className="text-2xl font-semibold text-white">Paste your GitHub repo link below</h2>
                </div>
                <RepoInput repos={repos} setRepos={setRepos} />
                <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-4">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Example repositories</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-slate-300">
                      github.com/vercel/next.js
                    </span>
                    <span className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-slate-300">
                      github.com/facebook/react
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-border bg-card p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.9)] transition duration-300 hover:-translate-y-1"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Feature</p>
              <h3 className="mt-4 text-xl font-semibold text-card-foreground">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="results" className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 lg:px-10">
        <div className="rounded-lg border border-border bg-card p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.9)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Results</p>
              <h2 className="mt-2 text-3xl font-semibold text-card-foreground">Analysis summary</h2>
            </div>
            <p className="max-w-xl text-sm text-slate-300">
              Generate documentation once, then open the popup to inspect and preview results.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Repositories", value: repos.length },
              { label: "Processed", value: items.length },
              { label: "Success", value: items.filter((i) => i.status === "success").length },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border bg-popover px-5 py-4">
                <p className="text-3xl font-semibold text-card-foreground">{stat.value}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setShowResultsModal(true)}
              disabled={!items.length}
              className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-card-foreground transition hover:bg-popover disabled:cursor-not-allowed disabled:opacity-50"
            >
              Open results popup
            </button>
            <p className="text-sm text-slate-400">Results appear in a clean modal for focused review.</p>
          </div>
        </div>
      </section>

      {showResultsModal && items.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(2,6,23,0.85)] p-6 backdrop-blur-sm">
          <div className="w-full max-w-4xl overflow-hidden rounded-lg border border-border bg-card shadow-2xl shadow-black/40">
            <div className="flex flex-col gap-4 border-b border-border bg-popover px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Results popup</p>
                <h3 className="text-xl font-semibold text-card-foreground">Generated README report</h3>
              </div>
              <button
                onClick={closeResultsModal}
                className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-card-foreground transition hover:border-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="space-y-4 p-6">
              {items.map((item) => (
                <div key={item.url} className="rounded-2xl border border-border bg-popover p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-slate-400">{item.url}</p>
                      <p className="mt-1 text-lg font-semibold text-card-foreground">
                        {item.status === "success" ? "Ready to review" : "Error generating README"}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{item.message}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.readme && (
                        <button
                          type="button"
                          onClick={() => handlePreview(item)}
                          className="cursor-pointer inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-card-foreground transition hover:bg-popover"
                        >
                          Preview
                        </button>
                      )}
                      {item.status === "error" && (
                        <button
                          type="button"
                          onClick={() => handleRetry(item.url)}
                          className="cursor-pointer inline-flex items-center justify-center rounded-lg border border-border bg-transparent px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-400 hover:text-white"
                        >
                          Retry
                      </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {preview && preview.readme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(2,6,23,0.95)] p-6 backdrop-blur-sm">
          <div className="w-full max-w-5xl overflow-hidden rounded-lg border border-border bg-card shadow-2xl shadow-black/40">
            <div className="flex flex-col gap-4 border-b border-border bg-popover px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Preview</p>
                <h3 className="text-xl font-semibold text-card-foreground">Generated README</h3>
              </div>
              <button
                onClick={() => setPreview(null)}
                className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-card-foreground transition hover:border-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="p-6">
              <ReadmePreview content={preview.readme} repoName="README" />
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-border bg-background py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 sm:px-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-linear-to-br from-violet-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/10">
                <DIcons.Designali className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xl font-semibold text-white">RepoScribe</p>
                <p className="text-sm text-slate-400">AI-generated README creation with a modern interface.</p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-400">
              Generate polished documentation quickly with the same backend logic, a cleaner user experience, and subtle motion throughout the interface.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Links</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li>
                  <Link href="#results" className="transition hover:text-white">
                    Results
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Connect</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href="mailto:contact@designali.in" className="rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-400 hover:text-white">
                  Email
                </a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-400 hover:text-white">
                  GitHub
                </a>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-4 text-center shadow-lg shadow-slate-950/20">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">`Theme`</p>
              <div className="mt-4 flex items-center justify-center">
                <ThemeToogle />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl px-6 text-center text-sm text-slate-500 sm:px-8">
          © {new Date().getFullYear()} RepoScribe. Built with AI and modern UI design.
        </div>
      </footer>
    </main>
  );
}
