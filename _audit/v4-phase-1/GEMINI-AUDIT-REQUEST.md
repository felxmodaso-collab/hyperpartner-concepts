# GEMINI CRITICAL AUDIT — v4 Phase 1 (Foundation + Hero)

Ты senior art director + senior frontend critic из awwwards-tier студии. Я только что закончил Phase 1 v4 HyperPartner — foundation + hero + HERO TOGGLE + palette switcher A/B/C.

**Цель сайта (клиент явно сказал):** «потрясающий сайт, продуманный до мелочей, с ВАУ дизайном, кастомные анимации, **лучше Mahadeva и подобных топовых сайтов** (awwwards SOTD)».

Я хочу от тебя **АГРЕССИВНУЮ КРИТИКУ**, не валидацию. Не пиши «выглядит неплохо». Пиши что бы ты разорвал в первый день в студии уровня Active Theory / Ueno / Resn / Locomotive.

## ИСТОЧНИКИ для оценки

Прочитай все 5 screenshots в этом каталоге `_audit/v4-phase-1/`:

1. **`desktop-A.jpeg`** — fullPage screenshot, тема A (cream paper), viewport 1440×900
2. **`desktop-A-viewport.jpeg`** — viewport-only desktop A
3. **`desktop-B.jpeg`** — fullPage тема B (layered dark)
4. **`desktop-C.jpeg`** — fullPage тема C (hybrid alternation)
5. **`mobile-A.jpeg`** — fullPage mobile 390×844 тема A

Также прочитай код:
- `v4/index.html` (полный HTML)
- `v4/css/style.css` (полный CSS)
- `v4/js/main.js` (полный JS)

Также сверь vs обещанный план `_brief/V4-FULL-PLAN-V2.md` + `_brief/HERO-TOGGLE-DETAILS.md`.

## ОТКРЫТЬ И ПОСМОТРЕТЬ (если есть возможность, WebFetch)

- https://www.framer.com/marketplace/templates/mahadeva/ — наш baseline-конкурент (ниже чем awwwards SOTD, но мы должны быть выше неё)
- https://www.awwwards.com/sites_of_the_day/ — последние SOTD за май 2026
- https://sidewave.it/ — концептуальный близнец «chaos → order»
- https://www.anthropic.com/ — палитра-twin (warm-paper)

## ЧТО ОЦЕНИТЬ — каждому пункту равное внимание (НЕ сортировать на критичное / не критичное)

### A. HERO COMPOSITION
- Баланс text/video/toggle на desktop — норма или хаос?
- Иерархия зрения: где первый delight-момент, куда тянет глаз?
- HERO TOGGLE — выглядит ли как «вау-фишка» или как viewport-ed widget?
- Layered overlay читаемости: scrim слева работает или текст «приглушает» chevron-glow?
- Дыхание (whitespace) на desktop — там много пустоты слева снизу?

### B. HERO ON MOBILE (`mobile-A.jpeg`)
- Текст «технологии.» «результат.» поверх яркого chevron — читаем или сливается?
- HERO TOGGLE **полностью скрыт на mobile** (display:none) — это **ошибка**: клиент в макете var1_27 имел toggle как центральную фишку. Где его место на mobile?
- Sticky CTA bar внизу — он там? Не наезжает на бегущую строку отделов?
- Mobile mask «rhythm strips» (как в v3) — он применен в v4 или нет?
- Стек «Отчёт / Дашборд / SMS / Аналитика / Экспорт / База / Уведомление» внизу видео = это **labels из старого видео**, а в DOM ничего? Это duplicate-noise?

### C. PALETTE SWITCHER (тематический A/B/C)
- Hero в темах A/B одинаковый (всегда dark с видео). Только палитра ниже секций меняется. Это OK или клиент не поймёт «зачем свич если hero не меняется»?
- В теме C alternation работает только для **следующих секций**, hero не меняется. Это OK?
- Подпись «ТЕМА» рядом с dots — Gemini раньше рекомендовал hover-only / убрать. Что лучше?

### D. ТИПОГРАФИКА
- H1 «Мы не продаём технологии. Мы внедряем результат.» — высота line-height 0.92 — не слишком плотный? Сравни с awwwards SOTD стандартом.
- Mix thin (200) + bold (800) — баланс? Anti-AI?
- Stats `180+ / 7× / 40%` mono+display — выглядит дёшево / прилично / премиум?

### E. PALETTE & MATERIALS
- Сразу видно «warm-paper» feel в теме A?
- Brand pattern (diagonal stripes peach+cream+teal) — НЕ применён в Phase 1. Должен быть? Где?
- Logo (peach chevron + cream HYPERPARTNER) — раскрыт в navbar или потерян?

### F. ANIMATIONS / MOTION (по коду)
- Hero intro staggered — нормальный timing или AOS-template?
- HERO TOGGLE — `View Transitions API + FLIP fallback` имплементирован. Работает ли smooth?
- Custom cursor — есть, реально полезен или мешает?
- Lenis smooth scroll — подключен (desktop only). Достаточно?
- Stats counter — animated, но видны только если ждать. ScrollTrigger-trigger нужен (запуск при появлении в view)?

### G. PLACEHOLDER PHASE 2
Внизу — пустая dashed-bordered секция «[Phase 2] Здесь будут 3 карточки...». Это **видно** клиенту что недоделано. Должно быть `display:none` пока Phase 2 не готов? Или лучше уже что-то базовое поставить?

### H. INTERACTIVITY (Code level)
- Hero TOGGLE work? Switch chaos↔benefits?
- Palette switcher работает? Persist через localStorage?
- Loading screen — фейк-counter 2.2s, потом dissolve. Работает или зависает?
- Chameleon nav — переключается state top↔scrolled, over-light↔over-dark?

### I. ПРОПУСКИ vs ПЛАНА (V4-FULL-PLAN-V2.md)
Что обещано но не сделано в Phase 1?
- WebGL bridge / SVG mask blinds — НЕТ (это Phase 6 globals)
- ScrollTrigger / hero exit pin+scrub — НЕТ (нужен или нет на Phase 1?)
- Magnetic CTA — есть, проверь работает ли
- Custom cubicbezier easing — есть в CSS, использовано везде?

### J. ВЕРДИКТ
- Vs Mahadeva: 1-10 численная оценка с обоснованием
- Vs awwwards SOTD: 1-10
- Что нужно **ДО** Phase 2 — конкретный нумерованный список fix'ов
- Что можно отложить на Phase 6 (final polish)

## ФОРМАТ ОТВЕТА

Сохрани отчёт в `_audit/v4-phase-1/GEMINI-AUDIT-PHASE-1.md`. Минимум 1500 слов, агрессивный tone, без смягчений. После этого audit-а я буду фиксить Phase 1 — НЕ переходить в Phase 2 пока ты не напишешь «production-grade, hero baseline лучше Mahadeva».
