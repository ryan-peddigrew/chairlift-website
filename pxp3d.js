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
    renderer.toneMappingExposure = 1.05;
    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 50);
    camera.position.set(0, 0, 7.2);

    const steel = new THREE.MeshPhysicalMaterial({ color: 0xcdd4e0, metalness: 1, roughness: 0.3, clearcoat: 0.25, clearcoatRoughness: 0.4, envMapIntensity: 1.25 });
    const dark = new THREE.MeshPhysicalMaterial({ color: 0x1a2232, metalness: 0.85, roughness: 0.55, envMapIntensity: 0.8 });
    const bevel = (d, t) => ({ depth: d, bevelEnabled: true, bevelThickness: t, bevelSize: t, bevelOffset: 0, bevelSegments: 6, curveSegments: 72 });

    const emblem = new THREE.Group();
    const ring = new THREE.Shape(); ring.absarc(0, 0, 1, 0, Math.PI * 2, false);
    const hole = new THREE.Path(); hole.absarc(0, 0, 0.8, 0, Math.PI * 2, true); ring.holes.push(hole);
    const ringMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(ring, bevel(0.3, 0.07)), steel);
    ringMesh.position.z = -0.15; emblem.add(ringMesh);

    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.1, 96), dark);
    disc.rotation.x = Math.PI / 2; disc.position.z = 0; emblem.add(disc);

    const bar = (cx, cy) => {
      const w = 0.6, h = 0.17, r = 0.04, s = new THREE.Shape();
      s.moveTo(-w / 2 + r, -h / 2); s.lineTo(w / 2 - r, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
      s.lineTo(w / 2, h / 2 - r); s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
      s.lineTo(-w / 2 + r, h / 2); s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
      s.lineTo(-w / 2, -h / 2 + r); s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
      const m = new THREE.Mesh(new THREE.ExtrudeGeometry(s, bevel(0.1, 0.03)), steel);
      m.position.set(cx, cy, 0.02); return m;
    };
    emblem.add(bar(-0.3, -0.34), bar(0, 0), bar(0.3, 0.34));
    emblem.scale.setScalar(1.05);
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
