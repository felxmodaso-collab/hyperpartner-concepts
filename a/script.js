// A. HyperPlatform Live — динамика

(() => {
  const fmt = (n, suffix = '') => {
    const s = Math.round(n).toLocaleString('ru-RU').replace(/,/g, ' ');
    return s + suffix;
  };

  // === Live counter в hero (1.2M+ растёт случайно) ===
  const counter = document.getElementById('opsCounter');
  if (counter) {
    let val = 1247833;
    setInterval(() => {
      val += Math.floor(Math.random() * 11) + 3;
      counter.textContent = val.toLocaleString('ru-RU').replace(/,/g, ' ');
    }, 1100);
  }

  // === Узлы пульсируют поочерёдно ===
  const nodes = document.querySelectorAll('.a-network .a-node');
  if (nodes.length) {
    let idx = 0;
    setInterval(() => {
      nodes.forEach(n => n.classList.remove('is-pulse'));
      const node = nodes[idx % nodes.length];
      node.classList.add('is-pulse');
      idx++;
    }, 1400);
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
  const chips = document.querySelectorAll('.a-chips button');

  // Отраслевые множители: насколько процессы поддаются автоматизации
  const industryFactor = {
    logistics: 0.78,
    finance: 0.85,
    retail: 0.72,
    auto: 0.74,
  };
  let industry = 'logistics';

  function calc() {
    const emp = +empCount.value;
    const hrs = +empHours.value;
    const rate = +empRate.value;
    const factor = industryFactor[industry];

    // Часы рутины в год всего
    const routineHoursYear = emp * hrs * 220;
    // Реально автоматизируемая доля (по отрасли)
    const automatedHours = routineHoursYear * factor;
    // Конвертация в деньги — только 25-35% реально становится экономией (часть часов перераспределяется на другую работу, а не уволняется)
    const moneyConversion = 0.28;
    const saveYear = automatedHours * rate * moneyConversion;
    // Стоимость внедрения: фикс + от масштаба экономии (типично 40-60% от первого года)
    const implCost = Math.max(2_500_000, emp * 22_000) + saveYear * 0.45;
    // Окупаемость, мес
    const payback = (implCost / saveYear) * 12;
    // ROI год 1
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

  // Reveal удалён — контент видим всегда (важнее, чем «эффект прилёта» в прототипе).
})();
