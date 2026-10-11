---
title: "Vibe Coding Won't Kill Photoshop. It's Killing Something Else."
description: "Everyone's angry at Adobe and Sony, and anyone can build an app in a weekend now. So why are the incumbents posting record revenue?"
pubDate: 2026-10-11
tags: ["ai", "vibe-coding", "software-industry", "creative-tools", "opinion"]
category: "writings"
draft: false
---

> **Table of Contents:**
>
> - [The Story Everyone Is Telling](#the-story-everyone-is-telling)
> - [Then You Look at the Numbers](#then-you-look-at-the-numbers)
> - [Starting Is Cheap. Finishing Isn't.](#starting-is-cheap-finishing-isnt)
> - [Code Was Never the Moat](#code-was-never-the-moat)
> - [So What Is Actually Changing?](#so-what-is-actually-changing)
> - [Who Wins](#who-wins)
> - [What Would Prove Me Wrong](#what-would-prove-me-wrong)

---

## The Story Everyone Is Telling

It goes like this.

Adobe made you pay a fee to cancel your subscription, then sneaked an AI-training clause into its terms. Sony is ending physical game discs in 2028 and wouldn't budge even after a petition passed 370,000 signatures. People are furious.

At the same time, AI got *good enough*. Not AGI, but good enough that a person with an idea and a weekend can ship an app. So surely the angry users just... build their own Photoshop? Their own Premiere? The revolution writes itself.

I wanted to know if that's true. So instead of vibing an answer, I went to the evidence: earnings filings, randomized trials, labour data, court rulings. Here's what came back.

Short version: **the revolution is real, but it's not the one you think.**

---

## Then You Look at the Numbers

Adobe's most recent quarter, the one that ended in August 2026, brought in **$6.76 billion. A record. Up 13%.** The segment selling to individual creators and consumers grew *16%*. That's from [their own SEC filing](https://www.sec.gov/Archives/edgar/data/0000796343/000079634326000147/adbeex991q326.htm), not a press release.

That's after the outcry. It's also after Canva did something wild: in October 2025 it made Affinity, a genuinely professional Photoshop/Illustrator/InDesign competitor, **completely free**. It hit [3 million downloads in 33 days](https://petapixel.com/2025/12/03/affinity-hits-3m-downloads-of-its-new-editing-software-in-just-33-days).

A free, polished, pro-grade alternative. Massive anger at the incumbent. And the incumbent's revenue still grew double digits.

Sony's CFO said the disc backlash is having ["no impact on our business"](https://www.pushsquare.com/news/2026/07/we-are-not-seeing-any-impact-on-our-business-sony-says-physical-disc-backlash-is-having-zero-effect). In fairness, that quarter ended *before* the announcement, so the real test is Sony's results in November. Watch that one.

And the vibe-coded replacements? There's exactly one high-profile attempt, an open-source suite cloning Photoshop, Premiere and friends, released this month. Its creator calls it "super early alpha". It has tens of thousands of GitHub stars, but almost as many forks as stars, which is odd and could mean the numbers are inflated. Nobody has shown it being used for real work yet.

The outcry is real. The exodus isn't showing up.

---

## Starting Is Cheap. Finishing Isn't.

Here's the part I find most interesting, because it's about *how AI coding actually behaves*.

AI is genuinely great at the first 80%. Small project, clear spec, fresh codebase, and you'll fly. Every study agrees on that part.

The trouble is the last 20%, and three findings tell that story better than any opinion:

**1. Rebuilding real software from scratch still fails.** A 2026 benchmark called [ProgramBench](https://arxiv.org/abs/2605.03546) asked top AI models to rebuild 200 real programs, from small tools up to things like FFmpeg and SQLite. Nine models. **Zero programs fully rebuilt.** Not one.

**2. "Passes the tests" ≠ "good enough to ship."** The research group METR took AI-written changes that *passed* a project's own tests and had the maintainers review them. [None of them were mergeable as-is](https://metr.org/blog/2025-08-12-research-update-towards-reconciling-slowdown-with-time-horizons). Every one needed around 40 minutes of human cleanup.

**3. The speed boost fades; the mess stays.** A study of [800 GitHub projects that adopted Cursor](https://arxiv.org/abs/2511.04427) found output spiked in the first month, then the gains disappeared by month three. What stuck around: **42% more code complexity** and 30% more warnings. And more complexity predicted *slower* work later.

Why? Because AI shines when something can automatically check whether it's right: a compiler, a test suite, a benchmark. An image editor is judged on *feel*. Does the brush lag? Is the colour exactly right for print? Does that 2GB PSD from your client open without breaking a layer? No test suite catches those. So the errors pile up quietly.

A Photoshop clone is a weekend to start and a decade to finish. AI shrank the weekend. It barely touched the decade.

---

## Code Was Never the Moat

This is the uncomfortable first principle: **Adobe isn't hard to replace because Photoshop is hard to write.**

GIMP has been free for over 20 years. Free didn't do it. Affinity is now free *and* excellent. That didn't do it either.

What keeps people on Adobe:

- **The file format.** Clients send PSDs. Print shops expect certain workflows.
- **Hiring.** Every designer you hire already knows Photoshop.
- **The studio.** Templates, plugins, ten years of muscle memory, a team that has to stay compatible.
- **The contract.** Enterprises and schools buy seats in bulk, with support and legal cover.

None of that is code. So making code cheap doesn't touch it.

The most-cited counterexample proves the point. Klarna supposedly "replaced Salesforce with AI". Its own CEO later said [they didn't](https://techcrunch.com/2025/03/04/klarna-ceo-doubts-that-other-companies-will-replace-salesforce-with-ai): the hard part was consolidating data, not writing code, and he doubted other companies would copy them.

Same story with Sony: you can't vibe-code your way out of a disc policy or a PlayStation account.

---

## So What Is Actually Changing?

Quite a lot, just not at the top.

**The cheap end of creative work is getting crushed.** After image generators arrived, freelance job posts for image work [dropped about 17%](https://spiral.imperial.ac.uk/entities/publication/88113a91-b994-4717-8526-dadac657f1cb). Logos, placeholder art, quick commissions: anything where "good enough" is enough. The work that's left is more complex and pays better.

There's a twist here. On one Chinese art-commission platform, when an image model leaked, [prices fell 64% but orders more than doubled](https://arxiv.org/abs/2311.07071), and total revenue *rose*. Cheaper art meant way more people buying art. Disruption isn't always shrinkage.

**Juniors are getting squeezed, seniors aren't.** Stanford's ["Canaries in the Coal Mine"](https://digitaleconomy.stanford.edu/app/uploads/2025/11/CanariesintheCoalMine_Nov25.pdf) payroll study found employment for software developers aged 22 to 25 fell about 20% from its 2022 peak. Older developers: flat. Meanwhile software job postings have been [rising since 2025](https://hiringlab.indeed.com/?p=20708), and 71% of that rebound is senior roles. (The authors are careful: not all of this is AI. Interest rates did plenty too.)

That's the real long-term risk. Not mass unemployment, but a broken ladder. If nobody hires juniors, where do the seniors come from in ten years?

**Small, simple software is exposed.** The stuff companies *are* replacing with AI-built tools is internal dashboards, admin panels, forms and simple workflow automation. The $15/month tool that does one thing is in trouble. The system a whole company runs on isn't.

**Pricing is where incumbents actually bleed.** If AI agents do work humans used to do, companies need fewer seats. Software stocks lost [25 to 58% in early 2026](https://www.longangle.com/alts-education/software-ai) on exactly this fear, while revenues kept growing. Adobe's stock is down roughly 40% from its peak despite record sales. Investors aren't seeing customers leave; they're betting on future pricing pressure. Expect a lot more "pay per AI action" and a lot less "pay per person".

---

## Who Wins

Not the angry hobbyist with a weekend and a prompt. At least not against Photoshop.

The players actually taking ground from Adobe are **other big companies giving professional tools away**: Canva with Affinity, Blackmagic with DaVinci Resolve. Free and polished beats free and half-finished, and it's backed by a company that will still be maintaining it in five years.

Vibe coding does win in the places that matter to *you*:

- **Your own tools.** The internal app nobody would ever sell you, built in an afternoon.
- **The long tail.** Niche software for twelve people that never made economic sense before.
- **Prototypes.** Proving an idea works before anyone spends real money on it.

That's a real revolution. It just happens underneath the incumbents, not on top of them.

---

## What Would Prove Me Wrong

I'd change my mind if:

- Adobe starts disclosing that its paid subscriber count is falling. Right now it doesn't publish that number at all, which conveniently hides any churn behind price rises.
- A vibe-coded creative tool shows real professional usage. That means active users at studios, not GitHub stars.
- Sony's November results show the disc boycott biting.

Until then, the evidence says: **AI made starting software almost free, and finishing it about as expensive as ever.** Anyone predicting the death of the incumbents is mixing those two up.

The revolution is real. It's just happening at the bottom of the market first.
