/* ==========================================================
   A v3 · editorial light · UI collage hero + parallax
   ========================================================== */

(() => {
  const init = () => {
    if (!window.gsap) { return setTimeout(init, 40); }
    const { gsap } = window;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
    runHeroParallax();
    runCounter();
    runROI();
    runEntrance();
    runStoryScroll();
  };

  // === Mouse-parallax 3D collage ===
  function runHeroParallax() {
    const stage = document.getElementById('stage');
    if (!stage) return;
    const uis = stage.querySelectorAll('.a-ui');
    if (!uis.length) return;
    // assign random depth + initial float
    uis.forEach((el, i) => {
      const depth = 0.6 + Math.random() * 0.6;
      el.dataset.depth = depth;
      // gentle bobbing
      window.gsap.to(el, {
        y: '+=' + (Math.random() * 12 - 6),
        rotation: '+=' + (Math.random() * 1.6 - 0.8),
        duration: 4 + Math.random() * 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    });
    let mx = 0, my = 0, tx = 0, ty = 0;
    stage.addEventListener('mousemove', (e) => {
      const r = stage.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
    });
    function raf() {
      tx += (mx - tx) * 0.06;
      ty += (my - ty) * 0.06;
      uis.forEach((el) => {
        const d = +el.dataset.depth;
        el.style.setProperty('--mx', (tx * 22 * d) + 'px');
        el.style.setProperty('--my', (ty * 18 * d) + 'px');
      });
      requestAnimationFrame(raf);
    }
    raf();
    // Apply --mx/--my as additional transform
    const styleEl = document.createElement('style');
    styleEl.textContent = `.a-ui { transform: rotate(var(--rot)) translate(var(--mx, 0), var(--my, 0)) !important; }`;
    document.head.appendChild(styleEl);
  }

  function runCounter() {
    const el = document.getElementById('counter');
    if (!el) return;
    let val = 1247833;
    setInterval(() => {
      val += Math.floor(Math.random() * 9) + 2;
      el.textContent = val.toLocaleString('ru-RU').replace(/,/g, ' ');
    }, 1300);
  }

  function runROI() {
    const fmt = n => Math.round(n).toLocaleString('ru-RU').replace(/,/g, ' ');
    const empCount = document.getElementById('empCount');
    const empHours = document.getElementById('empHours');
    const empRate = document.getElementById('empRate');
    const empCountOut = document.getElementById('empCountOut');
    const empHoursOut = document.getElementById('empHoursOut');
    const empRateOut = document.getElementById('empRateOut');
    const resSave = document.getElementById('resSave');
    const resPayback = document.getElementById('resPayback');
    const resRoi = document.getElementById('resRoi');
    const resHours = document.getElementById('resHours');
    const chips = document.querySelectorAll('.a-chips button');
    if (!empCount) return;
    const indFactor = { logistics: 0.78, finance: 0.85, retail: 0.72, auto: 0.74 };
    let industry = 'logistics';
    const calc = () => {
      const emp = +empCount.value;
      const hrs = +empHours.value;
      const rate = +empRate.value;
      const factor = indFactor[industry];
      const automated = emp * hrs * 220 * factor;
      const saveYear = automated * rate * 0.28;
      const implCost = Math.max(2_500_000, emp * 22_000) + saveYear * 0.45;
      const payback = (implCost / saveYear) * 12;
      const roi = ((saveYear - implCost) / implCost) * 100;
      empCountOut.textContent = emp;
      empHoursOut.textContent = hrs + ' ч';
      empRateOut.textContent = rate.toLocaleString('ru-RU').replace(/,/g, ' ') + ' ₽';
      const sM = saveYear / 1e6;
      resSave.textContent = (sM >= 10 ? sM.toFixed(1) : sM.toFixed(2)).replace('.', ',') + ' млн ₽';
      resPayback.textContent = payback < 1 ? '< 1 мес' : payback.toFixed(1).replace('.', ',') + ' мес';
      resRoi.textContent = (roi > 0 ? '+' : '') + Math.round(roi) + '%';
      resHours.textContent = fmt(automated);
    };
    [empCount, empHours, empRate].forEach(el => el && el.addEventListener('input', calc));
    chips.forEach(b => b.addEventListener('click', () => {
      chips.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      industry = b.dataset.industry;
      calc();
    }));
    calc();
  }

  function runEntrance() {
    const { gsap } = window;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });
    tl.from('.a-nav', { y: -30, opacity: 0, duration: 0.6 })
      .from('.a-hero-top', { y: 12, opacity: 0 }, '-=0.3')
      .from('.a-h1-thin', { y: 30, opacity: 0 }, '-=0.4')
      .from('.a-h1-bold', { y: 30, opacity: 0 }, '-=0.7')
      .from('.a-hero-text .hp-lede', { y: 20, opacity: 0 }, '-=0.6')
      .from('.a-hero-cta .hp-btn', { y: 20, opacity: 0, stagger: 0.1 }, '-=0.55')
      .from('.a-stage', { scale: 0.96, opacity: 0, duration: 1.1 }, '-=0.9')
      .from('.a-ui', { y: 18, opacity: 0, stagger: 0.08, duration: 0.7 }, '-=0.7');
  }

  function runStoryScroll() {
    if (!window.ScrollTrigger) return;
    const { gsap } = window;
    gsap.utils.toArray('.a-act-media, .a-ins-media, .a-case-media').forEach((el) => {
      gsap.fromTo(el,
        { y: 20 },
        {
          y: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          }
        }
      );
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
