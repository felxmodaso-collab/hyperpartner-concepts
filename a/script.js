/* ==========================================================
   A v4 · dark premium · UI collage with mouse-parallax
   ========================================================== */

(() => {
  const init = () => {
    if (!window.gsap) { return setTimeout(init, 40); }
    const { gsap } = window;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
    runHero();
    runROI();
    runEntrance();
    runParallax();
  };

  function runHero() {
    const { gsap } = window;
    const stage = document.getElementById('stage');
    if (!stage) return;
    const cards = stage.querySelectorAll('.a-card');
    if (!cards.length) return;

    // gentle bobbing
    cards.forEach((el, i) => {
      gsap.to(el, {
        y: '+=' + (Math.random() * 14 - 7),
        rotation: '+=' + (Math.random() * 1.6 - 0.8),
        duration: 4 + Math.random() * 3,
        ease: 'sine.inOut',
        yoyo: true, repeat: -1,
      });
    });

    // mouse parallax
    let mx = 0, my = 0, tx = 0, ty = 0;
    stage.addEventListener('mousemove', (e) => {
      const r = stage.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
    });
    stage.addEventListener('mouseleave', () => { mx = 0; my = 0; });
    function raf() {
      tx += (mx - tx) * 0.06;
      ty += (my - ty) * 0.06;
      cards.forEach((el) => {
        const d = +el.dataset.depth || 0.7;
        el.style.setProperty('--mx', (tx * 26 * d) + 'px');
        el.style.setProperty('--my', (ty * 22 * d) + 'px');
      });
      requestAnimationFrame(raf);
    }
    raf();
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
      .from('.a-hero-corners > *', { opacity: 0, stagger: 0.08, duration: 0.5 }, '-=0.3')
      .from('.a-hero-text .hp-eyebrow', { y: 16, opacity: 0 }, '-=0.3')
      .from('.a-h1-thin', { y: 30, opacity: 0 }, '-=0.5')
      .from('.a-h1-bold', { y: 30, opacity: 0 }, '-=0.65')
      .from('.a-hero-text .hp-lede', { y: 20, opacity: 0 }, '-=0.55')
      .from('.a-hero-cta .hp-btn', { y: 18, opacity: 0, stagger: 0.08 }, '-=0.5')
      .from('.a-stage', { scale: 0.96, duration: 1.1 }, '-=1.0');
    // Cards: subtle stagger без opacity (видимы всегда — fullPage screenshot safe)
    gsap.from('.a-card', { y: 24, duration: 0.8, stagger: 0.07, ease: 'power2.out', delay: 0.6 });
  }

  function runParallax() {
    if (!window.ScrollTrigger) return;
    const { gsap } = window;
    gsap.utils.toArray('.a-act-media, .a-ins-media, .a-case-media').forEach((el) => {
      gsap.fromTo(el,
        { y: 24 },
        {
          y: -24, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 }
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
