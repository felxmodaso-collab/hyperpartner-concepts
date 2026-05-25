# V3 HARSH AUDIT — HyperPartner Landing
**Дата:** 2026-05-24  
**Аудитор:** Senior Frontend / UX Designer (без смягчений)  
**Сабж:** `runtime/projects/roi-partner-prototypes/v3/` — index.html 731 строк, style.css 1665 строк, script.js 166 строк  
**Сверка с:** `_brief/DESIGN-PLAN-V3.md` (681 строк), `_brief/FULL-ARCH-V3.md` (298 строк), `_brief/CHOREOGRAPHY-PLAN.md` (115 строк), `_brief/FLIP-CONTENT.md` (362 строк)  
**Скриншоты:** `audit_v3/desktop-{01..10}.png`, `audit_v3/mobile-{01..10}.png`

---

## TL;DR (вердикт за 30 секунд)

Это **не лендинг**, это **wireframe в тёмной палитре с одним видео**.  
- 10 секций — все **статичные тёмные карточки** на `#060606` + cream текст. Глаз отдыхает только на кремовом блоке ROI-калькулятора.
- **Скрипт занимает 166 строк** (без скобок и пробелов — 120). Из 6 функций: `setupVideo`, `runIntro` (8 GSAP-туинов фейда), `runCounters` (3 счётчика), `runMagnetic` (2 кнопки), `runMobileCta` (IntersectionObserver), `runBurger` (заглушка с `console.log`). **`ScrollTrigger` загружен 33KB и не использован ни разу** (`window.ScrollTrigger.getAll().length === 0`).
- **ROI-калькулятор — фейк.** Меняешь все 3 `<select>` — все 3 результата (`payback`, `hours`, `budget`) остаются **`~3,2 мес / ~2 700 ч/год / ~750k ₽`**. Подтверждено: `dispatchEvent(new Event('change'))` × 3 = ноль изменений. Никаких listener'ов нет.
- **Tabs на секции "По ролям" — фейк.** Атрибут `role="tablist"`, 5 карточек с `data-role`, 5 статичных pagination-dot'ов в DOM (один с `is-active`, остальные мёртвые) — **ни одного click handler'а** (`document.querySelector('.s3-card').onclick === null`). Это горизонтальный scroll-snap без интерактива.
- **Форма — фейк.** Inline `onsubmit="event.preventDefault(); this.querySelector('.s10-form-success').classList.add('visible');"`. Нет `action`, нет `method`, нет AJAX, нет email. Просто показывает div.
- **Hero на mobile сломан.** Mask "rhythm strips" заявленные клиентом как «прозрачные дорожки под текст» — на деле текст H1 рендерится **поверх яркого центра видео-шеврона**, peach «результат» сливается с peach-вспышкой видео. Mask разделяет видео на полосы, но текст-overlay не привязан к этим полосам.
- **Пустые чёрные провалы между секциями.** На desktop 1440×900: между секциями 03→04 — **800px пустого `#060606`**, между 07→08 — **600px**. На mobile: при scrollY=2858, 3000, 5782 — **viewport ПОЛНОСТЬЮ ЧЁРНЫЙ** (clamp(6rem, 12vh, 10rem) padding-top + s4-header margin = 250px+ void до контента).
- **Все 10 секций тёмные.** Единственное «отдых-в-светлом» — ROI calc card (cream). Это ровно то, что обещал DESIGN-PLAN-V3 §I как «light-section» для контраста — больше нигде не сделано.
- **Видео:** desktop 2.4MB, mobile 2.3MB (HEVC 2.3MB). Хорошо относительно плана (там было 6.5MB), но LCP всё равно тяжёлый — это **единственный движущийся элемент** на странице.
- **WebGL: 0 canvas.** Lenis: 0. View Transitions API: detection есть, использования нет. FLIP plugin: 0. SVG MASK transitions: 0. Bridge videos: 0. Кастомный курсор: 0. SplitText kinetic typography: 0.

**Оценка vs Mahadeva: 2/10.** Mahadeva — это типография + интерактив + custom cursor + GSAP scroll-orchestrated narrative. V3 — это **HTML5 boilerplate в тёмной палитре**.

---

## §1. СПИСОК КОСЯКОВ (62 пункта, с локациями)

### 1.1 КРИТИЧЕСКИЕ — НЕ ЛЕНДИНГ, А ШАБЛОН

**КОСЯК #1.** `script.js:1-166` — **0 ScrollTrigger.create() инстансов**. ScrollTrigger.min.js (33KB) подгружен через `<script src="…">`, но `window.ScrollTrigger.getAll().length === 0` подтверждено. Весь файл — intro-fade (8 строк GSAP), 3 счётчика, 2 magnetic CTA, 1 IntersectionObserver, 1 burger-stub.

**КОСЯК #2.** `index.html:419-457` — ROI-калькулятор статичен. Три `<select>` без `oninput`/`onchange`. Hardcoded `<span data-roi="payback">~3,2 мес</span>` / `data-roi="hours"` / `data-roi="budget"`. JS не имеет ни функции `calcROI()`, ни обработчика `change`. Подтверждено: при программной смене `sel.selectedIndex = 2` + dispatchEvent — `~3,2 мес` остаётся `~3,2 мес`.

**КОСЯК #3.** `index.html:182-258, 254-256` — Секция "По ролям" имитирует tabs (5 карточек `data-role="sales/hr/finance/logistics/it"`, `role="tablist"`, 5 dot'ов в `.s3-pagination`) — но нет ни одного click handler'а. `script.js:150-159` это burger-stub. Tabs **не tabs**, это просто горизонтальный scroll-snap карусель с дисфункциональным aria.

**КОСЯК #4.** `index.html:684` — Форма-фейк. `onsubmit="event.preventDefault(); this.querySelector('.s10-form-success').classList.add('visible');"` — inline JS, не отправляет ничего никуда, нет `action="…"`, нет fetch, нет валидации формата email сверх HTML5 `type="email"`. CTA «Отправить заявку» = `display: block` success-div'а и всё.

**КОСЯК #5.** `style.css:117-153` — Mobile mask rhythm-strips НЕ работает по задумке. Маска создаёт прозрачные полосы 0-12%/29-46%/64-78%/92-100%, но `.hero-content` это `position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center` — текст не привязан к полосам, центруется по vertical-flex и попадает поверх ВИДИМЫХ кусков видео (chevron 48-62%). На скриншоте `mobile-01-hero.png` видно: peach «результат» рендерится на **peach-вспышке центра видео-шеврона** = unreadable.

**КОСЯК #6.** `script.js:65-66` — Все hero-элементы стартуют с `opacity:0, y:18`, intro начинается на 0.15s и заканчивается на 2.45s (`.scroll-hint`). Это **2.45 секунды без контента**. Cumulative Layout не сдвигается, но LCP «cream H1» происходит на 1.65s+ (когда стаггер `.h1-line` доходит до последней строки). FCP виден после 1s, но H1 invisible до ~1.85s.

