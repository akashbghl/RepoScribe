"use client";

import { useState } from "react";
import RepoInput from "@/components/RepoInput";
import RepoCard from "@/components/RepoCard";
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

const navigation = {
  categories: [
    {
      id: "women",
      name: "Women",

      sections: [
        {
          id: "about",
          name: "About",
          items: [
            { name: "About", href: "/about" },
            { name: "Works", href: "/agency/works" },
            { name: "Pricing", href: "/pricing" },
          ],
        },
        {
          id: "features",
          name: "Features",
          items: [
            { name: "Products", href: "/products" },
            { name: "Agency", href: "/agency" },
            { name: "Dashboard", href: "/dashboard" },
          ],
        },
        {
          id: "products",
          name: "Products",
          items: [
            { name: "DIcons", href: "/products/dicons" },
            { name: "DShapes", href: "/products/dshapes" },
            { name: "Graaadients", href: "/products/graaadients" },
          ],
        },
        {
          id: "designs",
          name: "Designs",
          items: [
            { name: "Design", href: "/designs" },
            { name: "Components", href: "/components" },
            { name: "Blogs", href: "/blogs" },
          ],
        },
        {
          id: "other",
          name: "Others",
          items: [
            { name: "Graphic", href: "/graphic" },
            { name: "3D Icons", href: "/products/3dicons" },
            { name: "Colors", href: "/products/colors/generate" },
          ],
        },
        {
          id: "company",
          name: "Company",
          items: [
            { name: "Contact", href: "/contact" },
            { name: "Terms", href: "/terms" },
            { name: "Privacy", href: "/privacy" },
          ],
        },
      ],
    },
  ],
};

const Underline = `hover:-translate-y-1 border rounded-xl p-2.5 transition-transform `;

