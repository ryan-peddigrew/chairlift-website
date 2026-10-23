// The Daily Peddigrew sample: scale the page to fit, show the viewer's date,
// and fill in live weather, Toronto news and sports from /.netlify/functions/paper.
(function () {
  var papers = document.querySelectorAll('.dp-frame');
  if (!papers.length) return;

  function fit() {
    papers.forEach(function (f) { f.style.setProperty('--dp-s', f.clientWidth / 816); });
  }
  fit();
  if (window.ResizeObserver) new ResizeObserver(fit).observe(papers[0]);
  window.addEventListener('resize', fit);

  function all(sel, fn) { document.querySelectorAll(sel).forEach(fn); }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function tick() {
    var now = new Date();
    var h = now.getHours();
    all('[data-dp-greet]', function (el) { el.textContent = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; });
    all('[data-dp-date]', function (el) {
      el.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    });
    all('[data-dp-time]', function (el) {
      if (el.hasAttribute('data-on')) el.textContent = ' · ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    });
  }
  tick();
  setInterval(tick, 10000);

  fetch('/.netlify/functions/paper').then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
    if (!d) return;
    if (d.weather) {
      all('[data-dp-temp]', function (el) { el.textContent = d.weather.temp; });
      all('[data-dp-desc]', function (el) { el.textContent = d.weather.desc; });
      all('[data-dp-hl]', function (el) { el.textContent = 'H ' + d.weather.hi + '° · L ' + d.weather.lo + '° · Toronto'; });
    }
    if (d.news && d.news.length >= 3) {
      all('[data-dp-news]', function (el) {
        el.innerHTML = d.news.slice(0, 5).map(function (n) { return '<div class="dp-row">' + esc(n.title) + '<em>· ' + esc(n.source) + '</em></div>'; }).join('');
      });
    }
    if (d.sports && d.sports.length) {
      all('[data-dp-sports]', function (el) {
        el.innerHTML = d.sports.slice(0, 4).map(function (g) {
          var logo = g.logo ? '<img src="' + esc(g.logo) + '" alt="">' : '<span class="dp-noimg"></span>';
          return '<div class="dp-row"><div class="dp-team">' + logo + '<div><div class="dp-score">' + esc(g.line) + '</div><div class="dp-st">' + esc(g.status) + '</div></div></div><div class="dp-lead">' + esc(g.note || '') + '</div></div>';
        }).join('');
      });
    }
  }).catch(function () {});
})();
