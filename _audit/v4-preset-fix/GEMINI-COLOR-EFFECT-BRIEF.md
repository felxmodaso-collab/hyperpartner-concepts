# GEMINI BRIEF — Color Direction + Animation Pipeline (HyperPartner v4)

**Дата:** 2026-05-25
**Запрашивает:** Anton через Claude
**Цель:** второе мнение по двум критическим решениям v4

---

## Контекст проекта

HyperPartner — российская enterprise-компания, B2B AI/RPA + предсказательная аналитика. ЦА: руководители компаний и IT-директора в РФ. Сайт = премиум landing уровня Awwwards SOTD.

**Hero концепт-07 (утверждён клиентом):** chaos слева → chevron-portal по центру → structure справа (10 curves к 10 pill-labels: CRM/Отчёт/Дашборд/SMS/Аналитика/Экспорт/База/Уведомление/Статистика/Архив).

Текущее состояние: `runtime/projects/roi-partner-prototypes/v4/`. Локальный preview на `http://127.0.0.1:8788/index.html`.

## Эволюция палитры (3 итерации)

| Версия | Палитра | Anton's reaction |
|--------|---------|------------------|
| **V4** (initial) | Pure black bg + peach `#E8A878` accent + teal | "скудные и некрасивые" |
| **V5** (Dark Luxury) | Warm onyx + gold `#D4B068` + emerald + pearl-ice glow | "не моё, верни тёплый персик но как neon" |
| **V6** (current — Gallery Neon Midnight) | Deep midnight navy `#131A2A` + warm peach NEON `#E8A684` + cream-warm body | под оценку |

V6 inspired by Anton's reference image: галерейная инсталляция — peach neon line на тёмно-сапфировой стене. Тёплое свечение, cream caption, dark gallery wall.

## Запрос 1 — палитра-критика

Оцени V6 (Gallery Neon Midnight) для B2B AI/RPA enterprise ниши:

1. **Подходит ли** deep midnight navy + warm peach neon для CFO/IT-директоров? Не выглядит ли это "слишком галерейно" / недостаточно serious?

2. **Альтернативы**:
   - Sapphire deeper (`#0A1322`)?
   - Petrol-blue более насыщенный?
   - Cool вариант (тёмно-синий + ice-blue neon)?

3. **OKLCH палитра** (текущая V6):
   ```
   --c-midnight:     oklch(0.18 0.04 250)  #131A2A
   --c-midnight-3:   oklch(0.28 0.05 245)  #252B40  (cards)
   --c-peach-neon:   oklch(0.78 0.10 38)   #E8A684  (PRIMARY accent)
   --c-peach-glow:   oklch(0.92 0.06 45)   #F6D7C1  (halo)
   --c-cream-warm:   oklch(0.94 0.025 75)  #EFE4CC  (body text)
   --c-pearl-cool:   oklch(0.92 0.025 230) #DDE7F0  (rare cold counter)
   ```

4. **Glow strategy** — neon под фото:
   ```css
   .photo-glow::before {
     background: radial-gradient(ellipse at center,
       var(--c-peach-glow) 0%,
       rgba(232, 166, 132, 0.55) 22%,
       rgba(232, 166, 132, 0.20) 50%,
       transparent 75%);
     filter: blur(64px);
     animation: peach-breathe 7s ease-in-out infinite;
   }
   ```
   Это правильное направление? Альтернативы (iridescent? duotone tint? mix-blend?)?

5. **Вопрос темы 'C' (Hybrid):** работают ли cream-warm секции на чередовании с midnight? Не "переход в template" ли?

## Запрос 2 — animation pipeline

Текущий hero использует `hero-desktop.mp4` (17MB, 8s loop) — Veo-сгенерированное видео всего hero. **Проблема Anton'а:**
- "Сама анимация довольно не очень"
- 17MB = тяжело
- Лучший workflow: **NanoBanana** static frames → **Veo** между ними → **overlay only the effect**, не full video

### Возможные подходы:

**Подход A — Static base + canvas effect overlay**
- NanoBanana Pro 4K: статичный hero с chevron+curves+pills (1 image, ~1MB JPEG)
- Canvas/SVG поверх: only animated particles + glow pulse на chevron + curve flow
- Размер: ~1MB image + ~50KB canvas JS = массовое уменьшение

**Подход B — Two-frame Veo morph**
- NanoBanana: frame 1 (chaos start state) + frame 2 (structured end state)
- Veo: animate between these 2 frames (2-3s loop)
- Видео тоньше (только transformation, не all content)
- Размер: ~5-8MB

**Подход C — Effect-only video с alpha**
- NanoBanana: static base (chevron + curves)
- Veo: render only **particles + chevron glow pulse** with alpha channel (WebM с transparency)
- DOM: base = static image, video on top = effect only with `mix-blend-mode: screen`
- Размер: ~3-5MB video + 1MB image

### Вопросы

1. Какой подход reasonable для премиум-уровня + reasonable budget (~2-3 Veo generations + 2-3 NanoBanana)?
2. **Технические риски** каждого:
   - Canvas/SVG (A): performance на mid-tier mobile? GPU bottleneck?
   - Two-frame morph (B): достаточно ли drama в 2-3s loop?
   - Effect-only with alpha (C): browser compat WebM alpha?
3. **NanoBanana prompts** — что должно быть на base frame? Все 10 curves+pills? Только chevron+chaos? Что добавлять через canvas?
4. **Veo prompts** — какой instruction даст most-cinematic motion?
5. Альтернатива: **Rive** (vector animation runtime, ~50-200KB binary) — даст ли это лучшее качество с меньшим size?

## Constraints

- **Mobile critical:** перформанс на iPhone 14 / Android mid-tier (Samsung A53). Lighthouse Mobile ≥ 80.
- **Лимит budget:** 2-3 NanoBanana Pro 4K + 2-3 Veo 3.1 generations.
- **Awwwards-tier:** не "AI demo" feel — должно работать как часть нарратива, не accidentally generated.

## Формат ответа

Для каждого запроса (1 и 2) — структурированный анализ с конкретными цифрами/файлами/prompts. Не воду.

---

## Как Claude может прогнать это в Gemini

```bash
# Через invoke_gemini.sh wrapper (RELAY pattern):
bash ~/Desktop/project/utils/invoke_gemini.sh \
  runtime/projects/roi-partner-prototypes/_audit/v4-preset-fix/GEMINI-COLOR-EFFECT-BRIEF.md \
  runtime/projects/roi-partner-prototypes/v4/

# Или напрямую через gemini CLI:
gemini --model 2.5-pro \
  --file _audit/v4-preset-fix/GEMINI-COLOR-EFFECT-BRIEF.md \
  --output _audit/v4-preset-fix/GEMINI-RESPONSE.md
```

Anton решает кому/как делегировать.
