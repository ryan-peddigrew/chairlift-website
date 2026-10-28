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
    /* live line: jobs queue up on the ground by hand, then ride the cable when Chairlift runs them */
    (function () {
      var cv = flow.querySelector('.kn-canvas'); if (!cv || !cv.getContext) return;
      var g = cv.getContext('2d'), W = 0, H = 0, dpr = 1, vis = true, last = 0;
      var chips = [], ghosts = [], flashes = [], jobNo = 13, done = 0, spawnT = 0, cableOff = 0, pulse = [0, 0, 0, 0];
      var svc = [0, 3.4, 4.6, 3.2], busy = [null, null, null, null];   // seconds a person needs at each step by hand (step 1 is just the arrival)
      var MONO = '500 10px "IBM Plex Mono", ui-monospace, Menlo, monospace';
      function size() {
        dpr = Math.min(2, window.devicePixelRatio || 1);
        W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      function sx(i) { return (i + .5) / 4 * W; }
      function cy() { return H * .64; }
      function spawn() { chips.push({ x: -50, y: 0, lift: 0, st: 0, w: 0, no: ++jobNo, state: 'run', q: 0, t: 0 }); }
      function step(dt) {
        var fast = flow.dataset.way === '1', sp = (fast ? 300 : 78) * W / 1000;
        cableOff = (cableOff + (fast ? 170 : 14) * dt) % 26;
        spawnT += dt;
        var waiting = chips.filter(function (c) { return c.state === 'wait'; }).length;
        if (spawnT > (fast ? .5 : 1.0) && (fast || waiting < 10)) { spawnT = 0; spawn(); }
        for (var i = 0; i < 4; i++) pulse[i] = Math.max(0, pulse[i] - dt * 2.2);
        var queues = [[], [], [], []];
        chips.forEach(function (c) {
          c.lift += ((fast ? 1 : 0) - c.lift) * Math.min(1, dt * 6);
          if (c.state === 'run') {
            c.x += sp * dt;
            var s = c.st; if (s < 4) {
              var gx = sx(s) - 24 - Math.min(58, W * .13) - 8;
              if (!fast && s > 0 && c.x >= gx) { c.x = gx; c.state = 'wait'; c.t = 0; }
              else if (c.x >= sx(s)) { c.st++; pulse[s] = 1; }
            }
            if (c.x > W + 50) { c.dead = 1; done++; flashes.push({ x: W - 12, y: cy(), t: 0 }); }
          }
          if (c.state === 'wait') { c.x = sx(c.st) - 24 - Math.min(58, W * .13) - 8; queues[c.st].push(c); }
        });
        // no overlapping: a moving job keeps a gap to the one ahead of it
        var cw = Math.min(58, W * .13) + 8, mv = chips.filter(function (c) { return c.state === 'run'; }).sort(function (p, q) { return q.x - p.x; });
        for (var m = 1; m < mv.length; m++) if (mv[m].x > mv[m - 1].x - cw) mv[m].x = mv[m - 1].x - cw;
        for (var j = 0; j < 4; j++) {
          var q = queues[j];
          q.forEach(function (c, k) { c.q = k; });
          if (!q.length) { busy[j] = null; continue; }
          var head = q[0];
          if (busy[j] !== head) { busy[j] = head; head.t = 0; }
          head.t += dt;
          var need = fast ? .12 : svc[j] * (.85 + (head.no * 7 % 5) * .08);
          if (head.t >= need) {
            head.state = 'run'; head.st = j + 1; pulse[j] = 1; busy[j] = null;
            if (j === 2) for (var d = 0; d < 2; d++) ghosts.push({ x: sx(2) + 6, y: cy() - 22 - d * 22, t: 0, no: head.no });   // re-typed into more places
          }
        }
        chips = chips.filter(function (c) { return !c.dead; });
        ghosts.forEach(function (o) { o.t += dt; }); ghosts = ghosts.filter(function (o) { return o.t < 1.4; });
        flashes.forEach(function (o) { o.t += dt; }); flashes = flashes.filter(function (o) { return o.t < .6; });
      }
      function chip(x, y, label, a, solid, hang) {
        var w = Math.min(58, W * .13), h = 22;
        g.globalAlpha = a;
        if (hang) { g.strokeStyle = 'rgba(255,255,255,' + (.55 * hang) + ')'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x + w / 2, cy()); g.lineTo(x + w / 2, y); g.stroke(); }
        g.beginPath(); (g.roundRect ? g.roundRect(x, y, w, h, 6) : g.rect(x, y, w, h));
        if (solid) { g.fillStyle = '#fff'; g.fill(); g.fillStyle = '#141B2A'; } else { g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 1; g.stroke(); g.fillStyle = 'rgba(255,255,255,.75)'; }
        g.font = W < 520 ? MONO.replace('10px', '9px') : MONO; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(label, x + w / 2, y + h / 2 + .5);
        g.globalAlpha = 1;
      }
      function draw(now) {
        var fast = flow.dataset.way === '1', c0 = cy();
        g.clearRect(0, 0, W, H);
        // cable with moving ticks, and the ground line the queue sits on
        g.strokeStyle = 'rgba(255,255,255,.28)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, c0); g.lineTo(W, c0); g.stroke();
        g.strokeStyle = 'rgba(255,255,255,' + (fast ? .5 : .2) + ')'; g.lineWidth = 1; g.beginPath();
        for (var x = -26 + cableOff; x < W; x += 26) { g.moveTo(x, c0 - 5); g.lineTo(x, c0 + 5); } g.stroke();
        // stations
        for (var i = 0; i < 4; i++) {
          var X = sx(i), act = pulse[i], waitN = chips.filter(function (c) { return c.state === 'wait' && c.st === i; }).length;
          g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1; g.beginPath(); g.moveTo(X, c0 + 12); g.lineTo(X - 7, c0 + 46); g.moveTo(X, c0 + 12); g.lineTo(X + 7, c0 + 46); g.stroke();
          g.beginPath(); g.arc(X, c0, 11 + act * 3, 0, 7); g.fillStyle = '#141B2A'; g.fill();
          g.strokeStyle = 'rgba(255,255,255,' + (.5 + act * .5) + ')'; g.lineWidth = 2; g.stroke();
          g.font = MONO; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = act > 0 ? '#fff' : 'rgba(255,255,255,.7)'; g.fillText(String(i + 1), X, c0 + .5);
          if (busy[i] && !fast) {   // a person is working on it: progress ring
            var need = svc[i] * (.85 + (busy[i].no * 7 % 5) * .08), k = Math.min(1, busy[i].t / need);
            g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.arc(X, c0, 17, -Math.PI / 2, -Math.PI / 2 + k * Math.PI * 2); g.stroke();
          }
          if (waitN > 0 && !fast) { g.font = MONO; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.fillStyle = '#fff'; g.fillText(waitN + ' WAITING', X - 49, c0 - 30 - Math.min(waitN - 1, 3) * 22 - 6); }
        }
        // jobs
        chips.forEach(function (c) {
          if (c.state === 'wait' && c.q > 3) return;   // the rest of the pile is hidden behind the count
          var y = c.state === 'wait' ? c0 - 30 - Math.min(c.q, 3) * 22 : c0 - 30 + c.lift * 44 + (fast ? Math.sin(now / 260 + c.no) * 1.5 : 0);
          chip(c.x, y, 'JOB ' + c.no, c.state === 'wait' ? .85 : 1, c.state === 'run', c.lift);
          c.y = y;
        });
        ghosts.forEach(function (o) { chip(o.x, o.y, 'JOB ' + o.no, Math.max(0, .7 - o.t / 2), false, 0); });
        flashes.forEach(function (o) { g.beginPath(); g.arc(o.x, o.y, 8 + o.t * 40, 0, 7); g.strokeStyle = 'rgba(61,255,193,' + (.8 - o.t * 1.3) + ')'; g.lineWidth = 2; g.stroke(); });
        // readout
        var wn = chips.filter(function (c) { return c.state === 'wait'; }).length;
        g.font = MONO; g.textBaseline = 'top'; g.textAlign = 'left'; g.fillStyle = 'rgba(255,255,255,.6)'; g.fillText('LIVE DEMO', 14, H - 20);
        g.textAlign = 'right'; g.fillStyle = '#fff'; g.fillText('WAITING ' + ('0' + wn).slice(-2) + '   FINISHED ' + ('00' + done).slice(-3), W - 14, H - 20);
      }
      function loop(now) {
        requestAnimationFrame(loop);
        if (!vis) { last = now; return; }
        var dt = Math.min(.05, (now - (last || now)) / 1000); last = now;
        step(dt); draw(now);
      }
      size(); window.addEventListener('resize', size);
      if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { vis = e[0].isIntersecting; }).observe(cv);
      for (var n = 0; n < 420; n++) step(.05);   // start mid-day, with the work already backed up
      if (reduce) draw(0); else requestAnimationFrame(loop);
    })();
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
