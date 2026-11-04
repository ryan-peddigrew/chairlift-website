/* Chairlift home: the trail map. Eight runs rated like a ski hill (green circle to double black diamond), four lifts,
   summit and base lodge. Map art is our own generated terrain (images/trail-map.*). Run details come from the
   <template data-run> tags written by tools/kin.py. */
(function () {
  'use strict';
  var svg = document.getElementById('tm-svg'), list = document.getElementById('tm-list'), card = document.getElementById('tm-card');
  if (!svg || !list || !card) return;
  var MAP = {"runs":[{"rating":"green","pts":[[828.4,183.6],[821.8,189.8],[812.2,209.6],[800.7,272.3],[788.8,331.4],[777.9,378.0],[768.0,415.3],[758.0,447.3],[748.2,472.8],[738.9,500.2],[730.6,528.4],[723.0,564.1],[715.8,596.5],[709.6,630.3],[705.1,665.1],[703.1,698.4],[704.6,732.8],[709.7,769.9],[717.1,806.2],[725.5,839.3],[733.4,873.6],[741.3,913.4],[750.5,959.4],[760.1,1002.2],[768.9,1043.4],[775.5,1078.6],[775.5,1078.6]]},{"rating":"green","pts":[[861.8,241.3],[863.8,264.0],[866.9,297.5],[870.4,336.4],[873.0,364.0],[873.8,392.7],[872.4,428.1],[869.2,459.8],[864.7,483.7],[859.0,513.3],[852.6,556.8],[844.4,597.1],[834.0,624.1],[822.7,657.3],[811.9,688.2],[803.2,721.2],[797.1,752.2],[793.0,788.8],[790.1,824.2],[787.8,859.4],[785.3,898.3],[782.6,935.4],[780.3,973.7],[778.4,1012.5],[776.8,1048.8],[775.5,1078.6],[775.5,1078.6]]},{"rating":"blue","pts":[[894.2,365.0],[905.3,395.7],[921.9,420.3],[941.3,455.6],[960.6,481.7],[976.4,490.7],[988.8,500.9],[999.8,510.5],[1008.9,521.7],[1015.2,535.5],[1017.8,566.6],[1015.5,595.2],[1008.3,629.4],[997.3,663.3],[983.5,705.6],[968.5,760.6],[950.9,809.6],[929.4,853.8],[905.6,889.6],[881.6,919.6],[859.6,950.6],[839.6,979.9],[820.2,1009.2],[802.4,1030.9],[787.1,1057.0],[775.5,1078.6],[775.5,1078.6]]},{"rating":"blue","pts":[[778.6,272.1],[763.2,329.7],[740.5,395.3],[714.1,438.7],[687.9,472.0],[665.8,499.4],[647.7,521.6],[630.7,546.6],[615.5,573.0],[602.9,602.7],[593.8,631.9],[589.1,652.7],[588.9,670.9],[592.2,683.5],[598.1,708.3],[605.7,744.8],[616.0,781.2],[630.2,828.2],[647.2,870.5],[665.7,913.4],[683.9,946.1],[702.8,977.4],[723.5,1009.8],[744.0,1035.3],[762.1,1059.9],[775.5,1078.6],[775.5,1078.6]]},{"rating":"blue","pts":[[941.2,450.4],[961.6,469.3],[992.9,480.9],[1029.1,480.2],[1063.5,484.9],[1088.7,492.1],[1102.7,505.8],[1110.0,524.3],[1111.6,561.4],[1108.7,602.3],[1102.4,644.0],[1090.7,694.7],[1071.7,739.0],[1047.2,792.9],[1019.5,849.6],[991.6,910.5],[962.7,950.7],[930.7,988.1],[897.8,1015.8],[866.7,1043.9],[840.1,1061.4],[819.2,1071.1],[803.3,1074.4],[791.4,1075.1],[782.6,1075.7],[775.5,1078.6],[775.5,1078.6]]},{"rating":"black","pts":[[729.0,342.5],[708.8,368.4],[679.0,393.6],[644.5,419.3],[610.6,427.6],[582.9,441.1],[560.9,461.7],[540.8,491.6],[523.4,528.9],[509.5,575.3],[500.4,618.5],[497.8,659.2],[501.9,705.1],[511.4,742.8],[525.0,771.1],[540.8,804.5],[560.5,848.6],[586.3,900.3],[616.1,948.1],[646.9,986.3],[675.3,1021.2],[700.7,1049.8],[724.5,1063.8],[745.5,1071.2],[762.7,1075.9],[775.5,1078.6],[775.5,1078.6]]},{"rating":"dd","pts":[[660.0,300.0],[652.2,304.7],[642.4,310.1],[631.0,316.3],[618.1,323.2],[604.1,330.7],[589.2,338.8],[573.8,347.5],[557.9,356.7],[542.0,366.3],[526.2,376.4],[510.8,386.8],[496.2,397.6],[482.5,408.7],[470.0,420.0],[458.1,431.8],[446.2,444.3],[434.2,457.4],[422.3,471.0],[410.6,485.1],[399.2,499.6],[388.1,514.4],[377.6,529.4],[367.6,544.6],[358.3,559.8],[349.8,575.0],[342.2,590.2],[335.6,605.2],[330.0,620.0],[325.2,634.8],[321.0,649.8],[317.3,665.1],[314.3,680.4],[311.9,695.9],[310.2,711.4],[309.4,726.9],[309.4,742.3],[310.2,757.5],[312.1,772.6],[314.9,787.5],[318.8,802.0],[323.8,816.2],[330.0,830.0],[337.6,843.6],[346.6,857.2],[357.0,870.7],[368.5,884.2],[381.2,897.4],[394.7,910.5],[409.0,923.2],[424.0,935.6],[439.5,947.7],[455.4,959.3],[471.5,970.3],[487.8,980.9],[504.0,990.8],[520.0,1000.0],[536.8,1008.6],[555.3,1016.7],[575.0,1024.3],[595.7,1031.4],[616.9,1038.0],[638.3,1044.2],[659.6,1049.9],[680.4,1055.2],[700.4,1060.1],[719.2,1064.5],[736.5,1068.6],[751.8,1072.3],[765.0,1075.6],[775.5,1078.6]]},{"rating":"dd","pts":[[990.0,330.0],[999.6,335.5],[1011.7,342.0],[1026.1,349.3],[1042.2,357.5],[1059.7,366.4],[1078.3,376.0],[1097.5,386.2],[1117.1,397.1],[1136.5,408.4],[1155.6,420.1],[1173.8,432.2],[1190.9,444.6],[1206.4,457.2],[1220.0,470.0],[1232.4,483.3],[1244.7,497.2],[1256.6,511.9],[1268.1,527.0],[1279.2,542.7],[1289.6,558.7],[1299.4,575.0],[1308.3,591.5],[1316.4,608.1],[1323.5,624.8],[1329.5,641.4],[1334.3,657.9],[1337.8,674.1],[1340.0,690.0],[1340.9,705.9],[1340.6,722.2],[1339.3,738.8],[1337.0,755.5],[1333.6,772.3],[1329.2,789.0],[1323.8,805.6],[1317.4,822.0],[1310.1,838.1],[1301.8,853.7],[1292.7,868.8],[1282.6,883.3],[1271.7,897.1],[1260.0,910.0],[1246.9,922.3],[1232.0,934.1],[1215.6,945.5],[1197.8,956.4],[1179.0,966.8],[1159.3,976.8],[1139.0,986.3],[1118.4,995.4],[1097.6,1004.0],[1076.9,1012.1],[1056.6,1019.8],[1036.9,1027.0],[1017.9,1033.7],[1000.0,1040.0],[982.3,1045.7],[964.1,1050.6],[945.5,1055.0],[926.7,1058.8],[908.0,1062.1],[889.5,1065.0],[871.5,1067.4],[854.1,1069.6],[837.7,1071.4],[822.2,1073.0],[808.1,1074.5],[795.5,1075.9],[784.5,1077.2],[775.5,1078.6]]}],"base":[775.5,1078.6],"summit":[816.9,175.2],"lifts":[{"id":"A","a":[775.5,1078.6],"b":[753.1,401.4]},{"id":"B","a":[775.5,1078.6],"b":[926.8,467.2]},{"id":"C","a":[597.6,938.0],"b":[578.2,579.9]},{"id":"D","a":[969.4,913.0],"b":[1040.0,521.4]}]};
  var NS = 'http://www.w3.org/2000/svg';
  function el(n, a, p) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  function d(pts) { return pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0] + ' ' + p[1]; }).join(''); }
  var COL = { green: '#1F8A55', blue: '#1E5FB4', black: '#141B2A', dd: '#141B2A' };
  // rating marks, drawn around 0,0 at size s
  function mark(r, s, stroke) {
    var st = stroke ? ' stroke="#fff" stroke-width="' + (s * .28) + '"' : '', c = COL[r], h = s * .95;
    if (r === 'green') return '<circle r="' + s * .8 + '" fill="' + c + '"' + st + '/>';
    if (r === 'blue') return '<rect x="' + -s * .72 + '" y="' + -s * .72 + '" width="' + s * 1.44 + '" height="' + s * 1.44 + '" fill="' + c + '"' + st + '/>';
    var dia = function (x) { return '<path d="M' + x + ' ' + -h + 'L' + (x + h) + ' 0L' + x + ' ' + h + 'L' + (x - h) + ' 0Z" fill="' + c + '"' + st + '/>'; };
    return r === 'black' ? dia(0) : dia(-h * .78) + dia(h * .78);
  }
  // phones: crop to the mountain so the whole map fits the screen (no sideways scroll), draw everything bigger,
  // and show only the picked run's sign (the run list below names the rest)
  var wrap = svg.parentNode, sm = wrap.parentNode.clientWidth < 600, K = sm ? 2.6 : 1, VB = sm ? [262, 40, 1126, 1066] : [0, 0, 1600, 1100];
  if (sm) {
    svg.setAttribute('viewBox', VB.join(' ')); svg.classList.add('tm-sm');
    wrap.style.minWidth = '0'; wrap.style.aspectRatio = VB[2] + ' / ' + VB[3];
    var im = wrap.querySelector('img');
    if (im) { im.style.inset = 'auto'; im.style.objectFit = 'fill'; im.style.maxWidth = 'none'; im.style.maxHeight = 'none'; im.style.left = (-VB[0] / VB[2] * 100) + '%'; im.style.top = (-VB[1] / VB[3] * 100) + '%'; im.style.width = (1600 / VB[2] * 100) + '%'; im.style.height = (1100 / VB[3] * 100) + '%'; }
  }
  var tpls = [].slice.call(document.querySelectorAll('template[data-run]'));
  var gLifts = el('g', {}, svg), gRuns = el('g', {}, svg), gTags = el('g', {}, svg);
  MAP.lifts.forEach(function (l) {
    var g = el('g', { 'class': 'tm-lift' }, gLifts);
    el('line', { x1: l.a[0], y1: l.a[1], x2: l.b[0], y2: l.b[1], 'class': 'case' }, g);
    el('line', { x1: l.a[0], y1: l.a[1], x2: l.b[0], y2: l.b[1], 'class': 'line' }, g);
    [l.a, l.b].forEach(function (p) { el('circle', { cx: p[0], cy: p[1], r: 5 * K }, g); });
    var mx = l.a[0] + (l.b[0] - l.a[0]) * .55, my = l.a[1] + (l.b[1] - l.a[1]) * .55;
    el('circle', { cx: mx, cy: my, r: 14 * K }, g);
    var t = el('text', { x: mx, y: my + 6 * K, 'text-anchor': 'middle', 'class': 'id' }, g); t.textContent = l.id;
  });
  var runs = MAP.runs.map(function (r, i) {
    var tp = tpls[i], name = tp ? tp.getAttribute('data-short') : '';
    var g = el('g', { 'class': 'tm-run', style: '--c:' + COL[r.rating] }, gRuns), pd = d(r.pts);
    el('path', { d: pd, 'class': 'hit' }, g); el('path', { d: pd, 'class': 'case' }, g);
    el('path', { d: pd, 'class': 'line' + (r.rating === 'black' || r.rating === 'dd' ? ' line--steep' : '') }, g);
    var n = r.pts.length, s = r.pts[Math.floor(n * .2)];
    var m = el('g', { transform: 'translate(' + s[0] + ' ' + s[1] + ')' }, g); m.innerHTML = mark(r.rating, 11 * K, true);
    // trail sign: rating mark + name on a white tag, beside the run
    var q = r.pts[Math.floor(n * (i % 2 ? .58 : .5))], tag = el('g', { 'class': 'tm-tag' }, gTags);
    var bg = el('rect', { rx: 6, height: 30, y: -15, 'class': 'bg' }, tag), ic = el('g', {}, tag); ic.innerHTML = mark(r.rating, 7, false);
    var tx = el('text', { x: 0, y: 5.5 }, tag); tx.textContent = name;
    var tw = tx.getComputedTextLength ? tx.getComputedTextLength() : name.length * 9;
    var iw = r.rating === 'dd' ? 26 : 16, w = 10 + iw + 6 + tw + 10;
    ic.setAttribute('transform', 'translate(' + (10 + iw / 2) + ' 0)'); tx.setAttribute('x', 10 + iw + 6); bg.setAttribute('width', w);
    var left = q[0] < MAP.base[0], tx0 = left ? q[0] - (w + 14) * K : q[0] + 14 * K;
    tx0 = Math.max(VB[0] + 12, Math.min(VB[0] + VB[2] - w * K - 12, tx0)); // never past the map edge
    tag.setAttribute('transform', 'translate(' + tx0 + ' ' + q[1] + ') scale(' + K + ')');
    [g, tag].forEach(function (x) { x.addEventListener('mouseenter', function () { pick(i); }); x.addEventListener('click', function () { pick(i); }); });
    return [g, tag];
  });
  function callout(p, big, small, dy) {
    var g = el('g', { 'class': 'tm-callout', transform: 'translate(' + p[0] + ' ' + (p[1] + dy * K) + ') scale(' + K * .8 + ')' }, svg);
    var a = el('text', { x: 0, y: 0, 'text-anchor': 'middle', 'class': 'big' }, g); a.textContent = big;
    var b = el('text', { x: 0, y: 22, 'text-anchor': 'middle' }, g); b.textContent = small;
  }
  callout(MAP.summit, 'Summit', '2,850 m', -30);
  callout([MAP.base[0], MAP.base[1] - 40 * K], 'Base lodge', '1,200 m', 0);
  MAP.runs.forEach(function (r, i) {
    var b = document.createElement('button'); b.type = 'button';
    b.innerHTML = '<svg viewBox="-20 -12 40 24" aria-hidden="true">' + mark(r.rating, 9, false) + '</svg>';
    b.appendChild(document.createTextNode(tpls[i] ? tpls[i].getAttribute('data-short') : ''));
    b.addEventListener('click', function () { pick(i); });
    list.appendChild(b);
  });
  function pick(i) {
    runs.forEach(function (x, j) { x[0].classList.toggle('on', i === j); x[1].classList.toggle('on', i === j); });
    svg.classList.add('has-pick');
    [].forEach.call(list.children, function (b, j) { b.setAttribute('aria-pressed', i === j ? 'true' : 'false'); });
    if (tpls[i]) {
      card.innerHTML = ''; card.appendChild(tpls[i].content.cloneNode(true));
      var k = card.querySelector('[data-mark]'); if (k) k.innerHTML = '<svg viewBox="-20 -12 40 24" aria-hidden="true">' + mark(MAP.runs[i].rating, 9, false) + '</svg>';
    }
  }
  pick(0);
  var mw = document.querySelector('.tm-wrap');
  if (mw && !sm) mw.scrollLeft = (mw.scrollWidth - mw.clientWidth) / 2;
})();
