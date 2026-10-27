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
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
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
    let kind = 'a';
    try { kind = (location.search.match(/logo=([a-d])/) || [])[1] || sessionStorage.getItem('pxlogo') || 'a'; sessionStorage.setItem('pxlogo', kind); } catch (e) {}
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
      emblem.add(inner, new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.11, 48, 160), steel));
    }
    emblem.scale.setScalar(0.72);
    const wordMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.7, metalness: 0.3, roughness: 0.25, clearcoat: 0.6, envMapIntensity: 1.2, transparent: true });
    let word = null;
    // "Chairlift" in extruded satin metal under the ring, held still
    if (!mini) fetch('/vendor/hanken-chairlift.json').then((r) => r.json()).then((data) => {
      const font = new FontLoader().parse(data), size = 0.62, track = 0.032;   // letters set one by one with a little air, so f and t never touch
      word = new THREE.Group();
      let x = 0;
      for (const ch of 'Chairlift') {
        const g = new TextGeometry(ch, { font, size, height: 0.07, curveSegments: 12, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.004, bevelSegments: 3 });
        const m = new THREE.Mesh(g, wordMat); m.position.x = x; word.add(m);
        x += (data.glyphs[ch] ? data.glyphs[ch].ha : 300) / data.resolution * size + track;
      }
      const bb = new THREE.Box3().setFromObject(word), mid = bb.getCenter(new THREE.Vector3());
      word.children.forEach((m) => { m.position.x -= mid.x; m.position.y -= mid.y; });
      word.scale.setScalar(0.92);
      word.position.set(0, -1.48, 0);
      scene.add(word);
    }).catch(() => {});
    scene.add(emblem);

    const key = new THREE.DirectionalLight(0xdfe9ff, 1.6); key.position.set(2.5, 3, 4); scene.add(key);
    const rim = new THREE.DirectionalLight(0x6fa0e8, 1.2); rim.position.set(-3, -1, -2); scene.add(rim);

    const size = () => {
      const w = host.clientWidth || 200, dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr); renderer.setSize(w, w, false);
    };
    size(); window.addEventListener('resize', size);
    host.appendChild(canvas); host.classList.add('is-3d'); document.documentElement.classList.add('logo-docked');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    let visible = true;
    new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(host);
    const t0 = performance.now(); let spin = 0, last = t0;
    const frame = (now) => {
      requestAnimationFrame(frame);
      if (!visible) return;
      const dkNow = mini ? 1 : (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--dk')) || 0);
      const moving = !mini && dkNow > 0.01 && dkNow < 0.99;
      if (moving) spin += (Math.round(spin / (Math.PI * 2)) * Math.PI * 2 - spin) * 0.18;   // while it glides up, settle face-on: no flipping
      else spin += Math.min(0.1, (now - last) / 1000) * Math.PI * 2 / (8 + 8 * dkNow);      // one turn every 8 s on the landing, a slow 16 s in the top bar
      last = now;
      const turn = spin;
      emblem.rotation.y = reduce ? 0.5 : turn;
      if (word) {                                   // word shows only on the opening screen, gone once the logo moves beside the title
        const p = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--p')) || 0;
        const o = Math.max(0, 1 - p / 0.25); wordMat.opacity = o; word.visible = o > 0.01;
      }
      emblem.rotation.x = reduce || moving ? 0 : Math.sin(now / 2600) * 0.08;
      renderer.render(scene, camera);
    };
    requestAnimationFrame(frame);
  } catch (e) { /* keep CSS coin */ }
}
