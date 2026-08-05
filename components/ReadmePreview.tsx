"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

interface ReadmePreviewProps {
  content: string;
  repoName?: string;
}

export default function ReadmePreview({
  content,
  repoName = "README",
}: ReadmePreviewProps) {
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content);
    alert("README copied to clipboard ✅");
  };

  const downloadReadme = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${repoName}.md`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full rounded-lg border border-white/10 bg-white/5 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.9)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 border-b border-white/10 bg-slate-900/95 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">README Preview</h3>
          <p className="text-sm text-slate-400">Copy or download the generated markdown file.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={copyToClipboard}
            className="rounded-lg bg-slate-950/95 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-slate-900"
          >
            Copy
          </button>

          <button
            onClick={downloadReadme}
            className="rounded-lg bg-slate-950/95 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-slate-900"
          >
            Download
          </button>
        </div>
      </div>

      <div className="prose prose-invert max-w-none p-6 overflow-y-auto max-h-[72vh]">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
