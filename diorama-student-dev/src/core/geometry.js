import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export function chamferBoxGeometry(w, h, d, opts = {}) {
  const top = opts.top ?? Math.min(w, d, h) * 0.06;
  const bottom = opts.bottom ?? 0;
  const hw = w * 0.5;
  const hd = d * 0.5;
  const hh = h * 0.5;
  const t = Math.min(top, hw * 0.35, hd * 0.35, h * 0.35);
  const b = Math.min(bottom, hw * 0.35, hd * 0.35, h * 0.35);
  const yt = hh - t;
  const yb = -hh + b;
  const tx = hw - t;
  const tz = hd - t;
  const bx = hw - b;
  const bz = hd - b;

  const pos = [];
  const nor = [];

  const v = (x, y, z) => new THREE.Vector3(x, y, z);

  function tri(a, b, c, n) {
    pos.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
    for (let i = 0; i < 3; i++) nor.push(n.x, n.y, n.z);
  }

  function quad(a, b, c, d, hint) {
    const n = new THREE.Vector3()
      .subVectors(b, a)
      .cross(new THREE.Vector3().subVectors(c, a))
      .normalize();
    if (n.dot(hint) < 0) {
      const tmp = b;
      b = d;
      d = tmp;
      n.negate();
    }
    tri(a, b, c, n);
    tri(a, c, d, n);
  }

  // Bottom cap
  if (b > 0.0001) {
    quad(v(-bx, -hh, -bz), v(bx, -hh, -bz), v(bx, -hh, bz), v(-bx, -hh, bz), v(0, -1, 0));
  } else {
    quad(v(-hw, -hh, -hd), v(hw, -hh, -hd), v(hw, -hh, hd), v(-hw, -hh, hd), v(0, -1, 0));
  }

  // Four sides
  quad(v(hw, yb, -hd), v(hw, yb, hd), v(hw, yt, hd), v(hw, yt, -hd), v(1, 0, 0));
  quad(v(-hw, yb, hd), v(-hw, yb, -hd), v(-hw, yt, -hd), v(-hw, yt, hd), v(-1, 0, 0));
  quad(v(-hw, yb, hd), v(hw, yb, hd), v(hw, yt, hd), v(-hw, yt, hd), v(0, 0, 1));
  quad(v(hw, yb, -hd), v(-hw, yb, -hd), v(-hw, yt, -hd), v(hw, yt, -hd), v(0, 0, -1));

  // Top chamfer band
  quad(v(hw, yt, -hd), v(hw, yt, hd), v(tx, hh, tz), v(tx, hh, -tz), v(1, 1, 0));
  quad(v(-hw, yt, hd), v(-hw, yt, -hd), v(-tx, hh, -tz), v(-tx, hh, tz), v(-1, 1, 0));
  quad(v(-hw, yt, hd), v(hw, yt, hd), v(tx, hh, tz), v(-tx, hh, tz), v(0, 1, 1));
  quad(v(hw, yt, -hd), v(-hw, yt, -hd), v(-tx, hh, -tz), v(tx, hh, -tz), v(0, 1, -1));

  // Top cap
  quad(v(-tx, hh, -tz), v(tx, hh, -tz), v(tx, hh, tz), v(-tx, hh, tz), v(0, 1, 0));

  // Bottom chamfer band
  if (b > 0.0001) {
    quad(v(bx, -hh, -bz), v(hw, yb, -hd), v(hw, yb, hd), v(bx, -hh, bz), v(1, -1, 0));
    quad(v(-bx, -hh, bz), v(-hw, yb, hd), v(-hw, yb, -hd), v(-bx, -hh, -bz), v(-1, -1, 0));
    quad(v(-bx, -hh, bz), v(bx, -hh, bz), v(hw, yb, hd), v(-hw, yb, hd), v(0, -1, 1));
    quad(v(bx, -hh, -bz), v(-bx, -hh, -bz), v(-hw, yb, -hd), v(hw, yb, -hd), v(0, -1, -1));
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  geo.computeBoundingSphere();
  return geo;
}

export function roundedBoxGeometry(w, h, d, radius = 0.02, segments = 2) {
  return new RoundedBoxGeometry(w, h, d, segments, Math.min(radius, w * 0.45, h * 0.45, d * 0.45));
}
