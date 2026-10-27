// Build your own paper: swaps the visitor's name, city and top three into the sample page.
// Nothing is saved or sent anywhere, except the city name, which looks up the weather.
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
    if (city) weather(city);
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
  form.addEventListener('input', showLive);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    render();
    if (after) after.hidden = false;
    var frame = document.querySelector('.dp-frame');
    if (press) {
      press.classList.remove('is-printing');
      void press.offsetWidth;
      press.classList.add('is-printing');
    }
    if (btn) btn.textContent = 'Print it again';
    if (window.innerWidth < 900) frame.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
