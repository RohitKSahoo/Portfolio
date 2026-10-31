import * as THREE from 'three';
import { roundedBoxGeometry } from '../core/geometry.js';

export function createCatActor(mats) {
  const root = new THREE.Group();
  // Curled up asleep on top of the bed blanket
  root.position.set(3.6, 0.92, 0.7);
  root.rotation.y = -0.45; // Angled naturally across blanket

  const catBody = new THREE.Group();
  root.add(catBody);

  // Soft Contact Shadow on bed blanket
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.42, 16), mats.contactShadow);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.01;
  root.add(shadow);

  // 1. Curled Torso (Orange Tabby Body)
  const torso = new THREE.Mesh(roundedBoxGeometry(0.50, 0.28, 0.58, 0.10), mats.catOrange);
  torso.position.y = 0.14;
  torso.castShadow = true;
  catBody.add(torso);

  // White belly / chest patch
  const belly = new THREE.Mesh(roundedBoxGeometry(0.28, 0.18, 0.42, 0.06), mats.catWhite);
  belly.position.set(0.14, 0.12, 0.02);
  catBody.add(belly);

  // Tabby Stripe Accents on back
  for (let s = 0; s < 3; s++) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.025, 0.05), mats.catOrangeDark);
    stripe.position.set(-0.08, 0.28, -0.14 + s * 0.13);
    catBody.add(stripe);
  }

  // Tucked Paws (White front paws resting under chin)
  const pawL = new THREE.Mesh(roundedBoxGeometry(0.09, 0.07, 0.14, 0.02), mats.catWhite);
  pawL.position.set(0.18, 0.04, 0.26);
  catBody.add(pawL);

  const pawR = new THREE.Mesh(roundedBoxGeometry(0.09, 0.07, 0.14, 0.02), mats.catWhite);
  pawR.position.set(0.09, 0.04, 0.28);
  catBody.add(pawR);

  // 2. Sleeping Cat Head (resting comfortably curled near body)
  const headPivot = new THREE.Group();
  headPivot.position.set(0.16, 0.16, 0.28);
  catBody.add(headPivot);

  const head = new THREE.Mesh(roundedBoxGeometry(0.28, 0.24, 0.26, 0.08), mats.catOrange);
  head.castShadow = true;
  headPivot.add(head);

  // White muzzle patch
  const muzzle = new THREE.Mesh(roundedBoxGeometry(0.16, 0.12, 0.12, 0.04), mats.catWhite);
  muzzle.position.set(0.02, -0.04, 0.11);
  headPivot.add(muzzle);

  // Pink nose
  const nose = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.025, 0.025), mats.chairAccent);
  nose.position.set(0.02, -0.015, 0.16);
  headPivot.add(nose);

  // Closed Sleeping Eyes (curved thin dark lines)
  for (const ex of [-0.06, 0.09]) {
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.01, 0.01), mats.catEyes);
    eye.position.set(ex, 0.03, 0.14);
    eye.rotation.z = ex < 0 ? 0.12 : -0.12;
    headPivot.add(eye);
  }

  // Two Triangular Ears
  for (const ex of [-0.09, 0.09]) {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.10, 4), mats.catOrangeDark);
    ear.position.set(ex, 0.15, -0.01);
    ear.rotation.y = ex < 0 ? 0.3 : -0.3;
    headPivot.add(ear);

    // Inner ear pinkish/white
    const innerEar = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.07, 4), mats.catWhite);
    innerEar.position.set(ex * 0.95, 0.14, 0.01);
    headPivot.add(innerEar);
  }

  // 3. Curled Tabby Tail
  const tailPivot = new THREE.Group();
  tailPivot.position.set(-0.16, 0.06, -0.22);
  catBody.add(tailPivot);

  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.42, 8), mats.catOrange);
  tail.rotation.x = -Math.PI / 2.8;
  tail.rotation.y = 0.4;
  tail.position.set(0.08, 0.05, 0.12);
  tailPivot.add(tail);

  // White tail tip
  const tailTip = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), mats.catWhite);
  tailTip.position.set(0.14, 0.10, 0.30);
  tailPivot.add(tailTip);

  // Continuous ambient loop (Pure function of t)
  function update(t) {
    // 1. Gentle rhythmic breathing (chest rise and fall)
    const breath = Math.sin(t * 1.8) * 0.015;
    catBody.position.y = breath;
    catBody.scale.set(1.0 + breath * 0.6, 1.0 + breath * 1.2, 1.0 + breath * 0.6);

    // 2. Periodic subtle tail swish / flick
    const swish = Math.sin(t * 1.2) * 0.18 + Math.sin(t * 3.6) * 0.06;
    tailPivot.rotation.y = swish;
  }

  return { root, update };
}
