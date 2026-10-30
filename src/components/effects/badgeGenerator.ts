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
}

export const generateFrontBadge = async (data: BadgeData): Promise<string> => {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1125;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // 1. Dark Gradient Background
  const bgGrad = ctx.createLinearGradient(0, 0, 800, 1125);
  bgGrad.addColorStop(0, '#0a0a0c');
  bgGrad.addColorStop(0.5, '#121216');
  bgGrad.addColorStop(1, '#08080a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 800, 1125);

  // 2. Blueprint / Dot Matrix Grid
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  for (let x = 30; x < 800; x += 30) {
    for (let y = 30; y < 1125; y += 30) {
      ctx.fillRect(x, y, 2, 2);
    }
  }

  // Corner Accent Marks
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
  ctx.lineWidth = 2;
  // Top left
  ctx.beginPath();
  ctx.moveTo(30, 60);
  ctx.lineTo(30, 30);
  ctx.lineTo(60, 30);
  ctx.stroke();
  // Top right
  ctx.beginPath();
  ctx.moveTo(770, 60);
  ctx.lineTo(770, 30);
  ctx.lineTo(740, 30);
  ctx.stroke();
  // Bottom left
  ctx.beginPath();
  ctx.moveTo(30, 1065);
  ctx.lineTo(30, 1095);
  ctx.lineTo(60, 1095);
  ctx.stroke();
  // Bottom right
  ctx.beginPath();
  ctx.moveTo(770, 1065);
  ctx.lineTo(770, 1095);
  ctx.lineTo(740, 1095);
  ctx.stroke();

  // 3. Header Info (Below lanyard clip opening, around Y=140)
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 16px "SF Mono", monospace, sans-serif';
  ctx.fillText('IDENTITY PASS // SEC-01', 50, 150);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '14px sans-serif';
  ctx.fillText('VSSUT CSE • DEVELOPER ACCESS', 50, 175);

  // Hologram chip on top right
  const chipGrad = ctx.createLinearGradient(670, 130, 750, 190);
  chipGrad.addColorStop(0, '#e5c07b');
  chipGrad.addColorStop(0.5, '#ffd700');
  chipGrad.addColorStop(1, '#b8860b');
  ctx.fillStyle = chipGrad;
  ctx.beginPath();
  ctx.roundRect(670, 130, 80, 60, 8);
  ctx.fill();
  ctx.strokeStyle = '#8a6d1c';
  ctx.lineWidth = 2;
  ctx.stroke();
  // Chip contacts
  ctx.fillStyle = '#6b4f0b';
  ctx.fillRect(670, 148, 80, 2);
  ctx.fillRect(670, 170, 80, 2);
  ctx.fillRect(710, 130, 2, 60);

  // 4. Center Avatar
  const avatarSize = 180;
  const avatarX = 400;
  const avatarY = 320;

  // Outer glow ring
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(avatarX, avatarY, avatarSize / 2 + 10, 0, Math.PI * 2);
  ctx.stroke();

  // Subtle circular dash ring
  ctx.setLineDash([6, 8]);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(avatarX, avatarY, avatarSize / 2 + 20, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Load avatar image if available
  let avatarLoaded = false;
  if (data.avatarUrl) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = data.avatarUrl;
      await new Promise<void>((resolve, reject) => {
        if (img.complete) return resolve();
        img.onload = () => resolve();
        img.onerror = () => reject();
      });
      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, avatarX - avatarSize / 2, avatarY - avatarSize / 2, avatarSize, avatarSize);
      ctx.restore();
      avatarLoaded = true;
    } catch {
      avatarLoaded = false;
    }
  }

  if (!avatarLoaded) {
    // Fallback stylized monogram
    ctx.fillStyle = '#1f1f23';
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RS', avatarX, avatarY);
  }

  // 5. Name and Role
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 38px "Satoshi", sans-serif, -apple-system';
  ctx.fillText(data.name.toUpperCase(), 400, 460);

  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 18px "SF Mono", monospace, sans-serif';
  ctx.fillText(data.role.toUpperCase(), 400, 495);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '16px sans-serif';
  ctx.fillText(data.institution, 400, 525);

  // 6. Stats Grid Card
  const boxX = 60;
  const boxY = 565;
  const boxW = 680;
  const boxH = 320;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Divider lines in box
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.moveTo(boxX, boxY + boxH / 2);
  ctx.lineTo(boxX + boxW, boxY + boxH / 2);
  ctx.moveTo(boxX + boxW / 2, boxY);
  ctx.lineTo(boxX + boxW / 2, boxY + boxH);
  ctx.stroke();

  // Stat item helper
  const drawStat = (x: number, y: number, label: string, value: string, highlight = false) => {
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = 'bold 15px "SF Mono", monospace, sans-serif';
    ctx.fillText(label.toUpperCase(), x, y);

    ctx.fillStyle = highlight ? '#ef4444' : '#ffffff';
    ctx.font = 'bold 44px "Satoshi", sans-serif, -apple-system';
    ctx.fillText(value, x, y + 60);

    if (highlight) {
      // Small pulse dot
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(x + ctx.measureText(value).width + 16, y + 42, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  drawStat(boxX + 45, boxY + 45, 'Commits', data.commits, true);
  drawStat(boxX + boxW / 2 + 45, boxY + 45, 'Projects', data.projects);
  drawStat(boxX + 45, boxY + boxH / 2 + 45, 'Since', data.since);
  drawStat(boxX + boxW / 2 + 45, boxY + boxH / 2 + 45, 'Technologies', data.technologies);

  // 7. Bottom Barcode Strip
  const barY = 930;
  const barX = 70;
  const barW = 660;

  // Procedural barcode bars
  const rngSeed = 42;
  let r = rngSeed;
  const pseudoRandom = () => {
    r = (r * 16807) % 2147483647;
    return (r - 1) / 2147483646;
  };

  let curX = barX;
  while (curX < barX + barW) {
    const width = 2 + Math.floor(pseudoRandom() * 6);
    const gap = 2 + Math.floor(pseudoRandom() * 5);
    ctx.fillStyle = pseudoRandom() > 0.85 ? '#ef4444' : 'rgba(255, 255, 255, 0.85)';
    ctx.fillRect(curX, barY, width, 55);
    curX += width + gap;
  }

  // Alphanumeric label below barcode
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = 'bold 14px "SF Mono", monospace, sans-serif';
  ctx.fillText('// AUTH-CODE: 986-COMMITS-VERIFIED • REPO-ROHITKSAHOO //', 400, 1025);

  return canvas.toDataURL('image/png');
};

export const generateBackBadge = (data: BadgeData): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1125;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // 1. Dark Gradient Background
  const bgGrad = ctx.createLinearGradient(0, 0, 800, 1125);
  bgGrad.addColorStop(0, '#0c0c0e');
  bgGrad.addColorStop(0.5, '#141418');
  bgGrad.addColorStop(1, '#09090b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 800, 1125);

  // Blueprint grid
  ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
  for (let x = 30; x < 800; x += 30) {
    for (let y = 30; y < 1125; y += 30) {
      ctx.fillRect(x, y, 2, 2);
    }
  }

  // Corner Accents
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(30, 60); ctx.lineTo(30, 30); ctx.lineTo(60, 30);
  ctx.moveTo(770, 60); ctx.lineTo(770, 30); ctx.lineTo(740, 30);
  ctx.moveTo(30, 1065); ctx.lineTo(30, 1095); ctx.lineTo(60, 1095);
  ctx.moveTo(770, 1065); ctx.lineTo(770, 1095); ctx.lineTo(740, 1095);
  ctx.stroke();

  // Header
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 16px "SF Mono", monospace, sans-serif';
  ctx.fillText('GITHUB IMPACT & REPOSITORIES', 400, 150);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px "Satoshi", sans-serif, -apple-system';
  ctx.fillText('github.com/' + (data.githubUsername || 'RohitKSahoo'), 400, 195);

  // QR Code Box
  const qrX = 260;
  const qrY = 240;
  const qrSize = 280;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(qrX, qrY, qrSize, qrSize, 16);
  ctx.fill();

  // Draw procedural QR pattern
  const qrCtx = ctx;
  const cells = 21;
  const cellSize = (qrSize - 32) / cells;
  const startX = qrX + 16;
  const startY = qrY + 16;

  qrCtx.fillStyle = '#0a0a0c';

  // Corner markers
  const drawCornerMarker = (cx: number, cy: number) => {
    // 7x7 outer
    qrCtx.fillRect(startX + cx * cellSize, startY + cy * cellSize, 7 * cellSize, 7 * cellSize);
    qrCtx.fillStyle = '#ffffff';
    qrCtx.fillRect(startX + (cx + 1) * cellSize, startY + (cy + 1) * cellSize, 5 * cellSize, 5 * cellSize);
    qrCtx.fillStyle = '#0a0a0c';
    qrCtx.fillRect(startX + (cx + 2) * cellSize, startY + (cy + 2) * cellSize, 3 * cellSize, 3 * cellSize);
  };

  drawCornerMarker(0, 0);
  drawCornerMarker(cells - 7, 0);
  drawCornerMarker(0, cells - 7);

  // Deterministic noise for QR data pattern
  let qSeed = 1337;
  const qRand = () => {
    qSeed = (qSeed * 16807) % 2147483647;
    return (qSeed - 1) / 2147483646;
  };

  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      if ((r < 7 && c < 7) || (r < 7 && c >= cells - 7) || (r >= cells - 7 && c < 7)) continue;
      if (qRand() > 0.5) {
        qrCtx.fillRect(startX + c * cellSize, startY + r * cellSize, cellSize, cellSize);
      }
    }
  }

  // QR Label
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = 'bold 15px "SF Mono", monospace, sans-serif';
  ctx.fillText('SCAN TO VIEW REPOSITORIES & COMMITS', 400, 560);

  // Tech Space Tags
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 15px "SF Mono", monospace, sans-serif';
  ctx.fillText('// CORE TECH ARCHITECTURE //', 400, 620);

  const tags = data.languages && data.languages.length > 0 
    ? data.languages 
    : ['Kotlin', 'Java', 'TypeScript', 'JavaScript', 'Python', 'React', 'Three.js', 'Android'];

  // Draw pills
  const pillY = 660;
  const pillH = 38;
  let curPillX = 80;
  let row = 0;

  tags.forEach(tag => {
    ctx.font = 'bold 15px "Satoshi", sans-serif';
    const textWidth = ctx.measureText(tag).width;
    const pillW = textWidth + 32;

    if (curPillX + pillW > 720) {
      row++;
      curPillX = 80;
    }

    const y = pillY + row * 52;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.roundRect(curPillX, y, pillW, pillH, 19);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText(tag, curPillX + 16, y + 24);

    curPillX += pillW + 12;
  });

  // Footer notes
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '14px sans-serif';
  ctx.fillText('Veer Surendra Sai University of Technology • Burla', 400, 1000);

  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 13px "SF Mono", monospace, sans-serif';
  ctx.fillText('HARDWARE ENCRYPTED • TOUCH TO FLIP', 400, 1030);

  return canvas.toDataURL('image/png');
};

export const generateStrapImage = (): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 192;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Red ribbon base
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, 0, 192, 768);

  // Dark border stitch lines
  ctx.fillStyle = '#991b1b';
  ctx.fillRect(0, 0, 12, 768);
  ctx.fillRect(180, 0, 12, 768);

  // White dotted stitch
  ctx.fillStyle = '#ffffff';
  for (let y = 10; y < 768; y += 18) {
    ctx.fillRect(6, y, 2, 8);
    ctx.fillRect(184, y, 2, 8);
  }

  // Draw repeating text rotated along strap length
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
