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

  // One small scorecard per game: league and status on top, then a row per team (logo, name, score).
  function team(t, lose, pre) {
    var mark = t.logo ? '<img src="' + esc(t.logo) + '" alt="">' : '<span class="dp-noimg"></span>';
    return '<div class="dp-tm' + (lose ? ' dp-lo' : '') + '">' + mark + '<small>' + esc(t.abbr || t.name) + '</small><b>' + (pre ? '' : esc(t.score)) + '</b></div>';
  }
  function sportsHTML(boxes, next) {
    return boxes.concat(next).map(function (g) {
      var t = g.teams;
      if (!t) return '';
      var pre = g.status === 'Up next';
      var a = Number(t[0].score), b = Number(t[1].score);
      var mid = pre ? ((g.perf || [])[0] || 'Up next') : (/^Final/.test(g.status) ? 'Last night' : g.status);
      return '<div class="dp-game"><div class="dp-gs"><i>' + esc(g.league || '') + '</i><em>' + esc(mid) + '</em></div>' +
        team(t[0], !pre && a < b, pre) + team(t[1], !pre && b < a, pre) + '</div>';
    }).join('');
  }

  function tick() {
    var now = new Date();
    var h = now.getHours();
    all('[data-dp-greet]', function (el) { el.textContent = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; });
    all('[data-dp-date]', function (el) {
      el.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    });
    all('[data-dp-time]', function (el) {
      if (el.hasAttribute('data-on')) el.textContent = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).replace(/[\u202f\u00a0]/g, ' ');
    });
  }
  tick();
  setInterval(tick, 10000);

  fetch('/.netlify/functions/paper?v=7').then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
    if (!d) return;
    if (d.weather) {
      all('[data-dp-temp]', function (el) { el.textContent = d.weather.temp; });
      all('[data-dp-desc]', function (el) { el.textContent = d.weather.desc; });
      all('[data-dp-hl]', function (el) { el.textContent = 'H ' + d.weather.hi + '° · L ' + d.weather.lo + '°'; });
      if (d.weather.feels != null) all('[data-dp-feels]', function (el) { el.textContent = d.weather.feels + '°C'; });
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
        var boxes = d.sports.filter(function (g) { return g.status !== 'Up next' && g.teams; });
        var next = d.sports.filter(function (g) { return g.status === 'Up next'; });
        el.innerHTML = sportsHTML(boxes, next);
      });
    }
  }).catch(function () {});
})();
