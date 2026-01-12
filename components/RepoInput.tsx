"use client";

import { useState } from "react";

interface Props {
  repos: string[];
  setRepos: (repos: string[]) => void;
}

export default function RepoInput({ repos, setRepos }: Props) {
  const [input, setInput] = useState("");

  const addRepo = () => {
    if (!input.trim()) return;

    setRepos([...repos, input.trim()]);
    setInput("");
  };

  const removeRepo = (index: number) => {
    const updated = [...repos];
    updated.splice(index, 1);
    setRepos(updated);
  };

  return (
    <div className="w-full max-w-xl">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://github.com/user/repo"
          className="flex-1 px-4 py-2 rounded-md text-black outline-none border border-gray-300"
        />

        <button
          onClick={addRepo}
          className="px-4 py-2 bg-green-600 rounded-md hover:bg-green-700"
        >
          Add
        </button>
      </div>

      {/* Repo List */}
      <div className="mt-4 space-y-2">
        {repos.map((repo, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-gray-800 px-3 py-2 rounded-md"
          >
            <span className="text-sm truncate">{repo}</span>

            <button
              onClick={() => removeRepo(index)}
              className="text-red-400 hover:text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
