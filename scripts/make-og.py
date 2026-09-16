#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
OG 공유 카드 생성기 - assets/img/og-cover.jpg (1200x630)

덱 표지(슬라이드 01)의 디자인 언어를 그대로 쓴다: 딥 그린블랙 바탕, 초록 글로우,
Pretendard, NVIDIA 그린 강조. 헤드라인이나 마일스톤 문구를 바꾸면 이 스크립트를 다시 돌릴 것.

    python scripts/make-og.py

Pretendard OTF 가 .fonts/ 에 없으면 jsDelivr 에서 자동으로 받는다(.fonts 는 커밋하지 않는다).
"""
import os
import sys
import urllib.request

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT_DIR = os.path.join(ROOT, ".fonts")
OUT = os.path.join(ROOT, "assets", "img", "og-cover.jpg")

W, H = 1200, 630
BG = (12, 16, 13)          # --bg-deep
INK = (237, 242, 234)      # --hero-ink
SUB = (163, 178, 166)      # --hero-sub
NV = (118, 185, 0)         # --nv
LINE = (46, 58, 44)
FAINT = (122, 134, 124)

CDN = ("https://cdn.jsdelivr.net/gh/orioncactus/pretendard/"
       "packages/pretendard/dist/public/static")


def font(name, size):
    path = os.path.join(FONT_DIR, name)
    if not os.path.exists(path):
        os.makedirs(FONT_DIR, exist_ok=True)
        sys.stderr.write("downloading %s\n" % name)
        urllib.request.urlretrieve("%s/%s" % (CDN, name), path)
    return ImageFont.truetype(path, size)


def add_glow(img, cx, cy, rx, ry, strength):
    """표지의 radial-gradient 를 흉내낸 부드러운 빛번짐을 가산 합성한다."""
    layer = Image.new("RGB", (W, H), (0, 0, 0))
    ImageDraw.Draw(layer).ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=NV)
    layer = layer.filter(ImageFilter.GaussianBlur(radius=min(rx, ry) * 0.6))
    layer = Image.eval(layer, lambda v: int(v * strength))
    return ImageChops.add(img, layer)


def main():
    img = Image.new("RGB", (W, H), BG)
    img = add_glow(img, W * 0.86, -60, 500, 280, 0.24)     # 우상단
    img = add_glow(img, W * 0.04, H + 60, 380, 210, 0.11)  # 좌하단

    d = ImageDraw.Draw(img)
    M = 72  # 좌우 여백

    # ── 워드마크
    f_mark = font("Pretendard-ExtraBold.otf", 26)
    f_mark_s = font("Pretendard-SemiBold.otf", 17)
    x = M
    for text, color in [("BNi", INK), ("&", NV), ("C", INK)]:
        d.text((x, 54), text, font=f_mark, fill=color)
        x += d.textlength(text, font=f_mark)
    d.text((x + 12, 61), "WHITEPAPER", font=f_mark_s, fill=FAINT)

    # ── eyebrow (초록 선 + 라벨)
    ey = 150
    d.rectangle([M, ey + 9, M + 38, ey + 11], fill=NV)
    d.text((M + 54, ey), "PROJECT WHITEPAPER · 2026 – 2028",
           font=font("Pretendard-Bold.otf", 19), fill=NV)

    # ── 헤드라인
    f_h1 = font("Pretendard-ExtraBold.otf", 62)
    y = 200
    for line in [[("차세대 AI 인프라에서", INK)],
                 [("NASDAQ", NV), ("까지,", INK)]]:
        cx = M
        for text, color in line:
            d.text((cx, y), text, font=f_h1, fill=color)
            cx += d.textlength(text, font=f_h1)
        y += 78
    d.text((M, y + 14), "Tech Value Chain의 설계도",
           font=font("Pretendard-Regular.otf", 27), fill=SUB)

    # ── 하단 마일스톤 바
    by = H - 104
    d.rectangle([M, by, W - M, by + 1], fill=LINE)
    f_k = font("Pretendard-Bold.otf", 15)
    f_v = font("Pretendard-Bold.otf", 22)
    cx = M
    for k, v in [("PoC KICK-OFF", "2026.08"), ("U.S. ENTITY", "2027.01"),
                 ("NVIDIA GTC", "2027.03"), ("NASDAQ IPO", "2028 –")]:
        d.text((cx, by + 24), k, font=f_k, fill=FAINT)
        d.text((cx, by + 48), v, font=f_v, fill=INK)
        cx += max(d.textlength(k, font=f_k), d.textlength(v, font=f_v)) + 56

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    img.save(OUT, "JPEG", quality=88, optimize=True, progressive=True)
    print("wrote %s (%d bytes, %dx%d)" % (OUT, os.path.getsize(OUT), W, H))


if __name__ == "__main__":
    main()
