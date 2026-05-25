# Decision: HyperPartner Palette V5 — Dark Luxury Tech

**Date:** 2026-05-25
**Trigger:** Anton feedback — "цветовые варианты тут скудные и некрасивые"
**Skills applied:** `color-expert` (OKLCH thinking, character harmony) + `refactoring-ui` (60/30/10) + `awwwards-aesthetic-direction` (re-route to Dark Luxury)
**Direction shift:** Editorial Tech Studio (cream paper + peach) → **Dark Luxury Tech** (onyx + emerald + gold + pearl-ice neon)

## Anton's input

> неоновая подсветка (под фото) бело-светло-голубого цвета с переливами,
> тёмно-изумрудный + оттенки,
> золото + оттенки + чёрный + белый,
> + оттенков бежевого + возможно твои дополнения

## Why

Editorial cream-paper direction (v4) недостаточно различим от Mahadeva и Stripe Press — кремовые лендинги стали стандарт 2024-25, потеряли premium-signal. **Dark Luxury Tech** ближе к Antinomy MetaMask, Igloo Inc, Cognitra — direction 6 из `awwwards-aesthetic-direction` skill. Это лучше попадает в enterprise AI/RPA позиционирование (CEO + IT-директоры = "серьёзный сложный продукт").

## Character analysis (Ellen Divers framework)

Не moncharacter — multilayer:
- **Deep** — onyx, emerald (main canvas + structure)
- **Vivid** — gold accents (CTAs, brand mark)
- **Luminous/pale** — pearl-ice (glow halos под фото, key moments)
- **Warm muted** — beige (secondary text, soft surfaces)

Multi-character works для luxury direction где иерархия слоёв сама по себе ритм. Не для editorial/minimal — там был бы slop.

## Palette V5 — OKLCH

### Reference tokens (raw)

| Token | OKLCH | Hex | Note |
|-------|-------|-----|------|
| `--c-onyx` | `oklch(0.16 0.008 60)` | `#1A1714` | warm near-black, 60% canvas |
| `--c-onyx-2` | `oklch(0.22 0.012 80)` | `#25201A` | elevation +1 |
| `--c-onyx-3` | `oklch(0.28 0.015 75)` | `#322B22` | elevation +2 (cards) |
| `--c-emerald-deep` | `oklch(0.32 0.06 165)` | `#1B4538` | deep emerald (sections) |
| `--c-emerald` | `oklch(0.45 0.10 162)` | `#2E6A55` | structural emerald |
| `--c-emerald-mid` | `oklch(0.58 0.11 160)` | `#4D8C73` | accents |
| `--c-emerald-glow` | `oklch(0.75 0.13 158)` | `#87C0A4` | luminous edge |
| `--c-gold` | `oklch(0.78 0.13 85)` | `#D4B068` | **primary accent** (replaces peach) |
| `--c-gold-deep` | `oklch(0.64 0.11 80)` | `#A6873E` | deep gold (hover) |
| `--c-gold-rich` | `oklch(0.55 0.13 75)` | `#8B6920` | dark gold (icon strokes) |
| `--c-pearl-ice` | `oklch(0.94 0.04 230)` | `#D5E5F0` | **neon glow** (под фото) |
| `--c-pearl-bright` | `oklch(0.98 0.02 230)` | `#ECF2F8` | luminous text |
| `--c-beige` | `oklch(0.92 0.025 75)` | `#E8DEC9` | warm cream upgrade |
| `--c-beige-deep` | `oklch(0.78 0.035 70)` | `#C4B595` | satin beige |
| `--c-beige-soft` | `oklch(0.85 0.020 72)` | `#D9CCB1` | muted warm |
| `--c-white` | `oklch(0.99 0 0)` | `#FBFBFB` | off-white |
| `--c-black` | `oklch(0.08 0 0)` | `#0D0D0D` | crisp deep |

### Semantic mapping

| Semantic role | Token |
|---------------|-------|
| `--bg-main` | `--c-onyx` |
| `--bg-elevated-1` | `--c-onyx-2` (sections alt) |
| `--bg-elevated-2` | `--c-onyx-3` (cards) |
| `--bg-section-deep` | `--c-emerald-deep` (key sections) |
| `--text-main` | `--c-pearl-bright` |
| `--text-soft` | `rgba(213, 229, 240, 0.75)` (pearl-ice 75%) |
| `--text-muted` | `rgba(213, 229, 240, 0.5)` |
| `--text-warm` | `--c-beige` (alternative body for emerald sections) |
| `--accent` | `--c-gold` (replaces peach) |
| `--accent-hover` | `--c-gold-deep` |
| `--accent-2` | `--c-emerald-glow` (rare cool accent) |
| `--glow-photo` | `--c-pearl-ice` |
| `--border` | `rgba(213, 229, 240, 0.08)` |
| `--border-strong` | `rgba(212, 176, 104, 0.4)` (gold hairline for emphasis) |