**КОСЯК #7.** `script.js:15-16` — Никакой защиты от `prefersReducedMotion` для hero-content. Если у пользователя `prefers-reduced-motion: reduce`, `runIntro()` ранний return — но `gsap.set('.h1-line', {opacity:0})` уже **никогда не вызвался**, текст показывается сразу (хорошо). Но `runCounters()` имеет fallback. А все hero-элементы стартуют без opacity:0 в CSS, поэтому intro делает `gsap.set()` ВНУТРИ функции `runIntro()`. Если GSAP не подгрузился к моменту `boot()`, цикл `setTimeout(boot, 40)` крутится бесконечно — никакой деградации.

---

### 1.2 КРИТИЧЕСКИЕ — ВИЗУАЛЬНЫЕ ПРОВАЛЫ

**КОСЯК #8.** `style.css:493 .section-what` — `padding: clamp(8rem, 18vh, 14rem) var(--pad-x) clamp(6rem, 12vh, 10rem)`. При 1440×900 верх = 162px (18vh=162), низ = 108px. Это **270px** пустого тёмного на секцию. На скриншоте `desktop-04-cases.png` видно: scroll=3115 (начало `#cases`), нижние 800px viewport — БЕЛЬМО `#060606` ничего нет, контент cards появляется после scroll=3500.

**КОСЯК #9.** `style.css:813 .section-cases` — Аналогично: `padding: clamp(6rem, 12vh, 10rem) 0`. Внутри `.s4-header` (`margin: 0 auto clamp(3rem, 6vh, 5rem)`) добавляет ещё 54-80px снизу заголовка. Между секциями 04→05 итого **~370px тёмного провала**.

**КОСЯК #10.** `style.css:341 .section-security`, `style.css:1206 .section-stack` — Идентичный padding. Все 10 секций имеют **одинаковый «дышащий» большой padding** — это анти-anti-AI move. Профи варьировал бы (sec 2 = tight, sec 5 = breathing, sec 9 = compressed).

**КОСЯК #11.** `style.css:661` — `.section-roles { background: linear-gradient(180deg, var(--bg) 0%, #08161a 50%, var(--bg) 100%) }`. Заявлено как «секция с teal-tint». **#08161a vs #060606 разница = 16/16/26**, на глазе **неразличима** (контраст 1.1). Эффект «теплее/холоднее» отсутствует.

**КОСЯК #12.** `style.css:1207` — `.section-stack { background: linear-gradient(180deg, var(--bg) 0%, var(--teal-deep) 100%) }`, где `--teal-deep: #0a1f1f`. Опять разница неуловима — visual rhythm = плоский монотон.

**КОСЯК #13.** `index.html:589-601` — Security-icons — **unicode-emoji** (🛡 👤 ⚙). На desktop это плохо: 🛡 рендерится как Segoe UI Emoji (Windows) или Apple Color Emoji — НЕ в стиле дизайна, цветные glyph'ы 32px поверх dark squares. Скриншот `desktop-08b-security-cards.png` подтверждает. Стандартный AI-slop признак.

**КОСЯК #14.** `index.html:540-571 .s7-logos` — «Лого технологий» это **текстовые pill'ы** в `.s7-logo` (`<span class="s7-logo">TensorFlow</span>`). Никаких реальных SVG/PNG. Скриншот `desktop-07b-stack-layers.png` показывает рваные text-pills в кружочках — выглядит как placeholder. Стек должен показывать узнаваемые лого (Sherpa Robotics, OpenAI, Claude Code и т.д. — все имеют легальные brand SVGs).

**КОСЯК #15.** `index.html:620, 629, 638, 647` — Звёзды отзывов это unicode `★★★★★` (4 раза `<div class="s9-stars" aria-label="5 из 5 звёзд">★★★★★</div>`). Размер `font-size: 1.125rem` (18px) + `letter-spacing: 2px` — выглядит как символы в текстовом письме, не как градированный SVG-rating. Awwards-сайты дают SVG stars (часто с micro-fill анимацией).

**КОСЯК #16.** `index.html:462-471, 471` — В стратегиях `.s6-strat-tag` снова emoji: 🎯 и 🚀. Тот же AI-slop pattern.

**КОСЯК #17.** `index.html:464` — Содержание стратегии: **«Возврат X часов и Y рублей за счёт автоматизации рутины»**. **Литералы X и Y в production-копии!** Не placeholder типографически (`{{}}`) — буквально `<li>Возврат X часов и Y рублей</li>`. Контент клиента (FLIP-CONTENT.md) содержал реальные цифры в этом блоке (см. ниже §3).

**КОСЯК #18.** `style.css:600-602` — `.s2-card:nth-child(odd) { transform: rotate(-0.5deg) }`. Заявленный «micro-rotation anti-AI» — заметен **только на 1px-границах** карточек при максимальном zoom. На обычных screen 0.5° перекоса визуально неотличим от случайного смещения. Не эффективен.

**КОСЯК #19.** `style.css:979` — `.s5-step.is-pilot { transform: scale(1.02) }`. 1.02 = 2% увеличения. Скриншот `desktop-05b-steps-grid.png` подтверждает: «Бесплатный пилот» практически не выделяется размером — только peach gradient и border. Если хочется «highlight» — нужно scale(1.06-1.08), elevation shadow крупнее, или вообще отдельный card-treatment.

**КОСЯК #20.** `index.html:412` — `<p class="s6-lede">Открыто говорим о стоимости, так как уверены в кратной окупаемости наших решений.</p>` — но **самой стоимости в калькуляторе нет**. Hardcoded `~750k ₽` это не «открыто говорим о стоимости», это плейсхолдер. Полная UX-ложь.

---

### 1.3 СРЕДНИЕ — ТИПОГРАФИКА / RHYTHM

**КОСЯК #21.** `style.css:22` — `--t-display: clamp(2.4rem, 8.5vw, 6.5rem)`. На desktop 1440px: 8.5vw = 122px. H1 hero «технологии» в `.h1-bold` = 122px при line-height 0.92 = высота строки 112px. Hero имеет **4 строки** H1 — итого 4×112 = **448px** вертикали только под H1. На viewport 900px это 50% экрана. Heavy.

**КОСЯК #22.** `style.css:531` — `.s2-h2 { font-weight: 200 }`. Bricolage Grotesque Variable load с `wght@12..96, 75..100, 200..800` — но в реальности используется только thin(200)/bold(800)/peach. **Не используется ни одного промежуточного вес** (400/500/600). И никаких variable-`wdth` анимаций (DESIGN-PLAN-V3 §C обещал `font-variation-settings: 'wdth' 75` для thin / 110 для bold) — в CSS встречается `font-variation-settings: 'wdth' 90` (line 300) и `'wdth' 100` (line 301), но это static — никакой kinetic typography через `<animate>` или GSAP.

