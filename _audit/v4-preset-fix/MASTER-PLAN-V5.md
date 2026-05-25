# HyperPartner — Master Plan V5 (Полная переработка)

**Date:** 2026-05-25
**Trigger:** Anton: "сайт визуально все еще выглядит слабым, не стильным. переработай дизайн с нуля используя свои скиллы новые! поэтапно!"
**Ground truth recovered:**
- `_brief/assets-from-client/logo-light.webp` — реальный логотип (single arrow chevron + HYPER + PARTNER)
- `_brief/assets-from-client/brand-pattern.jpg` — brand DNA pattern (deep teal + white + peach diagonal chevrons)
- `_brief/assets-from-client/marketing-poster-8-directions.jpg` — marketing material stilistique
- `_brief/flip-images/var1_35-40` — real tech logos client uses (UiPath/TensorFlow/Neo4j/OpenAI/Python/Claude)

**КРИТИЧЕСКАЯ ОШИБКА предыдущих итераций:** Я ушёл от brand palette (deep teal + peach + cream) в Dark Luxury (gold/emerald) → Gallery Neon (midnight navy/peach neon). Anton: "слабо, не стильно". Возврат к **brand DNA**.

---

## Phase 1 — Foundation Reset (СЕЙЧАС)

### 1.1 Логотип correct
- Real logo = **ОДИН острый arrow chevron** (стрелка ►-like, не двойной shevron »)
- Two-color word: **HYPER** (cream/white) + **PARTNER** (peach) — на dark
- На light bg: HYPER (white invisible) + PARTNER (peach) — поэтому в logo-light.webp видно только PARTNER
- SVG path replacement в HTML

### 1.2 Brand palette restoration
```
--c-bg:       #143A3A  (deep teal — primary brand color)
--c-bg-2:     #0F2E2E  (deeper)
--c-bg-3:     #1F4848  (elevation)
--c-cream:    #F4ECDD  (warm cream — primary text on dark, primary surface на light)
--c-cream-2:  #ECE2D0  (darker cream)
--c-peach:    #E8A878  (PRIMARY accent — peach из logo и pattern)
--c-peach-2:  #D89762  (hover)
--c-peach-glow: #F6D7C1 (soft glow halo)
--c-white:    #FFFFFF
--c-sage:     #BDD8C9  (rare cool counter)
```

### 1.3 Animated gradient mesh
Переливающийся градиент — animated conic/radial mesh поверх solid teal. Subtle:
```css
.gradient-mesh::before {
  background: conic-gradient(from 0deg at 30% 40%,
    transparent 0%,
    rgba(232,168,120,0.10) 25%,
    transparent 50%,
    rgba(189,216,201,0.08) 75%,
    transparent 100%);
  filter: blur(80px);
  animation: mesh-drift 20s ease-in-out infinite;
}
```

### 1.4 Brand pattern integration
Использовать `brand-pattern.jpg` как:
- Subtle bg overlay (5% opacity) в специфических секциях
- Decoration на CTA hover
- Transition wipe между секциями

**Deliverable Phase 1:** работающий hero + nav + footer в brand-DNA palette + правильный логотип + animated mesh. Без full content rework.

---

## Phase 2 — Story narrative

### Story arc (7 актов)
1. **Open** — chaos на входе (hero, brand visual)
2. **Promise** — "мы не продаём технологии, мы внедряем результат" + 3 направления (intro)
3. **Proof** — 3 directions detail + browser mockups (Geely, Dashboard)
4. **Validation** — case studies (5 кейсов)
5. **Process** — этапы (6 шагов)
6. **Math** — ROI calculator
7. **Trust** — stack технологий + testimonials + form

Каждый акт имеет:
- **Entry transition** (cinematic gateway 1-2s)
- **Main scene** (content)
- **Exit transition** (morph в следующий)

### Animated mesh поверх всей story
Subtle переливающийся gradient слой над dark bg всей страницы. Один и тот же mesh, разные positions/colors per section.

**Deliverable Phase 2:** story spec + mesh implementation.

---

## Phase 3 — Asset generation (NanoBanana)

Bonneoshibki: одна generation pair = 1 first frame + 1 last frame через NanoBanana Pro 4K.

### Frame pairs (5 pairs)
1. **Hero idle**: first = chaos (peach particles + chevron приближается), last = portal opens (chevron full glow + curves emerging)
2. **Directions intro**: first = solid teal canvas, last = 3 distinct icons emerge с peach trails
3. **Cases scroll**: first = blurred typography, last = 5 cards stacked в perspective
4. **ROI calculation**: first = scattered numbers, last = ROI dashboard аккумулируется
5. **Stack architecture**: first = empty layered grid, last = stack full с logos светящимися

### NanoBanana prompts — общий стиль
```
"Cinematic enterprise B2B AI visual. Deep teal #143A3A background.
Peach #E8A878 accents as light/glow. Warm cream #F4ECDD typography hints.
[SCENE description]. No people. Architectural precision. Awwwards SOTD aesthetic.
4K, sharp, premium tech atmosphere. Bokeh particles peach color."
```

