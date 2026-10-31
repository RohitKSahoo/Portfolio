import * as THREE from 'three';
import { SCENE } from '../config.js';

export const CAMERA = {
  fov: 19.5,
  azimuth: (45.0 * Math.PI) / 180,
  elevation: (34.0 * Math.PI) / 180,
  target: new THREE.Vector3(0, 1.25, 0),
  fillX: 0.82,
  fillY: 0.84,
  subjectScale: 1.15,
};

export const FIT_POINTS = [
  new THREE.Vector3(-SCENE.slab.hx - 0.2, 0.0, -SCENE.slab.hz - 0.2),
  new THREE.Vector3(SCENE.slab.hx + 0.2, 0.0, -SCENE.slab.hz - 0.2),
  new THREE.Vector3(SCENE.slab.hx + 0.2, 0.0, SCENE.slab.hz + 0.2),
  new THREE.Vector3(-SCENE.slab.hx - 0.2, 0.0, SCENE.slab.hz + 0.2),
  new THREE.Vector3(-SCENE.slab.hx - 0.2, -SCENE.slab.thick * 1.5, -SCENE.slab.hz - 0.2),
  new THREE.Vector3(SCENE.slab.hx + 0.2, -SCENE.slab.thick * 1.5, -SCENE.slab.hz - 0.2),
  new THREE.Vector3(SCENE.slab.hx + 0.2, -SCENE.slab.thick * 1.5, SCENE.slab.hz + 0.2),
  new THREE.Vector3(-SCENE.slab.hx - 0.2, -SCENE.slab.thick * 1.5, SCENE.slab.hz + 0.2),
  // Tallest architectural points (wall beams and bookshelf top)
  new THREE.Vector3(-SCENE.slab.hx, SCENE.walls.height + 0.2, -SCENE.slab.hz),
  new THREE.Vector3(0.0, SCENE.walls.height + 0.2, -SCENE.slab.hz),
  new THREE.Vector3(SCENE.slab.hx, SCENE.walls.height + 0.2, -SCENE.slab.hz),
  new THREE.Vector3(-SCENE.slab.hx, SCENE.walls.height + 0.2, SCENE.slab.hz),
  new THREE.Vector3(-SCENE.slab.hx + 0.65, 4.2, 2.6),
];

export function cameraDirection(out = new THREE.Vector3()) {
  const ce = Math.cos(CAMERA.elevation);
  return out.set(
    ce * Math.cos(CAMERA.azimuth),
    Math.sin(CAMERA.elevation),
    ce * Math.sin(CAMERA.azimuth)
  );
}

function fits(dir, right, up, aspect, distance, points) {
  const tanHalf = Math.tan((CAMERA.fov * Math.PI) / 360);
  const p = new THREE.Vector3();
  for (const fit of points) {
    p.subVectors(fit, CAMERA.target);
    const depth = distance - p.dot(dir);
    if (depth < 0.4) return false;
    const x = p.dot(right) / (depth * tanHalf * aspect);
    const y = p.dot(up) / (depth * tanHalf);
    if (Math.abs(x) > CAMERA.fillX) return false;
    if (Math.abs(y) > CAMERA.fillY) return false;
  }
  return true;
}

export function solveDistance(aspect, points = FIT_POINTS) {
  const a = Math.max(0.3, aspect);
  const dir = cameraDirection();
  const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), dir).normalize();
  const up = new THREE.Vector3().crossVectors(dir, right).normalize();

  let lo = 5;
  let hi = 300;
  for (let i = 0; i < 48; i++) {
    const mid = (lo + hi) * 0.5;
    if (fits(dir, right, up, a, mid, points)) hi = mid;
    else lo = mid;
  }
  return hi;
}

export function createCamera(aspect = 1.16, points = FIT_POINTS) {
  const camera = new THREE.PerspectiveCamera(CAMERA.fov, aspect, 0.5, 400);
  updateCamera(camera, aspect, points);
  return camera;
}

export function updateCamera(camera, aspect, points = FIT_POINTS) {
  const a = Math.max(0.3, aspect);
  const fit = solveDistance(a, points);
  const scale = CAMERA.subjectScale ?? 1;
  const d = fit / Math.max(0.1, scale);
  const dir = cameraDirection();
  camera.position.copy(CAMERA.target).addScaledVector(dir, d);
  camera.lookAt(CAMERA.target);
  camera.aspect = a;
  camera.near = Math.max(0.3, d * 0.01);
  camera.far = d * 4 + 80;
  camera.updateProjectionMatrix();
  camera.userData.fitDistance = fit;
  camera.userData.subjectScale = scale;
  camera.userData.distance = d;
}