**КОСЯК #23.** `style.css:678-684` — `.s3-h2 .accent-italic { font-family: var(--font-serif); font-style: italic; font-weight: 400; color: var(--peach); font-size: 0.95em }`. Это единственное в сайте использование Fraunces italic — в одной строке H2 «теряет максимум». Заявлено в DESIGN-PLAN-V3 §C — но обещали «mixed serif accent» по сайту, не одну фразу.

**КОСЯК #24.** `index.html:621, 630, 639, 648` — Testimonial цитаты в `.s9-quote` имеют `font-family: var(--font-serif); font-style: italic` (`style.css:1437-1440`) — это второе и последнее использование Fraunces. Шрифт-stack из 4 семейств (Bricolage / Inter / JetBrains Mono / Fraunces) используется ради 2 строчек серифа.

**КОСЯК #25.** `style.css:46` — `*::selection { background: var(--peach); color: var(--bg) }`. Хороший detail, но без `--font-display` в `<title>` или favicon. Open Graph мета отсутствует. Sharing-card будет default cream-on-black от MDN.

**КОСЯК #26.** `index.html:7-8` — `<title>HyperPartner — Мы внедряем результат</title>` — есть, `<meta name="description">` есть. Но **нет** `<meta property="og:image">`, `<meta property="og:title">`, `<meta name="twitter:card">`. Sharing в TG/Slack/LinkedIn = generic.

---

### 1.4 СРЕДНИЕ — ИНТЕРАКЦИИ И HOVER

**КОСЯК #27.** `style.css:603-607` — `.s2-card:hover { border-color: var(--peach); transform: rotate(0deg) translateY(-4px) }`. Хорошо, но **`transition: ... .35s var(--ease-out)`** (line 594) применяется к `transform`. Магнитный эффект (`runMagnetic`) задействован только на 2 hero CTA. Cards — обычный hover-lift, без ничего интересного. Конкуренты (Mahadeva/anima.ai) делают tilt-3D на cards (perspective + rotateX/Y по mouse position).

**КОСЯК #28.** `style.css:1331-1334` — `.s7-logo:hover` — `border-color/background` смена. Никакого growth/fill/glow. Просто перекраска бордера. Скучно.

**КОСЯК #29.** `script.js:111-134 runMagnetic` — magnetic применён только к `.magnetic` элементам = 2 hero CTA. Все остальные CTA (`.btn-demo` в nav, `.s5-cta`, `.s6-cta`, `.s10-submit`, `.mobile-cta-bar a.btn-pill`) — обычные CSS transitions. Inconsistent micro-interactions.

**КОСЯК #30.** `style.css:282-285 @keyframes pulse` — `.hero-eyebrow .dot` пульсирует. Это **единственная idle-animation** на сайте после intro. `.scroll-line::after` (line 437) тоже animation, но `.scroll-hint` скрыт через `display:none` на mobile. То есть весь сайт после загрузки — статика.

**КОСЯК #31.** `style.css:1198-1201` — `.s6-marquee-track` animation 30s linear infinite. Это вторая idle-animation. Скриншот `desktop-06b-roi-calc.png` подтверждает. Но **она же ломает playwright screenshot** — `taking page screenshot` timeout 5000ms — потому что fonts/render не settle. Я был вынужден добавлять `* { animation: none !important }` overrides перед скриншотами `09/10`. Performance impact.

**КОСЯК #32.** `index.html:53-54` — Burger menu заглушка: `<button class="nav-burger"><span></span><span></span><span></span></button>`. JS обработчик (`script.js:150-159`) делает `console.log('[burger]', ...)` и ничего больше. На mobile при tap = бесполезно. **На production это user-blocker** — ссылки nav-links спрятаны `display:none` (`style.css:225`), доступ только через burger, который не работает.

---

### 1.5 СРЕДНИЕ — SCROLL ПОВЕДЕНИЕ

**КОСЯК #33.** `style.css:49` — `html { scroll-behavior: smooth }`. Это native smooth scroll. Lenis НЕ подключен. Anchor links (`href="#cta"`) скроллят с native easing. Дёрганый на Windows trackpad.

**КОСЯК #34.** `style.css:574-583 .s2-grid` mobile — `overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none`. На mobile карусель работает (`mobile-02-what.png` показывает card 01 + clip of card 02 справа). Но **нет pagination indicators**. Юзер не знает, что есть scroll-right. Pagination indicators существуют в `.s3-pagination` для роли — но не для cards. Inconsistent.

**КОСЯК #35.** `style.css:850-858 .s4-track` — Desktop тоже horizontal scroll (`overflow-x: auto`). На скриншоте `desktop-04b-cases-cards.png` видно: 3 card видны + 4-я обрезана справа. **Никакого индикатора** что нужно скроллить вправо. Native scrollbar скрыт. Mahadeva делал бы это с pinned section + horizontal pan по vertical scroll (ScrollTrigger.create({pin, scrub})).

**КОСЯК #36.** `index.html:97-100 .mobile-cta-bar` — Sticky bar появляется когда hero out-of-view (`script.js:142-146`). Но `aria-hidden="true"` по умолчанию + `display:flex` (только mobile). При scroll back в hero, IntersectionObserver toggle visible:false → transform translateY(120%). Анимация уходит вниз. Норм паттерн, но реализовано **без `prefers-reduced-motion` гарда**.

**КОСЯК #37.** Анкор `#cta` навигации (`<a href="#cta" class="btn-demo">Демо за 25 мин</a>` index.html:51, и `<a href="#roi" class="btn">К расчёту прибыли</a>` line 74) использует native smooth-scroll. На скриншоте `desktop-01-hero.png` `.btn-demo` крайне маленький top-right (паддинг 10px 18px = 38×120). На mobile он `display:none`. Главный hero CTA «Демо за 25 мин» **отсутствует на mobile** — конверсию убивает.

---

### 1.6 СРЕДНИЕ — PERFORMANCE

**КОСЯК #38.** `index.html:14` — Шрифты с весами 0-1 (`200;300;400;500;600;700` Inter + `400;500;700` Mono + `300..900` Fraunces variable + `12..96, 75..100, 200..800` Bricolage variable). Запрашиваются **все** Bricolage variations + 4 семейства. Total Google Fonts CSS = большой URL, browser должен распарсить, потом подтянуть 4 woff2 файла. Можно subset cyrillic+latin отдельным `<link>` + загружать только используемые веса (200, 400, 700, 800 для Bricolage; 300, 500, 700 для Inter — итого 7 weight'ов, не 14+).

