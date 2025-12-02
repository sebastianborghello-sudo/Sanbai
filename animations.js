// Animaciones de aparición (fade/slide) + parallax hero + tilt sutil en cards

(function() {
  // Fade / slide al hacer scroll
  const animated = document.querySelectorAll('.ani-fade, .ani-up');

  if (!('IntersectionObserver' in window) || animated.length === 0) {
    animated.forEach(el => el.classList.add('ani-visible'));
  } else {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('ani-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.18
      }
    );
    animated.forEach(el => obs.observe(el));
  }

  // Parallax suave en el hero (solo en desktop / pointer fino)
  const heroCore = document.querySelector('.hero-core');
  if (heroCore && window.matchMedia('(pointer: fine)').matches) {
    const depth = parseFloat(heroCore.dataset.parallaxDepth || '20');

    let rafId = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    function animate() {
      const lerp = 0.08;
      currentX += (targetX - currentX) * lerp;
      currentY += (targetY - currentY) * lerp;
      heroCore.style.transform =
        `translate3d(${currentX}px, ${currentY}px, 0) rotateX(${ -currentY / 60 }deg) rotateY(${ currentX / 60 }deg)`;
      rafId = requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', (e) => {
      const rect = heroCore.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const relX = (e.clientX - centerX) / rect.width;
      const relY = (e.clientY - centerY) / rect.height;

      targetX = -relX * depth;
      targetY = -relY * depth;

      if (!rafId) {
        rafId = requestAnimationFrame(animate);
      }
    });
  }

  // Tilt sutil en tarjetas (modelos, servicio, beneficios)
  const tiltEls = document.querySelectorAll('.tilt');
  if (tiltEls.length && window.matchMedia('(pointer: fine)').matches) {
    const maxTilt = 4; // grados

    tiltEls.forEach(el => {
      let rect = null;

      function handleMove(e) {
        if (!rect) rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const midX = rect.width / 2;
        const midY = rect.height / 2;
        const relX = (x - midX) / midX;
        const relY = (y - midY) / midY;

        const tiltX = (-relY * maxTilt).toFixed(2);
        const tiltY = (relX * maxTilt).toFixed(2);

        el.style.transform =
          `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-2px)`;
      }

      function handleLeave() {
        rect = null;
        el.style.transform =
          'perspective(700px) rotateX(0deg) rotateY(0deg) translateY(0)';
      }

      el.addEventListener('mousemove', handleMove);
      el.addEventListener('mouseleave', handleLeave);
    });
  }
})();
