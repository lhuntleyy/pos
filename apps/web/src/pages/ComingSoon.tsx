const mockupUrl: string = import.meta.env.VITE_MOCKUP_URL ?? "https://claude.ai/artifact/WgWf38bWpEs41JdifDu4on";

/** Halaman sementara untuk menu yang belum dikerjakan. Sebut story dan sprint-nya. */
export function ComingSoon({ title, story, sprint }: { title: string; story: string; sprint: string }) {
  return (
    <div className="flex max-w-xl flex-col gap-4">
      <h1 className="text-3xl font-extrabold">{title}</h1>
      <p className="text-ink-muted">
        Halaman ini dikerjakan di story <strong className="text-ink">{story}</strong> ({sprint}).
      </p>
      <a
        href={mockupUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-touch-min w-fit items-center rounded-md border-2 border-brand px-4 font-bold text-brand-strong hover:bg-brand-soft"
      >
        Lihat mockup
      </a>
    </div>
  );
}
