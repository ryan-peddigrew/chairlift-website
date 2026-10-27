/* Real 3D Chairlift emblem (three.js). Falls back to the CSS coin if WebGL is unavailable. */
import * as THREE from 'three';
import { RoomEnvironment } from '/vendor/RoomEnvironment.js';

const host = document.querySelector('.pc-logo');
if (host) {
  try {
    const canvas = document.createElement('canvas');
    canvas.className = 'pc-gl';
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 50);
    camera.position.set(0, 0, 6.2);

    const steel = new THREE.MeshPhysicalMaterial({ color: 0xf2f5fb, metalness: 1, roughness: 0.18, clearcoat: 0.5, clearcoatRoughness: 0.2, envMapIntensity: 2.4 });
    const dark = new THREE.MeshPhysicalMaterial({ color: 0x1a2232, metalness: 0.85, roughness: 0.55, envMapIntensity: 0.8 });
    const bevel = (d, t) => ({ depth: d, bevelEnabled: true, bevelThickness: t, bevelSize: t, bevelOffset: 0, bevelSegments: 6, curveSegments: 72 });

    const emblem = new THREE.Group();
    const bar = (cx, cy) => {
      const w = 1.0, h = 0.27, r = 0.05, s = new THREE.Shape();
      s.moveTo(-w / 2 + r, -h / 2); s.lineTo(w / 2 - r, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
      s.lineTo(w / 2, h / 2 - r); s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
      s.lineTo(-w / 2 + r, h / 2); s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
      s.lineTo(-w / 2, -h / 2 + r); s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
      const m = new THREE.Mesh(new THREE.ExtrudeGeometry(s, bevel(0.32, 0.06)), steel);
      m.position.set(cx, cy, -0.16); return m;
    };
    emblem.add(bar(-0.5, -0.52), bar(0, 0), bar(0.5, 0.52));
    emblem.scale.setScalar(0.8);
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
