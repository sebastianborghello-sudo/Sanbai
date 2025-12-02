// Animaciones sutiles al hacer scroll (fade + slide suave)

(function() {
  const items = document.querySelectorAll('.ani-fade, .ani-up');
  if (!('IntersectionObserver' in window) || items.length === 0) {
    // Fallback: mostrar todo
    items.forEach(el => el.classList.add('ani-visible'));
    return;
  }

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('ani-visible');
          obs.unobserve(entry.target); // solo animar una vez
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.15
    }
  );

  items.forEach(el => obs.observe(el));
})();
// animations
