import * as THREE from 'three';
import { C } from './palette.js';

export const timeUniform = { value: 0 };

const std = (hex, opts = {}) =>
  new THREE.MeshStandardMaterial({
    color: new THREE.Color(hex),
    roughness: opts.roughness ?? 0.88,
    metalness: opts.metalness ?? 0.05,
    flatShading: opts.flatShading ?? false,
  });

const basic = (hex, opts = {}) =>
  new THREE.MeshBasicMaterial({
    color: new THREE.Color(hex),
    ...opts,
  });

export function createMaterials() {
  return {
    // Architectural
    slabBase: std(C.deskBevel, { roughness: 0.85 }),
    slabEdge: std(C.timberBeam, { roughness: 0.78 }),
    floorPlank: std(C.floorPlank, { roughness: 0.80 }),
    floorLight: std(C.floorLight, { roughness: 0.84 }),
    floorDark: std(C.floorDark, { roughness: 0.76 }),
    wallTeal: std(C.wallTeal, { roughness: 0.94 }),
    wallTealLight: std(C.wallTealLight, { roughness: 0.94 }),
    timberBeam: std(C.timberBeam, { roughness: 0.75 }),
    timberDark: std(C.timberDark, { roughness: 0.82 }),
    skirting: std(C.timberDark, { roughness: 0.85 }),
    windowFrame: std(C.timberDark, { roughness: 0.7 }),
    windowBlind: std(C.timberBeam, { roughness: 0.8 }),
    windowGlass: std(C.white, { roughness: 0.2, metalness: 0.1 }),
    sunlightBacking: basic('#fef3c7'),

    // Furniture & Workstation
    deskTop: std(C.deskWood, { roughness: 0.68 }),
    deskBevel: std(C.deskBevel, { roughness: 0.74 }),
    deskLegMetal: std(C.metalDark, { metalness: 0.35, roughness: 0.55 }),
    metalDark: std(C.metalDark, { metalness: 0.45, roughness: 0.48 }),
    chassisBlack: std(C.chassisBlack, { metalness: 0.25, roughness: 0.65 }),
    deskMat: std(C.charcoal, { roughness: 0.92 }),

    // PC Tower & Hardware
    pcChassis: std(C.charcoal, { metalness: 0.35, roughness: 0.5 }),
    pcGlass: new THREE.MeshStandardMaterial({
      color: new THREE.Color(C.deepDark),
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.38,
    }),
    pcGpu: std(C.metalDark, { metalness: 0.6, roughness: 0.4 }),
    pcFanRGB1: basic(C.rgbViolet),
    pcFanRGB2: basic(C.rgbCyan),
    pcFanRGB3: basic(C.rgbBlue),

    // Chair
    chairFrame: std(C.chairFrame, { metalness: 0.2, roughness: 0.8 }),
    chairMesh: std(C.chairMesh, { roughness: 0.95 }),
    chairAccent: std(C.chairAccent, { roughness: 0.88 }),

    // Rug
    rugSlate: std(C.rugSlate, { roughness: 0.96 }),
    rugBorder: std(C.rugBorder, { roughness: 0.94 }),

    // Bed & Rest Zone
    bedWood: std(C.deskBevel, { roughness: 0.75 }),
    bedSheet: std(C.bedSheet, { roughness: 0.95 }),
    bedPillow: std(C.bedPillow, { roughness: 0.95 }),
    bedBlanket: std(C.bedBlanket, { roughness: 0.92 }),
    bedDrawer: std(C.timberBeam, { roughness: 0.8 }),

    // Storage & Shelves
    bookshelf: std(C.bookshelf, { roughness: 0.78 }),
    corkboard: std(C.corkboard, { roughness: 0.95 }),
    corkFrame: std(C.timberBeam, { roughness: 0.8 }),
    storageBox: std(C.paper, { roughness: 0.92 }),

    // Cat
    catOrange: std(C.catOrange, { roughness: 0.95 }),
    catOrangeDark: std(C.catOrangeDark, { roughness: 0.95 }),
    catWhite: std(C.catWhite, { roughness: 0.95 }),
    catEyes: basic(C.deepDark),

    // Plants & Accessories
    plantLeaf: std(C.plantGreen, { roughness: 0.82 }),
    plantBright: std(C.plantBright, { roughness: 0.80 }),
    potCeramic: std(C.cream, { roughness: 0.55 }),
    lampBrass: std(C.lampBrass, { metalness: 0.65, roughness: 0.35 }),
    lampShade: std(C.paper, { roughness: 0.9 }),
    lampGlow: basic(C.lampGlow),
    rubberDuck: std(C.lampGlow, { roughness: 0.6 }),
    rubberDuckBeak: std(C.claudeCoral, { roughness: 0.6 }),
    coffeeMug: std(C.coffeeMug, { roughness: 0.4 }),
    coffeeLiquid: basic(C.coffeeLiquid),

    // Books & Props
    bookCoverRed: std(C.sneakerRed, { roughness: 0.8 }),
    bookCoverBlue: std(C.geminiBlue, { roughness: 0.8 }),
    bookCoverGreen: std(C.chatgptGreen, { roughness: 0.8 }),
    bookCoverGold: std(C.lampBrass, { roughness: 0.8 }),
    bookPages: std(C.paper, { roughness: 0.95 }),
    backpack: std(C.backpack, { roughness: 0.9 }),
    backpackTrim: std(C.chairAccent, { roughness: 0.85 }),
    sneakerRed: std(C.sneakerRed, { roughness: 0.8 }),
    sneakerWhite: std(C.sneakerWhite, { roughness: 0.75 }),
    gamepad: std(C.charcoal, { roughness: 0.8 }),
    laundryBasket: std(C.floorPlank, { roughness: 0.9 }),
    clothesNavy: std(C.bedBlanket, { roughness: 0.95 }),
    clothesWhite: std(C.white, { roughness: 0.95 }),
    skateboardDeck: std(C.deskWood, { roughness: 0.7 }),
    posterFrame: std(C.charcoal, { roughness: 0.6 }),
    posterArt1: basic(C.wallTealLight),
    posterArt2: basic(C.geminiBlue),

    // AI Screens & Indicators (Basic / Emissive)
    geminiScreen: basic(C.geminiBlue),
    geminiBright: basic(C.geminiBright),
    claudeScreen: basic(C.claudeCoral),
    claudeBright: basic(C.claudeBright),
    chatgptScreen: basic(C.chatgptGreen),
    chatgptBright: basic(C.chatgptBright),
    terminalScreen: basic(C.terminalBg),
    codeTextGreen: basic(C.testGreen),
    codeTextCyan: basic(C.geminiBright),
    codeTextOrange: basic(C.claudeBright),
    codeTextYellow: basic(C.statusAmber),
    codeTextWhite: basic(C.paper),
    ledGreen: basic(C.testGreen),
    ledAmber: basic(C.statusAmber),
    ledRed: basic(C.errorRed),
    ledBlue: basic(C.geminiBright),

    // Studio & Ground Shadow
    contactShadow: new THREE.MeshBasicMaterial({
      color: 0x072428,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    }),
  };
}
