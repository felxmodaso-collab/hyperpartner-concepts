/* ==========================================================
   C v4 · dark premium · chevron portal
   GSAP: business-labelled cards fly through chevron portal → 4 ribbons
   ========================================================== */

(() => {
  const init = () => {
    if (!window.gsap) { return setTimeout(init, 40); }
    const { gsap } = window;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    runStage();
    runROI();
    runEntrance();
    runParallax();
  };

  function runStage() {
    const stage = document.getElementById('stage');
    const chaos = document.getElementById('chaos');
    const portal = document.getElementById('portal');
    const ribbonsRoot = document.getElementById('ribbons');
    if (!stage || !chaos || !portal || !ribbonsRoot) return;

    // BUSINESS phrases — НЕ файлы, НЕ код (правка клиента)
    const POOL = [
      { t: 'Email от клиента',         out: 'crm',    label: 'Заявка в CRM' },
      { t: 'Скан акта',                out: 'report', label: 'Акт подписан' },
      { t: 'Заявка #2891',             out: 'crm',    label: 'Заявка в CRM' },
      { t: 'Звонок клиенту',           out: 'sms',    label: 'SMS · подтв.' },
      { t: 'Голосовое сообщение',      out: 'crm',    label: 'Расшифровка' },
      { t: 'Договор на согласовании',  out: 'report', label: 'Реестр пополнен' },
      { t: 'Сообщение в Telegram',     out: 'crm',    label: 'CRM · обновлён' },
      { t: 'Выгрузка из 1С',           out: 'bi',     label: 'Дашборд · +строка' },
      { t: 'Чек поставщика',           out: 'report', label: 'Расход проведён' },
      { t: 'ТТН №PA-21',               out: 'crm',    label: 'Статус заказа' },
      { t: 'Письмо контрагенту',       out: 'sms',    label: 'Письмо отправлено' },
      { t: 'Заявка с сайта',           out: 'crm',    label: 'Сделка создана' },
      { t: 'Запрос в поддержку',       out: 'sms',    label: 'Ответ клиенту' },
      { t: 'Отзыв из 2ГИС',            out: 'bi',     label: 'Аналитика · NPS' },
      { t: 'Скан паспорта',            out: 'report', label: 'Карточка клиента' },
      { t: 'Пропущенный звонок',       out: 'sms',    label: 'Lead в CRM' },
    ];

    const ribbonEls = {
      crm:    ribbonsRoot.querySelector('[data-out="crm"]    .c-ribbon-track'),
      report: ribbonsRoot.querySelector('[data-out="report"] .c-ribbon-track'),
      bi:     ribbonsRoot.querySelector('[data-out="bi"]     .c-ribbon-track'),
      sms:    ribbonsRoot.querySelector('[data-out="sms"]    .c-ribbon-track'),
    };

    const rng = (a, b) => a + Math.random() * (b - a);

    function spawn() {
      const t = POOL[Math.floor(Math.random() * POOL.length)];
      const el = document.createElement('div');
      el.className = 'c-card';
      el.textContent = t.t;
      el.dataset.out = t.out;
      el.dataset.label = t.label;
      const cw = chaos.clientWidth;
      const ch = chaos.clientHeight;
      const x = rng(8, Math.max(20, cw - 180));
      const y = rng(12, Math.max(20, ch - 40));
      const rot = rng(-18, 18);
      gsap.set(el, {
        x, y, rotation: rot, scale: 0.75, opacity: 0,
        transformOrigin: 'center',
      });
      chaos.appendChild(el);
      gsap.to(el, { opacity: 1, scale: 1, duration: 0.55, ease: 'power2.out' });
      // drift
      gsap.to(el, {
        y: y + rng(-10, 10),
        x: x + rng(-10, 10),
        rotation: rot + rng(-3, 3),
        duration: rng(3, 5),
        ease: 'sine.inOut',
        yoyo: true, repeat: -1,
      });
      return el;
    }

    function makeTrail(fromX, fromY, toX, toY) {
      const tr = document.createElement('div');
      tr.className = 'c-card-trail';
      chaos.appendChild(tr);
      const dx = toX - fromX, dy = toY - fromY;
      const len = Math.hypot(dx, dy);
      const ang = Math.atan2(dy, dx) * 180 / Math.PI;
      gsap.set(tr, {
        left: fromX, top: fromY,
        width: 0, rotation: ang,
      });
      gsap.timeline({ onComplete: () => tr.remove() })
        .to(tr, { opacity: 1, width: len * 0.7, duration: 0.5, ease: 'power2.out' })
        .to(tr, { opacity: 0, duration: 0.6, ease: 'power1.in' }, '-=0.3');
    }

    function flyTo(card) {
      if (!card || !card.parentNode) return;
      gsap.killTweensOf(card);
      const portalRect = portal.getBoundingClientRect();
      const chaosRect = chaos.getBoundingClientRect();
      const tx = (portalRect.left + portalRect.width * 0.45) - chaosRect.left - 70;
      const ty = (portalRect.top + portalRect.height * 0.5) - chaosRect.top - 16;
      const sx = +gsap.getProperty(card, 'x');
      const sy = +gsap.getProperty(card, 'y');
      // trail
      makeTrail(sx + 80, sy + 14, tx + 80, ty + 14);
      const mx = sx + (tx - sx) * 0.55 + rng(10, 40);
      const my = sy + rng(-50, 50);
      gsap.timeline({
        onComplete: () => {
          firePortal(card.dataset.out, card.dataset.label);
          card.remove();
        }
      })
        .to(card, {
          duration: 1.1,
          ease: 'power2.in',
          scale: 0.3,
          rotation: 0,
          keyframes: [
            { x: mx, y: my, ease: 'sine.inOut' },
            { x: tx, y: ty }
          ]
        })
        .to(card, { opacity: 0, duration: 0.28, ease: 'power1.in' }, '-=0.3');
    }

    function firePortal(out, label) {
      const pulse = portal.querySelector('.c-portal-pulse');
      if (pulse) {
        gsap.fromTo(pulse,
          { opacity: 0.95, attr: { r: 6 } },
          { opacity: 0, attr: { r: 80 }, duration: 0.9, ease: 'power2.out' }
        );
      }
      const front = portal.querySelector('.c-portal-front');
      if (front) gsap.fromTo(front, { filter: 'brightness(1)' }, { filter: 'brightness(1.35)', duration: 0.18, yoyo: true, repeat: 1 });

      const track = ribbonEls[out];
      if (!track) return;
      const pill = document.createElement('div');
      pill.className = 'c-out-pill';
      pill.textContent = label;
      gsap.set(pill, { x: -100, opacity: 0, scale: 0.6 });
      track.appendChild(pill);
      const tw = track.clientWidth;
      gsap.timeline({ onComplete: () => pill.remove() })
        .to(pill, { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' })
        .to(pill, { x: tw + 60, duration: 5.4, ease: 'none' }, '-=0.2')
        .to(pill, { opacity: 0, duration: 0.4, ease: 'power1.in' }, '-=0.5');
    }

    const targetCount = Math.max(8, Math.min(14, Math.floor(window.innerWidth / 130)));
    for (let i = 0; i < targetCount; i++) setTimeout(spawn, i * 80);

    function loop() {
      const alive = [...chaos.querySelectorAll('.c-card')].filter(c => !c.dataset.flying);
      if (alive.length > 2) {
        const pick = alive[Math.floor(Math.random() * alive.length)];
        pick.dataset.flying = '1';
        flyTo(pick);
      }
      const cur = chaos.querySelectorAll('.c-card').length;
      if (cur < targetCount) spawn();
      setTimeout(loop, rng(800, 1600));
    }
    setTimeout(loop, 1500);

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
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });
    tl.from('.c-nav', { y: -30, opacity: 0, duration: 0.6 })
      .from('.c-hero-corners > *', { opacity: 0, stagger: 0.08, duration: 0.5 }, '-=0.3')
      .from('.c-stage', { opacity: 0, duration: 1.2 }, '-=0.4')
      .from('.c-portal', { scale: 0.86, opacity: 0, duration: 1.2, ease: 'power3.out' }, '-=1.1')
      .from('.c-ribbon', { x: 40, opacity: 0, stagger: 0.08 }, '-=0.95')
      .from('.c-hero-text .hp-eyebrow', { y: 18, opacity: 0 }, '-=0.6')
      .from('.c-h1 span', { y: 36, opacity: 0, stagger: 0.1 }, '-=0.55')
      .from('.c-hero-cta .hp-btn', { y: 18, opacity: 0, stagger: 0.08 }, '-=0.5');
  }

  function runParallax() {
    if (!window.ScrollTrigger) return;
    const { gsap } = window;
    gsap.utils.toArray('.c-act-media, .c-ins-media, .c-case-media').forEach((el) => {
      gsap.fromTo(el,
        { y: 24 },
        {
          y: -24, ease: 'none',
          scrollTrigger: {
            trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1,
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
