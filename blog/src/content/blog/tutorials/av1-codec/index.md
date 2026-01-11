---
title: "How Do Netflix and YouTube Make Videos So Small Without Ruining Quality?"
description: "Spoiler: It’s not magic it’s AV1. And yes, you can use it too. Here’s how, why, and whether your phone will cooperate."
pubDate: 2026-01-11
tags: ["video", "av1", "h264", "web-performance", "ffmpeg", "media", "optimization"]
category: "tutorials"
featured: true
draft: false
---

> **Table of Contents:**
>
> - [A Quiet Problem Most of Us Don’t See](#a-quiet-problem-most-of-us-dont-see)
> - [What If Video Could Be Smarter?](#what-if-video-could-be-smarter)
> - [H.264 and AV1: Two Generations of Compression](#h264-and-av1-two-generations-of-compression)
> - [Why Netflix Started Whispering in AV1](#why-netflix-started-whispering-in-av1)
> - [Who Can Actually Play AV1 Today?](#who-can-actually-play-av1-today)
> - [The Quiet Trade-Off: Time for Space](#the-quiet-trade-off-time-for-space)
> - [Try It Yourself Gently](#try-it-yourself-gently)
>
---

## A Quiet Problem Most of Us Don’t See

If you’ve ever streamed a show on a fast connection, you might never have wondered: *how does this even work?* The video loads instantly, looks crisp, and somehow doesn’t eat your entire data plan.

But step outside that bubble into places where bandwidth is scarce or expensive and the story changes. A 100 MB video might take 20 minutes to load… if it loads at all. For platforms like YouTube (500+ hours uploaded every minute) or Netflix (270 million viewers), that inefficiency isn’t just inconvenient it’s unsustainable.

So they asked a quiet question: *What if we could make videos smaller… without making them worse?*

The answer arrived not with fanfare, but with math: **AV1**.

---

## What If Video Could Be Smarter?

At its core, video compression is about understanding what we see and what we don’t.

Early codecs like **H.264** (born in 2003) were clever. They broke frames into 16×16 blocks, predicted motion from one frame to the next, and stored only the differences. It worked beautifully for its time.

But human vision is nuanced. We notice texture in a face, smoothness in motion, consistency in color but we barely register redundant pixels in a static background.

**AV1**, released in 2018 by a coalition including Google, Netflix, and Mozilla, listens more closely. It uses block sizes that adapt from 4×4 for fine details to 64×64 for broad scenes and applies richer prediction models, some inspired by how neural networks interpret patterns.

The result? It keeps what matters to our eyes and gently lets go of the rest. Often, you can halve the file size and still struggle to spot the difference.

---

## H.264 and AV1: Two Generations of Compression

To see the gap, I tried a simple experiment: encode the same 30-second 1080p clip someone dancing in golden-hour light with both codecs.

| Codec | File Size | Bitrate | Perceived Quality |
|-------|-----------|---------|-------------------|
| H.264 (CRF 23) | 8.2 MB | 2.2 Mbps | Clear, as expected |
| AV1 (CRF 35)   | 4.1 MB | 1.1 Mbps | …is this really the same file? |

On mobile networks, where every megabyte counts, AV1’s advantage grows even wider sometimes shrinking files by **over 50%** with no visible loss.

It’s not that H.264 is bad. It’s that AV1 is *listening better*.

---

## Why Netflix Started Whispering in AV1

Netflix didn’t switch to AV1 for the hype. They switched because silence has value.

Smaller streams mean:

- Lower CDN costs (millions saved annually),
- Faster playback in regions with limited bandwidth,
- And perhaps most importantly no licensing fees. AV1 is **royalty-free**, unlike H.264, which carries legacy patent obligations.

By late 2025, about **30% of Netflix’s traffic** flows through AV1. Not all at once, not loudly but steadily, like a system learning to breathe more efficiently.

---

## Who Can Actually Play AV1 Today?

Progress is rarely uniform. As of early 2026:

✅ **Full support**: Chrome, Firefox, Edge, Android 10+, most smart TVs  
⚠️ **Partial**: Safari only on iPhone 15 Pro and newer  
❌ **Not yet**: Older iPhones, iPads, and many budget devices

Globally, that covers roughly **82% of users**. Enough to matter but not enough to go all-in without a safety net.

That’s why the humble `<video>` tag remains so elegant:

```html
<video controls>
  <source src="clip_av1.mp4" type='video/mp4; codecs="av01.0.05M.08"'>
  <source src="clip_h264.mp4" type='video/mp4; codecs="avc1.42E01E"'>
</video>
```

Browsers quietly choose the best option they understand. No drama. Just graceful fallbacks.

---

## The Quiet Trade-Off: Time for Space

There’s a cost to this efficiency: **encoding takes longer**.

- H.264 encodes quickly even on modest hardware.
- AV1, especially with the reference `libaom` encoder, can be **15–50x slower**.
- But newer encoders like **SVT-AV1** (from Intel) strike a sweeter balance about **5–10x slower** than H.264, with near-optimal quality.

For personal projects, that’s fine. Let it run while you sleep.  
For apps at scale? Services like **Cloudflare Stream**, **Mux**, or **AWS MediaConvert** handle the heavy lifting in the cloud.

Efficiency, it turns out, often asks for patience first.

---

## Try It Yourself Gently

You don’t need a streaming empire to benefit from AV1. Even compressing one hero video on your blog can speed up your site and reduce data usage for visitors on slower connections.

### Step 1: Install FFmpeg with SVT-AV1

```bash
# macOS
brew install ffmpeg --with-svt-av1

# Ubuntu/Debian
sudo apt install ffmpeg libsvtav1enc-dev
```

### Step 2: Encode Two Versions

```bash
# AV1   lean and sharp
ffmpeg -i input.mp4 -c:v libsvtav1 -crf 35 -preset 4 -c:a aac -b:a 128k output_av1.mp4

# H.264   the reliable friend
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -c:a aac -b:a 128k output_h264.mp4
```

A 100 MB source might become ~8 MB (AV1) and ~15 MB (H.264). Not bad for a few lines in the terminal.

Then serve them together, and let the browser decide.

---

### In Closing

Video compression isn’t about tricks or shortcuts. It’s about paying closer attention to how light moves, how eyes perceive, and how networks carry bits across continents.

AV1 is one expression of that care: open, efficient, and quietly powerful.

You don’t have to adopt it everywhere today.  
But maybe… try it on one video. Watch the file shrink. Test it on an old phone. Notice how nothing feels lost only lighter.

---
