# GEMINI VIDEO AUDIT V4 — после master timelines + overlap + depth

Прошлый раз ты дал 3/10. Сказал 3 must-fix:
1. **Master easing + overlap** через timeline position parameter (`"-=0.8"`)
2. **Rebuild с scrubbable master timelines** — один master per section
3. **Inject depth** — rotationZ, rotationY, multi-layer parallax

Я применил всё:

### Easings
- Все entrances → `power3.out`
- Heavy transitions → `expo.inOut`
- Playful (cards) → `back.out(1.6)` / `back.out(2.5)`
- Удалил все default linear easings

### Master timelines per section (overlap через position)
- **Directions** — `tl.from(visual, ..., '-=0.5')`, `.from(h3, ..., '-=0.85')`, и т.д. Каждый element overlap-ит previous на 0.3-0.9s
- **ROI** — calc + strats + marquee один timeline с `-=0.7` overlap
- **Stack** — rows + logos один timeline с `-=0.4` overlap
- **Security** — 3 cards с varying rotationZ/Y per card
- **Testimonials** — cards + stars один timeline с `-=0.7` overlap, stars from random
- **CTA** — eyebrow + h2 split + lede + contacts + form один timeline, form `-=0.9` overlap

### Depth & dimensionality
- Cases stagger: `rotationZ` random `(-3, 3)` + scale 0.9 + y 60
- Stack rows: `rotationZ` (-1.5, 1.5) per i odd/even
- Stack logos: `rotationZ` random (-6, 6) + scale 0.7
- Security cards: `rotationY` (10, 0, -10) per card + rotationZ (-3, 0, 3)
- Testimonials cards: rotationZ random + scale 0.94
- CTA form: rotationY 5 + scale 0.97 + x 60
- emp-cards stagger: rotationZ random (-4, 4)

### Multi-layer parallax (deep)
- Browser mockups: `y: -180` (было -40)
- Inner img: opposite `y: 40` + scale 1.06 (other speed)
- Hotspots: `y: -60/-90`, x:8/-8 (random per i)
- Direction visuals: `y: -50/-30` alternate
- emp-cards: `y: -(20 + (i%3)*25)` варьируется per card

### Split-text word reveal (улучшенный)
- `yPercent: 110 → 0`, `rotationZ: -2 → 0`
- Easing changed to `expo.inOut`
- Duration 0.85 → 1.1
- Stagger ease `power1.in` (волной)

## Видео

Новое: **`v4-scroll-v4-master.webm`** (18-секундный smooth scroll)
Сравни с: **`ref-anima-scroll.webm`**

## ЗАДАЧА

Дай **новый score** (старый: 3/10).

Конкретно:
1. **Master timelines** — теперь видна continuous storyline в каждой секции?
2. **Overlap** — анимации перекрываются как у anima.ai (не isolated events)?
3. **Easings** — character motion есть (back.out для playful, expo.inOut для heavy)?
4. **Depth** — rotationZ/Y создают 3D feel?
5. **Multi-layer parallax** — mockups теперь имеют depth?
6. **Split-text** — wave reveal с power1.in stagger?
7. **Pin Steps** — sequential card reveal по progress phases работает?

Где ещё остаются gaps vs anima.ai-tier?

Сохрани в `_audit/v4-final/GEMINI-VIDEO-AUDIT-V4.md`. 600-1200 слов.
