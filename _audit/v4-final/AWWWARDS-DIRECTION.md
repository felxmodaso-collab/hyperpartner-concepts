# AWWWARDS AESTHETIC DIRECTION — HyperPartner v4

**Date:** 2026-05-25
**Skill applied:** awwwards-aesthetic-direction
**Status:** Direction NOT explicitly chosen ранее — это первопричина subpar результата.

## Cross-check: какая studio-direction ближе

| Direction | Studio refs | Fit | Reasoning |
|-----------|-------------|-----|-----------|
| **Editorial / Locomotive** | mcalpinehouse.com, scoutmotors.com, Locomotive.ca | **70%** | Warm cream canvas ✓, dramatic Fraunces serif italic ✓, generous section rhythm ✓, editorial photography negative space ❌ (we use browser-mockup frames), hairline borders ❌ (we use shadows) |
| Cinematic 3D / OFF+BRAND | landonorris.com, igloo.inc | 30% | Dark canvas ❌ (we're warm-paper), 3D scroll ❌ (we use video), Rive UI ❌ |
| Bold Editorial / abeto | messenger.abeto.co | 25% | WebGL sphere centerpiece ❌ (we have video), minimal UI ❌ (lot of UI) |
| Minimal Premium / basement.studio | basement.studio, vercel.com | 40% | Monochrome ❌ (we have 4-color palette), Geist sans ❌ (we use Bricolage), sharp edges ❌ (we use 14-22px radius) |
| **Experimental / Immersive Garden** | mont-fort.com, immersive-garden.com | **55%** | Magnetic CTAs ✓, kinetic typography (split-word) ✓, custom loader ✓ (КАЛИБРОВКА), WebGL transitions ❌, bold accent (orange/magenta/lime) — мы peach ≈ |
| Dark Luxury / Antinomy | learn.metamask.io, antinomy.studio | 20% | Deep warm-dark ❌, premium serif ✓, restrained 3D ❌ |

## РЕШЕНИЕ: Editorial / Locomotive (primary) + Experimental moves (secondary)

**Direction name:** «Editorial Tech Studio»

**Reference sites:**
1. **mcalpinehouse.com** — warm cream paper + dramatic Tiempos serif + hairline borders + large negative space. Главный baseline для секций «направления», «кейсы», «отзывы».
2. **scoutmotors.com** — modern Locomotive-style scroll choreography, editorial photography, generous typography. Reference для hero exit choreography + steps pin.
3. **mont-fort.com** — magnetic interactions + kinetic typography + concept-driven loader. Cross-reference для micro-interactions.
4. **anima.ai** — мой текущий baseline для motion polish (это уже в _audit/v4-final/ref-anima-scroll.webm).

## Key характеристики которые я воспроизвожу

1. **Warm-paper canvas** `#F4ECDD` ✓ (уже сделано)
2. **Dramatic serif typography**: Fraunces italic ✓ (уже есть, надо использовать БОЛЬШЕ)
3. **Hairline borders, NO shadows** — ❌ сейчас у меня `var(--shadow-card)` на cards. **Fix:** заменить shadows на 1px borders + минимальный shadow только на pin focal points (Step 02 highlight).
4. **Generous 80-120px section rhythm** — ❌ сейчас `clamp(5rem, 10vh, 8rem)` = max 128px, может быть тoo tight на больших screens. **Fix:** bump до `clamp(6rem, 12vh, 10rem)` минимум.
5. **Single brand accent (rare, restrained)** — ❌ peach используется ВЕЗДЕ (logo, eyebrow, dots, numbers, headlines accent, hotspots, hover borders). **Fix:** оставить peach ТОЛЬКО на 2-3 elements per screen — accent word в H1, magnetic CTA primary, hot moment в каждой секции.
6. **Editorial photography с large negative space** — ❌ browser-mockup frames «убивают» photo. **Fix:** убрать mockup frame на directions 02/03, оставить full-bleed images с margin around (как mcalpinehouse).

## Ловушки (что НЕ делать)

1. **НЕ magazine 4-column layout** — у меня horizontal scroll-snap для cases. ✓ OK
2. **НЕ scroll-jacking** — у меня **Steps pin section блокирует scroll** ⚠ возможный conflict с Locomotive philosophy. Тем не менее Pin sequences допустимы в Editorial (mcalpinehouse использует), но 540% scroll слишком много. **Fix уже applied** — сократил до 360% + anticipatePin: 1.
3. **НЕ Bento layout без причины** — у меня нет Bento, ОК.
4. **НЕ "Welcome to HyperPartner"** — у меня «Мы не продаём технологии. Мы внедряем результат.» ✓
5. **НЕ purple→blue gradient** — у меня НЕТ gradients (только cream-paper bg). ✓

## КОНКРЕТНЫЕ MOVES чтобы попасть в Editorial Tech Studio direction

### Move 1: Replace shadows → hairline borders (cards)

**Где:** `.case-card`, `.sec-card`, `.tst-card`, `.s10-form`, `.roi-card-calc`, `.dir-roi`, `.emp-card`.

**Сейчас (CSS):**
```css
.case-card {
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border);
}
```

**Locomotive way:**
```css
.case-card {
  box-shadow: none;
  border-top: 1px solid var(--c-teal);     /* hairline top only */
  border-bottom: 1px solid rgba(20,58,58,0.1);
  background: transparent;                  /* paper through */
}
.case-card.is-hovered { border-color: var(--c-peach); }
```

Только Step 02 «Бесплатный пилот» сохраняет drop shadow + glow (focal point conversion-step).

### Move 2: Section rhythm — генеральная пауза

**Сейчас:** `padding: clamp(5rem, 10vh, 8rem) 0`
**Locomotive:** `padding: clamp(6rem, 14vh, 12rem) 0` + первая секция после Hero получает дополнительные `margin-top: 6vh` для air после pin exit.

### Move 3: Single peach accent per screen

**Сейчас:** в hero 8+ peach elements (logo, eyebrow dot, "результат." accent, 3 stats plus signs, pulse on dot, toggle track, hotspot pulse).
**Locomotive:** оставить **3 peach elements max** per screen:
- Logo HYPERPARTNER (constant)
- ONE accent word in H1 ("результат." с peach)
- ONE active interactive element (toggle track / магнитный CTA)

Stats `+×%` → переместить на `--c-teal` (less screaming).
Hotspot pulse → убрать pulse, оставить static peach circles.
Eyebrow dot → убрать pulse animation (constant 4px dot).

### Move 4: Fraunces italic — усилить роль

**Сейчас:** только stats numbers + H3 accents (направления) + testimonials quotes.

**Усиление:**
- Loader tagline «хаос → порядок» — italic уже, OK
- Каждая section eyebrow — добавить `<em class="serif-accent">N</em>` для number (01, 02, 03...) → italic Fraunces
- Footer ghost wordmark «HYPERPARTNER» — italic вариант (text-style)
- ROI calculator → outputs значения (3,2 мес / 2 700 ч / 750к ₽) уже Fraunces italic ✓

### Move 5: Photography negative space — replace mockup frames

**Сейчас:** browser-mockup рамка (mac-dots + URL) обрамляет каждый screenshot в direction 02/03. Это "AI template feel" cliché.

**Locomotive:**
```html
<!-- Before: <figure class="browser-mockup"><div class="mockup-bar">...</div><img></figure> -->
<!-- After: -->
<figure class="editorial-image">
  <img src="..." alt="..." loading="lazy">
  <figcaption class="editorial-caption">
    <span class="caption-num">01</span>
    <span class="caption-text">Geely Cityray landing — generated in 30 seconds.</span>
  </figcaption>
</figure>
```

```css
.editorial-image {
  position: relative;
  padding: 8% 0;            /* generous negative space around */
}
.editorial-image img {
  width: 100%;
  border-radius: 4px;        /* almost square */
}
.editorial-caption {
  margin-top: 1.5rem;
  display: flex; gap: 12px;
  font-family: var(--f-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
  font-style: italic;
}
.caption-num { color: var(--c-peach); font-weight: bold; }
```

### Move 6: Editorial section title pattern

**Сейчас:** eyebrow с peach dot + H2 split-text.

**Locomotive way** — добавить "edition number" pattern:
```html
<header class="ed-section-head">
  <span class="ed-edition">— №&nbsp;03</span>
  <h2 class="ed-title">
    <span class="ed-italic">«</span>Дашборды<span class="ed-italic">»</span><br>
    с диалоговым AI
  </h2>
  <p class="ed-deck">Один абзац deck-text (short pitch, не lede).</p>
</header>
```

Где `.ed-edition` — mono small italic, `.ed-italic` — Fraunces italic кавычки большие. Это «editorial issue» feel, не tech-product feel.

### Move 7: Custom cursor stays, но проще

**Сейчас:** circle 8px + ring 36px + difference blend.

**Locomotive way:** только малая точка 6px без ring, и **никакого blend mode** (mix-blend-mode зрительно «дешёвит» на light paper). Hover effect — точка превращается в маленький `+` или peach dot.

```css
.cursor-dot { width: 6px; height: 6px; background: var(--c-teal); }
.cursor-ring { display: none; }
.cursor.is-hovering .cursor-dot { background: var(--c-peach); width: 8px; }
```

### Move 8: Loader concept refinement

**Сейчас:** «КАЛИБРОВКА» + counter + progress bar + chaos→порядок tagline.

**Locomotive way:** концептуальный, не technical. Заменить «КАЛИБРОВКА» на серию слов которые fade in/out:
```
ХАОС.
ПОРЯДОК.
ХАОС.
ПОРЯДОК.
HYPERPARTNER.
```
Каждое слово 0.4s, последнее «HYPERPARTNER» остается + counter 0 → 100. Это concept-driven (как mont-fort), не «loading bar».

### Move 9: Subtle WebGL только в одном wow-moment (Optional)

Если есть время — один subtle WebGL effect между Hero и Section 02 (например, displacement shader на cream-paper transition). Lib: `ogl` (3KB) + один fragment shader.

Не главное. Можно отложить.

### Move 10: DESIGN.md в проект root

```bash
# Возьми ближайший по духу из ~/Sites/awesome-design-md/design-md/
# Кандидаты: Stripe (premium B2B) / Linear (minimal premium)
cp ~/Sites/awesome-design-md/design-md/stripe.md v4/DESIGN.md
# Адаптировать под HyperPartner palette/typography
```

DESIGN.md — это living guide для всех будущих изменений (что accent, что не, какие spacing, etc).

---

## Activation chain after this direction

→ Активировать `visual-restraint` skill (анти-AI чек)
→ Активировать `motion-stack-gsap-lenis` skill (уже сделано через subagent)
→ Активировать `mobile-reimagining` skill (если есть в инвентаре)
→ В корень `v4/` положить DESIGN.md основанный на Stripe / Linear design-md

## TL;DR — 10 conkretных правок чтобы попасть в Editorial Tech Studio

1. Cards: shadow → hairline borders (top + bottom only)
2. Section padding: `clamp(6rem, 14vh, 12rem)`
3. Peach accent: cut с 8+ до 3 elements per screen
4. Stats `+×%`: peach → teal
5. Browser mockup frames → editorial photography с captions
6. Add «— № NN» edition number pattern на каждую section
7. Fraunces italic «кавычки» вокруг key nouns в H2 (как magazine pull-quotes)
8. Cursor: simplify (одна точка, без ring, без blend-mode)
9. Loader: «ХАОС / ПОРЯДОК / ХАОС / ПОРЯДОК / HYPERPARTNER» concept-words instead of «КАЛИБРОВКА»
10. DESIGN.md в root проекта — Stripe / Linear-style adapted

Это direction = «Editorial Tech Studio». Каждая будущая правка должна сверяться с этим документом.
