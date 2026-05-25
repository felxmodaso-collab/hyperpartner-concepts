# Audit V2 production (24.05.2026, после применения всех итераций)

## Виды/breakpoints проверены
- Mobile portrait 390×844 (с portrait Veo video) — после intro
- Desktop 1440×900 — после intro
- Laptop 1440×720 (короткий) — после intro

## Что РАБОТАЕТ ✓
- **Видео:** desktop landscape loop (`bg-cropped-loop.mp4`, 3.4 MB, ffmpeg xfade — seamless физически)
- **Видео:** mobile portrait loop (`bg-portrait-loop.mp4`, 6.5 MB, Veo→ffmpeg, semantics chaos-top / chevron-V-down / curves-bottom — правильная portrait reorientation)
- **Counter** «6 950 → 7 042» с live-drift — работает (видно 7 045 в evaluate)
- **Live-activity** в targets — работает (Дашборд подсвечен peach)
- **Targets glass panel** desktop — выглядит ОК
- **Intro animation** — фактически отрабатывает (evaluate показывает opacity:1 для всех элементов)

## Что НЕ работает ❌

### Mobile (390×844)
1. **Hero text визуально не читается** — opacity:1 в DOM, но на ярком video chevron+curves текст cream сливается, не виден. Scrim-gradient не справляется потому что хочет покрыть и chevron-glow в центре, и labels внизу — конфликт.
2. **Nav сломан** — HYPERPARTNER логотип ушёл за viewport влево (виден только «PARTNER»), «← к выбору вариантов» chip перекрывает nav-area.
3. **Targets row под video curves** — `Отчёт`, `Дашборд`, `SMS` плохо читаются над bright video bottom.
4. **Video curves + DOM targets дублируют идею** — на mobile экране оба показывают «labels» — это шум.

### Desktop 1440×720 (короткий laptop)
5. **Скриншот не снят** — навигация перешла к layout перерасчёту, надо переcheck'нуть.

### Desktop 1440×900 (нормальный)
6. **Hero text слева внизу был invisible на ранних рендерах** — фиксил, но требует cross-check после всех изменений.

## Корневая проблема Mobile

**Video composition + DOM overlay дают визуальный мусор в нижней половине экрана:**
- Video bottom 40% = curves+labels от Veo (peach lines + pill shapes)
- DOM bottom 40% = hero-text + targets-panel
- Они **накладываются** на одну и ту же зону → текст и кнопки тонут в video.

Scrim-маска полу-решает, но всё равно компромисс. Любое усиление scrim'а **убивает video** в этой зоне.

## Правильное стратегическое решение

### Вариант A — Разделить зоны (рекомендую)
Mobile video показывает **только верхние 55-60%** (chaos + chevron). Нижние 40% — solid dark background, чисто под DOM (hero text + targets). Никаких накладок, никакого шума.

Реализация: `object-position` сместить, плюс mask-image gradient на video для плавного fade-out нижней части в `#060606`.

### Вариант B — Перерендер mobile video БЕЗ curves
NB+Veo: новая композиция portrait, только chaos сверху + chevron-V внизу (без curves+labels). Curves+labels полностью становятся DOM-elементами под video.

Дольше (2 итерации NB+Veo), но визуально чище.

### Вариант C — Видео внутри chevron-окошка
Video не на весь экран, а внутри framed окошка-картинки сверху (как мой первый mobile вариант, который заказчик отверг). Не возвращаемся.

## Рекомендация
**Вариант A** — быстро, без regeneration видео. Чёткая зональность (video=top, content=bottom). Mask-fade ровно покрывает curves+labels из video, делая нижнюю зону clean для DOM.

## Что нужно сделать дальше (после согласования стратегии)

1. **Mobile vertical zoning:** `mask-image: linear-gradient(180deg, #000 55%, transparent 100%)` на video; hero text + targets в bottom 40% на solid bg
2. **Nav fix:** убрать `back-tests` chip из top-center на mobile (вынести в footer или скрыть), переразместить
3. **Counter visibility:** проверить что после fix текст-зоны еyebrow читается
4. **Desktop short laptop (max-height 720):** проверить screenshot — фикс не должен ломать short height
5. **Только после Mobile зеленый** — переход к плану choreography всех секций

## Файлы
- Screenshots аудита: `_audit/01-06*.jpg`
- Видео: `hero-tests/v2-veo/bg-cropped-loop.mp4` (desktop), `bg-portrait-loop.mp4` (mobile)
- Gemini consult mobile: `_brief-mobile/REC.md`
- Gemini eval предыдущего state: `_brief-eval/EVAL.md`