**КОСЯК #39.** Network анализ: 15 ресурсов всего, hero-desktop.mp4 = 2.4MB при desktop reload. Это уже не катастрофа (план называл 6.5MB критическим риском), но всё равно — **видео — единственный motion на странице**. Если у user-а `prefers-reduced-data: reduce` — `style.css:1662-1665` корректно скрывает `.hero-video` и показывает poster. Но за пределами hero — БОЛЬШЕ НЕТ ВИДЕО или мотиона. Reduced-data режим = просто статичная картинка poster + статичные секции. Это норм с точки зрения accessibility, но **показывает, что весь motion-design = 1 видео**.

**КОСЯК #40.** `script.js:54-56` — `if (v.readyState >= 2) start(); else v.addEventListener('canplay', start); setTimeout(()=>{if (v.paused) start();}, 600)` — тройной fallback на старт видео. Это сигнал, что видео не запускается надёжно. На iOS Safari autoplay требует `playsinline` (есть, OK) и `muted` (есть). Но `setTimeout(600)` — band-aid.

**КОСЯК #41.** `script.js:34-37` — HEVC detection. На iOS Safari < 17.4 HEVC support patchy. Логика: `test.canPlayType('video/mp4; codecs="hvc1"') !== ''` — возвращает `'maybe'` или `'probably'` на Safari, на Chrome возвращает `''`. ОК. Но **отдаётся mobile-hevc 2.4MB**, hevc fallback должен быть МЕНЬШЕ h264. Тут оба одинаковые (`hero-mobile.mp4` 2.3MB vs `hero-mobile.hevc.mp4` 2.4MB). HEVC = бесполезный.

---

### 1.7 МЕЛКИЕ — DETAILS

**КОСЯК #42.** `index.html:457` — `<a href="#cta" class="btn btn-primary s6-cta">Отправить заявку</a>` — это `<a>` стилизованный как `<button>`. Семантика неверная — это не submit формы (форма выше calc'а), а навигация в section CTA. Лейбл «Отправить заявку» обманывает. Правильно — «Перейти к заявке».

**КОСЯК #43.** `index.html:698` — `<p class="s10-form-success">Заявка отправлена. Свяжемся в течение рабочего дня.</p>` — `<p>` для success-message. Должен быть `role="status" aria-live="polite"` для accessibility.

**КОСЯК #44.** `index.html:711` — `<p class="s10-foot-tag">Заменяем ручной хаос точностью роботов.</p>` — слоган в footer. Это же слоган в hero (line 71 `<p class="hero-sub">`). Дублирование без вариации. Footer должен иметь свой собственный final-summary.

**КОСЯК #45.** `index.html:719-720` — `<span>HYPERPARTNER</span><span>109004, г. Москва, ул. 2-я Мелитопольская, д. 26, стр. 0</span>` — Реквизиты компании в footer без ИНН, ОГРН, контакт юр. лица. Для B2B-лендинга это must-have (комплаенс).

**КОСЯК #46.** `style.css:1655` — `@media (prefers-reduced-motion: reduce) { .hero { background-image: url('assets/hero-desktop-poster.jpg'); background-size: cover; } }` — но `background-size: cover` без `background-position`. На очень wide screens hero-image обрежется по умолчанию по top-left.

**КОСЯК #47.** `index.html:12-13` — `<link rel="preload" as="image" href="assets/hero-desktop-poster.jpg" media="(min-width:769px)">` + mobile preload. Это **правильно**, но poster.jpg уже встроен в `<video poster="...">` (line 31), браузер сам подтянет. Двойной preload расходует bandwidth на CSS-loading critical phase.

**КОСЯК #48.** `style.css:1656` — preload mobile poster `media="(max-width:768px)"`, mobile poster size 175KB. Не маленький. Можно WebP 50KB.

**КОСЯК #49.** `index.html:485` — Marquee текст: «Маркетинг·HR·Продажи·Логистика·IT·Бухгалтерия·Закупки·Поддержка·» × 2. Это **8 отделов**, циклящиеся. Контент-фейк (показывает, что HyperPartner обслуживает все), но не несёт смысла — лучше бы тут крутились **названия реальных клиентов** или **технологий стека**.

**КОСЯК #50.** `style.css:1115` — `.s6-results .s6-result:first-child { grid-column: 1 / -1 }` — первый результат (`payback`) занимает 2 колонки, остальные 2 — по одной. ОК ригрид, но визуально это создаёт **главенство ROI = срок окупаемости**. На B2B это спорный приоритет — для CFO более важны `hours/year` и `budget`. Дизайн-решение требует обоснования.

**КОСЯК #51.** `index.html:419-441` — Three `<select>` без `<datalist>` или custom dropdown. Native `<select>` рендерится system UI (Windows/macOS/Linux разный) — выглядит непрофессионально в premium-design. Должны быть кастомные dropdown'ы (например shadcn-style).

**КОСЯК #52.** Color contrast WCAG: cream `#F4ECDD` на bg `#060606` = **AAA** (14.8:1), peach `#E8A878` на bg = 7.2:1 (AAA), но cream-dim `rgba(244,236,221,0.7)` на bg = 10.4:1 (AAA). Это **слишком текстов разных opacity** (0.5/0.55/0.6/0.7/0.72/0.75/0.78/0.82/0.85) — найдено **9 разных opacity-уровней** для cream. Без системы. Должно быть 3-4 token'а (`--text-primary`, `--text-secondary`, `--text-muted`).

**КОСЯК #53.** `style.css:194` — `.nav-links a { color: rgba(244,236,221,0.85) }` + line 197-204 underline `::after` через `left:0; right:100%; height:1px` — текущее состояние underline (правый край в 100%) — итого 0 ширины. На `:hover { right: 0 }` — анимация-fill. ОК паттерн, но slow easing 0.35s. Должно быть 0.25s для responsive feel.

**КОСЯК #54.** `index.html:67` — `<h1 class="h1">` для hero. `<span class="h1-line h1-thin">Мы не продаём</span>` × 4. На mobile это 4 line-block, на desktop тоже. Если viewport узкий, «технологии.» переносится — H1 будет 5 строк. `text-wrap: balance` (line 297) пытается, но не гарантирует. CLS-риск.

**КОСЯК #55.** `index.html:78` — `<ul class="hero-stats" aria-label="Ключевые показатели">` `<li><span class="stat-n" data-target="180">0</span><span class="stat-plus">+</span>` — `+` после числа в **отдельном span**. Зачем? Только если хочешь анимировать «+» отдельно. Не анимируется. Дёргает alignment baseline (stat-plus имеет own font-size).

