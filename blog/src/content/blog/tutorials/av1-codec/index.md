---
title: "The Art of High-Quality Compression"
description: "AV1 cuts video file sizes by ~50% with no visible quality loss. Here's how it works."
pubDate: 2026-01-11
tags: ["video", "av1", "h264", "web-performance", "ffmpeg", "media", "optimization"]
category: "tutorials"
featured: true
draft: false
---

> **Table of Contents:**
>
> - [The Problem with Video on the Web](#the-problem-with-video-on-the-web)
> - [How Video Compression Actually Works](#how-video-compression-actually-works)
> - [H.264 vs AV1: What Changed](#h264-vs-av1-what-changed)
> - [Why Netflix Switched](#why-netflix-switched)
> - [Browser and Device Support in 2026](#browser-and-device-support-in-2026)
> - [The Real Trade-off: Encoding Time](#the-real-trade-off-encoding-time)
> - [Try It Yourself](#try-it-yourself)

---

## The Problem with Video on the Web

A 100 MB video that loads instantly on your fiber connection takes 20 minutes to buffer on a 3G network in rural Kenya. Same file, completely different experience.

For most developers, this doesn't register because we build and test on fast connections. But for platforms like YouTube (500+ hours uploaded every minute) or Netflix (270 million viewers), the gap between "loads fine" and "doesn't load" has real consequences — CDN costs, user drop-off, accessibility in bandwidth-constrained markets.

The obvious fix — compress the video more — usually means making it look worse. For a long time, that was the actual trade-off. Then AV1 came along and moved the line.

---

## How Video Compression Actually Works

Before getting into AV1 specifically, it helps to understand what video codecs are actually doing.

Video is redundant by nature. Consecutive frames are mostly the same. A talking head on a static background doesn't need every pixel redrawn 30 times per second — just the differences. Codecs exploit this by storing motion *deltas* rather than full frames.

H.264, which came out in 2003, broke each frame into 16×16 pixel blocks, predicted where those blocks moved between frames, and stored only what changed. For its time, it was excellent. It's still everywhere — phones, cameras, browsers, streaming platforms.

The limitation is that 16×16 is a blunt tool. A slow pan across a solid sky is very different from a close-up of someone's face mid-sentence, but H.264 treated both with the same block size.

---

## H.264 vs AV1: What Changed

AV1 was released in 2018 by the Alliance for Open Media — a coalition that includes Google, Netflix, Mozilla, Apple, and Intel, among others. The core improvement is that it's much less rigid about how it breaks down a frame.

Block sizes in AV1 range from 4×4 up to 128×128. Fine detail gets small blocks. Smooth, predictable regions get large ones. It also uses more sophisticated prediction models — rather than just asking "where did this block go?", it can make better guesses based on surrounding context.

The practical result: you can encode at roughly half the bitrate of H.264 and get comparable visual quality.

Here's a quick comparison on a 30-second 1080p clip:

| Codec | File Size | Bitrate | Quality |
|-------|-----------|---------|---------|
| H.264 (CRF 23) | 8.2 MB | 2.2 Mbps | Good |
| AV1 (CRF 35) | 4.1 MB | 1.1 Mbps | Comparable |

That's not a cherry-picked example — it's roughly what you can expect for typical web video content. Fast-moving content (sports, action) compresses less dramatically, but you're still usually looking at 30–50% smaller files.

---

## Why Netflix Switched

Netflix started rolling out AV1 encoding in 2020 and by late 2025, about 30% of their traffic goes through it. The reasons are straightforward:

**Cost.** Smaller files mean less CDN bandwidth. At Netflix's scale, a 40% reduction in video file size translates to hundreds of millions of dollars in infrastructure savings per year.

**Reach.** AV1 streams load faster on slow connections. In markets where Netflix is growing — Southeast Asia, Latin America, Africa — this matters more than it does in the US or Europe.

**Licensing.** H.264 is encumbered by patents. Using it at scale means paying licensing fees. AV1 is royalty-free. For a company spending billions on content, that's not a small footnote.

None of this is glamorous. It's just engineering economics.

---

## Browser and Device Support in 2026

AV1 support has improved a lot in the last two years, but it's still not universal.

**Good support:** Chrome, Firefox, Edge, Android 10+, most smart TVs, PlayStation 5, Xbox Series X.

**Partial:** Safari added AV1 support on iPhone 15 Pro and newer (hardware decode only). Older iPhones and most iPads still don't support it.

**No support:** Budget Android devices, anything running iOS 15 or earlier.

That works out to roughly 82% of global users being able to play AV1. Enough to matter, not enough to use exclusively.

The practical solution is to serve both and let the browser pick:

```html
<video controls>
  <source src="clip_av1.mp4" type='video/mp4; codecs="av01.0.05M.08"'>
  <source src="clip_h264.mp4" type='video/mp4; codecs="avc1.42E01E"'>
</video>
```

Browsers that support AV1 will use the first source. Everything else falls back to H.264. No JavaScript, no detection logic — the `<video>` tag handles it.

---

## The Real Trade-off: Encoding Time

The reason AV1 isn't already everywhere is that it's slow to encode.

The reference encoder (`libaom`) is thorough to the point of being unusable for anything time-sensitive. Encoding a 10-minute video can take hours. That's not an exaggeration.

In practice, you'd use **SVT-AV1** (developed by Intel and Netflix), which is much faster while producing near-identical quality. The tradeoffs look roughly like this:

| Encoder | Speed vs H.264 | Quality |
|---------|---------------|---------|
| libaom-av1 | 50–100x slower | Excellent |
| SVT-AV1 (preset 4) | 5–10x slower | Very good |
| libx264 (H.264) | baseline | Good |

For a personal blog with one or two hero videos, running SVT-AV1 overnight is no big deal. For user-generated content at scale, you'd offload this to a transcoding service — Cloudflare Stream, Mux, AWS MediaConvert — which handles the encoding infrastructure for you.

---

## Try It Yourself

If you have a video on your site and you haven't thought about encoding, this is worth 15 minutes of your time. Compressing a hero video from 15 MB to 5 MB is a meaningful performance improvement that costs nothing except a bit of disk space for the extra file.

### Install FFmpeg with SVT-AV1

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg
```

Check that SVT-AV1 is available:

```bash
ffmpeg -encoders | grep svtav1
```

### Encode both versions

```bash
# AV1 with SVT-AV1
ffmpeg -i input.mp4 -c:v libsvtav1 -crf 35 -preset 4 -c:a aac -b:a 128k output_av1.mp4

# H.264 fallback
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -c:a aac -b:a 128k output_h264.mp4
```

A few notes on the flags:
- `-crf` controls quality. Lower = better quality, larger file. 35 for AV1 and 23 for H.264 are roughly equivalent perceptual quality.
- `-preset 4` in SVT-AV1 is a good balance of speed and compression — lower numbers are slower but compress better.
- `-b:a 128k` for audio is fine for most web use.

A 100 MB source file will typically produce around 8 MB (AV1) and 15 MB (H.264). Then serve both with the `<video>` tag above.

### Check the result

Open the AV1 file side by side with the original. If you're encoding talking-head video, explainer content, or anything without a lot of fast motion, it should be hard to tell the difference.

If there's visible banding or blocking — usually in smooth gradients or dark scenes — try lowering the CRF by 2–3 and re-encode. That's usually enough to fix it.

---

AV1 is one of those improvements that's easy to ignore because the user experience looks identical — the video just loads faster and costs less to serve. But at any meaningful scale, that adds up quickly.

It's also one of the few web performance wins where the implementation is genuinely simple once you have the right tool. Two FFmpeg commands and a few lines of HTML is all it takes to get there.