"use client";

interface RepoCardProps {
  repoUrl: string;
  status: "idle" | "processing" | "success" | "error";
  message?: string;
  onPreview?: () => void;
  onRetry?: () => void;
}

export default function RepoCard({
  repoUrl,
  status,
  message,
  onPreview,
  onRetry,
}: RepoCardProps) {
  const statusColor = {
    idle: "bg-gray-700",
    processing: "bg-yellow-600",
    success: "bg-green-600",
    error: "bg-red-600",
  }[status];

  return (
    <div className="w-full max-w-xl bg-gray-900 border border-gray-800 rounded-xl p-4">
      {/* Repo URL */}
      <p className="text-sm text-gray-300 truncate">{repoUrl}</p>

      {/* Status */}
      <div className="flex items-center justify-between mt-3">
        <span
          className={`text-xs px-2 py-1 rounded-full text-white ${statusColor}`}
        >
          {status.toUpperCase()}
        </span>

        <div className="flex gap-2">
          {status === "success" && (
            <button
              onClick={onPreview}
              className="text-sm px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700"
            >
              Preview
            </button>
          )}

          {status === "error" && (
            <button
              onClick={onRetry}
              className="text-sm px-3 py-1 rounded-md bg-orange-600 hover:bg-orange-700"
            >
              Retry
            </button>
          )}
        </div>
      </div>

      {/* Message */}
      {message && (
        <p className="mt-2 text-xs text-gray-400">{message}</p>
      )}
    </div>
  );
}
