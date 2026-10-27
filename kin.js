/* Chairlift home: department switchboard and the haul line with its three-position lever. */
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

  /* ---------- lever ---------- */
  var lever = document.querySelector('.kn-lever'), mode = 1;
  if (lever) [].forEach.call(lever.querySelectorAll('button'), function (b) {
    b.addEventListener('click', function () {
      mode = +b.dataset.mode; lever.setAttribute('data-mode', mode);
      [].forEach.call(lever.querySelectorAll('button'), function (o) { o.setAttribute('aria-checked', o === b ? 'true' : 'false'); });
    });
  });

  /* ---------- the four stages follow the friction cleared ---------- */
  var stages = [].slice.call(document.querySelectorAll('.kn-stage'));
  function stagesFor(cp) {
    stages.forEach(function (s, i) {
      var on = cp >= (i + 1) * 24;
      if (s.classList.contains('on') === on) return;
      s.classList.toggle('on', on);
      s.querySelector('.kn-stage__st').textContent = on ? 'With Chairlift' : 'By hand';
    });
  }

  /* ---------- the haul schematic (canvas) ---------- */
  var cv = document.querySelector('.kn-canvas');
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d'), thru = document.querySelector('[data-cleared]');
  var LABELS = ['Stalled quotes', 'Missed follow-ups', 'Messy handoffs', 'Manual data entry', 'Scheduling gaps', 'Invoice delays', 'Siloed spreadsheets'];
  var DONE = { 'Stalled quotes': 'QUOTE SENT', 'Missed follow-ups': 'FOLLOWED UP', 'Messy handoffs': 'HANDED OFF', 'Manual data entry': 'SYNCED', 'Scheduling gaps': 'BOOKED', 'Invoice delays': 'INVOICED', 'Siloed spreadsheets': 'REPORTED' };
  var W = 0, H = 0, dpr = 1, fs = 11, nodes = [], carriers = [], angle = 0, rpm = 0, boost = 0, lastCap = 0, visible = true;
  var ptr = { x: -999, y: -999, on: false };
  var MODES = [{ rpm: .12, every: 0, jit: 2.2 }, { rpm: .6, every: 1400, jit: 1 }, { rpm: 1.3, every: 90, jit: .4 }], cleared = 0;

  function geo() {
    return { wx: W * .52, wy: H * .56, wr: Math.min(W, H) * (W < 480 ? .14 : .19), cx1: W + 30, cy1: H * .1 };
  }
  function size() {
    var r = cv.getBoundingClientRect(); dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fs = W < 480 ? 9.5 : 11;
    ctx.font = '500 ' + fs + 'px "JetBrains Mono", ui-monospace, monospace';
    nodes.forEach(function (n) { n.w = ctx.measureText(n.t.toUpperCase()).width + 16; });
  }
  function spawn(t, fromEdge) {
    ctx.font = '500 ' + fs + 'px "JetBrains Mono", ui-monospace, monospace';
    var w = ctx.measureText(t.toUpperCase()).width + 16;
    return { t: t, w: w, h: fs + 12, x: fromEdge ? -w : 10 + Math.random() * (W * .36 - w), y: 24 + Math.random() * (H - 70), vx: (Math.random() - .3) * .6, vy: (Math.random() - .5) * .6, cap: false };
  }
  function rr(x, y, w, h) { ctx.beginPath(); ctx.rect(x, y, w, h); }

  function step(now, dt) {
    var g = geo(), m = MODES[mode];
    boost *= .96;
    var target = m.rpm + boost;
    rpm += (target - rpm) * .05;
    angle += rpm * dt * .004;

    // capture a node into the wheel on the mode's rhythm
    if (m.every && now - lastCap > m.every) {
      var free = nodes.filter(function (n) { return !n.cap; });
      if (free.length > (mode === 2 ? 0 : 3)) { free.sort(function (a, b) { return b.x - a.x; })[0].cap = true; lastCap = now; }
    }
    var zoneR = W * .4;
    nodes.forEach(function (n, i) {
      if (n.cap) {                                              // pulled toward the bullwheel
        var dx = g.wx - (n.x + n.w / 2), dy = g.wy - (n.y + n.h / 2), d = Math.hypot(dx, dy);
        n.vx += dx / d * 1.1; n.vy += dy / d * 1.1; n.vx *= .88; n.vy *= .88;
        n.x += n.vx * dt * .06; n.y += n.vy * dt * .06;
        if (d < g.wr * .9) {                                  // through the wheel: becomes a carrier on the haul cable
          carriers.push({ t: n.t, s: 0 });
          nodes[i] = mode === 2 ? null : spawn(n.t, true);   // overdrive: every node locks onto the line
        }
        return;
      }
      n.vx += (Math.random() - .5) * .12 * m.jit; n.vy += (Math.random() - .5) * .12 * m.jit;
      if (ptr.on) {                                             // the cursor shoves friction around
        var px = n.x + n.w / 2 - ptr.x, py = n.y + n.h / 2 - ptr.y, pd = Math.hypot(px, py);
        if (pd < 90) { n.vx += px / pd * 1.4; n.vy += py / pd * 1.4; }
      }
      n.vx *= .94; n.vy *= .94;
      n.x += n.vx * dt * .06; n.y += n.vy * dt * .06;
      if (n.x < 6) { n.x = 6; n.vx = Math.abs(n.vx); }
      if (n.x + n.w > zoneR) { n.x = zoneR - n.w; n.vx = -Math.abs(n.vx); }
      if (n.y < 20) { n.y = 20; n.vy = Math.abs(n.vy); }
      if (n.y + n.h > H - 34) { n.y = H - 34 - n.h; n.vy = -Math.abs(n.vy); }
    });
    nodes = nodes.filter(Boolean);
    if (mode !== 2 && nodes.length < LABELS.length) LABELS.forEach(function (t) {   // back out of overdrive: friction returns
      if (!nodes.some(function (n) { return n.t === t; }) && !carriers.some(function (c) { return c.t === t && c.s < .9; })) nodes.push(spawn(t, true));
    });
    // box collisions between free nodes
    for (var a = 0; a < nodes.length; a++) for (var b = a + 1; b < nodes.length; b++) {
      var A = nodes[a], B = nodes[b]; if (A.cap || B.cap) continue;
      var ox = Math.min(A.x + A.w, B.x + B.w) - Math.max(A.x, B.x), oy = Math.min(A.y + A.h, B.y + B.h) - Math.max(A.y, B.y);
      if (ox > 0 && oy > 0) {
        if (ox < oy) { var sx = (A.x < B.x ? -1 : 1) * ox / 2; A.x += sx; B.x -= sx; var t = A.vx; A.vx = B.vx; B.vx = t; }
        else { var sy = (A.y < B.y ? -1 : 1) * oy / 2; A.y += sy; B.y -= sy; var u = A.vy; A.vy = B.vy; B.vy = u; }
      }
    }
    // carriers ride the cable, held equidistant
    var gap = .2, sp = rpm * dt * .00018;
    carriers.sort(function (p, q) { return q.s - p.s; });
    if (mode === 2) {                                          // overdrive: carriers hold in synchronized formation
      var seen = {};
      carriers = carriers.filter(function (c) { if (seen[c.t]) return false; seen[c.t] = 1; return true; });
      gap = .105;
      carriers.forEach(function (c, i) { var slot = .82 - i * gap; c.s += (slot - c.s) * Math.min(1, dt * .006); });
    } else carriers.forEach(function (c, i) {
      c.s += sp;
      if (i > 0 && carriers[i - 1].s - c.s < gap) c.s = carriers[i - 1].s - gap;
    });
    carriers = carriers.filter(function (c) { return c.s < 1.05; });
    var goal = mode === 2 ? Math.min(1, carriers.length / LABELS.length) : mode === 1 ? Math.min(.8, carriers.length / LABELS.length * 1.4) : 0;
    cleared += (goal - cleared) * Math.min(1, dt * .004);
    if (thru) { var cp = Math.round(cleared * 100); if (goal === 1 && cp >= 99) cp = 100; thru.textContent = ('00' + cp).slice(-3) + '%'; thru.classList.toggle('on', cp === 100); stagesFor(cp); }
  }

  function cablePt(g, s) {
    var sx = g.wx + g.wr * .7, sy = g.wy - g.wr * .7;
    return { x: sx + (g.cx1 - sx) * s, y: sy + (g.cy1 - sy) * s + Math.sin(s * Math.PI) * 10 };
  }

  function draw() {
    var g = geo();
    ctx.clearRect(0, 0, W, H);
    // engineering grid
    ctx.strokeStyle = 'rgba(255,255,255,.045)'; ctx.lineWidth = 1;
    for (var gx = 0; gx < W; gx += 32) { ctx.beginPath(); ctx.moveTo(gx + .5, 0); ctx.lineTo(gx + .5, H); ctx.stroke(); }
    for (var gy = 0; gy < H; gy += 32) { ctx.beginPath(); ctx.moveTo(0, gy + .5); ctx.lineTo(W, gy + .5); ctx.stroke(); }
    // zone divider
    ctx.setLineDash([2, 4]); ctx.strokeStyle = 'rgba(255,255,255,.14)';
    ctx.beginPath(); ctx.moveTo(W * .4 + .5, 12); ctx.lineTo(W * .4 + .5, H - 30); ctx.stroke(); ctx.setLineDash([]);

    // return cable (slack, steel) and haul cable (taut, white, soft glow)
    var p0 = cablePt(g, 0);
    ctx.strokeStyle = 'rgba(142,146,153,.45)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(g.wx + g.wr * .7, g.wy + g.wr * .7);
    ctx.quadraticCurveTo(W * .8, H * .55, g.cx1, g.cy1 + 40); ctx.stroke();
    ctx.save(); ctx.strokeStyle = '#fff'; ctx.globalAlpha = .95; ctx.lineWidth = 1.4; ctx.shadowColor = 'rgba(255,255,255,.35)'; ctx.shadowBlur = 6;
    ctx.beginPath(); ctx.moveTo(p0.x, p0.y);
    for (var s = .05; s <= 1.0001; s += .05) { var q = cablePt(g, s); ctx.lineTo(q.x, q.y); }
    ctx.stroke(); ctx.restore();
    // grips ticking up the line
    ctx.fillStyle = 'rgba(255,255,255,.35)';
    var off = (angle * .05) % .08;
    for (var k = off; k < 1; k += .08) { var gp = cablePt(g, k); ctx.fillRect(gp.x - 1, gp.y - 1, 2, 2); }

    // bullwheel
    ctx.save(); ctx.translate(g.wx, g.wy);
    ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, 0, g.wr, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(0, 0, g.wr * 1.18, 0, Math.PI * 2); ctx.stroke();
    ctx.rotate(angle);
    ctx.strokeStyle = 'rgba(255,255,255,.6)';
    for (var i = 0; i < 12; i++) { var a = i * Math.PI / 6; ctx.beginPath(); ctx.moveTo(Math.cos(a) * g.wr * .18, Math.sin(a) * g.wr * .18); ctx.lineTo(Math.cos(a) * g.wr * .96, Math.sin(a) * g.wr * .96); ctx.stroke(); }
    for (var j = 0; j < 24; j++) { var b2 = j * Math.PI / 12; ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillRect(Math.cos(b2) * g.wr * 1.18 - 1, Math.sin(b2) * g.wr * 1.18 - 1, 2, 2); }
    ctx.restore();
    ctx.fillStyle = '#0C111C'; ctx.strokeStyle = 'rgba(255,255,255,.85)';
    ctx.beginPath(); ctx.arc(g.wx, g.wy, g.wr * .16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // tension tower
    ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.beginPath(); ctx.moveTo(g.wx, g.wy + g.wr * 1.18); ctx.lineTo(g.wx - g.wr * .5, H - 30); ctx.moveTo(g.wx, g.wy + g.wr * 1.18); ctx.lineTo(g.wx + g.wr * .5, H - 30); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.font = '400 ' + (fs - 1.5) + 'px "JetBrains Mono", monospace';
    ctx.fillText((rpm * 40).toFixed(1) + ' RPM', g.wx + g.wr * 1.3, g.wy + g.wr * 1.1);

    // friction nodes
    ctx.font = '500 ' + fs + 'px "JetBrains Mono", ui-monospace, monospace'; ctx.textBaseline = 'middle';
    nodes.forEach(function (n) {
      var jx = n.cap ? 0 : (Math.random() - .5) * MODES[mode].jit * .8;
      ctx.fillStyle = '#0C111C'; rr(n.x + jx, n.y, n.w, n.h); ctx.fill();
      ctx.strokeStyle = n.cap ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.4)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = n.cap ? '#fff' : 'rgba(255,255,255,.72)';
      ctx.fillText(n.t.toUpperCase(), n.x + jx + 8, n.y + n.h / 2 + .5);
    });

    // carriers: tidy, equidistant, hanging from the cable
    carriers.forEach(function (c) {
      var p = cablePt(g, c.s), lbl = DONE[c.t] || 'DONE', ch = 14;
      ctx.font = '600 ' + (fs - 3) + 'px "JetBrains Mono", monospace'; var cw = ctx.measureText(lbl).width + 8;
      ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, p.y + 12); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.fillRect(p.x - cw / 2, p.y + 12, cw, ch);
      ctx.fillStyle = '#141B2A';
      ctx.fillText(lbl, p.x - cw / 2 + 4, p.y + 12 + ch / 2 + .5);
      if (mode === 2) { ctx.fillStyle = '#3DFFC1'; ctx.fillRect(p.x - 2, p.y - 2, 4, 4); }   // locked grip
    });
  }

  function init() {
    size();
    nodes = LABELS.map(function (t) { return spawn(t, false); });
    if (reduce) { for (var i = 0; i < 40; i++) step(performance.now() + i * 600, 16); draw(); return; }
    var last = performance.now();
    (function frame(now) {
      requestAnimationFrame(frame);
      var dt = Math.min(48, now - last); last = now;
      if (!visible) return;
      step(now, dt); draw();
    })(last);
  }
  cv.addEventListener('pointermove', function (e) {
    var r = cv.getBoundingClientRect(), nx = e.clientX - r.left, ny = e.clientY - r.top;
    if (ptr.on) boost = Math.min(2.2, boost + Math.hypot(nx - ptr.x, ny - ptr.y) * .004);
    ptr.x = nx; ptr.y = ny; ptr.on = true;
  }, { passive: true });
  cv.addEventListener('pointerleave', function () { ptr.on = false; });
  window.addEventListener('resize', size);
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(cv);
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(init);
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
  var labels = [].slice.call(document.querySelectorAll('main .sx-line, main .sx-label, .kn-engine__head span:first-child, .pc-pkgs .mono'))
    .filter(function (n) { return !n.children.length; });
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { decode(e.target); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px' });
    labels.forEach(function (n) { io.observe(n); });
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
