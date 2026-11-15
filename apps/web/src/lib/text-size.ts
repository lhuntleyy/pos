/** Tiga ukuran teks (A / A+ / A++) dari design tokens. Pilihan disimpan per browser. */
export const textSizes = [
  { value: "normal", label: "A" },
  { value: "large", label: "A+" },
  { value: "xlarge", label: "A++" },
] as const;

export type TextSize = (typeof textSizes)[number]["value"];

const KEY = "pos.textSize";

export function loadTextSize(): TextSize {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "large" || saved === "xlarge") return saved;
  } catch {
    // localStorage bisa diblokir; pakai ukuran normal
  }
  return "normal";
}

export function applyTextSize(size: TextSize, root: HTMLElement = document.documentElement) {
  if (size === "normal") root.removeAttribute("data-text-size");
  else root.setAttribute("data-text-size", size);
  try {
    localStorage.setItem(KEY, size);
  } catch {
    // abaikan
  }
}
