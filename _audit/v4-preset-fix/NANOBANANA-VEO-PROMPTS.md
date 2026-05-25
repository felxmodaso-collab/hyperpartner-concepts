# Asset Generation — NanoBanana + Veo prompts

**Purpose**: production-ready prompts для генерации hero animation + section gateways.
**Brand palette**: `#143A3A` deep teal + `#E8A878` peach + `#F4ECDD` cream + `#BDD8C9` sage.
**Aesthetic**: премиум B2B AI/RPA, awwwards-tier cinematic, не AI-демо feel.

---

## 1. Hero replacement — `hero-desktop.mp4` (5-8 sec loop)

Текущее видео 17MB, Anton: "довольно не очень". Заменяем на **2-frame morph** через Veo.

### NanoBanana Pro 4K — Frame 1 (chaos start)
```
Premium cinematic enterprise B2B AI vision. Deep teal background #143A3A.
Left third: dense cloud of warm peach #E8A878 particles in bokeh DOF (sizes vary,
soft glow halos). Mid-frame center: glowing peach chevron portal symbol slightly
out of focus, just starting to ignite. Right two-thirds: dark teal void, no curves
yet. Atmosphere: hushed, anticipatory. No people, no text. Cinematic, 16:9, 4K.
Awwwards-grade aesthetic, premium, architectural precision.
```

### NanoBanana Pro 4K — Frame 2 (structured end)
```
Same brand palette teal #143A3A + peach #E8A878. Center: large sharp peach chevron
portal fully ignited, radial halo glow expanding. Right: 10 elegant curves emerging
from chevron, each tipped with bright peach dot — curves spread upward and downward,
even spacing. Left: chaos particles partly absorbed into chevron (still some bokeh,
less density). Atmosphere: revelation, order from chaos. 16:9, 4K, cinematic.
```

### Veo 3.1 — Hero loop (uses two frames above)
```
Start with [frame-1].png. End with [frame-2].png. 4-second loop.
Camera: completely static, no shake or movement.
Motion: peach particles drift inward toward center, curves draw outward from chevron
in graceful arcs (no spirals, no zooming), chevron glow grows smoothly. Subtle
particle parallax. Loop ENDS exactly matching frame 2. No camera motion at all.
```

Budget: 2× NB Pro 4K + 1× Veo = ~3-4 generations.

---

## 2. Section gateway videos (4 короткие 2-3s loops)

Вместо tex-only section dividers — small embedded WebM (≤3MB each) с alpha channel.
Положение: между секциями hero→directions, directions→cases, cases→steps, stack→testimonials.

### Gateway-01 — directions intro
**NB Frame**: 3 abstract icon plates floating in deep teal, peach edge glow.
**Veo**: peach particle stream forms 3 icon outlines (employees / personalization / analytics), fades to peach line connecting them.

### Gateway-02 — cases reveal
**NB Frame**: stacked card silhouettes in perspective.
**Veo**: cards rotate from edge-on to face-on with peach edge highlights.

### Gateway-03 — ROI accumulation
**NB Frame**: scattered numbers floating in space.
**Veo**: numbers convergence and snap into ROI dashboard composition (peach glow on key totals).

### Gateway-04 — stack architecture
**NB Frame**: 6 horizontal plates in 3D perspective с logos faded in middle.
**Veo**: plates light up sequentially from L1 to L6, gold/peach light pulse runs through architecture.

Budget: 4× NB Pro 4K + 4× Veo = ~8-9 generations.

---

## 3. Optional — photo halos generation

For testimonials section (4 portrait photos pending от клиента). Once Anton receives real photos:
- run each through NB enhance + add subtle peach glow halo via brush
- export at 800×800 with `.photo-glow` class wrapper

---

## 4. Integration после генерации

После того как Anton сгенерит assets:

1. Положить файлы:
   ```
   v4/assets/
   ├── hero-desktop-v2.mp4    (~4-6MB)
   ├── hero-desktop-v2-poster.jpg
   ├── gateway-01.webm        (~2-3MB each)
   ├── gateway-02.webm
   ├── gateway-03.webm
   └── gateway-04.webm
   ```

2. Заменить hero `<video data-src-desktop>` на новый файл.

3. В каждый `.section-divider` добавить `<video>` lazy-load (intersection observer):
   ```html
   <div class="section-divider" data-gateway="01">
     <video class="gateway-video" muted loop playsinline preload="none"
            data-src="assets/gateway-01.webm"></video>
   </div>
   ```

4. JS init (есть будет добавлен) — lazy-attach `src` при intersection ≥30%, autoplay.

5. CSS добавит `.gateway-video` с object-fit cover, mix-blend-mode lighten.

---

## Бюджет суммарно

- **NanoBanana Pro 4K**: 6-10 generations (~$10-15)
- **Veo 3.1**: 5-8 generations (~$15-30)
- **Total**: $25-45 для full cinematic asset set

---

## Команды для Anton

NanoBanana Pro 4K через `/digital-artist` skill или прямо через NB API:
```bash
# через ai-image-gen skill:
# (см. ~/.claude/skills/ai-image-gen)
# или через локальный wrapper если есть API key
```

Veo 3.1 через Google Gemini CLI:
```bash
gemini --model veo-3.1 --image frame-1.png --image frame-2.png \
  --prompt "$(cat veo-hero-prompt.txt)" \
  --duration 4s --output hero-desktop-v2.mp4
```

После генерации — пришли files в `v4/assets/`, я подключу.
