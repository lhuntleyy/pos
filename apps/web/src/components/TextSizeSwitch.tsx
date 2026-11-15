import { useState } from "react";
import { applyTextSize, loadTextSize, type TextSize, textSizes } from "../lib/text-size";

export function TextSizeSwitch() {
  const [size, setSize] = useState<TextSize>(loadTextSize);

  return (
    <fieldset className="flex items-center gap-1 rounded-md border border-line bg-surface p-1">
      <legend className="sr-only">Ukuran teks</legend>
      {textSizes.map((t) => (
        <button
          key={t.value}
          type="button"
          aria-pressed={size === t.value}
          onClick={() => {
            setSize(t.value);
            applyTextSize(t.value);
          }}
          className={`h-10 min-w-12 rounded-sm px-2 font-bold ${
            size === t.value ? "bg-brand text-on-brand" : "text-ink hover:bg-brand-soft"
          }`}
        >
          {t.label}
        </button>
      ))}
    </fieldset>
  );
}
