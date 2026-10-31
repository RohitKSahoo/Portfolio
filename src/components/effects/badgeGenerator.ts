export interface CompanyExperience {
  name: string;
  role: string;
  period?: string;
  url: string;
  logo?: string;
  logoUrl?: string;
  logoImage?: HTMLImageElement | null;
}

export const DEFAULT_COMPANIES: CompanyExperience[] = [
  {
    name: 'Papercycle',
    role: 'Digital Recycling & Waste Platform',
    period: '2024 — Present',
    url: 'https://www.papercycle.in/',
    logo: 'PC',
    logoUrl: '/papercycle.png'
  },
  {
    name: 'Enigma VSSUT',
    role: 'Official Coding Club of VSSUT',
    period: '2025 — Present',
    url: 'https://www.enigmavssut.in/',
    logo: 'EN',
    logoUrl: '/enigma.png'
  },
  {
    name: 'Open Source Community',
    role: 'Core Contributor & Builder',
    period: '2024 — Present',
    url: 'https://github.com/RohitKSahoo',
    logo: 'OS'
  }
];

export interface BadgeData {
  name: string;
  role: string;
  institution?: string;
  since?: string;
  projects?: string;
  technologies?: string;
  commits?: string;
  avatarUrl?: string;
  avatarImage?: HTMLImageElement | null;
  githubUsername?: string;
  githubUrl?: string;
  companies?: CompanyExperience[];
  languages?: string[];
  orientation?: 'portrait' | 'landscape';
}

/**
 * Antigravity Spatial Design System - 3D Lanyard Badge Generator
 * Employs deep obsidian gradients, frosted glass bento cells,
 * precision HUD telemetry accents, and signature crimson (#ef4444) glowing elements.
 */

// Draw an Antigravity Frosted Glass Bento Module
const drawGlassCard = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
  borderColor = 'rgba(255, 255, 255, 0.10)',
  isAccent = false
) => {
  ctx.save();

  // 1. Soft Ambient Depth Glow
  if (isAccent) {
    ctx.shadowColor = 'rgba(239, 68, 68, 0.18)';
    ctx.shadowBlur = 32;
    ctx.shadowOffsetY = 8;
  } else {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 6;
  }

  // 2. Translucent Glass Fill
  const glassGrad = ctx.createLinearGradient(x, y, x + w, y + h);
  glassGrad.addColorStop(0, isAccent ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255, 255, 255, 0.045)');
  glassGrad.addColorStop(1, isAccent ? 'rgba(10, 10, 14, 0.75)' : 'rgba(10, 10, 14, 0.65)');
  ctx.fillStyle = glassGrad;

  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fill();

  ctx.restore();

  // 3. Specular Hairline Inner Border
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 4. Subtle Top-Edge Specular Highlight (Glass Rim Glare)
  const rimGrad = ctx.createLinearGradient(x, y, x + w, y);
  rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  rimGrad.addColorStop(0.2, isAccent ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.22)');
  rimGrad.addColorStop(0.8, isAccent ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.22)');
  rimGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.strokeStyle = rimGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.stroke();

  ctx.restore();
};

// Draw Precision Corner Crosshair Fiducials
const drawCrosshair = (ctx: CanvasRenderingContext2D, x: number, y: number, size = 12, color = 'rgba(239, 68, 68, 0.55)') => {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - size, y);
  ctx.lineTo(x + size, y);
  ctx.moveTo(x, y - size);
  ctx.lineTo(x, y + size);
  ctx.stroke();
  ctx.restore();
};

// 5x7 Dot Matrix Font for LED Badges (OS, AI, CO)
const LED_GLYPHS: Record<string, number[][]> = {
  'O': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
  ],
  'S': [
    [0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0]
  ],
  'A': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1]
  ],
  'I': [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1]
  ],
  'C': [
    [0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [0, 1, 1, 1, 1]
  ],
  'P': [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0]
  ],
  'E': [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1]
  ],
  'N': [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1]
  ]
};

