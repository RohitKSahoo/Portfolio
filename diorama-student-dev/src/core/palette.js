/**
 * 64-color sRGB palette for the Student Developer Diorama.
 * The scene is quantized to these values after an 8x8 Bayer ordered dither.
 * Keep the length at exactly 64: the shader declares vec3 uPalette[64].
 */
export const PALETTE_HEX = [
  // 0-7: Whites, creams, light plaster, baseboards, sheets
  '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569',
  
  // 8-15: Room woods, cohesive warm oak flooring planks, desk timber, honey-brown beams
  '#f5e6d3', '#dfc4a2', '#cca67c', '#b58b5e', '#8c5932', '#6b3d1b', '#4a250e', '#2e1507',

  // 16-23: Technical darks, computer chassis, keycaps, chair frame, metal
  '#334155', '#1e293b', '#0f172a', '#090d16', '#262626', '#171717', '#0a0a0a', '#18181b',

  // 24-29: Walls: Muted desaturated teal / blue-green series
  '#5c878d', '#457177', '#335c62', '#24474c', '#173337', '#0e2225',

  // 30-35: Studio background: Turquoise / teal gradient series
  '#2dd4bf', '#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a',

  // 36-39: Cat fur & warm accents
  '#fb923c', '#ea580c', '#c2410c', '#7c2d12',

  // 40-44: Gemini AI Signature Blues & Indigos / Cool Monitor
  '#93c5fd', '#60a5fa', '#3b82f6', '#1d4ed8', '#1e3a8a',

  // 45-49: Claude AI Signature Coral & Chair Accent (Dusty Coral)
  '#fdba74', '#fb923c', '#f97316', '#e07a5f', '#b85d43',

  // 50-54: ChatGPT AI Signature Emerald & Plant Greens
  '#6ee7b7', '#34d399', '#10b981', '#059669', '#15803d',

  // 55-58: PC RGB Fans & Special Lighting (Violet, Cyan, Neon Blue, Warm Gold)
  '#c084fc', '#a855f7', '#22d3ee', '#fde047',

  // 59-63: Room details: Bed navy, Sneaker red, Corkboard tan, Coffee mug, Lamp brass
  '#1e293b', '#ef4444', '#d97706', '#d4a373', '#fef08a',
];

export const PALETTE_RGB = PALETTE_HEX.map((hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
});

export const C = {
  white: '#ffffff',
  paper: '#f8fafc',
  cream: '#f1f5f9',
  wallTrim: '#cbd5e1',
  floorLight: '#dfc4a2',
  floorPlank: '#cca67c',
  floorDark: '#b58b5e',
  deskWood: '#a67c52',
  deskBevel: '#6b3d1b',
  timberBeam: '#8c5932',
  timberDark: '#4a250e',
  bookshelf: '#8c5932',
  metalDark: '#1e293b',
  chassisBlack: '#0f172a',
  deepDark: '#090d16',
  charcoal: '#262626',
  wallTeal: '#335c62',
  wallTealLight: '#457177',
  wallTealDark: '#24474c',
  bgTurquoise: '#0f766e',
  bgTurquoiseLight: '#14b8a6',
  bgTurquoiseDark: '#134e4a',
  catOrange: '#f97316',
  catOrangeDark: '#c2410c',
  catWhite: '#ffffff',
  chairAccent: '#e07a5f',
  chairMesh: '#1e293b',
  chairFrame: '#171717',
  bedSheet: '#f1f5f9',
  bedPillow: '#ffffff',
  bedBlanket: '#1e3a8a',
  bedBlanketDark: '#0f172a',
  rugSlate: '#1e293b',
  rugBorder: '#334155',
  geminiBlue: '#3b82f6',
  geminiBright: '#60a5fa',
  claudeCoral: '#ea580c',
  claudeBright: '#fb923c',
  chatgptGreen: '#10b981',
  chatgptBright: '#34d399',
  testGreen: '#22c55e',
  statusAmber: '#fde047',
  errorRed: '#ef4444',
  terminalBg: '#0f172a',
  coffeeMug: '#ffffff',
  coffeeLiquid: '#4a250e',
  plantGreen: '#15803d',
  plantBright: '#34d399',
  lampBrass: '#d97706',
  lampGlow: '#fde047',
  corkboard: '#d4a373',
  backpack: '#334155',
  sneakerRed: '#ef4444',
  sneakerWhite: '#ffffff',
  rgbViolet: '#c084fc',
  rgbCyan: '#22d3ee',
  rgbBlue: '#3b82f6',
};
