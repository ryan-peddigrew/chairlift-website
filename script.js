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


(function () {
  document.documentElement.classList.add('js');
  var els = document.querySelectorAll('.intro, .cards .card, .step, .founder-card, .paper-split > div, .paper-split > img, .proof-item');
  if (!('IntersectionObserver' in window)) { return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach(function (el, i) { el.classList.add('reveal'); el.style.setProperty('--d', ((i % 3) * 0.08) + 's'); io.observe(el); });
})();

(function () {
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  var tick = false;
  function update() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ')';
    tick = false;
  }
  window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
  update();
})();

/* Dark concept: expanding "More business." and flowing hero canvas */
(function () {
  var more = document.querySelector('.more'), list = document.getElementById('more-list');
  if (more && list) {
    var set = function (on) { more.classList.toggle('is-open', on); list.classList.toggle('is-open', on); more.setAttribute('aria-expanded', on ? 'true' : 'false'); };
    var tog = function () { set(!more.classList.contains('is-open')); };
    more.addEventListener('click', tog);
    more.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tog(); } });
    if (window.matchMedia('(hover: hover)').matches) { more.addEventListener('mouseenter', function () { set(true); }); }
    else if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setTimeout(function () { set(true); }, 1600); }
  }
  var cv = document.querySelector('canvas.flow');
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d'), w = 0, h = 0, t = 0, still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size() { var r = cv.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2); w = r.width; h = r.height; cv.width = w * d; cv.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0); }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < 9; i++) {
      ctx.beginPath();
      for (var x = 0; x <= w; x += 12) {
        var y = h * (.35 + i * .045) + Math.sin(x / (170 + i * 22) + t * (.5 + i * .06) + i) * (34 + i * 7) + Math.sin(x / 90 - t * .4) * 8 + (x / w) * h * .28;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(61,255,193,' + (.05 + i * .035) + ')';
      ctx.lineWidth = 1 + i * .25;
      ctx.stroke();
    }
    t += .012;
    if (!still) requestAnimationFrame(draw);
  }
  size(); draw();
  window.addEventListener('resize', function () { size(); if (still) draw(); });
})();