const drawDotMatrixString = (
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  dotRadius = 1.6,
  pitch = 4.8,
  color = '#ffffff'
) => {
  ctx.save();
  ctx.fillStyle = color;
  const chars = text.toUpperCase().split('');
  const charWidth = 5 * pitch;
  const charGap = pitch * 1.6;
  const totalWidth = chars.length * charWidth + (chars.length - 1) * charGap;
  const totalHeight = 7 * pitch;
  let currX = centerX - totalWidth / 2;
  const topY = centerY - totalHeight / 2;

  chars.forEach(char => {
    const grid = LED_GLYPHS[char];
    if (grid) {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 5; c++) {
          if (grid[r][c] === 1) {
            ctx.beginPath();
            ctx.arc(currX + c * pitch + pitch / 2, topY + r * pitch + pitch / 2, dotRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
    currX += charWidth + charGap;
  });
  ctx.restore();
};

const drawGithubOctocat = (ctx: CanvasRenderingContext2D, cx: number, cy: number, size = 68) => {
  ctx.save();
  ctx.translate(cx, cy);
  const scale = size / 98;
  ctx.scale(scale, scale);
  ctx.translate(-49, -49);
  ctx.fillStyle = '#ffffff';
  const path = new Path2D(
    'M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z'
  );
  ctx.fill(path);
  ctx.restore();
};

const drawBarcode = (ctx: CanvasRenderingContext2D, x: number, y: number, height = 24) => {
  ctx.save();
  ctx.fillStyle = '#6e737e';
  const pattern = [
    2, 3, 4, 2, 2, 4, 1, 3, 2, 5, 4, 2, 1, 3, 3, 2, 2, 6,
    1, 4, 3, 2, 2, 3, 4, 2, 1, 4, 2, 3, 3, 5, 2, 2, 4, 2,
    1, 3, 2, 4, 3, 2, 2, 6, 3, 2, 4, 2, 1, 3, 2, 3, 4
  ];
  let curX = x;
  pattern.forEach((w, i) => {
    if (i % 2 === 0) {
      ctx.fillRect(curX, y, w, height);
    }
    curX += w;
  });
  ctx.restore();
};

const drawSignalMatrix = (ctx: CanvasRenderingContext2D, startX: number, bottomY: number) => {
  ctx.save();
  ctx.fillStyle = '#b5b9c2';
  const dotR = 2.2;
  const colGap = 7;
  const rowGap = 7;
  for (let c = 0; c < 4; c++) {
    const numDots = c + 1;
    for (let r = 0; r < numDots; r++) {
      const dx = startX + c * colGap;
      const dy = bottomY - r * rowGap;
      ctx.beginPath();
      ctx.arc(dx, dy, dotR, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
};

const drawDottedCorner = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.save();
  ctx.fillStyle = '#b5b9c2';
  const dotR = 2.2;
  const gap = 7.5;
  const coords = [
    [0, 0], [1, 0], [2, 0],
    [0, 1],
    [0, 2]
  ];
  coords.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(x + cx * gap, y + cy * gap, dotR, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
};

const drawContributionHeatmap = (ctx: CanvasRenderingContext2D, startX: number, startY: number) => {
  ctx.save();
  const squareSize = 15;
  const gap = 5.5;
  const radius = 3.5;
  const grid = [
    [0, 2, 1, 2, 0, 1, 0, 2, 0, 1, 2, 2],
    [0, 1, 0, 1, 0, 1, 2, 0, 0, 2, 0, 0],
    [0, 1, 2, 0, 0, 1, 1, 0, 0, 0, 1, 2],
    [0, 1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1]
  ];
  const colors = [
    '#202227', // level 0 (dim/inactive)
    '#3e4350', // level 1
    '#687082', // level 2
    '#f1f5f9'  // level 3 (bright commit)
  ];

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 12; c++) {
      const level = grid[r][c];
      ctx.fillStyle = colors[level];
      const x = startX + c * (squareSize + gap);
      const y = startY + r * (squareSize + gap);
      ctx.beginPath();
      ctx.roundRect(x, y, squareSize, squareSize, radius);
      ctx.fill();
    }
  }
  ctx.restore();
};

const drawDiagonalArrow = (ctx: CanvasRenderingContext2D, x: number, y: number, size = 16) => {
  ctx.save();
  ctx.strokeStyle = '#9ca3af';
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x - size / 2, y + size / 2);
  ctx.lineTo(x + size / 2, y - size / 2);
  ctx.moveTo(x + size / 2 - size * 0.55, y - size / 2);
  ctx.lineTo(x + size / 2, y - size / 2);
  ctx.lineTo(x + size / 2, y - size / 2 + size * 0.55);
  ctx.stroke();
  ctx.restore();
};

export const generateFrontBadge = (data: BadgeData): string => {
  const isLandscape = data.orientation !== 'portrait';
  const canvas = document.createElement('canvas');
  canvas.width = isLandscape ? 1530 : 800;
  canvas.height = isLandscape ? 1000 : 1125;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const W = canvas.width;
  const H = canvas.height;

  if (isLandscape) {
    // =========================================================================
    // EXACT MODERN MINIMAL ID CARD DESIGN
    // =========================================================================

    // 1. Deep Matte Obsidian Canvas Background
    ctx.fillStyle = '#0d0e10';
    ctx.fillRect(0, 0, W, H);

    // 2. Top Header Bar (Ultra-Readable)
    // Dotted Corner Glyphs at top-left
    drawDottedCorner(ctx, 70, 55);

    // "PROFILE" label
    ctx.save();
    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 24px "Doto", "Space Mono", monospace, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('PROFILE', 115, 72);

    // Red dot next to PROFILE
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(235, 65, 7, 0, Math.PI * 2);
    ctx.fill();

    // 4-Column Signal Dot Matrix
    drawSignalMatrix(ctx, 1440, 72);
    ctx.restore();

    // 3. Left Column: Avatar + Details (Moved lower, larger image, no barcode)
    const avX = 65;
    const avY = 135;
    const avW = 460;
    const avH = 505;
    const avRadius = 32;

    // Avatar Container Box
    ctx.save();
    ctx.fillStyle = '#151619';
    ctx.beginPath();
    ctx.roundRect(avX, avY, avW, avH, avRadius);
    ctx.fill();

    // Clip inner viewport for Avatar Image
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(avX, avY, avW, avH, avRadius);
    ctx.clip();

    if (data.avatarImage && data.avatarImage.complete && data.avatarImage.naturalWidth > 0) {
      const img = data.avatarImage;
      const aspect = img.naturalWidth / img.naturalHeight;
      const frameAspect = avW / avH;
      let drawW, drawH, drawX, drawY;
      if (aspect > frameAspect) {
        drawH = avH;
        drawW = avH * aspect;
        drawX = avX + (avW - drawW) / 2;
        drawY = avY;
      } else {
        drawW = avW;
        drawH = avW / aspect;
        drawX = avX;
        drawY = avY + (avH - drawH) / 2;
      }
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    } else {
      const pGrad = ctx.createLinearGradient(avX, avY, avX + avW, avY + avH);
      pGrad.addColorStop(0, '#1c1c24');
      pGrad.addColorStop(1, '#0e0e14');
      ctx.fillStyle = pGrad;
      ctx.fillRect(avX, avY, avW, avH);

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 96px "Doto", "Space Mono", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('RS', avX + avW / 2, avY + avH / 2 + 32);
    }
    ctx.restore();

    // Subtle stroke around avatar
    ctx.strokeStyle = '#282b32';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(avX, avY, avW, avH, avRadius);
    ctx.stroke();
    ctx.restore();

    // Details Under Avatar (Nothing OS Inspired Typography)
    ctx.save();
    const underY = 690;

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '22px "Space Mono", monospace, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('SOFTWARE DEVELOPER', 75, underY);

    // Large Name: Rohit K. Sahoo
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 54px "Doto", "Space Mono", sans-serif';
    ctx.fillText(data.name || 'Rohit K. Sahoo', 75, underY + 80);

    // Subtitle: CS UNDERGRAD · VSSUT
    ctx.fillStyle = '#a3a8b4';
    ctx.font = '26px "Space Mono", monospace, sans-serif';
    ctx.fillText('CS UNDERGRAD  ·  VSSUT', 75, underY + 135);
    ctx.restore();

    // 4. Clean Vertical Separator Line (Spans full content height)
    const sepX = 555;
    const sepTopY = 125;
    const sepBottomY = 860;
    ctx.save();
    ctx.strokeStyle = '#282b32';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(sepX, sepTopY);
    ctx.lineTo(sepX, sepBottomY);
    ctx.stroke();
    ctx.restore();

    // 5. Right Column (Centered Vertically with Badge)
    const rightX = 590;
    const rightW = 875;

    // --- Row 1: GitHub Octocat + Divider + Handle + Dynamic Live Stats + Heatmap Grid ---
    const ghCenterY = 210;
    drawGithubOctocat(ctx, rightX + 44, ghCenterY, 68);

    // Vertical Divider Line next to Octocat
    ctx.save();
    ctx.strokeStyle = '#282b32';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(rightX + 104, ghCenterY - 46);
    ctx.lineTo(rightX + 104, ghCenterY + 46);
    ctx.stroke();

    // Handle Text: @RohitKSahoo (Nothing OS Monospace)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px "Space Mono", monospace, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(data.githubUsername ? `@${data.githubUsername}` : '@RohitKSahoo', rightX + 130, ghCenterY - 8);

    // Dynamic Live Stats: Repositories | Commits | Techs
    const reposCount = data.projects || '23';
    const commitsCount = data.commits || '1040+';
    const techsCount = data.technologies || '8+';

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '22px "Space Mono", monospace, sans-serif';
    ctx.fillText(
      `${reposCount} REPOSITORIES   ·   ${commitsCount} COMMITS   ·   ${techsCount} TECHS`,
      rightX + 130,
      ghCenterY + 36
    );
    ctx.restore();

    // GitHub Contribution Heatmap Grid (Moved to top & enlarged)
    drawContributionHeatmap(ctx, rightX + rightW - 240, ghCenterY - 90);

    // --- Row 2: WORK & ORGANIZATIONS Section Header ---
    const secY = 315;
    // Red vertical accent bar
    ctx.save();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.roundRect(rightX, secY - 15, 6, 32, 3);
    ctx.fill();

    // Text: WORKED AT (Nothing OS Dot Display)
    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 28px "Doto", "Space Mono", monospace, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('WORKED AT', rightX + 26, secY + 10);
    ctx.restore();

    // --- Row 3: Three Experience Cards (Enlarged, no background/border behind website logo) ---
    const companies = data.companies && data.companies.length > 0 ? data.companies : DEFAULT_COMPANIES;
    const cardStartY = 365;
    const itemCardH = 146;
    const itemCardGap = 18;

    companies.slice(0, 3).forEach((comp, idx) => {
      const cy = cardStartY + idx * (itemCardH + itemCardGap);

      // Card Background & Border
      ctx.save();
      ctx.fillStyle = '#16171a';
      ctx.beginPath();
      ctx.roundRect(rightX, cy, rightW, itemCardH, 24);
      ctx.fill();
      ctx.strokeStyle = '#282b32';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Website Logo (No background box or border, clean rendering)
      const logoX = rightX + 28;
      const logoSize = 90;
      const logoY = cy + (itemCardH - logoSize) / 2;

      // Draw Logo Image or 5x7 Dot-Matrix Letters fallback directly
      if (comp.logoImage && comp.logoImage.complete && comp.logoImage.naturalWidth > 0) {
        ctx.save();
        ctx.drawImage(comp.logoImage, logoX, logoY, logoSize, logoSize);
        ctx.restore();
      } else {
        const initial = comp.logo || comp.name.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase() || 'CO';
        drawDotMatrixString(ctx, initial, logoX + logoSize / 2, logoY + logoSize / 2, 2.6, 7.2, '#ffffff');
      }

      const textX = logoX + logoSize + 26;

      // Top Row: Company Name (Nothing OS Dot Matrix) + Working Period side-by-side
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 34px "Doto", "Space Mono", monospace, sans-serif';
      ctx.textAlign = 'left'; 
      ctx.fillText(comp.name, textX, cy + 56);

      const nameWidth = ctx.measureText(comp.name).width;

      if (comp.period) {
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 22px "Doto", "Space Mono", monospace, sans-serif';
        ctx.fillText('·', textX + nameWidth + 14, cy + 54);

        ctx.fillStyle = '#8e929b';
        ctx.font = '20px "Space Mono", monospace, sans-serif';
        ctx.fillText(comp.period, textX + nameWidth + 30, cy + 54);
      }

      // Bottom Row: Dedicated Role Text (Clean Nothing OS Monospace)
      ctx.fillStyle = '#a3a8b4';
      ctx.font = '22px "Space Mono", monospace, sans-serif';
      ctx.fillText(comp.role, textX, cy + 100);

      // Right Arrow: ↗ (Bold & Crisp)
      drawDiagonalArrow(ctx, rightX + rightW - 52, cy + itemCardH / 2, 28);

      ctx.restore();
    });

    // 6. Straight Line Near Bottom Edge of ID Card
    ctx.save();
    ctx.strokeStyle = '#828488ff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(65, 915);
    ctx.lineTo(W - 65, 915);
    ctx.stroke();
    ctx.restore();

  } else {
    // Portrait Fallback: Compact vertical stack
    const cardW = 680;
    const colX = 60;

    // Top: Photo card
    drawGlassCard(ctx, colX, 160, cardW, 360, 22, 'rgba(255, 255, 255, 0.12)', false);
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px "Satoshi", sans-serif';
    ctx.fillText('ROHIT K. SAHOO', colX + 32, 220);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 16px "Satoshi", monospace';
    ctx.fillText(data.githubUsername ? `@${data.githubUsername}` : '@RohitKSahoo', colX + 32, 260);
    ctx.restore();

    // Bottom: Experience
    drawGlassCard(ctx, colX, 550, cardW, 500, 22, 'rgba(255, 255, 255, 0.12)', false);
    ctx.save();
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 16px "Satoshi", monospace';
    ctx.fillText('// EXPERIENCE', colX + 32, 600);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Satoshi", sans-serif';
    ctx.fillText('COMPANIES & WORK', colX + 32, 640);
    ctx.restore();
  }

  return canvas.toDataURL('image/png');
};

export const generateBackBadge = (data: BadgeData): string => {
  const isLandscape = data.orientation !== 'portrait';
  const canvas = document.createElement('canvas');
  canvas.width = isLandscape ? 1530 : 800;
  canvas.height = isLandscape ? 1000 : 1125;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const W = canvas.width;
  const H = canvas.height;

  // 1. Deep Matte Obsidian Canvas Background matching front
  ctx.fillStyle = '#0d0e10';
  ctx.fillRect(0, 0, W, H);

  // 2. Subtle Corner Glyphs
  ctx.save();
  drawDottedCorner(ctx, 70, 55);
  drawSignalMatrix(ctx, W - 100, 72);

  // 3. Minimal Clean Center Monogram (Faint matte watermark)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
  ctx.font = 'bold 130px "Doto", "Space Mono", monospace, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('RS', W / 2, H / 2 - 10);

  // 4. Bottom Straight Accent Line matching front
  ctx.strokeStyle = '#828488ff';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  const lineY = isLandscape ? 915 : H - 85;
  ctx.moveTo(65, lineY);
  ctx.lineTo(W - 65, lineY);
  ctx.stroke();

  ctx.restore();

  return canvas.toDataURL('image/png');
};

export const generateStrapImage = (): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 192;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // 1. Tactical Carbon Obsidian Weave Base
  ctx.fillStyle = '#08080a';
  ctx.fillRect(0, 0, 768, 192);

  // Ballistic herringbone texture
  ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
  for (let x = 0; x < 768; x += 8) {
    ctx.fillRect(x, 0, 2, 192);
  }

  // 2. High-Visibility Crimson Edge Piping
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(0, 0, 768, 8);
  ctx.fillRect(0, 184, 768, 8);

  // Darker inner border rail
  ctx.fillStyle = '#1c1c22';
  ctx.fillRect(0, 8, 768, 10);
  ctx.fillRect(0, 174, 768, 10);

  // 3. High-Tensile Safety Stitched Dashes
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  for (let x = 8; x < 768; x += 18) {
    ctx.fillRect(x, 12, 8, 2.5);
    ctx.fillRect(x, 177, 8, 2.5);
  }

  // 4. Centered Repeated Tactical Typography
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 24px "Satoshi", sans-serif, -apple-system';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 8;
  ctx.fillText('★  ROHIT K. SAHOO  //  GITHUB : ROHITKSAHOO  //  VSSUT CSE  ★', 384, 96);
  ctx.restore();

  return canvas.toDataURL('image/png');
};
