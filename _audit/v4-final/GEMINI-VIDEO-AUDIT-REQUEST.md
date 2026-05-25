# GEMINI VIDEO AUDIT — глазами на анимации

Я записал два ВИДЕО для тебя:

1. **`_audit/v4-final/ref-anima-scroll.webm`** — скролл https://anima.ai (awwwards-tier site, baseline для премиум B2B)
2. **`_audit/v4-final/v4-scroll.webm`** — скролл нашего v4 HyperPartner

Оба записаны одинаково: 12-секундный smooth scroll сверху до низа.

## ЧТО НУЖНО

Посмотри **глазами оба видео** и сравни **АНИМАЦИИ**.

Mahadeva (которая нам baseline в первом audit) — теперь клиент сказал что это **тройка** (нижний уровень). Цель — **awwwards SOTD**, anima.ai-уровень.

### КОНКРЕТНЫЕ ВОПРОСЫ для каждого видео:

1. **При появлении секции на скролле** — что происходит? Sections fade in stagger? Pin? Mask reveal? Parallax? Или **просто появляются как HTML без всякой motion**?
2. **Между секциями** — есть ли transitions (mask blinds, video bridges, color morph)? Или просто scroll-jump к next section?
3. **Cards** — анимируются ли они когда входят в view (rotate, scale-up, slide-in, stagger)? Или статичны?
4. **Text** — есть ли split-text reveals, word-by-word, character animations? Или весь блок текста появляется одинаково?
5. **Images / mockups** — parallax на скролле? Mask reveals? Или статичные?
6. **Numbers / stats** — counter-up animations при появлении? Или сразу финальное значение?
7. **Visual rhythm** — где замедления, где ускорения? Pin sections (где scroll стопится на 200%+ для timeline)? Или непрерывный flow вниз?
8. **«Wow moments»** — есть ли surprise interactions, mouse-driven эффекты, особые reveal trigger'ы?
9. **Pacing** — анимации варьируются по характеру (some snappy 0.3s, some slow scrub 2s), или всё одинаково?
10. **Loaders / transitions при mount** — есть ли pre-roll animations?

### СРАВНЕНИЕ:

| Аспект | anima.ai | v4 HyperPartner | Gap |
|--------|----------|-----------------|-----|
| Section reveal | ? | ? | ? |
| Inter-section transition | ? | ? | ? |
| Cards motion | ? | ? | ? |
| Text reveals | ? | ? | ? |
| Stats counters | ? | ? | ? |
| Pin sequences | ? | ? | ? |
| Wow moments | ? | ? | ? |

### ВЕРДИКТ

- Уровень анимаций v4 vs anima.ai — оценка 1-10
- Где конкретно v4 пуст (секции с **0 анимаций**)
- Топ-5 fix'ов которые **обязательны** чтобы выйти на awwards-tier

НЕ хвалить. Не «well done». Прямой агрессивный audit с конкретными timestamp/секциями где провалы.

Сохрани отчёт в `_audit/v4-final/GEMINI-VIDEO-AUDIT.md`. Минимум 1000 слов, без смягчений.
