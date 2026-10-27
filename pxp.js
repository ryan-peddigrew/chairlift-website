/* Chairlift PX-style concept: hero intro (logo -> word) and photo band push-in. */
(function () {
  var hero = document.querySelector('.pc-hero');
  var band = document.querySelector('.pc-band');
  if (!hero && !band) return;
  var root = document.documentElement;
  var logo = hero && hero.querySelector('.pc-logo');
  var word = hero && hero.querySelector('.pc-word');
  var stage = hero && hero.querySelector('.pc-stage');
  var ticking = false;
  function clamp(v) { return Math.min(1, Math.max(0, v)); }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function frame() {
    ticking = false;
    var vh = window.innerHeight, vw = window.innerWidth;
    if (hero) {
      var p = clamp(window.scrollY / Math.max(1, hero.offsetHeight - vh));
      root.style.setProperty('--p', p.toFixed(3));
      if (logo && word && stage) {
        var S0 = logo.offsetWidth;
        var sr = stage.getBoundingClientRect();
        var inner = word.querySelector('span[aria-hidden]') || word;
        var wr = inner.getBoundingClientRect();
        var S1 = Math.max(90, word.offsetHeight * 1.9);
        var cx0 = vw / 2, cy0 = vh / 2 - 40;
        var cx1 = Math.min(vw - S1 / 2 - 8, wr.right - sr.left + 10 + S1 / 2);
        var cy1 = wr.top - sr.top + wr.height * 0.52;
        var e = ease(clamp((p - .08) / .62));
        var cx = cx0 + (cx1 - cx0) * e, cy = cy0 + (cy1 - cy0) * e;
        var s = 1 + (S1 / S0 - 1) * e;
        logo.style.transform = 'translate(' + (cx - S0 / 2).toFixed(1) + 'px,' + (cy - S0 / 2).toFixed(1) + 'px) scale(' + s.toFixed(3) + ')';
      }
    }
    if (band) {
      var r = band.getBoundingClientRect();
      var bp = clamp((vh - r.top) / (r.height + vh));
      root.style.setProperty('--bp', bp.toFixed(3));
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  frame();
})();
