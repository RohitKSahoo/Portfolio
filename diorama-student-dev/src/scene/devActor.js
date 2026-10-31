import * as THREE from 'three';
import { TL, clamp, lerp, smooth } from '../config.js';
import { chamferBoxGeometry, roundedBoxGeometry } from '../core/geometry.js';

export function createDevActor(mats) {
  const root = new THREE.Group();
  root.position.set(0, 0, -1.0); // Sitting position in front of desk

  // 1. Ergonomic Office Chair Base
  const chairGroup = new THREE.Group();
  root.add(chairGroup);

  // 5-star wheeled base
  const starBase = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 0.08, 10), mats.metalDark);
  starBase.position.y = 0.06;
  starBase.castShadow = true;
  chairGroup.add(starBase);

  // Hydraulic Center Cylinder
  const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.48, 12), mats.metalDark);
  cylinder.position.y = 0.32;
  cylinder.castShadow = true;
  chairGroup.add(cylinder);

  // Swivel Upper Seat Assembly
  const seatSwivel = new THREE.Group();
  seatSwivel.position.y = 0.58;
  chairGroup.add(seatSwivel);

  // Ergonomic Mesh Cushion Seat
  const seatMesh = new THREE.Mesh(roundedBoxGeometry(0.68, 0.09, 0.65, 0.03), mats.chairMesh);
  seatMesh.castShadow = true;
  seatMesh.receiveShadow = true;
  seatSwivel.add(seatMesh);

  // Mesh Backrest
  const backPivot = new THREE.Group();
  backPivot.position.set(0, 0.05, -0.30);
  seatSwivel.add(backPivot);

  const backRest = new THREE.Mesh(roundedBoxGeometry(0.62, 0.78, 0.08, 0.03), mats.chairMesh);
  backRest.position.set(0, 0.42, 0);
  backRest.castShadow = true;
  backPivot.add(backRest);

  // Left & Right Armrests
  for (const ax of [-0.34, 0.34]) {
    const armSupport = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.28, 0.06), mats.metalDark);
    armSupport.position.set(ax, 0.16, -0.05);
    seatSwivel.add(armSupport);

    const armPad = new THREE.Mesh(roundedBoxGeometry(0.09, 0.04, 0.32, 0.015), mats.chairMesh);
    armPad.position.set(ax, 0.30, -0.02);
    seatSwivel.add(armPad);
  }

  // 2. Developer Character Rig
  const devGroup = new THREE.Group();
  devGroup.position.set(0, 0.08, 0.02);
  seatSwivel.add(devGroup);

  // Pelvis in jeans
  const pelvis = new THREE.Mesh(chamferBoxGeometry(0.44, 0.22, 0.38, { top: 0.02 }), mats.jeans);
  pelvis.position.y = 0.12;
  pelvis.castShadow = true;
  devGroup.add(pelvis);

  // Legs seated forward
  for (const lx of [-0.14, 0.14]) {
    // Thigh extending towards desk
    const thigh = new THREE.Mesh(roundedBoxGeometry(0.16, 0.16, 0.48, 0.03), mats.jeans);
    thigh.position.set(lx, 0.10, 0.26);
    thigh.castShadow = true;
    devGroup.add(thigh);

    // Shin dropping down to floor
    const shin = new THREE.Mesh(roundedBoxGeometry(0.14, 0.48, 0.14, 0.03), mats.jeans);
    shin.position.set(lx, -0.16, 0.46);
    shin.castShadow = true;
    devGroup.add(shin);

    // Sneaker
    const sneaker = new THREE.Mesh(chamferBoxGeometry(0.15, 0.12, 0.28, { top: 0.02 }), mats.sneakerWhite);
    sneaker.position.set(lx, -0.42, 0.48);
    sneaker.castShadow = true;
    devGroup.add(sneaker);

    // Sneaker Red Heel Detail
    const heel = new THREE.Mesh(new THREE.BoxGeometry(0.152, 0.06, 0.08), mats.sneakerRed);
    heel.position.set(lx, -0.42, 0.38);
    devGroup.add(heel);
  }

  // Torso / Oversized Hoodie
  const torsoPivot = new THREE.Group();
  torsoPivot.position.set(0, 0.22, 0);
  devGroup.add(torsoPivot);

  const hoodieBody = new THREE.Mesh(chamferBoxGeometry(0.52, 0.58, 0.38, { top: 0.04 }), mats.hoodie);
  hoodieBody.position.set(0, 0.28, 0);
  hoodieBody.castShadow = true;
  torsoPivot.add(hoodieBody);

  // Head and Studio Headphones
  const headPivot = new THREE.Group();
  headPivot.position.set(0, 0.62, 0.02);
  torsoPivot.add(headPivot);

  const headMesh = new THREE.Mesh(roundedBoxGeometry(0.28, 0.32, 0.28, 0.06), mats.skinHero);
  headMesh.position.set(0, 0.16, 0);
  headMesh.castShadow = true;
  headPivot.add(headMesh);

  // Stylized Dark Hair
  const hair = new THREE.Mesh(chamferBoxGeometry(0.30, 0.16, 0.30, { top: 0.03 }), mats.hairDark);
  hair.position.set(0, 0.30, -0.01);
  hair.castShadow = true;
  headPivot.add(hair);

  // Over-Ear Studio Headphones
  const hpBand = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.025, 8, 16, Math.PI), mats.headphones);
  hpBand.rotation.z = Math.PI;
  hpBand.position.set(0, 0.26, 0);
  headPivot.add(hpBand);

  for (const e of [-0.16, 0.16]) {
    const earCup = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.05, 12), mats.headphones);
    earCup.rotation.z = Math.PI / 2;
    earCup.position.set(e, 0.16, 0);
    headPivot.add(earCup);
  }

  // Left & Right Arms and Hands
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.30, 0.48, 0.04);
  torsoPivot.add(leftArm);
  const leftUpper = new THREE.Mesh(roundedBoxGeometry(0.14, 0.34, 0.14, 0.03), mats.hoodie);
  leftUpper.position.set(-0.02, -0.14, 0.08);
  leftArm.add(leftUpper);
  const leftFore = new THREE.Mesh(roundedBoxGeometry(0.12, 0.12, 0.36, 0.025), mats.hoodie);
  leftFore.position.set(-0.02, -0.26, 0.24);
  leftArm.add(leftFore);
  const leftHand = new THREE.Mesh(roundedBoxGeometry(0.10, 0.06, 0.12, 0.02), mats.skinHero);
  leftHand.position.set(-0.02, -0.26, 0.44);
  leftArm.add(leftHand);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.30, 0.48, 0.04);
  torsoPivot.add(rightArm);
  const rightUpper = new THREE.Mesh(roundedBoxGeometry(0.14, 0.34, 0.14, 0.03), mats.hoodie);
  rightUpper.position.set(0.02, -0.14, 0.08);
  rightArm.add(rightUpper);
  const rightFore = new THREE.Mesh(roundedBoxGeometry(0.12, 0.12, 0.36, 0.025), mats.hoodie);
  rightFore.position.set(0.02, -0.26, 0.24);
  rightArm.add(rightFore);
  const rightHand = new THREE.Mesh(roundedBoxGeometry(0.10, 0.06, 0.12, 0.02), mats.skinHero);
  rightHand.position.set(0.02, -0.26, 0.44);
  rightArm.add(rightHand);

  // Soft Contact Shadow under chair
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.65, 24), mats.contactShadow);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.015, 0);
  root.add(shadow);

  // Return update function driven purely by time t
  function update(t) {
    // 1. Chair swivel: dev looks between Gemini (left), Claude (center), ChatGPT (right)
    let chairYaw = 0;
    let headYaw = 0;
    let headPitch = 0;

    if (t < TL.genStart) {
      // Boot / prompting: focus on center terminal
      chairYaw = Math.sin(t * 1.5) * 0.08;
      headYaw = 0;
    } else if (t >= TL.genStart && t < TL.doorOpen[0]) {
      // Parallel AI synthesis: dev glances left (Gemini) then right (ChatGPT)
      const phase = Math.sin((t - TL.genStart) * 1.2);
      chairYaw = phase * 0.28; // Swivels ±16 degrees
      headYaw = phase * 0.35;
    } else if (t >= TL.doorOpen[0] && t < TL.doorClose[1]) {
      // Disruption beat: head turns towards right door to acknowledge courier!
      chairYaw = 0.22;
      headYaw = 0.65; // Looks toward door/credenza
    } else if (t >= TL.buildProgress[0] && t < TL.buildGreen) {
      // Watching the build progress bar
      chairYaw = 0;
      headYaw = 0;
      headPitch = 0.12;
    } else if (t >= TL.victoryStretch[0] && t < TL.victoryStretch[1]) {
      // Beat 4: VICTORY ERGONOMIC CHAIR LEAN & ARM STRETCH
      const u = clamp((t - TL.victoryStretch[0]) / (TL.victoryStretch[1] - TL.victoryStretch[0]), 0, 1);
      const stretch = Math.sin(u * Math.PI);

      chairYaw = 0;
      headPitch = -0.45 * stretch; // Head leans back
      torsoPivot.rotation.x = -0.28 * stretch; // Chair reclines
      backPivot.rotation.x = -0.22 * stretch;

      // Arms raise up in celebratory victory stretch!
      leftArm.rotation.x = -Math.PI * 0.85 * stretch;
      leftArm.rotation.z = -0.35 * stretch;
      rightArm.rotation.x = -Math.PI * 0.85 * stretch;
      rightArm.rotation.z = 0.35 * stretch;
      return;
    } else {
      // Calm idle sipping coffee
      chairYaw = Math.sin(t * 0.8) * 0.06;
      headYaw = 0;
    }

    // Default typing clatter motion
    seatSwivel.rotation.y = chairYaw;
    headPivot.rotation.y = headYaw;
    headPivot.rotation.x = headPitch;
    torsoPivot.rotation.x = 0.04;
    backPivot.rotation.x = 0;

    // Subtle rapid mechanical typing jitter on arms
    const clatterL = Math.sin(t * 24.0) * 0.02;
    const clatterR = Math.cos(t * 26.0) * 0.02;
    leftArm.rotation.x = clatterL;
    leftArm.rotation.z = 0;
    rightArm.rotation.x = clatterR;
    rightArm.rotation.z = 0;
  }

  return { root, update };
}
