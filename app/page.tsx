"use client";

import { useState } from "react";
import RepoInput from "@/components/RepoInput";

export default function Home() {
  const [repos, setRepos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!repos.length) return alert("Please add at least one repo URL");

    try {
      setLoading(true);

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repos }),
      });

      const data = await res.json();
      console.log("Analysis Result:", data);

      alert("Repo analysis completed ✅");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-700 text-white flex flex-col items-center px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">AI README Generator</h1>
      <p className="text-gray-400 mb-8">
        Generate professional README files automatically for your GitHub repositories.
      </p>

      <RepoInput repos={repos} setRepos={setRepos} />

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="mt-6 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Generate README"}
      </button>
    </main>
  );
}
