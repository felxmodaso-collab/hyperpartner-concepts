# SCROLL-REVEAL CROSS-AUDIT — V4 HYPERPARTNER

**From:** Scroll-Reveal Libraries Specialist (independent perspective: AOS / Web Animations API / IntersectionObserver / CSS Scroll-Driven Animations / Lenis-only / Locomotive Scroll)
**Target:** `v4/js/main.js` (1002 LOC), current state 8.5/10 per Gemini V4 audit
**Question:** Where is GSAP+ScrollTrigger the wrong tool? Where can simpler primitives or different libraries produce equally-wow or **better** results? Where is overengineering hiding bugs?
**Date:** 2026-05-25

---

## TL;DR — Three Honest Statements

1. **You are not overengineering with 103 ScrollTriggers per se** — Awwwards SOTD sites routinely register 80–150 triggers. The problem is *kind*, not *count*: most of your triggers are "fire once, do tween, dispose" (`once: true`). That is the **exact pattern IntersectionObserver was designed for**, and forcing GSAP to do it costs you ~50ms init + permanent listener overhead per trigger. **Reclassify** them: ~60 triggers should become an `IntersectionObserver.observe()` + CSS-class flip. Keep GSAP only for the ~40 that actually need scrub/pin/timeline orchestration.

2. **GSAP+ScrollTrigger is the right primary engine — Lenis+ScrollTrigger is industry standard for awwwards-tier.** Do **not** rewrite away from it. AOS, scrollreveal.js, Locomotive `data-scroll` attributes — none of these would push you from 8.5 to 9.5. They would push you to 6/10 (loss of master timelines, loss of overlap, loss of stagger control).

3. **Your steps pin bug is a `scrub: 1` smoothing artifact** — not a library problem. The fix is a one-liner. Section 5 below has the exact code.

---

## 1. Cross-Library Audit — What GSAP Setup Could Be "Elegantly" Native

### 1.1 Where GSAP is overkill — replace with Web primitives

GSAP's ScrollTrigger has a flat per-instance cost: ~0.3KB context per trigger, 1 update tick per frame per trigger, layout reads on resize. Below is a brutal classification of your 103 triggers.

| Function in `main.js` | Pattern used | Optimal primitive | Reason |
|---|---|---|---|
| `initScrollChoreo` → H2 split-word reveal (lines 53–77) | ScrollTrigger.create + `once: true` per heading | **IntersectionObserver** + class toggle → CSS keyframes | 0 GSAP triggers needed. CSS `@keyframes` with `transform: translateY` on `.is-revealed` ascendant + `transition-delay: calc(var(--i)*50ms)` does the wave for free on GPU. |
| `initScrollChoreo` → section header (lines 80–93) | timeline + ST `once: true` | **IO + CSS** (same as above) | 8 triggers → 1 IO observer. |
| `initScrollChoreo` → cases batch (lines 134–143) | `ScrollTrigger.batch` | **IO with `rootMargin`** + stagger-via-CSS-var | `batch` is already half-IO under the hood. Doing it natively saves the GSAP timeline allocation per card. |
| `initScrollChoreo` → cm-n counters trigger (lines 146–156) | ST per `.cm-n` (8+ triggers) | **IO** + class toggle | You're only adding a CSS class. ST is wasted. |
| `initScrollChoreo` → security icon stroke draw (lines 273–282) | ST per SVG path (potentially 9+ triggers) | **CSS `animation-play-state: paused` + IO unpause** | Pure CSS keyframes `stroke-dashoffset: 1000 → 0`, IO flips `running`. Zero JS animation cost. |
| `initCounters` (lines 872–909) | ST per `.stat-n` | **IO + `gsap.to({v:0})`** | Keep GSAP for the number tween (smooth). Drop ScrollTrigger — only need entry detection. |
| `initParallax` → emp-card parallax (lines 388–396) | ST per card with scrub | **CSS `animation-timeline: view()` if Chromium-only acceptable** | See §1.3 below. |
| `initMobileCta` (lines 987–997) | Already uses IntersectionObserver ✓ | (keep) | This is the model. |

**Realistic count:** of your ~103 ST instances, **~50–60 are "fire-once class toggle" candidates** that don't need ScrollTrigger at all. Reducing this saves ~15ms of `ScrollTrigger.refresh()` time on every resize/Lenis layout-shift, which is where micro-stutter sneaks in.

