/* =============================================================
   HYPERPARTNER — Canvas Hero Animation
   Concept-07: chaos particles → chevron portal → 10 curves to pills
   Pure Canvas2D, 60fps native, brand palette (teal/peach/cream).
   No video file, no Veo, no external deps. ~7KB minified.
============================================================= */
(() => {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  // Brand palette
  const COLORS = {
    peach:      '#E8A878',
    peachSoft:  '#F2D5C1',
    peachGlow:  '#F6E0CC',
    cream:      '#F4ECDD',
    sage:       '#BDD8C9',
    teal:       '#143A3A',
    tealDeep:   '#0A2222',
  };

  let W = 0, H = 0, CX = 0, CY = 0;
  function resize() {
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    // Chevron center ~38% from left, 50% from top
    CX = W * 0.38;
    CY = H * 0.5;
  }
  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  // -------------- Particles (chaos cloud, left side) --------------
  const PARTICLE_COUNT = Math.min(140, Math.floor((W * H) / 12000));
  const particles = Array.from({ length: PARTICLE_COUNT }, () => spawnParticle());

  function spawnParticle() {
    return {
      x: Math.random() * CX * 0.85,         // только в левой трети
      y: Math.random() * H,
      vx: 0.08 + Math.random() * 0.18,      // дрейф вправо (к chevron)
      vy: (Math.random() - 0.5) * 0.06,
      r: 0.5 + Math.random() * 2.5,
      a: 0.15 + Math.random() * 0.55,
      hue: Math.random() < 0.7 ? 'peach' : 'cream',
      twinkle: Math.random() * Math.PI * 2,
    };
  }

  // -------------- 10 curves to right-side pills --------------
  // Каждая curve = bezier path от chevron к точке на правом крае
  const NUM_CURVES = 10;
  const curves = Array.from({ length: NUM_CURVES }, (_, i) => {
    const t = i / (NUM_CURVES - 1);           // 0..1
    return {
      yPercent: 0.12 + t * 0.76,              // от 12% до 88% высоты
      offset: i * 0.13,                       // phase shift для glow
      thickness: 0.6 + (i % 3) * 0.3,
    };
  });

  // -------------- Animation loop --------------
  let raf = null;
  let t0 = performance.now();
  let lastPaint = 0;
  let visible = true;
  let paused = false;

  // Pause when offscreen для perf
  const heroEl = canvas.closest('.hero');
  const io = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
  }, { threshold: 0 });
  if (heroEl) io.observe(heroEl);

  // Также pause при focus loss / reduced-motion
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.addEventListener('visibilitychange', () => {
    paused = document.hidden;
  });

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!visible || paused) return;
    // throttle 60fps target (skip if browser delivers higher)
    if (now - lastPaint < 14) return;
    lastPaint = now;

    const t = (now - t0) * 0.001;

    // Clear (transparent — bg = CSS gradient)
    ctx.clearRect(0, 0, W, H);

    // ====== 1. Particle field (chaos, left) ======
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.twinkle += 0.04;

      // when particle reaches chevron — respawn from left
      if (p.x > CX - 20) {
        p.x = -10;
        p.y = Math.random() * H;
      }
      if (p.y < 0 || p.y > H) p.vy *= -1;

      const a = p.a * (0.7 + Math.sin(p.twinkle) * 0.3);
      const color = p.hue === 'peach' ? COLORS.peach : COLORS.cream;
      const r = p.r * (1 + Math.sin(p.twinkle * 0.5) * 0.15);

      // Soft glow particle (radial gradient)
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
      grd.addColorStop(0, color + 'cc');
      grd.addColorStop(0.5, color + '44');
      grd.addColorStop(1, color + '00');
      ctx.fillStyle = grd;
      ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
      ctx.fill();

      // sharp core
      ctx.globalAlpha = a * 1.4;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // ====== 2. Chevron portal (центр, animated glow) ======
    drawChevronPortal(t);

    // ====== 3. 10 curves to right (peach lines + traveling dots) ======
    for (let i = 0; i < curves.length; i++) {
      drawCurve(curves[i], t);
    }
  }

  function drawChevronPortal(t) {
    const pulse = 0.85 + Math.sin(t * 1.6) * 0.15;
    const haloR = 90 + Math.sin(t * 0.8) * 10;

    // Radial halo behind chevron
    const halo = ctx.createRadialGradient(CX, CY, 5, CX, CY, haloR);
    halo.addColorStop(0, COLORS.peachGlow + 'aa');
    halo.addColorStop(0.4, COLORS.peach + '55');
    halo.addColorStop(1, COLORS.peach + '00');
    ctx.fillStyle = halo;
    ctx.globalAlpha = pulse;
    ctx.beginPath();
    ctx.arc(CX, CY, haloR, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Chevron arrow (filled, peach с deeper edge)
    const w = 56, h = 80;
    ctx.save();
    ctx.translate(CX - w * 0.4, CY);
    ctx.fillStyle = COLORS.peach;
    ctx.shadowColor = COLORS.peach;
    ctx.shadowBlur = 24 * pulse;
    ctx.beginPath();
    ctx.moveTo(0, -h/2);
    ctx.lineTo(w * 0.3, -h/2);
    ctx.lineTo(w, 0);
    ctx.lineTo(w * 0.3, h/2);
    ctx.lineTo(0, h/2);
    ctx.lineTo(w * 0.7, 0);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Inner highlight
    ctx.fillStyle = COLORS.peachGlow;
    ctx.globalAlpha = 0.6 * pulse;
    ctx.beginPath();
    ctx.moveTo(2, -h/2 + 4);
    ctx.lineTo(w * 0.28, -h/2 + 4);
    ctx.lineTo(w * 0.5, 0);
    ctx.lineTo(w * 0.28, h/2 - 4);
    ctx.lineTo(2, h/2 - 4);
    ctx.lineTo(w * 0.5, 0);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function drawCurve(curveData, t) {
    const startX = CX + 22;
    const startY = CY;
    const endX = W - 8;
    const endY = H * curveData.yPercent;
    // Control points for smooth bezier
    const c1x = CX + (endX - CX) * 0.35;
    const c1y = startY + (endY - startY) * 0.05;
    const c2x = CX + (endX - CX) * 0.7;
    const c2y = endY - (endY - startY) * 0.05;

    // Draw curve line
    ctx.strokeStyle = COLORS.peach + '66';
    ctx.lineWidth = curveData.thickness;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(c1x, c1y, c2x, c2y, endX, endY);
    ctx.stroke();

    // Traveling glow dots along curve (3 per curve, phase-shifted)
    const dotsPerCurve = 3;
    for (let d = 0; d < dotsPerCurve; d++) {
      // Position 0..1 along bezier
      const phase = ((t * 0.25) + curveData.offset + (d / dotsPerCurve)) % 1;
      const pos = bezierPoint(startX, startY, c1x, c1y, c2x, c2y, endX, endY, phase);

      // Dot fade out near edges
      const alpha = Math.sin(phase * Math.PI) * 0.95;
      if (alpha < 0.02) continue;

      const dotR = 1.5 + curveData.thickness * 0.8;

      // Glow
      const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, dotR * 4);
      glow.addColorStop(0, COLORS.peachGlow);
      glow.addColorStop(0.4, COLORS.peach + '88');
      glow.addColorStop(1, COLORS.peach + '00');
      ctx.fillStyle = glow;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, dotR * 4, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.fillStyle = COLORS.peachGlow;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, dotR, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function bezierPoint(x0, y0, x1, y1, x2, y2, x3, y3, t) {
    const it = 1 - t;
    const it2 = it * it;
    const t2 = t * t;
    return {
      x: it2 * it * x0 + 3 * it2 * t * x1 + 3 * it * t2 * x2 + t2 * t * x3,
      y: it2 * it * y0 + 3 * it2 * t * y1 + 3 * it * t2 * y2 + t2 * t * y3,
    };
  }

  // -------------- Start animation --------------
  if (!reducedMotion) {
    raf = requestAnimationFrame(frame);
  } else {
    // Single static frame
    frame(performance.now());
  }

  // Cleanup helper
  window.heroCanvasStop = () => {
    if (raf) cancelAnimationFrame(raf);
    resizeObserver.disconnect();
  };
})();
