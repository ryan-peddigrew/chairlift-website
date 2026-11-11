/* Slow drifting fog behind the hero (WebGL, no image loop). Quietly does nothing without WebGL. */
(function () {
  var c = document.querySelector('.pc-fog');
  if (!c) return;
  var gl = c.getContext('webgl', { alpha: true, premultipliedAlpha: true, failIfMajorPerformanceCaveat: !/[?&]gl=force/.test(location.search) });   // no graphics chip: no fog, rather than a stuttering page
  if (!gl) return;
  var di = gl.getExtension('WEBGL_debug_renderer_info');
  if (di && !/[?&]gl=force/.test(location.search) && /swiftshader|llvmpipe|software|basic render/i.test(String(gl.getParameter(di.UNMASKED_RENDERER_WEBGL)))) return;
  var vs = 'attribute vec2 p;varying vec2 u;void main(){u=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
  var fs = 'precision mediump float;varying vec2 u;uniform float t;uniform vec2 r;' +
    'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}' +
    'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}' +
    'float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*n(p);p=p*2.02+vec2(5.2,1.3);a*=.5;}return s;}' +
    'void main(){vec2 q=u*vec2(r.x/r.y,1.)*2.2;q.x+=t*.012;' +
    'float f=fbm(q+vec2(0.,fbm(q*.8+t*.006)));' +
    'float d=smoothstep(.42,.78,f);' +
    'float band=smoothstep(1.,.15,u.y)*.85+smoothstep(.55,.0,abs(u.y-.28))*.35;' +   // soft in the sky and again low in the valley
    'float a=d*band*.62;gl_FragColor=vec4(vec3(.86,.91,.98)*a,a);}';
  function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
  var pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
  gl.useProgram(pr);
  var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  var ut = gl.getUniformLocation(pr, 't'), ur = gl.getUniformLocation(pr, 'r');
  // Phones (11 Nov 2026): the fog is a soft blur, so it is drawn at 300 px wide and 24 times a second there (about 6 times less work). Desktop keeps 480 px at full rate.
  var phone = window.matchMedia('(max-width: 860px), (hover: none)').matches, BW = phone ? 300 : 480, gap = phone ? 40 : 0, lastT = 0;
  function size() { c.width = BW; c.height = Math.max(270, Math.round(BW * c.clientHeight / Math.max(1, c.clientWidth))); gl.viewport(0, 0, c.width, c.height); gl.uniform2f(ur, c.width, c.height); }
  size(); window.addEventListener('resize', size);
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches, t0 = performance.now(), vis = true;
  var running = false;
  function kick() { if (!running) { running = true; requestAnimationFrame(frame); } }
  new IntersectionObserver(function (e) { vis = e[0].isIntersecting; if (vis) kick(); }).observe(c);
  function frame(now) {
    running = false;
    if (!vis) return;                      // hero off screen: the fog stops completely until it scrolls back
    kick();
    if (document.hidden || now - lastT < gap) return;
    lastT = now;
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(ut, reduce ? 20 : 20 + (now - t0) / 1000);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  kick();
})();
