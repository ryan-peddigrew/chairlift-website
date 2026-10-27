/* Chairlift PX-style concept: hero intro (logo -> word) and photo band push-in. */
(function () {
  // header lettering options for review: ?nav=a|b|c|d (remembered per browser)
  try { var nv = (location.search.match(/nav=([a-d])/) || [])[1] || sessionStorage.getItem('pxnav'); if (nv) { document.documentElement.classList.add('nav-' + nv); sessionStorage.setItem('pxnav', nv); } } catch (e) {}
  var hero = document.querySelector('.pc-hero');
  var band = document.querySelector('.pc-band');
  var root = document.documentElement;
  var logo = hero && hero.querySelector('.pc-logo');
  var story = hero && hero.querySelector('.pc-story');
  var word = hero && hero.querySelector('.pc-word');
  var stage = hero && hero.querySelector('.pc-stage');
  if (logo) document.body.appendChild(logo);   // lift the landing logo out of the hero so it can stay docked in the top bar
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
    var armed = false; setTimeout(function () { armed = true; new Image().src = '/images/patrol/patroller.webp'; }, 6000);
    var guy = '<img src="/images/patrol/patroller.webp" alt="" width="727" height="1280" decoding="async">';
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
        '<div class="patrol__btns"><a class="patrol__go pc-link" href="/5min/">Take the lift <i class="ar" aria-hidden="true"></i></a><button class="patrol__no pc-link" type="button">I’m heading down <i class="ar" aria-hidden="true"></i></button></div></div></div>';
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
      // the pinned frame is 100svh, so its height stays put while iOS shows/hides the address bar: no jumps
      var pin = hero.querySelector('.pc-pin'), ph = pin ? pin.offsetHeight : vh;
      var D = Math.max(1, hero.offsetHeight - ph);           // scroll distance the hero story plays over
      var y = Math.max(0, window.scrollY);
      var p = clamp(y / (ph * .45));                          // logo flies up into the top bar first
      var q = clamp(y / D);                                   // then the story: headline settles, subhead, button
      root.style.setProperty('--p', p.toFixed(3));
      if (story) {
        var mv = ease(clamp((q - .06) / .34)), sb = clamp((q - .26) / .18), ct = clamp((q - .44) / .16);
        var top0 = (window._lb || ph * .62) + 6, top1 = Math.max(80, (ph - story.offsetHeight) / 2 + 20);
        story.style.transform = 'translateY(' + ((top1 - top0) * mv).toFixed(1) + 'px)';
        story.style.setProperty('--sb', sb.toFixed(3)); story.style.setProperty('--ct', ct.toFixed(3));
        story.classList.toggle('is-live', ct > .6);            // button only tappable once it's really there
      }
      root.style.setProperty('--p', p.toFixed(3));
      if (logo && word && stage) {
        var S0 = logo.offsetWidth;
        var sr = stage.getBoundingClientRect();
        var inner = word.querySelector('span[aria-hidden]') || word;
        var wr = inner.getBoundingClientRect();
        var S1 = Math.max(90, word.offsetHeight * 1.9);
        var cx0 = vw / 2, cy0 = ph * ((vw < 861 ? .4 : .42) + intro * .1);   // intro: logo sits dead centre, then rises to make room for the word
        window._lb = cy0 + S0 * .5; root.style.setProperty('--lb', window._lb.toFixed(0) + 'px');   // headline sits right under the wordmark
        var cx1 = Math.min(vw - S1 / 2 - 8, wr.right - sr.left + 10 + S1 / 2);
        var cy1 = (wr.top + wr.bottom) / 2 - sr.top + wr.height * .04;   // centred on the word's letters
        // landing logo docks into the top bar as you scroll (PX-style), then keeps spinning there
        var mark = document.querySelector('.site-header .brand svg');
        var mr = mark && mark.getBoundingClientRect();
        var e = ease(clamp(p / .85));
        var tx = mr && mr.width ? mr.left + mr.width / 2 : cx0, ty = mr && mr.width ? mr.top + mr.height / 2 : 34;
        var S1d = (mr && mr.width ? mr.width : 30) * 2.1;
        ty += S1d * .122;   // the ring sits 12% above the canvas centre (room for the word), so aim the canvas a touch lower and the ring lands dead centre
        var cx = cx0 + (tx - cx0) * e, cy = cy0 + (ty - cy0) * e, s = 1 + (S1d / S0 - 1) * e;
        logo.style.transform = 'translate(' + (cx - S0 / 2).toFixed(1) + 'px,' + (cy - S0 / 2).toFixed(1) + 'px) scale(' + s.toFixed(3) + ')';
        root.classList.toggle('logo-docked', logo.classList.contains('is-3d'));
        root.style.setProperty('--dk', e.toFixed(3));
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
  // intro screen (?intro=1): page locked on the spinning logo; the first scroll, touch, key or mouse move opens the homepage
  var intro = 0;
  if (root.classList.contains('px-intro')) {
    intro = 1; root.style.setProperty('--in', '1'); window.scrollTo(0, 0);
    var mx = null, my = null, go = function () {
      if (!root.classList.contains('px-intro')) return;
      root.classList.remove('px-intro');
      ['wheel', 'touchstart', 'keydown', 'pointerdown', 'mousemove'].forEach(function (t) { window.removeEventListener(t, gate, true); });
      var t0 = performance.now(), dur = reduce ? 1 : 1100;
      (function step(now) {
        intro = 1 - ease(clamp((now - t0) / dur)); root.style.setProperty('--in', intro.toFixed(3)); frame();
        if (intro > 0) requestAnimationFrame(step);
      })(t0);
    }, gate = function (e) {
      if (e.type === 'mousemove') { if (mx === null) { mx = e.clientX; my = e.clientY; return; } if (Math.abs(e.clientX - mx) + Math.abs(e.clientY - my) < 6) return; }
      if (e.type === 'wheel' || e.type === 'keydown') e.preventDefault();
      go();
    };
    ['wheel', 'touchstart', 'keydown', 'pointerdown', 'mousemove'].forEach(function (t) { window.addEventListener(t, gate, { capture: true, passive: false }); });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  frame();
})();

// background videos: iPhones in Low Power Mode refuse to autoplay video and show a play button instead.
// Moving images still play there, so if the hero video is blocked, swap in an animated WebP of the same footage.
(function () {
  var vids = [].slice.call(document.querySelectorAll('video.pc-photo'));
  vids.forEach(function (v) {
    var swapped = false;
    function swap() {
      if (swapped || !v.paused) return; swapped = true;
      var img = new Image();
      img.className = v.className; img.alt = ''; img.decoding = 'async';
      img.src = (v.getAttribute('src') || '').replace(/\.mp4$/, '.webp');
      img.onerror = function () { img.src = v.getAttribute('poster'); };
      v.parentNode.replaceChild(img, v);
    }
    var pr = v.play();
    if (pr && pr.catch) pr.catch(swap);
    setTimeout(swap, 1500);
  });
})();
