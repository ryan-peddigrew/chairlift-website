/* Homepage direction previews (2 Nov 2026): the moving parts for dir-a, dir-b and dir-c. Our own code. See preview.css. */
(function () {
  'use strict';
  var body = document.body, root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var dir = (body.className.match(/dir-([abc])/) || [])[1];
  if (!dir) return;
  function clamp(v) { return Math.min(1, Math.max(0, v)); }
  function onFrame(fn) { var t = false; function k() { t = false; fn(); } function q() { if (!t) { t = true; requestAnimationFrame(k); } } window.addEventListener('scroll', q, { passive: true }); window.addEventListener('resize', q); fn(); }

  /* ---------- A ---------- */
  if (dir === 'a') {
    // step cards flip up as they arrive
    var steps = [].slice.call(document.querySelectorAll('.kn-step'));
    if (steps.length && 'IntersectionObserver' in window && !reduce) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { var i = steps.indexOf(e.target); setTimeout(function () { e.target.classList.add('pv-in'); }, i * 140); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -18% 0px', threshold: .1 });
      steps.forEach(function (s) { io.observe(s); });
    } else steps.forEach(function (s) { s.classList.add('pv-in'); });
    // chapter words follow the active stop; the coin turns with the route
    var lift = document.querySelector('.pc-sec--blue[aria-labelledby="how-title"]');
    var stops = lift ? [].slice.call(lift.querySelectorAll('.pc-pkgs article')) : [];
    var chaps = lift ? [].slice.call(lift.querySelectorAll('.pv-chap span')) : [];
    if (lift && chaps.length) {
      onFrame(function () {
        var on = -1; stops.forEach(function (s, i) { if (s.classList.contains('is-on')) on = i; });
        var r = lift.getBoundingClientRect(), vh = window.innerHeight;
        if (on < 0 && r.top < vh * .8) on = 0;
        chaps.forEach(function (c, i) { c.classList.toggle('on', i === on); });
      });
      // the route already carries --rp on the section; the coin reads it (see preview.css)
    }
  }

  /* ---------- B ---------- */
  if (dir === 'b') {
    // tagline letters scatter in and land (scattered grid text)
    var tag = document.querySelector('.pc-story__tag');
    if (tag && !reduce) {
      var html = '', n = 0;
      [].slice.call(tag.childNodes).forEach(function (node) {
        if (node.nodeType === 3) {
          node.nodeValue.split('').forEach(function (ch) {
            if (ch === ' ') { html += ' '; return; }
            var x = (Math.random() - .5) * 160, y = (Math.random() - .5) * 120, rr = (Math.random() - .5) * 60;
            html += '<span class="pv-l" style="--x:' + x.toFixed(0) + ';--y:' + y.toFixed(0) + ';--r:' + rr.toFixed(0) + ';--d:' + (n++ * .035).toFixed(3) + '">' + ch + '</span>';
          });
        } else if (node.nodeType === 1) html += node.outerHTML;
      });
      tag.innerHTML = html;
    }
    // lodge photos trail the pointer across the band; on phones they drop along a slow path by themselves
    var stick = document.querySelector('.pc-band__stick');
    if (stick && !reduce) {
      var layer = document.createElement('div'); layer.className = 'pv-trail'; layer.setAttribute('aria-hidden', 'true'); stick.appendChild(layer);
      var pics = ['lodge-01', 'lodge-04', 'lodge-05', 'lodge-10', 'lodge-11', 'lodge-12', 'lodge-13', 'lodge-14'].map(function (p) { return '/images/retro/' + p + '.jpg'; });
      pics.forEach(function (p) { new Image().src = p; });
      var k = 0, lx = -999, ly = -999, lastT = 0;
      function drop(x, y) {
        var now = performance.now(); if (now - lastT < 90) return; lastT = now;
        var img = document.createElement('img'); img.src = pics[k++ % pics.length]; img.alt = '';
        img.style.left = x + 'px'; img.style.top = y + 'px'; img.style.setProperty('--r', ((Math.random() - .5) * 18).toFixed(1) + 'deg');
        layer.appendChild(img); img.addEventListener('animationend', function () { img.remove(); });
        while (layer.children.length > 12) layer.firstChild.remove();
      }
      var touchedBand = false;
      stick.addEventListener('pointermove', function (e) {
        var r = stick.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        if (Math.abs(x - lx) + Math.abs(y - ly) < 70) return; lx = x; ly = y; touchedBand = true; drop(x, y);
      });
      // hands-off mode: a photo drops every so often along a gentle arc while the band is on screen (phones, or nobody moving the mouse yet)
      var seen = false, t = 0;
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { seen = es[0].isIntersecting; }, { threshold: .4 }).observe(stick);
      setInterval(function () {
        if (!seen || (fine && touchedBand)) return;
        t += .55; var r = stick.getBoundingClientRect();
        drop(r.width * (.5 + Math.sin(t) * .34), r.height * (.5 + Math.cos(t * 1.3) * .22));
      }, 650);
    }
  }

  /* ---------- C ---------- */
  if (dir === 'c') {
    var pointer = { x: -9999, y: -9999, t: 0 };
    window.addEventListener('pointermove', function (e) { pointer.x = e.clientX; pointer.y = e.clientY; pointer.t = performance.now(); }, { passive: true });

    // topo contour lines that bend toward the pointer (ripple background)
    var pin = document.querySelector('.pc-scrub__pin');
    if (pin && !reduce) {
      var cv = document.createElement('canvas'); cv.className = 'pv-topo'; cv.setAttribute('aria-hidden', 'true'); pin.insertBefore(cv, pin.firstChild);
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
        requestAnimationFrame(loop);
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

    // the lift ticket leans with the pointer
    var ticket = document.querySelector('.ticket');
    if (ticket && fine && !reduce) {
      var near = ticket.closest('.pc-sec') || ticket.parentNode;
      near.addEventListener('pointermove', function (e) {
        var r = ticket.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        var dx = (e.clientX - cx) / (r.width * 1.2), dy = (e.clientY - cy) / (r.height * 1.2);
        ticket.style.setProperty('--ty', (Math.max(-1, Math.min(1, dx)) * 12).toFixed(1) + 'deg');
        ticket.style.setProperty('--tx', (Math.max(-1, Math.min(1, -dy)) * 10).toFixed(1) + 'deg');
      });
      near.addEventListener('pointerleave', function () { ticket.style.setProperty('--tx', '0deg'); ticket.style.setProperty('--ty', '0deg'); });
    }

    // drag-to-clear divider on The shift
    var track = document.querySelector('.kn-track'), flow = document.querySelector('[data-flow]');
    if (track && flow) {
      var split = document.createElement('div'); split.className = 'pv-split'; split.setAttribute('role', 'slider'); split.setAttribute('aria-label', 'Drag to run the job with Chairlift'); split.setAttribute('aria-valuemin', '0'); split.setAttribute('aria-valuemax', '100'); split.tabIndex = 0;
      split.innerHTML = '<span class="pv-split__lbl">Drag to clear</span><span class="pv-split__k" aria-hidden="true"></span>';
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
        split.querySelector('.pv-split__lbl').textContent = pos > .97 ? 'All clear' : pos < .03 ? 'Drag to clear' : Math.round(pos * 100) + '% with Chairlift';
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
      var dc = document.createElement('canvas'); dc.className = 'pv-dots'; dc.setAttribute('aria-hidden', 'true'); why.insertBefore(dc, why.firstChild);
      var dg = dc.getContext('2d'), DW = 0, DH = 0, ddpr = 1, dvis = false, dph = 0, dsx = .5, dsy = .5;
      function sizeD() { ddpr = Math.min(1.5, window.devicePixelRatio || 1); DW = dc.clientWidth; DH = dc.clientHeight; dc.width = DW * ddpr; dc.height = DH * ddpr; dg.setTransform(ddpr, 0, 0, ddpr, 0, 0); }
      sizeD(); window.addEventListener('resize', sizeD);
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { dvis = es[0].isIntersecting; }, { threshold: .05 }).observe(dc);
      (function loopD(now) {
        requestAnimationFrame(loopD);
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
  }
})();
