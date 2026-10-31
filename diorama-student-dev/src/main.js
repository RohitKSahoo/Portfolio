import * as THREE from 'three';
import { SCENE, TL } from './config.js';
import { PixelPost } from './core/post.js';
import { createMaterials, timeUniform } from './core/materials.js';
import { createCamera, updateCamera } from './scene/camera.js';
import { createLighting } from './scene/lighting.js';
import { createRoom } from './scene/room.js';
import { createSystems } from './scene/systems.js';
import { createCatActor } from './scene/catActor.js';

const canvas = document.getElementById('stage');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;

const scene = new THREE.Scene();
scene.background = null;

const camera = createCamera();
const post = new PixelPost(renderer, 1600);

createLighting(renderer, scene);
const mats = createMaterials();

// Build Scene Entities (Architectural cutaway, workstation, rest area, sleeping cat)
const room = createRoom(mats);
scene.add(room.group);

const systems = createSystems(mats);
scene.add(systems.group);

const cat = createCatActor(mats);
scene.add(cat.root);

function draw(t) {
  timeUniform.value = t;
  room.update(t);
  systems.update(t);
  cat.update(t);
  post.render(scene, camera);
}

function resize() {
  const rect = canvas.getBoundingClientRect();
  const w = rect.width > 2 ? rect.width : window.innerWidth;
  const h = rect.height > 2 ? rect.height : window.innerHeight;
  updateCamera(camera, Math.max(0.3, w / h));
  post.setSize(w, h);
}

let frozen = null;
let origin = performance.now();

// Query param ?t= support
const params = new URLSearchParams(window.location.search);
if (params.has('t')) {
  frozen = parseFloat(params.get('t')) || 0;
}

function tick(now) {
  if (frozen == null) {
    const elapsed = (now - origin) / 1000;
    draw(elapsed % SCENE.loop);
  } else {
    draw(frozen);
  }
  requestAnimationFrame(tick);
}

resize();
window.addEventListener('resize', () => {
  resize();
  draw(frozen ?? 0);
});

draw(0);
resize();
requestAnimationFrame(tick);

// Debug & QA Hooks
window.__diorama = {
  THREE,
  scene,
  camera,
  renderer,
  post,
  freeze(t) {
    frozen = t;
    draw(t);
  },
  play() {
    origin = performance.now() - (frozen ?? 0) * 1000;
    frozen = null;
  },
  unfreeze() {
    this.play();
  },
  view(pos, tgt) {
    if (!pos) {
      resize();
      return;
    }
    camera.position.set(pos[0] ?? pos.x, pos[1] ?? pos.y, pos[2] ?? pos.z);
    if (tgt) camera.lookAt(tgt[0] ?? tgt.x, tgt[1] ?? tgt.y, tgt[2] ?? tgt.z);
    camera.updateProjectionMatrix();
    draw(frozen ?? 0);
  },
};
window.__dioramaReady = true;

// Interactive controls: Space toggles pause/play
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (frozen != null) {
      window.__diorama.play();
    } else {
      const elapsed = ((performance.now() - origin) / 1000) % SCENE.loop;
      window.__diorama.freeze(elapsed);
    }
  }
});