**КОСЯК #56.** `index.html:81` — Stat `data-target="4.2"` для «среднее ускорение». В `runCounters()` (script.js:94-108): `Number.isInteger(target) ? Math.round(obj.v) : obj.v.toFixed(1)` — non-integer показывается через `.toFixed(1)` → `4.2`. ОК. Но без локализации: `4.2` (с точкой) vs русский стандарт `4,2` (с запятой). Inconsistent с ROI (`~3,2 мес` с запятой).

**КОСЯК #57.** `script.js:103-105` — `target ? Math.round(obj.v).toLocaleString('ru-RU') : obj.v.toFixed(1)`. **`toLocaleString('ru-RU')`** для integer добавляет thousand separators (180 → 180, нет separator). Для 4.2 — нет. Bug потенциальный: если бы target был 1800, было бы `1 800` (NBSP separator). Untested edge case.

**КОСЯК #58.** Console warning ×1-3 при загрузке (видно в `console-2026-05-24T16-41-25-152Z.log`). Не критично, но dev hygiene — должно быть 0.

**КОСЯК #59.** `style.css:48` — `html, body { background: var(--bg); color: var(--cream) }` + `body { overflow-x: hidden }`. `overflow-x: hidden` на `<body>` ломает `position: sticky` на потомках (если у предка есть `overflow: hidden`, sticky degrades). Сейчас sticky не используется кроме `.mobile-cta-bar` (которая `position: fixed`), но если будут sticky-секции — поломаются.

**КОСЯК #60.** `index.html:88-90` — `.scroll-hint` показывается только на desktop. На mobile его нет. У mobile нет signal'а «есть что ниже» — особенно после hero где экран занимает 100dvh. Нет ничего, что бы намекало «scroll».

**КОСЯК #61.** `style.css:1648-1660` — `prefers-reduced-motion` отрубает **все** animations/transitions. Но не отрубает marquee (`.s6-marquee-track`) — ах нет, отрубает через `animation-duration: 0.01ms !important`. ОК. Но это значит, marquee текст показывается статично — текст обрезан в overflow:hidden. **`prefers-reduced-motion` пользователь видит обрезанную строку отделов.** Должен быть отдельный fallback для marquee.

**КОСЯК #62.** `index.html:684` — `.s10-form` имеет `class` без `aria-describedby`, без `noValidate`, без `<fieldset>/<legend>`. Минимум для accessible form.

---

## §2. ОТСУТСТВУЕТ ПОЛНОСТЬЮ (фичи из плана, которых нет в коде)

Сравнение строка-в-строку с `DESIGN-PLAN-V3.md`, `FULL-ARCH-V3.md`, `CHOREOGRAPHY-PLAN.md`:

### 2.1 Hero choreography

| Что обещано | Где в плане | Что есть в v3 | Завершённость |
|---|---|---|---|
| Single-progress pin + scrub: chevron shrinks → navbar, 5 параллельных свойств | DESIGN-PLAN §D.1 (60 строк JS-кода) | **Ничего.** ScrollTrigger 0 инстансов. | **0%** |
| Hero exit: peach gradient flood → next-section BG color shift | DESIGN-PLAN §D.1 пункт 4 | Ничего. Hero просто кончается. | **0%** |
| Chevron FLIP в navbar | CHOREOGRAPHY-PLAN §3 | Ничего. Logo chevron статичен `nav .logo-chevron`. | **0%** |
| WebGL частицы в hero (3000-5000 points) | CHOREOGRAPHY-PLAN §1, слой 2 | Ничего. canvas count = 0. | **0%** |
| MotionPath data-packets по 10 Bezier-кривых | CHOREOGRAPHY-PLAN §1, слой 4 | Ничего. SVG count = 2 (только logo chevron × 2). | **0%** |
| Halo-свечение центрального портала (CSS filters + radial-gradient) | CHOREOGRAPHY-PLAN §1, слой 3 | Ничего. Portal эффект только в **видео** — DOM-overlay отсутствует. | **0%** |
| Intro choreography 2.8s: drawing chevron stroke-dashoffset → branding → drop → idle | CHOREOGRAPHY-PLAN §2 | Простой **fade-in stagger** на 2.45s. Никакого stroke-dasharray drawing. | **15%** |

### 2.2 Inter-section transitions

| Что обещано | Где | Что есть | Завершённость |
|---|---|---|---|
| SVG mask blinds vertical (sec 02→03) | DESIGN-PLAN §E table | Ничего. Просто `padding`. | **0%** |
| Video bridge с chevron возвратом (sec 03→04, 07→08) | DESIGN-PLAN §E | Ничего. `videos.length === 1` (только hero). | **0%** |
| Crossfade с peach подсветкой (sec 04→05) | DESIGN-PLAN §E | Ничего. Резкий cut. | **0%** |
| Pin sequence для steps (sec 05) | DESIGN-PLAN §D.5 (15 строк gsap) | Ничего. CSS grid `repeat(auto-fit, minmax(280px, 1fr))`. | **0%** |
| Backdrop morphing color shift (sec 06→07) | DESIGN-PLAN §E | Ничего. | **0%** |
| Magnetic pull cursor → CTA (sec 09→10) | DESIGN-PLAN §E | Magnetic есть только на 2 hero CTA. Final CTA (s10-submit) не magnetic. | **5%** |
| WebGL particles bridge между секциями (M.4 Gemini suggestion) | DESIGN-PLAN §M.4 | Ничего. | **0%** |
| Lenis smooth scroll | DESIGN-PLAN §F.1, CHOREOGRAPHY §3 | Ничего. `window.Lenis === undefined`. Native `scroll-behavior: smooth`. | **0%** |

### 2.3 Section-specific choreography

| Что обещано | Где | Что есть | Завершённость |
|---|---|---|---|
| **§02 What:** Staggered card reveal с clip-path inset(0 100% 0 0) | DESIGN-PLAN §D.2 | Просто статичные cards. Hover-lift есть. | **5%** |
| **§03 Roles:** Pin scrub 400% длины, snap к labels, FLIP контент-панели | DESIGN-PLAN §D.3 (15 строк), FULL-ARCH-V3 §3 | Просто `scroll-snap` horizontal carousel. Никакого FLIP, никакого pin. | **10%** |
| **§04 Cases:** containerAnimation horizontal pan через pin, scroll-to-horizontal convert | DESIGN-PLAN §D.4 (20 строк gsap) | Просто `overflow-x: auto`. Native scroll. | **10%** |
| **§05 Steps:** Pin scrub 200%, последовательный reveal, peach подсветка `02` через `backgroundColor` анимацию | DESIGN-PLAN §D.5 | Просто CSS grid. `is-pilot` имеет static gradient. | **10%** |
| **§06 ROI:** Sliders реактивны, `gsap.to({val}, {val:newValue, onUpdate})` для odometer-effect | DESIGN-PLAN §D.6, CHOREOGRAPHY §4 | Selects (не sliders) НЕ реактивны. Никаких onUpdate. | **0%** |
| **§07 Stack:** SVG mask hexagonal grid reveal, `stagger: {each:0.06, from: 'random'}` | DESIGN-PLAN §D.7 | Просто `display: flex` grid. Никаких mask. | **0%** |
| **§08 Security:** Bridge video peach→teal градиент loop, plays-on-enter | DESIGN-PLAN §D.8 | Ничего. 3 статичные cards с emoji. | **0%** |
| **§09 Testimonials:** Pin sequence quotes reveal sequentially, SplitText line-by-line, gradient mask | DESIGN-PLAN §D.9, CHOREOGRAPHY §4 (Case) | 4 статичные cards. Italic Fraunces. | **5%** |
| **§10 CTA:** Big magnetic CTA + form + footer reveal как «штора» | DESIGN-PLAN §D.10, CHOREOGRAPHY §4 | Form статичная, submit фейк. Footer обычный. | **5%** |

