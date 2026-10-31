import * as THREE from 'three';
import { SCENE } from '../config.js';
import { chamferBoxGeometry } from '../core/geometry.js';

export function createRoom(mats) {
  const group = new THREE.Group();
  const { hx, hz, thick } = SCENE.slab;
  const { height: wh, thick: wt } = SCENE.walls;

  // =========================================================================
  // 1. SOFT CONTACT SHADOW UNDER PLATFORM
  // =========================================================================
  const shadowGeo = new THREE.PlaneGeometry(hx * 2 + 3.2, hz * 2 + 3.2);
  const groundShadow = new THREE.Mesh(shadowGeo, mats.contactShadow);
  groundShadow.rotation.x = -Math.PI / 2;
  groundShadow.position.set(0.4, -thick - 0.04, 0.4);
  group.add(groundShadow);

  // =========================================================================
  // 2. LAYERED WOODEN BASE PLATFORM (Square with stepped/bevelled edges)
  // =========================================================================
  // Lower stepped plinth
  const plinthW = hx * 2 + 0.36;
  const plinthD = hz * 2 + 0.36;
  const plinthH = thick * 0.45;
  const plinth = new THREE.Mesh(
    chamferBoxGeometry(plinthW, plinthH, plinthD, { top: 0.04, bottom: 0.02 }),
    mats.slabBase
  );
  plinth.position.y = -thick + plinthH / 2;
  plinth.receiveShadow = true;
  group.add(plinth);

  // Upper main platform
  const slabGeo = chamferBoxGeometry(hx * 2, thick * 0.65, hz * 2, { top: 0.03, bottom: 0.01 });
  const slab = new THREE.Mesh(slabGeo, mats.slabEdge);
  slab.position.y = -thick * 0.325;
  slab.receiveShadow = true;
  group.add(slab);

  // Warm Oak Floorboards (individual strips with subtle color variation)
  const floorW = hx * 2 - 0.08;
  const floorD = hz * 2 - 0.08;
  const numStrips = 20;
  const stripW = floorW / numStrips;
  for (let i = 0; i < numStrips; i++) {
    const mat = (i % 3 === 0) ? mats.floorDark : ((i % 2 === 0) ? mats.floorPlank : mats.floorLight);
    const strip = new THREE.Mesh(new THREE.BoxGeometry(stripW * 0.97, 0.02, floorD), mat);
    strip.position.set(-hx + 0.04 + (i + 0.5) * stripW, 0.01, 0);
    strip.receiveShadow = true;
    group.add(strip);
  }

  // =========================================================================
  // 3. TWO PERPENDICULAR CUTAWAY WALLS (Muted Desaturated Teal)
  // =========================================================================
  // Back Wall (-Z)
  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(hx * 2, wh, wt),
    mats.wallTeal
  );
  backWall.position.set(0, wh / 2, -hz + wt / 2);
  backWall.receiveShadow = true;
  backWall.castShadow = true;
  group.add(backWall);

  // Left Wall (-X)
  const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(wt, wh, hz * 2),
    mats.wallTeal
  );
  leftWall.position.set(-hx + wt / 2, wh / 2, 0);
  leftWall.receiveShadow = true;
  leftWall.castShadow = true;
  group.add(leftWall);

  // Timber Skirting Boards (Baseboards)
  const skirtH = 0.22;
  const skirtBack = new THREE.Mesh(new THREE.BoxGeometry(hx * 2 - wt, skirtH, 0.06), mats.skirting);
  skirtBack.position.set(wt / 2, skirtH / 2, -hz + wt + 0.03);
  group.add(skirtBack);

  const skirtLeft = new THREE.Mesh(new THREE.BoxGeometry(0.06, skirtH, hz * 2 - wt), mats.skirting);
  skirtLeft.position.set(-hx + wt + 0.03, skirtH / 2, wt / 2);
  group.add(skirtLeft);

  // =========================================================================
  // 4. EXPOSED HONEY-BROWN TIMBER BEAMS & POSTS
  // =========================================================================
  const beamSize = 0.38;

  // Top beam along Back Wall (-Z)
  const topBeamBack = new THREE.Mesh(
    chamferBoxGeometry(hx * 2 + 0.1, beamSize, beamSize, { top: 0.03, bottom: 0.03 }),
    mats.timberBeam
  );
  topBeamBack.position.set(0, wh - beamSize / 2, -hz + beamSize / 2);
  topBeamBack.castShadow = true;
  topBeamBack.receiveShadow = true;
  group.add(topBeamBack);

  // Top beam along Left Wall (-X)
  const topBeamLeft = new THREE.Mesh(
    chamferBoxGeometry(beamSize, beamSize, hz * 2 + 0.1, { top: 0.03, bottom: 0.03 }),
    mats.timberBeam
  );
  topBeamLeft.position.set(-hx + beamSize / 2, wh - beamSize / 2, 0);
  topBeamLeft.castShadow = true;
  topBeamLeft.receiveShadow = true;
  group.add(topBeamLeft);

  // Corner vertical post at (-hx, -hz)
  const cornerPost = new THREE.Mesh(
    chamferBoxGeometry(beamSize, wh, beamSize, { top: 0.02, bottom: 0.02 }),
    mats.timberBeam
  );
  cornerPost.position.set(-hx + beamSize / 2, wh / 2, -hz + beamSize / 2);
  cornerPost.castShadow = true;
  cornerPost.receiveShadow = true;
  group.add(cornerPost);

  // Front cutaway post at (-hx, +hz)
  const frontPost = new THREE.Mesh(
    chamferBoxGeometry(beamSize, wh, beamSize, { top: 0.02, bottom: 0.02 }),
    mats.timberBeam
  );
  frontPost.position.set(-hx + beamSize / 2, wh / 2, hz - beamSize / 2);
  frontPost.castShadow = true;
  group.add(frontPost);

  // Right cutaway post at (+hx, -hz)
  const rightPost = new THREE.Mesh(
    chamferBoxGeometry(beamSize, wh, beamSize, { top: 0.02, bottom: 0.02 }),
    mats.timberBeam
  );
  rightPost.position.set(hx - beamSize / 2, wh / 2, -hz + beamSize / 2);
  rightPost.castShadow = true;
  group.add(rightPost);

  // 45-degree Timber Corner Brace
  const braceGeo = new THREE.BoxGeometry(0.24, 0.85, 0.24);
  const cornerBrace = new THREE.Mesh(braceGeo, mats.timberBeam);
  cornerBrace.position.set(-hx + 0.55, wh - 0.55, -hz + 0.55);
  cornerBrace.rotation.set(0.65, 0, 0.65);
  cornerBrace.castShadow = true;
  group.add(cornerBrace);

  // =========================================================================
  // 5. WINDOW WITH WOODEN VENETIAN BLINDS (Left Wall)
  // =========================================================================
  const winW = 3.2;
  const winH = 2.4;
  const winY = 2.7;
  const winZ = -0.8;
  const frameThick = 0.12;

  // Backing glass / bright warm daylight plane
  const winGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(winW, winH),
    mats.sunlightBacking
  );
  winGlass.rotation.y = Math.PI / 2;
  winGlass.position.set(-hx + wt + 0.02, winY, winZ);
  group.add(winGlass);

  // 4-Sided Window Casing (Top, Bottom, Front, Back borders)
  const casingMat = mats.timberDark;
  // Top header
  const winTop = new THREE.Mesh(new THREE.BoxGeometry(0.16, frameThick, winW + 0.2), casingMat);
  winTop.position.set(-hx + wt + 0.08, winY + winH / 2, winZ);
  winTop.castShadow = true;
  group.add(winTop);

  // Bottom sill
  const winSill = new THREE.Mesh(
    chamferBoxGeometry(0.32, 0.10, winW + 0.36, { top: 0.02 }),
    mats.timberBeam
  );
  winSill.position.set(-hx + wt + 0.14, winY - winH / 2, winZ);
  winSill.castShadow = true;
  group.add(winSill);

  // Left vertical jamb
  const winJamb1 = new THREE.Mesh(new THREE.BoxGeometry(0.16, winH, frameThick), casingMat);
  winJamb1.position.set(-hx + wt + 0.08, winY, winZ - winW / 2);
  winJamb1.castShadow = true;
  group.add(winJamb1);

  // Right vertical jamb
  const winJamb2 = new THREE.Mesh(new THREE.BoxGeometry(0.16, winH, frameThick), casingMat);
  winJamb2.position.set(-hx + wt + 0.08, winY, winZ + winW / 2);
  winJamb2.castShadow = true;
  group.add(winJamb2);

  // Center vertical mullion divider
  const winMullion = new THREE.Mesh(new THREE.BoxGeometry(0.12, winH, 0.08), casingMat);
  winMullion.position.set(-hx + wt + 0.08, winY, winZ);
  winMullion.castShadow = true;
  group.add(winMullion);

  // Horizontal Venetian Blind Slats (angled to cast diagonal sun stripes)
  const numSlats = 11;
  const slatSpacing = (winH - 0.24) / numSlats;
  for (let s = 0; s < numSlats; s++) {
    const slat = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.035, winW - 0.16),
      mats.windowBlind
    );
    slat.position.set(
      -hx + wt + 0.10,
      winY - winH / 2 + 0.14 + s * slatSpacing,
      winZ
    );
    slat.rotation.z = 0.42; // ~24 degree tilt
    slat.castShadow = true;
    group.add(slat);
  }

  // Small potted succulent on window sill
  const sillPot = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.05, 0.12, 10), mats.potCeramic);
  sillPot.position.set(-hx + wt + 0.14, winY - winH / 2 + 0.06, winZ + 1.1);
  sillPot.castShadow = true;
  group.add(sillPot);

  const sillPlant = new THREE.Mesh(new THREE.DodecahedronGeometry(0.07, 1), mats.plantLeaf);
  sillPlant.position.set(-hx + wt + 0.14, winY - winH / 2 + 0.15, winZ + 1.1);
  group.add(sillPlant);

  // =========================================================================
  // 6. WALL DECOR: PINBOARD & FRAMED ART PRINTS
  // =========================================================================
  // Large Corkboard above desk on Back Wall
  const corkW = 3.2;
  const corkH = 1.6;
  const corkX = -1.2;
  const corkY = 3.1;
  const corkZ = -hz + wt + 0.02;

  const corkFrame = new THREE.Mesh(
    chamferBoxGeometry(corkW + 0.12, corkH + 0.12, 0.06, { top: 0.01 }),
    mats.corkFrame
  );
  corkFrame.position.set(corkX, corkY, corkZ);
  corkFrame.castShadow = true;
  group.add(corkFrame);

  const corkPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(corkW, corkH),
    mats.corkboard
  );
  corkPanel.position.set(corkX, corkY, corkZ + 0.032);
  corkPanel.receiveShadow = true;
  group.add(corkPanel);

  // Architecture diagrams, flowcharts & sticky notes pinned to corkboard
  const notes = [
    // Wireframe / Architecture diagram sketches
    { x: -2.1, y: 3.3, w: 0.65, h: 0.45, rot: 0.04, mat: mats.bookPages },
    { x: -1.3, y: 3.4, w: 0.55, h: 0.40, rot: -0.05, mat: mats.bookPages },
    { x: -0.4, y: 3.3, w: 0.70, h: 0.50, rot: 0.02, mat: mats.bookPages },
    // Coloured Sticky Notes
    { x: -2.3, y: 2.7, w: 0.22, h: 0.22, rot: 0.08, mat: mats.geminiBright },
    { x: -1.9, y: 2.75, w: 0.22, h: 0.22, rot: -0.06, mat: mats.claudeBright },
    { x: -1.5, y: 2.65, w: 0.22, h: 0.22, rot: 0.12, mat: mats.chatgptBright },
    { x: -1.1, y: 2.72, w: 0.22, h: 0.22, rot: -0.04, mat: mats.codeTextYellow },
    { x: -0.6, y: 2.68, w: 0.22, h: 0.22, rot: 0.05, mat: mats.claudeScreen },
    { x: -0.1, y: 2.8, w: 0.24, h: 0.24, rot: -0.1, mat: mats.geminiScreen },
  ];
  for (const n of notes) {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(n.w, n.h), n.mat);
    mesh.position.set(n.x, n.y, corkZ + 0.035);
    mesh.rotation.z = n.rot;
    group.add(mesh);
  }

  // Framed Art Print 1: Space / Cyber Minimalist (Back Wall, right side)
  const poster1W = 1.3;
  const poster1H = 1.8;
  const poster1X = 2.4;
  const poster1Y = 3.2;

  const frame1 = new THREE.Mesh(
    chamferBoxGeometry(poster1W + 0.08, poster1H + 0.08, 0.05, { top: 0.01 }),
    mats.posterFrame
  );
  frame1.position.set(poster1X, poster1Y, -hz + wt + 0.025);
  frame1.castShadow = true;
  group.add(frame1);

  const art1 = new THREE.Mesh(new THREE.PlaneGeometry(poster1W, poster1H), mats.posterArt1);
  art1.position.set(poster1X, poster1Y, -hz + wt + 0.052);
  group.add(art1);

  // Geometric accent inside art1
  const art1Inner = new THREE.Mesh(new THREE.CircleGeometry(0.35, 24), mats.claudeScreen);
  art1Inner.position.set(poster1X, poster1Y + 0.15, -hz + wt + 0.054);
  group.add(art1Inner);

  // Framed Art Print 2: Retro Wave (Left Wall, front side)
  const poster2W = 1.2;
  const poster2H = 1.5;
  const poster2Y = 3.0;
  const poster2Z = 2.4;

  const frame2 = new THREE.Mesh(
    chamferBoxGeometry(0.05, poster2H + 0.08, poster2W + 0.08, { top: 0.01 }),
    mats.posterFrame
  );
  frame2.position.set(-hx + wt + 0.025, poster2Y, poster2Z);
  frame2.castShadow = true;
  group.add(frame2);

  const art2 = new THREE.Mesh(new THREE.PlaneGeometry(poster2W, poster2H), mats.posterArt2);
  art2.rotation.y = Math.PI / 2;
  art2.position.set(-hx + wt + 0.052, poster2Y, poster2Z);
  group.add(art2);

  // Floating Wall Shelf (Back wall, above bed)
  const wallShelf = new THREE.Mesh(
    chamferBoxGeometry(1.8, 0.06, 0.38, { top: 0.01 }),
    mats.timberBeam
  );
  wallShelf.position.set(4.2, 2.5, -hz + wt + 0.20);
  wallShelf.castShadow = true;
  group.add(wallShelf);

  // Books and small plant on wall shelf
  const shelfBooks = [
    { x: 3.6, w: 0.08, h: 0.32, d: 0.24, mat: mats.bookCoverRed },
    { x: 3.72, w: 0.07, h: 0.28, d: 0.22, mat: mats.bookCoverBlue },
    { x: 3.82, w: 0.09, h: 0.35, d: 0.25, mat: mats.bookCoverGold },
  ];
  for (const b of shelfBooks) {
    const book = new THREE.Mesh(chamferBoxGeometry(b.w, b.h, b.d, { top: 0.01 }), b.mat);
    book.position.set(b.x, 2.5 + 0.03 + b.h / 2, -hz + wt + 0.20);
    book.castShadow = true;
    group.add(book);
  }

  // Trailing pothos plant on wall shelf
  const pot2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.12, 10), mats.potCeramic);
  pot2.position.set(4.8, 2.5 + 0.09, -hz + wt + 0.20);
  pot2.castShadow = true;
  group.add(pot2);

  const plantLeaf = new THREE.Mesh(new THREE.DodecahedronGeometry(0.09, 1), mats.plantLeaf);
  plantLeaf.position.set(4.8, 2.5 + 0.18, -hz + wt + 0.20);
  group.add(plantLeaf);

  // Subtle vine cascading down
  const vine = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.01, 0.35, 6), mats.plantBright);
  vine.position.set(4.82, 2.5 - 0.08, -hz + wt + 0.28);
  group.add(vine);

  function update(t) {
    // Stable lighting and architecture
  }

  return { group, update };
}
