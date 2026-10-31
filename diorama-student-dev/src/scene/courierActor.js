import * as THREE from 'three';
import { TL, clamp, lerp, smooth } from '../config.js';
import { chamferBoxGeometry, roundedBoxGeometry } from '../core/geometry.js';

export function createCourierActor(mats) {
  const root = new THREE.Group();
  root.visible = false;

  // Courier Body Group
  const body = new THREE.Group();
  root.add(body);

  // Pelvis / Jeans
  const pelvis = new THREE.Mesh(chamferBoxGeometry(0.38, 0.22, 0.32, { top: 0.02 }), mats.jeans);
  pelvis.position.y = 0.86;
  pelvis.castShadow = true;
  body.add(pelvis);

  // Legs with walking articulation
  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.12, 0.86, 0);
  body.add(leftLeg);
  const leftThigh = new THREE.Mesh(roundedBoxGeometry(0.14, 0.42, 0.14, 0.025), mats.jeans);
  leftThigh.position.y = -0.21;
  leftLeg.add(leftThigh);
  const leftShin = new THREE.Mesh(roundedBoxGeometry(0.12, 0.40, 0.12, 0.02), mats.jeans);
  leftShin.position.y = -0.61;
  leftLeg.add(leftShin);
  const leftShoe = new THREE.Mesh(chamferBoxGeometry(0.13, 0.10, 0.26, { top: 0.02 }), mats.sneakerWhite);
  leftShoe.position.set(0, -0.82, 0.06);
  leftLeg.add(leftShoe);

  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.12, 0.86, 0);
  body.add(rightLeg);
  const rightThigh = new THREE.Mesh(roundedBoxGeometry(0.14, 0.42, 0.14, 0.025), mats.jeans);
  rightThigh.position.y = -0.21;
  rightLeg.add(rightThigh);
  const rightShin = new THREE.Mesh(roundedBoxGeometry(0.12, 0.40, 0.12, 0.02), mats.jeans);
  rightShin.position.y = -0.61;
  rightLeg.add(rightShin);
  const rightShoe = new THREE.Mesh(chamferBoxGeometry(0.13, 0.10, 0.26, { top: 0.02 }), mats.sneakerWhite);
  rightShoe.position.set(0, -0.82, 0.06);
  rightLeg.add(rightShoe);

  // Torso / Delivery Jacket
  const torso = new THREE.Mesh(chamferBoxGeometry(0.46, 0.52, 0.32, { top: 0.03 }), mats.courierJacket);
  torso.position.y = 1.22;
  torso.castShadow = true;
  body.add(torso);

  // Head and Cap
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.54, 0);
  body.add(headGroup);

  const head = new THREE.Mesh(roundedBoxGeometry(0.24, 0.26, 0.24, 0.05), mats.skinHero);
  head.position.y = 0.13;
  head.castShadow = true;
  headGroup.add(head);

  // Red Cap with Visor
  const cap = new THREE.Mesh(chamferBoxGeometry(0.26, 0.10, 0.26, { top: 0.02 }), mats.courierCap);
  cap.position.set(0, 0.24, 0);
  headGroup.add(cap);
  const capVisor = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.02, 0.16), mats.courierCap);
  capVisor.position.set(0, 0.20, 0.18);
  headGroup.add(capVisor);

  // Arms carrying pizza box
  const armGroup = new THREE.Group();
  armGroup.position.set(0, 1.40, 0.12);
  body.add(armGroup);

  const leftArm = new THREE.Mesh(roundedBoxGeometry(0.12, 0.12, 0.34, 0.02), mats.courierJacket);
  leftArm.position.set(-0.24, -0.06, 0.12);
  armGroup.add(leftArm);

  const rightArm = new THREE.Mesh(roundedBoxGeometry(0.12, 0.12, 0.34, 0.02), mats.courierJacket);
  rightArm.position.set(0.24, -0.06, 0.12);
  armGroup.add(rightArm);

  // Carried Pizza Box (Visible in hands while walking in)
  const heldPizza = new THREE.Mesh(chamferBoxGeometry(0.68, 0.08, 0.68, { top: 0.01 }), mats.pizzaBox);
  heldPizza.position.set(0, -0.06, 0.36);
  heldPizza.castShadow = true;
  armGroup.add(heldPizza);

  // Contact Shadow underneath courier
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.42, 16), mats.contactShadow);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.015;
  root.add(shadow);

  // Update loop as pure function of t
  function update(t) {
    if (t < TL.courierEnter[0] || t > TL.courierExit[1]) {
      root.visible = false;
      return;
    }

    root.visible = true;

    const doorPos = { x: 6.0, z: 1.8 };
    const tablePos = { x: 3.8, z: 1.1 };

    // Stage 1: Walk in towards credenza
    if (t < TL.courierEnter[1]) {
      const u = clamp((t - TL.courierEnter[0]) / (TL.courierEnter[1] - TL.courierEnter[0]), 0, 1);
      const e = smooth(u);
      root.position.set(lerp(doorPos.x, tablePos.x, e), 0, lerp(doorPos.z, tablePos.z, e));
      root.rotation.y = -Math.PI * 0.65; // Walking left-forward

      // Walk cycle
      const walk = Math.sin(t * 12.0) * 0.35;
      leftLeg.rotation.x = walk;
      rightLeg.rotation.x = -walk;
      heldPizza.visible = true;
    }
    // Stage 2: Place pizza on table
    else if (t < TL.courierDrop[1]) {
      root.position.set(tablePos.x, 0, tablePos.z);
      root.rotation.y = -Math.PI * 0.5; // Facing table
      leftLeg.rotation.x = 0;
      rightLeg.rotation.x = 0;
      heldPizza.visible = false; // Delivered to table!
    }
    // Stage 3: Wave towards dev
    else if (t < TL.courierWave[1]) {
      root.position.set(tablePos.x, 0, tablePos.z);
      root.rotation.y = -Math.PI * 0.25; // Facing dev
      heldPizza.visible = false;

      // Friendly wave motion with right arm
      const wave = Math.sin(t * 14.0) * 0.25;
      rightArm.position.y = 0.12;
      rightArm.rotation.z = 0.45 + wave;
    }
    // Stage 4: Turn and walk back out through doorway
    else {
      const u = clamp((t - TL.courierWave[1]) / (TL.courierExit[1] - TL.courierWave[1]), 0, 1);
      const e = smooth(u);
      root.position.set(lerp(tablePos.x, doorPos.x, e), 0, lerp(tablePos.z, doorPos.z, e));
      root.rotation.y = Math.PI * 0.35; // Walking towards door

      // Walk cycle
      const walk = Math.sin(t * 12.0) * 0.35;
      leftLeg.rotation.x = walk;
      rightLeg.rotation.x = -walk;
      rightArm.position.y = -0.06;
      rightArm.rotation.z = 0;
      heldPizza.visible = false;
    }
  }

  return { root, update };
}