### 2.4 Innovations / WOW-факторы

| Что обещано | Где | Что есть | Завершённость |
|---|---|---|---|
| View Transitions API для FLIP карточек | FULL-ARCH §9, DESIGN-PLAN §M.3 | `document.startViewTransition` detected = true, но **никогда не вызывается**. | **0%** |
| Custom cursor (8→64px), `mix-blend-mode: difference` | CHOREOGRAPHY §4 Solutions, DESIGN-PLAN §I | `cursor: auto`. Никакого custom-cursor элемента. | **0%** |
| Magnetic Hover на cards (rotateX/Y по mouse) | CHOREOGRAPHY §4 Solutions | `.s2-card:hover` это `translateY(-4px)`. Никакого 3D-perspective. | **0%** |
| Persona personalization (заголовки меняются в зависимости от выбора в калькуляторе) | FULL-ARCH §9 | Калькулятор не работает в принципе. | **0%** |
| Scramble text / Odometer numbers в ROI на change | DESIGN-PLAN §D.6, CHOREOGRAPHY §4 ROI | Ничего. | **0%** |
| Wireframe полусфера фон ROI, привязан к scroll velocity | CHOREOGRAPHY §4 ROI | Ничего. ROI секция = плоский cream card. | **0%** |
| Tactile grain noise overlay (`mix-blend-mode: multiply` poверх noise.png 8%) | DESIGN-PLAN §I | `style.css:498-505` имеет radial-gradient dots на section-what — **не noise**, не multiply, не на cream. | **5%** |
| Один handsketch SVG-marker около «Бесплатный пилот» | DESIGN-PLAN §I | Просто peach `★` glyph + gradient. | **0%** |
| FLIP plugin GSAP для tabs | DESIGN-PLAN §D.3, FULL-ARCH §3 | Не подгружен. | **0%** |
| Swiper.js dynamic import для carousels с pagination dots / momentum / keyboard nav | DESIGN-PLAN §M.2, FULL-ARCH §6 | Не подгружен. CSS scroll-snap (без pagination кроме `.s3-pagination` static). | **0%** |
| Dynamic import через IntersectionObserver (code splitting) | DESIGN-PLAN §M.2 | Всё загружено upfront. | **0%** |

### 2.5 Content

| Что обещано (FLIP-CONTENT.md) | Что есть в v3 | Замечание |
|---|---|---|
| FLIP-CONTENT даёт **реальные цифры** в стратегии оптимизации (например `«Возврат 540 часов»` или `«Экономия 38%»`) | v3 показывает **«X часов и Y рублей»** буквально | КОСЯК #17 |
| Hero stats: **180+ процессов, 4.2× ускорение, 40% бюджета** | ✅ есть (`data-target="180/4.2/40"`) | OK |
| 4 направления (ИИ/RPA/BI/Стратегия) | ✅ все 4 | OK |
| 5 ролей с метриками | ✅ все 5 | OK |
| 4-5 кейсов | 4 кейса | OK |
| 6 этапов с «Бесплатным пилотом» | ✅ 6 + `.is-pilot` highlight на 02 | OK |
| 4-5 testimonials (звёзды + фото/имя/роль) | 4 testimonials с инициалами-avatar (MK, AL, ДС, ИП) | OK textually |
| Стек: layered architecture + конкретные технологии | ✅ 6 слоёв + 4 категории логов | OK |
| Безопасность 3 принципа | ✅ 3 cards | OK |
| Реальные контакты, реквизиты | Реквизиты не полные (нет ИНН, ОГРН) | КОСЯК #45 |

**Контент: ~85% завершено** (минус калькулятор без логики и «X/Y» literals). Структура соответствует FLIP-CONTENT.

---

## §3. ЧИСЛЕННАЯ ОЦЕНКА КОМПОНЕНТ

| Компонент | План | Реализация | % |
|---|---|---|---|
| **HTML структура (IA)** | 10 секций | 10 секций | 100% |
| **Контент (текст из FLIP)** | full | almost full (минус «X/Y», минус полные реквизиты) | 85% |
| **Видео hero** | + bridge videos | 1 видео (desktop+mobile+hevc) | 33% |
| **Шрифты** | 4 семейства Bricolage+Inter+Mono+Fraunces | ✅ 4 семейства подгружены | 100% load, 30% use |
| **Type-mixing (kinetic, variable wdth)** | Bricolage variable wdth animation + Fraunces italic accent + weight contrast | Static thin/bold, 2 строки serif | 15% |
| **Hero intro choreography** | 2.8s drawing+drop+reveal+idle | Простой fade-in stagger 2.45s | 15% |
| **Hero scroll-out** | Single-progress 150% pin scrub | Ничего | 0% |
| **Inter-section transitions** | 9 разных transition паттернов | 0 transitions | 0% |
| **Section-specific scroll-orchestration** | 10 секций × разные patterns (pin/scrub/FLIP/mask) | Ничего | 0% |
| **ROI calculator** | Реактивный с odometer numbers + wireframe sphere bg | Hardcoded results | 0% |
| **Tabs interaction (roles)** | FLIP + View Transitions | Horizontal scroll-snap, фейк role="tablist" | 5% |
| **Carousels** | Swiper.js с pagination/momentum/keyboard | Native scroll-snap, без pagination кроме 1 секции (static) | 15% |
| **Cards interaction** | Magnetic hover + 3D tilt + inner parallax + cursor "Explore" | Hover-lift transform.translateY(-4px) + border colour | 10% |
| **Custom cursor** | 8→64px, mix-blend difference | Нет | 0% |
| **Magnetic CTA** | Все CTA магнитные | Только 2 hero CTA | 10% |
| **Animated counters** | В hero + per-section | Только в hero (3 числа) | 30% |
| **WebGL particles** | Hero + bridges + ROI bg | Нет canvas | 0% |
| **SVG mask transitions (blinds)** | Между sec 02-03, 07-08 | Нет | 0% |
| **Bridge videos** | sec 03-04, 07-08 (2.5s loops) | Нет | 0% |
| **FLIP plugin** | sec 03 tab content | Нет | 0% |
| **View Transitions API** | sec 03 tab morph | Detected, не используется | 5% |
| **Scroll-snap sections** | Mobile pattern для большинства блоков | Только sec 02, 03, 04 mobile | 40% |
| **Lenis smooth scroll** | Desktop | Нет (native scroll-behavior) | 0% |
| **Code splitting / dynamic import** | Swiper/FLIP/WebGL lazy | Всё upfront | 0% |
| **Form** | AJAX submit + validation | preventDefault + show success div | 10% |
| **Sticky mobile CTA bar** | Появляется после hero exit | ✅ работает | 95% |
| **Burger menu** | Drawer slide-right | console.log заглушка | 0% |
| **Reduced-motion fallback** | Все animations off | ✅ есть (overrides) | 90% |
| **Reduced-data fallback** | Video off, only poster | ✅ есть | 100% |
| **Performance budget** | LCP <1.8s mobile, <1.2s desktop | Probably ~2.5s (видео 2.4MB blocking) | 60% |
| **OG/Sharing meta** | Полные | Title + description only | 25% |

