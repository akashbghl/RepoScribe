"use client";

import { useState } from "react";
import RepoInput from "@/components/RepoInput";
import RepoCard from "@/components/RepoCard";
import ReadmePreview from "@/components/ReadmePreview";

type RepoStatus = "idle" | "processing" | "success" | "error";

interface RepoItem {
  url: string;
  status: RepoStatus;
  message?: string;
  readme?: string;
}

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
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-1">RepoScribe</h1>
        <p className="text-gray-400 mb-8">
          Generate professional README files automatically using AI.
        </p>

        {/* Input */}
        <RepoInput repos={repos} setRepos={setRepos} />

        {/* Action */}
        <button
          disabled={loading}
          onClick={handleGenerate}
          className="mt-6 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Generate README"}
        </button>

        {/* Repo Cards */}
        <div className="mt-10 space-y-4">
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
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50">
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
    </main>
  );
}
