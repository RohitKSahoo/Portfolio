import * as THREE from 'three';
import { SCENE } from '../config.js';

export function createLighting(renderer, scene) {
  // 1. Key Sunlight entering through the Left Wall window
  const sun = new THREE.DirectionalLight(0xfff3e0, 2.6);
  sun.position.set(-14.0, 11.0, -1.2);
  sun.target.position.set(0.0, 0.8, 0.0);
  sun.castShadow = true;
  scene.add(sun.target);

  const { hx, hz } = SCENE.slab;
  const d = Math.max(hx, hz) * 1.4;
  sun.shadow.camera.left = -d;
  sun.shadow.camera.right = d;
  sun.shadow.camera.top = d;
  sun.shadow.camera.bottom = -d;
  sun.shadow.camera.near = 4;
  sun.shadow.camera.far = 40;
  sun.shadow.mapSize.width = 2048;
  sun.shadow.mapSize.height = 2048;
  sun.shadow.bias = -0.0003;
  sun.shadow.camera.updateProjectionMatrix();
  scene.add(sun);

  // 2. Front-Right Soft Key / Rim Light (Elevated camera angle)
  const frontRim = new THREE.DirectionalLight(0xfffaed, 1.8);
  frontRim.position.set(12.0, 16.0, 12.0);
  frontRim.castShadow = true;
  frontRim.shadow.camera.left = -d;
  frontRim.shadow.camera.right = d;
  frontRim.shadow.camera.top = d;
  frontRim.shadow.camera.bottom = -d;
  frontRim.shadow.camera.near = 4;
  frontRim.shadow.camera.far = 45;
  frontRim.shadow.mapSize.width = 2048;
  frontRim.shadow.mapSize.height = 2048;
  frontRim.shadow.bias = -0.00025;
  frontRim.shadow.camera.updateProjectionMatrix();
  scene.add(frontRim);

  // 3. Ambient Hemisphere fill (Cool sky teal / warm wood bounce)
  const hemi = new THREE.HemisphereLight(0xccfbf1, 0x785338, 0.75);
  scene.add(hemi);

  // 4. Warm Desk Task Lamp (amber pool of task light on keyboard & mat)
  const deskLampLight = new THREE.PointLight(0xffdfa8, 1.5, 4.2);
  deskLampLight.position.set(-1.95, 1.68, -3.10);
  deskLampLight.castShadow = true;
  deskLampLight.shadow.bias = -0.0004;
  scene.add(deskLampLight);

  // 5. Warm Bedside Table Lamp (gentle amber glow over bed and nightstand)
  const bedsideLight = new THREE.PointLight(0xffdfa8, 1.4, 4.5);
  bedsideLight.position.set(2.0, 1.50, -2.20);
  bedsideLight.castShadow = true;
  bedsideLight.shadow.bias = -0.0004;
  scene.add(bedsideLight);

  // 6. Triple Monitor Cool Glow (Cyan/Blue bounce onto desk and chair)
  const monitorGlow = new THREE.PointLight(0x60a5fa, 0.95, 3.5);
  monitorGlow.position.set(-0.8, 1.75, -2.85);
  scene.add(monitorGlow);

  // 7. PC Tower RGB internal light
  const pcRgbGlow = new THREE.PointLight(0xa855f7, 0.65, 2.2);
  pcRgbGlow.position.set(0.4, 0.45, -2.80);
  scene.add(pcRgbGlow);

  return { sun, frontRim, hemi, deskLampLight, bedsideLight, monitorGlow, pcRgbGlow };
}
