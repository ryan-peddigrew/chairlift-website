(function () {
  // Phone and tablet menu
  var btn = document.querySelector('.menu-btn');
  var menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    var setOpen = function (open) {
      menu.hidden = !open;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    btn.addEventListener('click', function () { setOpen(menu.hidden); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { setOpen(false); btn.focus(); }
    });
  }

  // Contact form: send without leaving the page (falls back to /thanks/ without JavaScript)
  var form = document.querySelector('.contact-form');
  if (form && window.fetch && window.URLSearchParams) {
    var status = form.querySelector('.form-status');
    var submit = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submit.disabled = true;
      status.textContent = 'Sending…';
      fetch(form.getAttribute('data-ajax'), {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          if (!res.ok || String(res.d.success) !== 'true') throw new Error('not sent');
          form.classList.add('form-done');
          status.textContent = "Thanks, your message is in. We'll read it properly and reply by email soon.";
        })
        .catch(function () {
          submit.disabled = false;
          status.innerHTML = 'Sorry, that didn’t send. Please try again, or email <a href="mailto:ryan@usechairlift.com">ryan@usechairlift.com</a>.';
        });
    });
  }

  // Get in touch: three short steps (without JavaScript the whole form shows at once)
  var steps = document.querySelector('form[data-steps]');
  if (steps) {
    var panels = Array.prototype.slice.call(steps.querySelectorAll('.form-step'));
    var bar = steps.querySelector('.form-progress-bar i');
    var text = steps.querySelector('[data-progress-text]');
    var current = 0;
    var show = function (n) {
      current = n;
      panels.forEach(function (p, i) { p.classList.toggle('is-current', i === n); });
      if (bar) bar.style.width = ((n + 1) / panels.length * 100) + '%';
      if (text) text.textContent = 'Step ' + (n + 1) + ' of ' + panels.length;
      var legend = panels[n].querySelector('legend');
      if (legend && n > 0) { legend.setAttribute('tabindex', '-1'); legend.focus({ preventScroll: true }); }
    };
    var valid = function (n) {
      var fields = panels[n].querySelectorAll('input, textarea, select');
      for (var i = 0; i < fields.length; i++) {
        if (!fields[i].checkValidity()) { fields[i].reportValidity(); return false; }
      }
      return true;
    };
    steps.classList.add('is-stepped');
    show(0);
    steps.addEventListener('click', function (e) {
      if (e.target.closest('[data-next]')) { if (valid(current)) show(Math.min(current + 1, panels.length - 1)); }
      if (e.target.closest('[data-back]')) show(Math.max(current - 1, 0));
    });
    steps.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && current < panels.length - 1) { e.preventDefault(); if (valid(current)) show(current + 1); }
    });
  }

  // Footer year
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();


/* Retro concept: flying snow spray */
(function () {
  var cv = document.querySelector('canvas.snow');
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d'), w, h, ps = [], still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size() { var r = cv.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2); w = r.width; h = r.height; cv.width = w * d; cv.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0); }
  size();
  for (var i = 0; i < 70; i++) ps.push({ x: Math.random() * w, y: Math.random() * h, r: .8 + Math.random() * 3, v: .25 + Math.random() * .9, d: Math.random() * 6 });
  function draw(t) {
    ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#fff';
    ps.forEach(function (p) { ctx.globalAlpha = .35 + p.r / 5; ctx.beginPath(); ctx.arc(p.x + Math.sin(t / 900 + p.d) * 14, p.y, p.r, 0, 6.3); ctx.fill(); if (!still) { p.y += p.v; p.x -= p.v * .5; if (p.y > h) { p.y = -4; p.x = Math.random() * w + 80; } if (p.x < -10) p.x = w; } });
    if (!still) requestAnimationFrame(draw);
  }
  draw(0);
  window.addEventListener('resize', size);
})();
