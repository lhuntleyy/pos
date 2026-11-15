import type { ReactNode } from "react";

type Tone = "success" | "warning" | "danger" | "neutral";

const toneClass: Record<Tone, string> = {
  success: "bg-success-soft text-success",
  warning: "bg-highlight-soft text-highlight-ink",
  danger: "bg-danger-soft text-danger",
  neutral: "bg-line-soft text-ink-muted",
};

const icons: Record<Tone, ReactNode> = {
  success: <path d="M5 10.5l3 3 7-7" />,
  warning: <path d="M10 6v5m0 3.5v.01" />,
  danger: <path d="M6.5 6.5l7 7m0-7l-7 7" />,
  neutral: <path d="M6 10h8" />,
};

/** Status selalu warna + ikon + teks (aturan aksesibilitas), tidak boleh warna saja. */
export function StatusBadge({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      role="status"
      className={`inline-flex min-h-10 items-center gap-2 rounded-pill px-3 font-semibold ${toneClass[tone]}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icons[tone]}
      </svg>
      {children}
    </span>
  );
}
