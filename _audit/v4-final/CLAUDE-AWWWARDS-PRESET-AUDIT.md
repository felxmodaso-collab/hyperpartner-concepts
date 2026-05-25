# CLAUDE — Independent v4 Audit с применением Awwwards-tier пресета

**Date:** 2026-05-25
**Reviewer:** Claude (cold start, новый сессия)
**Skills applied:** `awwwards-aesthetic-direction` + `visual-restraint` + `mobile-reimagining`
**Inputs:** BRIEF.md, concept-07-hybrid-v2 reference, fullpage-desktop-A.jpeg, 01-mobile-portrait-after-intro.jpeg, AWWWARDS-DIRECTION.md, CLAUDE-AUDIT.md (24.05), GEMINI-FINAL-AUDIT.md (24.05)
**Покрытие:** независимая оценка через свежий пресет + сравнение двух предыдущих аудитов

---

## TL;DR

**vs Mahadeva: 7/10**
**vs Awwwards SOTD (May 2026): 5.5/10**
**Ship-ready: НЕТ.**

Соглашаюсь с Claude harsh-audit (24.05) НЕ с Gemini Final (9/10 / SHIP-READY). Gemini проявил типичный "тёплый closer" паттерн — описанная в memory `dual_audit_claude_plus_gemini` blind spot.

**Главный архитектурный дефект:** концепт-07 (одобренный клиентом hero) воспроизведён **частично**. Левая половина (bokeh-облако частиц) + центр (шеврон-портал) есть, **правая половина (10 curves + 10 pills "куда летит результат") заменена на HERO TOGGLE с 6 pain-карточками** — это совершенно другой UX-паттерн. Главный визуальный месседж бренда "хаос → порядок через структурированный результат" подан неполно.

---

## §1. Hero concept-fidelity — критический разрыв

Сопоставление `concept-07-hybrid-v2.png` (одобрено клиентом) ↔ desktop fullpage v4:

| Элемент concept-07 | v4 desktop | Оценка |
|--------------------|-----------|--------|
| LEFT 30% bokeh peach+cream particles | Есть (через video) | ✓ |
| CENTER chevron-portal glowing | Есть | ✓ |
| RIGHT 40%: **10 elegant curves → 10 pill-labels** | ❌ Заменено на HERO TOGGLE 6 pain-cards | ✗ |
| Bottom-right "CHAOS TO ORDER" mono | Не вижу | ✗ |
| Top-left "HYPERPARTNER" mark | Есть | ✓ |
| Top-right "AI/RPA · 2026" | Заменено на nav + CTA "Демо за 25 мин" | ≈ |

Конкретно: концепт-07 — **outbound** визуал (показывает что СДЕЛАЕТ платформа). Сайт v4 — **inbound** (показывает БОЛЬ заказчика через toggle). Это два разных value-prop. Заказчик утвердил outbound, дизайн собран на inbound.

На mobile portrait (01-mobile-portrait-after-intro.jpeg) полоса pills "→ КУДА ЛЕТИТ РЕЗУЛЬТАТ" (CRM/Отчёт/Дашборд/SMS/Аналитика...) **появилась** — это попытка воспроизвести концепт. Но:
- Pills обрезаются справа (horizontal overflow без affordance)
- Это **только mobile** — на desktop их нет

**Fix-direction:** вернуть outbound визуал из concept-07 как hero-baseline. HERO TOGGLE с pain-cards переместить в section 02 или сделать collapsed-by-default в hero и развернуть скроллом.

---

## §2. Peach restraint — нарушено

Я насчитал **минимум 11 peach-точек** на одном экране desktop:

1. HYPERPARTNER логотип шеврон
2. "Демо за 25 мин" CTA fill
3. Eyebrow dot peach
4. H1 accent "результат." peach
5. CTA "К расчёту прибыли" fill
6. 3× stats "+×%" знаки (180+/7×/40%)
7. 3 emp-cards rotation hint dots
8. peach circles hotspots на mockup screenshot
9. Step 02 peach highlight + glow
10. ROI calculator background peach band
11. "Бесплатный пилот" peach pulse

Editorial Locomotive direction (на mcalpinehouse) допускает **3 peach max/screen**. Моя цель из `visual-restraint`: 1 primary + 1 accent + neutrals. Сейчас peach работает как primary + accent одновременно — что делает его невидимым (если он везде — он нигде, см. правило в `visual-restraint`).

**Fix:**
- Logo + ONE H1 accent + ONE active CTA = только 3 peach/screen
- Stats `+×%` → `--c-teal` (deep accent, less screaming)
- Hotspot pulses → static peach circles (no pulse)
- ROI calc → backgrounded в cream, не peach

В AWWWARDS-DIRECTION.md этот fix уже описан (Move 3), но screenshot показывает что **не применён**.

---

## §3. Browser-mockup frames — AI-template signal

Directions 02 (Geely Cityray landing) и 03 (Dashboard) обрамлены mac-стиль `traffic dots + URL bar`. Это `palevo`-тег "сделано AI" — массово используется во всех landing-templates 2023-24. Awwwards SOTD 2025-26 (Stripe, Vercel, Linear, Cursor) уходят от этого паттерна в сторону:

