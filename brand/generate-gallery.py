#!/usr/bin/env python3
"""
AcademIA Design Review Gallery Generator

Scans the assets/ directory and generates a styled HTML gallery
for reviewing design candidates, illustrations, and brand assets.

Usage:
    python3 generate-gallery.py                    # generates gallery.html
    python3 generate-gallery.py --serve            # generates + starts HTTP server on :8767
    python3 generate-gallery.py --port 9000        # custom port
    python3 generate-gallery.py --dir /some/path   # scan a different directory

The generated gallery uses AcademIA's design system (Fraunces, DM Sans,
cream background, red accent) and supports folder navigation.
"""

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path

IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".avif"}
ASSETS_DIR = "assets"


def scan_directory(base_path: Path, rel_prefix: str = "") -> dict:
    """Recursively scan directory, returning a tree structure."""
    tree = {"folders": [], "files": []}

    if not base_path.is_dir():
        return tree

    entries = sorted(base_path.iterdir(), key=lambda p: (not p.is_dir(), p.name.lower()))

    for entry in entries:
        if entry.name.startswith("."):
            continue

        rel_path = f"{rel_prefix}/{entry.name}" if rel_prefix else entry.name

        if entry.is_dir():
            subtree = scan_directory(entry, rel_path)
            folder_info = {
                "name": entry.name,
                "path": rel_path,
                "file_count": count_images(entry),
                "children": subtree,
            }
            tree["folders"].append(folder_info)
        elif entry.suffix.lower() in IMAGE_EXTS:
            size = entry.stat().st_size
            tree["files"].append({
                "name": entry.name,
                "path": rel_path,
                "size": size,
                "size_human": human_size(size),
                "ext": entry.suffix.lower(),
            })

    return tree


def count_images(directory: Path) -> int:
    """Count image files recursively."""
    count = 0
    for root, _, files in os.walk(directory):
        for f in files:
            if Path(f).suffix.lower() in IMAGE_EXTS:
                count += 1
    return count


def human_size(nbytes: int) -> str:
    for unit in ("B", "KB", "MB"):
        if nbytes < 1024:
            return f"{nbytes:.0f} {unit}" if unit == "B" else f"{nbytes:.1f} {unit}"
        nbytes /= 1024
    return f"{nbytes:.1f} GB"


