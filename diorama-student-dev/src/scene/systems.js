import * as THREE from 'three';
import { SCENE } from '../config.js';
import { chamferBoxGeometry, roundedBoxGeometry } from '../core/geometry.js';

export function createSystems(mats) {
  const group = new THREE.Group();

  // =========================================================================
  // 1. FLOOR RUG (Medium-sized rectangular slate rug under desk & chair)
  // =========================================================================
  const rugW = 5.2;
  const rugD = 4.4;
  const rug = new THREE.Mesh(
    chamferBoxGeometry(rugW, 0.025, rugD, { top: 0.008 }),
    mats.rugSlate
  );
  rug.position.set(-1.0, 0.015, -1.2);
  rug.receiveShadow = true;
  group.add(rug);

  // Subtle woven border on rug
  const rugBorder = new THREE.Mesh(
    chamferBoxGeometry(rugW - 0.24, 0.026, rugD - 0.24, { top: 0.005 }),
    mats.rugBorder
  );
  rugBorder.position.set(-1.0, 0.016, -1.2);
  rugBorder.receiveShadow = true;
  group.add(rugBorder);

  const rugInner = new THREE.Mesh(
    chamferBoxGeometry(rugW - 0.5, 0.027, rugD - 0.5, { top: 0.005 }),
    mats.rugSlate
  );
  rugInner.position.set(-1.0, 0.017, -1.2);
  rugInner.receiveShadow = true;
  group.add(rugInner);

  // =========================================================================
  // 2. L-SHAPED WOODEN WORKSTATION DESK (In Rear Corner)
  // =========================================================================
  const deskGroup = new THREE.Group();
  group.add(deskGroup);

  const deskH = 1.15;
  const deskTopThick = 0.08;

  // Main Desktop Section (Horizontal along back wall)
  // Dimensions: 4.4m wide x 1.6m deep
  const mainDeskTop = new THREE.Mesh(
    chamferBoxGeometry(4.4, deskTopThick, 1.6, { top: 0.02, bottom: 0.01 }),
    mats.deskTop
  );
  mainDeskTop.position.set(-0.8, deskH - deskTopThick / 2, -3.2);
  mainDeskTop.castShadow = true;
  mainDeskTop.receiveShadow = true;
  deskGroup.add(mainDeskTop);

  // Return Extension Desktop Section (Along left wall)
  // Dimensions: 1.4m wide x 2.2m deep
  const returnDeskTop = new THREE.Mesh(
    chamferBoxGeometry(1.4, deskTopThick, 2.2, { top: 0.02, bottom: 0.01 }),
    mats.deskTop
  );
  returnDeskTop.position.set(-3.7, deskH - deskTopThick / 2, -1.3);
  returnDeskTop.castShadow = true;
  returnDeskTop.receiveShadow = true;
  deskGroup.add(returnDeskTop);

  // Sturdy Metal Legs with open leg space
  const legPositions = [
    { x: 1.2, z: -3.8 },   // Main desk right rear
    { x: 1.2, z: -2.6 },   // Main desk right front
    { x: -2.8, z: -3.8 },  // Corner inner leg
    { x: -4.2, z: -3.8 },  // Left rear leg
    { x: -4.2, z: -0.4 },  // Return left front leg
    { x: -3.2, z: -0.4 },  // Return inner front leg
  ];

  for (const lp of legPositions) {
    const leg = new THREE.Mesh(
      chamferBoxGeometry(0.10, deskH - deskTopThick, 0.10, { top: 0.01, bottom: 0.01 }),
      mats.deskLegMetal
    );
    leg.position.set(lp.x, (deskH - deskTopThick) / 2, lp.z);
    leg.castShadow = true;
    deskGroup.add(leg);

    // Foot pad
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.03, 0.14), mats.metalDark);
    foot.position.set(lp.x, 0.015, lp.z);
    deskGroup.add(foot);
  }

  // Cable Spine / Channel hanging under desk
  const cableSpine = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.85, 8), mats.chassisBlack);
  cableSpine.position.set(-0.2, 0.65, -3.7);
  deskGroup.add(cableSpine);

  // Hanging cables dropping from desk
  const dropCable1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.7, 6), mats.metalDark);
  dropCable1.position.set(0.6, 0.6, -3.6);
  dropCable1.rotation.z = 0.12;
  deskGroup.add(dropCable1);

  // Large Dark Desk Mat / Mousepad
  const deskMat = new THREE.Mesh(
    chamferBoxGeometry(2.4, 0.012, 0.95, { top: 0.004 }),
    mats.deskMat
  );
  deskMat.position.set(-0.8, deskH + 0.006, -2.9);
  deskMat.receiveShadow = true;
  deskGroup.add(deskMat);

  // =========================================================================
  // 3. TRIPLE-MONITOR SETUP IN SHALLOW ARC
  // =========================================================================
  const monW = 0.98;
  const monH = 0.60;
  const monD = 0.04;
  const monY = deskH + 0.58;

  // Heavy Duty Monitor Arm Mount Rig
  const armBase = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.06, 0.22), mats.metalDark);
  armBase.position.set(-0.8, deskH + 0.03, -3.7);
  deskGroup.add(armBase);

  const armPole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.65, 12), mats.metalDark);
  armPole.position.set(-0.8, deskH + 0.35, -3.7);
  armPole.castShadow = true;
  deskGroup.add(armPole);

  const crossBar = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.04, 0.06), mats.metalDark);
  crossBar.position.set(-0.8, monY, -3.6);
  deskGroup.add(crossBar);

  // --- CENTER MONITOR: CLAUDE AI & Active Terminal Workspace ---
  const centerMon = new THREE.Group();
  centerMon.position.set(-0.8, monY, -3.45);
  deskGroup.add(centerMon);

  const centerBezel = new THREE.Mesh(
    chamferBoxGeometry(monW, monH, monD, { top: 0.01 }),
    mats.chassisBlack
  );
  centerBezel.castShadow = true;
  centerMon.add(centerBezel);

  const centerScreen = new THREE.Mesh(new THREE.PlaneGeometry(monW - 0.04, monH - 0.04), mats.terminalScreen);
  centerScreen.position.set(0, 0, monD / 2 + 0.001);
  centerMon.add(centerScreen);

  // Claude Coral Signature Top Bar
  const claudeBar = new THREE.Mesh(new THREE.PlaneGeometry(monW - 0.04, 0.055), mats.claudeScreen);
  claudeBar.position.set(0, (monH - 0.04) / 2 - 0.028, monD / 2 + 0.002);
  centerMon.add(claudeBar);

  // Terminal Code Lines
  const centerCodeLines = [];
  for (let l = 0; l < 8; l++) {
    const isSpecial = (l === 4 || l === 7);
    const lineMesh = new THREE.Mesh(
      new THREE.PlaneGeometry((monW - 0.18) * (0.35 + (l % 4) * 0.18), 0.022),
      isSpecial ? mats.codeTextGreen : mats.codeTextOrange
    );
    lineMesh.position.set(-0.16, (monH - 0.04) / 2 - 0.10 - l * 0.046, monD / 2 + 0.002);
    centerMon.add(lineMesh);
    centerCodeLines.push(lineMesh);
  }

  // Active Terminal blinking cursor
  const cursor = new THREE.Mesh(new THREE.PlaneGeometry(0.025, 0.024), mats.codeTextYellow);
  cursor.position.set(0.12, (monH - 0.04) / 2 - 0.10 - 7 * 0.046, monD / 2 + 0.003);
  centerMon.add(cursor);

  // Terminal Status Meter (Test Green Pass)
  const compileMeter = new THREE.Mesh(new THREE.PlaneGeometry(monW - 0.12, 0.035), mats.codeTextGreen);
  compileMeter.position.set(0, -(monH - 0.04) / 2 + 0.04, monD / 2 + 0.002);
  centerMon.add(compileMeter);

  // --- LEFT MONITOR: GEMINI AI & Code Architecture ---
  const leftMon = new THREE.Group();
  leftMon.position.set(-0.8 - monW * 0.94, monY, -3.32);
  leftMon.rotation.y = 0.38; // Angled inward
  deskGroup.add(leftMon);

  const leftBezel = new THREE.Mesh(
    chamferBoxGeometry(monW, monH, monD, { top: 0.01 }),
    mats.chassisBlack
  );
  leftBezel.castShadow = true;
  leftMon.add(leftBezel);

  const leftScreen = new THREE.Mesh(new THREE.PlaneGeometry(monW - 0.04, monH - 0.04), mats.terminalScreen);
  leftScreen.position.set(0, 0, monD / 2 + 0.001);
  leftMon.add(leftScreen);

  // Gemini Sparkle Blue Accent Header
  const geminiBar = new THREE.Mesh(new THREE.PlaneGeometry(monW - 0.04, 0.055), mats.geminiScreen);
  geminiBar.position.set(0, (monH - 0.04) / 2 - 0.028, monD / 2 + 0.002);
  leftMon.add(geminiBar);

  // Sidebar file tree & syntax lines
  const leftFileTree = new THREE.Mesh(new THREE.PlaneGeometry(0.18, monH - 0.12), mats.chassisBlack);
  leftFileTree.position.set(-(monW - 0.04) / 2 + 0.10, -0.02, monD / 2 + 0.002);
  leftMon.add(leftFileTree);

  for (let n = 0; n < 8; n++) {
    const code = new THREE.Mesh(
      new THREE.PlaneGeometry(0.55 * (0.4 + (n % 3) * 0.25), 0.02),
      n % 2 === 0 ? mats.codeTextCyan : mats.codeTextWhite
    );
    code.position.set(0.08, (monH - 0.04) / 2 - 0.10 - n * 0.048, monD / 2 + 0.002);
    leftMon.add(code);
  }

  // --- RIGHT MONITOR: CHATGPT AI & Browser Preview / Logs ---
  const rightMon = new THREE.Group();
  rightMon.position.set(-0.8 + monW * 0.94, monY, -3.32);
  rightMon.rotation.y = -0.38; // Angled inward
  deskGroup.add(rightMon);

  const rightBezel = new THREE.Mesh(
    chamferBoxGeometry(monW, monH, monD, { top: 0.01 }),
    mats.chassisBlack
  );
  rightBezel.castShadow = true;
  rightMon.add(rightBezel);

  const rightScreen = new THREE.Mesh(new THREE.PlaneGeometry(monW - 0.04, monH - 0.04), mats.terminalScreen);
  rightScreen.position.set(0, 0, monD / 2 + 0.001);
  rightMon.add(rightScreen);

  // ChatGPT Mint Emerald Accent Header
  const chatgptBar = new THREE.Mesh(new THREE.PlaneGeometry(monW - 0.04, 0.055), mats.chatgptScreen);
  chatgptBar.position.set(0, (monH - 0.04) / 2 - 0.028, monD / 2 + 0.002);
  rightMon.add(chatgptBar);

  // Browser Preview / Log lines
  for (let c = 0; c < 7; c++) {
    const checkMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.04, 0.04), mats.codeTextGreen);
    checkMesh.position.set(-0.35, (monH - 0.04) / 2 - 0.11 - c * 0.052, monD / 2 + 0.002);
    rightMon.add(checkMesh);

    const logLine = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.022), mats.codeTextWhite);
    logLine.position.set(-0.06, (monH - 0.04) / 2 - 0.11 - c * 0.052, monD / 2 + 0.002);
    rightMon.add(logLine);
  }

  // --- DUAL DESKTOP SPEAKERS ---
  for (const s of [-1.9, 0.3]) {
    const spk = new THREE.Mesh(
      chamferBoxGeometry(0.18, 0.32, 0.20, { top: 0.01 }),
      mats.chassisBlack
    );
    spk.position.set(s, deskH + 0.16, -3.4);
    spk.castShadow = true;
    deskGroup.add(spk);

    // Speaker driver cone
    const cone = new THREE.Mesh(new THREE.CircleGeometry(0.055, 16), mats.metalDark);
    cone.position.set(s, deskH + 0.18, -3.3);
    cone.rotation.y = s < -0.8 ? 0.3 : -0.3;
    deskGroup.add(cone);
  }

  // =========================================================================
  // 4. DESK ACCESSORIES & DEVELOPER TOOLS
  // =========================================================================
  // Mechanical Keyboard
  const kbBase = new THREE.Mesh(
    roundedBoxGeometry(0.74, 0.035, 0.28, 0.01),
    mats.chassisBlack
  );
  kbBase.position.set(-0.95, deskH + 0.022, -2.85);
  kbBase.castShadow = true;
  deskGroup.add(kbBase);

  // Keycaps grid impression
  const keyDeck = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.015, 0.22), mats.metalDark);
  keyDeck.position.set(-0.95, deskH + 0.04, -2.85);
  deskGroup.add(keyDeck);

  // Bright Red Esc keycap
  const escKey = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.04), mats.sneakerRed);
  escKey.position.set(-1.25, deskH + 0.048, -2.93);
  deskGroup.add(escKey);

  // Ergonomic Mouse
  const mouse = new THREE.Mesh(roundedBoxGeometry(0.10, 0.04, 0.16, 0.02), mats.metalDark);
  mouse.position.set(-0.25, deskH + 0.025, -2.8);
  mouse.castShadow = true;
  deskGroup.add(mouse);

  // Yellow Rubber Duck Debugger near monitor stand
  const duckGroup = new THREE.Group();
  duckGroup.position.set(0.12, deskH + 0.04, -3.4);
  deskGroup.add(duckGroup);

  const duckBody = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 10), mats.rubberDuck);
  duckBody.position.y = 0.04;
  duckBody.castShadow = true;
  duckGroup.add(duckBody);

  const duckHead = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), mats.rubberDuck);
  duckHead.position.set(0, 0.08, 0.02);
  duckGroup.add(duckHead);

  const duckBeak = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.025, 6), mats.rubberDuckBeak);
  duckBeak.rotation.x = Math.PI / 2;
  duckBeak.position.set(0, 0.08, 0.05);
  duckGroup.add(duckBeak);

  // Compact Adjustable Desk Task Lamp (warm pool of light)
  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.12, 0.03, 14), mats.lampBrass);
  lampBase.position.set(-2.4, deskH + 0.015, -3.4);
  lampBase.castShadow = true;
  deskGroup.add(lampBase);

  const lampArm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.45, 8), mats.lampBrass);
  lampArm1.position.set(-2.35, deskH + 0.22, -3.35);
  lampArm1.rotation.z = -0.35;
  lampArm1.castShadow = true;
  deskGroup.add(lampArm1);

  const lampArm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.40, 8), mats.lampBrass);
  lampArm2.position.set(-2.15, deskH + 0.50, -3.2);
  lampArm2.rotation.z = 0.45;
  lampArm2.castShadow = true;
  deskGroup.add(lampArm2);

  const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.10, 0.16, 12), mats.lampBrass);
  lampShade.rotation.z = Math.PI * 0.75;
  lampShade.position.set(-1.95, deskH + 0.56, -3.1);
  lampShade.castShadow = true;
  deskGroup.add(lampShade);

  const lampBulb = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), mats.lampGlow);
  lampBulb.position.set(-1.92, deskH + 0.53, -3.08);
  deskGroup.add(lampBulb);

  // Ceramic Coffee Mug
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.11, 12), mats.coffeeMug);
  mug.position.set(-1.6, deskH + 0.055, -2.6);
  mug.castShadow = true;
  deskGroup.add(mug);

  const coffeeLiquid = new THREE.Mesh(new THREE.CircleGeometry(0.045, 12), mats.coffeeLiquid);
  coffeeLiquid.rotation.x = -Math.PI / 2;
  coffeeLiquid.position.set(-1.6, deskH + 0.10, -2.6);
  deskGroup.add(coffeeLiquid);

  // Thermal Water Bottle
  const flask = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.24, 12), mats.metalDark);
  flask.position.set(-1.8, deskH + 0.12, -2.75);
  flask.castShadow = true;
  deskGroup.add(flask);

  // Smartphone resting on desk
  const phone = new THREE.Mesh(roundedBoxGeometry(0.08, 0.012, 0.16, 0.008), mats.chassisBlack);
  phone.position.set(-1.4, deskH + 0.006, -2.8);
  deskGroup.add(phone);

  const phoneScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.14), mats.geminiBright);
  phoneScreen.rotation.x = -Math.PI / 2;
  phoneScreen.position.set(-1.4, deskH + 0.013, -2.8);
  deskGroup.add(phoneScreen);

  // Open Notebook with Pen (on return desk surface)
  const notebook = new THREE.Mesh(chamferBoxGeometry(0.42, 0.02, 0.32, { top: 0.005 }), mats.bookPages);
  notebook.position.set(-3.6, deskH + 0.01, -1.6);
  notebook.rotation.y = 0.15;
  notebook.castShadow = true;
  deskGroup.add(notebook);

  const pen = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.18, 6), mats.metalDark);
  pen.rotation.z = Math.PI / 2;
  pen.rotation.y = 0.2;
  pen.position.set(-3.5, deskH + 0.025, -1.6);
  deskGroup.add(pen);

  // Headphone Stand with Studio Headphones (on return desk)
  const hpBase = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.02, 12), mats.metalDark);
  hpBase.position.set(-3.8, deskH + 0.01, -2.6);
  deskGroup.add(hpBase);

  const hpPole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.32, 8), mats.metalDark);
  hpPole.position.set(-3.8, deskH + 0.17, -2.6);
  deskGroup.add(hpPole);

  const hpHeadband = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.018, 8, 16, Math.PI), mats.chassisBlack);
  hpHeadband.rotation.x = Math.PI;
  hpHeadband.position.set(-3.8, deskH + 0.30, -2.6);
  deskGroup.add(hpHeadband);

  // USB Hub with coiled cables on desk
  const usbHub = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.06), mats.metalDark);
  usbHub.position.set(0.65, deskH + 0.01, -3.2);
  deskGroup.add(usbHub);

  // Loose sticky notes on desk
  const deskSticky1 = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.12), mats.codeTextYellow);
  deskSticky1.rotation.x = -Math.PI / 2;
  deskSticky1.position.set(-0.35, deskH + 0.002, -2.2);
  deskGroup.add(deskSticky1);

  // =========================================================================
  // 5. DESKTOP PC TOWER WITH ILLUMINATED RGB FANS (Under Right Side of Desk)
  // =========================================================================
  const pcGroup = new THREE.Group();
  // Under right side of desk, angled towards camera for maximum visibility
  pcGroup.position.set(0.65, 0.0, -2.65);
  pcGroup.rotation.y = -0.28;
  group.add(pcGroup);

  const pcW = 0.46;
  const pcH = 0.84;
  const pcD = 0.88;

  // Outer Dark Charcoal Chassis Frame
  const pcCase = new THREE.Mesh(
    chamferBoxGeometry(pcW, pcH, pcD, { top: 0.02, bottom: 0.01 }),
    mats.pcChassis
  );
  pcCase.position.set(0, pcH / 2 + 0.02, 0);
  pcCase.castShadow = true;
  pcGroup.add(pcCase);

  // Transparent Glass / Acrylic Side Panel facing outward (+X / +Z)
  const pcGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(pcD - 0.06, pcH - 0.06),
    mats.pcGlass
  );
  pcGlass.rotation.y = Math.PI / 2;
  pcGlass.position.set(pcW / 2 + 0.003, pcH / 2 + 0.02, 0);
  pcGroup.add(pcGlass);

  // Internal Hardware Silhouette: GPU Card with illuminated blue accent strip
  const gpuCard = new THREE.Mesh(
    chamferBoxGeometry(0.18, 0.15, 0.58, { top: 0.01 }),
    mats.pcGpu
  );
  gpuCard.position.set(0.04, 0.40, 0.04);
  pcGroup.add(gpuCard);

  const gpuLed = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.02, 0.50), mats.geminiBright);
  gpuLed.position.set(0.13, 0.44, 0.04);
  pcGroup.add(gpuLed);

  // Motherboard CPU Cooler block
  const cpuCooler = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.18), mats.metalDark);
  cpuCooler.position.set(-0.06, 0.62, -0.06);
  pcGroup.add(cpuCooler);

  // Three Front Illuminated RGB Cooling Fans (Violet, Cyan, Blue)
  const pcFans = [];
  const fanColors = [mats.pcFanRGB1, mats.pcFanRGB2, mats.pcFanRGB3];
  for (let f = 0; f < 3; f++) {
    const fanRing = new THREE.Group();
    fanRing.position.set(0.08, 0.24 + f * 0.24, pcD / 2 - 0.06);
    pcGroup.add(fanRing);

    // Glowing RGB Outer Ring
    const ringMesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.09, 0.015, 8, 16),
      fanColors[f]
    );
    fanRing.add(ringMesh);

    // Rotating 4-blade fan impeller
    const blades = new THREE.Group();
    fanRing.add(blades);

    for (let b = 0; b < 4; b++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.02, 0.008), mats.chassisBlack);
      blade.position.x = 0.038;
      blade.rotation.z = (b * Math.PI) / 2;
      blades.add(blade);
    }

    pcFans.push({ ring: fanRing, blades });
  }

  // Small Power Strip on floor near rear desk leg
  const powerStrip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.45), mats.chassisBlack);
  powerStrip.position.set(1.2, 0.02, -3.7);
  group.add(powerStrip);

  // Power strip red illuminated switch
  const stripSwitch = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.015, 0.04), mats.ledRed);
  stripSwitch.position.set(1.2, 0.045, -3.85);
  group.add(stripSwitch);

  // =========================================================================
  // 6. ERGONOMIC SWIVEL CHAIR (Angled toward center monitor)
  // =========================================================================
  const chairGroup = new THREE.Group();
  chairGroup.position.set(-0.8, 0.0, -1.5);
  chairGroup.rotation.y = -0.22; // Angled slightly toward center monitor
  group.add(chairGroup);

  // 5-Star Caster Wheel Base
  const baseCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 12), mats.chairFrame);
  baseCenter.position.y = 0.12;
  chairGroup.add(baseCenter);

  for (let c = 0; c < 5; c++) {
    const angle = (c * Math.PI * 2) / 5;
    const legArm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.38), mats.chairFrame);
    legArm.position.set(Math.sin(angle) * 0.20, 0.10, Math.cos(angle) * 0.20);
    legArm.rotation.y = angle;
    chairGroup.add(legArm);

    // Caster wheel
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 8), mats.chairFrame);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(Math.sin(angle) * 0.38, 0.04, Math.cos(angle) * 0.38);
    chairGroup.add(wheel);
  }

  // Central Hydraulic Column
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.42, 10), mats.chairFrame);
  column.position.y = 0.33;
  chairGroup.add(column);

  // Chair Seat Base
  const seatBase = new THREE.Mesh(
    roundedBoxGeometry(0.68, 0.08, 0.64, 0.03),
    mats.chairAccent
  );
  seatBase.position.set(0, 0.58, -0.05);
  seatBase.castShadow = true;
  chairGroup.add(seatBase);

  // Lumbar Support Bar
  const lumbar = new THREE.Mesh(roundedBoxGeometry(0.48, 0.12, 0.08, 0.02), mats.chairAccent);
  lumbar.position.set(0, 0.85, -0.32);
  chairGroup.add(lumbar);

  // High Ergonomic Mesh Backrest
  const backrestFrame = new THREE.Mesh(
    chamferBoxGeometry(0.62, 0.82, 0.06, { top: 0.03 }),
    mats.chairFrame
  );
  backrestFrame.position.set(0, 1.05, -0.35);
  backrestFrame.rotation.x = -0.12;
  backrestFrame.castShadow = true;
  chairGroup.add(backrestFrame);

  const backrestMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.54, 0.72),
    mats.chairMesh
  );
  backrestMesh.position.set(0, 1.05, -0.31);
  backrestMesh.rotation.x = -0.12;
  chairGroup.add(backrestMesh);

  // Left & Right Armrests
  for (const ax of [-0.34, 0.34]) {
    const armSupport = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.28, 0.05), mats.chairFrame);
    armSupport.position.set(ax, 0.72, -0.08);
    chairGroup.add(armSupport);

    const armPad = new THREE.Mesh(roundedBoxGeometry(0.08, 0.03, 0.28, 0.01), mats.chairFrame);
    armPad.position.set(ax, 0.86, -0.05);
    chairGroup.add(armPad);
  }

  // =========================================================================
  // 7. BED AND REST AREA (Right Side of Room)
  // =========================================================================
  const bedGroup = new THREE.Group();
  bedGroup.position.set(3.8, 0.0, 0.2);
  group.add(bedGroup);

  const bedW = 2.4;
  const bedD = 4.2;
  const bedH = 0.42;

  // Solid Wooden Bed Frame with legs
  const bedFrame = new THREE.Mesh(
    chamferBoxGeometry(bedW, 0.18, bedD, { top: 0.02, bottom: 0.01 }),
    mats.bedWood
  );
  bedFrame.position.set(0, bedH - 0.09, 0);
  bedFrame.castShadow = true;
  bedGroup.add(bedFrame);

  // 4 Corner Legs
  for (const lx of [-bedW / 2 + 0.1, bedW / 2 - 0.1]) {
    for (const lz of [-bedD / 2 + 0.1, bedD / 2 - 0.1]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, bedH, 0.12), mats.bedWood);
      leg.position.set(lx, bedH / 2, lz);
      leg.castShadow = true;
      bedGroup.add(leg);
    }
  }

  // Wooden Slatted Headboard (at -Z)
  const headboard = new THREE.Mesh(
    chamferBoxGeometry(bedW, 1.3, 0.12, { top: 0.03 }),
    mats.bedWood
  );
  headboard.position.set(0, 0.95, -bedD / 2 + 0.06);
  headboard.castShadow = true;
  bedGroup.add(headboard);

  // Under-bed Storage Drawers (visible on left side of bed)
  for (let dr = 0; dr < 2; dr++) {
    const drawer = new THREE.Mesh(
      chamferBoxGeometry(0.06, 0.26, 1.4, { top: 0.01 }),
      mats.bedDrawer
    );
    drawer.position.set(-bedW / 2 + 0.02, 0.18, -0.8 + dr * 1.6);
    bedGroup.add(drawer);

    // Drawer handle
    const dHandle = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.04, 0.22), mats.metalDark);
    dHandle.position.set(-bedW / 2 - 0.02, 0.18, -0.8 + dr * 1.6);
    bedGroup.add(dHandle);
  }

  // Cream Mattress & Fitted Sheet
  const mattress = new THREE.Mesh(
    roundedBoxGeometry(bedW - 0.10, 0.38, bedD - 0.12, 0.04),
    mats.bedSheet
  );
  mattress.position.set(0, bedH + 0.19, 0.02);
  mattress.castShadow = true;
  mattress.receiveShadow = true;
  bedGroup.add(mattress);

  // Pillow at Headboard
  const pillow = new THREE.Mesh(
    roundedBoxGeometry(1.6, 0.18, 0.72, 0.06),
    mats.bedPillow
  );
  pillow.position.set(0, bedH + 0.44, -bedD / 2 + 0.65);
  pillow.castShadow = true;
  bedGroup.add(pillow);

  // Rumpled Dark Navy / Slate-Blue Blanket (Folded and casual across lower bed)
  const blanket = new THREE.Mesh(
    roundedBoxGeometry(bedW - 0.04, 0.24, 2.6, 0.06),
    mats.bedBlanket
  );
  blanket.position.set(0, bedH + 0.38, 0.8);
  blanket.castShadow = true;
  bedGroup.add(blanket);

  // Casual fold lump on blanket for rumpled feel
  const fold = new THREE.Mesh(
    roundedBoxGeometry(bedW * 0.7, 0.12, 0.75, 0.05),
    mats.bedBlanket
  );
  fold.position.set(-0.15, bedH + 0.50, 0.2);
  fold.rotation.y = 0.08;
  bedGroup.add(fold);

  // Bedside Nightstand Table
  const nightstand = new THREE.Mesh(
    chamferBoxGeometry(0.85, 0.72, 0.85, { top: 0.02 }),
    mats.bedWood
  );
  nightstand.position.set(2.0, 0.36, -2.2);
  nightstand.castShadow = true;
  group.add(nightstand);

  // Bedside Warm Lamp
  const nLampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.10, 0.04, 12), mats.lampBrass);
  nLampBase.position.set(2.0, 0.74, -2.2);
  group.add(nLampBase);

  const nLampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.36, 8), mats.lampBrass);
  nLampPole.position.set(2.0, 0.94, -2.2);
  group.add(nLampPole);

  const nLampShade = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, 0.28, 14, 1, true), mats.lampShade);
  nLampShade.position.set(2.0, 1.15, -2.2);
  nLampShade.castShadow = true;
  group.add(nLampShade);

  const nLampBulb = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), mats.lampGlow);
  nLampBulb.position.set(2.0, 1.12, -2.2);
  group.add(nLampBulb);

  // Small book stack on nightstand
  const nBook1 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.045, 0.32), mats.bookCoverRed);
  nBook1.position.set(1.9, 0.74, -2.0);
  nBook1.rotation.y = 0.15;
  group.add(nBook1);

  const nBook2 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.30), mats.bookCoverBlue);
  nBook2.position.set(1.9, 0.78, -2.0);
  nBook2.rotation.y = -0.1;
  group.add(nBook2);

  // =========================================================================
  // 8. TALL BOOKSHELF WITH BOOKS, PLANTS & SKATEBOARD (Left Wall)
  // =========================================================================
  const shelfGroup = new THREE.Group();
  shelfGroup.position.set(-SCENE.slab.hx + 0.65, 0.0, 2.6);
  group.add(shelfGroup);

  const shelfW = 0.75;
  const shelfH = 4.0;
  const shelfD = 2.4;

  // Bookshelf Open Carcass (Back against wall, top, bottom, and side uprights)
  const backPanel = new THREE.Mesh(new THREE.BoxGeometry(0.06, shelfH, shelfD), mats.timberDark);
  backPanel.position.set(-shelfW / 2 + 0.03, shelfH / 2, 0);
  shelfGroup.add(backPanel);

  const sideRear = new THREE.Mesh(new THREE.BoxGeometry(shelfW, shelfH, 0.06), mats.bookshelf);
  sideRear.position.set(0, shelfH / 2, -shelfD / 2 + 0.03);
  sideRear.castShadow = true;
  shelfGroup.add(sideRear);

  const sideFront = new THREE.Mesh(new THREE.BoxGeometry(shelfW, shelfH, 0.06), mats.bookshelf);
  sideFront.position.set(0, shelfH / 2, shelfD / 2 - 0.03);
  sideFront.castShadow = true;
  shelfGroup.add(sideFront);

  const topCap = new THREE.Mesh(new THREE.BoxGeometry(shelfW, 0.08, shelfD), mats.bookshelf);
  topCap.position.set(0, shelfH - 0.04, 0);
  topCap.castShadow = true;
  shelfGroup.add(topCap);

  const botCap = new THREE.Mesh(new THREE.BoxGeometry(shelfW, 0.08, shelfD), mats.bookshelf);
  botCap.position.set(0, 0.04, 0);
  shelfGroup.add(botCap);

  // 4 Shelves inside
  const shelfYLevels = [0.85, 1.7, 2.55, 3.4];
  for (const sy of shelfYLevels) {
    const shelfDivider = new THREE.Mesh(new THREE.BoxGeometry(shelfW - 0.04, 0.04, shelfD - 0.12), mats.timberBeam);
    shelfDivider.position.set(0.02, sy, 0);
    shelfGroup.add(shelfDivider);
  }

  // Books on Shelves (Varied heights, orientations, and colors)
  const bookColors = [mats.bookCoverRed, mats.bookCoverBlue, mats.bookCoverGreen, mats.bookCoverGold, mats.bookPages];
  for (let s = 0; s < 3; s++) {
    const baseY = shelfYLevels[s] + 0.02;
    // Row of vertical books
    for (let b = 0; b < 7; b++) {
      const bh = 0.38 + ((b * 7) % 5) * 0.06;
      const bColor = bookColors[(s * 3 + b) % bookColors.length];
      const bookMesh = new THREE.Mesh(new THREE.BoxGeometry(0.35, bh, 0.07), bColor);
      bookMesh.position.set(0.08, baseY + bh / 2, -0.8 + b * 0.11);
      bookMesh.castShadow = true;
      shelfGroup.add(bookMesh);
    }
  }

  // Storage Boxes with handles on bottom shelf
  for (let bx = 0; bx < 2; bx++) {
    const boxMesh = new THREE.Mesh(
      chamferBoxGeometry(0.48, 0.42, 0.65, { top: 0.01 }),
      mats.storageBox
    );
    boxMesh.position.set(0.04, 0.42 / 2 + 0.02, -0.55 + bx * 0.85);
    boxMesh.castShadow = true;
    shelfGroup.add(boxMesh);
  }

  // Trailing Ivy / Pothos Vines from Top Shelf of Bookshelf
  const shelfTopPot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.18, 12), mats.potCeramic);
  shelfTopPot.position.set(0.12, shelfH + 0.09, -0.6);
  shelfTopPot.castShadow = true;
  shelfGroup.add(shelfTopPot);

  const shelfTopPlant = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18, 1), mats.plantLeaf);
  shelfTopPlant.position.set(0.12, shelfH + 0.24, -0.6);
  shelfGroup.add(shelfTopPlant);

  // Cascading vine tentacles
  for (let v = 0; v < 3; v++) {
    const vineLen = 0.65 + v * 0.35;
    const vineMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.01, vineLen, 6),
      mats.plantBright
    );
    vineMesh.position.set(0.35, shelfH - vineLen / 2 + 0.05, -0.6 + (v - 1) * 0.18);
    vineMesh.rotation.z = 0.08 * (v - 1);
    shelfGroup.add(vineMesh);
  }

  // Skateboard leaning against bookshelf
  const skateGroup = new THREE.Group();
  skateGroup.position.set(0.45, 0.55, 1.4);
  skateGroup.rotation.z = 0.22;
  skateGroup.rotation.y = -0.15;
  shelfGroup.add(skateGroup);

  const skateDeck = new THREE.Mesh(
    roundedBoxGeometry(0.18, 1.15, 0.03, 0.01),
    mats.skateboardDeck
  );
  skateDeck.castShadow = true;
  skateGroup.add(skateDeck);

  // Skateboard wheels
  for (const wy of [-0.42, 0.42]) {
    const truck = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.025, 0.04), mats.metalDark);
    truck.position.set(0, wy, 0.035);
    skateGroup.add(truck);
  }

  // =========================================================================
  // 9. LIVED-IN FLOOR CLUTTER (Intentional, Natural)
  // =========================================================================
  // Backpack leaning against desk leg
  const backpack = new THREE.Mesh(
    roundedBoxGeometry(0.38, 0.58, 0.26, 0.05),
    mats.backpack
  );
  backpack.position.set(-2.8, 0.29, -0.1);
  backpack.rotation.z = 0.14;
  backpack.rotation.y = 0.35;
  backpack.castShadow = true;
  group.add(backpack);

  // Backpack accent pocket
  const bpPocket = new THREE.Mesh(roundedBoxGeometry(0.28, 0.22, 0.08, 0.02), mats.backpackTrim);
  bpPocket.position.set(-2.72, 0.22, 0.06);
  bpPocket.rotation.y = 0.35;
  group.add(bpPocket);

  // Stack of thick textbooks on floor
  const book1 = new THREE.Mesh(chamferBoxGeometry(0.42, 0.08, 0.32, { top: 0.01 }), mats.bookCoverBlue);
  book1.position.set(-2.1, 0.04, 0.6);
  book1.rotation.y = 0.18;
  book1.castShadow = true;
  group.add(book1);

  const book2 = new THREE.Mesh(chamferBoxGeometry(0.40, 0.09, 0.30, { top: 0.01 }), mats.bookCoverRed);
  book2.position.set(-2.1, 0.125, 0.6);
  book2.rotation.y = -0.08;
  book2.castShadow = true;
  group.add(book2);

  const book3 = new THREE.Mesh(chamferBoxGeometry(0.38, 0.06, 0.28, { top: 0.01 }), mats.bookCoverGreen);
  book3.position.set(-2.1, 0.20, 0.6);
  book3.rotation.y = 0.12;
  book3.castShadow = true;
  group.add(book3);

  // Loose sheets of paper on floor
  const loosePaper1 = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.24), mats.bookPages);
  loosePaper1.rotation.x = -Math.PI / 2;
  loosePaper1.rotation.z = 0.35;
  loosePaper1.position.set(-1.4, 0.022, 0.4);
  group.add(loosePaper1);

  // Pair of red & white sneakers near front edge of platform
  const shoeL = new THREE.Mesh(roundedBoxGeometry(0.14, 0.11, 0.32, 0.03), mats.sneakerRed);
  shoeL.position.set(-0.2, 0.055, 3.8);
  shoeL.rotation.y = 0.12;
  shoeL.castShadow = true;
  group.add(shoeL);

  const soleL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.025, 0.33), mats.sneakerWhite);
  soleL.position.set(-0.2, 0.015, 3.8);
  soleL.rotation.y = 0.12;
  group.add(soleL);

  const shoeR = new THREE.Mesh(roundedBoxGeometry(0.14, 0.11, 0.32, 0.03), mats.sneakerRed);
  shoeR.position.set(0.12, 0.055, 3.9);
  shoeR.rotation.y = -0.25;
  shoeR.castShadow = true;
  group.add(shoeR);

  const soleR = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.025, 0.33), mats.sneakerWhite);
  soleR.position.set(0.12, 0.015, 3.9);
  soleR.rotation.y = -0.25;
  group.add(soleR);

  // Laundry Basket with clothes peeking out
  const basket = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.32, 0.58, 14),
    mats.laundryBasket
  );
  basket.position.set(1.4, 0.29, 3.4);
  basket.castShadow = true;
  group.add(basket);

  // Clothes tumbling out
  const clothes1 = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), mats.clothesNavy);
  clothes1.position.set(1.4, 0.56, 3.4);
  group.add(clothes1);

  const clothes2 = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), mats.clothesWhite);
  clothes2.position.set(1.5, 0.60, 3.32);
  group.add(clothes2);

  // Ergonomic Video Game Controller & Cases near rug
  const gamepad = new THREE.Mesh(roundedBoxGeometry(0.22, 0.045, 0.14, 0.02), mats.gamepad);
  gamepad.position.set(0.8, 0.025, 0.9);
  gamepad.rotation.y = -0.4;
  gamepad.castShadow = true;
  group.add(gamepad);

  // Thumbsticks
  for (const gx of [-0.06, 0.06]) {
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.02, 8), mats.metalDark);
    stick.position.set(0.8 + gx * 0.8, 0.055, 0.9);
    group.add(stick);
  }

  // Game Cases Stack
  const gameCase1 = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.025, 0.26), mats.bookCoverBlue);
  gameCase1.position.set(1.2, 0.015, 0.85);
  gameCase1.rotation.y = 0.15;
  group.add(gameCase1);

  const gameCase2 = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.025, 0.26), mats.bookCoverRed);
  gameCase2.position.set(1.2, 0.04, 0.85);
  gameCase2.rotation.y = -0.1;
  group.add(gameCase2);

  // Takeaway Coffee Cup with lid on floor near bed
  const takeawayCup = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.042, 0.14, 10), mats.storageBox);
  takeawayCup.position.set(1.7, 0.07, 1.8);
  takeawayCup.castShadow = true;
  group.add(takeawayCup);

  const cupLid = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.02, 10), mats.sneakerWhite);
  cupLid.position.set(1.7, 0.14, 1.8);
  group.add(cupLid);

  // =========================================================================
  // 10. AMBIENT ANIMATION LOOP (Pure function of t)
  // =========================================================================
  function update(t) {
    // 1. Rotate PC cooling fan blades continuously
    for (let f = 0; f < pcFans.length; f++) {
      pcFans[f].blades.rotation.z = t * 14.0 + f * 1.8;
      // Gentle pulsing of fan RGB ring scale/intensity
      const pulse = 1.0 + Math.sin(t * 3.0 + f * 1.5) * 0.03;
      pcFans[f].ring.scale.set(pulse, pulse, pulse);
    }

    // 2. Terminal cursor blink
    cursor.visible = (Math.sin(t * 4.0) > 0);

    // 3. Status meter gentle alive glow
    const meterBreathe = 0.96 + Math.sin(t * 2.5) * 0.04;
    compileMeter.scale.set(meterBreathe, 1.0, 1.0);
  }

  return { group, update };
}
