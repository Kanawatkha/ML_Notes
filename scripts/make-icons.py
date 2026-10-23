"""Draws the app icons (public/icons/*.png) from the logo geometry of UI-SPEC.md section 11.

The mark is three points on a rising fitted line, the last point coral, on the soft-stone
background. The maskable icon keeps the mark inside the central 80 percent so any mask shape
leaves it whole.

Usage (needs PyMuPDF, which renders SVG): npm run icons
"""

import pathlib

import pymupdf

SOFT_STONE = "#eeece7"  # soft-stone
INK = "#17171c"  # primary
CANVAS = "#ffffff"  # canvas
CORAL = "#ff7759"  # coral

# name: (pixel size, share of the width taken by the mark)
ICONS = {
    "icon-192": (192, 0.58),
    "icon-512": (512, 0.58),
    "icon-maskable-512": (512, 0.46),  # inside the 80 percent safe zone
    "apple-touch-icon": (180, 0.58),
}

# Geometry on the 32 x 32 logo grid (the same numbers as src/components/layout/Logo.tsx).
SPAN = 26  # the mark, caps and strokes included, spans about x 3 to 29
CENTER = 16


def svg(size: int, share: float) -> str:
    scale = size * share / SPAN
    shift = size / 2 - CENTER * scale
    mark = (
        f'<g transform="translate({shift} {shift}) scale({scale})" stroke="{INK}" '
        'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
        '<path d="M4 25 L28 7" fill="none"/>'
        f'<circle cx="8" cy="21" r="2.75" fill="{CANVAS}"/>'
        f'<circle cx="16" cy="15" r="2.75" fill="{CANVAS}"/>'
        f'<circle cx="24.5" cy="9.5" r="3.25" fill="{CORAL}" stroke-width="1.5"/>'
        "</g>"
    )
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" '
        f'viewBox="0 0 {size} {size}"><rect width="{size}" height="{size}" fill="{SOFT_STONE}"/>'
        f"{mark}</svg>"
    )


def main() -> None:
    out = pathlib.Path(__file__).resolve().parent.parent / "public" / "icons"
    out.mkdir(parents=True, exist_ok=True)
    for name, (size, share) in ICONS.items():
        doc = pymupdf.open(stream=svg(size, share).encode("utf-8"), filetype="svg")
        pixmap = doc[0].get_pixmap(matrix=pymupdf.Matrix(1, 1), alpha=False)
        path = out / f"{name}.png"
        pixmap.save(path)
        print(f"{path.name}: {pixmap.width}x{pixmap.height}")


if __name__ == "__main__":
    main()