def generate_html(tree: dict, base_url: str) -> str:
    """Generate the gallery HTML with embedded tree data."""
    tree_json = json.dumps(tree, indent=2, ensure_ascii=False)

    # The JS is in a separate string to avoid f-string vs JS curly-brace hell.
    # We inject TREE_DATA and BASE_URL_VAL via simple string replacement at the end.
    js_code = r"""
const BASE_URL = "__BASE_URL__";
const ASSETS_DIR = "assets";
const TREE = __TREE_DATA__;

let currentPath = [];
let currentImages = [];
let lightboxIndex = 0;
let previewMode = "auto";

function navigate(pathParts) {
  currentPath = pathParts;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function getNode(pathParts) {
  let node = TREE;
  for (const part of pathParts) {
    const folder = node.folders.find(f => f.name === part);
    if (!folder) return null;
    node = folder.children;
  }
  return node;
}

function esc(s) { return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

function render() {
  renderBreadcrumb();
  renderGallery();
}

function renderBreadcrumb() {
  const bc = document.getElementById("breadcrumb");
  const parts = ["assets", ...currentPath];
  bc.innerHTML = parts.map((p, i) => {
    if (i === parts.length - 1) return '<span class="current">' + esc(p) + '</span>';
    return '<a href="#" data-bc="' + i + '">' + esc(p) + '</a><span class="sep">/</span>';
  }).join("");
}

function isDarkAsset(name) {
  return name.includes("white") || name.includes("on-dark");
}

function isTransparent(name) {
  return name.endsWith(".png") || name.endsWith(".svg");
}

function renderGallery() {
  const node = getNode(currentPath);
  const el = document.getElementById("gallery");
  if (!node) { el.innerHTML = '<div class="empty-state"><p>Carpeta no encontrada.</p></div>'; return; }

  let html = "";
  currentImages = [];

  // Folders
  if (node.folders.length > 0) {
    html += '<div class="section-label">Carpetas</div>';
    html += '<div class="folders-grid">';
    node.folders.forEach(f => {
      html += '<div class="folder-card" data-folder="' + esc(f.name) + '">'
        + '<div class="folder-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6.5l-2-2H5a2 2 0 00-2 2z"/></svg></div>'
        + '<div class="folder-name">' + esc(f.name) + '</div>'
        + '<div class="folder-meta">' + f.file_count + ' imagen' + (f.file_count !== 1 ? 'es' : '') + '</div>'
        + '</div>';
    });
    html += '</div>';
  }

  // Images
  if (node.files.length > 0) {
    html += '<div class="section-label">Archivos</div>';
    html += '<div class="view-controls">'
      + btn("auto","Auto") + btn("checker","Transparencia") + btn("dark","Fondo oscuro") + btn("white","Fondo blanco")
      + '</div>';
    html += '<div class="images-grid">';
    node.files.forEach((file, idx) => {
      currentImages.push(file);
      const imgUrl = BASE_URL + "/" + ASSETS_DIR + "/" + file.path;
      let cls = "image-preview";
      if (previewMode === "auto") {
        if (isDarkAsset(file.name)) cls += " dark-bg";
        else if (isTransparent(file.name)) cls += " has-transparency";
      } else if (previewMode === "checker") cls += " has-transparency";
      else if (previewMode === "dark") cls += " dark-bg";

      html += '<div class="image-card" data-img="' + idx + '">'
        + '<div class="' + cls + '"><img src="' + esc(imgUrl) + '" alt="' + esc(file.name) + '" loading="lazy"></div>'
        + '<div class="image-info"><div><div class="image-name">' + esc(file.name) + '</div>'
        + '<span class="image-ext">' + file.ext.replace(".","") + '</span>'
        + '<span class="image-size">' + file.size_human + '</span></div></div></div>';
    });
    html += '</div>';
  }

  if (node.folders.length === 0 && node.files.length === 0) {
    html = '<div class="empty-state"><p>No hay archivos en esta carpeta.</p></div>';
  }

  el.innerHTML = html;

  // Staggered reveal
  el.querySelectorAll(".folder-card, .image-card").forEach((card, i) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(12px)";
    setTimeout(() => {
      card.style.transition = "opacity 0.3s, transform 0.3s";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 30 * i);
  });
}

function btn(mode, label) {
  return '<button class="bg-toggle' + (previewMode === mode ? " active" : "") + '" data-mode="' + mode + '">' + label + '</button>';
}

// ─── Event delegation (no inline onclick) ───

document.getElementById("breadcrumb").addEventListener("click", function(e) {
  const a = e.target.closest("[data-bc]");
  if (!a) return;
  e.preventDefault();
  const depth = parseInt(a.dataset.bc, 10);
  // depth 0 = "assets" (root), depth 1 = first folder, etc.
  navigate(currentPath.slice(0, depth));
});

document.getElementById("gallery").addEventListener("click", function(e) {
  const folder = e.target.closest("[data-folder]");
  if (folder) { navigate([...currentPath, folder.dataset.folder]); return; }

  const img = e.target.closest("[data-img]");
  if (img) { openLightbox(parseInt(img.dataset.img, 10)); return; }

  const modeBtn = e.target.closest("[data-mode]");
  if (modeBtn) { previewMode = modeBtn.dataset.mode; renderGallery(); return; }
});

// ─── Lightbox ───

function openLightbox(idx) {
  lightboxIndex = idx;
  updateLightbox();
  document.getElementById("lightbox").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("active");
  document.body.style.overflow = "";
}

function navLightbox(dir, e) {
  if (e) e.stopPropagation();
  lightboxIndex = (lightboxIndex + dir + currentImages.length) % currentImages.length;
  updateLightbox();
}

function updateLightbox() {
  const file = currentImages[lightboxIndex];
  const imgUrl = BASE_URL + "/" + ASSETS_DIR + "/" + file.path;
  const img = document.getElementById("lightbox-img");
  img.src = imgUrl;
  img.alt = file.name;
  document.getElementById("lightbox-label").textContent = file.name + " \u2014 " + file.size_human;
  document.getElementById("lightbox-counter").textContent = (lightboxIndex + 1) + " / " + currentImages.length;
}

document.getElementById("lightbox").addEventListener("click", function(e) {
  if (e.target === this) closeLightbox();
});

document.getElementById("lb-close").addEventListener("click", closeLightbox);
document.getElementById("lb-prev").addEventListener("click", function(e) { navLightbox(-1, e); });
document.getElementById("lb-next").addEventListener("click", function(e) { navLightbox(1, e); });

document.addEventListener("keydown", function(e) {
  if (!document.getElementById("lightbox").classList.contains("active")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") navLightbox(-1);
  if (e.key === "ArrowRight") navLightbox(1);
});

// Init
navigate([]);
"""
    js_code = js_code.replace("__BASE_URL__", base_url).replace("__TREE_DATA__", tree_json)

    return '''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AcademIA — Design Review Gallery</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">
<style>
  :root {
    --cream: #F5F0E4;
    --white: #FFFFFF;
    --surface: #FBF8F2;
    --text: #1F1A15;
    --muted: #7A7268;
    --light: #A09789;
    --red: #C0392B;
    --red-hover: #A93226;
    --border: #E5DFD3;
    --dark: #08080C;
    --font-display: "Fraunces", Georgia, serif;
    --font-body: "DM Sans", system-ui, sans-serif;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: var(--font-body);
    background: var(--cream);
    color: var(--text);
    min-height: 100dvh;
    -webkit-font-smoothing: antialiased;
  }

  /* ─── Header ─── */
  .gallery-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(245, 240, 228, 0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .gallery-logo {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -0.02em;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .gallery-logo .ia { color: var(--red); }

  .gallery-subtitle {
    font-size: 13px;
    color: var(--muted);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    font-weight: 500;
  }

  /* ─── Breadcrumb ─── */
  .breadcrumb {
    padding: 12px 24px;
    font-size: 13px;
    color: var(--muted);
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
  }
  .breadcrumb a {
    color: var(--muted);
    text-decoration: none;
    cursor: pointer;
    transition: color 0.15s;
  }
  .breadcrumb a:hover { color: var(--red); }
  .breadcrumb .sep { opacity: 0.4; }
  .breadcrumb .current {
    color: var(--text);
    font-weight: 500;
  }

  /* ─── Container ─── */
  .gallery-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 32px 24px 80px;
  }

  /* ─── Section labels (red eyebrow) ─── */
  .section-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--red);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .section-label::after {
    content: "";
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* ─── Folder cards ─── */
  .folders-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 12px;
    margin-bottom: 40px;
  }

  .folder-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.2s ease-out;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .folder-card:hover {
    border-color: var(--red);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(31, 26, 21, 0.08);
  }

  .folder-icon {
    width: 36px;
    height: 36px;
    background: var(--surface);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--muted);
    transition: color 0.2s;
  }
  .folder-card:hover .folder-icon { color: var(--red); }

  .folder-name { font-weight: 600; font-size: 15px; }
  .folder-meta { font-size: 12px; color: var(--light); }

  /* ─── Image grid ─── */
  .images-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
  }

  .image-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.2s ease-out;
    cursor: pointer;
  }
  .image-card:hover {
    border-color: var(--red);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(31, 26, 21, 0.08);
  }

  .image-preview {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .image-preview.has-transparency {
    background-image:
      linear-gradient(45deg, #e8e3d7 25%, transparent 25%),
      linear-gradient(-45deg, #e8e3d7 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #e8e3d7 75%),
      linear-gradient(-45deg, transparent 75%, #e8e3d7 75%);
    background-size: 16px 16px;
    background-position: 0 0, 0 8px, 8px -8px, -8px 0;
  }

  .image-preview.dark-bg { background: var(--dark); }

  .image-preview img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 4px;
  }

  .image-info {
    padding: 12px 16px;
    border-top: 1px solid var(--border);
  }

  .image-name {
    font-size: 13px;
    font-weight: 500;
    word-break: break-all;
    margin-bottom: 4px;
  }

  .image-ext {
    display: inline-block;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 2px 6px;
    border-radius: 4px;
    background: var(--surface);
    color: var(--muted);
  }

  .image-size {
    font-size: 11px;
    color: var(--light);
    margin-left: 6px;
  }

  /* ─── View controls ─── */
  .view-controls {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 16px;
  }

  .bg-toggle {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.03em;
    padding: 5px 10px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: var(--white);
    color: var(--muted);
    cursor: pointer;
    transition: all 0.15s;
    font-family: var(--font-body);
  }
  .bg-toggle:hover { border-color: var(--red); color: var(--text); }
  .bg-toggle.active { background: var(--red); color: white; border-color: var(--red); }

  /* ─── Lightbox ─── */
  .lightbox {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 200;
    background: rgba(8, 8, 12, 0.92);
    backdrop-filter: blur(12px);
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 12px;
    padding: 24px;
    cursor: zoom-out;
  }
  .lightbox.active { display: flex; }

  .lightbox img {
    max-width: 90vw;
    max-height: 75vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.5);
  }

  .lightbox-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .lightbox-label {
    color: rgba(255,255,255,0.6);
    font-size: 13px;
  }
  .lightbox-counter {
    color: rgba(255,255,255,0.35);
    font-size: 11px;
    letter-spacing: 0.05em;
  }

  .lightbox-btn {
    position: absolute;
    color: rgba(255,255,255,0.4);
    cursor: pointer;
    background: none;
    border: none;
    transition: color 0.15s;
    font-family: var(--font-body);
  }
  .lightbox-btn:hover { color: white; }
  #lb-close { top: 16px; right: 20px; font-size: 28px; }
  #lb-prev { top: 50%; left: 12px; transform: translateY(-50%); font-size: 36px; padding: 12px; }
  #lb-next { top: 50%; right: 12px; transform: translateY(-50%); font-size: 36px; padding: 12px; }

  /* ─── Empty state ─── */
  .empty-state {
    text-align: center;
    padding: 80px 24px;
    color: var(--muted);
  }
  .empty-state p { font-size: 15px; margin-top: 8px; }

  /* ─── Responsive ─── */
  @media (max-width: 640px) {
    .gallery-header { padding: 12px 16px; }
    .breadcrumb { padding: 10px 16px; }
    .gallery-container { padding: 20px 16px 60px; }
    .folders-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
    .images-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
    .image-preview { padding: 12px; }
  }
</style>
</head>
<body>

<header class="gallery-header">
  <div class="gallery-logo">Academ<span class="ia">IA</span></div>
  <span class="gallery-subtitle">Design Review</span>
</header>

<nav class="breadcrumb" id="breadcrumb"></nav>

<main class="gallery-container" id="gallery"></main>

<!-- Lightbox -->
<div class="lightbox" id="lightbox">
  <button class="lightbox-btn" id="lb-close">&times;</button>
  <button class="lightbox-btn" id="lb-prev">&#8249;</button>
  <button class="lightbox-btn" id="lb-next">&#8250;</button>
  <img id="lightbox-img" src="" alt="">
  <div class="lightbox-info">
    <div class="lightbox-label" id="lightbox-label"></div>
    <div class="lightbox-counter" id="lightbox-counter"></div>
  </div>
</div>

<script>
''' + js_code + '''
</script>
</body>
</html>'''


