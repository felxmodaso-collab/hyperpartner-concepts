/* V3 · Hybrid: Veo bg + SVG crisp chevron + GSAP MotionPath particles on curves */
(() => {
  const init = () => {
    if (!window.gsap) return setTimeout(init, 40);
    if (window.MotionPathPlugin) window.gsap.registerPlugin(window.MotionPathPlugin);
    runIntro();
    runCurveFlow();
  };

  function runIntro() {
    const { gsap } = window;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    gsap.set('#chevron', { scale: 0.6, opacity: 0, transformOrigin: '1000px 540px' });
    gsap.set('#halo', { scale: 0.5, opacity: 0, transformOrigin: '960px 540px' });
    gsap.set('.curves path', { strokeDashoffset: 1 });

    tl.to('#bg', { opacity: 1, duration: 1.4, ease: 'power2.out' }, 0.1)
      .to('#halo', { scale: 1, opacity: 1, duration: 1.0, ease: 'power2.out' }, 0.6)
      .to('#chevron', { scale: 1, opacity: 1, duration: 0.9, ease: 'power3.out' }, 0.7)
      .to('.curves path', {
        strokeDashoffset: 0,
        duration: 1.1,
        ease: 'power2.inOut',
        stagger: { each: 0.05, from: 'center' },
      }, 1.0)
      .to('.labels g', {
        opacity: 1,
        duration: 0.6,
        stagger: { each: 0.04, from: 'center' },
        ease: 'power2.out',
      }, 1.5)
      .to('.hero-nav', { opacity: 1, duration: 0.7 }, 1.8)
      .to('.corners > span', { opacity: 1, duration: 0.4, stagger: 0.07 }, 1.9)
      .to('.eyebrow', { opacity: 1, duration: 0.5 }, 2.1)
      .to('.h1 .thin', { opacity: 1, duration: 0.55 }, 2.2)
      .to('.h1 .bold', { opacity: 1, duration: 0.55 }, 2.35)
      .to('.btn-peach, .btn-ghost', { opacity: 1, duration: 0.45, stagger: 0.08 }, 2.5)
      .to('.back-tests', { opacity: 1, duration: 0.4 }, 2.7);
  }

  function runCurveFlow() {
    const { gsap, MotionPathPlugin } = window;
    const TRACKS = [
      { r: 2,   shape: 'dot',     n: 8 },
      { r: 5,   shape: 'ring',    n: 4 },
      { r: 1.5, shape: 'dot',     n: 10 },
      { r: 7,   shape: 'square',  n: 5 },
      { r: 2,   shape: 'dot',     n: 8 },
      { r: 10,  shape: 'circle',  n: 4 },
      { r: 6,   shape: 'triangle',n: 4 },
      { r: 2,   shape: 'dot',     n: 9 },
      { r: 7,   shape: 'square',  n: 5 },
      { r: 5,   shape: 'ring',    n: 4 },
    ];

    const container = document.getElementById('curve-particles');
    if (!container) return;

    function createShape(track) {
      const ns = 'http://www.w3.org/2000/svg';
      let el;
      if (track.shape === 'dot' || track.shape === 'circle') {
        el = document.createElementNS(ns, 'circle');
        el.setAttribute('r', track.r);
        el.setAttribute('fill', '#E8A878');
      } else if (track.shape === 'ring') {
        el = document.createElementNS(ns, 'circle');
        el.setAttribute('r', track.r);
        el.setAttribute('fill', 'none');
        el.setAttribute('stroke', '#E8A878');
        el.setAttribute('stroke-width', 1.5);
      } else if (track.shape === 'square') {
        el = document.createElementNS(ns, 'rect');
        el.setAttribute('x', -track.r);
        el.setAttribute('y', -track.r);
        el.setAttribute('width', track.r * 2);
        el.setAttribute('height', track.r * 2);
        el.setAttribute('fill', '#E8A878');
      } else if (track.shape === 'triangle') {
        el = document.createElementNS(ns, 'polygon');
        const s = track.r * 1.2;
        el.setAttribute('points', `0,${-s} ${s * 0.866},${s * 0.5} ${-s * 0.866},${s * 0.5}`);
        el.setAttribute('fill', '#E8A878');
      }
      if (el) el.classList.add('curve-particle');
      return el;
    }

    TRACKS.forEach((track, idx) => {
      const path = document.getElementById('curve-' + idx);
      if (!path) return;
      for (let i = 0; i < track.n; i++) {
        const p = createShape(track);
        if (!p) continue;
        container.appendChild(p);
        const duration = 5.5 + Math.random() * 1.5;
        const start = (i / track.n) * duration;
        gsap.to(p, {
          duration, repeat: -1, ease: 'none',
          motionPath: { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: false },
          delay: -start,
        });
        gsap.to(p, {
          opacity: 0,
          duration: 0.5, repeat: -1,
          repeatDelay: duration - 1,
          ease: 'power1.in',
          delay: duration * 0.95 - start,
        });
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
