// Time-back calculator: adds up the visitor's own numbers. Nothing is saved or sent.
(function () {
  var form = document.querySelector('[data-calc]');
  if (!form) return;
  function num(el) { var v = parseFloat(el.value); return isFinite(v) && v > 0 ? v : 0; }
  function fmt(v) { return v >= 10 ? Math.round(v).toLocaleString() : (Math.round(v * 10) / 10).toString(); }
  function update() {
    var mins = 0;
    form.querySelectorAll('.calc-row').forEach(function (row) {
      mins += num(row.querySelector('[data-n]')) * num(row.querySelector('[data-m]'));
    });
    var people = Math.max(1, num(form.querySelector('[data-people]')) || 1);
    var week = mins * people / 60, year = week * 48;
    document.querySelector('[data-hours]').textContent = fmt(week);
    document.querySelector('[data-year]').textContent = fmt(year);
    document.querySelector('[data-days]').textContent = fmt(year / 8);
  }
  form.addEventListener('input', update);
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  update();
})();
