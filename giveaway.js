// HSMAI giveaway pop-up (26 Nov 2026). Shows once per visitor; ?hsmai=1 shows it again.
// Turn it off with GIVEAWAY = False in tools/common.py.
(function () {
  var box = document.getElementById('gw');
  if (!box) return;
  var KEY = 'chairlift-hsmai-2026';
  var force = /[?&]hsmai=1/.test(location.search);
  var seen = false;
  try { seen = localStorage.getItem(KEY) === '1'; } catch (e) {}
  if (seen && !force) return;
  var last = null;
  function remember() { try { localStorage.setItem(KEY, '1'); } catch (e) {} }
  function close() {
    remember();
    box.hidden = true;
    document.documentElement.classList.remove('gw-open');
    if (last && last.focus) last.focus();
  }
  function open() {
    last = document.activeElement;
    box.hidden = false;
    document.documentElement.classList.add('gw-open');
    var first = box.querySelector('input[name="name"]');
    if (first && matchMedia('(hover: hover)').matches) first.focus();
    else box.querySelector('.gw-x').focus();
  }
  box.addEventListener('click', function (e) {
    if (e.target === box || e.target.closest('[data-gw-close]')) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !box.hidden) close();
  });
  var form = box.querySelector('.gw-form');
  var status = box.querySelector('.gw-status');
  var submit = box.querySelector('.gw-submit');
  if (form && window.fetch && window.URLSearchParams) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submit.disabled = true;
      status.textContent = 'Sending…';
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(function (res) {
        if (!res.ok) throw new Error('not sent');
        remember();
        form.hidden = true;
        box.querySelector('.gw-done').hidden = false;
        box.querySelector('.gw-done .btn').focus();
      }).catch(function () {
        submit.disabled = false;
        status.textContent = 'That did not send. Please try again, or email ryan@usechairlift.com.';
      });
    });
  }
  open();
})();