**ОБЩАЯ ЗАВЕРШЁННОСТЬ ОТ ПЛАНА: ~22%.**

Из этих 22%: HTML+CSS scaffold = 95%, контент = 85%, моушн/интерактив = 5%.

---

## §4. РЕАЛЬНАЯ ОЦЕНКА (1-10 vs benchmarks)

### vs Mahadeva (https://mahadeva.studio)

Mahadeva — это **studio site** с:
- Custom cursor с magnetic snapping к ссылкам
- WebGL distortion на hover image
- Smooth scroll (Lenis)
- Pin sections с horizontal pan
- SplitText kinetic typography
- Bold typographic transitions между секциями
- 60fps motion throughout

**V3 имеет:** intro fade + 2 magnetic CTA + 1 marquee + 1 pulse dot + sticky mobile bar. Всё остальное статика.

**v3 vs Mahadeva: 1.5 / 10.** Mahadeva вызывает «wow» через первый scroll. V3 — это страница в Notion в тёмной палитре.

### vs anima.ai

anima.ai — SaaS лендинг с:
- Hero video (как у v3, OK)
- Animated dashboard mock в interaction
- Tabs со smooth content swap (FLIP-like)
- Reactive ROI/calculator с real-time numbers update
- Customer logos в marquee (real SVG/PNG, не текст)
- Testimonials с photos (не initials)
- Pricing tables interactive
- Sticky navigation с active section indicator

**V3 имеет:** Hero video ✅, всё остальное либо отсутствует, либо фейк (tabs, ROI).

**v3 vs anima.ai: 3 / 10.** Hero video роднит, но дальше anima.ai даёт интерактив, v3 — статику.

### vs sidewave

sidewave — Awwards-grade portfolio с:
- Cinematic intro 2.8s (drawing logo, drop effect)
- Pin sequences для story-telling
- WebGL ambient в фоне
- Custom cursor evolving
- Scroll velocity-reactive elements
- Sound design (toggle)

**v3 vs sidewave: 1 / 10.** Sidewave-уровень — это 2-3 месяца работы топового студио. V3 — это 1-2 дня junior.

### Совокупный вердикт

**V3 уровень: 2/10** (где 10 = production Awwards-grade).

**Что v3 имеет от плана:** структура (10 sections), контент (85% текстов), типографика (load OK), цветовая палитра (cream/peach/teal/bg).

**Что v3 НЕ имеет:** ноль scroll-orchestration, ноль bridge animations, фейк-калькулятор, фейк-tabs, фейк-форма, ноль custom cursor, ноль WebGL, ноль FLIP, ноль Lenis, ноль View Transitions, ноль bridge videos, ноль pin/scrub, плоская визуальная иерархия (всё `#060606`).

**Это draft / шаблон, не production landing.**

---

## §5. TOP 10 ПРИОРИТЕТОВ ИСПРАВЛЕНИЯ (draft → production)

В порядке impact × effort:

### Priority 1: ROI Calculator должен РАБОТАТЬ (или удалить)
**Локация:** `index.html:404-489`, `script.js` (нужно добавить).  
**Why:** Главный конверсионный механизм лендинга. Без него `«Открыто говорим о стоимости»` — ложь. **Юзер тестирует, видит что числа не меняются — теряет доверие за 5 секунд.**  
**Что делать:** Добавить `function calcROI()` с матрицей вход → выход (3 размера × 4 типа × 2 масштаба = 24 комбинации), `gsap.to({val})` для odometer-эффекта чисел. ~40 строк JS. 2-3 часа.

### Priority 2: Tabs на «По ролям» — реализовать переключение
**Локация:** `index.html:182-258`, `script.js` (добавить).  
**Why:** Сейчас это карусель с псевдо-aria. Юзер ожидает по клику на role-tag (SALES/HR/...) смену контента. Это **базовая ожидаемая интеракция**.  
**Что делать:** Click handler на `[data-role]` cards, View Transitions API `document.startViewTransition(...)` для smooth swap, fallback на opacity-fade. ~30 строк JS. 2 часа.

### Priority 3: Hero на mobile — починить readability H1
**Локация:** `style.css:117-153 .hero-video mask`, `index.html:57-66 .hero-content`.  
**Why:** Сейчас «результат.» (peach H1 строка) на peach-вспышке центра видео-шеврона = **полностью нечитаемо**. Скриншот `mobile-01b-hero-full.png` доказывает.  
**Что делать:** Либо **Variant D** (Gemini suggestion, FULL-ARCH §2) — video в верхних 60dvh + solid `#060606` нижние 40dvh с контентом. Либо **fix Variant A+** — привязать `.hero-content > *` к конкретным маска-зонам через absolute-positioning по top%. ~50 строк CSS. 2 часа.

### Priority 4: Inter-section transitions — добавить хотя бы 2-3
**Локация:** `script.js` (добавить ScrollTrigger setup ~80 строк).  
**Why:** Сейчас секции просто кончаются. Профессиональный лендинг = narrative arc через transitions. План обещал 9 разных приёмов — реализовано 0.  
**Что делать:** Минимум:
- `gsap.to('.s2-card', {scrollTrigger: {trigger:'.s2-grid', start:'top 80%'}, opacity:[0,1], y:[40,0], stagger:0.12})` — staggered reveal на cards (sec 02).
- `ScrollTrigger.create({trigger:'.s4-track', pin:'.section-cases', start:'top top', end:()=>'+='+(track.scrollWidth-innerWidth), scrub:1, tween: gsap.to('.s4-track', {x: -(scrollWidth-innerWidth)})})` — horizontal pan на кейсах (sec 04).
- BG color morphing через CSS variable `--page-bg` + ScrollTrigger по секциям 06↔07 для теплее→холоднее.  
Это **минимум 80 строк JS**. 4-5 часов.

