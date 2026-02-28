#!/usr/bin/env python3
import os
import re
import sqlite3
import subprocess
import sys
import tempfile
from datetime import datetime
from pathlib import Path
from typing import Optional

SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
BLOG_MD_DIR = PROJECT_ROOT / "blog" / "markdowns"
BLOG_ASSETS_DIR = PROJECT_ROOT / "blog" / "markdowns" / "assets"
DB_FILE = PROJECT_ROOT / "blog-assets.db"
LOG_FILE = PROJECT_ROOT / "publish.log"


def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_FILE))
    conn.execute(
        "CREATE TABLE IF NOT EXISTS published_assets ("
        "img_path TEXT PRIMARY KEY,"
        "uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
    )
    return conn


def generate_json_from_db():
    conn = get_db_connection()
    cursor = conn.execute("SELECT img_path, uploaded_at FROM published_assets")
    rows = cursor.fetchall()
    conn.close()

    import json

    data = [{"img_path": row[0], "uploaded_at": row[1]} for row in rows]
    tmp_path = Path(tempfile.gettempdir()) / "blog-assets.json"
    tmp_path.write_text(
        json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print(f"Metadata written to: {tmp_path}")


def scan_markdown_images() -> set[str]:
    image_pattern = re.compile(r"!\[([^\]]*)\]\(([^)]+)\)")
    images: set[str] = set()

    for md_file in BLOG_MD_DIR.rglob("*.md"):
        content = md_file.read_text(encoding="utf-8")
        for _, path in image_pattern.findall(content):
            if path.startswith("http"):
                continue

            md_dir = md_file.parent
            full_path = (md_dir / path).resolve()
            try:
                full_path.relative_to(PROJECT_ROOT)
            except ValueError:
                continue

            if full_path.exists():
                rel_path = full_path.relative_to(PROJECT_ROOT)
                images.add(str(rel_path))

    return images


def get_compressed_path(original_path: str) -> str:
    p = Path(original_path)
    stem = p.stem
    suffix = p.suffix
    return str(p.parent / f"{stem}.compressed{suffix}")


def compress_image(input_path: str) -> bool:
    input_p = Path(input_path)
    if not input_p.exists():
        print(f"  File not found: {input_path}")
        return False

    compressed_path = get_compressed_path(input_path)
    compressed_p = Path(compressed_path)

    if compressed_p.exists():
        print(f"  Already compressed: {compressed_path}")
        return True

    cmd = ["ffmpeg", "-i", str(input_p), "-q:v", "28", "-y", str(compressed_p)]
    try:
        subprocess.run(cmd, check=True, capture_output=True)
        print(f"  Compressed: {input_path} -> {compressed_path}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"  Error compressing {input_path}: {e.stderr.decode()}")
        return False


def update_markdown_refs(original_path: str, compressed_path: str):
    original_p = Path(original_path)
    compressed_p = Path(compressed_path)

    original_name = original_p.name
    compressed_name = compressed_p.name

    for md_file in BLOG_MD_DIR.rglob("*.md"):
        content = md_file.read_text(encoding="utf-8")
        if original_name not in content:
            continue

        new_content = content.replace(original_name, compressed_name)
        md_file.write_text(new_content, encoding="utf-8")
        print(f"  Updated: {md_file.relative_to(PROJECT_ROOT)}")


def process_images() -> tuple[list[tuple[str, str]], list[str]]:
    conn = get_db_connection()
    cursor = conn.cursor()

    images = scan_markdown_images()
    processed: list[tuple[str, str]] = []
    skipped: list[str] = []

    for img_path in sorted(images):
        compressed_path = get_compressed_path(img_path)
        # Handle images that are already compressed
        if "compressed" in Path(img_path).name.lower():
            cursor.execute(
                "INSERT OR REPLACE INTO published_assets (img_path, uploaded_at) VALUES (?, ?)",
                (img_path, datetime.now().isoformat()),
            )
            processed.append((img_path, img_path))
            continue


        cursor.execute(
            "SELECT img_path FROM published_assets WHERE img_path = ?",
            (compressed_path,),
        )
        if cursor.fetchone():
            skipped.append(img_path)
            continue

        if Path(compressed_path).exists():
            print(f"  Already compressed: {compressed_path}")
            update_markdown_refs(img_path, compressed_path)
            cursor.execute(
                "INSERT OR REPLACE INTO published_assets (img_path, uploaded_at) VALUES (?, ?)",
                (compressed_path, datetime.now().isoformat()),
            )
            processed.append((img_path, compressed_path))

            if Path(img_path).exists():
                Path(img_path).unlink()
                print(f"  Removed original: {img_path}")
            continue

        if compress_image(img_path):
            update_markdown_refs(img_path, compressed_path)
            cursor.execute(
                "INSERT OR REPLACE INTO published_assets (img_path, uploaded_at) VALUES (?, ?)",
                (compressed_path, datetime.now().isoformat()),
            )
            processed.append((img_path, compressed_path))

            Path(img_path).unlink()
            print(f"  Removed original: {img_path}")
        else:
            skipped.append(img_path)

    conn.commit()
    conn.close()

    generate_json_from_db()

    return processed, skipped


def generate_log(processed: list[tuple[str, str]], skipped: list[str]):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    lines = [
        "=== Blog Assets Publish Log ===",
        f"Timestamp: {timestamp}",
        "",
        f"--- Published ({len(processed)}) ---",
    ]

    for original, compressed in processed:
        lines.append(f"✓ {original} -> {compressed}")

    lines.extend(
        [
            "",
            f"--- Skipped (already published) ({len(skipped)}) ---",
        ]
    )

    for img_path in skipped:
        lines.append(f"- {img_path}")

    lines.extend(
        [
            "",
            "=== Summary ===",
            f"Total images: {len(processed) + len(skipped)} | Processed: {len(processed)} | Skipped: {len(skipped)}",
        ]
    )

    LOG_FILE.write_text("\n".join(lines), encoding="utf-8")
    print(f"\nLog written to: {LOG_FILE}")


def main():
    print("Publishing blog assets...\n")

    if not BLOG_MD_DIR.exists():
        print(f"Markdown directory not found: {BLOG_MD_DIR}")
        sys.exit(1)

    if not BLOG_ASSETS_DIR.exists():
        print(f"Assets directory not found: {BLOG_ASSETS_DIR}")
        print("Creating assets directory...")
        BLOG_ASSETS_DIR.mkdir(parents=True, exist_ok=True)

    processed, skipped = process_images()

    print(f"\nProcessed: {len(processed)}")
    print(f"Skipped: {len(skipped)}")

    generate_log(processed, skipped)


if __name__ == "__main__":
    main()