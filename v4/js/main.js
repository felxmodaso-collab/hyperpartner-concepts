/* HYPERPARTNER V4 — Phase 1
   Foundation + Hero choreography + HERO TOGGLE + Lenis + custom cursor + chameleon nav
*/

(() => {
  const $  = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  const isMobile  = () => window.matchMedia('(max-width: 900px)').matches;
  const canHover  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ====== BOOT ======
  const boot = () => {
    if (!window.gsap || !window.Lenis) { setTimeout(boot, 60); return; }
    if (window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);
    if (window.Flip) window.gsap.registerPlugin(window.Flip);

    initTheme();          // palette switcher A/B/C
    initLenis();          // smooth scroll
    initLoadingScreen();  // type-on logo + counter
    initCursor();         // custom cursor (desktop)
    initNav();            // chameleon nav + burger
    // initVideo() removed — Canvas hero animation вместо 17MB video

    initHeroIntro();      // page-load choreography
    initCounters();       // animated stat numbers
    initMagnetic();       // magnetic CTAs
    initHeroToggle();     // centerpiece interactive
    initMobileCta();      // sticky bottom CTA on mobile
    initHeroExit();       // pin+scrub exit choreography (foundation)
    initRoiCalculator();  // REAL ROI calculator logic
    initCarouselProgress(); // cases carousel progress bar
    initForm();           // contact form validation + fake POST
    initScrollChoreo();   // scroll-driven reveals on every section
    // initParallax() / initCardTilt() / initScrollVelocity() — disabled Anton 2026-05-25
    // ("сайт подлагивает жестко"). These were direct .style writes on scroll/mousemove,
    // главный judder source. Reveals остаются через scroll choreo (one-shot, not scrub).
    initScrollState();    // toggle body.is-scrolling for perf-pause meshes
    initSectionDividers();// cinematic brand-pattern wipes между секциями
  };

  // ====== Section dividers — IntersectionObserver reveal ======
  function initSectionDividers() {
    const dividers = $$('.section-divider');
    if (!dividers.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-revealed');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '-15% 0px -15% 0px', threshold: 0.1 });
    dividers.forEach(d => io.observe(d));
  }

  // ====== Scroll state — pause heavy bg animations during scroll ======
  function initScrollState() {
    let timer = null;
    const onScroll = () => {
      document.body.classList.add('is-scrolling');
      clearTimeout(timer);
      timer = setTimeout(() => document.body.classList.remove('is-scrolling'), 180);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    if (window.lenis) window.lenis.on('scroll', onScroll);
  }

  // ====== SCROLL CHOREOGRAPHY — master timelines per section ======
  // Easings:
  //   entrance: 'power3.out' — snappy reveals
  //   transform: 'expo.inOut' — heavy pin transitions
  //   playful: 'back.out(1.6)' — pops, bounces
  function initScrollChoreo() {
    if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;
    const { gsap, ScrollTrigger } = window;
    const EOUT = 'power3.out';
    const EIO  = 'expo.inOut';
    const EBACK = 'back.out(1.6)';

    // H2 split-WORD reveal (per word, more granular than line)
    $$('.section-h2, .cta-h2, .hero-h1, .dir-h3').forEach((h) => {
      // Wrap each word in <span class="sw-word"><span class="sw-inner">word</span></span>
      h.querySelectorAll('span').forEach((line) => {
        if (line.querySelector('.sw-word')) return; // already wrapped
        const txt = line.innerHTML;
        // Split by words but preserve nbsp + nested spans
        const words = txt.split(/(\s+)/);
        line.innerHTML = words.map(w => {
          if (/^\s+$/.test(w)) return w;
          if (w.includes('<')) return w; // nested span untouched
          return `<span class="sw-word"><span class="sw-inner">${w}</span></span>`;
        }).join('');
      });
      const innerWords = h.querySelectorAll('.sw-inner');
      if (!innerWords.length) return;
      gsap.set(innerWords, { yPercent: 110, opacity: 0, rotationZ: -2 });
      ScrollTrigger.create({
        trigger: h, start: 'top 82%', once: true,
        onEnter: () => gsap.to(innerWords, {
          yPercent: 0, opacity: 1, rotationZ: 0,
          duration: 1.1, ease: EIO,
          stagger: { each: 0.05, ease: 'power1.in' }
        })
      });
    });

    // Section header reveal — short master timeline per section
    [
      '.section-directions', '.section-cases', '.section-steps',
      '.section-roi', '.section-stack', '.section-security', '.section-testimonials', '.section-cta'
    ].forEach((sel) => {
      const sec = $(sel);
      if (!sec) return;
      const eyebrow = sec.querySelector('.section-eyebrow');
      const lede = sec.querySelector('.section-lede, .cta-lede');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sec, start: 'top 78%', once: true }
      });
      if (eyebrow) tl.from(eyebrow, { opacity: 0, y: 24, duration: 0.6, ease: EOUT }, 0);
      if (lede) tl.from(lede, { opacity: 0, y: 30, duration: 0.85, ease: EOUT }, '-=0.35');
    });

    // Direction cards — single MASTER TIMELINE per direction with overlap
    $$('.direction').forEach((dir) => {
      const text = dir.querySelector('.dir-text');
      const visual = dir.querySelector('.dir-visual');
      const reversed = dir.classList.contains('direction-reverse');
      const features = dir.querySelectorAll('.dir-features li, .dir-flow li');
      const emp = dir.querySelectorAll('.emp-card');
      const roi = dir.querySelector('.dir-roi');
      const ex = dir.querySelector('.dir-example');
      const num = dir.querySelector('.dir-num');
      const tag = dir.querySelector('.dir-tag');
      const h3 = dir.querySelector('.dir-h3');
      const lede = dir.querySelector('.dir-lede');

      const tl = gsap.timeline({
        scrollTrigger: { trigger: dir, start: 'top 78%', once: true },
        defaults: { ease: EOUT }
      });
      if (num) tl.from(num, { opacity: 0, x: reversed ? 30 : -30, duration: 0.6 }, 0);
      if (tag) tl.from(tag, { opacity: 0, y: 12, duration: 0.55 }, '-=0.45');
      // visual slides in earlier (overlap)
      if (visual) tl.from(visual, {
        opacity: 0, x: reversed ? -80 : 80, rotationZ: reversed ? 1.5 : -1.5,
        duration: 1.2, ease: EIO
      }, '-=0.5');
      if (h3) tl.from(h3, { opacity: 0, y: 24, duration: 0.85 }, '-=0.85');
      if (lede) tl.from(lede, { opacity: 0, y: 18, duration: 0.7 }, '-=0.55');
      if (features.length) tl.from(features, {
        opacity: 0, x: 14, duration: 0.55, stagger: 0.07
      }, '-=0.4');
      if (ex) tl.from(ex, { opacity: 0, y: 20, duration: 0.7 }, '-=0.3');
      if (roi) tl.from(roi, { opacity: 0, y: 20, scale: 0.96, duration: 0.7, ease: EBACK }, '-=0.4');
      if (emp.length) tl.from(emp, {
        opacity: 0, y: 30, scale: 0.88, rotationZ: () => gsap.utils.random(-4, 4),
        duration: 0.85, stagger: { each: 0.08, from: 'random' }, ease: EBACK
      }, '-=0.9');
    });

    // Cases — stagger reveal с overlapping rotation и depth
    ScrollTrigger.batch('.case-card', {
      start: 'top 88%',
      once: true,
      onEnter: (els) => gsap.from(els, {
        opacity: 0, y: 60, scale: 0.9,
        rotationZ: () => gsap.utils.random(-3, 3),
        duration: 1.0, ease: EBACK,
        stagger: { each: 0.09, from: 'start' }
      })
    });

    // Cases metrics counter
    $$('.cm-n').forEach((el) => {
      const txt = el.textContent.trim();
      const m = txt.match(/^(\D*)(\d+(?:[.,]\d+)?)([\D-]+)?(\d+(?:[.,]\d+)?)?(\D*)$/);
      if (!m) return;
      ScrollTrigger.create({
        trigger: el, start: 'top 90%', once: true,
        onEnter: () => {
          el.classList.add('cm-revealed');
        }
      });
    });

    // Steps — UNIFIED pin section (path draw + cards reveal в одном timeline)
    // Fix bug: previously SVG path triggered at 'top 60%' before pin section,
    // creating "сначала лента, потом scroll" effect. Now everything in one trigger.
    const stepsSection = $('.section-steps');
    const stepCards = $$('.step-card');
    const stepPath = $('.steps-path');

    // Steps — natural per-card reveal БЕЗ pin (Anton 2026-05-25: pin = "сначала анимация, потом scroll").
    // Same behavior на desktop и mobile: each card fades+slides in on its own trigger.
    if (stepCards.length) {
      stepCards.forEach((step, i) => {
        const fromLeft = step.classList.contains('step-pos-l');
        const isMobile = window.matchMedia('(max-width: 900px)').matches;
        gsap.from(step, {
          scrollTrigger: { trigger: step, start: 'top 88%', once: true },
          opacity: 0,
          x: isMobile ? 0 : (fromLeft ? -50 : 50),
          y: isMobile ? 30 : 0,
          duration: 0.7,
          ease: EOUT,
        });
      });
      // Path draws as user scrolls past steps section — light scrub, no pin
      if (stepPath) {
        const len = stepPath.getTotalLength?.() || 1000;
        gsap.set(stepPath, { strokeDasharray: len, strokeDashoffset: len });
        ScrollTrigger.create({
          trigger: '.steps-list',
          start: 'top 70%',
          end: 'bottom 40%',
          scrub: 0.8,
          onUpdate: (self) => { stepPath.style.strokeDashoffset = String(len * (1 - self.progress)); }
        });
      }
    }

    // ROI Calculator — single master timeline с overlap
    const roiSec = $('.section-roi');
    if (roiSec) {
      const calc = $('.roi-card-calc');
      const strats = $$('.roi-strat');
      const marq = $('.roi-marquee');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: roiSec, start: 'top 75%', once: true },
        defaults: { ease: EOUT }
      });
      if (calc) tl.from(calc, {
        opacity: 0, y: 60, scale: 0.96, rotationX: -8,
        duration: 1.1, ease: EIO
      }, 0);
      if (strats.length) tl.from(strats, {
        opacity: 0, y: 40, scale: 0.95, rotationZ: () => gsap.utils.random(-2, 2),
        duration: 0.85, stagger: 0.15, ease: EBACK
      }, '-=0.7');
      if (marq) tl.from(marq, { opacity: 0, scaleX: 0.7, transformOrigin: 'left', duration: 0.9, ease: EOUT }, '-=0.5');
    }

    // Stack — domino reveal: каждый layer прилетает с perspective tilt + glow
    const stackSec = $('.section-stack');
    if (stackSec) {
      const layers = $$('.sl');
      const logos = $$('.sl-real, .sl-l');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: stackSec, start: 'top 72%', once: true },
        defaults: { ease: EOUT }
      });
      if (layers.length) {
        gsap.set(layers, { opacity: 0, y: 60, rotateX: 25, transformPerspective: 1800, transformOrigin: '50% 100%' });
        tl.to(layers, {
          opacity: 1, y: 0, rotateX: (i) => 8 - i * 2,    // итог = stagger 8/6/4/2/0/-2deg
          duration: 1.0, stagger: 0.12, ease: EIO,
          clearProps: 'opacity'                              // дать CSS hover transform работать
        }, 0);
      }
      if (logos.length) {
        tl.from(logos, {
          opacity: 0, scale: 0.6, rotationZ: () => gsap.utils.random(-8, 8),
          duration: 0.55, stagger: { each: 0.03, from: 'random' }, ease: EBACK
        }, '-=0.55');
      }
    }

    // Security cards — single master timeline с overlap + depth
    const secSec = $('.section-security');
    if (secSec) {
      const cards = $$('.sec-card');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: secSec, start: 'top 75%', once: true },
        defaults: { ease: EOUT }
      });
      tl.from(cards, {
        opacity: 0, y: 60, scale: 0.9,
        rotationZ: (i) => [-3, 0, 3][i] || 0,
        rotationY: (i) => [10, 0, -10][i] || 0,
        duration: 1.1, stagger: 0.12, ease: EBACK
      }, 0);
    }

    // Security icons — draw stroke animation
    $$('.sec-ico path, .sec-ico circle, .sec-ico rect').forEach((shape) => {
      const len = (shape.getTotalLength && shape.getTotalLength()) || 200;
      gsap.set(shape, { strokeDasharray: len, strokeDashoffset: len });
      ScrollTrigger.create({
        trigger: shape, start: 'top 85%', once: true,
        onEnter: () => gsap.to(shape, {
          strokeDashoffset: 0, duration: 1.4, ease: E
        })
      });
    });

    // Testimonials — single master timeline
    const tstSec = $('.section-testimonials');
    if (tstSec) {
      const cards = $$('.tst-card');
      const stars = $$('.tst-stars');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: tstSec, start: 'top 78%', once: true },
        defaults: { ease: EOUT }
      });
      tl.from(cards, {
        opacity: 0, y: 50, scale: 0.94,
        rotationZ: (i) => gsap.utils.random(-2.5, 2.5),
        duration: 1.0, stagger: 0.12, ease: EBACK
      }, 0);
      tl.from(stars, {
        scale: 0, rotationZ: -45, opacity: 0,
        duration: 0.5, stagger: { each: 0.08, from: 'random' },
        ease: 'back.out(2.5)'
      }, '-=0.7');
    }

    // CTA / Form — single timeline с dramatic reveal
    const ctaSec = $('#cta');
    if (ctaSec) {
      const left = $('.cta-left');
      const form = $('.cta-form');
      const contacts = $$('.cta-contacts li');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ctaSec, start: 'top 75%', once: true },
        defaults: { ease: EOUT }
      });
      if (left) tl.from(left.querySelectorAll('.section-eyebrow, .cta-h2 .sw-word, .cta-lede'), {
        opacity: 0, y: 30, duration: 0.7, stagger: 0.08
      }, 0);
      if (contacts.length) tl.from(contacts, {
        opacity: 0, x: -20, duration: 0.5, stagger: 0.08
      }, '-=0.3');
      if (form) tl.from(form, {
        opacity: 0, x: 60, scale: 0.97, rotationY: 5,
        duration: 1.2, ease: EIO
      }, '-=0.9');
    }

    // Footer ghost wordmark — parallax in
    const ghost = $('.ftr-ghost');
    if (ghost) {
      ScrollTrigger.create({
        trigger: '.site-footer', start: 'top bottom', end: 'bottom bottom',
        scrub: 1.5,
        onUpdate: (self) => {
          ghost.style.transform = `translate(${-5 + self.progress * 4}%, ${-3 - self.progress * 6}%)`;
          ghost.style.opacity = String(0.02 + self.progress * 0.06);
        }
      });
    }
  }

  // ====== PARALLAX ON MOCKUPS — multi-layer depth ======
  function initParallax() {
    if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;
    const { gsap, ScrollTrigger } = window;
    // Deep parallax on browser mockups (Gemini fix: y:-40 → y:-180)
    $$('.browser-mockup').forEach((el) => {
      gsap.to(el, {
        y: -180,
        ease: 'none',
        scrollTrigger: {
          trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.2
        }
      });
      // Inner image parallax — opposite direction для multi-layer depth
      const img = el.querySelector('img');
      if (img) gsap.to(img, {
        y: 40,
        scale: 1.06,
        ease: 'none',
        scrollTrigger: {
          trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.4
        }
      });
    });
    // Hotspots — parallax floating
    $$('.mockup-hotspot').forEach((dot, i) => {
      gsap.to(dot, {
        y: i % 2 === 0 ? -60 : -90,
        x: i % 2 === 0 ? 8 : -8,
        ease: 'none',
        scrollTrigger: {
          trigger: dot.closest('.browser-mockup'),
          start: 'top bottom', end: 'bottom top', scrub: 2
        }
      });
    });
    // Direction visual containers — slight parallax
    $$('.dir-visual').forEach((el, i) => {
      gsap.to(el, {
        y: i % 2 === 0 ? -50 : -30,
        ease: 'none',
        scrollTrigger: {
          trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.6
        }
      });
    });
    // emp-cards subtle multi-layer parallax
    $$('.emp-card').forEach((card, i) => {
      gsap.to(card, {
        y: -(20 + (i % 3) * 25),
        ease: 'none',
        scrollTrigger: {
          trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1 + (i * 0.2)
        }
      });
    });
  }

  // ====== CARD TILT (3D mouse-driven hover) + UNTILT on enter ======
  function initCardTilt() {
    if (!canHover || reducedMotion) return;
    const { gsap } = window;
    const tiltables = '.case-card, .sec-card, .tst-card, .emp-card, .roi-strat, .browser-mockup, .lg-pill';
    document.querySelectorAll(tiltables).forEach((card) => {
      let raf;
      // Save initial rotationZ from reveal (если был)
      const initialTransform = card.style.transform;
      card.addEventListener('mouseenter', () => {
        // Untilt — straighten the card and lift
        gsap.to(card, {
          rotationZ: 0, scale: 1.02, y: -8,
          duration: 0.55, ease: 'power3.out',
          overwrite: 'auto',
        });
      });
      card.addEventListener('mousemove', (e) => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width;
          const y = (e.clientY - r.top) / r.height;
          const rx = (0.5 - y) * 8;
          const ry = (x - 0.5) * 8;
          card.style.setProperty('--tilt-rx', `${rx}deg`);
          card.style.setProperty('--tilt-ry', `${ry}deg`);
          card.style.transformStyle = 'preserve-3d';
          gsap.set(card, { rotationX: rx, rotationY: ry, transformPerspective: 1000 });
        });
      });
      card.addEventListener('mouseleave', () => {
        cancelAnimationFrame(raf);
        gsap.to(card, {
          rotationX: 0, rotationY: 0, rotationZ: 0, scale: 1, y: 0,
          duration: 0.75, ease: 'elastic.out(1, 0.5)',
          overwrite: 'auto',
        });
      });
    });
  }

  // ====== SCROLL VELOCITY REACTIVE — subtle rotation on fast scroll ======
  function initScrollVelocity() {
    if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;
    const { gsap, ScrollTrigger } = window;
    const targets = $$('.case-card, .sec-card, .tst-card, .step-card, .emp-card, .ht-card');
    if (!targets.length) return;

    // Skew CSS variable that varies with scroll velocity
    const setSkew = gsap.quickTo(targets, 'skewY', { duration: 0.5, ease: 'power3.out' });
    let lastV = 0;
    ScrollTrigger.create({
      onUpdate: (self) => {
        const v = self.getVelocity();
        // Clamp & smoothify
        const skew = Math.max(-2.5, Math.min(2.5, v / -500));
        if (Math.abs(skew - lastV) > 0.1) {
          setSkew(skew);
          lastV = skew;
        }
      }
    });
  }

  // ====== CONTACT FORM (validation + Web3Forms-ready) ======
  function initForm() {
    const form = $('.cta-form');
    if (!form) return;
    const success = $('.cf-success', form);
    const error = $('.cf-error', form);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      success.classList.remove('is-visible');
      error.classList.remove('is-visible');

      const data = Object.fromEntries(new FormData(form));
      if (!data.name?.trim() || !data.email?.trim() || !/^\S+@\S+\.\S+$/.test(data.email)) {
        error.classList.add('is-visible');
        return;
      }

      // Disable while sending
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.6';

      // TODO production: integrate Web3Forms / Formspree
      // const res = await fetch('https://api.web3forms.com/submit', {
      //   method: 'POST', headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ access_key: 'YOUR_KEY', ...data })
      // });
      // simulate
      await new Promise(r => setTimeout(r, 800));

      submitBtn.disabled = false;
      submitBtn.style.opacity = '';
      success.classList.add('is-visible');
      form.reset();
      setTimeout(() => success.classList.remove('is-visible'), 6000);
    });
  }

  // ====== ROI CALCULATOR — REAL logic ======
  function initRoiCalculator() {
    const calc = $('.roi-card-calc');
    if (!calc) return;

    // Matrix: size × domain × scale → { payback (months), hours (per year), budget (₽) }
    // Conservative real-world deployment estimates
    const SIZE_HOURS = { small: 1400, medium: 2700, large: 5800, xlarge: 12000 };
    const DOMAIN_MULT = { docs: 1.0, comms: 1.15, reports: 0.9, ops: 1.25 };
    const SCALE = {
      pilot:  { budget: 0,        paybackBase: 1.0, hoursPct: 0.25 },
      medium: { budget: 750000,   paybackBase: 3.2, hoursPct: 0.65 },
      full:   { budget: 2400000,  paybackBase: 5.4, hoursPct: 1.0  },
    };

    const inputs = {
      size:   $('[data-roi-input="size"]'),
      domain: $('[data-roi-input="domain"]'),
      scale:  $('[data-roi-input="scale"]'),
    };
    const outputs = {
      payback: $('[data-roi-out="payback"]'),
      hours:   $('[data-roi-out="hours"]'),
      budget:  $('[data-roi-out="budget"]'),
    };

    const fmtNum = (n) => Math.round(n).toLocaleString('ru-RU');
    const fmtBudget = (n) => {
      if (n === 0) return 'бесплатно';
      if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace('.', ',')}M ₽`;
      return `${Math.round(n / 1000)}к ₽`;
    };
    const fmtPayback = (m) => {
      if (m === 0) return '—';
      return `${m.toFixed(1).replace('.', ',')} мес`;
    };
    const fmtHours = (h) => h > 0 ? `${fmtNum(h)} ч/год` : '—';

    const tween = (el, fromText, toText) => {
      if (reducedMotion || !window.gsap) { el.textContent = toText; return; }
      el.style.opacity = '0.4';
      el.style.transform = 'translateY(-4px)';
      window.gsap.to(el, {
        opacity: 1, y: 0,
        duration: 0.45, ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        onStart: () => { el.textContent = toText; }
      });
    };

    const compute = () => {
      const size = inputs.size?.value || 'medium';
      const domain = inputs.domain?.value || 'docs';
      const scale = inputs.scale?.value || 'pilot';
      const sc = SCALE[scale];
      const hoursMax = SIZE_HOURS[size];
      const dom = DOMAIN_MULT[domain];

      const hours = Math.round(hoursMax * sc.hoursPct * dom);
      const budget = sc.budget;
      const payback = scale === 'pilot' ? 0 : Number((sc.paybackBase / dom).toFixed(1));

      tween(outputs.payback, outputs.payback.textContent, fmtPayback(payback));
      tween(outputs.hours,   outputs.hours.textContent,   fmtHours(hours));
      tween(outputs.budget,  outputs.budget.textContent,  fmtBudget(budget));

      // Highlight active strategy
      const stratEl = $$('.roi-strat');
      stratEl.forEach(s => s.classList.toggle('is-active',
        (scale === 'pilot' || scale === 'medium') ? s.dataset.strat === 'optimization' : s.dataset.strat === 'scale'));
    };

    Object.values(inputs).forEach(inp => inp?.addEventListener('change', compute));
    compute();
  }

  // ====== CASES CAROUSEL — progress + wheel hijack + keyboard + buttons ======
  function initCarouselProgress() {
    const track = $('.cases-track');
    const fill = $('.cp-fill');
    if (!track) return;

    const update = () => {
      if (!fill) return;
      const max = track.scrollWidth - track.clientWidth;
      const pct = max > 0 ? (track.scrollLeft / max) * 100 : 0;
      fill.style.width = `${Math.max(8, Math.min(100, pct))}%`;
    };
    track.addEventListener('scroll', update, { passive: true });
    update();

    // ===== Wheel hijack — vertical wheel maps to horizontal scrollLeft =====
    // Anton 2026-05-25: "невозможно проскроллить" cases section. Default browser
    // не маппит wheel в horizontal scroll, Lenis ест wheel events. Hijack только
    // когда carousel занимает большую часть viewport (hover'ы / fully visible).
    let wheelLocked = false;
    track.addEventListener('wheel', (e) => {
      const rect = track.getBoundingClientRect();
      // только когда track full-visible vertically
      if (rect.top > 100 || rect.bottom < window.innerHeight - 100) return;

      const max = track.scrollWidth - track.clientWidth;
      const dx = e.deltaY !== 0 ? e.deltaY : e.deltaX;
      const nextScroll = track.scrollLeft + dx;
      const isAtStart = track.scrollLeft <= 0 && dx < 0;
      const isAtEnd = track.scrollLeft >= max && dx > 0;
      if (isAtStart || isAtEnd) return;  // освобождаем wheel для body scroll

      e.preventDefault();
      track.scrollLeft = nextScroll;
    }, { passive: false });

    // ===== Arrow buttons (← →) =====
    const prev = $('.cases-arrow-prev');
    const next = $('.cases-arrow-next');
    const cardW = () => track.querySelector('.case-card')?.getBoundingClientRect().width + 16 || 540;
    prev?.addEventListener('click', () => track.scrollBy({ left: -cardW(), behavior: 'smooth' }));
    next?.addEventListener('click', () => track.scrollBy({ left: cardW(), behavior: 'smooth' }));

    // Keyboard nav когда focused
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') track.scrollBy({ left: cardW(), behavior: 'smooth' });
      if (e.key === 'ArrowLeft')  track.scrollBy({ left: -cardW(), behavior: 'smooth' });
    });
    track.setAttribute('tabindex', '0');
  }

  // ====== HERO EXIT — disabled (Anton 2026-05-25 "все дергается") ======
  // Не пишем JS-driven .style.transform по scroll event. Hero просто прокручивается natural.
  // Если позже понадобится exit-fade — реализовывать через CSS @scroll-timeline или
  // batch gsap.quickSetter, НЕ direct .style writes (они вызывают judder с Lenis lerp).
  function initHeroExit() { /* intentionally empty */ }

  // ====== THEME SWITCHER ======
  function initTheme() {
    const STORAGE_KEY = 'hp_theme';
    const html = document.documentElement;
    const dots = $$('.ps-dot');
    const saved = localStorage.getItem(STORAGE_KEY) || 'A';
    applyTheme(saved, false);

    dots.forEach((d) => {
      d.addEventListener('click', () => applyTheme(d.dataset.theme, true));
    });

    function applyTheme(theme, animate) {
      html.setAttribute('data-theme', theme);
      dots.forEach((d) => {
        const active = d.dataset.theme === theme;
        d.classList.toggle('is-active', active);
        d.setAttribute('aria-checked', active ? 'true' : 'false');
      });
      localStorage.setItem(STORAGE_KEY, theme);
      // Update chameleon nav state
      if (typeof updateNavOver === 'function') updateNavOver();
    }
  }

  // ====== LENIS SMOOTH SCROLL ======
  let lenis = null;
  function initLenis() {
    if (reducedMotion || isMobile()) return;  // native scroll on mobile
    // Anton Wave4: tuned для smooth — lerp 0.08 (less aggressive smoothing,
    // не борется с native momentum). lagSmoothing 500 — drops dropped frames без jank.
    lenis = new window.Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),  // cubic-out, проще чем expo
      smoothWheel: true,
      wheelMultiplier: 1,
      lerp: 0.08,                              // меньше smoothing = более responsive
      syncTouch: false,
    });
    window.lenis = lenis;                       // global для perf-pause hook
    lenis.on('scroll', () => window.ScrollTrigger?.update());
    window.gsap.ticker.add((time) => lenis.raf(time * 1000));
    window.gsap.ticker.lagSmoothing(500, 33);   // 33ms = 30fps minimum
  }

  // ====== LOADING SCREEN ======
  function initLoadingScreen() {
    const screen = $('.ls-screen');
    if (!screen) return;
    const counter = $('.ls-counter');
    const bar = $('.ls-bar-fill');

    if (reducedMotion) {
      counter.textContent = '100';
      bar.style.width = '100%';
      setTimeout(() => screen.classList.add('is-done'), 600);
      setTimeout(() => screen.remove(), 1500);
      return;
    }

    const advance = (val) => {
      counter.textContent = Math.round(val);
      bar.style.width = `${val}%`;
    };

    const obj = { v: 0 };
    // Fake progress to 90%
    const fakeTween = window.gsap.to(obj, {
      v: 90,
      duration: 4,
      ease: 'power1.inOut',
      onUpdate: () => advance(obj.v),
    });

    let completed = false;
    const completeLoading = () => {
      if (completed) return;
      completed = true;
      fakeTween.kill();
      window.gsap.to(obj, {
        v: 100,
        duration: 0.6,
        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        onUpdate: () => advance(obj.v),
        onComplete: () => {
          setTimeout(() => {
            screen.classList.add('is-done');
            setTimeout(() => screen.remove(), 900);
          }, 300);
        }
      });
    };

    // Asset promises
    const fontPromise = document.fonts.ready;
    const video = $('.hero-video');
    const videoPromise = new Promise(resolve => {
      if (!video) { resolve(); return; }
      if (video.readyState >= 3) resolve(); // HAVE_FUTURE_DATA
      else video.addEventListener('canplay', resolve, { once: true });
    });
    
    Promise.all([fontPromise, videoPromise]).then(completeLoading);
    
    // Safety timeout: if assets don't load in 5s, force completion
    setTimeout(completeLoading, 5000);
  }

  // ====== CUSTOM CURSOR ======
  function initCursor() {
    if (!canHover || reducedMotion) return;
    const cursor = $('.cursor');
    if (!cursor) return;
    document.documentElement.classList.add('has-custom-cursor');

    const xTo = window.gsap.quickTo(cursor, 'x', { duration: 0.18, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' });
    const yTo = window.gsap.quickTo(cursor, 'y', { duration: 0.18, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' });

    window.addEventListener('mousemove', (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });

    const hoverables = 'a, button, [role="button"], .magnetic, .ps-dot, .ht-tab, .ht-card, .nav-burger';
    document.addEventListener('mouseenter', (e) => {
      if (e.target?.matches?.(hoverables)) cursor.classList.add('is-hovering');
    }, true);
    document.addEventListener('mouseleave', (e) => {
      if (e.target?.matches?.(hoverables)) cursor.classList.remove('is-hovering');
    }, true);
  }

  // ====== NAV — chameleon ======
  let updateNavOver = () => {};
  function initNav() {
    const nav = $('.nav');
    if (!nav) return;

    // Top vs Scrolled
    const updateState = () => {
      nav.setAttribute('data-nav-state', window.scrollY > 12 ? 'scrolled' : 'top');
    };
    window.addEventListener('scroll', updateState, { passive: true });
    updateState();

    // Burger / drawer
    const burger = $('.nav-burger');
    const drawer = $('.mobile-drawer');
    burger?.addEventListener('click', () => {
      const open = drawer.classList.toggle('is-open');
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    drawer?.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        drawer.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Chameleon — determine section under nav
    const sections = $$('section[data-section]');
    updateNavOver = () => {
      const navBottom = nav.getBoundingClientRect().bottom + 4;
      let current = null;
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top < navBottom && r.bottom > navBottom) { current = s; break; }
      }
      const theme = document.documentElement.getAttribute('data-theme') || 'A';
      // Determine if current section is dark
      const sId = current?.dataset.section;
      let isDark = sId === 'hero' || sId === 'stack' || sId === 'cta';
      if (theme === 'B') isDark = true;
      if ((theme === 'C' || theme === 'D') && current) {
        // hybrid alternation (Theme C: teal↔cream, Theme D: white↔teal-insert)
        const cs = window.getComputedStyle(current);
        const bgColor = cs.backgroundColor;
        const rgb = bgColor.match(/\d+/g)?.slice(0, 3).map(Number);
        if (rgb) isDark = rgb.reduce((a, b) => a + b, 0) < 300;
      }
      if (theme === 'D') {
        // Default Theme D = light; only insert sections (cases/stack/testimonials) — dark
        const darkSections = ['cases', 'stack', 'testimonials'];
        isDark = darkSections.includes(sId);
        // Hero in D остаётся dark (video bg)
        if (sId === 'hero') isDark = true;
      }
      nav.setAttribute('data-nav-over', isDark ? 'dark' : 'light');
    };
    window.addEventListener('scroll', updateNavOver, { passive: true });
    updateNavOver();
  }

  // ====== VIDEO source — with capability detection (3G/saveData → poster only) ======
  function initVideo() {
    const v = $('.hero-video');
    if (!v) return;
    const mobile = window.matchMedia('(max-width: 768px)').matches;

    // Capability detection — skip 17MB video on slow connection / saveData / reduced-motion
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const slowNet = conn && (
      conn.saveData === true ||
      conn.effectiveType === '2g' ||
      conn.effectiveType === 'slow-2g' ||
      conn.effectiveType === '3g'
    );
    const lowEnd = (navigator.hardwareConcurrency || 4) < 4;
    if (reducedMotion || slowNet || (mobile && lowEnd)) {
      // Poster-only fallback: hide video element, keep poster bg (CSS-driven)
      v.remove();
      return;
    }

    const canHEVC = (() => {
      const t = document.createElement('video');
      return !!t.canPlayType && t.canPlayType('video/mp4; codecs="hvc1"') !== '';
    })();
    let src;
    if (mobile) src = canHEVC ? v.dataset.srcMobileHevc : v.dataset.srcMobile;
    else src = v.dataset.srcDesktop;

    const source = document.createElement('source');
    source.src = src;
    source.type = mobile && canHEVC ? 'video/mp4; codecs="hvc1"' : 'video/mp4';
    v.appendChild(source);
    try { v.load(); } catch (_) {}
    const start = () => v.play().catch(() => {});
    if (v.readyState >= 2) start();
    else v.addEventListener('canplay', start, { once: true });
    setTimeout(() => { if (v.paused) start(); }, 600);
  }

  // ====== HERO INTRO choreography ======
  function initHeroIntro() {
    if (reducedMotion) {
      // Even without animation, make pills visible
      document.querySelectorAll('.hero-pill').forEach(el => el.classList.add('is-revealed'));
      return;
    }
    const { gsap } = window;
    // Wait until loading screen done before playing intro
    const start = () => {
      gsap.set('.hero-eyebrow, .hero-h1 .h1-line, .hero-lede, .hero-cta .btn, .hero-stat, .hero-scroll-hint', { opacity: 0, y: 18 });
      gsap.set('.hero-pills-eyebrow', { opacity: 0, x: 12 });

      const tl = gsap.timeline({ defaults: { ease: 'cubic-bezier(0.16, 1, 0.3, 1)' } });
      tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.55 }, 0.05)
        .to('.hero-h1 .h1-line', { opacity: 1, y: 0, duration: 0.65, stagger: 0.08 }, 0.2)
        .to('.hero-lede', { opacity: 1, y: 0, duration: 0.55 }, 0.55)
        .to('.hero-cta .btn', { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0.7)
        .to('.hero-stat', { opacity: 1, y: 0, duration: 0.55, stagger: 0.1 }, 0.9)
        .to('.hero-pills-eyebrow', { opacity: 1, x: 0, duration: 0.45 }, 0.85)
        .to('.hero-scroll-hint', { opacity: 1, y: 0, duration: 0.5 }, 1.2);

      // Pills stagger (CSS-based transition via .is-revealed class)
      document.querySelectorAll('.hero-pill').forEach((el, i) => {
        gsap.delayedCall(0.95 + i * 0.06, () => el.classList.add('is-revealed'));
      });
    };
    // start as soon as loading-screen dismissed
    const screen = $('.ls-screen');
    if (!screen || screen.classList.contains('is-done')) start();
    else {
      const obs = new MutationObserver(() => {
        if (screen.classList.contains('is-done')) { start(); obs.disconnect(); }
      });
      obs.observe(screen, { attributes: true });
    }
  }

  // ====== STAT COUNTERS — ScrollTrigger when in view ======
  function initCounters() {
    const els = $$('.stat-n');
    if (reducedMotion) {
      els.forEach((el) => {
        const t = parseFloat(el.dataset.target);
        el.textContent = Number.isInteger(t) ? t : t.toFixed(1).replace('.', ',');
      });
      return;
    }
    const { gsap, ScrollTrigger } = window;
    if (!ScrollTrigger) {
      // Fallback for browsers or if GSAP fails to load ScrollTrigger
      els.forEach(el => { el.textContent = el.dataset.target; });
      return;
    }

    els.forEach((el) => {
      const target = parseFloat(el.dataset.target);
      const obj = { v: 0 };
      const tween = () => gsap.to(obj, {
        v: target,
        duration: 1.6,
        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        onUpdate: () => {
          el.textContent = Number.isInteger(target)
            ? Math.round(obj.v).toLocaleString('ru-RU')
            : obj.v.toFixed(1).replace('.', ',');
        }
      });

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: tween,
      });
    });
  }

  // ====== MAGNETIC ======
  function initMagnetic() {
    if (!canHover || reducedMotion) return;
    const { gsap } = window;
    $$('.magnetic').forEach((el) => {
      const STRENGTH = 0.3, MAX = 14;
      const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' });
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * STRENGTH;
        const dy = (e.clientY - (r.top  + r.height / 2)) * STRENGTH;
        xTo(Math.max(-MAX, Math.min(MAX, dx)));
        yTo(Math.max(-MAX, Math.min(MAX, dy)));
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' });
      });
    });
  }

  // ====== HERO TOGGLE ======
  function initHeroToggle() {
    const root = $('.hero-toggle');
    if (!root) return;
    const tabs = $$('.ht-tab', root);
    const stages = $$('.ht-cards', root);

    const setState = (state) => {
      root.dataset.toggleState = state;
      tabs.forEach((t) => {
        const on = t.dataset.toggleTarget === state;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });

      // View Transitions API path (Chrome 111+)
      if (document.startViewTransition && !reducedMotion) {
        document.startViewTransition(() => swap(state));
      } else if (window.Flip && !reducedMotion) {
        // FLIP fallback
        const cards = $$('.ht-card', root);
        const flipState = window.Flip.getState(cards);
        swap(state);
        window.Flip.from(flipState, {
          duration: 0.55,
          ease: 'cubic-bezier(0.87, 0, 0.13, 1)',
          stagger: 0.04,
          absolute: true,
        });
      } else {
        swap(state);
      }
    };

    const swap = (state) => {
      stages.forEach((stage) => {
        const match = stage.dataset.stage === state;
        if (match) stage.removeAttribute('hidden');
        else stage.setAttribute('hidden', '');
      });
    };

    tabs.forEach((t) => {
      t.addEventListener('click', () => setState(t.dataset.toggleTarget));
    });

    // Auto-switch demo on first load (optional showcase)
    setTimeout(() => {
      if (root.dataset.toggleState === 'chaos') {
        // gentle hint pulse: switch after 4s, then revert? user-driven mostly
      }
    }, 4000);
  }

  // ====== STICKY MOBILE CTA ======
  function initMobileCta() {
    const bar = $('.mobile-cta-bar');
    const hero = $('.hero');
    if (!bar || !hero || !window.matchMedia('(max-width: 900px)').matches) return;
    const io = new IntersectionObserver(([entry]) => {
      const visible = !entry.isIntersecting;
      bar.classList.toggle('is-visible', visible);
      bar.setAttribute('aria-hidden', visible ? 'false' : 'true');
    }, { threshold: 0.15 });
    io.observe(hero);
  }

  // ====== START ======
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
