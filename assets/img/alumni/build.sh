#!/usr/bin/env bash
set -e
SRC_DIR="assets/img/alumni/src"
OUT_DIR="assets/img/alumni"
QUALITY=80

mkdir -p "$OUT_DIR"

for f in "$SRC_DIR"/*.{jpg,jpeg,png,JPG,JPEG,PNG}; do
  [ -e "$f" ] || continue
  name="$(basename "$f" | sed 's/\.[^.]*$//')"
  echo "Processing $name"
  cwebp -q $QUALITY -resize 320 0  "$f" -o "$OUT_DIR/${name}-320.webp"
  cwebp -q $QUALITY -resize 640 0  "$f" -o "$OUT_DIR/${name}-640.webp"
  cwebp -q $QUALITY -resize 960 0  "$f" -o "$OUT_DIR/${name}-960.webp"
  cwebp -q $QUALITY -resize 1200 0 "$f" -o "$OUT_DIR/${name}-1200.webp"
  sips -Z 640 "$f" --out "$OUT_DIR/${name}-640.jpg" >/dev/null
done

