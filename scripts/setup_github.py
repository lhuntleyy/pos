"""Buat label, milestone (sprint), dan issue di GitHub dari backlog/backlog.csv.

Butuh GitHub CLI (`gh`) yang sudah login: `gh auth login`.

Contoh:
    python scripts/setup_github.py --repo nama-org/pos-kita --dry-run   # lihat dulu apa yang akan dibuat
    python scripts/setup_github.py --repo nama-org/pos-kita             # jalankan sungguhan

Skrip ini aman dijalankan ulang: label/milestone yang sudah ada dilewati,
dan issue yang judulnya sudah ada (diawali ID story, misalnya "ST-03") tidak dibuat dua kali.
"""

import argparse
import csv
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = ROOT / "backlog" / "backlog.csv"

# Tanggal selesai sprint, sama dengan roadmap di dokumen PRD.
SPRINTS = {
    "S0": ("2026-12-04", "Fondasi: repo, CI, staging, OpenAPI, kerangka aplikasi"),
    "S1": ("2026-12-18", "Akun & katalog"),
    "S2": ("2027-01-15", "Katalog lengkap, database lokal, layar jualan"),
    "S3": ("2027-01-29", "Sinkron, pembayaran, struk, buka kasir"),
    "S4": ("2027-02-12", "Stok, stok opname, kasbon, tutup kasir"),
    "S5": ("2027-02-26", "Laporan, pajak, hak akses, WhatsApp"),
    "S6": ("2027-03-19", "Langganan, super admin, jasa & retail dasar, onboarding"),
    "S7": ("2027-04-02", "Uji regresi & beta tertutup"),
    "S8": ("2027-04-16", "Perbaikan beta & rilis"),
}

JALUR = {
    "Kasir": "jalur:kasir",
    "Backend": "jalur:backend",
    "Web": "jalur:web",
    "Platform": "jalur:platform",
    "Produk/QA": "jalur:produk-qa",
}

LABEL_COLORS = {
    "epic": "6F42C1",
    "jalur": "1D76DB",
    "prioritas:P0": "B60205",
    "prioritas:P1": "D93F0B",
    "prioritas:P2": "C5DEF5",
    "fase": "0E8A16",
}

PRD_URL = "https://claude.ai/artifact/C3fa2i3ZmJVfstRHUzsybf"
MOCKUP_URL = "https://claude.ai/artifact/WgWf38bWpEs41JdifDu4on"


def gh(args, dry_run, capture=False):
    """Jalankan perintah gh. Saat dry-run, hanya cetak perintahnya."""
    if dry_run and not capture:
        print("  [dry-run] gh " + " ".join(args))
        return ""
    result = subprocess.run(["gh", *args], capture_output=True, text=True, encoding="utf-8")
    if result.returncode != 0:
        raise RuntimeError(f"gh {' '.join(args)} gagal:\n{result.stderr.strip()}")
    return result.stdout


def epic_label(epic):
    return "epic:" + epic.split(" ", 1)[0]


def load_rows():
    with CSV_PATH.open(encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def ensure_labels(repo, rows, dry_run):
    wanted = {}
    for r in rows:
        wanted[epic_label(r["epic"])] = (LABEL_COLORS["epic"], r["epic"])
        for j in r["jalur"].split(","):
            name = JALUR[j.strip()]
            wanted[name] = (LABEL_COLORS["jalur"], "Jalur kerja " + j.strip())
    for p in ("P0", "P1", "P2"):
        wanted["prioritas:" + p] = (LABEL_COLORS["prioritas:" + p], "Prioritas " + p)
    wanted["fase:1"] = (LABEL_COLORS["fase"], "Fase 1 (MVP)")

    existing = set()
    if not dry_run:
        out = gh(["label", "list", "--repo", repo, "--limit", "500", "--json", "name"], dry_run, capture=True)
        existing = {l["name"] for l in json.loads(out or "[]")}

    for name, (color, desc) in sorted(wanted.items()):
        if name in existing:
            continue
        gh(["label", "create", name, "--repo", repo, "--color", color, "--description", desc], dry_run)


def ensure_milestones(repo, dry_run):
    existing = set()
    if not dry_run:
        out = gh(["api", f"repos/{repo}/milestones?state=all&per_page=100"], dry_run, capture=True)
        existing = {m["title"] for m in json.loads(out or "[]")}
    for sprint, (due, desc) in SPRINTS.items():
        if sprint in existing:
            continue
        gh(["api", f"repos/{repo}/milestones", "-f", f"title={sprint}",
            "-f", f"due_on={due}T23:59:59Z", "-f", f"description={desc}"], dry_run)


def existing_issue_ids(repo, dry_run):
    if dry_run:
        return set()
    out = gh(["issue", "list", "--repo", repo, "--state", "all", "--limit", "1000", "--json", "title"],
             dry_run, capture=True)
    return {t["title"].split(" ", 1)[0] for t in json.loads(out or "[]")}


def create_issues(repo, rows, dry_run):
    done = existing_issue_ids(repo, dry_run)
    for r in rows:
        if r["id"] in done:
            print(f"  lewati {r['id']} (sudah ada)")
            continue
        labels = [epic_label(r["epic"]), "prioritas:" + r["prioritas"], "fase:1"]
        labels += [JALUR[j.strip()] for j in r["jalur"].split(",")]
        body = (
            f"**Story:** {r['title']}\n\n"
            f"- Epic: {r['epic']}\n"
            f"- Jalur kerja: {r['jalur']}\n"
            f"- Sprint: {r['sprint']}\n"
            f"- Prioritas: {r['prioritas']}\n"
            f"- Estimasi: {r['poin']} poin\n\n"
            f"Aturan bisnis dan kriteria terima: PRD bagian 4, {r['epic'].split(' ', 1)[0]} ({PRD_URL}).\n"
            f"Mockup: {MOCKUP_URL}\n\n"
            "**Definition of Done**\n"
            "- [ ] Kriteria terima terpenuhi\n"
            "- [ ] Tes unit untuk logika bisnis (uang, stok, pajak)\n"
            "- [ ] Fitur kasir jalan offline (kalau berlaku)\n"
            "- [ ] Ukuran sentuh, label aksesibilitas, dan teks sesuai kamus istilah\n"
            "- [ ] Sudah direview dan di staging\n"
        )
        args = ["issue", "create", "--repo", repo, "--title", f"{r['id']} {r['title']}",
                "--body", body, "--milestone", r["sprint"]]
        for l in labels:
            args += ["--label", l]
        gh(args, dry_run)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--repo", required=True, help="owner/nama-repo di GitHub")
    parser.add_argument("--dry-run", action="store_true", help="hanya tampilkan perintah, tidak membuat apa pun")
    args = parser.parse_args()

    rows = load_rows()
    print(f"{len(rows)} story dibaca dari {CSV_PATH.relative_to(ROOT)}")
    try:
        print("Label...")
        ensure_labels(args.repo, rows, args.dry_run)
        print("Milestone sprint...")
        ensure_milestones(args.repo, args.dry_run)
        print("Issue...")
        create_issues(args.repo, rows, args.dry_run)
    except RuntimeError as e:
        print(e, file=sys.stderr)
        sys.exit(1)
    print("Selesai.")


if __name__ == "__main__":
    main()
