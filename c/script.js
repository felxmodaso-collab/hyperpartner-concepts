// C. Конвейер 24/7 — chaos → engine → order

(() => {
  const fmt = (n) => Math.round(n).toLocaleString('ru-RU').replace(/,/g, ' ');

  // === CHAOS: рандомно расставленные карточки задач ===
  const chaos = document.getElementById('chaos');
  // Набор «реальных» входящих
  const cardTypes = [
    { g: '✉', t: 'email_3284.eml', out: 'crm' },
    { g: '📞', t: '+7 999 ··· 32:14', out: 'sms' },
    { g: '📄', t: 'scan_акт_117.pdf', out: 'report' },
    { g: '📋', t: 'заявка_#2891', out: 'crm' },
    { g: '🎤', t: 'voice_msg.ogg', out: 'crm' },
    { g: '📑', t: 'договор_v3.docx', out: 'report' },
    { g: '💬', t: 'tg @client_42', out: 'crm' },
    { g: '📊', t: 'выгрузка_2026Q1.xlsx', out: 'bi' },
    { g: '🧾', t: 'чек_#001827', out: 'report' },
    { g: '✉', t: 'reply_to_8821', out: 'sms' },
    { g: '📋', t: 'заявка_#2892', out: 'crm' },
    { g: '📄', t: 'счёт_№4413.pdf', out: 'report' },
    { g: '📊', t: 'CSV экспорт CRM', out: 'bi' },
    { g: '📞', t: '+7 905 ··· lead', out: 'sms' },
    { g: '📑', t: 'TТH №PA-21', out: 'crm' },
    { g: '💬', t: 'whatsapp · клиент', out: 'sms' },
    { g: '📄', t: 'photo_акт.jpg', out: 'report' },
    { g: '📋', t: 'заявка_#2893', out: 'crm' },
  ];

  // Расставить N карточек с псевдо-рандомом + не слишком пересекаться
  const cards = [];
  function rng(min, max) { return Math.random() * (max - min) + min; }
  function spawnChaos() {
    chaos.innerHTML = '';
    cards.length = 0;
    const total = window.innerWidth < 768 ? 9 : 16;
    for (let i = 0; i < total; i++) {
      const type = cardTypes[i % cardTypes.length];
      const el = document.createElement('div');
      el.className = 'c-chaos-card';
      el.innerHTML = `<span class="c-card-glyph">${type.g}</span><span>${type.t}</span>`;
      const rot = rng(-22, 22);
      el.style.setProperty('--rot', rot + 'deg');
      el.style.setProperty('--dx', rng(-6, 6) + 'px');
      el.style.setProperty('--dy', rng(-6, 6) + 'px');
      el.style.left = rng(4, 70) + '%';
      el.style.top = rng(4, 82) + '%';
      el.style.transform = `rotate(${rot}deg)`;
      el.style.animationDelay = rng(0, 4) + 's';
      el.dataset.out = type.out;
      chaos.appendChild(el);
      cards.push(el);
    }
  }
  spawnChaos();
  window.addEventListener('resize', () => {
    clearTimeout(window._c_resize);
    window._c_resize = setTimeout(spawnChaos, 200);
  });

  // === ENGINE pulse + ribbon push ===
  const enginePulse = document.querySelector('.c-engine-pulse');
  const ribbons = {
    crm: document.querySelector('.c-ribbon[data-type="crm"] .c-ribbon-track'),
    report: document.querySelector('.c-ribbon[data-type="report"] .c-ribbon-track'),
    bi: document.querySelector('.c-ribbon[data-type="bi"] .c-ribbon-track'),
    sms: document.querySelector('.c-ribbon[data-type="sms"] .c-ribbon-track'),
  };
  const ribbonLabel = {
    crm: ['CRM · ticket', 'CRM · order', 'CRM · client'],
    report: ['report.pdf', 'отчёт_акт.pdf', 'счёт.pdf'],
    bi: ['BI · row+', 'analytics_+1', 'dashboard_upd'],
    sms: ['SMS sent', 'TG sent', 'email reply'],
  };

  function pickAndConsume() {
    // выбираем случайную карточку, которая ещё не «в обработке»
    const candidates = cards.filter(c => !c.classList.contains('is-leaving'));
    if (!candidates.length) { spawnChaos(); return; }
    const card = candidates[Math.floor(Math.random() * candidates.length)];
    const out = card.dataset.out;
    // лети к engine
    card.classList.add('is-leaving');
    // Engine - правая граница chaos
    const chaosRect = chaos.getBoundingClientRect();
    const engineRect = document.querySelector('.c-engine').getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const dx = (engineRect.left + engineRect.width / 2) - (cardRect.left + cardRect.width / 2);
    const dy = (engineRect.top + engineRect.height / 2) - (cardRect.top + cardRect.height / 2);
    card.style.transform = `translate(${dx}px, ${dy}px) rotate(0deg) scale(0.4)`;
    card.style.opacity = '0';
    setTimeout(() => {
      // Engine flash
      enginePulse.classList.remove('is-fire');
      void enginePulse.offsetWidth;
      enginePulse.classList.add('is-fire');
      // Spawn ordered card on output ribbon
      const track = ribbons[out];
      if (track) {
        const o = document.createElement('div');
        o.className = 'c-order-card';
        const labels = ribbonLabel[out];
        o.textContent = labels[Math.floor(Math.random() * labels.length)];
        track.appendChild(o);
        setTimeout(() => o.remove(), 6500);
      }
      // remove the chaos card and spawn a fresh one
      card.remove();
      const idx = cards.indexOf(card);
      if (idx >= 0) cards.splice(idx, 1);
      const type = cardTypes[Math.floor(Math.random() * cardTypes.length)];
      const ne = document.createElement('div');
      ne.className = 'c-chaos-card';
      ne.innerHTML = `<span class="c-card-glyph">${type.g}</span><span>${type.t}</span>`;
      const rot = rng(-22, 22);
      ne.style.setProperty('--rot', rot + 'deg');
      ne.style.setProperty('--dx', rng(-6, 6) + 'px');
      ne.style.setProperty('--dy', rng(-6, 6) + 'px');
      ne.style.left = rng(4, 70) + '%';
      ne.style.top = rng(4, 82) + '%';
      ne.style.transform = `rotate(${rot}deg)`;
      ne.style.opacity = '0';
      ne.style.animationDelay = rng(0, 4) + 's';
      ne.dataset.out = type.out;
      chaos.appendChild(ne);
      cards.push(ne);
      setTimeout(() => { ne.style.opacity = '1'; }, 100);
    }, 550);
  }

  // Стартовый поток
  let intervalId;
  function startFlow(speed = 1300) {
    clearInterval(intervalId);
    intervalId = setInterval(pickAndConsume, speed);
  }
  startFlow();

  // === SHOP visualization (calc) ===
  const shopFlow = document.getElementById('shopFlow');
  if (shopFlow) {
    // 4 «полосы цеха» с бегущими блоками
    for (let r = 1; r <= 4; r++) {
      const bar = document.createElement('div');
      bar.className = `c-shop-bar c-shop-bar-${r}`;
      const cnt = 6 + Math.floor(Math.random() * 4);
      for (let i = 0; i < cnt; i++) {
        const b = document.createElement('span');
        b.style.animationDelay = (-Math.random() * 4) + 's';
        bar.appendChild(b);
      }
      shopFlow.appendChild(bar);
    }
  }

  // === КАЛЬКУЛЯТОР ===
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

  const industryFactor = {
    logistics: 0.78, finance: 0.85, retail: 0.72, auto: 0.74,
  };
  let industry = 'logistics';

  function calc() {
    const emp = +empCount.value;
    const hrs = +empHours.value;
    const rate = +empRate.value;
    const factor = industryFactor[industry];
    const routineHoursYear = emp * hrs * 220;
    const automatedHours = routineHoursYear * factor;
    const moneyConversion = 0.28;
    const saveYear = automatedHours * rate * moneyConversion;
    const implCost = Math.max(2_500_000, emp * 22_000) + saveYear * 0.45;
    const payback = (implCost / saveYear) * 12;
    const roi = ((saveYear - implCost) / implCost) * 100;

    empCountOut.textContent = emp;
    empHoursOut.textContent = hrs + ' ч';
    empRateOut.textContent = rate.toLocaleString('ru-RU').replace(/,/g, ' ') + ' ₽';
    const saveM = saveYear / 1e6;
    resSave.textContent = (saveM >= 10 ? saveM.toFixed(1) : saveM.toFixed(2)).replace('.', ',') + ' млн ₽';
    resPayback.textContent = payback < 1 ? '< 1 мес' : payback.toFixed(1).replace('.', ',') + ' мес';
    resRoi.textContent = (roi > 0 ? '+' : '') + Math.round(roi) + '%';
    resHours.textContent = fmt(automatedHours);
  }
  [empCount, empHours, empRate].forEach(el => el && el.addEventListener('input', calc));
  chips.forEach(btn => btn.addEventListener('click', () => {
    chips.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    industry = btn.dataset.industry;
    calc();
  }));
  calc();
})();
