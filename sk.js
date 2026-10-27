/* Chairlift — Swiss Kinetic Hardware: telemetry, precision cursor, decode labels, switchboard, haul schematic. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  [].forEach.call(document.querySelectorAll('[data-year]'), function (n) { n.textContent = new Date().getFullYear(); });

  /* ---------- telemetry: elevation and velocity from scroll ---------- */
  var els = [].slice.call(document.querySelectorAll('[data-el]'));
  var vel = document.querySelector('[data-vel]');
  var lastY = window.scrollY, lastT = performance.now(), v = 0, ticking = false;
  function tele() {
    ticking = false;
    var max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    var y = Math.max(0, window.scrollY), now = performance.now();
    var el = Math.round(y / max * 2850);
    var s = ('0000' + el).slice(-4);
    els.forEach(function (n) { n.textContent = s; });
    var dt = Math.max(16, now - lastT);
    var inst = Math.abs(y - lastY) / dt * 1000 * (2850 / max);   // metres per second on the 2,850 m line
    v = v * .7 + inst * .3; lastY = y; lastT = now;
    if (vel) vel.textContent = v.toFixed(1);
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(tele); } }, { passive: true });
  setInterval(function () { v *= .6; if (vel) vel.textContent = v.toFixed(1); }, 250);
  tele();

  /* ---------- decode labels as they enter the viewport ---------- */
  var GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#+-·';
  function scramble(n) {
    var final = n.textContent, len = final.length, start = performance.now(), dur = 700;
    function step(t) {
      var k = Math.min(1, (t - start) / dur), out = '';
      for (var i = 0; i < len; i++) {
        var c = final[i];
        out += (c === ' ' || i < k * len) ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      n.textContent = out;
      if (k < 1) requestAnimationFrame(step); else n.textContent = final;
    }
    requestAnimationFrame(step);
  }
  var scr = [].slice.call(document.querySelectorAll('.sk-scr'));
  var rv = [].slice.call(document.querySelectorAll('.sk-head h2, .sk-stage, .sk-readout, .sk-board, .sk-term--intake, .sk-case h2'));
  if ('IntersectionObserver' in window && !reduce) {
    rv.forEach(function (n) { n.classList.add('sk-rv'); });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        if (e.target.classList.contains('sk-scr')) scramble(e.target); else e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    scr.concat(rv).forEach(function (n) { io.observe(n); });
  }

  /* ---------- precision cursor with magnetic snap ---------- */
  if (fine && !reduce) {
    root.classList.add('sk-cur');
    var cur = document.querySelector('.sk-cursor'), ring = cur.querySelector('.sk-cursor__ring'), dot = cur.querySelector('.sk-cursor__dot');
    var mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, snap = null;
    window.addEventListener('pointermove', function (e) { mx = e.clientX; my = e.clientY; cur.style.opacity = 1; }, { passive: true });
    cur.style.opacity = 0;
    [].forEach.call(document.querySelectorAll('.sk-mag, .sk-sw, .sk-brand, .sk-nav a, .sk-foot__nav a'), function (b) {
      b.addEventListener('pointerenter', function () { snap = b; root.classList.add('sk-snap'); });
      b.addEventListener('pointerleave', function () { snap = null; root.classList.remove('sk-snap'); b.style.transform = ''; });
    });
    (function loop() {
      var tx = mx, ty = my, w = 30, h = 30;
      if (snap) {
        var r = snap.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        tx = cx + (mx - cx) * .2; ty = cy + (my - cy) * .2; w = r.width + 10; h = r.height + 10;
        if (snap.classList.contains('sk-mag')) snap.style.transform = 'translate(' + ((mx - cx) * .12).toFixed(1) + 'px,' + ((my - cy) * .18).toFixed(1) + 'px)';
      }
      rx += (tx - rx) * .22; ry += (ty - ry) * .22;
      ring.style.transform = 'translate(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px)';
      ring.style.width = w + 'px'; ring.style.height = h + 'px'; ring.style.margin = (-h / 2) + 'px 0 0 ' + (-w / 2) + 'px';
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- switchboard: one department at a time ---------- */
  var out = document.querySelector('[data-cap-out]'), code = document.querySelector('[data-cap-code]'), tools = document.querySelector('[data-cap-tools]');
  function typeInto(p, text) {
    if (reduce) { p.textContent = text; return; }
    var i = 0;
    (function t() { i += 3; p.textContent = text.slice(0, i); if (i < text.length) setTimeout(t, 10); })();
  }
  [].forEach.call(document.querySelectorAll('.sk-sw'), function (b) {
    b.addEventListener('click', function () {
      [].forEach.call(document.querySelectorAll('.sk-sw'), function (o) { o.setAttribute('aria-checked', o === b ? 'true' : 'false'); });
      var tpl = document.querySelector('template[data-cap="' + b.dataset.i + '"]');
      if (!tpl || !out) return;
      var f = tpl.content;
      code.textContent = 'SCHEMATIC // ' + f.querySelector('b').textContent;
      tools.textContent = 'BUILT AROUND: ' + f.querySelector('i').textContent;
      out.innerHTML = '';
      var h = document.createElement('h3'), d = document.createElement('p');
      out.appendChild(h); out.appendChild(d);
      h.textContent = f.querySelector('h3').textContent;
      typeInto(d, f.querySelector('p').textContent);
      out.classList.remove('flash'); void out.offsetWidth; out.classList.add('flash');
    });
  });

  /* ---------- operational shift slider ---------- */
  var shift = document.querySelector('[data-shift]');
  if (shift) {
    var range = shift.querySelector('input'), pct = shift.querySelector('[data-pct]'), rows = shift.querySelectorAll('.sk-shift__row');
    var paint = function () {
      var v = +range.value;
      shift.style.setProperty('--v', v + '%');
      var left = Math.round(14 - 14 * v / 100);
      pct.textContent = v + '% — Chairlift engaged (' + left + (left === 1 ? ' handoff' : ' handoffs') + ')';
      pct.classList.toggle('sk-ok', v === 100);
      [].forEach.call(rows, function (r) {
        var on = v >= +r.dataset.at;
        r.classList.toggle('on', on);
        r.querySelector('.sk-shift__st').textContent = on ? 'CHAIRLIFT' : 'MANUAL';
      });
    };
    range.addEventListener('input', paint); paint();
  }

  /* ---------- process spine fills as you scroll ---------- */
  var spine = document.querySelector('[data-spine]');
  if (spine) {
    var phs = spine.querySelectorAll('.sk-phase');
    var fill = function () {
      var r = spine.getBoundingClientRect(), k = Math.max(0, Math.min(1, (innerHeight * .6 - r.top) / r.height));
      spine.style.setProperty('--k', k);
      [].forEach.call(phs, function (ph) { ph.classList.toggle('lit', ph.getBoundingClientRect().top < innerHeight * .6); });
    };
    window.addEventListener('scroll', function () { requestAnimationFrame(fill); }, { passive: true }); fill();
  }

  /* ---------- dispatch terminal: tag bottlenecks, carry them to booking or the form ---------- */
  var intake = document.querySelector('[data-intake]');
  if (intake) {
    var log = intake.querySelector('[data-log]'), book = intake.querySelector('[data-book]'), field = intake.querySelector('[data-tags-field]'), cal = intake.dataset.cal;
    var sync = function () {
      var on = [].map.call(intake.querySelectorAll('.sk-tag[aria-pressed="true"]'), function (t) { return t.dataset.tag; });
      field.value = on.join(', ');
      log.innerHTML = '';
      log.appendChild(document.createTextNode(on.length ? '> friction.tag ' + on.map(function (t) { return '[' + t.toUpperCase() + ']'; }).join(' ') : '> awaiting input'));
      var c = document.createElement('span'); c.className = 'sk-caret'; log.appendChild(c);
      if (/^https?:/.test(cal)) book.href = on.length ? cal + (cal.indexOf('?') < 0 ? '?' : '&') + 'notes=' + encodeURIComponent('Heaviest friction: ' + on.join(', ')) : cal;
    };
    [].forEach.call(intake.querySelectorAll('.sk-tag'), function (t) {
      t.addEventListener('click', function () { t.setAttribute('aria-pressed', t.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); sync(); });
    });
  }

  /* ---------- haul mode lever ---------- */
  var lever = document.querySelector('.sk-lever'), mode = 1;
  if (lever) {
    lever.setAttribute('data-mode', '1');
    [].forEach.call(lever.querySelectorAll('button'), function (b) {
      b.addEventListener('click', function () {
        mode = +b.dataset.mode; lever.setAttribute('data-mode', mode);
        [].forEach.call(lever.querySelectorAll('button'), function (o) { o.setAttribute('aria-checked', o === b ? 'true' : 'false'); });
      });
    });
  }

  /* ---------- the haul schematic (canvas) ---------- */
  var cv = document.querySelector('.sk-canvas');
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d'), thru = document.querySelector('[data-thru]');
  var LABELS = ['Stalled quotes', 'Missed follow-ups', 'Messy handoffs', 'Manual data entry', 'Scheduling gaps', 'Invoice delays', 'Siloed spreadsheets'];
  var DONE = { 'Stalled quotes': 'QUOTE SENT', 'Missed follow-ups': 'FOLLOWED UP', 'Messy handoffs': 'HANDED OFF', 'Manual data entry': 'SYNCED', 'Scheduling gaps': 'BOOKED', 'Invoice delays': 'INVOICED', 'Siloed spreadsheets': 'REPORTED' };
  var W = 0, H = 0, dpr = 1, fs = 11, nodes = [], carriers = [], angle = 0, rpm = 0, boost = 0, lastCap = 0, visible = true;
  var ptr = { x: -999, y: -999, on: false };
  var MODES = [{ rpm: .12, every: 0, jit: 2.2 }, { rpm: .6, every: 1400, jit: 1 }, { rpm: 1.3, every: 90, jit: .4 }], cleared = 0;

  function geo() {
    return { wx: W * .52, wy: H * .56, wr: Math.min(W, H) * (W < 480 ? .13 : .15), cx1: W + 30, cy1: H * .1 };
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
        n.vx += dx / d * .5; n.vy += dy / d * .5; n.vx *= .86; n.vy *= .86;
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
      gap = .105;
      carriers.forEach(function (c, i) { var slot = .82 - i * gap; c.s += (slot - c.s) * Math.min(1, dt * .006); });
    } else carriers.forEach(function (c, i) {
      c.s += sp;
      if (i > 0 && carriers[i - 1].s - c.s < gap) c.s = carriers[i - 1].s - gap;
    });
    carriers = carriers.filter(function (c) { return c.s < 1.05; });
    var goal = mode === 2 ? Math.min(1, carriers.length / LABELS.length) : mode === 1 ? Math.min(.8, carriers.length / LABELS.length * 1.4) : 0;
    cleared += (goal - cleared) * .04;
    if (thru) { var cp = Math.round(cleared * 100); if (goal === 1 && cp >= 99) cp = 100; thru.textContent = ('00' + cp).slice(-3) + '%'; thru.classList.toggle('sk-ok', cp === 100); }
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
