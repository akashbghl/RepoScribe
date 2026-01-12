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
    <div className="w-full bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800">
        <h3 className="font-semibold text-white">README Preview</h3>

        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            className="text-sm px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700"
          >
            Copy
          </button>

          <button
            onClick={downloadReadme}
            className="text-sm px-3 py-1 rounded-md bg-green-600 hover:bg-green-700"
          >
            Download
          </button>
        </div>
      </div>

      {/* Markdown Body */}
      <div className="prose prose-invert max-w-none p-5 overflow-y-auto max-h-[70vh]">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
