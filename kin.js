/* Chairlift home: department switchboard and the by-hand vs with-Chairlift job flow. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- switchboard: one department at a time ---------- */
  var out = document.querySelector('[data-dept-out]'), code = document.querySelector('[data-dept-code]'), tools = document.querySelector('[data-dept-tools]');
  function typeInto(p, text) {
    if (reduce) { p.textContent = text; return; }
    var i = 0;
    (function t() { i += 3; p.textContent = text.slice(0, i); if (i < text.length) setTimeout(t, 10); })();
  }
  [].forEach.call(document.querySelectorAll('.kn-sw'), function (b) {
    b.addEventListener('click', function () {
      [].forEach.call(document.querySelectorAll('.kn-sw'), function (o) { o.setAttribute('aria-checked', o === b ? 'true' : 'false'); });
      var tpl = document.querySelector('template[data-dept="' + b.dataset.i + '"]');
      if (!tpl || !out) return;
      var f = tpl.content;
      code.textContent = 'Department ' + f.querySelector('b').textContent;
      tools.textContent = 'Built around: ' + f.querySelector('i').textContent;
      out.innerHTML = '';
      var h = document.createElement('h3'), d = document.createElement('p');
      out.appendChild(h); out.appendChild(d);
      h.textContent = f.querySelector('h3').textContent;
      typeInto(d, f.querySelector('p').textContent);
      out.classList.remove('flash'); void out.offsetWidth; out.classList.add('flash');
    });
  });

  /* ---------- the shift: one job, by hand vs with Chairlift ---------- */
  var flow = document.querySelector('[data-flow]');
  if (flow) {
    var btns = [].slice.call(flow.querySelectorAll('[data-way]')), cap = flow.querySelector('[data-cap]'), count = flow.querySelector('[data-count]');
    var steps = [].slice.call(flow.querySelectorAll('.kn-step'));
    var CAP = ['Every step waits for a person to get to it.', 'Every step hands the job to the next one.'];
    var COUNT = ['4 places a job can sit and wait', 'Nothing waiting on a person'];
    var way = -1, touched = false;
    function set(w, step) {
      if (w === way) return; way = w;
      btns.forEach(function (b) { var on = +b.dataset.way === w; b.setAttribute('aria-checked', on ? 'true' : 'false'); });
      flow.dataset.way = w; cap.textContent = CAP[w]; count.textContent = COUNT[w];
      steps.forEach(function (s, i) { setTimeout(function () { s.classList.toggle('on', w === 1); }, w === 1 && !reduce ? i * 260 : 0); });
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { touched = true; set(+b.dataset.way); }); });
    set(0);
    // scroll it into view and it plays once by itself, so the point lands before anyone reads a word
    if ('IntersectionObserver' in window && !reduce) {
      var seen = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return; seen.disconnect();
        setTimeout(function () { if (!touched) set(1); }, 1500);
      }, { threshold: .5 });
      seen.observe(flow);
    }
  }
})();

