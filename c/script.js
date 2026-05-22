/* ==========================================================
   C v3 · editorial light · chevron stage
   GSAP chaos → portal → ribbons (light theme cards)
   ========================================================== */

(() => {
  const init = () => {
    if (!window.gsap) { return setTimeout(init, 40); }
    const { gsap } = window;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    runStage();
    runROI();
    runEntrance();
    runStoryScroll();
  };

  function runStage() {
    const stage = document.getElementById('stage');
    const chaos = document.getElementById('chaos');
    const portal = document.getElementById('portal');
    const ribbonsRoot = document.getElementById('ribbons');
    if (!stage || !chaos || !portal || !ribbonsRoot) return;

    const POOL = [
      { g: '✉', t: 'email_3284', out: 'crm',   label: 'CRM · ticket' },
      { g: '☎', t: '+7 999 ··· 32:14', out: 'sms', label: 'SMS · отправлено' },
      { g: '📄', t: 'scan_акт_117', out: 'report', label: 'report · pdf' },
      { g: '✓', t: 'заявка #2891', out: 'crm', label: 'CRM · order +1' },
      { g: '◐', t: 'voice_msg.ogg', out: 'crm', label: 'CRM · log' },
      { g: '§', t: 'договор v3', out: 'report', label: 'report · акт' },
      { g: '○', t: 'tg @client_42', out: 'crm', label: 'CRM · client' },
      { g: '▤', t: 'выгрузка Q1', out: 'bi', label: 'BI · row +1' },
      { g: '#', t: 'чек #001827', out: 'report', label: 'report · чек' },
      { g: '✉', t: 'reply_to_8821', out: 'sms', label: 'SMS · ответ' },
      { g: '⌘', t: 'счёт №4413', out: 'report', label: 'report · акт' },
      { g: '▦', t: 'CSV экспорт', out: 'bi', label: 'BI · cohort' },
      { g: '☎', t: '+7 905 ··· lead', out: 'sms', label: 'SMS · lead' },
      { g: '◈', t: 'ТТН №PA-21', out: 'crm', label: 'CRM · ship' },
      { g: '◇', t: 'whatsapp · клиент', out: 'sms', label: 'SMS · WA' },
      { g: '◉', t: 'photo_акт.jpg', out: 'report', label: 'OCR · акт' },
    ];

    const ribbonEls = {
      crm:    ribbonsRoot.querySelector('[data-out="crm"]    .c-ribbon-track'),
      report: ribbonsRoot.querySelector('[data-out="report"] .c-ribbon-track'),
      bi:     ribbonsRoot.querySelector('[data-out="bi"]     .c-ribbon-track'),
      sms:    ribbonsRoot.querySelector('[data-out="sms"]    .c-ribbon-track'),
    };
    const outClass = {
      crm: '',
      report: 'c-out-card-peach',
      bi: 'c-out-card-sage',
      sms: '',
    };

    const rng = (a, b) => a + Math.random() * (b - a);

    function spawn() {
      const t = POOL[Math.floor(Math.random() * POOL.length)];
      const card = document.createElement('div');
      card.className = 'c-flying-card';
      card.innerHTML = `<span class="c-flying-card-glyph">${t.g}</span><span>${t.t}</span>`;
      card.dataset.out = t.out;
      card.dataset.label = t.label;
      const cw = chaos.clientWidth;
      const ch = chaos.clientHeight;
      const x = rng(8, Math.max(20, cw - 140));
      const y = rng(8, Math.max(20, ch - 40));
      const rot = rng(-18, 18);
      gsap.set(card, {
        x, y,
        rotation: rot,
        scale: 0.7,
        opacity: 0,
        transformOrigin: 'center',
      });
      chaos.appendChild(card);
      gsap.to(card, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' });
      // gentle drift
      gsap.to(card, {
        y: y + rng(-10, 10),
        x: x + rng(-10, 10),
        rotation: rot + rng(-3, 3),
        duration: rng(3, 5),
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
      return card;
    }

    function flyTo(card) {
      if (!card || !card.parentNode) return;
      gsap.killTweensOf(card);
      const portalRect = portal.getBoundingClientRect();
      const chaosRect = chaos.getBoundingClientRect();
      const tx = (portalRect.left + portalRect.width * 0.55) - chaosRect.left - 60;
      const ty = (portalRect.top + portalRect.height * 0.5) - chaosRect.top - 14;
      const sx = +gsap.getProperty(card, 'x');
      const sy = +gsap.getProperty(card, 'y');
      const mx = sx + (tx - sx) * 0.6 + rng(20, 50);
      const my = sy + rng(-40, 40);
      const tl = gsap.timeline({
        onComplete: () => {
          firePortal(card.dataset.out, card.dataset.label);
          card.remove();
        }
      });
      tl.to(card, {
        duration: 1.0,
        ease: 'power2.in',
        scale: 0.3,
        rotation: 0,
        keyframes: [
          { x: mx, y: my, ease: 'sine.inOut' },
          { x: tx, y: ty }
        ]
      }).to(card, { opacity: 0, duration: 0.25, ease: 'power1.in' }, '-=0.28');
    }

    function firePortal(out, label) {
      const pulse = portal.querySelector('.c-portal-pulse');
      if (pulse) {
        gsap.fromTo(pulse,
          { opacity: 0.9, attr: { r: 5 } },
          { opacity: 0, attr: { r: 80 }, duration: 0.85, ease: 'power2.out' }
        );
      }
      const front = portal.querySelector('.c-portal-front');
      if (front) {
        gsap.fromTo(front, { filter: 'brightness(1)' }, { filter: 'brightness(1.3)', duration: 0.18, yoyo: true, repeat: 1 });
      }
      const track = ribbonEls[out];
      if (!track) return;
      const o = document.createElement('div');
      o.className = `c-out-card ${outClass[out] || ''}`;
      o.textContent = label || 'OK';
      gsap.set(o, { x: -80, opacity: 0, scale: 0.6 });
      track.appendChild(o);
      const tw = track.clientWidth;
      gsap.timeline({ onComplete: () => o.remove() })
        .to(o, { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' })
        .to(o, { x: tw + 60, duration: 5.2, ease: 'none' }, '-=0.2')
        .to(o, { opacity: 0, duration: 0.35, ease: 'power1.in' }, '-=0.45');
    }

    // === Maintain pool ===
    const targetCount = Math.max(8, Math.min(16, Math.floor(window.innerWidth / 110)));
    for (let i = 0; i < targetCount; i++) setTimeout(spawn, i * 70);

    function loop() {
      const alive = [...chaos.querySelectorAll('.c-flying-card')].filter(c => !c.dataset.flying);
      if (alive.length > 2) {
        const pick = alive[Math.floor(Math.random() * alive.length)];
        pick.dataset.flying = '1';
        flyTo(pick);
      }
      const cur = chaos.querySelectorAll('.c-flying-card').length;
      if (cur < targetCount) spawn();
      setTimeout(loop, rng(750, 1500));
    }
    setTimeout(loop, 1400);

    let resizeT;
    window.addEventListener('resize', () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => {
        chaos.innerHTML = '';
        Object.values(ribbonEls).forEach(r => r && (r.innerHTML = ''));
        for (let i = 0; i < targetCount; i++) setTimeout(spawn, i * 60);
      }, 250);
    });
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
    const chips = document.querySelectorAll('.c-chips button');
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
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.85 } });
    tl.from('.c-nav', { y: -30, opacity: 0, duration: 0.6 })
      .from('.c-hero-top', { y: 12, opacity: 0 }, '-=0.3')
      .from('.c-stage', { opacity: 0, duration: 1.1 }, '-=0.3')
      .from('.c-portal', { scale: 0.85, opacity: 0, duration: 1.1, ease: 'power3.out' }, '-=1')
      .from('.c-ribbon', { x: 30, opacity: 0, stagger: 0.08 }, '-=0.85')
      .from('.c-h1-line', { y: 40, opacity: 0, stagger: 0.1 }, '-=0.6')
      .from('.c-hero-cta-row .hp-btn', { y: 20, opacity: 0, stagger: 0.08 }, '-=0.55');
  }

  function runStoryScroll() {
    // Намеренно ничего не скрываем: контент должен быть виден даже без JS/scroll.
    // Можно добавить parallax на медиа-плейсхолдеры — не блокирует видимость.
    if (!window.ScrollTrigger) return;
    const { gsap } = window;
    gsap.utils.toArray('.c-act-media, .c-ins-media, .c-case-media').forEach((el) => {
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