### Priority 5: Pin + scrub на Steps (sec 05)
**Локация:** `index.html:358-397`, `script.js`.  
**Why:** Сейчас 6 этапов это grid auto-fit. Они **все видны сразу** = «list of stuff». План обещал sequential reveal с подсветкой текущего шага = **storytelling**.  
**Что делать:** ScrollTrigger pin с длиной 300%, по scroll progress menstually подсвечивать current step через `.is-active` class, остальные `opacity:0.4`. Special highlight для is-pilot (peach gradient уже есть, добавить scale 1.06 + shadow). ~25 строк JS. 2 часа.

### Priority 6: Lenis smooth scroll (desktop)
**Локация:** `script.js` (импорт + init).  
**Why:** Native `scroll-behavior: smooth` дёрганый на Windows trackpad. Lenis даёт momentum + customizable easing. Все ScrollTrigger выше будут плавнее.  
**Что делать:** `<script type="module"> import Lenis from 'https://cdn.skypack.dev/lenis@1.0'; const lenis = new Lenis(); function raf(t){lenis.raf(t); requestAnimationFrame(raf);} requestAnimationFrame(raf); lenis.on('scroll', ScrollTrigger.update); </script>`. Mobile guard через media query. ~10 строк. 30 минут.

### Priority 7: Custom cursor (desktop)
**Локация:** `script.js` (добавить ~50 строк), `style.css` (добавить ~20 строк).  
**Why:** Awwards-staple. Без него «премиум» feel невозможен. Меняет восприятие сразу.  
**Что делать:** `<div class="cursor">` + `<div class="cursor-follow">`. JS update на mousemove с lerp easing. Magnify на `:hover` интерактивных элементов. `body { cursor: none }` на desktop + canHover guard. Mahadeva-style. 2-3 часа.

### Priority 8: Светлая секция для visual rhythm
**Локация:** Любая sec в середине (4 или 8). Например, sec 08 «Безопасность» сделать на cream `#F4ECDD` с teal text.  
**Why:** **Все 10 секций сейчас тёмные.** Глаз устаёт. Единственный cream-block — ROI calc card. Профессиональный сайт чередует light/dark sections для rhythm.  
**Что делать:** Изменить `.section-security { background: var(--cream); color: var(--bg) }` + переколорить все вложенные `.s8-card, .s8-h, .s8-p, .s8-icon`. ~30 минут CSS. Меняет восприятие на 30%.

### Priority 9: Real form submission + validation
**Локация:** `index.html:684-699`.  
**Why:** Сейчас форма — обманка. Sales-team никогда не получит заявку. Юзер уйдёт думая «спам».  
**Что делать:** `fetch('/api/leads', {method:'POST', body: JSON.stringify(formData)})` или интеграция с Formspree/Web3Forms (бесплатные SaaS). Validation: regex для email, min-length 2 для имени, обязательные поля. Loading state на submit btn. Error/success messages. ~40 строк JS. 1-2 часа (если есть endpoint).

### Priority 10: Bridge video или WebGL bridge между sec 03→04 OR sec 07→08
**Локация:** добавить `<video class="bridge" autoplay loop muted playsinline>` между секциями.  
**Why:** Это **«wow» moment** который план обещал. Между секциями короткий 2.5s loop с chevron-трансформацией = cinematic narrative. Альтернатива (план M.4) — `ogl` 3KB WebGL ambient с reactive cursor.  
**Что делать:** Если WebGL: ~100 строк `ogl` setup + 2 fragment shaders. Если video: 1 Veo-генерация + проигрывание. **Это самый дорогой пункт (3-4 часа)**, но самый импактный для wow-feel.

---

## §6. ИТОГ

V3 — **HTML+CSS-каркас на ~22% от обещанного плана**. Весь моушн-дизайн (90% сложности плана) **отсутствует**. ROI/tabs/form — фейки. Hero на mobile сломан в части читаемости. Все секции тёмные = плоский визуальный ритм. Иконки emoji вместо SVG. Логотипы — текстовые pills.

**Чтобы выйти на production:** минимум **30-40 часов работы** на P1-P10 выше. Без P1 (ROI работает), P2 (tabs работают), P9 (форма не фейк) — лендинг **юридически не функционирует** как маркетинговый инструмент.

Клиент прав. «0 интерактива, 0 анимаций, тяжёлый, тёмный, не лендинг» — это аккуратное описание текущего состояния. «Уровня ниже Mahadeva» — да, в **5 раз ниже** по моушн-метрикам и в **3 раза ниже** по визуальному impact.

**Скриншоты-доказательства в** `audit_v3/`:
- `desktop-01-hero.png` — hero после intro
- `desktop-02-what-top.png` — sec 02 cards
- `desktop-03-roles.png`, `desktop-03b-roles-mid.png` — фейк tabs + пустой void
- `desktop-04-cases.png` — 800px void
- `desktop-04b-cases-cards.png` — обрезанная горизонтальная карусель
- `desktop-05b-steps-grid.png` — статичная grid
- `desktop-06b-roi-calc.png` — фейк calc + emoji в strategy
- `desktop-07-stack.png`, `desktop-07b-stack-layers.png` — text-pills вместо логотипов
- `desktop-08b-security-cards.png` — emoji icons
- `desktop-09-testimonials.png` — unicode stars
- `mobile-01b-hero-full.png` — H1 поверх ярких видео-частей
- `mobile-02-what.png`, `mobile-03-roles.png` — нормальный mobile content layout
- `mobile-04-cases.png`, `mobile-04b-cases-content.png`, `mobile-05-steps.png`, `mobile-06-roi.png` — viewport ВЕСЬ ЧЁРНЫЙ из-за padding void
- `mobile-08-security.png` — vertical stack (не carousel как обещано), emoji icons

**Подтверждённые баги через JS-инспекцию:**
- `ScrollTrigger.getAll().length === 0` (план обещал 8+ pin secquences)
- `[data-roi]` элементы не меняются при `dispatchEvent(change)` на selects
- `.s3-card.onclick === null` (фейк-tabs)
- `cursor: auto`, нет `.cursor` или `.custom-cursor` элемента
- `canvas.length === 0` (нет WebGL)
- `document.startViewTransition` defined, не используется
- `window.Lenis === undefined`
- `videos.length === 1` (только hero, нет bridge)
- Inline `onsubmit` форма preventDefault'ит и показывает div, без отправки

**Final score: 2/10 относительно benchmark.**
