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


/* PX-style concept: intro splash with counter, blur-in reveal */
(function () {
  var sp = document.querySelector('.intro-splash');
  if (sp) {
    var seen = false; try { seen = sessionStorage.getItem('cl-intro') === '1'; } catch (e) {}
    var done = function () { sp.classList.add('is-done'); try { sessionStorage.setItem('cl-intro', '1'); } catch (e) {} };
    if (seen) { done(); } else {
      var n = 0, c = sp.querySelector('.intro-count'), t = setInterval(function () { n += 7; if (n >= 100) { n = 100; clearInterval(t); setTimeout(done, 350); } c.textContent = ('00' + n).slice(-3); }, 70);
    }
  }
  var els = document.querySelectorAll('.intro, .cards .card, .step, .paper-split > *, .founder-card, .cta-box');
  els.forEach(function (e) { e.classList.add('reveal'); });
  if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
  var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } }); }, { threshold: .12 });
  els.forEach(function (e) { io.observe(e); });
})();

/* PX x ski home: scroll-slid headline, parallax mountains, lit words, expanding rows, snow */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hero = document.querySelector('.px-hero');
  if (!hero) return;
  var lines = hero.querySelectorAll('[data-slide]'), layers = hero.querySelectorAll('[data-speed]');
  var big = document.querySelector('[data-lit]');
  if (big) {
    var seenEnd = false;
    big.innerHTML = big.textContent.trim().split(/\s+/).map(function (w) { var c = seenEnd ? 'w neon' : 'w'; if (/[.!?]$/.test(w)) seenEnd = true; return '<span class="' + c + '">' + w + '</span>'; }).join(' ');
  }
  var words = big ? big.querySelectorAll('.w') : [];
  function frame() {
    var y = window.scrollY, h = window.innerHeight;
    hero.style.setProperty('--p', Math.max(0, Math.min(1, y / (h * .5))).toFixed(3));
    if (!reduce) {
      var p = Math.min(1, y / h);
      lines.forEach(function (l) { l.style.transform = 'translateX(' + (l.dataset.slide * p * 22) + 'vw)'; });
      layers.forEach(function (l) { l.style.transform = 'translateY(' + (Math.min(y, h) * l.dataset.speed * .5) + 'px)'; });
    }
    if (words.length) {
      var r = big.getBoundingClientRect(), t = Math.max(0, Math.min(1, (h * .85 - r.top) / (r.height + h * .3)));
      var n = Math.round(t * words.length);
      words.forEach(function (w, i) { w.classList.toggle('on', i < n || reduce); });
    }
  }
  window.addEventListener('scroll', function () { requestAnimationFrame(frame); }, { passive: true });
  window.addEventListener('resize', frame); frame();
  document.querySelectorAll('.px-item button').forEach(function (b) {
    b.addEventListener('click', function () {
      var li = b.parentNode, open = li.hasAttribute('data-open');
      if (open) li.removeAttribute('data-open'); else li.setAttribute('data-open', '');
      b.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  });
  var cv = hero.querySelector('canvas.snow');
  if (cv && cv.getContext) {
    var ctx = cv.getContext('2d'), w, hh, ps = [];
    var size = function () { var r = cv.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2); w = r.width; hh = r.height; cv.width = w * d; cv.height = hh * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    size(); window.addEventListener('resize', size);
    for (var i = 0; i < 26; i++) ps.push({ x: Math.random() * w, y: Math.random() * hh, r: .8 + Math.random() * 3, v: .3 + Math.random() * 1, d: Math.random() * 6 });
    var draw = function (t) {
      ctx.clearRect(0, 0, w, hh); ctx.fillStyle = '#fff';
      ps.forEach(function (p) { ctx.globalAlpha = .3 + p.r / 5; ctx.beginPath(); ctx.arc(p.x + Math.sin(t / 900 + p.d) * 14, p.y, p.r, 0, 6.3); ctx.fill(); if (!reduce) { p.y += p.v; p.x -= p.v * .5; if (p.y > hh) { p.y = -4; p.x = Math.random() * w + 80; } if (p.x < -10) p.x = w; } });
      if (!reduce) requestAnimationFrame(draw);
    };
    draw(0);
  }
})();

/* Emblem tilts toward the pointer, like a 3D object */
(function () {
  var em = document.querySelector('.px-emblem');
  if (!em || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  window.addEventListener('pointermove', function (e) {
    var x = e.clientX / window.innerWidth - .5, y = e.clientY / window.innerHeight - .5;
    em.style.setProperty('--ry', (x * 40) + 'deg'); em.style.setProperty('--rx', (-y * 24) + 'deg');
  }, { passive: true });
})();