- Full-bleed image без рамки (Vercel)
- Минималистичная outline-рамка без mac-dots (Linear)
- Editorial photography с figcaption (Stripe)

Anton: `feedback_no_false_completion` — это и есть false-completion signal в design layer.

**Fix (из AWWWARDS-DIRECTION Move 5):** editorial-image pattern с figcaption peach-number. Готовый CSS уже в документе direction.

---

## §4. Typography — 4 шрифта = нарушение superfamily-правила

Используется: **Bricolage Grotesque + Inter + JetBrains Mono + Fraunces**.

Gemini final назвал это "Symphony of Four Voices" — это poetic, но это **anti-pattern** против `visual-restraint`:

> "Одна superfamily по умолчанию. Используй superfamily — один дизайнер/фаундри = гарантированная гармония. Никогда 3+ шрифта."

4 шрифта от 4 разных дизайнеров = no superfamily, no guaranteed harmony. Awwwards SOTD сайты используют 1-2 семьи максимум:
- mcalpinehouse: Tiempos + GT Walsheim (2)
- Linear: Inter + Berkeley Mono (2)
- Cursor: CursorGothic + JetBrains Mono (2)
- Mahadeva: Söhne family только (1, через variants)
- Sidewave: GT America family (1)

**Fix (выбор):**
- Drop Inter — Bricolage Grotesque отрабатывает workhorse body тоже
- Или drop Bricolage — оставить Inter Display/Tight + Fraunces + Mono
- Или взять superfamily: IBM Plex Sans + Serif + Mono (3 связанных = гарантия)

Если бренд требует именно Bricolage (для шеврон-кинетики "HYPERPARTNER" — она хорошо работает), выкинуть **Inter**: Bricolage достаточно readable для body на 16-17px.

---

## §5. Mobile-reimagining audit

Применяю свежий `mobile-reimagining` к 01-mobile-portrait-after-intro.jpeg:

### Bug-list

**B1 (critical):** Floating "← к выбору вариантов" overlay перекрывает HYPERPARTNER логотип в top-left. UX-кардинальный сбой — главный brand-mark скрыт overlay-навигацией. Перенести в bottom-left FAB или сделать `position: fixed; right: 16px; top: 16px` (на стороне CTA "Демо").

**B2 (critical):** Pills "КУДА ЛЕТИТ РЕЗУЛЬТАТ" обрезаются по правому краю без horizontal scroll affordance. Юзер не понимает что pills прокручиваются. **Fix:**
- `scroll-snap-type: x mandatory` + `scroll-padding-left: 16px`
- Gradient-mask peach справа: `mask-image: linear-gradient(90deg, black 80%, transparent 100%)`
- Dot-indicator снизу с количеством pages
- Или вертикальный list если pills ≤8

**B3 (concept-fidelity):** На concept-07 — 10 pills (CRM/Отчёт/Дашборд/SMS/Аналитика/Экспорт/База/Уведомление/Статистика/Архив). На mobile screenshot вижу только 5 (CRM/Отчёт/Дашборд/SMS/Аналитика). Где остальные 5?

### Положительное

✅ Шеврон-портал занимает 2/3 viewport — cinematic, концепт-точно
✅ H1 "Хаос на входе. Порядок на выходе." — читаем, hierarchy выдержана
✅ CTA "ПОСЧИТАТЬ ROI" + "КАК ЭТО РАБОТАЕТ" — touch targets ≥48px
✅ Eyebrow "7 083 АССИСТЕНТОВ" — proof point above-fold
✅ Lede в трёх строчках — читается без horizontal scroll

### Тиры (свежий `mobile-reimagining`):

- Tier HIGH (desktop): video hero ✓
- Tier MID (current mobile): video hero — but **17MB asset за 8s 1080p** = slow on 3G/4G. Нужен capability detection:
  - `navigator.connection?.saveData` или `effectiveType === '3g'/'2g'` → fallback на single PNG (concept-07-hybrid-v2.png 4K → resized 1080w WebP ~200KB)
  - Lazy-load video только когда intersection > 50%
- Tier LOW: PNG-only, без motion

Сейчас vertical-tier фолбэк **не реализован** → возможен баг "медленно загружается" на 3G.

---

## §6. Что Gemini Final пропустил

Сравнение Gemini Final ↔ моя независимая оценка:

| Gemini сказал | Моя независимая оценка |
|---------------|------------------------|
| "Hero TOGGLE confident centerpiece" | Hero TOGGLE — отвлекающий вторичный фокус, конкурирует с H1 |
| "Browser mockups perfectly executed" | Browser mockups = AI-template cliche, нужно editorial photography |
| "Symphony of Four Voices" | 4 шрифта нарушают superfamily-rule |
| "Subtle pattern overlay 3% — right call" | 3% невидимо вообще, opacity нужна 6-8% или убрать |
| "Mobile masterclass" | Mobile есть критический B1 (overlay над logo) + B2 (pills обрезаны) |
| "Stack visually engaging" | Stack — text-таблица 3-column. Real SVG logos нет |
| "Custom SVG icons resounding success" | Security icons — generic shield/target/gear. Lucide-tier, не bespoke |
| "Footer ghost wordmark sublime flex" | Opacity слишком low, не виден на screenshot |
| "9/10 vs SOTD, SHIP-READY" | 5.5/10 vs SOTD, NOT SHIP-READY |

