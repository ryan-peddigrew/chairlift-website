/* Chairlift PX-style concept: hero intro (logo -> word) and photo band push-in. */
(function () {
  // header lettering options for review: ?nav=a|b|c|d (remembered per browser)
  try { var nv = (location.search.match(/nav=([a-d])/) || [])[1] || sessionStorage.getItem('pxnav'); if (nv) { document.documentElement.classList.add('nav-' + nv); sessionStorage.setItem('pxnav', nv); } } catch (e) {}
  var hero = document.querySelector('.pc-hero');
  var band = document.querySelector('.pc-band');
  var root = document.documentElement;
  var logo = hero && hero.querySelector('.pc-logo');
  var word = hero && hero.querySelector('.pc-word');
  var stage = hero && hero.querySelector('.pc-stage');
  var ticking = false;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sps = [].slice.call(document.querySelectorAll('.pc-hero ~ section, .pc-hero ~ .pc-band, .paper-split, .retro--wide, .pc-ridge'));
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
  var pins = [].slice.call(document.querySelectorAll('.pc-pinscrub'));
  pins.forEach(function (s) { s._w = [].slice.call(s.querySelectorAll('[data-scrub] .w')); });
  // reveal on enter
  var rvSel = 'main h2, .stage, .pg-tiles, .sx-title, .sx-cap, .pc-h2, .pc-list li, .pc-cols p, .pc-links, .pc-pkgs article, .pc-benefits article, .pc-founder, .paper-split > *, .ticket, .pc-band__txt, .retro--wide';
  var rv = [].slice.call(document.querySelectorAll(rvSel));
  rv.forEach(function (el, i) { el.classList.add('rv'); var sib = [].indexOf.call(el.parentNode.children, el); el.style.setProperty('--rd', Math.min(sib, 6) * 90 + 'ms'); });
  if (reduce || !('IntersectionObserver' in window)) rv.forEach(function (el) { el.classList.add('in'); });
  else {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -12% 0px', threshold: .05 });
    rv.forEach(function (el) { io.observe(el); });
  }

  // Ski Patrol exit check: desktop when the pointer leaves through the top, phones when someone switches away and comes back. Once per visit.
  (function () {
    var KEY = 'pxpatrol', shown = false;
    try { if (sessionStorage.getItem(KEY)) return; } catch (e) {}
    if (location.pathname.indexOf('/5min') === 0 || location.pathname.indexOf('/thanks') === 0) return;
    var armed = false; setTimeout(function () { armed = true; }, 6000);
    var guy = '<svg viewBox="0 0 160 170" aria-hidden="true">' +
      '<path d="M18 170c4-34 26-52 62-52s58 18 62 52z" fill="#C8312B"/>' +
      '<path d="M80 118c-9 0-16 2-22 6l22 22 22-22c-6-4-13-6-22-6z" fill="#A9241F"/>' +
      '<path d="M106 136h8v8h8v8h-8v8h-8v-8h-8v-8h8z" fill="#fff"/>' +
      '<path d="M66 104h28v18c0 6-28 6-28 0z" fill="#E7B48F"/>' +
      '<ellipse cx="80" cy="76" rx="34" ry="38" fill="#F1C29C"/>' +
      '<ellipse cx="46" cy="80" rx="6" ry="9" fill="#E7B48F"/><ellipse cx="114" cy="80" rx="6" ry="9" fill="#E7B48F"/>' +
      '<path d="M44 66c0-26 16-40 36-40s36 14 36 40c-10-6-24-9-36-9s-26 3-36 9z" fill="#141B2A"/>' +
      '<path d="M48 60c8-4 20-6 32-6s24 2 32 6" stroke="#3DFFC1" stroke-width="3" fill="none"/>' +
      '<path d="M50 72h60" stroke="#2a3346" stroke-width="3"/>' +
      '<path d="M52 70h24c0 12-4 17-12 17s-12-6-12-17zM84 70h24c0 11-4 17-12 17s-12-5-12-17z" fill="#1B2A44" stroke="#c9d1de" stroke-width="2.2"/>' +
      '<path d="M57 73l8 0M89 73l8 0" stroke="rgba(255,255,255,.55)" stroke-width="2.5" stroke-linecap="round"/>' +
      '<path d="M80 80c-3 6-4 10 0 12" stroke="#C99673" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
      '<path d="M52 100c6-9 16-10 28-6 12-4 22-3 28 6-6 2-10 7-16 7-5 0-9-3-12-5-3 2-7 5-12 5-6 0-10-5-16-7z" fill="#E9ECF1" stroke="#c4cad4" stroke-width="1"/>' +
      '<path d="M70 108c4 3 16 3 20 0" stroke="#9b5e48" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
      '<path d="M54 92c3 1 6 1 8 0M98 92c3 1 6 1 8 0" stroke="#d9a17d" stroke-width="1.6" fill="none"/>' +
      '</svg>';
    function open() {
      if (shown) return; shown = true;
      try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
      var d = document.createElement('div');
      d.className = 'patrol';
      d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-labelledby', 'patrol-h');
      d.innerHTML = '<div class="patrol__card">' +
        '<button class="patrol__x" type="button" aria-label="Close">&times;</button>' +
        '<div class="patrol__guy">' + guy + '</div>' +
        '<div class="patrol__txt"><p class="patrol__tag">Ski Patrol</p>' +
        '<h2 id="patrol-h">Whoa there. Did you mean to leave the hill?</h2>' +
        '<p>Before you go, give us five minutes. We’ll talk through the work eating your team’s week.</p>' +
        '<div class="patrol__btns"><a class="patrol__go" href="/5min/">Start a conversation</a><button class="patrol__no" type="button">I’m heading down</button></div></div></div>';
      document.body.appendChild(d);
      var last = document.activeElement;
      function close() { d.classList.remove('is-on'); setTimeout(function () { d.remove(); }, 400); document.removeEventListener('keydown', esc); if (last && last.focus) last.focus(); }
      function esc(e) { if (e.key === 'Escape') close(); }
      d.addEventListener('click', function (e) { if (e.target === d || e.target.closest('.patrol__x, .patrol__no')) close(); });
      document.addEventListener('keydown', esc);
      requestAnimationFrame(function () { d.classList.add('is-on'); d.querySelector('.patrol__go').focus({ preventScroll: true }); });
    }
    document.addEventListener('mouseout', function (e) { if (armed && !e.relatedTarget && e.clientY <= 0) open(); });
    var away = 0;
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) away = Date.now();
      else if (armed && away && Date.now() - away > 1500 && matchMedia('(hover: none)').matches) open();
    });
  })();

  // band video (reel 5) on phones only: portrait footage fits portrait screens; desktop keeps the full-res photo
  var bv = document.querySelector('.pc-band__vid');
  if (bv && matchMedia('(max-width: 860px)').matches && !reduce) {
    bv.src = bv.getAttribute('data-src'); bv.classList.add('is-on');
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { var pr = bv.play(); if (pr && pr.catch) pr.catch(function () {}); } else bv.pause(); }); }).observe(bv);
  }
  function clamp(v) { return Math.min(1, Math.max(0, v)); }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function frame() {
    ticking = false;
    var vh = window.innerHeight, vw = window.innerWidth;
    if (hero) {
      root.classList.toggle('over-hero', hero.getBoundingClientRect().bottom > 70);
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
        var cy1 = (wr.top + wr.bottom) / 2 - sr.top + wr.height * .04;   // centred on the word's letters
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
    pins.forEach(function (sec) {
      var r = sec.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var sp = reduce ? 1 : clamp(-r.top / Math.max(1, r.height - vh) * 1.12);
      sec.style.setProperty('--fp', sp.toFixed(3));
      sec.style.setProperty('--ro', (1 - Math.min(sp * 1.5, 1)).toFixed(3));
      var ws = sec._w, lit = sp * (ws.length + 4);
      ws.forEach(function (w, i) { w.classList.toggle('on', i < lit); });
    });
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
