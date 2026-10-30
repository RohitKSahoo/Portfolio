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
  const isLandscape = data.orientation !== 'portrait'; // default to landscape
  const canvas = document.createElement('canvas');
  canvas.width = isLandscape ? 1440 : 800;
  canvas.height = isLandscape ? 1024 : 1125;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const W = canvas.width;
  const H = canvas.height;

  // 1. Dark Gradient Background
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#09090b');
  bgGrad.addColorStop(0.5, '#121216');
  bgGrad.addColorStop(1, '#070709');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Blueprint / Dot Matrix Grid
  ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
  const gridStep = isLandscape ? 36 : 30;
  for (let x = 30; x < W; x += gridStep) {
    for (let y = 30; y < H; y += gridStep) {
      ctx.fillRect(x, y, 2.5, 2.5);
    }
  }

  // Corner Accent Brackets
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
  ctx.lineWidth = 3;
  const cOff = 35;
  const cLen = 45;
  // Top left
  ctx.beginPath();
  ctx.moveTo(cOff, cOff + cLen); ctx.lineTo(cOff, cOff); ctx.lineTo(cOff + cLen, cOff);
  // Top right
  ctx.moveTo(W - cOff - cLen, cOff); ctx.lineTo(W - cOff, cOff); ctx.lineTo(W - cOff, cOff + cLen);
  // Bottom left
  ctx.moveTo(cOff, H - cOff - cLen); ctx.lineTo(cOff, H - cOff); ctx.lineTo(cOff + cLen, H - cOff);
  // Bottom right
  ctx.moveTo(W - cOff - cLen, H - cOff); ctx.lineTo(W - cOff, H - cOff); ctx.lineTo(W - cOff, H - cOff - cLen);
  ctx.stroke();

  if (isLandscape) {
    // ==========================================
    // LANDSCAPE LAYOUT (1440 x 1024)
    // Avoid top-center clamp area (X: 580 to 860, Y: 0 to 160)
    // ==========================================

    // Top subtle guide lines flanking the clamp slot
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(80, 140); ctx.lineTo(540, 140);
    ctx.moveTo(900, 140); ctx.lineTo(1360, 140);
    ctx.stroke();

    // --- LEFT COLUMN: Identity (X: 80 to 660) ---
    // Top chip
    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
    ctx.beginPath();
    ctx.roundRect(80, 60, 240, 42, 21);
    ctx.fill();
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(106, 81, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "SF Mono", monospace, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('IDENTITY PASS // 2025', 124, 86);

    // Avatar
    const avatarRadius = 90;
    const avatarX = 180;
    const avatarY = 270;

    // Glowing rings around avatar
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarRadius + 8, 0, Math.PI * 2);
    ctx.stroke();

    ctx.setLineDash([6, 8]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarRadius + 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

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
        ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, avatarX - avatarRadius, avatarY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
        ctx.restore();
        avatarLoaded = true;
      } catch {
        avatarLoaded = false;
      }
    }

    if (!avatarLoaded) {
      ctx.fillStyle = '#1c1c22';
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 54px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('RS', avatarX, avatarY);
    }

    // Beside Avatar Badges
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = 'bold 14px "SF Mono", monospace, sans-serif';
    ctx.fillText('CREDENTIAL // STUDENT', 310, 225);

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 18px "SF Mono", monospace, sans-serif';
    ctx.fillText('CLASS OF 2026', 310, 255);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('3rd Year • B.Tech CSE', 310, 290);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '14px sans-serif';
    ctx.fillText('Veer Surendra Sai Univ.', 310, 318);

    // Name & Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 46px "Satoshi", sans-serif, -apple-system';
    ctx.fillText(data.name.toUpperCase(), 80, 430);

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 22px "SF Mono", monospace, sans-serif';
    ctx.fillText((data.role || 'COMPUTER SCIENCE STUDENT').toUpperCase(), 80, 475);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '18px sans-serif';
    ctx.fillText(data.institution, 80, 515);

    // Identity security stamp
    const secBoxX = 80;
    const secBoxY = 560;
    const secBoxW = 580;
    const secBoxH = 260;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.beginPath();
    ctx.roundRect(secBoxX, secBoxY, secBoxW, secBoxH, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 14px "SF Mono", monospace, sans-serif';
    ctx.fillText('// SECURITY SIGNATURE //', secBoxX + 30, secBoxY + 40);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '14px "SF Mono", monospace, sans-serif';
    ctx.fillText('HASH: SHA256-986-COMMITS-VSSUT-DEV', secBoxX + 30, secBoxY + 70);
    ctx.fillText('ISSUER: CSE DEPT • VERIFIED ON-CHAIN', secBoxX + 30, secBoxY + 95);

    // Barcode inside left stamp
    let bSeed = 77;
    const bRand = () => {
      bSeed = (bSeed * 16807) % 2147483647;
      return (bSeed - 1) / 2147483646;
    };
    let bx = secBoxX + 30;
    const by = secBoxY + 130;
    while (bx < secBoxX + secBoxW - 30) {
      const w = 2 + Math.floor(bRand() * 5);
      const gap = 2 + Math.floor(bRand() * 4);
      ctx.fillStyle = bRand() > 0.85 ? '#ef4444' : 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(bx, by, w, 50);
      bx += w + gap;
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = 'bold 12px "SF Mono", monospace, sans-serif';
    ctx.fillText('SEC-ID: 986-RS-VSSUT // ACCESS GRANTED', secBoxX + 30, secBoxY + 210);

    // Bottom left footer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.font = '14px "SF Mono", monospace, sans-serif';
    ctx.fillText('PORTFOLIO ARCHITECT // VERSION 2.0', 80, 890);

    // --- RIGHT COLUMN: Metrics Grid (X: 720 to 1360) ---
    // Top right smart chip
    const chipX = 1260;
    const chipY = 55;
    const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + 80, chipY + 60);
    chipGrad.addColorStop(0, '#e5c07b');
    chipGrad.addColorStop(0.5, '#ffd700');
    chipGrad.addColorStop(1, '#b8860b');
    ctx.fillStyle = chipGrad;
    ctx.beginPath();
    ctx.roundRect(chipX, chipY, 80, 60, 8);
    ctx.fill();
    ctx.strokeStyle = '#8a6d1c';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#6b4f0b';
    ctx.fillRect(chipX, chipY + 18, 80, 2);
    ctx.fillRect(chipX, chipY + 40, 80, 2);
    ctx.fillRect(chipX + 40, chipY, 2, 60);

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 16px "SF Mono", monospace, sans-serif';
    ctx.fillText('GITHUB IMPACT METRICS', 720, 85);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Satoshi", sans-serif';
    ctx.fillText('github.com/' + (data.githubUsername || 'RohitKSahoo'), 720, 115);

    // Big 4-quadrant metrics card
    const gridX = 720;
    const gridY = 170;
    const gridW = 640;
    const gridH = 500;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.beginPath();
    ctx.roundRect(gridX, gridY, gridW, gridH, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Divider lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.moveTo(gridX, gridY + gridH / 2);
    ctx.lineTo(gridX + gridW, gridY + gridH / 2);
    ctx.moveTo(gridX + gridW / 2, gridY);
    ctx.lineTo(gridX + gridW / 2, gridY + gridH);
    ctx.stroke();

    const drawLandscapeStat = (
      x: number,
      y: number,
      label: string,
      value: string,
      highlight = false,
      desc = ''
    ) => {
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = 'bold 16px "SF Mono", monospace, sans-serif';
      ctx.fillText(label.toUpperCase(), x, y);

      ctx.fillStyle = highlight ? '#ef4444' : '#ffffff';
      ctx.font = 'bold 68px "Satoshi", sans-serif, -apple-system';
      ctx.fillText(value, x, y + 80);

      if (highlight) {
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(x + ctx.measureText(value).width + 20, y + 54, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      if (desc) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '15px sans-serif';
        ctx.fillText(desc, x, y + 130);
      }
    };

    drawLandscapeStat(gridX + 45, gridY + 60, 'Commits', data.commits, true, 'Verified code contributions');
    drawLandscapeStat(gridX + gridW / 2 + 45, gridY + 60, 'Projects', data.projects, false, 'Public Git repositories');
    drawLandscapeStat(gridX + 45, gridY + gridH / 2 + 60, 'Since', data.since, false, 'Continuous journey');
    drawLandscapeStat(gridX + gridW / 2 + 45, gridY + gridH / 2 + 60, 'Technologies', data.technologies, false, 'Languages & frameworks');

    // Right barcode banner
    const fullBarX = 720;
    const fullBarY = 720;
    const fullBarW = 640;
    let rx = fullBarX;
    while (rx < fullBarX + fullBarW) {
      const w = 2 + Math.floor(bRand() * 6);
      const gap = 2 + Math.floor(bRand() * 5);
      ctx.fillStyle = bRand() > 0.88 ? '#ef4444' : 'rgba(255, 255, 255, 0.85)';
      ctx.fillRect(rx, fullBarY, w, 60);
      rx += w + gap;
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = 'bold 15px "SF Mono", monospace, sans-serif';
    ctx.fillText('★ HARDWARE VERIFIED • TOUCH OR DRAG TO ROTATE ★', gridX + gridW / 2, 825);

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 16px "SF Mono", monospace, sans-serif';
    ctx.fillText('CLICK TO FLIP REVERSE SIDE ➔', gridX + gridW / 2, 870);

  } else {
    // ==========================================
    // PORTRAIT LAYOUT (Fallback)
    // ==========================================
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 16px "SF Mono", monospace, sans-serif';
    ctx.fillText('IDENTITY PASS // SEC-01', 50, 150);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '14px sans-serif';
    ctx.fillText('VSSUT CSE • DEVELOPER ACCESS', 50, 175);

    const avatarSize = 180;
    const avatarX = 400;
    const avatarY = 320;

    ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarSize / 2 + 10, 0, Math.PI * 2);
    ctx.stroke();

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
  }

  return canvas.toDataURL('image/png');
};

export const generateBackBadge = (data: BadgeData): string => {
  const isLandscape = data.orientation !== 'portrait';
  const canvas = document.createElement('canvas');
  canvas.width = isLandscape ? 1440 : 800;
  canvas.height = isLandscape ? 1024 : 1125;
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
  const cOff = 35;
  const cLen = 45;
  ctx.beginPath();
  ctx.moveTo(cOff, cOff + cLen); ctx.lineTo(cOff, cOff); ctx.lineTo(cOff + cLen, cOff);
  ctx.moveTo(W - cOff - cLen, cOff); ctx.lineTo(W - cOff, cOff); ctx.lineTo(W - cOff, cOff + cLen);
  ctx.moveTo(cOff, H - cOff - cLen); ctx.lineTo(cOff, H - cOff); ctx.lineTo(cOff + cLen, H - cOff);
  ctx.moveTo(W - cOff - cLen, H - cOff); ctx.lineTo(W - cOff, H - cOff); ctx.lineTo(W - cOff, H - cOff - cLen);
  ctx.stroke();

  if (isLandscape) {
    // ==========================================
    // LANDSCAPE BACK LAYOUT (1440 x 1024)
    // Avoid clamp area (X: 580 to 860, Y: 0 to 160)
    // ==========================================

    // --- LEFT COLUMN: QR Code (X: 80 to 580) ---
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 18px "SF Mono", monospace, sans-serif';
    ctx.fillText('REPOSITORY ACCESS POINT', 100, 95);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px "Satoshi", sans-serif';
    ctx.fillText('github.com/' + (data.githubUsername || 'RohitKSahoo'), 100, 140);

    // QR Code Container
    const qrSize = 380;
    const qrX = 100;
    const qrY = 180;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(qrX, qrY, qrSize, qrSize, 20);
    ctx.fill();

    // Procedural QR Matrix
    const cells = 21;
    const cellSize = (qrSize - 40) / cells;
    const startX = qrX + 20;
    const startY = qrY + 20;

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

    // QR Labels
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Satoshi", sans-serif';
    ctx.fillText('SCAN FOR SOURCE CODE & PROJECTS', 100, 610);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '15px "SF Mono", monospace, sans-serif';
    ctx.fillText('DIRECT MOBILE GITHUB MIRROR', 100, 645);

    // University credentials block on left
    ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.beginPath();
    ctx.roundRect(100, 690, 480, 180, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 15px "SF Mono", monospace, sans-serif';
    ctx.fillText('// ACADEMIC INSTITUTION //', 130, 735);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('Veer Surendra Sai Univ. of Technology', 130, 770);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '16px sans-serif';
    ctx.fillText('Burla, Sambalpur, Odisha • PIN: 768018', 130, 805);
    ctx.fillText('Department of Computer Science & Eng.', 130, 835);

    // --- RIGHT COLUMN: Tech Stack & System Specs (X: 660 to 1360) ---
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 18px "SF Mono", monospace, sans-serif';
    ctx.fillText('CORE TECHNICAL ARCHITECTURE', 680, 95);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Satoshi", sans-serif';
    ctx.fillText('SKILLS & DEVELOPMENT ECOSYSTEM', 680, 145);

    // Tech stack pills
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
      'Linux & CLI Tools'
    ];

    const pillXStart = 680;
    const pillYStart = 200;
    const pillH = 50;
    let currX = pillXStart;
    let currRow = 0;

    allSkills.forEach(skill => {
      ctx.font = 'bold 18px "Satoshi", sans-serif';
      const textW = ctx.measureText(skill).width;
      const pillW = textW + 40;

      if (currX + pillW > 1360) {
        currRow++;
        currX = pillXStart;
      }

      const py = pillYStart + currRow * 65;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath();
      ctx.roundRect(currX, py, pillW, pillH, 25);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Red dot inside pill
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(currX + 20, py + pillH / 2, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(skill, currX + 32, py + 32);

      currX += pillW + 16;
    });

    // Experience timeline summary box
    const sumBoxX = 680;
    const sumBoxY = 560;
    const sumBoxW = 680;
    const sumBoxH = 260;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.beginPath();
    ctx.roundRect(sumBoxX, sumBoxY, sumBoxW, sumBoxH, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 15px "SF Mono", monospace, sans-serif';
    ctx.fillText('// RECENT FOCUS & INITIATIVES //', sumBoxX + 30, sumBoxY + 40);

    const highlights = [
      '• Android Native Development with low-latency Audio & Edge AI',
      '• Modern Web Dashboards with WebGL / Three.js Shaders',
      '• Automation CLI tools & intelligent Git workflows',
      '• Real-time geofencing, WebSockets & peer-to-peer streaming'
    ];

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '17px sans-serif';
    highlights.forEach((hl, i) => {
      ctx.fillText(hl, sumBoxX + 30, sumBoxY + 85 + i * 36);
    });

    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '14px "SF Mono", monospace, sans-serif';
    ctx.fillText('AUTHENTICATED WITH GITHUB REST API • ALL RIGHTS RESERVED', W / 2, 940);
  }

  return canvas.toDataURL('image/png');
};

export const generateStrapImage = (): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 192;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Deep crimson red ribbon
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, 0, 192, 768);

  // Darker border edging
  ctx.fillStyle = '#991b1b';
  ctx.fillRect(0, 0, 12, 768);
  ctx.fillRect(180, 0, 12, 768);

  // White stitched dashes
  ctx.fillStyle = '#ffffff';
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
