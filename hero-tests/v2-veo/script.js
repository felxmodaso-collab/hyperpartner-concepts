/* V2 production · Seamless dual-video atomic swap (Fleurs trick) + GSAP intro */
(() => {
  const init = () => {
    if (!window.gsap) return setTimeout(init, 40);
    runSeamlessLoop();
    runIntro();
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
      .to('.back-tests', { opacity: 1, duration: 0.4 }, 2.2);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
