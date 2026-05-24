/* V2 production · Seamless dual-video atomic swap (Fleurs trick) + GSAP intro
   + number counter + magnetic CTAs + live-activity auto-highlight + scroll hint
*/
(() => {
  const init = () => {
    if (!window.gsap) return setTimeout(init, 40);
    runSeamlessLoop();
    runIntro();
    runCounter();
    runMagnetic();
    runLiveActivity();
  };

  /* ---------- SEAMLESS DUAL-VIDEO LOOP ----------
     Two <video> elements playing the same source, slightly staggered.
     When video A approaches end, we start video B from 0 and atomically
     swap opacity at the precise frame the user is about to see the same
     visual content from the start. No visible cut/blink.
     Inspired by Fleurs Maison entrance handoff.
  */
  function runSeamlessLoop() {
    const a = document.querySelector('.bg-a');
    const b = document.querySelector('.bg-b');
    if (!a || !b) return;

    // crossfade duration in seconds — small but enough to mask any seam
    const FADE = 0.55;
    // how many seconds before end of A we kick off B
    const LEAD = 0.6;

    let active = a;
    let standby = b;
    let scheduled = false;
    let raf;

    function step() {
      if (!active.duration) { raf = requestAnimationFrame(step); return; }
      const timeLeft = active.duration - active.currentTime;
      if (!scheduled && timeLeft <= LEAD) {
        scheduled = true;
        // start standby from time 0
        try {
          standby.currentTime = 0;
          const playP = standby.play();
          if (playP && typeof playP.then === 'function') {
            playP.then(() => doSwap()).catch(() => doSwap());
          } else {
            doSwap();
          }
        } catch (e) { doSwap(); }
      }
      raf = requestAnimationFrame(step);
    }

    function doSwap() {
      // crossfade — fast peach-tinted blend
      window.gsap.to(active, { opacity: 0, duration: FADE, ease: 'sine.inOut' });
      window.gsap.to(standby, { opacity: 1, duration: FADE, ease: 'sine.inOut',
        onComplete: () => {
          // pause the now-invisible one so it doesn't churn
          try { active.pause(); } catch (e) {}
          // swap roles
          const tmp = active; active = standby; standby = tmp;
          scheduled = false;
        }
      });
    }

    a.addEventListener('loadedmetadata', () => {
      a.play().catch(() => {});
      step();
    }, { once: true });
    // safety
    setTimeout(() => { if (a.paused) a.play().catch(() => {}); }, 500);
  }

  /* ---------- INTRO choreography ---------- */
  function runIntro() {
    const { gsap } = window;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.bg-a', { opacity: 1, duration: 1.4, ease: 'power2.out' }, 0.1)
      .to('.nav', { opacity: 1, duration: 0.7 }, 0.7)
      .to('.targets', { opacity: 1, duration: 0.7 }, 0.95)
      .to('.corners > span', { opacity: 1, duration: 0.4, stagger: 0.06 }, 1.15)
      .to('.eyebrow', { opacity: 1, duration: 0.5 }, 1.3)
      .to('.h1 .thin', { opacity: 1, duration: 0.55 }, 1.45)
      .to('.h1 .bold', { opacity: 1, duration: 0.55 }, 1.6)
      .to('.lede', { opacity: 1, duration: 0.55 }, 1.8)
      .to('.btn-peach, .btn-ghost', { opacity: 1, duration: 0.45, stagger: 0.08 }, 1.95)
      .to('.back-tests', { opacity: 1, duration: 0.4 }, 2.2)
      .to('.scroll-hint', { opacity: 1, duration: 0.6 }, 2.5);
  }

  /* ---------- COUNTER (animated number) ---------- */
  function runCounter() {
    const el = document.getElementById('counter');
    if (!el) return;
    const target = 7042;
    const obj = { v: 6950 };
    window.gsap.to(obj, {
      v: target,
      duration: 1.6,
      delay: 1.4,
      ease: 'power2.out',
      onUpdate: () => {
        const n = Math.round(obj.v);
        el.textContent = n.toLocaleString('ru-RU').replace(/,/g, ' ');
      },
      onComplete: () => {
        // Slow live drift after intro
        let v = target;
        setInterval(() => {
          v += Math.floor(Math.random() * 3) + 1;
          el.textContent = v.toLocaleString('ru-RU').replace(/,/g, ' ');
        }, 4200);
      }
    });
  }

  /* ---------- MAGNETIC CTAs (desktop only) ---------- */
  function runMagnetic() {
    if (window.matchMedia('(max-width: 900px), (pointer: coarse)').matches) return;
    const { gsap } = window;
    document.querySelectorAll('.magnetic').forEach((el) => {
      const STRENGTH = 0.35;
      const MAX = 14;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * STRENGTH;
        const dy = (e.clientY - (r.top + r.height / 2)) * STRENGTH;
        gsap.to(el, {
          x: Math.max(-MAX, Math.min(MAX, dx)),
          y: Math.max(-MAX, Math.min(MAX, dy)),
          duration: 0.4, ease: 'power3.out',
        });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' });
      });
    });
  }

  /* ---------- LIVE ACTIVITY (auto-highlight targets) ---------- */
  function runLiveActivity() {
    const items = [...document.querySelectorAll('.targets a')];
    if (!items.length) return;
    let userTouched = false;
    document.querySelector('.targets')?.addEventListener('mouseenter', () => { userTouched = true; });
    document.querySelector('.targets')?.addEventListener('touchstart', () => { userTouched = true; }, { passive: true });
    function tick() {
      if (!userTouched) {
        const el = items[Math.floor(Math.random() * items.length)];
        el.classList.add('is-live');
        setTimeout(() => el.classList.remove('is-live'), 850);
      }
      setTimeout(tick, 1200 + Math.random() * 1400);
    }
    setTimeout(tick, 2600);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
