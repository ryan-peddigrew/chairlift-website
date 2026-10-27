/* Chairlift PX-style concept: scroll progress for hero and photo band. */
(function () {
  var hero = document.querySelector('.pc-hero');
  var band = document.querySelector('.pc-band');
  if (!hero && !band) return;
  var root = document.documentElement;
  var ticking = false;
  function frame() {
    ticking = false;
    var vh = window.innerHeight;
    if (hero) {
      var p = Math.min(1, Math.max(0, window.scrollY / hero.offsetHeight));
      root.style.setProperty('--p', p.toFixed(3));
    }
    if (band) {
      var r = band.getBoundingClientRect();
      var bp = Math.min(1, Math.max(0, (vh - r.top) / (r.height + vh)));
      root.style.setProperty('--bp', bp.toFixed(3));
    }
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  frame();
})();
