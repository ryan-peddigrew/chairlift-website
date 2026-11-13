/* Real 3D Chairlift emblem (three.js). Falls back to the CSS coin if WebGL is unavailable. */
import * as THREE from 'three';
import { FontLoader } from '/vendor/FontLoader.js';
import { TextGeometry } from '/vendor/TextGeometry.js';

// home: the big landing logo (.pc-logo). Every other page: a small spinning logo in the middle of the top bar.
let host = document.querySelector('.pc-logo');
const mini = !host;
if (mini) {
  const brand = document.querySelector('.site-header .brand');
  if (brand) { host = document.createElement('span'); host.className = 'hdr-gl'; host.setAttribute('aria-hidden', 'true'); brand.insertBefore(host, brand.firstChild); }
}
if (host) {
  try {
    const canvas = document.createElement('canvas');
    canvas.className = 'pc-gl';
    // No graphics chip (software drawing only)? Then skip the 3D logo and keep the flat one: drawing it in software makes the whole page stutter.
    // ?gl=force overrides this for testing.
    const force = /[?&]gl=force/.test(location.search);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, failIfMajorPerformanceCaveat: !force });
    if (!force) {
      const g = renderer.getContext(), di = g.getExtension('WEBGL_debug_renderer_info');
      if (di && /swiftshader|llvmpipe|software|basic render/i.test(String(g.getParameter(di.UNMASKED_RENDERER_WEBGL)))) { renderer.dispose(); throw new Error('software graphics'); }
    }
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    // liquid-chrome studio: dark horizon-split dome with a few hard white strip lights, so reflections read as mirror, not pewter
    const studio = new THREE.Scene();
    const dome = new THREE.Mesh(new THREE.SphereGeometry(20, 48, 24), new THREE.ShaderMaterial({
      side: THREE.BackSide,
      vertexShader: 'varying vec3 v; void main(){ v = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
      fragmentShader: 'varying vec3 v; void main(){ float h = v.y; vec3 sky = mix(vec3(.55,.72,.98), vec3(.05,.12,.3), smoothstep(0., .9, h)); vec3 gnd = mix(vec3(.02,.03,.05), vec3(.0), smoothstep(0., -.8, h)); float hz = smoothstep(.02, 0., abs(h)) * 1.4; vec3 c = h > 0. ? sky : gnd; c += hz * vec3(1.); gl_FragColor = vec4(c, 1.); }'
    }));
    studio.add(dome);
    const strip = (w, h, x, y, z, i) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(i, i, i), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); studio.add(m); };
    strip(18, 5, 0, 11, 6, 3.2); strip(4, 14, -12, 1, 4, 2.2); strip(3, 12, 12, -1, 2, 1.8); strip(12, 3, 0, -6, 10, 1.4); strip(8, 8, 0, 3, -14, 1.2);
    scene.environment = pmrem.fromScene(studio, 0).texture;
    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 50);
    camera.position.set(0, mini ? 0 : -0.4, mini ? 5.6 : 7.1);

    const steel = new THREE.MeshPhysicalMaterial({ color: 0xdfe5ef, metalness: 0.9, roughness: 0.3, clearcoat: 0, envMapIntensity: 0.85 });
    const neon = new THREE.MeshPhysicalMaterial({ color: 0x3dffc1, metalness: 0.7, roughness: 0.34, envMapIntensity: 0.8 });
    const dark = new THREE.MeshPhysicalMaterial({ color: 0x1a2232, metalness: 0.85, roughness: 0.55, envMapIntensity: 0.8 });
    const bevel = (d, t) => ({ depth: d, bevelEnabled: true, bevelThickness: t, bevelSize: t, bevelOffset: 0, bevelSegments: 12, curveSegments: 72 });

    const emblem = new THREE.Group();
    const bar = (cx, cy, mat) => {
      const w = 1.0, h = 0.27, r = 0.05, s = new THREE.Shape();
      s.moveTo(-w / 2 + r, -h / 2); s.lineTo(w / 2 - r, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
      s.lineTo(w / 2, h / 2 - r); s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
      s.lineTo(-w / 2 + r, h / 2); s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
      s.lineTo(-w / 2, -h / 2 + r); s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
      const m = new THREE.Mesh(new THREE.ExtrudeGeometry(s, bevel(0.32, 0.1)), mat);
      m.position.set(cx, cy, -0.16); return m;
    };
    const inner = new THREE.Group();
    inner.add(bar(-0.5, -0.52, steel), bar(0, 0, steel), bar(0.5, 0.52, neon));
    // logo shape options for review: ?logo=a ring, b tile (the real logo), c coin, d bars only (remembered per browser)
    let kind = 'a', ring = null;
    kind = (location.search.match(/logo=([a-d])/) || [])[1] || 'a';   // the ring is the chosen logo; other shapes only by ?logo= for comparison
    if (kind === 'b') {
      const w = 2.3, r = 0.08, sh = new THREE.Shape();
      sh.moveTo(-w / 2 + r, -w / 2); sh.lineTo(w / 2 - r, -w / 2); sh.quadraticCurveTo(w / 2, -w / 2, w / 2, -w / 2 + r);
      sh.lineTo(w / 2, w / 2 - r); sh.quadraticCurveTo(w / 2, w / 2, w / 2 - r, w / 2);
      sh.lineTo(-w / 2 + r, w / 2); sh.quadraticCurveTo(-w / 2, w / 2, -w / 2, w / 2 - r);
      sh.lineTo(-w / 2, -w / 2 + r); sh.quadraticCurveTo(-w / 2, -w / 2, -w / 2 + r, -w / 2);
      const tile = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, bevel(0.34, 0.06)), dark);
      tile.position.z = -0.56;
      inner.scale.setScalar(0.92); inner.position.z = 0.02;
      emblem.add(tile, inner);
    } else if (kind === 'c') {
      const coin = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.62, 128, 1), steel);
      coin.rotation.x = Math.PI / 2; coin.position.z = -0.5;
      const face = new THREE.Mesh(new THREE.CircleGeometry(1.12, 96), dark); face.position.z = -0.185;
      inner.scale.setScalar(0.78);
      emblem.add(coin, face, inner);
    } else if (kind === 'd') {
      inner.scale.setScalar(1.25);
      emblem.add(inner);
    } else {
      inner.scale.setScalar(0.78);
      ring = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.11, 48, 160), steel);
      emblem.add(inner, ring);
    }
    emblem.scale.setScalar(0.72);
    const wordMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.7, metalness: 0.3, roughness: 0.25, clearcoat: 0.6, envMapIntensity: 1.2, transparent: true });
    let word = null;
    // "Chairlift" in extruded satin metal under the ring, held still
    // ?wfont=<name> previews another typeface for the word (vendor/w-<name>.json), fitted to the same width
    const wfont = (new URLSearchParams(location.search).get('wfont') || 'michroma').replace(/[^a-z0-9]/g, '');   // Michroma chosen 2026-10-27
    if (!mini) fetch(wfont ? '/vendor/w-' + wfont + '.json' : '/vendor/hanken-chairlift.json').then((r) => r.json()).then((data) => {
      const font = new FontLoader().parse(data), size = 0.62, track = wfont ? 0.02 : 0.032;   // letters set one by one with a little air, so f and t never touch
      word = new THREE.Group();
      let x = 0;
      for (const ch of 'Chairlift') {
        const g = new TextGeometry(ch, { font, size, height: 0.07, curveSegments: 12, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.004, bevelSegments: 3 });
        const m = new THREE.Mesh(g, wordMat); m.position.x = x; word.add(m);
        x += (data.glyphs[ch] ? data.glyphs[ch].ha : 300) / data.resolution * size + track;
      }
      const bb = new THREE.Box3().setFromObject(word), mid = bb.getCenter(new THREE.Vector3());
      word.children.forEach((m) => { m.position.x -= mid.x; m.position.y -= mid.y; });
      word.scale.setScalar(wfont ? Math.min(0.92, 2.7 / (bb.max.x - bb.min.x)) : 0.92);
      word.position.set(0, -1.48, 0);
      scene.add(word);
    }).catch(() => {});
    scene.add(emblem);

    const key = new THREE.DirectionalLight(0xdfe9ff, 1.6); key.position.set(2.5, 3, 4); scene.add(key);
    const rim = new THREE.DirectionalLight(0x6fa0e8, 1.2); rim.position.set(-3, -1, -2); scene.add(rim);

    // Phones and tablets (11 Nov 2026): once the logo is parked in the top bar it is shown small, so it is drawn small
    // (about 7 times fewer pixels) and redrawn 30 times a second instead of 60. Same look, far less battery. Desktop is untouched.
    const phone = window.matchMedia('(max-width: 860px), (hover: none)').matches;
    let parked = false;
    const size = () => {
      const w = host.clientWidth || 200, dpr = Math.min(window.devicePixelRatio || 1, 2);
      const ds = (window.__px && window.__px.ds) || 76;
      renderer.setPixelRatio(parked ? Math.min(dpr, ds * Math.min(window.devicePixelRatio || 1, 3) / w) : dpr); renderer.setSize(w, w, false);
    };
    // scroll numbers come straight from pxp.js (window.__px); reading them from CSS made the browser recompute styles on every frame
    const css = (n) => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(n)) || 0;
    const px = () => window.__px || { dk: css('--dk'), p: css('--p'), intro: css('--in') };
    size(); window.addEventListener('resize', size);
    host.appendChild(canvas); host.classList.add('is-3d'); document.documentElement.classList.add('logo-docked');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    let visible = true;
    new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(host);
    const t0 = performance.now(); let spin = 0, ringSpin = 0, last = t0;
    const frame = (now) => {
      requestAnimationFrame(frame);
      if (!visible) return;
      const st = mini ? null : px();
      const dkNow = mini ? 1 : st.dk;
      const docked = mini || dkNow >= 0.99, moving = !docked && dkNow > 0.01;
      if (phone) {
        if (docked && now - last < 30) return;        // parked: 30 frames a second is plenty for a ring that takes 9 s a turn
        if (!mini && docked !== parked) { parked = docked; size(); }
      }
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      const face = (a) => Math.round(a / (Math.PI * 2)) * Math.PI * 2;
      if (docked) {                                 // in the top bar: the three bars hold still, only the ring turns around them (9 s a turn; Ryan, 13 Nov 2026: 16 s was too slow)
        spin = face(spin); ringSpin += dt * Math.PI * 2 / 9;
      } else if (moving) {                          // flying up: settle face-on so the flip is one clean somersault
        spin += (face(spin) - spin) * 0.2; ringSpin += (face(ringSpin) - ringSpin) * 0.2;
      } else {                                      // landing: the whole logo turns, one spin every 8 s
        spin += dt * Math.PI * 2 / 8; ringSpin += (face(ringSpin) - ringSpin) * 0.2;
      }
      emblem.rotation.y = reduce ? 0.5 : spin;
      if (ring) ring.rotation.y = reduce ? 0 : ringSpin;
      if (word) {                                   // word shows only on the opening screen, gone once the logo moves beside the title
        const p = st.p, io = st.intro || 0;   // intro screen: logo only, the word arrives after it
        const o = Math.max(0, 1 - p / 0.25) * (1 - io); wordMat.opacity = o; word.visible = o > 0.01;
      }
      const flip = moving && !reduce ? -ease(Math.min(1, dkNow / 0.95)) * Math.PI * 2 : 0;   // one forward flip on the way into the top bar
      emblem.rotation.x = reduce ? 0 : flip + (docked || moving ? 0 : Math.sin(now / 2600) * 0.08);
      renderer.render(scene, camera);
    };
    requestAnimationFrame(frame);
  } catch (e) {
    // no 3D on this device: the home hero shows the flat logo and wordmark instead (tune.css, html.no-3d); other pages keep the flat logo in the top bar
    if (mini && host.parentNode) host.parentNode.removeChild(host);
    document.documentElement.classList.add('no-3d');
  }
}
