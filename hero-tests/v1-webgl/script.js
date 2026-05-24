/* ==========================================================
   V1 · WebGL+SVG hero
   Three.js particles (left chaos) + SVG chevron + GSAP MotionPath on curves
   Sidewave-style intro choreography
   ========================================================== */

(() => {
  const init = () => {
    if (!window.THREE || !window.gsap) { return setTimeout(init, 40); }
    if (window.MotionPathPlugin) window.gsap.registerPlugin(window.MotionPathPlugin);

    runWebGL();
    runIntro();
    runCurveFlow();
  };

  // ===== WEBGL: left chaos particles =====
  function runWebGL() {
    const canvas = document.getElementById('webgl-bg');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 12;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const COUNT = window.innerWidth < 768 ? 350 : 900;
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const alphas = new Float32Array(COUNT);
    const colors = new Float32Array(COUNT * 3);

    const COL_PEACH = new THREE.Color('#E8A878');
    const COL_CREAM = new THREE.Color('#F4ECDD');

    function rng(a, b) { return a + Math.random() * (b - a); }

    function spawnParticle(i) {
      // Strictly left third of view; never reach center
      positions[i * 3 + 0] = rng(-14, -5);
      positions[i * 3 + 1] = rng(-5, 5);
      positions[i * 3 + 2] = rng(-2, 2);
      velocities[i * 3 + 0] = rng(0.008, 0.022);
      velocities[i * 3 + 1] = rng(-0.0015, 0.0015);
      velocities[i * 3 + 2] = rng(-0.0008, 0.0008);
      const z = positions[i * 3 + 2];
      // smaller sizes, focused DOF
      sizes[i] = (Math.abs(z) < 0.7 ? rng(8, 18) : rng(3, 8));
      alphas[i] = Math.abs(z) < 0.7 ? rng(0.55, 0.85) : rng(0.1, 0.28);
      const c = Math.random() > 0.45 ? COL_PEACH : COL_CREAM;
      colors[i * 3 + 0] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }
    for (let i = 0; i < COUNT; i++) spawnParticle(i);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle sprite (round, soft glow)
    function makeSprite() {
      const c = document.createElement('canvas');
      c.width = 64; c.height = 64;
      const ctx = c.getContext('2d');
      const grd = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grd.addColorStop(0, 'rgba(255,255,255,1)');
      grd.addColorStop(0.3, 'rgba(255,255,255,0.65)');
      grd.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    }
    const sprite = makeSprite();

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTex: { value: sprite },
        uOpacity: { value: 0 }, // animated by intro
      },
      vertexShader: `
        attribute float size;
        attribute float alpha;
        attribute vec3 color;
        varying float vAlpha;
        varying vec3 vColor;
        void main() {
          vAlpha = alpha;
          vColor = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTex;
        uniform float uOpacity;
        varying float vAlpha;
        varying vec3 vColor;
        void main() {
          vec4 t = texture2D(uTex, gl_PointCoord);
          gl_FragColor = vec4(vColor, t.a * vAlpha * uOpacity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // mouse parallax
    let mx = 0, my = 0, tx = 0, ty = 0;
    window.addEventListener('mousemove', (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const posAttr = geo.attributes.position;
    function loop() {
      // update positions
      for (let i = 0; i < COUNT; i++) {
        let x = posAttr.array[i * 3 + 0];
        let y = posAttr.array[i * 3 + 1];
        let z = posAttr.array[i * 3 + 2];
        x += velocities[i * 3 + 0];
        y += velocities[i * 3 + 1];
        z += velocities[i * 3 + 2];

        // mouse repulsion (only for left side)
        const wx = x; // world x
        if (wx < 2) {
          const sx = (wx / 12) - mx * 0.3;
          const dx = mx * 8 - wx;
          const dy = -my * 5 - y;
          const d2 = dx * dx + dy * dy + 0.5;
          const force = 0.025 / d2;
          x -= dx * force;
          y -= dy * force;
        }

        // respawn when reaching right edge of left chaos zone (never enters center)
        if (x > -3) {
          x = rng(-14, -12);
          y = rng(-5, 5);
          z = rng(-2, 2);
          velocities[i * 3 + 0] = rng(0.008, 0.022);
        }

        posAttr.array[i * 3 + 0] = x;
        posAttr.array[i * 3 + 1] = y;
        posAttr.array[i * 3 + 2] = z;
      }
      posAttr.needsUpdate = true;

      // smooth camera parallax
      tx += (mx - tx) * 0.04;
      ty += (my - ty) * 0.04;
      camera.position.x = tx * 0.4;
      camera.position.y = -ty * 0.3;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    }
    loop();

    // expose material for intro fade-in
    window.__webglMat = mat;
  }

  // ===== INTRO choreography =====
  function runIntro() {
    const { gsap } = window;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 0. chevron + halo starts hidden + scaled down
    gsap.set('#chevron', { scale: 0.6, opacity: 0, transformOrigin: '1000px 540px' });
    gsap.set('#halo', { scale: 0.5, opacity: 0, transformOrigin: '960px 540px' });
    gsap.set('.curves path', { strokeDashoffset: 1 });

    // 1. (0–0.6s) chevron + halo materialize from nothing
    tl.to('#halo', { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out' }, 0.2)
      .to('#chevron', { scale: 1, opacity: 1, duration: 1.0, ease: 'power3.out' }, 0.3);

    // 2. (0.8–1.6s) WebGL particles fade in
    tl.to({ v: 0 }, {
      v: 1, duration: 1.0, ease: 'power2.out',
      onUpdate: function() {
        if (window.__webglMat) window.__webglMat.uniforms.uOpacity.value = this.targets()[0].v;
      }
    }, 0.6);

    // 3. (0.9–1.8s) curves draw stroke
    tl.to('.curves path', {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: 'power2.inOut',
      stagger: { each: 0.05, from: 'center' },
    }, 0.9);

    // 4. (1.5–2.2s) labels fade in
    tl.to('.labels g', {
      opacity: 1,
      duration: 0.7,
      stagger: { each: 0.04, from: 'center' },
      ease: 'power2.out',
    }, 1.5);

    // 5. (2.0–2.8s) UI overlay
    tl.to('.hero-nav', { opacity: 1, duration: 0.8 }, 2.0)
      .to('.corners > span', { opacity: 1, duration: 0.5, stagger: 0.08 }, 2.1)
      .to('.eyebrow', { opacity: 1, duration: 0.5 }, 2.3)
      .to('.h1 .thin', { opacity: 1, duration: 0.6 }, 2.4)
      .to('.h1 .bold', { opacity: 1, duration: 0.6 }, 2.55)
      .to('.btn-peach, .btn-ghost', { opacity: 1, duration: 0.5, stagger: 0.08 }, 2.7)
      .to('.back-tests', { opacity: 1, duration: 0.4 }, 2.9);
  }

  // ===== CURVE FLOW: particles travel along each SVG path =====
  function runCurveFlow() {
    const { gsap, MotionPathPlugin } = window;
    if (!MotionPathPlugin) {
      console.warn('MotionPathPlugin not loaded — using fallback');
    }

    // Per-curve size/shape distribution (checkerboard random)
    // Each curve: {r: radius, shape: 'dot'|'circle'|'square'|'triangle'|'ring', n: particles count}
    const TRACKS = [
      { r: 2,  shape: 'dot',     n: 8 },  // 0 CRM — tiny dots
      { r: 5,  shape: 'ring',    n: 4 },  // 1 Отчёт — open rings
      { r: 1.5, shape: 'dot',    n: 10 }, // 2 Дашборд — micro dots
      { r: 7,  shape: 'square',  n: 5 },  // 3 SMS — squares chain
      { r: 2,  shape: 'dot',     n: 8 },  // 4 Аналитика — tiny dots
      { r: 10, shape: 'circle',  n: 4 },  // 5 Экспорт — large circles
      { r: 6,  shape: 'triangle',n: 4 },  // 6 База — triangles
      { r: 2,  shape: 'dot',     n: 9 },  // 7 Уведомление — tiny dots
      { r: 7,  shape: 'square',  n: 5 },  // 8 Статистика — squares
      { r: 5,  shape: 'ring',    n: 4 },  // 9 Архив — open rings
    ];

    const container = document.getElementById('curve-particles');
    if (!container) return;

    function createShape(track, id) {
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
      if (el) {
        el.classList.add('curve-particle');
        el.dataset.id = id;
      }
      return el;
    }

    TRACKS.forEach((track, idx) => {
      const path = document.getElementById('curve-' + idx);
      if (!path) return;

      for (let i = 0; i < track.n; i++) {
        const p = createShape(track, idx + '-' + i);
        if (!p) continue;
        container.appendChild(p);

        const duration = 5.5 + Math.random() * 1.5;
        const start = (i / track.n) * duration;
        gsap.to(p, {
          duration,
          repeat: -1,
          ease: 'none',
          motionPath: {
            path: path,
            align: path,
            alignOrigin: [0.5, 0.5],
            autoRotate: false,
          },
          delay: -start, // stagger initial positions evenly along curve
        });
        // fade at start (chevron edge) and end (label)
        gsap.to(p, {
          opacity: 0,
          duration: 0.5,
          repeat: -1,
          repeatDelay: duration - 1,
          ease: 'power1.in',
          delay: duration * 0.95 - start,
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
