#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate real, downloadable sample PDFs for the CGArtLab Design System.

No third-party dependencies: this writes valid PDF 1.7 by hand (Helvetica /
Helvetica-Bold / Courier built-in fonts + filled rectangles for swatches).
Text is ASCII (token names + OKLch values), which suits a reference card.

Outputs (relative to repo root):
    assets/downloads/cgartlab-ds-reference.pdf   (multi-page reference)
    assets/downloads/cgartlab-ds-color-card.pdf  (one-page color card)

Run:  python tools/generate_pdfs.py
"""

import os

A4_W, A4_H = 595.28, 841.89  # points

# ---- Approximate sRGB (0..1) for the OKLch palette (for swatches only;
#      exact OKLch values are printed alongside each swatch). ----
RGB = {
    "bg":            (0.965, 0.953, 0.929),
    "surface":       (0.988, 0.984, 0.972),
    "surface-raised":(1.000, 1.000, 1.000),
    "border":        (0.886, 0.874, 0.843),
    "border-strong": (0.812, 0.792, 0.745),
    "muted":         (0.460, 0.443, 0.415),
    "fg-subtle":     (0.330, 0.315, 0.292),
    "fg":            (0.180, 0.168, 0.149),
    "fg-strong":     (0.130, 0.118, 0.102),
    "olive-50":      (0.906, 0.902, 0.831),
    "olive-100":     (0.824, 0.816, 0.698),
    "olive-200":     (0.706, 0.698, 0.525),
    "olive-300":     (0.592, 0.584, 0.369),
    "olive-400":     (0.482, 0.478, 0.251),
    "olive-500":     (0.408, 0.404, 0.200),
    "olive-600":     (0.337, 0.333, 0.165),
    "olive-700":     (0.259, 0.255, 0.129),
    "olive-800":     (0.184, 0.184, 0.094),
    "olive-900":     (0.125, 0.125, 0.060),
    "success":       (0.305, 0.541, 0.322),
    "warning":       (0.690, 0.540, 0.190),
    "error":         (0.710, 0.270, 0.180),
    "info":          (0.310, 0.500, 0.690),
    "white":         (1.0, 1.0, 1.0),
}


def esc(s):
    return s.replace("\\", r"\\").replace("(", r"\(").replace(")", r"\)")


class Page:
    def __init__(self, w=A4_W, h=A4_H):
        self.w, self.h = w, h
        self.ops = []

    def rect(self, x, y, w, h, color, fill=True, line_w=1.0):
        r, g, b = color
        if fill:
            self.ops.append(f"{r:.4f} {g:.4f} {b:.4f} rg")
            self.ops.append(f"{x:.2f} {y:.2f} {w:.2f} {h:.2f} re f")
        else:
            self.ops.append(f"{r:.4f} {g:.4f} {b:.4f} RG")
            self.ops.append(f"{line_w:.2f} w")
            self.ops.append(f"{x:.2f} {y:.2f} {w:.2f} {h:.2f} re S")

    def line(self, x1, y1, x2, y2, color, line_w=1.0):
        r, g, b = color
        self.ops.append(f"{r:.4f} {g:.4f} {b:.4f} RG")
        self.ops.append(f"{line_w:.2f} w")
        self.ops.append(f"{x1:.2f} {y1:.2f} m {x2:.2f} {y2:.2f} l S")

    def text(self, x, y_top, s, font="F1", size=10, color=RGB["fg"]):
        # y_top measured from the top of the page
        r, g, b = color
        y = self.h - y_top
        self.ops.append("BT")
        self.ops.append(f"/{font} {size:.2f} Tf")
        self.ops.append(f"{r:.4f} {g:.4f} {b:.4f} rg")
        self.ops.append(f"1 0 0 1 {x:.2f} {y:.2f} Tm")
        self.ops.append(f"({esc(s)}) Tj")
        self.ops.append("ET")

    def swatch_row(self, x, y_top, name, value, color, w=150, h=22, ring=False):
        y = self.h - y_top - h
        r, g, b = color
        self.ops.append(f"{r:.4f} {g:.4f} {b:.4f} rg")
        self.ops.append(f"{x:.2f} {y:.2f} {w:.2f} {h:.2f} re f")
        br, bg, bb = RGB["border-strong"]
        self.ops.append(f"{br:.4f} {bg:.4f} {bb:.4f} RG")
        self.ops.append("0.6 w")
        self.ops.append(f"{x:.2f} {y:.2f} {w:.2f} {h:.2f} re S")
        if ring:
            ar, ag, ab = RGB["olive-500"]
            self.ops.append(f"{ar:.4f} {ag:.4f} {ab:.4f} RG")
            self.ops.append("1.4 w")
            self.ops.append(f"{x-2:.2f} {y-2:.2f} {w+4:.2f} {h+4:.2f} re S")
        self.text(x + w + 12, y_top + 9, name, "F2", 9.5, RGB["fg-strong"])
        self.text(x + w + 12, y_top + 19, value, "F3", 8, RGB["muted"])

    def stream(self):
        return ("\n".join(self.ops)).encode("latin-1")


class PDFDoc:
    def __init__(self):
        self.pages = []

    def add_page(self, p):
        self.pages.append(p)

    def build(self):
        P = len(self.pages)
        # numbering: 1 catalog, 2 pages, 3 F1, 4 F2, 5 F3,
        # then per page: content(6+2i), page(7+2i)
        page_nums = [7 + 2 * i for i in range(P)]
        objects = []  # (num, body bytes)

        objects.append((1, b"<< /Type /Catalog /Pages 2 0 R >>"))
        kids = " ".join(f"{n} 0 R" for n in page_nums)
        objects.append((2, f"<< /Type /Pages /Count {P} /Kids [{kids}] >>".encode()))
        objects.append((3, b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"))
        objects.append((4, b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"))
        objects.append((5, b"<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>"))
        for i, pg in enumerate(self.pages):
            cnum = 6 + 2 * i
            pnum = 7 + 2 * i
            data = pg.stream()
            content = (f"<< /Length {len(data)} >>\nstream\n".encode()
                       + data + b"\nendstream")
            objects.append((cnum, content))
            page_body = (
                f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {pg.w:.2f} {pg.h:.2f}] "
                f"/Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> "
                f"/Contents {cnum} 0 R >>"
            ).encode()
            objects.append((pnum, page_body))

        objects.sort(key=lambda o: o[0])
        out = b"%PDF-1.7\n%\xe2\xe3\xcf\xd3\n"
        offsets = {}
        for num, body in objects:
            offsets[num] = len(out)
            out += f"{num} 0 obj\n".encode() + body + b"\nendobj\n"
        xref_pos = len(out)
        total = len(objects) + 1
        out += f"xref\n0 {total}\n".encode()
        out += b"0000000000 65535 f \n"
        for num in range(1, total):
            out += f"{offsets[num]:010d} 00000 n \n".encode()
        out += (f"trailer\n<< /Size {total} /Root 1 0 R >>\n"
                f"startxref\n{xref_pos}\n%%EOF").encode()
        return out


def header(p, title, subtitle):
    p.rect(0, p.h - 96, p.w, 96, RGB["olive-400"])
    p.text(56, 46, title, "F2", 22, RGB["white"])
    p.text(56, 70, subtitle, "F3", 9.5, RGB["olive-50"])
    # leaf glyph hint
    p.text(p.w - 90, 58, "CGArtLab", "F2", 11, RGB["white"])


def footer(p, page_label):
    p.line(56, 40, p.w - 56, 40, RGB["border"], 0.6)
    p.text(56, 36, "CGArtLab Design System  -  Editorial x Olive Green  -  v1.1",
           "F3", 7.5, RGB["muted"])
    p.text(p.w - 110, 36, page_label, "F3", 7.5, RGB["muted"])


def build_reference():
    doc = PDFDoc()

    # ---- Page 1: cover ----
    p = Page()
    p.rect(0, 0, p.w, p.h, RGB["bg"])
    p.rect(0, p.h - 280, p.w, 280, RGB["olive-400"])
    p.rect(56, p.h - 150, 64, 64, RGB["white"])
    p.text(70, 120, "CG", "F2", 30, RGB["olive-500"])
    p.text(56, 200, "CGArtLab", "F2", 40, RGB["white"])
    p.text(56, 244, "Design System", "F2", 40, RGB["olive-50"])
    p.text(56, 300, "Editorial x Olive Green  -  Quick Reference", "F3", 12, RGB["fg-strong"])
    p.text(56, 330, "OKLch tokens / dark-mode ready / framework-agnostic", "F1", 11, RGB["muted"])

    p.text(56, 430, "WHAT'S INSIDE", "F2", 10, RGB["olive-500"])
    items = [
        "01  Color tokens - neutral, olive ramp, semantic",
        "02  Typography - families and type scale",
        "03  Spacing, radius and shadow scales",
        "04  Component class catalog",
    ]
    yy = 456
    for it in items:
        p.text(56, yy, it, "F1", 11, RGB["fg"])
        yy += 26

    p.text(56, 690, "200+ design tokens   -   25 components   -   100 icons", "F2", 11, RGB["olive-600"])
    p.text(56, 712, "designsystem.cgartlab.com", "F3", 10, RGB["muted"])
    footer(p, "Page 1 / 4")
    doc.add_page(p)

    # ---- Page 2: colors ----
    p = Page()
    p.rect(0, 0, p.w, p.h, RGB["bg"])
    header(p, "01  Color Tokens", "All colors defined in OKLch for perceptual uniformity")
    y = 130
    p.text(56, y, "NEUTRAL", "F2", 10, RGB["olive-500"]); y += 16
    neutrals = [
        ("--ds-color-bg", "oklch(97% 0.012 80)", RGB["bg"]),
        ("--ds-color-surface-raised", "oklch(100% 0 0)", RGB["surface-raised"]),
        ("--ds-color-border", "oklch(89% 0.012 80)", RGB["border"]),
        ("--ds-color-muted", "oklch(48% 0.015 60)", RGB["muted"]),
        ("--ds-color-fg", "oklch(20% 0.02 60)", RGB["fg"]),
        ("--ds-color-fg-strong", "oklch(14% 0.025 60)", RGB["fg-strong"]),
    ]
    for name, val, col in neutrals:
        p.swatch_row(56, y, name, val, col)
        y += 30
    y += 8
    p.text(56, y, "OLIVE GREEN  (accent = olive-400)", "F2", 10, RGB["olive-500"]); y += 16
    olive = [
        ("--ds-color-olive-100", "oklch(82% 0.035 115)", RGB["olive-100"], False),
        ("--ds-color-olive-300", "oklch(62% 0.065 115)", RGB["olive-300"], False),
        ("--ds-color-olive-400  *", "oklch(52% 0.08 115)", RGB["olive-400"], True),
        ("--ds-color-olive-600", "oklch(38% 0.08 115)", RGB["olive-600"], False),
        ("--ds-color-olive-800", "oklch(22% 0.055 115)", RGB["olive-800"], False),
    ]
    for name, val, col, ring in olive:
        p.swatch_row(56, y, name, val, col, ring=ring)
        y += 30
    # second column: semantic
    y2 = 146
    p.text(320, y2, "SEMANTIC", "F2", 10, RGB["olive-500"]); y2 += 16
    sem = [
        ("--ds-color-success", "oklch(55% 0.1 145)", RGB["success"]),
        ("--ds-color-warning", "oklch(65% 0.1 85)", RGB["warning"]),
        ("--ds-color-error", "oklch(50% 0.14 30)", RGB["error"]),
        ("--ds-color-info", "oklch(55% 0.08 240)", RGB["info"]),
    ]
    for name, val, col in sem:
        p.swatch_row(320, y2, name, val, col, w=120)
        y2 += 30
    footer(p, "Page 2 / 4")
    doc.add_page(p)

    # ---- Page 3: typography ----
    p = Page()
    p.rect(0, 0, p.w, p.h, RGB["bg"])
    header(p, "02  Typography", "Serif display + sans body + mono code")
    y = 134
    p.text(56, y, "FONT FAMILIES", "F2", 10, RGB["olive-500"]); y += 22
    fams = [
        ("Display", "Iowan Old Style / Charter / Georgia / serif"),
        ("Body & UI", "Noto Sans SC / -apple-system / system-ui / sans-serif"),
        ("Mono", "JetBrains Mono / IBM Plex Mono / monospace"),
    ]
    for role, stack in fams:
        p.text(56, y, role, "F2", 10.5, RGB["fg-strong"])
        p.text(150, y, stack, "F3", 9, RGB["muted"])
        y += 22
    y += 14
    p.text(56, y, "TYPE SCALE (rem)", "F2", 10, RGB["olive-500"]); y += 24
    scale = [
        ("hero", "4.5", 26), ("display", "3.75", 23), ("h1", "3", 20),
        ("h2", "2.25", 17), ("h3", "1.875", 15), ("h4", "1.5", 13),
        ("lead", "1.25", 12), ("body", "1", 11), ("body-sm", "0.875", 10),
        ("caption", "0.75", 9),
    ]
    for name, rem, sz in scale:
        p.text(56, y, "Editorial Olive", "F2", sz, RGB["fg"])
        p.text(360, y, f"--ds-text-{name}", "F3", 9, RGB["muted"])
        p.text(500, y, f"{rem} rem", "F3", 9, RGB["olive-600"])
        y += sz + 9
    footer(p, "Page 3 / 4")
    doc.add_page(p)

    # ---- Page 4: spacing + components ----
    p = Page()
    p.rect(0, 0, p.w, p.h, RGB["bg"])
    header(p, "03 / 04  Spacing & Components", "4px base scale + class catalog")
    y = 134
    p.text(56, y, "SPACING SCALE (4px base)", "F2", 10, RGB["olive-500"]); y += 20
    for tok, px in [("space-1", 4), ("space-2", 8), ("space-3", 12), ("space-4", 16),
                    ("space-6", 24), ("space-8", 32), ("space-12", 48), ("space-16", 64)]:
        p.rect(150, p.h - (y + 9), px, 10, RGB["olive-300"])
        p.text(56, y + 8, f"--ds-{tok}", "F3", 8.5, RGB["muted"])
        p.text(150 + px + 8, y + 8, f"{px}px", "F3", 8.5, RGB["fg"])
        y += 18
    y += 10
    p.text(56, y, "RADIUS", "F2", 10, RGB["olive-500"]); y += 16
    p.text(56, y, "sm 2  -  md 4  -  lg 8  -  xl 12  -  2xl 16  -  full", "F3", 9, RGB["fg"]); y += 20
    p.text(56, y, "SHADOW", "F2", 10, RGB["olive-500"]); y += 16
    p.text(56, y, "xs  -  sm  -  md  -  lg  -  xl  -  2xl", "F3", 9, RGB["fg"]); y += 28

    p.text(56, y, "COMPONENT CLASS CATALOG", "F2", 10, RGB["olive-500"]); y += 20
    cats = [
        ("Buttons", "ds-btn  --primary / --secondary / --ghost  --sm / --lg"),
        ("Cards", "ds-card  --hoverable / --flat   ds-glass-card"),
        ("Forms", "ds-input  ds-label  ds-select  ds-toggle  ds-form-*"),
        ("Feedback", "ds-badge--*  ds-alert--*  ds-toast"),
        ("Navigation", "ds-navbar  ds-tabs/ds-tab  ds-breadcrumb  ds-pagination"),
        ("Data", "ds-table  ds-progress  ds-avatar  ds-chip"),
        ("Type", "ds-display  ds-h1..h4  ds-caption  ds-eyebrow  ds-lead"),
        ("Motion", "ds-reveal (--left/--right/--scale)  ds-anim-float"),
    ]
    for role, cls in cats:
        p.text(56, y, role, "F2", 9.5, RGB["fg-strong"])
        p.text(150, y, cls, "F3", 8.5, RGB["muted"])
        y += 18
    footer(p, "Page 4 / 4")
    doc.add_page(p)

    return doc.build()


def build_color_card():
    doc = PDFDoc()
    p = Page()
    p.rect(0, 0, p.w, p.h, RGB["bg"])
    header(p, "Color Card", "OKLch palette - CGArtLab Design System")
    # big olive ramp
    y = 130
    p.text(56, y, "OLIVE RAMP  50 -> 900", "F2", 10, RGB["olive-500"]); y += 16
    ramp = ["olive-50", "olive-100", "olive-200", "olive-300", "olive-400",
            "olive-500", "olive-600", "olive-700", "olive-800", "olive-900"]
    bw = (p.w - 112) / len(ramp)
    for i, key in enumerate(ramp):
        p.rect(56 + i * bw, p.h - (y + 70), bw - 2, 70, RGB[key])
    y += 78
    p.text(56, y, "50", "F3", 8, RGB["muted"])
    p.text(p.w - 70, y, "900", "F3", 8, RGB["muted"])
    y += 24

    p.text(56, y, "ACCENT", "F2", 10, RGB["olive-500"]); y += 16
    p.swatch_row(56, y, "--ds-accent = --ds-color-olive-400", "oklch(52% 0.08 115)", RGB["olive-400"], w=180, ring=True)
    y += 44

    p.text(56, y, "NEUTRALS", "F2", 10, RGB["olive-500"]); y += 16
    for name, val, col in [
        ("--ds-color-bg", "oklch(97% 0.012 80)", RGB["bg"]),
        ("--ds-color-fg", "oklch(20% 0.02 60)", RGB["fg"]),
        ("--ds-color-fg-strong", "oklch(14% 0.025 60)", RGB["fg-strong"]),
        ("--ds-color-muted", "oklch(48% 0.015 60)", RGB["muted"]),
    ]:
        p.swatch_row(56, y, name, val, col, w=150)
        y += 30
    y += 8
    p.text(56, y, "SEMANTIC", "F2", 10, RGB["olive-500"]); y += 16
    for name, val, col in [
        ("--ds-color-success", "oklch(55% 0.1 145)", RGB["success"]),
        ("--ds-color-warning", "oklch(65% 0.1 85)", RGB["warning"]),
        ("--ds-color-error", "oklch(50% 0.14 30)", RGB["error"]),
        ("--ds-color-info", "oklch(55% 0.08 240)", RGB["info"]),
    ]:
        p.swatch_row(56, y, name, val, col, w=150)
        y += 30
    footer(p, "Color Card")
    doc.add_page(p)
    return doc.build()


def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_dir = os.path.join(root, "assets", "downloads")
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, "cgartlab-ds-reference.pdf"), "wb") as f:
        f.write(build_reference())
    with open(os.path.join(out_dir, "cgartlab-ds-color-card.pdf"), "wb") as f:
        f.write(build_color_card())
    print("Generated PDFs in", out_dir)


if __name__ == "__main__":
    main()