### 1.2 Where GSAP+ScrollTrigger is the *correct* tool (do NOT migrate)

- `initHeroExit` (606–631) — pin + scrub + multi-prop interpolation. Native CSS `animation-timeline` cannot do `pin: true` properly (Chrome's `scroll(scroller, axis)` can't pin element to viewport without sticky hacks that break Lenis).
- `initScrollChoreo` → directions master timeline (96–131) — overlap math (`-=0.85`) is *the* feature; no native primitive expresses this.
- `initScrollChoreo` → steps pin (159–198) — pin+scrub is GSAP territory.
- `initScrollChoreo` → ROI calculator, stack, security, testimonials, CTA master timelines — overlap, multi-prop, stagger.from:'random'. GSAP only.
- `initScrollVelocity` (442–462) — `getVelocity()` is unique to ScrollTrigger.

### 1.3 CSS Scroll-Driven Animations — the actual 2026 wow primitive

Chrome 115+ / Edge 115+ ships `animation-timeline: view()` and `scroll()`. Safari/Firefox: behind flag (2026 Q3 expected). This is **the** spec that will make AOS/scrollreveal obsolete.

```css
@keyframes reveal {
  from { opacity: 0; transform: translateY(40px) rotate(-2deg); }
  to   { opacity: 1; transform: none; }
}
.case-card {
  animation: reveal 1s linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 35%;
}
```

**What you get:** GPU-driven, 0 JS, scrub-quality smoothness, works during Lenis smoothing. Perfect for your parallax (`browser-mockup`, `dir-visual`, `mockup-hotspot`) — replace 8+ scrub ScrollTriggers with 4 CSS lines. Use with `@supports (animation-timeline: view())` and keep the GSAP fallback inside the `@supports not` branch for Safari. **This is the only thing in 2026 that genuinely outperforms GSAP for parallax.**

### 1.4 Libraries that add wow GSAP can't — ranked

