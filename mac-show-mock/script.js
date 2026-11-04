(function () {
  document.documentElement.classList.add('js');

  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');
  var links = document.getElementById('nav-links');

  // Solid nav background once the page scrolls
  function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 20); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Phone menu
  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('is-open')); });
  links.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 960) setOpen(false); });

  // Fade in on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 80 + 'ms';
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Quote request form. Mock-up: checks required fields, then shows a note instead of sending.
  // At launch: delete the preventDefault block below and Netlify Forms (data-netlify) will receive submissions.
  var form = document.getElementById('quote-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.form__note');
      var bad = [];
      form.querySelectorAll('[required]').forEach(function (el) {
        var ok = el.value.trim() !== '' && (el.type !== 'email' || /.+@.+\..+/.test(el.value));
        el.classList.toggle('is-invalid', !ok);
        if (!ok) bad.push(el);
      });
      if (bad.length) {
        note.textContent = 'Please fill in the fields marked with a star.';
        bad[0].focus();
        return;
      }
      note.textContent = 'Thanks. This is a mock-up, so nothing was sent.';
      form.reset();
    });
  }
})();
