import { describe, expect, it } from "vitest";
import { applyBranding, contrastRatio, isBrandColorAccessible } from "./branding";
import { formatRupiah } from "./format";
import { applyTextSize, loadTextSize } from "./text-size";

describe("formatRupiah", () => {
  it.each([
    [0, "Rp0"],
    [500, "Rp500"],
    [18000, "Rp18.000"],
    [2402000, "Rp2.402.000"],
    [-5500, "-Rp5.500"],
  ])("%d → %s", (input, want) => {
    expect(formatRupiah(input)).toBe(want);
  });

  it("menolak pecahan", () => {
    expect(() => formatRupiah(1000.5)).toThrow();
  });
});

describe("branding", () => {
  it("warna Nila bawaan lolos kontras AA dengan teks putih", () => {
    expect(contrastRatio("#3B35B5", "#FFFFFF")).toBeGreaterThan(8.5);
    expect(isBrandColorAccessible("#3B35B5")).toBe(true);
  });

  it("menolak warna brand terlalu terang untuk teks putih", () => {
    expect(isBrandColorAccessible("#E39D00")).toBe(false);
    expect(isBrandColorAccessible("#FFEB3B")).toBe(false);
    expect(isBrandColorAccessible("merah")).toBe(false);
  });

  it("memasang CSS variable brand", () => {
    applyBranding({ productName: "Kasir Mantap", brandColor: "#1565C0" });
    expect(document.documentElement.style.getPropertyValue("--color-brand")).toBe("#1565C0");
  });
});

describe("text size", () => {
  it("menyimpan pilihan dan memasang data-text-size", () => {
    applyTextSize("xlarge");
    expect(document.documentElement.getAttribute("data-text-size")).toBe("xlarge");
    expect(loadTextSize()).toBe("xlarge");

    applyTextSize("normal");
    expect(document.documentElement.hasAttribute("data-text-size")).toBe(false);
    expect(loadTextSize()).toBe("normal");
  });
});
