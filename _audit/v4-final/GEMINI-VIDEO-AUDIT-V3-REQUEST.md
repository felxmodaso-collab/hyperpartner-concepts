# GEMINI VIDEO AUDIT V3 — после применения всех топ-5 fix'ов

Ты только что дал нам 1/10 в `_audit/v4-final/GEMINI-VIDEO-AUDIT.md` со списком обязательных fix'ов. Я применил все:

1. ✅ **Универсальная reveal система** — 103 ScrollTrigger'ов (`v4/js/main.js` функция `initScrollChoreo`)
2. ✅ **Split-text H2/H3** — по словам (sw-word/sw-inner spans), gsap.to(y:0, opacity:1) с stagger 0.04
3. ✅ **Parallax mockups** — `initParallax()` y:-40 scrub:1.2
4. ✅ **Pin section на Steps** — `pin: true` с +540% scroll height, scrub-driven sequential reveal каждого шага (карточки fade-in/scale-up по своей фазе progress)
5. ✅ **Cards stagger + animated stars + counters** — все cards reveal через `ScrollTrigger.batch`

Также:
- ✅ Hero exit `pin: true` (было false)
- ✅ Card 3D mouse-tilt hover на ВСЕХ card elements
- ✅ Footer ghost wordmark parallax (opacity 0.02 → 0.08, translate -5% → -1%)
- ✅ SVG path draw on scroll на steps + security icons

## Видео

Новое: **`v4-scroll-v3-full-animated.webm`** (24M, 16-секундный smooth scroll, recording с loader)

Сравни с **`ref-anima-scroll.webm`** (38M, anima.ai baseline).

## ЗАДАЧА

Посмотри обе глазами и дай **честный новый score**.

Старый score был 1/10 (за loader). Сейчас что? Конкретно:

1. Появление секций — каскадные reveals видны? Stagger? Какие?
2. Split-text H2 — работает word-by-word reveal? Видно «волну»?
3. Mockup parallax — изображения двигаются другой скоростью?
4. Pin Steps section — действительно pins на ~5 viewport height?
5. Cards stagger reveal — карточки появляются по очереди?
6. Animated stats counter — числа crank-up при появлении?
7. Animated SVG stroke — иконки security «прорисовываются»?
8. Hero exit pin — Hero «залипает» и контент fade'ит вниз?
9. Что ещё ОТСУТСТВУЕТ vs anima.ai? Конкретно.
10. Топ-3 next fix'а для перехода с текущего score → 9+/10.

Сохрани в `_audit/v4-final/GEMINI-VIDEO-AUDIT-V3.md`. Объём 800-1500 слов. Агрессивный tone, без смягчений. Хочу видеть РЕАЛЬНЫЙ progress vs original 1/10.

Если в видео не видно анимаций — скажи **где конкретно** не видно. Возможно playwright/chrome-devtools recording не захватывает scroll-driven анимации правильно.