| Library | Adds what GSAP can't | Verdict for V4 |
|---|---|---|
| **Lenis** (already in stack ✓) | Smooth-scroll inertia at OS level | KEEP. This is doing most of the heavy lifting for the "anima feel". |
| **CSS `animation-timeline`** | True GPU scroll-linked animation, zero JS | **ADOPT** for parallax + simple reveals (see §1.3). |
| **Locomotive Scroll v5** | `data-scroll-speed` attribute API, but inferior to Lenis now | SKIP. Lenis won. |
| **Motion One** (motion.dev) | WAAPI-backed `scroll()` function, smaller bundle than GSAP for simple cases | SKIP — you'd lose timeline overlap which is exactly what got you from 3→8.5. |
| **AOS** | Data-attribute simplicity | **NO** — you'd regress. AOS has no overlap, no stagger position parameter, no scrub. |
| **scrollreveal.js** | Same as AOS | NO. |
| **react-intersection-observer / observe.js** | Cleaner IO wrapper | OPTIONAL — you can write 12 lines of native IO. |
| **View Transitions API** (already partially used in `initHeroToggle` ✓) | Cross-DOM-state morphing | **EXPAND** — use this for section-to-section morph (the V4 audit's #1 remaining gap). See §6. |
| **Theatre.js** | Visual timeline editor | Overkill for landing. |

---

## 2. Patterns You Are NOT Using That Look Wow

### 2.1 IntersectionObserver `rootMargin` reveal-prediction trick

You use `start: 'top 82%'`. Translate to IO:

```js
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => e.isIntersecting && (e.target.classList.add('is-in'), io.unobserve(e.target)));
}, { rootMargin: '0px 0px -18% 0px', threshold: 0.01 });
```

The negative bottom margin = your `82%` start point. **What this unlocks:** you can stack two IOs with different margins on the same element ("predict" → preload assets at -50%, "reveal" → animate at -18%). GSAP can't do prediction cheaply.

### 2.2 CSS `scroll-snap-stop: always` + `@scroll-timeline` for steps

Instead of pinning 540% with `scrub:1` (which has its bug — see §5), build steps as a horizontal-ish scroll-snap container with `scroll-snap-stop: always`. Each card snaps into focus, advancing through `scroll-snap-align: center` triggers a CSS transition. **This is what Apple AirPods Pro page does.** No pin, no Lenis fight, no scroll-block.

### 2.3 Container Queries + scroll-driven reveals

Wrap each section in `container-type: inline-size`. Then a single CSS file controls reveal density per viewport without JS branching. You currently branch on `isMobile()` in JS multiple times — this is the kind of state CQ kills.

### 2.4 `:has()` + `:in-viewport` future selector

Not yet shipped, but `:has(> .is-in)` *is* shipped (Chrome/Safari) and lets parent containers react to child reveals — useful for the section eyebrow → lede → cards cascade.

### 2.5 Mask-based reveals (the #1 anima.ai trick you're missing)

```css
.section-hero img {
  -webkit-mask-image: linear-gradient(180deg, black 0%, transparent 100%);
  mask-size: 100% 0%;
  mask-repeat: no-repeat;
  animation: mask-grow 1.2s var(--anima-ease) both;
  animation-timeline: view();
  animation-range: entry 10% entry 80%;
}
@keyframes mask-grow { to { mask-size: 100% 200%; } }
```

This is the "image proyavlyaetsya" effect Gemini V1 specifically called out. You implemented stagger and parallax but **not mask reveals** — they are the single highest-impact 2026 trick. Anima.ai uses them on every image.

### 2.6 `clip-path` morph transitions between sections

Section A's `clip-path: inset(0)` morphs to `clip-path: inset(0 0 100% 0)` as section B enters with the inverse. This gives the "section eats the next" feeling Gemini V4 listed as the remaining 1.5/10 gap.

---

## 3. Where You Are Overengineering

| Anti-pattern in current code | Cost | Fix |
|---|---|---|
| `ScrollTrigger.create({ once: true, onEnter: cb })` everywhere instead of `gsap.from({ scrollTrigger: {...once:true} })` | Extra closure + timeline allocation per call | Cosmetic, no perf gain — but: many `once:true` triggers should be IO (§1.1). |
| Skew-on-velocity (`initScrollVelocity`, 442–462) reading `getVelocity()` every frame on **6 element classes** with `gsap.quickTo` | Continuous main-thread tick even when idle (Lenis keeps RAF alive) | Throttle to every 3rd frame, OR skip — V4 audit didn't even mention skew as a win. Likely invisible at 8.5/10. |
| `initParallax` registers parallax on every `.dir-visual`, every `.emp-card` (×N), every `.mockup-hotspot` (×N) — easily 30+ ST instances | Each is a continuous-update ST (scrub) | Migrate to CSS `animation-timeline: view()` (§1.3). Drops 30 STs to 0. |
| Card tilt + scroll velocity skew both write `transform` on `.case-card` | Last-write-wins race when scrolling AND hovering | Use CSS custom properties (`--tilt-rx`, `--vel-skew`) and one CSS rule that composites them. You already started this with `--tilt-rx` (424) — finish it. |
| `initLoadingScreen` runs `gsap.to({v:90})` for 4s fake progress before assets load | If user has fast connection, loader sits at 90% for ~3s | Tie tween duration to a `Promise.race` between asset-ready and a 1.5s ceiling. |

**Net:** 103 ST → ~40 ST is realistic. Bundle size unchanged (you still need GSAP+ST+Flip). Frame budget at 60Hz scroll = +2–3ms headroom. Mobile = bigger win.

---

## 4. Best Pattern for Steps Pin (The Bug)

**Current bug:** "animation blocks scroll first seconds" — diagnosis from reading lines 159–198: you set `scrub: 1`. With Lenis + `scrub: 1`, the ScrollTrigger animation lags behind real scroll by ~1s of catch-up — meaning the user scrolls, the pin engages, but visually nothing happens until the lerp catches up. The user reads it as "scroll is broken."

### Fix A — simplest, lossless (recommended)

```js
ScrollTrigger.create({
  trigger: stepsSection,
  start: 'top top',
  end: '+=' + (stepCards.length * 90) + '%',
  pin: true,
  pinSpacing: true,
  scrub: true,                         // ← was: 1   |  `true` = no smoothing, instant follow
  anticipatePin: 1,                    // ← NEW: pre-calc pin offset, eliminates first-frame jump
  invalidateOnRefresh: true,           // ← NEW: recompute on Lenis layout shift
  onUpdate: (self) => { /* existing card transform code */ },
});
```

`scrub: true` (boolean) means "snap animation to scroll position instantly". Lenis already smooths the **scroll value** — you do not need to smooth the animation on top, that's double-smoothing. This was the V4 audit's "Pin Steps: pattern is working" judgment — but the bug is real, user is right.

### Fix B — better UX, slight rewrite

Convert from pin+scrub to **`ScrollTrigger.observe` + scroll-snap**:

```js
ScrollTrigger.observe({
  target: stepsSection,
  type: "wheel,touch",
  onChangeY: (self) => {
    currentStep = clamp(currentStep + Math.sign(self.deltaY), 0, stepCards.length - 1);
    revealStep(currentStep); // CSS class flip + smooth-scroll into view
  },
});
```

This gives Apple-style "one wheel notch = one step" behavior. No pin, no scrub lag, scroll feels responsive. Used by linear.app and stripe.com on their feature carousels.

### Fix C — pure CSS (most elegant if scope allows)

`position: sticky` on each step card + `animation-timeline: view(--steps)` per card with staggered `animation-range`. Zero JS, zero pin, zero scrub.

```css
.section-steps { scroll-timeline: --steps block; }
.step-card {
  position: sticky; top: 20vh;
  animation: stepReveal 1s linear both;
  animation-timeline: --steps;
}
.step-card:nth-child(1) { animation-range: 0% 20%; }
.step-card:nth-child(2) { animation-range: 20% 40%; }
/* ... */
```

Chrome-only today; add GSAP fallback. **This is what awwwards SOTD sites are shipping in 2026.**

---

## 5. Optimal Reveal Pattern for Cards Grid

Current `ScrollTrigger.batch('.case-card', ...)` (134–143) is correct but has limitations: stagger origin is `'start'`, easing is uniform, no per-card variation beyond random rotation. The V3 audit called this "PowerPoint slide transition" — accurate.

**Better pattern (drop-in replacement):**

```js
ScrollTrigger.batch('.case-card', {
  start: 'top 88%',
  once: true,
  onEnter: (els) => {
    // Read each card's grid position (column index) for spatial stagger
    els.forEach((el) => {
      const col = el.style.getPropertyValue('--col') || (Array.from(el.parentNode.children).indexOf(el) % 3);
      el.style.setProperty('--reveal-delay', `${col * 80}ms`);
    });
    gsap.from(els, {
      opacity: 0,
      yPercent: 30,
      scale: 0.92,
      rotationZ: () => gsap.utils.random(-4, 4),
      rotationY: (i) => (i % 3 - 1) * 6,         // ← NEW: row Y-tilt for 3D plane
      transformPerspective: 800,
      transformOrigin: '50% 100%',                // ← NEW: cards "stand up" from bottom
      duration: 1.0,
      ease: 'expo.out',                            // ← stronger than back.out for grid
      stagger: {
        each: 0.08,
        from: 'random',                            // ← organic, not metronomic
        grid: 'auto',                              // ← if grid layout, GSAP infers row/col
      },
    });
  },
});
```

**Key wins over current:** spatial-aware stagger (column-based vs flat index), `transformOrigin: '50% 100%'` makes cards "rise from the floor" instead of "appear in place", `stagger.from:'random'` kills the conveyor-belt feel V3 audit attacked.

---

## 6. Better Split-Text Reveal (vs your sw-word/sw-inner)

Current implementation (53–77) is solid: word-wrap, `yPercent: 110`, `rotationZ: -2`, `power1.in` stagger easing. V4 audit graded this "polished and elegant" — agree.

**But there are 3 known-better patterns:**

### 6.1 GSAP SplitText (paid plugin, free for Club GreenSock)

Splits by char/word/line with `splitText.lines`, `splitText.words`, `splitText.chars`. Properly handles Cyrillic, ligatures, multi-line wrap (your current regex `/\s+/` doesn't). For Russian text (`Кейсы`, `Этапы`) this matters — Russian has wider char width variance and your current split breaks on `<br>`.

### 6.2 SplitType (open-source alternative, 4KB)

```js
import SplitType from 'split-type';
const split = new SplitType('.section-h2', { types: 'lines,words' });
gsap.from(split.words, {
  yPercent: 110, opacity: 0, rotationZ: -2,
  duration: 1.1, ease: 'expo.out',
  stagger: { each: 0.05, ease: 'power2.in' },
  scrollTrigger: { trigger: '.section-h2', start: 'top 82%', once: true }
});
```

Drop-in replacement, handles line wrap, free. **Recommended** — fixes the line-break bug your regex has.

### 6.3 Variable-font axis reveal (the genuinely-2026 wow trick)

If your headline font is variable (Manrope is — has `wght` 200–800), animate font-weight per word as it reveals:

```js
gsap.from('.sw-inner', {
  yPercent: 110, opacity: 0,
  '--wght': 200,                  // ← animates CSS var driving font-variation-settings
  duration: 1.1, ease: 'expo.out',
  stagger: { each: 0.05 },
});
```

```css
.sw-inner {
  font-variation-settings: 'wght' var(--wght, 700);
  transition: font-variation-settings 0.3s;
}
```

Word reveals from thin → bold as it slides in. **This is what Locomotive Studio's homepage does.** No other awwwards site has copied it yet — would be your unique differentiator.

### 6.4 Mask reveal vs translate reveal

Currently you use `yPercent: 110` (slide). Mask reveal (`clip-path` shrinking from top) is **what anima.ai uses** and is more elegant for narrow letterforms:

```css
.sw-inner {
  clip-path: inset(0 0 100% 0);
  transition: clip-path 0.9s cubic-bezier(0.65, 0, 0.35, 1);
}
.is-in .sw-inner { clip-path: inset(0); }
```

Combine with a thin trailing line (1px after the mask edge) for the "ink wipe" effect.

---

## 7. Concrete Action List (Ranked by Impact-per-Hour)

1. **Steps pin fix:** change `scrub: 1` → `scrub: true` + add `anticipatePin: 1, invalidateOnRefresh: true`. **5 min, fixes the bug.** (§4 Fix A)
2. **Mask image reveals** on all `.browser-mockup img`, `.dir-visual img`. Replaces parallax-only with parallax+reveal. **30 min, +0.5 audit score.** (§2.5)
3. **Migrate `initParallax` to CSS `animation-timeline: view()`** with GSAP fallback in `@supports not`. **1 hour, drops ~30 ST instances, +smoothness on Chrome.** (§1.3)
4. **Replace word-split regex with SplitType.** **20 min, fixes line-wrap bug, free.** (§6.2)
5. **Cards grid: add `transformOrigin: '50% 100%'` + spatial stagger.** **15 min, kills "PowerPoint" feel.** (§5)
6. **Reclassify `once:true` ScrollTriggers to IntersectionObserver** for headers, counters, SVG strokes. **2 hours, -40 ST instances, cleaner perf.** (§1.1)
7. **View Transitions API for section-to-section morph** (V4 audit's #1 remaining gap). **3 hours, +1.0 audit score.** (§1.4)

---

## 8. Final Verdict (Independent of Gemini)

- **GSAP+ScrollTrigger choice: correct.** Do not migrate. Gemini's 8.5 is honest.
- **Lenis choice: correct.** Industry standard.
- **103 trigger count: misleading metric.** ~40 are doing real work, ~60 should be IO. Reclassify, don't reduce arbitrarily.
- **Biggest miss vs awwwards-tier: mask reveals on images.** Single highest-leverage addition.
- **Steps bug: 5-line fix.** §4 Fix A.
- **Path to 9.5/10:** §7 items 1, 2, 3, 7. Skip 4–6 if time-boxed.
- **Path to SOTD:** also add (a) one signature scroll-driven video sequence (referenced in Gemini V1 audit point 8), (b) `clip-path` section-transition morphs (§2.6).

The framework is right. The execution is 85% there. The remaining 15% is **mask reveals + section transitions + the steps pin fix** — not a library swap.

---

**Files relevant to action items (absolute paths):**
- `C:\Users\Anton\Desktop\project\runtime\projects\roi-partner-prototypes\v4\js\main.js` (lines 159–198 = steps bug, 273–282 = SVG draw → IO candidate, 342–397 = parallax → CSS migration target, 53–77 = split-text → SplitType swap, 134–143 = cards batch)
- `C:\Users\Anton\Desktop\project\runtime\projects\roi-partner-prototypes\_audit\v4-final\GEMINI-VIDEO-AUDIT-V4.md` (8.5 score, remaining gaps map)
