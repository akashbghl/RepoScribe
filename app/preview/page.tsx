"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReadmePreview from "@/components/ReadmePreview";

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const repo = searchParams.get("repo");

  const [readme, setReadme] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!repo) return;

    const stored = sessionStorage.getItem(`readme:${repo}`);

    if (stored) {
      setReadme(stored);
    }

    setLoading(false);
  }, [repo]);

  if (!repo) {
    return (
      <div className="p-10 text-center text-gray-400">
        No repository selected
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-400">
        Loading README...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-xl font-semibold mb-4">
          README Preview
        </h1>

        <ReadmePreview content={readme} repoName={repo} />
      </div>
    </main>
  );
}