/* Ride-up extras: altimeter, lift stops that light in order, decoding labels, precision cursor. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  root.classList.add('kn-js');

  /* ---------- altimeter: base 1,200 m to summit 2,850 m as you scroll ---------- */
  var alt = document.createElement('div');
  alt.className = 'kn-alt'; alt.setAttribute('aria-hidden', 'true');
  alt.innerHTML = '<span class="kn-alt__lbl">Elevation</span><b>1,200</b><span class="kn-alt__u">m</span><i class="kn-alt__bar"><i></i></i><span class="kn-alt__lbl kn-alt__state">Base</span>';
  document.body.appendChild(alt);
  var altN = alt.querySelector('b'), altFill = alt.querySelector('.kn-alt__bar i'), altState = alt.querySelector('.kn-alt__state');
  var hero = document.querySelector('.pc-hero, .pc-pin');
  function altimeter() {
    var max = Math.max(1, document.documentElement.scrollHeight - innerHeight), k = Math.min(1, Math.max(0, scrollY / max));
    altN.textContent = Math.round(1200 + k * 1650).toLocaleString('en-CA');
    altFill.style.transform = 'scaleY(' + k.toFixed(3) + ')';
    altState.textContent = k > .97 ? 'Summit' : k < .03 ? 'Base' : 'Riding';
    alt.classList.toggle('on', !hero || hero.getBoundingClientRect().bottom < innerHeight * .5);
    alt.classList.toggle('top', k > .97);
  }
  window.addEventListener('scroll', function () { requestAnimationFrame(altimeter); }, { passive: true });
  window.addEventListener('resize', altimeter); altimeter();

  /* ---------- the lift: stops light up in order as you pass them ---------- */
  var stops = [].slice.call(document.querySelectorAll('.pc-pkgs article'));
  function light() {
    stops.forEach(function (s) { if (s.getBoundingClientRect().top < innerHeight * .72) s.classList.add('kn-lit'); });
  }
  if (stops.length && !reduce) { root.classList.add('kn-stops'); window.addEventListener('scroll', function () { requestAnimationFrame(light); }, { passive: true }); light(); }

  /* ---------- section labels decode as they appear ---------- */
  var GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·/+';
  function decode(n) {
    var final = n.textContent, len = final.length, t0 = performance.now(), dur = 650;
    (function step(t) {
      var k = Math.min(1, (t - t0) / dur), out = '';
      for (var i = 0; i < len; i++) { var c = final[i]; out += (c === ' ' || i < k * len) ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]; }
      n.textContent = k < 1 ? out : final;
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }
  // numbers roll like a departure board before they land
  function tick(n) {
    var final = n.textContent, t0 = performance.now(), dur = 900;
    (function step(t) {
      var k = Math.min(1, (t - t0) / dur), out = '';
      for (var i = 0; i < final.length; i++) out += k > (i + 1) / (final.length + 1) ? final[i] : (Math.random() * 10 | 0);
      n.textContent = k < 1 ? out : final;
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }
  // numbered index above each section title: 01 ———— 06
  var heads = [].slice.call(document.querySelectorAll('main .sx-head'));
  heads.forEach(function (h, i) {
    var p = document.createElement('p'); p.className = 'kn-idx'; p.setAttribute('aria-hidden', 'true');
    p.innerHTML = '<b>' + ('0' + (i + 1)).slice(-2) + '</b><i></i><b>' + ('0' + heads.length).slice(-2) + '</b>';
    h.insertBefore(p, h.firstChild);
  });
  var labels = [].slice.call(document.querySelectorAll('main .sx-line, main .sx-label, .kn-engine__head span:first-child, .pc-pkgs .mono, .pc-benefits .mono, .kn-stage > .mono, .kn-sw__n'))
    .filter(function (n) { return !n.children.length; });
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { if (e.target.classList.contains('kn-idx')) { e.target.classList.add('in'); [].forEach.call(e.target.children, function (b) { if (b.tagName === 'B') tick(b); }); } else decode(e.target); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px' });
    labels.forEach(function (n) { io.observe(n); });
    heads.forEach(function (h) { io.observe(h.firstChild); });
  }

  /* ---------- precision cursor (mouse and trackpad only) ---------- */
  if (fine && !reduce) {
    var cur = document.createElement('div');
    cur.className = 'kn-cur'; cur.setAttribute('aria-hidden', 'true');
    cur.innerHTML = '<span class="kn-cur__ring"></span><span class="kn-cur__dot"></span>';
    document.body.appendChild(cur);
    var ring = cur.firstChild, dot = cur.lastChild, mx = -100, my = -100, rx = mx, ry = my, snap = null, live = false;
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      mx = e.clientX; my = e.clientY;
      if (!live) { live = true; rx = mx; ry = my; root.classList.add('kn-cur-on'); loop(); }
    }, { passive: true });
    document.addEventListener('mouseleave', function () { root.classList.remove('kn-cur-on'); live = false; });
    document.addEventListener('pointerover', function (e) {
      var t = e.target.closest && e.target.closest('a, button, label, input, textarea, select, canvas');
      snap = t && t.tagName !== 'CANVAS' && t.tagName !== 'INPUT' && t.tagName !== 'TEXTAREA' ? t : null;
      root.classList.toggle('kn-cur-snap', !!snap);
      root.classList.toggle('kn-cur-field', !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA'));
    });
    var loop = function () {
      if (!live) return;
      var tx = mx, ty = my, w = 28, h = 28;
      if (snap) {
        var r = snap.getBoundingClientRect();
        if (r.width < 420 && r.height < 120) { tx = r.left + r.width / 2 + (mx - r.left - r.width / 2) * .15; ty = r.top + r.height / 2 + (my - r.top - r.height / 2) * .15; w = r.width + 12; h = r.height + 12; }
      }
      rx += (tx - rx) * .2; ry += (ty - ry) * .2;
      ring.style.transform = 'translate(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px)';
      ring.style.width = w + 'px'; ring.style.height = h + 'px'; ring.style.margin = (-h / 2) + 'px 0 0 ' + (-w / 2) + 'px';
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
      requestAnimationFrame(loop);
    };
  }
})();

/* the tag picker reports back like a terminal: > awaiting input, then > friction.tag [QUOTING] [BILLING] */
(function () {
  var log = document.querySelector('[data-log]'); if (!log) return;
  var boxes = [].slice.call(document.querySelectorAll('.kn-tag input'));
  function sync() {
    var on = boxes.filter(function (b) { return b.checked; }).map(function (b) { return '[' + b.value.toUpperCase() + ']'; });
    log.textContent = on.length ? '> friction.tag ' + on.join(' ') : '> awaiting input';
    var c = document.createElement('i'); c.className = 'kn-caret'; c.setAttribute('aria-hidden', 'true'); log.appendChild(c);
  }
  boxes.forEach(function (b) { b.addEventListener('change', sync); });
})();
