export interface BadgeData {
  name: string;
  role: string;
  institution: string;
  since: string;
  projects: string;
  technologies: string;
  commits: string;
  avatarUrl?: string;
  githubUsername?: string;
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

export const generateFrontBadge = async (data: BadgeData): Promise<string> => {
  const isLandscape = data.orientation !== 'portrait';
  const canvas = document.createElement('canvas');
  canvas.width = isLandscape ? 1530 : 800;
  canvas.height = isLandscape ? 1000 : 1125;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const W = canvas.width;
  const H = canvas.height;

  // 1. Antigravity Deep Obsidian Radial Lighting
  const bgGrad = ctx.createRadialGradient(W / 2, 400, 80, W / 2, 500, 950);
  bgGrad.addColorStop(0, '#131318');
  bgGrad.addColorStop(0.45, '#0b0b0e');
  bgGrad.addColorStop(1, '#050507');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Spatial Blueprint Micro-Dot Matrix with Subtle Falloff
  const gridStep = isLandscape ? 38 : 32;
  for (let x = 36; x < W; x += gridStep) {
    for (let y = 36; y < H; y += gridStep) {
      const distFromCenter = Math.hypot(x - W / 2, y - H / 2);
      const alpha = Math.max(0.015, 0.045 - (distFromCenter / 1400) * 0.035);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
      ctx.fillRect(x, y, 2.5, 2.5);
    }
  }

  // 3. Perimeter Antigravity HUD Framing
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(32, 32, W - 64, H - 64);

  // Corner Accent Brackets
  const cOff = 32;
  const cLen = 42;
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(cOff, cOff + cLen); ctx.lineTo(cOff, cOff); ctx.lineTo(cOff + cLen, cOff);
  ctx.moveTo(W - cOff - cLen, cOff); ctx.lineTo(W - cOff, cOff); ctx.lineTo(W - cOff, cOff + cLen);
  ctx.moveTo(cOff, H - cOff - cLen); ctx.lineTo(cOff, H - cOff); ctx.lineTo(cOff + cLen, H - cOff);
  ctx.moveTo(W - cOff - cLen, H - cOff); ctx.lineTo(W - cOff, H - cOff); ctx.lineTo(W - cOff, H - cOff - cLen);
  ctx.stroke();

  // Subtle Outer Crosshairs
  drawCrosshair(ctx, cOff + 18, cOff + 18, 8, 'rgba(239, 68, 68, 0.4)');
  drawCrosshair(ctx, W - cOff - 18, cOff + 18, 8, 'rgba(239, 68, 68, 0.4)');
  drawCrosshair(ctx, cOff + 18, H - cOff - 18, 8, 'rgba(239, 68, 68, 0.4)');
  drawCrosshair(ctx, W - cOff - 18, H - cOff - 18, 8, 'rgba(239, 68, 68, 0.4)');

  // Telemetry Micro-Readouts
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.font = 'bold 12px "SF Mono", monospace, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('SYS.CORE // TELEMETRY_v2.0', 90, 56);
  ctx.textAlign = 'right';
  ctx.fillText('SECURITY STATUS: ENCRYPTED // ACTIVE', W - 90, 56);
  ctx.restore();

  if (isLandscape) {
    // =========================================================================
    // 4 FLOATING ANTIGRAVITY BENTO MODULES (COMMITS, PROJECTS, SINCE, TECHNOLOGIES)
    // =========================================================================
    const cardW = 600;
    const cardH = 320;
    const radius = 22;

    const col1X = 135;
    const col2X = 795;
    const row1Y = 195;
    const row2Y = 565;

    const renderBentoModule = (
      x: number,
      y: number,
      indexTag: string,
      statusTag: string,
      label: string,
      value: string,
      footerNote: string,
      isPrimary = false
    ) => {
      // 1. Draw Glass Capsule
      drawGlassCard(
        ctx,
        x,
        y,
        cardW,
        cardH,
        radius,
        isPrimary ? 'rgba(239, 68, 68, 0.40)' : 'rgba(255, 255, 255, 0.12)',
        isPrimary
      );

      // 2. Top Meta Header inside module
      ctx.save();
      ctx.textAlign = 'left';
      ctx.fillStyle = isPrimary ? '#ef4444' : 'rgba(255, 255, 255, 0.4)';
      ctx.font = 'bold 15px "SF Mono", monospace, sans-serif';
      ctx.fillText(indexTag, x + 36, y + 46);

      ctx.textAlign = 'right';
      if (isPrimary) {
        // Glowing Green Pulse Beacon for Commits Activity
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(x + cardW - 130, y + 41, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 13px "SF Mono", monospace, sans-serif';
        ctx.fillText('LIVE RECORD', x + cardW - 36, y + 46);
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.font = 'bold 13px "SF Mono", monospace, sans-serif';
        ctx.fillText(statusTag, x + cardW - 36, y + 46);
      }

      // 3. Section Title / Label
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.50)';
      ctx.font = 'bold 20px "SF Mono", monospace, sans-serif';
      ctx.fillText(label.toUpperCase(), x + 36, y + 90);

      // 4. Large Stat Numeral
      ctx.fillStyle = isPrimary ? '#ef4444' : '#ffffff';
      ctx.font = 'bold 124px "Satoshi", sans-serif, -apple-system';

      if (isPrimary) {
        ctx.shadowColor = 'rgba(239, 68, 68, 0.35)';
        ctx.shadowBlur = 18;
      } else {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
      }
      ctx.fillText(value, x + 36, y + 215);
      ctx.shadowBlur = 0; // reset

      // 5. Bottom Descriptor Line
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.font = '13px "SF Mono", monospace, sans-serif';
      ctx.fillText(footerNote, x + 36, y + 276);

      // Decorative corner tick
      ctx.strokeStyle = isPrimary ? 'rgba(239, 68, 68, 0.6)' : 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + cardW - 24, y + cardH - 12);
      ctx.lineTo(x + cardW - 12, y + cardH - 12);
      ctx.lineTo(x + cardW - 12, y + cardH - 24);
      ctx.stroke();

      ctx.restore();
    };

    // Render 4 Quadrants
    renderBentoModule(
      col1X,
      row1Y,
      '// 01',
      'ACTIVE STREAM',
      'Commits',
      data.commits,
      'PRODUCTION & OSS CONTRIBUTIONS',
      true
    );

    renderBentoModule(
      col2X,
      row1Y,
      '// 02',
      'VERIFIED ARCH',
      'Projects',
      data.projects,
      'PUBLIC REPOSITORIES & PACKAGES',
      false
    );

    renderBentoModule(
      col1X,
      row2Y,
      '// 03',
      'ORIGIN YEAR',
      'Since',
      data.since,
      'CONTINUOUS DEPLOYMENT CYCLE',
      false
    );

    renderBentoModule(
      col2X,
      row2Y,
      '// 04',
      'CORE ECOSYSTEM',
      'Technologies',
      data.technologies,
      'LANGUAGES & FRAMEWORKS IN USE',
      false
    );

  } else {
    // Portrait Fallback
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = 'bold 18px "SF Mono", monospace, sans-serif';
    ctx.fillText('COMMITS', 100, 200);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 80px "Satoshi", sans-serif';
    ctx.fillText(data.commits, 100, 280);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillText('PROJECTS', 100, 420);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(data.projects, 100, 500);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillText('SINCE', 100, 640);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(data.since, 100, 720);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillText('TECHNOLOGIES', 100, 860);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(data.technologies, 100, 940);
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

  // 1. Antigravity Deep Obsidian Radial Lighting
  const bgGrad = ctx.createRadialGradient(W / 2, 400, 80, W / 2, 500, 950);
  bgGrad.addColorStop(0, '#131318');
  bgGrad.addColorStop(0.45, '#0b0b0e');
  bgGrad.addColorStop(1, '#050507');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Spatial Blueprint Micro-Dot Matrix with Subtle Falloff
  const gridStep = isLandscape ? 38 : 32;
  for (let x = 36; x < W; x += gridStep) {
    for (let y = 36; y < H; y += gridStep) {
      const distFromCenter = Math.hypot(x - W / 2, y - H / 2);
      const alpha = Math.max(0.015, 0.045 - (distFromCenter / 1400) * 0.035);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
      ctx.fillRect(x, y, 2.5, 2.5);
    }
  }

  // 3. Perimeter Antigravity HUD Framing
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(32, 32, W - 64, H - 64);

  // Corner Accent Brackets
  const cOff = 32;
  const cLen = 42;
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(cOff, cOff + cLen); ctx.lineTo(cOff, cOff); ctx.lineTo(cOff + cLen, cOff);
  ctx.moveTo(W - cOff - cLen, cOff); ctx.lineTo(W - cOff, cOff); ctx.lineTo(W - cOff, cOff + cLen);
  ctx.moveTo(cOff, H - cOff - cLen); ctx.lineTo(cOff, H - cOff); ctx.lineTo(cOff + cLen, H - cOff);
  ctx.moveTo(W - cOff - cLen, H - cOff); ctx.lineTo(W - cOff, H - cOff); ctx.lineTo(W - cOff, H - cOff - cLen);
  ctx.stroke();

  // Subtle Outer Crosshairs
  drawCrosshair(ctx, cOff + 18, cOff + 18, 8, 'rgba(239, 68, 68, 0.4)');
  drawCrosshair(ctx, W - cOff - 18, cOff + 18, 8, 'rgba(239, 68, 68, 0.4)');
  drawCrosshair(ctx, cOff + 18, H - cOff - 18, 8, 'rgba(239, 68, 68, 0.4)');
  drawCrosshair(ctx, W - cOff - 18, H - cOff - 18, 8, 'rgba(239, 68, 68, 0.4)');

  // Telemetry Micro-Readouts
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.font = 'bold 12px "SF Mono", monospace, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('IDENTITY MIRROR // GITHUB PROTOCOL', 90, 56);
  ctx.textAlign = 'right';
  ctx.fillText('INTERACTIVE SURFACE // TAP TO ROUTE', W - 90, 56);
  ctx.restore();

  if (isLandscape) {
    // =========================================================================
    // MINIMAL BACK: ONLY CLICKABLE QR CODE + LIST OF SKILLS (NO HEADINGS)
    // =========================================================================

    // --- LEFT COLUMN: Frosted Glass Pedestal for QR (X: 135 to 655, Y: 195 to 885) ---
    const pedW = 520;
    const pedH = 690;
    const pedX = 135;
    const pedY = 195;

    // Draw Outer Glass Pedestal
    drawGlassCard(ctx, pedX, pedY, pedW, pedH, 24, 'rgba(239, 68, 68, 0.35)', true);

    // Header inside QR Pedestal
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 14px "SF Mono", monospace, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('// REPO_GATEWAY.QR', pedX + 32, pedY + 42);

    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText('AUTHENTICATED', pedX + pedW - 32, pedY + 42);

    // The White QR Box Container
    const qrSize = 390;
    const qrX = pedX + (pedW - qrSize) / 2;
    const qrY = pedY + 68;

    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 6;
    ctx.beginPath();
    ctx.roundRect(qrX, qrY, qrSize, qrSize, 20);
    ctx.fill();
    ctx.restore();

    // Procedural QR Pattern
    const cells = 21;
    const cellSize = (qrSize - 50) / cells;
    const startX = qrX + 25;
    const startY = qrY + 25;

    ctx.fillStyle = '#0a0a0c';
    const drawCorner = (cx: number, cy: number) => {
      // Outer black frame
      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(startX + cx * cellSize, startY + cy * cellSize, 7 * cellSize, 7 * cellSize);
      // White inner ring
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(startX + (cx + 1) * cellSize, startY + (cy + 1) * cellSize, 5 * cellSize, 5 * cellSize);
      // Crimson glowing center core
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(startX + (cx + 2) * cellSize, startY + (cy + 2) * cellSize, 3 * cellSize, 3 * cellSize);
    };

    drawCorner(0, 0);
    drawCorner(cells - 7, 0);
    drawCorner(0, cells - 7);

    let qSeed = 1337;
    const qRand = () => {
      qSeed = (qSeed * 16807) % 2147483647;
      return (qSeed - 1) / 2147483646;
    };

    ctx.fillStyle = '#0a0a0c';
    for (let r = 0; r < cells; r++) {
      for (let c = 0; c < cells; c++) {
        if ((r < 7 && c < 7) || (r < 7 && c >= cells - 7) || (r >= cells - 7 && c < 7)) continue;
        if (qRand() > 0.5) {
          ctx.fillRect(startX + c * cellSize, startY + r * cellSize, cellSize, cellSize);
        }
      }
    }

    // Interactive Floating CTA Action Pill beneath QR
    const btnW = 450;
    const btnH = 64;
    const btnX = pedX + (pedW - btnW) / 2;
    const btnY = qrY + qrSize + 28;

    ctx.save();
    const btnGrad = ctx.createLinearGradient(btnX, btnY, btnX, btnY + btnH);
    btnGrad.addColorStop(0, 'rgba(239, 68, 68, 0.22)');
    btnGrad.addColorStop(1, 'rgba(239, 68, 68, 0.08)');
    ctx.fillStyle = btnGrad;
    ctx.beginPath();
    ctx.roundRect(btnX, btnY, btnW, btnH, 32);
    ctx.fill();

    ctx.strokeStyle = 'rgba(239, 68, 68, 0.65)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Pulse indicator dot inside button
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(btnX + 36, btnY + btnH / 2, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "SF Mono", monospace, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('CLICK / SCAN ➔ GITHUB', btnX + 56, btnY + 39);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 20px "SF Mono", monospace, sans-serif';
    ctx.fillText('↗', btnX + btnW - 32, btnY + 39);

    // URL Readout Line
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.font = '15px "SF Mono", monospace, sans-serif';
    ctx.fillText('github.com/' + (data.githubUsername || 'RohitKSahoo'), pedX + pedW / 2, btnY + btnH + 32);
    ctx.restore();

    // --- RIGHT COLUMN: FLOATING ANTIGRAVITY SKILLS PILLS (NO HEADINGS AT ALL) ---
    const allSkills = [
      'Kotlin (Android Native)',
      'Java (Core / SE)',
      'TypeScript',
      'JavaScript (ESNext)',
      'Python',
      'React 18 / 19',
      'Three.js (WebGL)',
      'Tailwind CSS',
      'Framer Motion',
      'Node.js & Express',
      'Git & GitHub Actions',
      'Linux & Terminal CLI',
      'Next.js (App Router)',
      'REST & GraphQL APIs'
    ];

    const pillXStart = 715;
    const pillYStart = 195;
    const pillH = 58;
    let currX = pillXStart;
    let currRow = 0;

    allSkills.forEach(skill => {
      ctx.font = 'bold 22px "Satoshi", sans-serif, -apple-system';
      const textW = ctx.measureText(skill).width;
      const pillW = textW + 68;

      if (currX + pillW > 1465) {
        currRow++;
        currX = pillXStart;
      }

      const py = pillYStart + currRow * 78;

      // Antigravity Glass Pill
      ctx.save();
      const pGrad = ctx.createLinearGradient(currX, py, currX + pillW, py + pillH);
      pGrad.addColorStop(0, 'rgba(255, 255, 255, 0.055)');
      pGrad.addColorStop(1, 'rgba(255, 255, 255, 0.020)');
      ctx.fillStyle = pGrad;
      ctx.beginPath();
      ctx.roundRect(currX, py, pillW, pillH, 29);
      ctx.fill();

      // Dual-layer stroke
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Glowing crimson beacon indicator
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = 'rgba(239, 68, 68, 0.5)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(currX + 24, py + pillH / 2, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // reset

      // Skill Text
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(skill, currX + 42, py + 37);

      ctx.restore();

      currX += pillW + 18;
    });

  } else {
    // Portrait fallback
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px "Satoshi", sans-serif';
    ctx.fillText('SKILLS & GITHUB', 100, 200);
  }

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
