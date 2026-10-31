import * as THREE from 'three';
import { TL, clamp } from '../config.js';

export function createEffects(mats) {
  const group = new THREE.Group();

  // 1. Steam Puff Particles for Espresso Machine
  const numSteam = 8;
  const steamGeo = new THREE.SphereGeometry(0.025, 8, 8);
  const steamPuffs = [];
  for (let i = 0; i < numSteam; i++) {
    const puff = new THREE.Mesh(steamGeo, mats.white);
    puff.position.set(3.8, 1.35, -0.22);
    group.add(puff);
    steamPuffs.push({ mesh: puff, offset: i * (1.0 / numSteam) });
  }

  // 2. Three AI Hologram Orbs Orbiting above Monitors
  // Left: Gemini Blue, Center: Claude Coral, Right: ChatGPT Emerald
  const orbs = [
    { name: 'gemini', color: mats.geminiBright, pos: new THREE.Vector3(-0.90, 2.15, -2.1) },
    { name: 'claude', color: mats.claudeBright, pos: new THREE.Vector3(0.0, 2.18, -2.25) },
    { name: 'chatgpt', color: mats.chatgptBright, pos: new THREE.Vector3(0.90, 2.15, -2.1) },
  ];
  const orbMeshes = [];
  for (const o of orbs) {
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), o.color);
    orb.position.copy(o.pos);
    group.add(orb);
    orbMeshes.push({ mesh: orb, basePos: o.pos });
  }

  // 3. Victory Celebration Sparkles (green confetti puffs around dev when tests pass at 30.0s)
  const numSparkles = 16;
  const sparkleGeo = new THREE.BoxGeometry(0.03, 0.03, 0.03);
  const sparkles = [];
  for (let s = 0; s < numSparkles; s++) {
    const sp = new THREE.Mesh(sparkleGeo, mats.codeTextGreen);
    sp.visible = false;
    group.add(sp);
    sparkles.push({
      mesh: sp,
      dir: new THREE.Vector3(
        (Math.sin(s * 1.3) - 0.5) * 1.8,
        0.8 + Math.cos(s * 2.1) * 0.8,
        (Math.cos(s * 1.7) - 0.5) * 1.8
      ),
    });
  }

  // Update function (pure function of t)
  function update(t) {
    // 1. Steam rising from espresso cup
    for (const p of steamPuffs) {
      const cycle = ((t * 0.8 + p.offset) % 1.0);
      p.mesh.position.y = 1.35 + cycle * 0.38;
      p.mesh.position.x = 3.8 + Math.sin(cycle * 6.0) * 0.03;
      const s = (1.0 - cycle) * 0.9;
      p.mesh.scale.set(s, s * 1.4, s);
      p.mesh.visible = cycle < 0.92;
    }

    // 2. AI Orbs gentle hovering & pulsing
    for (let i = 0; i < orbMeshes.length; i++) {
      const o = orbMeshes[i];
      const hover = Math.sin(t * 3.0 + i * 2.0) * 0.04;
      o.mesh.position.y = o.basePos.y + hover;
      const pulse = 1.0 + Math.sin(t * 5.0 + i * 1.5) * 0.18;
      o.mesh.scale.set(pulse, pulse, pulse);
    }

    // 3. Sparkle bursts on green build pass (30.0s - 33.5s)
    const isWin = t >= TL.victoryStretch[0] && t < TL.victoryStretch[1];
    for (const sp of sparkles) {
      if (!isWin) {
        sp.mesh.visible = false;
      } else {
        sp.mesh.visible = true;
        const progress = (t - TL.victoryStretch[0]) / (TL.victoryStretch[1] - TL.victoryStretch[0]);
        sp.mesh.position.set(
          0 + sp.dir.x * progress,
          1.6 + sp.dir.y * progress - progress * progress * 0.6,
          -1.0 + sp.dir.z * progress
        );
        sp.mesh.rotation.x = t * 6.0;
        sp.mesh.rotation.y = t * 8.0;
      }
    }
  }

  return { group, update };
}
