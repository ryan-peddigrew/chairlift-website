/* Real 3D Chairlift emblem (three.js). Falls back to the CSS coin if WebGL is unavailable. */
import * as THREE from 'three';

const host = document.querySelector('.pc-logo');
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
    strip(14, 1.2, 0, 11, 6, 9); strip(1.4, 12, -12, 1, 4, 7); strip(1.0, 10, 12, -1, 2, 6); strip(10, .8, 0, -6, 10, 4); strip(6, 6, 0, 3, -14, 3);
    scene.environment = pmrem.fromScene(studio, 0).texture;
    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 50);
    camera.position.set(0, 0, 6.2);

    const steel = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1, roughness: 0.04, clearcoat: 0, envMapIntensity: 1.15 });
    const neon = new THREE.MeshPhysicalMaterial({ color: 0x3dffc1, metalness: 1, roughness: 0.05, envMapIntensity: 1.25 });
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
    inner.scale.setScalar(0.78);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.11, 48, 160), steel);
    emblem.add(inner, ring);
    emblem.scale.setScalar(0.72);
    scene.add(emblem);

    const key = new THREE.DirectionalLight(0xdfe9ff, 1.6); key.position.set(2.5, 3, 4); scene.add(key);
    const rim = new THREE.DirectionalLight(0x6fa0e8, 1.2); rim.position.set(-3, -1, -2); scene.add(rim);

    const size = () => {
      const w = host.clientWidth || 200, dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr); renderer.setSize(w, w, false);
    };
    size(); window.addEventListener('resize', size);
    host.appendChild(canvas); host.classList.add('is-3d');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    let visible = true;
    new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(host);
    const t0 = performance.now();
    const frame = (now) => {
      requestAnimationFrame(frame);
      if (!visible) return;
      const t = ((now - t0) / 1000) % 10;           // 10 s cycle: 7.5 s turn, 2.5 s facing forward
      const turn = t < 7.5 ? ease(t / 7.5) * Math.PI * 2 : 0;
      emblem.rotation.y = reduce ? 0.5 : turn;
      emblem.rotation.x = reduce ? 0 : Math.sin(now / 2600) * 0.08;
      renderer.render(scene, camera);
    };
    requestAnimationFrame(frame);
  } catch (e) { /* keep CSS coin */ }
}