## 60/30/10 Distribution

- **60% — onyx (warm near-black)**: page bg, hero, nav, footer
- **30% — emerald-deep + beige cards + photo surfaces**: directions, cases, stack
- **10% — gold + emerald-glow + pearl-ice**: CTAs, brand marks, key numbers, photo halos, hover states

## APCA verification (16px regular on onyx bg)

| Foreground | Lc | Result |
|------------|----|--------|
| `--c-pearl-bright` (0.98) | ~102 | AAA — body OK |
| `--c-beige` (0.92) | ~95 | AAA — body OK |
| `--c-gold` (0.78) | ~78 | AA — headlines + small accent OK (но не для основной массы body) |
| `--c-emerald-glow` (0.75) | ~73 | AA — large-display only |
| `--c-emerald-mid` (0.58) | ~50 | sub-60 — decoration + icons only |
| `--c-emerald` (0.45) | ~32 | NOT for text — decoration only |

**Правило:** body text — pearl-bright или beige. Headlines — gold или emerald-glow. Emerald body/mid — НИКОГДА не text, только surfaces/decoration.

## Glow strategy — "neon под фото"

Антону хочется pearl halo под фотографиями. Реализация:

```css
.photo-glow {
  position: relative;
  isolation: isolate;
}
.photo-glow::before {
  content: '';
  position: absolute;
  inset: -8% -6%;
  background: radial-gradient(
    ellipse at center,
    var(--c-pearl-ice) 0%,
    rgba(213, 229, 240, 0.45) 25%,
    rgba(213, 229, 240, 0.12) 55%,
    transparent 75%
  );
  filter: blur(56px);
  z-index: -1;
  opacity: 0.55;
  pointer-events: none;
  animation: pearl-breathe 7s ease-in-out infinite;
}
@keyframes pearl-breathe {
  0%, 100% { opacity: 0.45; transform: scale(1); }
  50%      { opacity: 0.68; transform: scale(1.04); }
}

/* iridescent variant — для wow-moments */
.photo-glow-iridescent::before {
  background: conic-gradient(
    from 220deg at 50% 50%,
    rgba(213, 229, 240, 0.5),
    rgba(135, 192, 164, 0.3),    /* emerald-glow whisper */
    rgba(212, 176, 104, 0.25),   /* gold whisper */
    rgba(213, 229, 240, 0.5)
  );
}
```

Используем sparingly: testimonial photos (4 шт), team photo, hero icons key moments. НЕ на ROI calc cards (visual noise).

## Замена peach → gold

Brand chevron (концепт-07) сейчас peach `#E8A878`. Gold `#D4B068` — тонально близок (warm low-chroma), но **luxury-сигнал сильнее**. Это не слом концепта, а upgrade. Подтвердить с клиентом отдельно.

В видео hero — частицы peach. Замена видео — дорого. **Решение:** оставить частицы peach в видео (они уже близки к gold по тону), но в DOM/UI везде использовать gold. Граница "видео тёплое vs UI тёплое золото" = читается как стилистический rhyme, не конфликт.

## Risk

1. **Concept-07 утверждён клиентом с peach.** Если клиент жёстко стоит за peach — pivot back. Но текущая версия с peach не дотягивает (мой harsh-audit + Anton's feedback). Стоит показать V5 как alternative + объяснить почему.
2. **Dark Luxury vs current "trusty enterprise"** — RPA продукт ассоциируется с трудоягой/надёжностью. Dark Luxury может выглядеть "слишком красиво для backoffice". Cмягчающий момент: emerald (изумруд) = wealth/wisdom signal, не frivolous. Gold = solidity.
3. **APCA emerald body fail** — должно быть жёсткое правило "emerald только декор". Если не дисциплина — text будет проседать.

## Next

1. CSS tokens замена в `:root` + новые themes (Theme A = Dark Luxury onyx, Theme B = alt, Theme C alternate)
2. Hero: scrim/text tone update на pearl + gold
3. Section cards re-skin (onyx-3 surface + gold hairline)
4. Photo elements get `.photo-glow` class
5. Logo chevron color → gold
6. Loading screen colors update

После — Playwright screenshots P1.1 step.