export default function HomePage() {
  const [repos, setRepos] = useState<string[]>([]);
  const [items, setItems] = useState<RepoItem[]>([]);
  const [preview, setPreview] = useState<RepoItem | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!repos.length) {
      alert("Please add at least one repository URL");
      return;
    }

    setLoading(true);

    // Initialize cards
    const initialItems: RepoItem[] = repos.map((url) => ({
      url,
      status: "processing",
      message: "Analyzing repository...",
    }));
    setItems(initialItems);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repos }),
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
    } catch (error: any) {
      console.error(error);
      alert("Something went wrong while generating README");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (item: RepoItem) => {
    setPreview(item);
  };

  const handleRetry = (url: string) => {
    setRepos([url]);
    handleGenerate();
  };

  return (
    <main className="min-h-screen px-6 py-10 bg-black text-white">
      <div className="max-w-xl mx-auto min-h-[70vh]">
        {/* Header */}
        <div className="relative mb-14 text-center">
          <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          <h1 className="relative text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
            RepoScribe
          </h1>

          <p className="relative mt-3 text-gray-400 max-w-xl mx-auto">
            Instantly generate clean, professional README files using AI-powered
            repository analysis.
          </p>

          <div className="relative mt-6 flex justify-center gap-4 text-sm text-gray-400">
            <span>⚡ Fast</span>
            <span>🤖 AI Powered</span>
            <span>📄 Auto Documentation</span>
          </div>
        </div>


        {/* Input */}
        <RepoInput repos={repos} setRepos={setRepos} />

        {!repos.length && !loading && (
          <div className="mt-14 text-center text-gray-500">
            <p className="text-lg">No repositories yet</p>
            <p className="text-sm">Paste a GitHub repo link to begin 🚀</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { label: "Repositories", value: repos.length },
            { label: "Processed", value: items.length },
            { label: "Success", value: items.filter(i => i.status === "success").length }
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-white/5 backdrop-blur border border-white/10 p-4 text-center"
            >
              <p className="text-xl font-semibold">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>


        {/* Action */}
        <button
          disabled={loading}
          onClick={handleGenerate}
          className="group relative mt-8 w-full overflow-hidden rounded-xl bg-indigo-600 px-3 py-2 mb-4 font-medium transition-all hover:bg-indigo-700 disabled:opacity-40"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition" />
          <span className="relative flex items-center justify-center gap-2">
            {loading ? "Analyzing..." : "Generate README"}
            {!loading && <span className="animate-pulse">⚡</span>}
          </span>
        </button>



        {/* Repo Cards */}
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg hover:shadow-indigo-500/20 transition-all">
          {items.map((item) => (
            <RepoCard
              key={item.url}
              repoUrl={item.url}
              status={item.status}
              message={item.message}
              onPreview={() => handlePreview(item)}
              onRetry={() => handleRetry(item.url)}
            />
          ))}
        </div>

        {/* Preview Modal */}
        {preview && preview.readme && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50 animate-fadeIn">
            <div className="bg-gray-950 rounded-xl max-w-4xl w-full overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3 border-b border-gray-800">
                <h3 className="font-semibold">README Preview</h3>
                <button
                  onClick={() => setPreview(null)}
                  className="text-sm text-red-400 hover:text-red-500"
                >
                  Close
                </button>
              </div>

              <div className="p-4">
                <ReadmePreview
                  content={preview.readme}
                  repoName="README"
                />
              </div>
            </div>
          </div>
        )}

      </div>
      <footer className="mt-32 border-t border-white/10 bg-gradient-to-b from-black to-gray-950">
        <div className="relative mx-auto grid  max-w-7xl items-center justify-center gap-6 p-10 pb-0 md:flex ">
          <Link href="/">
            <p className="flex items-center justify-center rounded-full  ">
              <DIcons.Designali className="w-8 text-red-600" />
            </p>
          </Link>
          <p className="bg-transparent text-center text-xs leading-4 text-gray-400 md:text-left">
            RepoScribe is an AI-powered tool that automatically generates high-quality README files for GitHub repositories. It analyzes project structure, identifies key components, and creates clear, developer-friendly documentation in seconds. Designed to save time and improve code readability, RepoScribe helps developers maintain consistent and professional documentation across multiple projects.
          </p>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="border-b border-dotted"> </div>
          <div className="py-10">
            {navigation.categories.map((category) => (
              <div
                key={category.name}
                className="grid grid-cols-3 flex-row justify-between gap-6 leading-6 md:flex"
              >
                {category.sections.map((section) => (
                  <div key={section.name}>
                    <ul
                      role="list"
                      aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                      className="flex flex-col space-y-2"
                    >
                      {section.items.map((item) => (
                        <li key={item.name} className="flow-root">
                          <Link
                            href={item.href}
                            className="text-sm text-slate-600 hover:text-black dark:text-slate-400 hover:dark:text-white md:text-xs"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="border-b border-dotted"> </div>
        </div>

        <div className="flex flex-wrap justify-center gap-y-6">
          <div className="flex flex-wrap items-center justify-center gap-6 gap-y-4 px-6">
            <Link
              aria-label="Logo"
              href="mailto:contact@designali.in"
              rel="noreferrer"
              target="_blank"
              className={Underline}
            >
              <DIcons.Mail strokeWidth={1.5} className="h-5 w-5" />
            </Link>
            <Link
              aria-label="Logo"
              href="https://x.com/designali_in"
              rel="noreferrer"
              target="_blank"
              className={Underline}
            >
              <DIcons.X className="h-5 w-5" />
            </Link>
            <Link
              aria-label="Logo"
              href="https://www.instagram.com/designali.in/"
              rel="noreferrer"
              target="_blank"
              className={Underline}
            >
              <DIcons.Instagram className="h-5 w-5" />
            </Link>
            <Link
              aria-label="Logo"
              href="https://www.threads.net/designali.in"
              rel="noreferrer"
              target="_blank"
              className={Underline}
            >
              <DIcons.Threads className="h-5 w-5" />
            </Link>
            <Link
              aria-label="Logo"
              href="https://chat.whatsapp.com/LWsNPcz5BlWDVOha41vzuh"
              rel="noreferrer"
              target="_blank"
              className={Underline}
            >
              <DIcons.WhatsApp className="h-5 w-5" />
            </Link>
            <Link
              aria-label="Logo"
              href="https://www.behance.net/designali-in"
              rel="noreferrer"
              target="_blank"
              className={Underline}
            >
              <DIcons.Behance className="h-5 w-5" />
            </Link>
            <Link
              aria-label="Logo"
              href="https://www.facebook.com/designali.agency"
              rel="noreferrer"
              target="_blank"
              className={Underline}
            >
              <DIcons.Facebook className="h-5 w-5" />
            </Link>
            <Link
              aria-label="Logo"
              href="https://www.linkedin.com/company/designali"
              rel="noreferrer"
              target="_blank"
              className={Underline}
            >
              <DIcons.LinkedIn className="h-5 w-5" />
            </Link>
            <Link
              aria-label="Logo"
              href="https://www.youtube.com/@designali-in"
              rel="noreferrer"
              target="_blank"
              className={Underline}
            >
              <DIcons.YouTube className="h-5 w-5" />
            </Link>
          </div>
          <ThemeToogle />
        </div>

        <div className="mx-auto mb-10 mt-10 flex flex-col justify-between text-center text-xs md:max-w-7xl">
          <div className="flex flex-row items-center justify-center gap-1 text-slate-600 dark:text-slate-400">
            <span> © </span>
            <span>{new Date().getFullYear()}</span>
            <span>Made with</span>
            <DIcons.Heart className="text-red-600 mx-1 h-4 w-4 animate-pulse" />
            <span> by </span>
            <span className="hover:text-ali dark:hover:text-ali cursor-pointer text-gray-400 dark:text-white">
              <Link
                aria-label="Logo"
                className="font-bold"
                href="https://www.instagram.com/aliimam.in/"
                target="_blank"
              >
                Akash Baghel {""}
              </Link>
            </span>
            -
            <span className="hover:text-ali dark:hover:text-red-600 cursor-pointer text-slate-600 dark:text-slate-400">
              <Link aria-label="Logo" className="" href="/">
                RepoScribe
              </Link>
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
