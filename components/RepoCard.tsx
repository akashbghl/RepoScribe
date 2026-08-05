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
    idle: "bg-slate-600/80 text-slate-100",
    processing: "bg-amber-500/90 text-slate-950",
    success: "bg-emerald-500/90 text-slate-950",
    error: "bg-rose-500/90 text-slate-950",
  }[status];

  return (
    <div className="w-full rounded-lg border border-white/10 bg-white/5 p-5 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.9)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-slate-950/40">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Repository</p>
          <p className="mt-2 truncate text-base font-semibold text-white">{repoUrl}</p>
        </div>

        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusColor}`}>
          {status.toUpperCase()}
        </span>
      </div>

      {message && (
        <p className="mt-4 text-sm leading-6 text-slate-400">{message}</p>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        {status === "success" && (
          <button
            onClick={onPreview}
            className="rounded-lg bg-slate-950/95 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-slate-900"
          >
            Preview
          </button>
        )}

        {status === "error" && (
          <button
            onClick={onRetry}
            className="rounded-lg bg-slate-950/95 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-slate-900"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
