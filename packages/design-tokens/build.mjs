// Membuat file token untuk web (CSS + Tailwind v4) dan app kasir (Dart) dari tokens.json.
//   node build.mjs          tulis ulang semua file
//   node build.mjs --check  gagal kalau file hasil tidak sama dengan tokens.json (dipakai CI)
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const tokens = JSON.parse(readFileSync(join(here, "tokens.json"), "utf8"));
const check = process.argv.includes("--check");

const HEADER =
  "Dibuat otomatis dari packages/design-tokens/tokens.json. Jangan diedit manual; jalankan `pnpm gen:tokens`.";
for (const s of ["normal", "large", "xlarge"]) {
  if (!tokens.textSize[s]) throw new Error(`textSize.${s} tidak ada di tokens.json`);
}
const colors = Object.entries(tokens.color).map(([name, t]) => ({ name, ...t }));
const money = Object.entries(tokens.money).sort((a, b) => Number(b[0]) - Number(a[0]));
const fontStack = `"${tokens.font.family}", ${tokens.font.fallback}`;
const kebab = (s) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

/** Variabel ukuran teks yang berubah sesuai pilihan A / A+ / A++. */
function textSizeVars(size, indent) {
  return Object.entries(tokens.textSize[size])
    .filter(([k]) => k !== "productColumns")
    .map(([k, v]) => `${indent}--text-${kebab(k)}: ${v}px;`)
    .concat(`${indent}--product-columns: ${tokens.textSize[size].productColumns};`)
    .join("\n");
}

function sizeOverrides() {
  return ["large", "xlarge"].map((s) => `[data-text-size="${s}"] {\n${textSizeVars(s, "  ")}\n}`).join("\n\n");
}

// 1) CSS biasa: dipakai situs Astro dan siapa pun yang tidak memakai Tailwind.
function tokensCss() {
  const lines = [
    `/* ${HEADER} */`,
    ":root {",
    ...colors.map((c) => `  --color-${c.name}: ${c.value}; /* ${c.label}: ${c.use} */`),
    ...money.map(([n, v]) => `  --color-money-${n}: ${v};`),
    ...Object.entries(tokens.touch).map(([k, v]) => `  --touch-${k}: ${v}px;`),
    ...Object.entries(tokens.radius).map(([k, v]) => `  --radius-${k}: ${v}px;`),
    ...Object.entries(tokens.space).map(([k, v]) => `  --space-${k}: ${v}px;`),
    `  --font-sans: ${fontStack};`,
    textSizeVars("normal", "  "),
    "}",
    "",
    sizeOverrides(),
    "",
  ];
  return lines.join("\n");
}

// 2) Tailwind v4: @theme membuat utilitas seperti bg-brand, text-ink, h-touch-primary, text-body.
//    Warna brand dibaca lewat var(), jadi bisa diganti saat runtime dari pengaturan super admin.
function tailwindCss() {
  const lines = [
    `/* ${HEADER} */`,
    "@theme {",
    ...colors.map((c) => `  --color-${c.name}: ${c.value};`),
    ...money.map(([n, v]) => `  --color-money-${n}: ${v};`),
    ...Object.entries(tokens.touch).map(([k, v]) => `  --spacing-touch-${k}: ${v}px;`),
    ...Object.entries(tokens.radius).map(([k, v]) => `  --radius-${k}: ${v}px;`),
    `  --font-sans: ${fontStack};`,
    textSizeVars("normal", "  "),
    "}",
    "",
    "/* Ukuran teks A+ dan A++: pasang data-text-size di <html>. */",
    sizeOverrides(),
    "",
  ];
  return lines.join("\n");
}

// 3) Dart untuk app kasir Flutter.
function dart() {
  const hex = (v) => `Color(0xFF${v.slice(1).toUpperCase()})`;
  const ts = (s) => {
    const t = tokens.textSize[s];
    return `TextSizes(body: ${t.body}, productName: ${t.productName}, cardPrice: ${t.cardPrice}, total: ${t.total}, productColumns: ${t.productColumns})`;
  };
  return `// ${HEADER}

import 'package:flutter/painting.dart';

abstract final class AppColors {
${colors.map((c) => `  /// ${c.label}: ${c.use}\n  static const ${camel(c.name)} = ${hex(c.value)};`).join("\n")}
}

/// Warna tombol uang cepat, mengikuti warna uang kertas Rupiah.
abstract final class MoneyColors {
  static const Map<int, Color> byNominal = {
${money.map(([n, v]) => `    ${n}: ${hex(v)},`).join("\n")}
  };
}

abstract final class TouchSize {
${Object.entries(tokens.touch)
  .map(([k, v]) => `  static const double ${k} = ${v};`)
  .join("\n")}
}

abstract final class AppRadius {
${Object.entries(tokens.radius)
  .map(([k, v]) => `  static const double ${k} = ${v};`)
  .join("\n")}
}

abstract final class AppSpace {
${Object.entries(tokens.space)
  .map(([k, v]) => `  static const double s${k} = ${v};`)
  .join("\n")}
}

const String appFontFamily = '${tokens.font.family}';

/// Ukuran teks untuk satu pilihan (A / A+ / A++).
class TextSizes {
  const TextSizes({
    required this.body,
    required this.productName,
    required this.cardPrice,
    required this.total,
    required this.productColumns,
  });

  final double body;
  final double productName;
  final double cardPrice;
  final double total;
  final int productColumns;
}

enum TextSizeLevel {
  normal('A', ${ts("normal")}),
  large('A+', ${ts("large")}),
  xlarge('A++', ${ts("xlarge")});

  const TextSizeLevel(this.label, this.sizes);

  final String label;
  final TextSizes sizes;
}
`;
}

const outputs = [
  [join(here, "generated", "tokens.css"), tokensCss()],
  [join(here, "generated", "tailwind.css"), tailwindCss()],
  [join(root, "apps", "kasir", "lib", "core", "theme", "tokens.g.dart"), dart()],
];

let stale = 0;
for (const [file, content] of outputs) {
  const rel = relative(root, file).replaceAll("\\", "/");
  if (check) {
    const current = existsSync(file) ? readFileSync(file, "utf8") : "";
    if (current !== content) {
      console.error(`Belum sesuai tokens.json: ${rel}`);
      stale++;
    }
    continue;
  }
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
  console.log(`ditulis ${rel}`);
}

if (stale > 0) {
  console.error("Jalankan `pnpm gen:tokens` lalu commit hasilnya.");
  process.exit(1);
}
if (check) console.log("Token sesuai.");
