/* Homepage "Mountain air" layer (2 Nov 2026): contour lines, lift tickets, drag-to-clear divider, dot grid. Our own code. See air.css. */
(function () {
  'use strict';
  var body = document.body, root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  function clamp(v) { return Math.min(1, Math.max(0, v)); }
  function onFrame(fn) { var t = false; function k() { t = false; fn(); } function q() { if (!t) { t = true; requestAnimationFrame(k); } } window.addEventListener('scroll', q, { passive: true }); window.addEventListener('resize', q); fn(); }

  
    var pointer = { x: -9999, y: -9999, t: 0 };
    window.addEventListener('pointermove', function (e) { pointer.x = e.clientX; pointer.y = e.clientY; pointer.t = performance.now(); }, { passive: true });

    // topo contour lines that bend toward the pointer (ripple background)
    var pin = document.querySelector('.pc-scrub__pin');
    if (pin && !reduce) {
      var cv = document.createElement('canvas'); cv.className = 'air-topo'; cv.setAttribute('aria-hidden', 'true'); pin.insertBefore(cv, pin.firstChild);
      var g = cv.getContext('2d'), W = 0, H = 0, dpr = 1, vis = false;
      function sizeT() { dpr = Math.min(1.5, window.devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); }
      sizeT(); window.addEventListener('resize', sizeT);
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }, { threshold: .05 }).observe(cv);
      // a small, smooth height field: a few soft hills, plus a dent that follows the pointer
      var hills = [[.22, .3, .9], [.7, .25, .7], [.5, .8, .8], [.85, .7, .6], [.1, .85, .5]];
      function h(x, y, px, py, pw) {
        var v = 0;
        for (var i = 0; i < hills.length; i++) { var dx = x - hills[i][0], dy = y - hills[i][1]; v += hills[i][2] * Math.exp(-(dx * dx + dy * dy) * 9); }
        var ddx = x - px, ddy = y - py; v -= pw * .9 * Math.exp(-(ddx * ddx + ddy * ddy) * 60);
        return v;
      }
      var sx = .5, sy = .5, sw = 0, ph = 0;
      (function loop(now) {
        // phones: draw the contour lines once when they come into view, then stop, so nothing animates on battery
        if (!vis || fine) requestAnimationFrame(loop);
        if (!vis) return;
        var r = cv.getBoundingClientRect(), tx, ty, tw;
        if (fine && now - pointer.t < 2500) { tx = (pointer.x - r.left) / W; ty = (pointer.y - r.top) / H; tw = 1; }
        else { ph += .004; tx = .5 + Math.sin(ph) * .3; ty = .5 + Math.cos(ph * .7) * .3; tw = .7; }
        sx += (tx - sx) * .08; sy += (ty - sy) * .08; sw += (tw - sw) * .05;
        g.clearRect(0, 0, W, H);
        g.strokeStyle = 'rgba(255,255,255,.22)'; g.lineWidth = 1;
        // marching squares on a coarse grid, 14 contour levels
        var cols = Math.max(24, Math.round(W / 26)), rows = Math.max(18, Math.round(H / 26)), f = [];
        for (var j = 0; j <= rows; j++) { f[j] = []; for (var i = 0; i <= cols; i++) f[j][i] = h(i / cols, j / rows, sx, sy, sw); }
        var cw = W / cols, chh = H / rows;
        g.beginPath();
        for (var L = 0; L < 14; L++) {
          var lv = .08 + L * .09;
          for (var jj = 0; jj < rows; jj++) for (var ii = 0; ii < cols; ii++) {
            var a = f[jj][ii], b = f[jj][ii + 1], c = f[jj + 1][ii + 1], d = f[jj + 1][ii];
            var idx = (a > lv ? 8 : 0) | (b > lv ? 4 : 0) | (c > lv ? 2 : 0) | (d > lv ? 1 : 0);
            if (idx === 0 || idx === 15) continue;
            var x0 = ii * cw, y0 = jj * chh;
            function lerp(p, q, va, vb) { return p + (q - p) * ((lv - va) / ((vb - va) || 1e-6)); }
            var top = [lerp(x0, x0 + cw, a, b), y0], right = [x0 + cw, lerp(y0, y0 + chh, b, c)], bottom = [lerp(x0, x0 + cw, d, c), y0 + chh], left = [x0, lerp(y0, y0 + chh, a, d)];
            var segs = { 1: [left, bottom], 2: [bottom, right], 3: [left, right], 4: [top, right], 5: [top, left, bottom, right], 6: [top, bottom], 7: [top, left], 8: [top, left], 9: [top, bottom], 10: [top, right, bottom, left], 11: [top, right], 12: [left, right], 13: [bottom, right], 14: [left, bottom] }[idx];
            for (var s = 0; s < segs.length; s += 2) { g.moveTo(segs[s][0], segs[s][1]); g.lineTo(segs[s + 1][0], segs[s + 1][1]); }
          }
        }
        g.stroke();
      })(0);
    }

    // the ticket shows today's date and the weekday letter (en-CA)
    try {
      var tdt = document.querySelector('[data-tkt-dt]'), tyr = document.querySelector('[data-tkt-yr]'), twd = document.querySelector('[data-tkt-wd]'), now = new Date();
      if (tdt) tdt.textContent = now.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }).replace('.', '');
      if (tyr) tyr.textContent = now.getFullYear();
      if (twd) twd.textContent = now.toLocaleDateString('en-CA', { weekday: 'long' }).charAt(0);
    } catch (e) {}

    // the ticket straightens a little when the pointer is over it
    var fan = document.querySelector('.pass-fan');
    if (fan && fine && !reduce) {
      fan.addEventListener('pointerenter', function () { fan.classList.add('pass-fan--open'); });
      fan.addEventListener('pointerleave', function () { fan.classList.remove('pass-fan--open'); });
    }

    // drag-to-clear divider on The shift
    var track = document.querySelector('.kn-track'), flow = document.querySelector('[data-flow]');
    if (track && flow) {
      var split = document.createElement('div'); split.className = 'air-split'; split.setAttribute('role', 'slider'); split.setAttribute('aria-label', 'Drag to run the job with Chairlift'); split.setAttribute('aria-valuemin', '0'); split.setAttribute('aria-valuemax', '100'); split.tabIndex = 0;
      split.innerHTML = '<span class="air-split__lbl">Drag to clear</span><span class="air-split__k" aria-hidden="true"></span>';
      track.appendChild(split);
      var cards = [].slice.call(track.querySelectorAll('.kn-step')), btns = [].slice.call(flow.querySelectorAll('[data-way]'));
      var pos = 0, vertical = function () { return window.innerWidth <= 560; }, fromBtn = false;
      function apply(p, silent) {
        pos = clamp(p); split.style.setProperty('--x', (pos * 100).toFixed(1) + '%'); split.setAttribute('aria-valuenow', Math.round(pos * 100));
        var tr = track.getBoundingClientRect();
        cards.forEach(function (c) {
          var r = c.getBoundingClientRect(), mid = vertical() ? (r.top + r.height / 2 - tr.top) / tr.height : (r.left + r.width / 2 - tr.left) / tr.width;
          c.classList.toggle('on', mid < pos);
        });
        var w = pos > .5 ? 1 : 0;
        if (!silent && flow.dataset.way !== String(w)) { fromBtn = true; btns[w].click(); fromBtn = false; }
        split.querySelector('.air-split__lbl').textContent = pos > .97 ? 'All clear' : pos < .03 ? 'Drag to clear' : Math.round(pos * 100) + '% with Chairlift';
      }
      var drag = false;
      split.addEventListener('pointerdown', function (e) { drag = true; split.setPointerCapture(e.pointerId); e.preventDefault(); });
      split.addEventListener('pointermove', function (e) { if (!drag) return; var tr = track.getBoundingClientRect(); apply(vertical() ? (e.clientY - tr.top) / tr.height : (e.clientX - tr.left) / tr.width); });
      split.addEventListener('pointerup', function () { drag = false; }); split.addEventListener('pointercancel', function () { drag = false; });
      split.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight' || e.key === 'ArrowDown') apply(pos + .1); if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') apply(pos - .1); });
      // the By hand / With Chairlift toggle still works and moves the line with it; the kin script's own card flips are overridden a beat later
      btns.forEach(function (b) { b.addEventListener('click', function () { if (fromBtn) return; var w = +b.dataset.way; var t0 = performance.now(), from = pos, to = w ? 1 : 0; (function tween(now) { var k = clamp((now - t0) / 700); apply(from + (to - from) * k, true); if (k < 1) requestAnimationFrame(tween); else setTimeout(function () { apply(to, true); }, 1300); })(t0); }); });
      window.addEventListener('resize', function () { apply(pos, true); });
      apply(0, true);
    }

    // dot grid behind Why us
    var why = document.querySelector('.pc-sec--dark[aria-labelledby="why-title"]');
    if (why && !reduce) {
      var dc = document.createElement('canvas'); dc.className = 'air-dots'; dc.setAttribute('aria-hidden', 'true'); why.insertBefore(dc, why.firstChild);
      var dg = dc.getContext('2d'), DW = 0, DH = 0, ddpr = 1, dvis = false, dph = 0, dsx = .5, dsy = .5;
      function sizeD() { ddpr = Math.min(1.5, window.devicePixelRatio || 1); DW = dc.clientWidth; DH = dc.clientHeight; dc.width = DW * ddpr; dc.height = DH * ddpr; dg.setTransform(ddpr, 0, 0, ddpr, 0, 0); }
      sizeD(); window.addEventListener('resize', sizeD);
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { dvis = es[0].isIntersecting; }, { threshold: .05 }).observe(dc);
      (function loopD(now) {
        if (!dvis || fine) requestAnimationFrame(loopD);   // phones: one still frame, no constant redraw
        if (!dvis) return;
        var r = dc.getBoundingClientRect(), tx, ty;
        if (fine && now - pointer.t < 2500) { tx = pointer.x - r.left; ty = pointer.y - r.top; }
        else { dph += .006; tx = DW * (.5 + Math.sin(dph) * .4); ty = DH * (.5 + Math.cos(dph * .8) * .4); }
        dsx += (tx - dsx) * .1; dsy += (ty - dsy) * .1;
        dg.clearRect(0, 0, DW, DH);
        var gap = DW < 600 ? 22 : 28, R = DW < 600 ? 150 : 230;
        for (var y = gap / 2; y < DH; y += gap) for (var x = gap / 2; x < DW; x += gap) {
          var dx = x - dsx, dy = y - dsy, dd = Math.sqrt(dx * dx + dy * dy), k = Math.max(0, 1 - dd / R);
          var a = .07 + k * k * .85, rad = 1.1 + k * 1.6;
          dg.fillStyle = k > .02 ? 'rgba(61,255,193,' + a.toFixed(3) + ')' : 'rgba(255,255,255,' + a.toFixed(3) + ')';
          dg.beginPath(); dg.arc(x, y, rad, 0, 7); dg.fill();
        }
      })(0);
    }

    // scroll chairlift: a cable down the left edge; the chair climbs it as you read down the page (base at the bottom, summit at the top),
    // swings a little when it moves, and carries the elevation readout: base 1,200 m to summit 2,850 m
    (function () {
      var header = document.querySelector('.site-header');
      var lift = document.createElement('div'); lift.className = 'air-lift'; lift.setAttribute('aria-hidden', 'true');
      lift.innerHTML = '<i class="air-lift__end air-lift__end--top"></i><i class="air-lift__end air-lift__end--base"></i>' +
        '<div class="air-lift__car"><div class="air-lift__read"><span class="air-lift__num">1,200 m</span><span class="air-lift__lbl">Base</span></div>' +
        '<div class="air-lift__chair"><svg viewBox="0 0 34 54" preserveAspectRatio="xMidYMin meet"><rect class="air-lift__grip" x="13.5" y="0" width="7" height="5" rx="1"/><path d="M17 5V13"/><path class="air-lift__seat" d="M8 13h18l3.5 5h-25z"/><rect x="5" y="18" width="24" height="28" rx="3.5"/><path d="M5 31H29"/></svg></div></div>';
      body.appendChild(lift);
      var car = lift.querySelector('.air-lift__car'), chair = lift.querySelector('.air-lift__chair'), num = lift.querySelector('.air-lift__num'), lbl = lift.querySelector('.air-lift__lbl');
      var cur = 0, target = 0, raf = 0, span = 0, shown = '';
      function measure() {
        var h = header ? header.getBoundingClientRect().height : 64;
        root.style.setProperty('--air-top', Math.round(h + 18) + 'px');
        // leave room above the chair for the readout so it never runs off the top of the cable
        span = Math.max(0, lift.clientHeight - chair.clientHeight - 4);
      }
      function progress() { var max = root.scrollHeight - innerHeight; return max > 0 ? clamp(scrollY / max) : 0; }
      function tick() {
        raf = 0;
        var d = target - cur;
        if (reduce || Math.abs(d) < .0005) cur = target; else { cur += d * .14; raf = requestAnimationFrame(tick); }
        // the readout sits above the chair; near the top of the cable it flips below so it stays on screen
        var y = (1 - cur) * span;   // base at the bottom of the cable, summit at the top: the chair climbs as you read down
        car.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
        lift.classList.toggle('air-lift--flip', y < 120);
        if (!reduce) chair.style.transform = 'rotate(' + Math.max(-14, Math.min(14, -d * 900)).toFixed(1) + 'deg)';
        var m = Math.round(1200 + cur * 1650), s = m.toLocaleString('en-CA') + ' m';
        if (s !== shown) { shown = s; num.textContent = s; lbl.textContent = cur > .97 ? 'Summit' : cur < .03 ? 'Base' : 'Elevation'; lift.classList.toggle('air-lift--top', cur > .97); }
      }
      function onScroll() { target = progress(); if (!raf) raf = requestAnimationFrame(tick); }
      measure(); onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', function () { measure(); onScroll(); });
      if ('ResizeObserver' in window) new ResizeObserver(function () { measure(); onScroll(); }).observe(document.body);
    })();
})();
