/* Chairlift home: the trail map. Six runs (the six departments), four lifts, summit and base lodge.
   Map art is our own generated terrain (images/trail-map.*). Run details come from the <template data-run> tags (tools/kin.py). */
(function () {
  'use strict';
  var svg = document.getElementById('tm-svg'), list = document.getElementById('tm-list'), card = document.getElementById('tm-card');
  if (!svg || !list || !card) return;
  var MAP = {"runs":[{"rating":"dot","pts":[[828.4,183.6],[821.8,189.8],[812.2,209.6],[800.7,272.3],[788.8,331.4],[777.9,378.0],[768.0,415.3],[758.0,447.3],[748.2,472.8],[738.9,500.2],[730.6,528.4],[723.0,564.1],[715.8,596.5],[709.6,630.3],[705.1,665.1],[703.1,698.4],[704.6,732.8],[709.7,769.9],[717.1,806.2],[725.5,839.3],[733.4,873.6],[741.3,913.4],[750.5,959.4],[760.1,1002.2],[768.9,1043.4],[775.5,1078.6],[775.5,1078.6]]},{"rating":"dot","pts":[[861.8,241.3],[863.8,264.0],[866.9,297.5],[870.4,336.4],[873.0,364.0],[873.8,392.7],[872.4,428.1],[869.2,459.8],[864.7,483.7],[859.0,513.3],[852.6,556.8],[844.4,597.1],[834.0,624.1],[822.7,657.3],[811.9,688.2],[803.2,721.2],[797.1,752.2],[793.0,788.8],[790.1,824.2],[787.8,859.4],[785.3,898.3],[782.6,935.4],[780.3,973.7],[778.4,1012.5],[776.8,1048.8],[775.5,1078.6],[775.5,1078.6]]},{"rating":"square","pts":[[894.2,365.0],[905.3,395.7],[921.9,420.3],[941.3,455.6],[960.6,481.7],[976.4,490.7],[988.8,500.9],[999.8,510.5],[1008.9,521.7],[1015.2,535.5],[1017.8,566.6],[1015.5,595.2],[1008.3,629.4],[997.3,663.3],[983.5,705.6],[968.5,760.6],[950.9,809.6],[929.4,853.8],[905.6,889.6],[881.6,919.6],[859.6,950.6],[839.6,979.9],[820.2,1009.2],[802.4,1030.9],[787.1,1057.0],[775.5,1078.6],[775.5,1078.6]]},{"rating":"square","pts":[[778.6,272.1],[763.2,329.7],[740.5,395.3],[714.1,438.7],[687.9,472.0],[665.8,499.4],[647.7,521.6],[630.7,546.6],[615.5,573.0],[602.9,602.7],[593.8,631.9],[589.1,652.7],[588.9,670.9],[592.2,683.5],[598.1,708.3],[605.7,744.8],[616.0,781.2],[630.2,828.2],[647.2,870.5],[665.7,913.4],[683.9,946.1],[702.8,977.4],[723.5,1009.8],[744.0,1035.3],[762.1,1059.9],[775.5,1078.6],[775.5,1078.6]]},{"rating":"diamond","pts":[[941.2,450.4],[961.6,469.3],[992.9,480.9],[1029.1,480.2],[1063.5,484.9],[1088.7,492.1],[1102.7,505.8],[1110.0,524.3],[1111.6,561.4],[1108.7,602.3],[1102.4,644.0],[1090.7,694.7],[1071.7,739.0],[1047.2,792.9],[1019.5,849.6],[991.6,910.5],[962.7,950.7],[930.7,988.1],[897.8,1015.8],[866.7,1043.9],[840.1,1061.4],[819.2,1071.1],[803.3,1074.4],[791.4,1075.1],[782.6,1075.7],[775.5,1078.6],[775.5,1078.6]]},{"rating":"diamond","pts":[[729.0,342.5],[708.8,368.4],[679.0,393.6],[644.5,419.3],[610.6,427.6],[582.9,441.1],[560.9,461.7],[540.8,491.6],[523.4,528.9],[509.5,575.3],[500.4,618.5],[497.8,659.2],[501.9,705.1],[511.4,742.8],[525.0,771.1],[540.8,804.5],[560.5,848.6],[586.3,900.3],[616.1,948.1],[646.9,986.3],[675.3,1021.2],[700.7,1049.8],[724.5,1063.8],[745.5,1071.2],[762.7,1075.9],[775.5,1078.6],[775.5,1078.6]]}],"base":[775.5,1078.6],"summit":[816.9,175.2],"lifts":[{"id":"A","a":[775.5,1078.6],"b":[753.1,401.4]},{"id":"B","a":[775.5,1078.6],"b":[926.8,467.2]},{"id":"C","a":[597.6,938.0],"b":[578.2,579.9]},{"id":"D","a":[969.4,913.0],"b":[1040.0,521.4]}]};
  var NS = 'http://www.w3.org/2000/svg';
  function el(n, a, p) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  function d(pts) { return pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0] + ' ' + p[1]; }).join(''); }
  var SHAPE = {
    dot: '<circle r="9" fill="#141B2A" stroke="#fff" stroke-width="3"/>',
    square: '<rect x="-8" y="-8" width="16" height="16" fill="#141B2A" stroke="#fff" stroke-width="3"/>',
    diamond: '<path d="M0 -11L11 0L0 11L-11 0Z" fill="#141B2A" stroke="#fff" stroke-width="3"/>'
  };
  var BIG = {
    dot: '<circle r="17" fill="#141B2A" stroke="#fff" stroke-width="3.5"/>',
    square: '<rect x="-15" y="-15" width="30" height="30" fill="#141B2A" stroke="#fff" stroke-width="3.5"/>',
    diamond: '<path d="M0 -21L21 0L0 21L-21 0Z" fill="#141B2A" stroke="#fff" stroke-width="3.5"/>'
  };
  var tpls = [].slice.call(document.querySelectorAll('template[data-run]'));
  var SHORT = tpls.map(function (t) { return t.getAttribute('data-short'); });
  MAP.lifts.forEach(function (l) {
    var g = el('g', { 'class': 'tm-lift' }, svg);
    el('line', { x1: l.a[0], y1: l.a[1], x2: l.b[0], y2: l.b[1], 'class': 'case' }, g);
    el('line', { x1: l.a[0], y1: l.a[1], x2: l.b[0], y2: l.b[1], 'class': 'line' }, g);
    [l.a, l.b].forEach(function (p) { el('circle', { cx: p[0], cy: p[1], r: 5 }, g); });
    var mx = l.a[0] + (l.b[0] - l.a[0]) * .55, my = l.a[1] + (l.b[1] - l.a[1]) * .55;
    el('circle', { cx: mx, cy: my, r: 14 }, g);
    var t = el('text', { x: mx, y: my + 6, 'text-anchor': 'middle', 'class': 'id' }, g); t.textContent = l.id;
  });
  var runs = MAP.runs.map(function (r, i) {
    var g = el('g', { 'class': 'tm-run' }, svg), pd = d(r.pts);
    el('path', { d: pd, 'class': 'hit' }, g); el('path', { d: pd, 'class': 'case' }, g); el('path', { d: pd, 'class': 'line' }, g);
    var n = r.pts.length;
    // each run carries its number inside its trail-rating marker; the picked run's name reads large in the open sky above the summit
    var s = r.pts[Math.floor(n * .22)], m = el('g', { transform: 'translate(' + s[0] + ' ' + s[1] + ')', 'class': 'tm-mark' }, g); m.innerHTML = BIG[r.rating];
    el('text', { y: 7, 'text-anchor': 'middle', 'class': 'num' }, m).textContent = i + 1;
    g.addEventListener('mouseenter', function () { pick(i); }); g.addEventListener('click', function () { pick(i); });
    return g;
  });
  function callout(p, big, small, dy) {
    var g = el('g', { 'class': 'tm-callout' }, svg);
    var a = el('text', { x: p[0], y: p[1] + dy, 'text-anchor': 'middle', 'class': 'big' }, g); a.textContent = big;
    var b = el('text', { x: p[0], y: p[1] + dy + 22, 'text-anchor': 'middle' }, g); b.textContent = small;
  }
  callout(MAP.summit, 'Summit', '2,850 m', -30);
  callout([MAP.base[0] + (innerWidth < 561 ? 190 : 330), MAP.base[1] - 52], 'Base lodge', '1,200 m · your team today', 0);
  var sky = el('text', { x: 800, y: 74, 'text-anchor': 'middle', 'class': 'tm-sky' }, svg);
  MAP.runs.forEach(function (r, i) {
    var b = document.createElement('button'); b.type = 'button';
    b.innerHTML = '<svg viewBox="-12 -12 24 24" aria-hidden="true">' + SHAPE[r.rating].replace('#141B2A', 'currentColor').replace('stroke="#fff"', 'stroke="none"') + '</svg>';
    var k = document.createElement('b'); k.className = 'tm-no'; k.textContent = ('0' + (i + 1)).slice(-2); b.appendChild(k);
    b.appendChild(document.createTextNode(SHORT[i] || ''));
    b.addEventListener('click', function () { pick(i); });
    list.appendChild(b);
  });
  function pick(i) {
    runs.forEach(function (g, j) { g.classList.toggle('on', i === j); });
    [].forEach.call(list.children, function (b, j) { b.setAttribute('aria-pressed', i === j ? 'true' : 'false'); });
    sky.textContent = 'Run ' + ('0' + (i + 1)).slice(-2) + ' \u00b7 ' + (SHORT[i] || '');
    if (tpls[i]) { card.innerHTML = ''; card.appendChild(tpls[i].content.cloneNode(true)); }
  }
  pick(0);
  var mw = document.querySelector('.tm-wrap');
  if (mw) mw.scrollLeft = (mw.scrollWidth - mw.clientWidth) / 2;
})();