def main():
    parser = argparse.ArgumentParser(description="Generate AcademIA design review gallery")
    parser.add_argument("--dir", default=None, help="Base directory to scan (default: ./assets)")
    parser.add_argument("--output", default="gallery.html", help="Output HTML file")
    parser.add_argument("--base-url", default=".", help="Base URL for asset links")
    parser.add_argument("--serve", action="store_true", help="Start HTTP server after generating")
    parser.add_argument("--port", type=int, default=8767, help="HTTP server port")
    args = parser.parse_args()

    script_dir = Path(__file__).parent
    assets_dir = Path(args.dir) if args.dir else script_dir / ASSETS_DIR

    if not assets_dir.is_dir():
        print(f"Error: {assets_dir} is not a directory", file=sys.stderr)
        sys.exit(1)

    print(f"Scanning {assets_dir}...")
    tree = scan_directory(assets_dir)

    total_images = count_images(assets_dir)
    total_folders = sum(1 for _ in assets_dir.rglob("*") if _.is_dir())

    html = generate_html(tree, args.base_url)
    output_path = script_dir / args.output
    output_path.write_text(html, encoding="utf-8")

    print(f"Generated {output_path}")
    print(f"  {total_folders} folders, {total_images} images")

    if args.serve:
        print(f"\nServing at http://0.0.0.0:{args.port}/gallery.html")
        os.chdir(script_dir)
        subprocess.run(["python3", "-m", "http.server", str(args.port)], check=True)


if __name__ == "__main__":
    main()
