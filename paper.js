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
      if (el.hasAttribute('data-on')) el.textContent = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    });
  }
  tick();
  setInterval(tick, 10000);

  // Issue number counts up one a day from the first edition (Oct 23, 2026).
  var issue = Math.floor((new Date().setHours(0, 0, 0, 0) - new Date(2026, 9, 23)) / 864e5) + 1;
  all('[data-dp-no]', function (el) { el.textContent = Math.max(1, issue); });

  fetch('/.netlify/functions/paper?v=3').then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
    if (!d) return;
    if (d.weather) {
      all('[data-dp-temp]', function (el) { el.textContent = d.weather.temp; });
      all('[data-dp-desc]', function (el) { el.textContent = d.weather.desc; });
      all('[data-dp-hl]', function (el) { el.textContent = 'H ' + d.weather.hi + '° · L ' + d.weather.lo + '° · Toronto'; });
      if (d.weather.feels != null) all('[data-dp-feels]', function (el) { el.textContent = d.weather.feels + '°'; });
      if (d.weather.wind != null) all('[data-dp-wind]', function (el) { el.textContent = d.weather.wind + ' km/h'; });
      if (d.weather.rain != null) all('[data-dp-rain]', function (el) { el.textContent = d.weather.rain + '%'; });
    }
    if (d.news && d.news.length >= 3) {
      all('[data-dp-news]', function (el) {
        el.innerHTML = d.news.slice(0, 4).map(function (n) { return '<div class="dp-row"><span class="dp-nt">' + esc(n.title) + '</span><em>' + esc(n.source) + '</em></div>'; }).join('');
      });
    }
    if (d.sports && d.sports.length) {
      all('[data-dp-sports]', function (el) {
        el.innerHTML = d.sports.slice(0, 4).map(function (g) {
          var logo = g.logo ? '<img src="' + esc(g.logo) + '" alt="">' : '<span class="dp-noimg"></span>';
          var line = g.teams ? g.teams.map(function (t) {
            return esc(t.name) + (t.score ? ' ' + esc(t.score) : '');
          }).join(esc(g.sep) + ' ') : esc(g.line);
          var perf = (g.perf || []).length ? '<p class="dp-perf">' + esc(g.perf.join(' · ')) + '</p>' : '';
          return '<div class="dp-row"><div class="dp-gl">' + logo + '<span class="dp-score">' + line + '</span><span class="dp-tag">' + esc(g.status) + '</span></div>' + perf + '</div>';
        }).join('');
      });
    }
  }).catch(function () {});
})();
