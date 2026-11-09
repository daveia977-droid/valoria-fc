"""Reuse V1 front pixels; replace only the surrounding photo backdrop for UV bleed.

The original official atlas is never overwritten. No new markings are generated.
Pillow is a local free tool, not an image-generation service.
"""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
source = Image.open(root / 'public/assets/collection.webp').convert('RGB')
texture = Image.new('RGB', source.size, (122, 6, 16))
for y in range(120, 735):
    candidates = [x for x in range(40, 489) if source.getpixel((x, y))[0] > 30 and source.getpixel((x, y))[0] - source.getpixel((x, y))[1] > 8]
    if not candidates:
        continue
    left = max(35, min(candidates) - 2)
    right = min(489, max(candidates) + 3)
    texture.paste(source.crop((left, y, right, y + 1)), (left, y))
output = root / 'artifacts/maillots-3d/v1-reference-texture.jpg'
output.parent.mkdir(parents=True, exist_ok=True)
texture.save(output, quality=97, subsampling=0)
print(output)
