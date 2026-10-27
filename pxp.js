/* Chairlift PX-style concept: hero intro (logo -> word) and photo band push-in. */
(function () {
  var hero = document.querySelector('.pc-hero');
  var band = document.querySelector('.pc-band');
  var root = document.documentElement;
  var logo = hero && hero.querySelector('.pc-logo');
  var word = hero && hero.querySelector('.pc-word');
  var stage = hero && hero.querySelector('.pc-stage');
  var ticking = false;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sps = [].slice.call(document.querySelectorAll('.pc-hero ~ section, .pc-hero ~ .pc-band, .paper-split, .retro--wide'));
  var scrubs = [].slice.call(document.querySelectorAll('[data-scrub]'));
  var route = document.querySelector('.pc-pkgs'), stops = route ? [].slice.call(route.children) : [];
  // split scrub paragraphs into words, keeping inline <em> wrappers
  scrubs.forEach(function (el) {
    (function walk(node) {
      [].slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var f = document.createDocumentFragment();
          n.nodeValue.split(/(\s+)/).forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) { f.appendChild(document.createTextNode(' ')); return; }
            var s = document.createElement('span'); s.className = 'w'; s.textContent = t; f.appendChild(s);
          });
          n.parentNode.replaceChild(f, n);
        } else if (n.nodeType === 1) walk(n);
      });
    })(el);
  });
  var lits = [].slice.call(document.querySelectorAll('.pg-lede, .lead-big, .stage-sum, .pc-cols p, .pc-lead--small, .pc-list li span'));
  lits.forEach(function (el) {
    el.setAttribute('data-lit', '');
    (function walk(node) {
      [].slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var f = document.createDocumentFragment();
          n.nodeValue.split(/(\s+)/).forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) { f.appendChild(document.createTextNode(' ')); return; }
            var s = document.createElement('span'); s.className = 'w'; s.textContent = t; f.appendChild(s);
          });
          n.parentNode.replaceChild(f, n);
        } else if (n.nodeType === 1 && n.tagName !== 'A') walk(n);
      });
    })(el);
    el._w = [].slice.call(el.querySelectorAll('.w'));
  });
  var words = scrubs.length ? [].slice.call(document.querySelectorAll('[data-scrub] .w')) : [];
  var scrubSec = document.querySelector('.pc-sec--scrub');
  // reveal on enter
  var rvSel = 'main h2, .stage, .pg-tiles, .pc-h2, .pc-list li, .pc-cols p, .pc-links, .pc-pkgs article, .pc-benefits article, .pc-founder, .paper-split > *, .ticket, .pc-band__txt, .retro--wide';
  var rv = [].slice.call(document.querySelectorAll(rvSel));
  rv.forEach(function (el, i) { el.classList.add('rv'); var sib = [].indexOf.call(el.parentNode.children, el); el.style.setProperty('--rd', Math.min(sib, 6) * 90 + 'ms'); });
  if (reduce || !('IntersectionObserver' in window)) rv.forEach(function (el) { el.classList.add('in'); });
  else {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -12% 0px', threshold: .05 });
    rv.forEach(function (el) { io.observe(el); });
  }
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
    lits.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -50 || r.top > vh + 50) return;
      var lp = reduce ? 1 : clamp((vh * .92 - r.top) / (vh * .5));
      var n = el._w.length, lit = lp * (n + 3);
      el._w.forEach(function (w, i) { w.classList.toggle('on', i < lit); });
    });
    sps.forEach(function (el) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--sp', clamp((vh - r.top) / (r.height + vh)).toFixed(3));
    });
    if (scrubSec && words.length) {
      var sr2 = scrubSec.getBoundingClientRect();
      var sp = clamp(-sr2.top / Math.max(1, sr2.height - vh) * 1.08);
      var lit = reduce ? words.length : sp * (words.length + 4);
      words.forEach(function (w, i) { w.classList.toggle('on', i < lit); });
    }
    if (route) {
      var rr = route.getBoundingClientRect();
      var rp = clamp((vh * .78 - rr.top) / (Math.min(rr.height, vh) * 1.1));
      route.parentNode.style.setProperty('--rp', rp.toFixed(3));
      stops.forEach(function (s, i) { s.classList.toggle('is-on', rp >= i / stops.length + .02); });
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
