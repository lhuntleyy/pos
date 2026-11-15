/**
 * Nama produk, logo, dan warna diatur dari panel super admin (story B-06).
 * Warna brand dipasang sebagai CSS variable sehingga semua utilitas Tailwind (bg-brand, text-brand) ikut berubah.
 */
export interface Branding {
  productName: string;
  brandColor: string;
  brandStrongColor?: string;
}

export const defaultBranding: Branding = {
  productName: "POS Kita",
  brandColor: "#3B35B5",
  brandStrongColor: "#2A2590",
};

export function applyBranding(b: Branding, root: HTMLElement = document.documentElement) {
  if (!isHexColor(b.brandColor)) throw new Error(`Warna brand tidak valid: ${b.brandColor}`);
  root.style.setProperty("--color-brand", b.brandColor);
  if (b.brandStrongColor && isHexColor(b.brandStrongColor)) {
    root.style.setProperty("--color-brand-strong", b.brandStrongColor);
  }
}

export function isHexColor(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

/** Rasio kontras WCAG 2.x antara dua warna hex. */
export function contrastRatio(a: string, b: string): number {
  const [la, lb] = [luminance(a), luminance(b)];
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Warna brand dipakai sebagai latar tombol dengan teks putih,
 * jadi harus kontras minimal 4,5:1 terhadap putih (WCAG AA). Dipakai editor branding super admin.
 */
export function isBrandColorAccessible(hex: string): boolean {
  return isHexColor(hex) && contrastRatio(hex, "#FFFFFF") >= 4.5;
}

function luminance(hex: string): number {
  if (!isHexColor(hex)) throw new Error(`Warna tidak valid: ${hex}`);
  const channel = (i: number) => {
    const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}
