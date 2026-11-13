(function () {
  // Visit statistics: count clicks on the booking button
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href="/5min/"]');
    if (a && window.umami) umami.track('Book click');
  });

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
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      })
                .then(function (res) {
          if (!res.ok) throw new Error('not sent');
          form.classList.add('form-done');
          if (window.umami) umami.track('Form sent');
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

  // Home closer on phones: the "send us one task" form stays folded behind one button until someone wants it (shorter page).
  // Without JavaScript, and on a computer, the form simply shows.
  var doors = document.querySelector('.cta-box--doors'), opener = doors && doors.querySelector('.task-open');
  if (opener) {
    doors.classList.add('is-folded');
    opener.addEventListener('click', function () {
      doors.classList.remove('is-folded');
      var t = doors.querySelector('textarea'); if (t) t.focus();
    });
  }

  // Footer year
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();


/* Homepage case studies: one story at a time, tabs switch between them */
(function () {
  var box = document.querySelector('.cst');
  if (!box) return;
  var tabs = [].slice.call(box.querySelectorAll('.cst__tab'));
  var row = box.querySelector('.cst__tabs');
  var more = box.querySelector('.cst__more');
  function show(t, focus) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.setAttribute('aria-selected', on ? 'true' : 'false');
      x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) t.focus();
    var r = t.getBoundingClientRect(), rr = row.getBoundingClientRect();
    if (r.left < rr.left || r.right > rr.right - 56) row.scrollBy({ left: r.left - rr.left - 8, behavior: 'smooth' });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { show(t); });
    t.addEventListener('keydown', function (e) {
      var j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
      if (j === null) return;
      e.preventDefault();
      show(tabs[(j + tabs.length) % tabs.length], true);
    });
  });
  function edge() { if (more) more.classList.toggle('is-end', row.scrollLeft + row.clientWidth >= row.scrollWidth - 4); }
  if (more) more.addEventListener('click', function () { row.scrollBy({ left: row.clientWidth * .7, behavior: 'smooth' }); });
  row.addEventListener('scroll', edge, { passive: true });
  window.addEventListener('resize', edge);
  edge();
  // links like /#wastemind open that story
  function fromHash() {
    var id = location.hash.slice(1);
    var t = tabs.filter(function (x) { return x.getAttribute('data-story') === id; })[0];
    if (t) { show(t); box.scrollIntoView(); }
  }
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();

// Terminal touches (Ryan, 13 Nov 2026): the small typewriter-style caption lines type themselves in when they come into view
// and end on a flashing block cursor, like an old terminal. The whole line is in the page from the start (the part not typed
// yet is only invisible), so nothing moves while it types. Screen readers get one hidden copy of the full sentence.
// Other scripts call window.__type(el) after they swap a label's words (trail map card, by hand / with Chairlift count).
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function type(el, instant, wait) {
    if (!el) return;
    clearTimeout(el._tw);
    var sr = el.querySelector('.tw-sr'), t = (sr ? sr.textContent : el.textContent).replace(/\s+/g, ' ').trim();
    if (!t) return;
    el.textContent = ''; el.classList.add('tw');
    // the cursor hangs off the last typed letter (an empty cursor element of its own can drop onto a new line)
    var say = document.createElement('span'), show = document.createElement('span'), on = document.createElement('span'), c = document.createElement('span'), off = document.createElement('span');
    say.className = 'tw-sr'; say.textContent = t; show.setAttribute('aria-hidden', 'true'); c.className = 'tw-caret'; off.className = 'tw-off';
    show.appendChild(on); show.appendChild(c); show.appendChild(off); el.appendChild(say); el.appendChild(show);
    var n = t.length, i = 0, gap = Math.max(14, Math.min(34, 1100 / n));
    function put(k) { on.textContent = t.slice(0, k - 1); c.textContent = t.charAt(k - 1); off.textContent = t.slice(k); }
    if (reduce || instant) { put(n); return; }
    off.textContent = t;                       // all there, nothing showing yet
    el._twGo = function () { el._twGo = null; (function step() { i++; put(i); if (i < n) el._tw = setTimeout(step, gap); })(); };
    if (!wait) el._twGo();
  }
  window.__type = type;
  var lines = [].slice.call(document.querySelectorAll('.sx-line, .sx-label, .bw__eyebrow, .lift-status li:first-child b, .tm-card > .tm-card__k:first-child, .kn-flow__read [data-count]'));
  if (!lines.length) return;
  if (reduce || !('IntersectionObserver' in window)) { lines.forEach(function (el) { type(el, true); }); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); if (e.target._twGo) e.target._twGo(); } });
  }, { rootMargin: '0px 0px -10% 0px', threshold: .4 });
  lines.forEach(function (el) { type(el, false, true); io.observe(el); });   // blank until it scrolls into view, then it types
})();
