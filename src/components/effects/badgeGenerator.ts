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

export const generateFrontBadge = async (data: BadgeData): Promise<string> => {
  const isLandscape = data.orientation !== 'portrait';
  const canvas = document.createElement('canvas');
  canvas.width = isLandscape ? 1530 : 800;
  canvas.height = isLandscape ? 1000 : 1125;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const W = canvas.width;
  const H = canvas.height;

  // 1. Dark Clean Gradient Background
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#09090b');
  bgGrad.addColorStop(0.5, '#121216');
  bgGrad.addColorStop(1, '#070709');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Blueprint Dot Grid
  ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
  const gridStep = isLandscape ? 36 : 30;
  for (let x = 30; x < W; x += gridStep) {
    for (let y = 30; y < H; y += gridStep) {
      ctx.fillRect(x, y, 2.5, 2.5);
    }
  }

  // 3. Corner Accent Brackets
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
  ctx.lineWidth = 3;
  const cOff = 40;
  const cLen = 45;
  ctx.beginPath();
  ctx.moveTo(cOff, cOff + cLen); ctx.lineTo(cOff, cOff); ctx.lineTo(cOff + cLen, cOff);
  ctx.moveTo(W - cOff - cLen, cOff); ctx.lineTo(W - cOff, cOff); ctx.lineTo(W - cOff, cOff + cLen);
  ctx.moveTo(cOff, H - cOff - cLen); ctx.lineTo(cOff, H - cOff); ctx.lineTo(cOff + cLen, H - cOff);
  ctx.moveTo(W - cOff - cLen, H - cOff); ctx.lineTo(W - cOff, H - cOff); ctx.lineTo(W - cOff, H - cOff - cLen);
  ctx.stroke();

  if (isLandscape) {
    // =========================================================================
    // MINIMAL FRONT: ONLY COMMITS, PROJECTS, SINCE, TECHNOLOGIES
    // =========================================================================
    const midX = W / 2;
    const midY = 530;

    // Subtle Minimal Divider Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1.5;
    // Horizontal divider
    ctx.beginPath();
    ctx.moveTo(140, midY);
    ctx.lineTo(W - 140, midY);
    // Vertical divider
    ctx.moveTo(midX, 180);
    ctx.lineTo(midX, H - 120);
    ctx.stroke();

    const drawQuadrant = (
      x: number,
      labelY: number,
      valY: number,
      label: string,
      value: string,
      isHighlight = false
    ) => {
      ctx.textAlign = 'left';
      // Label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
      ctx.font = 'bold 24px "SF Mono", monospace, sans-serif';
      ctx.fillText(label.toUpperCase(), x, labelY);

      // Value
      ctx.fillStyle = isHighlight ? '#ef4444' : '#ffffff';
      ctx.font = 'bold 118px "Satoshi", sans-serif, -apple-system';
      ctx.fillText(value, x, valY);
    };

    // 4 Quadrants
    drawQuadrant(170, 270, 395, 'Commits', data.commits, true);
    drawQuadrant(midX + 70, 270, 395, 'Projects', data.projects, false);
    drawQuadrant(170, 620, 745, 'Since', data.since, false);
    drawQuadrant(midX + 70, 620, 745, 'Technologies', data.technologies, false);

  } else {
    // Portrait fallback
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

  // 1. Dark Gradient Background
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#0a0a0c');
  bgGrad.addColorStop(0.5, '#131317');
  bgGrad.addColorStop(1, '#08080a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Dot matrix
  ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
  const gridStep = isLandscape ? 36 : 30;
  for (let x = 30; x < W; x += gridStep) {
    for (let y = 30; y < H; y += gridStep) {
      ctx.fillRect(x, y, 2.5, 2.5);
    }
  }

  // Corner Brackets
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
  ctx.lineWidth = 3;
  const cOff = 40;
  const cLen = 45;
  ctx.beginPath();
  ctx.moveTo(cOff, cOff + cLen); ctx.lineTo(cOff, cOff); ctx.lineTo(cOff + cLen, cOff);
  ctx.moveTo(W - cOff - cLen, cOff); ctx.lineTo(W - cOff, cOff); ctx.lineTo(W - cOff, cOff + cLen);
  ctx.moveTo(cOff, H - cOff - cLen); ctx.lineTo(cOff, H - cOff); ctx.lineTo(cOff + cLen, H - cOff);
  ctx.moveTo(W - cOff - cLen, H - cOff); ctx.lineTo(W - cOff, H - cOff); ctx.lineTo(W - cOff, H - cOff - cLen);
  ctx.stroke();

  if (isLandscape) {
    // =========================================================================
    // MINIMAL BACK: ONLY CLICKABLE QR CODE + LIST OF SKILLS (NO HEADINGS)
    // =========================================================================

    // --- LEFT COLUMN: Large QR Code (X: 140 to 600, Y: 220 to 680) ---
    const qrSize = 460;
    const qrX = 140;
    const qrY = 220;

    // White rounded card background for QR
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(qrX, qrY, qrSize, qrSize, 24);
    ctx.fill();

    // Procedural QR Pattern
    const cells = 21;
    const cellSize = (qrSize - 50) / cells;
    const startX = qrX + 25;
    const startY = qrY + 25;

    ctx.fillStyle = '#0a0a0c';
    const drawCorner = (cx: number, cy: number) => {
      ctx.fillRect(startX + cx * cellSize, startY + cy * cellSize, 7 * cellSize, 7 * cellSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(startX + (cx + 1) * cellSize, startY + (cy + 1) * cellSize, 5 * cellSize, 5 * cellSize);
      ctx.fillStyle = '#0a0a0c';
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

    for (let r = 0; r < cells; r++) {
      for (let c = 0; c < cells; c++) {
        if ((r < 7 && c < 7) || (r < 7 && c >= cells - 7) || (r >= cells - 7 && c < 7)) continue;
        if (qRand() > 0.5) {
          ctx.fillRect(startX + c * cellSize, startY + r * cellSize, cellSize, cellSize);
        }
      }
    }

    // Interactive CTA below QR
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 22px "SF Mono", monospace, sans-serif';
    ctx.fillText('CLICK / SCAN ➔ GITHUB PROFILE', qrX + qrSize / 2, qrY + qrSize + 52);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '17px "SF Mono", monospace, sans-serif';
    ctx.fillText('github.com/' + (data.githubUsername || 'RohitKSahoo'), qrX + qrSize / 2, qrY + qrSize + 82);

    // --- RIGHT COLUMN: ONLY LIST OF SKILLS (NO HEADINGS AT ALL) ---
    const allSkills = [
      'Kotlin (Android)',
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
      'Linux & CLI Tools',
      'Next.js (App Router)',
      'REST & GraphQL APIs'
    ];

    const pillXStart = 710;
    const pillYStart = 210;
    const pillH = 56;
    let currX = pillXStart;
    let currRow = 0;

    allSkills.forEach(skill => {
      ctx.font = 'bold 22px "Satoshi", sans-serif, -apple-system';
      const textW = ctx.measureText(skill).width;
      const pillW = textW + 52;

      if (currX + pillW > 1460) {
        currRow++;
        currX = pillXStart;
      }

      const py = pillYStart + currRow * 76;

      // Glass pill background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.beginPath();
      ctx.roundRect(currX, py, pillW, pillH, 28);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Red dot indicator
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(currX + 22, py + pillH / 2, 5, 0, Math.PI * 2);
      ctx.fill();

      // Skill Text
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(skill, currX + 36, py + 36);

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
  canvas.width = 192;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Deep black strap base
  ctx.fillStyle = '#0a0a0c';
  ctx.fillRect(0, 0, 192, 768);

  // Subtle border edging
  ctx.fillStyle = '#1c1c20';
  ctx.fillRect(0, 0, 12, 768);
  ctx.fillRect(180, 0, 12, 768);

  // White stitched dashes
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  for (let y = 10; y < 768; y += 18) {
    ctx.fillRect(6, y, 2, 8);
    ctx.fillRect(184, y, 2, 8);
  }

  // Centered repeated typography
  ctx.save();
  ctx.translate(96, 384);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 24px "Satoshi", sans-serif, -apple-system';
  ctx.fillText('★  ROHIT K. SAHOO  //  GITHUB : ROHITKSAHOO  //  VSSUT CSE  ★', 0, 0);
  ctx.restore();

  return canvas.toDataURL('image/png');
};
