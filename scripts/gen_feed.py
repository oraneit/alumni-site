#!/usr/bin/env python3
import os, json, mimetypes, hashlib
from datetime import datetime, timezone
from urllib.parse import quote

# Replace this with your live site URL (Netlify/GitHub Pages)
SITE_BASE_URL = os.environ.get("SITE_BASE_URL", "https://orane-alumni.netlify.app")
IMG_DIR = "placements"
FEED_JSON = "feed.json"
FEED_XML  = "feed.xml"

def iso_mtime(path):
    return datetime.fromtimestamp(os.path.getmtime(path), tz=timezone.utc).isoformat()

def sha12(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()[:12]

def mime(path):
    mt, _ = mimetypes.guess_type(path)
    return mt or "image/jpeg"

def collect():
    items = []
    for fn in os.listdir(IMG_DIR):
        if fn.startswith("."): 
            continue
        p = os.path.join(IMG_DIR, fn)
        if not os.path.isfile(p): 
            continue
        if not fn.lower().endswith((".jpg",".jpeg",".png",".webp",".gif")):
            continue
        items.append({
            "id": sha12(p),
            "url": f"{SITE_BASE_URL}/{IMG_DIR}/{quote(fn)}",
            "date_published": iso_mtime(p),
            "mime": mime(p)
        })
    items.sort(key=lambda x: x["date_published"], reverse=True)
    return items

def write_json(items):
    out = {
        "version": "https://jsonfeed.org/version/1.1",
        "title": "Latest Placements",
        "home_page_url": SITE_BASE_URL,
        "feed_url": f"{SITE_BASE_URL}/{FEED_JSON}",
        "items": [{
            "id": it["id"],
            "url": it["url"],
            "date_published": it["date_published"],
            "attachments": [{"url": it["url"], "mime_type": it["mime"]}]
        } for it in items]
    }
    with open(FEED_JSON, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

def write_rss(items):
    now_iso = datetime.now(timezone.utc).isoformat()
    lines = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">',
      '<channel>',
      '<title>Latest Placements</title>',
      f'<link>{SITE_BASE_URL}</link>',
      '<description>Newest first</description>',
      f'<lastBuildDate>{now_iso}</lastBuildDate>',
    ]
    for it in items:
        lines += [
          "<item>",
          f"<guid isPermaLink='false'>{it['id']}</guid>",
          f"<link>{it['url']}</link>",
          f"<pubDate>{it['date_published']}</pubDate>",
          f"<enclosure url=\"{it['url']}\" type=\"{it['mime']}\"/>",
          f"<media:content url=\"{it['url']}\" type=\"{it['mime']}\" medium=\"image\"/>",
          "</item>"
        ]
    lines += ["</channel></rss>"]
    with open(FEED_XML, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

def main():
    items = collect()
    write_json(items)
    write_rss(items)
    print(f"Wrote {FEED_JSON} and {FEED_XML} with {len(items)} items.")

if __name__ == "__main__":
    main()