Gemini Final игнорирует **концепт-07 fidelity completely** — это самый крупный пропуск. Он оценивает что **есть** vs то что **одобрено клиентом**.

---

## §7. Действительные расхождения с Claude harsh-audit (24.05)

Claude harsh аудит дал 12 fix'ов. Я полностью **подтверждаю** 10 из 12:

✓ #1 Hero composition (двуядерность) — да, и concept-fidelity
✓ #2 Cases carousel affordance — да
✓ #3 Direction 01 emp-cards → mini-tool — да
✓ #4 Stack text-pills → real SVG logos — да
✓ #5 Browser mockups → editorial photography — да
✓ #6 Brand pattern opacity 3% → 6-8% — да
✓ #7 Testimonials avatars → real photos — да
✓ #8 Palette switcher hero реактивность — да
✓ #10 Security bespoke icons — да
✓ #11 Hero scroll hint animated — да
✓ #12 Footer ghost opacity higher — да

⚠ #9 Hero exit pin+scrub: я предлагаю **сначала** решить concept-fidelity (вернуть 10 curves + 10 pills как outbound визуал) до того как тратить время на pin choreography

⚠ Добавляю свои:
- **B0 (новое):** концепт-07 right-side 10 curves+10 pills восстановить (это base-level fidelity, не polish)
- **B1 (новое):** mobile overlay над logo — bug
- **B2 (новое):** mobile pills overflow без affordance
- **T1 (typography):** drop one font (4 → 3 или 4 → 2)
- **T2 (palette):** peach overuse — restraint до 3 per screen

---

## §8. Приоритизация fix'ов

> Согласно `feedback_all_critical_no_priority`: "На production-проектах ВСЁ критично." Однако последовательность работ важна — concept-fidelity до polish.

### Sequence (логический порядок):

**Step 1 — Concept-fidelity (B0):**
- Восстановить 10 curves + 10 pill-labels из concept-07 как outbound визуал на desktop
- Hero TOGGLE с pain-cards переместить в section 02 или сделать collapsed by default
- Mobile pills: scroll-snap + indicator + все 10 pills присутствуют

**Step 2 — Mobile bugs (B1, B2):**
- Fix overlay над логотипом
- Add scroll affordance + gradient-mask на pills
- Capability detection для video → PNG fallback

**Step 3 — Visual restraint:**
- Peach: 11+ → 3 elements/screen
- Stats `+×%` peach → teal
- Hotspots: pulses off

**Step 4 — Editorial direction execution:**
- Cards: shadow → hairline borders
- Browser mockups → editorial photography (figcaption pattern)
- Edition number "— №&nbsp;NN" на section heads
- Loader concept "ХАОС/ПОРЯДОК" — это уже есть, оставить

**Step 5 — Typography restraint:**
- 4 шрифта → 3 (Bricolage + Fraunces + Mono, drop Inter)
- Или 4 → 2 (IBM Plex Sans + Serif superfamily)

**Step 6 — Content placeholders:**
- Testimonials: запросить real photos у клиента (правильный design treatment пока нет)
- Stack: real SVG logos (TensorFlow/OpenAI/Python/Claude/LangChain через simple-icons.org)
- Stack table → isometric/layered architectural visual

**Step 7 — Polish:**
- Custom cursor simplify (Move 7)
- Footer ghost opacity 4 → 6-8%
- Section 02 hero exit pin+scrub
- Security bespoke иконки

---

## §9. Финальный вердикт

**Vs Mahadeva: 7/10** (выше функциональности, ниже визуальная identity)
**Vs Awwwards SOTD May 2026: 5.5/10** (Editorial direction есть но не доведён, concept-fidelity нарушена)
**Ship-ready: НЕТ. Минимум Step 1+2+3 до показа клиенту.**

Ключевое: Gemini-аудит typical "warm closer" — типичный паттерн (memory `dual_audit_claude_plus_gemini` это и описывает). Я бы **не отправлял** клиенту в текущем виде.

Time to fix Step 1+2+3 (concept-fidelity + mobile bugs + restraint): 6-10 часов фокус-работы.

После Step 1+2+3 — следующая итерация v5 + повторный dual-audit (Claude + Gemini), синтез.

---

## References

- BRIEF.md (брифинг клиента)
- AWWWARDS-DIRECTION.md (моё предыдущее direction-решение)
- CLAUDE-AUDIT.md 24.05 (harsh audit, 4/10 SOTD)
- GEMINI-FINAL-AUDIT.md 24.05 (warm closer, 9/10 SOTD)
- concept-07-hybrid-v2.png (utвержд клиентом)
- fullpage-desktop-A.jpeg (текущий desktop)
- 01-mobile-portrait-after-intro.jpeg (текущий mobile)
- Memory: `feedback_dual_audit_claude_plus_gemini.md`, `feedback_visual_review_before_report.md`
