/* V2 · Veo Loop hero — minimal intro */
(() => {
  const init = () => {
    if (!window.gsap) return setTimeout(init, 40);
    const { gsap } = window;
    const bg = document.getElementById('bg');
    if (bg) bg.playbackRate = 1.0;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('#bg', { opacity: 1, duration: 1.6, ease: 'power2.out' }, 0.2)
      .to('.hero-nav', { opacity: 1, duration: 0.8 }, 0.8)
      .to('.corners > span', { opacity: 1, duration: 0.5, stagger: 0.08 }, 1.0)
      .to('.eyebrow', { opacity: 1, duration: 0.5 }, 1.2)
      .to('.h1 .thin', { opacity: 1, duration: 0.6 }, 1.4)
      .to('.h1 .bold', { opacity: 1, duration: 0.6 }, 1.55)
      .to('.btn-peach, .btn-ghost', { opacity: 1, duration: 0.5, stagger: 0.08 }, 1.7)
      .to('.back-tests', { opacity: 1, duration: 0.4 }, 1.9);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
