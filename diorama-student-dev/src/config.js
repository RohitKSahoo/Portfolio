import * as THREE from 'three';

export const SCENE = {
  loop: 16.0, // Smooth 16s ambient loop for breathing, fan rotation, lighting pulses
  slab: {
    w: 12.0,
    d: 12.0,
    thick: 0.48,
    hx: 6.0,
    hz: 6.0,
  },
  walls: {
    height: 5.2,
    thick: 0.32,
  },
  deckY: 0.0,
};

export const TL = {
  loop: 16.0,
};

export function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function smooth(t) {
  const c = clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
}

export function groundY(x, z) {
  return SCENE.deckY;
}