**Deliverable Phase 3:** 10 PNG/JPG frames (5 pairs × 2).

---

## Phase 4 — Veo videos (между frames)

Для каждой pair (first → last) → Veo 3.1 generation 2-3 second loop.

### Constraints
- Effect-only WebM с alpha если возможно (overlay над static base)
- OR full small-area video (только chevron+curves, не fullscreen)
- File size budget: 2-4MB per video × 5 = ~15MB total
- Lazy-load (Intersection Observer)

### Использование в DOM
Видео встроены **между** секциями как "interstitial gateway":
```html
<section class="gateway gateway-hero-to-directions">
  <video class="gateway-video" autoplay muted loop playsinline>
    <source src="assets/gateway-01.webm" type="video/webm">
  </video>
</section>
```

Высота: 30vh — не fullscreen, но визуально весомо. Активируется при `Intersection Observer` (только при scroll в зоне).

**Deliverable Phase 4:** 5 videos + lazy-load impl.

---

## Phase 5 — Section transitions (cinematic, не full scenes)

Inspired by florist-canvas (мой Fleurs проект) — но не самостоятельная сцена, а часть UI.

### Подходы
1. **Mask-clip wipes** между секциями (CSS clip-path animated through scroll)
2. **Displacement shader** через WebGL (1-pass, легкий ~5KB JS)
3. **Brand-pattern motion** — диагональные lines из brand-pattern.jpg animated scroll-tied
4. **3D card flips** между sections (subtle perspective transforms)

### Скиллы из стека
- `three-r3f-drei` — 3D-like card flips
- `motion-stack-gsap-lenis` — scroll-tied wipes
- `shader-effects-library` — displacement on transition zone

**Deliverable Phase 5:** transition library + applied на 6 section boundaries.

---

## Phase 6 — Stack section полная переработка

### Real SVG logos
Использовать `simple-icons.org` или native brand SVG для:
- **TensorFlow** (orange T)
- **OpenAI** (black knot)
- **Python** (yellow + blue snake)
- **Claude** (Anthropic orange star)
- **LangChain** (blue chain)
- **ClickHouse** (orange yellow blocks)
- **UiPath** (blue gear) — automation platform
- **Neo4j** (green blue circles)
- **PostgreSQL** (blue elephant)
- **Sherpa Robotics** (clientовский RPA stack)

### Layout
3D isometric layered architecture diagram (не таблица 6 rows). Layers stack:
- **L1 Infrastructure** (deployment, cloud)
- **L2 Data** (ClickHouse, Postgres)
- **L3 AI/ML** (TensorFlow, OpenAI, Claude, LangChain)
- **L4 Automation** (UiPath, Python)
- **L5 Platform** (HyperPlatform — own product, highlighted)
- **L6 Apps** (Dashboards, Chat)

Каждый слой = 3D plate с logos в perspective. Hover = layer light up + tooltip с описанием.

**Deliverable Phase 6:** rewritten section-stack с real logos + 3D layered visual.

---

## Phase 7 — Polish + scroll choreography без judder

### QA checklist
- [ ] No `pin: true` anywhere
- [ ] No direct `.style.transform/opacity` writes в onUpdate (используем `gsap.quickSetter` или `gsap.set`)
- [ ] Scrub только для path-draws и parallax background — НЕ для content reveals
- [ ] All reveals `once: true`, simple stagger
- [ ] Lighthouse Mobile ≥ 80
- [ ] Performance trace: no long tasks > 200ms

**Deliverable Phase 7:** verified production-ready, no judder.

---

## Sequence + Ownership

| Phase | Ownership | Hours est |
|-------|-----------|-----------|
| Phase 1 | Claude (CSS/HTML) | 1.5 ч |
| Phase 2 | Claude (CSS mesh) + planning | 1 ч |
| Phase 3 | Anton runs NanoBanana, Claude prompts | 0.5 ч prep + render time |
| Phase 4 | Anton runs Veo, Claude prompts + integration | 0.5 ч prep + render time |
| Phase 5 | Claude (CSS clip-path + GSAP) | 2 ч |
| Phase 6 | Claude (logos + 3D layout) | 2 ч |
| Phase 7 | Claude QA + Playwright | 1 ч |
| **Total** | | **~8 ч + render** |

## Risks

1. **NanoBanana / Veo budget** — 5 pairs + 5 videos = 10 generations. Anton has Pro access (per memory `digital-artist-nb2-pro-only`), но quota costs.
2. **Brand-pattern texture** клиента не SVG, не tileable seamlessly — придётся cropping/recreate в CSS.
3. **3D stack layout** перформанс на mid-tier mobile — fallback на 2D с hover-glow.
4. **Anton может pivot еще раз** — это premium project с unclear final taste. Лучше показать Phase 1 + 2 → собрать feedback → дальше.

---

## NEXT — Phase 1 execute

Сейчас иду фиксить:
1. Логотип SVG (single arrow chevron из logo-light.webp)
2. Tokens — back to brand teal + peach + cream
3. Mesh gradient overlay
4. Quick screenshot ▶ Anton feedback ▶ Phase 2
