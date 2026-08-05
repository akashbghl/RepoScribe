"use client";

import { DIcons } from "dicons";
import { useTheme } from "next-themes";

function handleScrollTop() {
  window.scroll({
    top: 0,
    behavior: "smooth",
  });
}

const Footer = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 rounded-lg border border-white/10 bg-white/5 p-3 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.9)] backdrop-blur-xl">
      <button
        onClick={() => setTheme("light")}
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-950 transition hover:bg-slate-200"
        aria-label="Light theme"
      >
        <DIcons.Sun className="h-5 w-5" strokeWidth={1.5} />
      </button>

      <button
        onClick={() => setTheme("dark")}
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-slate-100 transition hover:bg-slate-700"
        aria-label="Dark theme"
      >
        <DIcons.Moon className="h-5 w-5" strokeWidth={1.5} />
      </button>

      <button
        type="button"
        onClick={handleScrollTop}
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-950 text-slate-100 transition hover:border-slate-400"
        aria-label="Scroll to top"
      >
        <DIcons.ArrowUp className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Footer;
