// Get your own paper: the sample page fills in as the visitor types; submitting sends the request to us.
// The city name is also used (on its own) to look up the weather.
(function () {
  var form = document.querySelector('[data-try-form]');
  if (!form) return;
  var paper = document.querySelector('.dp');
  var after = document.querySelector('[data-try-after]');

  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function fitMast(el) {
    el.style.fontSize = '';
    var size = 82;
    while (el.scrollWidth > el.clientWidth && size > 40) { size -= 2; el.style.fontSize = size + 'px'; }
  }

  function weather(city) {
    var label = paper.querySelector('.dp-dwx em');
    fetch('https://geocoding-api.open-meteo.com/v1/search?count=1&name=' + encodeURIComponent(city))
      .then(function (r) { return r.json(); })
      .then(function (g) {
        var p = g && g.results && g.results[0];
        if (!p) return;
        if (label) label.lastChild.textContent = p.name;
        return fetch('https://api.open-meteo.com/v1/forecast?current=temperature_2m&latitude=' + p.latitude + '&longitude=' + p.longitude)
          .then(function (r) { return r.json(); })
          .then(function (w) {
            if (w && w.current) paper.querySelectorAll('[data-dp-temp]').forEach(function (el) { el.textContent = Math.round(w.current.temperature_2m); });
          });
      }).catch(function () {});
  }

  var liveMast = document.querySelector('[data-try-mast]');
  var press = document.querySelector('[data-press]');
  var btn = form.querySelector('[data-try-btn]');

  function render() {
    var name = form.elements.name.value.trim();
    var city = form.elements.city.value.trim();
    var items = ['one', 'two', 'three'].map(function (k) { return form.elements[k].value.trim(); }).filter(Boolean);

    if (name) {
      var last = name.split(/\s+/).pop();
      var mast = paper.querySelector('.dp-mast');
      var foot = paper.querySelector('.dp-foot span');
      mast.textContent = 'The Daily ' + last;
      fitMast(mast);
      if (foot) {
        foot.textContent = 'The Daily ' + last;
        foot.style.fontSize = '';
        var fs = 14;
        while (foot.offsetWidth > 150 && fs > 8) { fs -= 1; foot.style.fontSize = fs + 'px'; }
      }
    }
    if (items.length) {
      var focus = paper.querySelector('.dp-focus');
      var head = focus.querySelector('.dp-h').outerHTML;
      var tags = ['First', 'Today', 'Today'];
      var notes = ['Your top priority. Get it done before lunch.', 'Next up once the first one is off your plate.', 'Fit it in around the calendar on the right.'];
      focus.innerHTML = head + items.map(function (t, i) {
        return '<div class="dp-row"><div class="dp-t">' + esc(t) + '</div><span class="dp-tag">' + tags[i] + '</span><ul><li>' + notes[i] + '</li></ul></div>';
      }).join('');
    }
  }

  function mastText() {
    var name = form.elements.name.value.trim();
    return name ? 'The Daily ' + name.split(/\s+/).pop() : 'The Daily Peddigrew';
  }
  function showLive() {
    liveMast.textContent = mastText();
    liveMast.style.fontSize = '';
    var size = parseFloat(getComputedStyle(liveMast).fontSize);
    while (liveMast.scrollWidth > liveMast.clientWidth && size > 22) { size -= 2; liveMast.style.fontSize = size + 'px'; }
  }

  var cityTimer;
  form.addEventListener('input', function (e) {
    showLive();
    render(false);
    if (e.target.name === 'city') {
      clearTimeout(cityTimer);
      var c = e.target.value.trim();
      if (c.length > 2) cityTimer = setTimeout(function () { weather(c); }, 700);
    }
  });

  var status = form.querySelector('[data-try-status]');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    btn.disabled = true;
    status.textContent = 'Sending…';
    fetch(form.getAttribute('data-ajax'), { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form) })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (!res.ok || String(res.d.success) !== 'true') throw new Error('not sent');
        form.classList.add('form-done');
        status.textContent = '';
        if (after) { after.hidden = false; after.querySelector('h3').focus && after.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      })
      .catch(function () {
        btn.disabled = false;
        status.innerHTML = 'Sorry, that didn\u2019t send. Please try again, or email <a href="mailto:ryan@usechairlift.com">ryan@usechairlift.com</a>.';
      });
  });
})();
