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

  function logo(src) { return src ? '<img src="' + esc(src) + '" alt="">' : '<span class="dp-noimg"></span>'; }

  // Scoreboxes for finished or live games, then a short "Up next" list.
  function sportsHTML(boxes, next) {
    var out = '';
    if (boxes.length) {
      out += '<div class="dp-boxes">' + boxes.map(function (g) {
        var hi = Math.max(Number(g.teams[0].score), Number(g.teams[1].score));
        var rows = g.teams.map(function (t) {
          return '<div class="dp-tm' + (Number(t.score) < hi ? ' dp-lose' : '') + '">' + logo(t.logo) + '<span>' + esc(t.name) + '</span><b>' + esc(t.score) + '</b></div>';
        }).join('');
        var perf = (g.perf || []).length ? '<p class="dp-star">' + esc(g.perf.join(' · ')) + '</p>' : '';
        return '<div class="dp-box"><span class="dp-tag">' + esc(g.status) + '</span>' + rows + perf + '</div>';
      }).join('') + '</div>';
    }
    if (next.length) {
      out += '<div class="dp-next"><span class="dp-tag">Up next</span>' + next.map(function (g) {
        var t = g.teams || [{ name: g.line, logo: g.logo }];
        return '<div class="dp-nr">' + logo(t[0].logo) + '<span>' + esc(t[0].name) + (t[1] ? ' <i>vs</i> ' + esc(t[1].name) : '') + '</span><em>' + esc((g.perf || [])[0] || '') + '</em></div>';
      }).join('') + '</div>';
    }
    return out;
  }

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

  fetch('/.netlify/functions/paper?v=5').then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
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
        var boxes = d.sports.filter(function (g) { return g.status !== 'Up next' && g.teams; });
        var next = d.sports.filter(function (g) { return g.status === 'Up next'; });
        el.innerHTML = sportsHTML(boxes, next);
      });
    }
  }).catch(function () {});
})();
